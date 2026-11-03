// 성찰 공간 컬렉션 상태 훅.
// 로그인 상태에 따라 저장소(클라우드/로컬)를 고르고, add/remove는 낙관적으로 갱신한다.

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { createRepo, type RepoMode } from './reflectRepo'
import type { ReflectCollection } from './types'

interface UseCollectionResult<T> {
  items: T[]
  /** 최초/전환 로딩 중 여부 */
  loading: boolean
  /** 현재 저장 위치 (cloud = 계정 동기화, local = 이 기기) */
  mode: RepoMode
  add: (item: T) => void
  remove: (id: string) => void
}

export function useCollection<T extends { id: string }>(
  name: ReflectCollection,
): UseCollectionResult<T> {
  const { user, authLoading } = useAuth()
  const uid = user?.uid ?? null

  // uid가 바뀌면(로그인/로그아웃) 저장소도 바뀐다.
  const repo = useMemo(() => createRepo(uid), [uid])
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  // 저장소에서 목록을 다시 읽는다.
  const reload = useCallback(() => {
    repo
      .list<T>(name)
      .then(setItems)
      .catch((err) => {
        console.error(`[reflect] "${name}" 목록 로드 실패:`, err)
      })
  }, [repo, name])

  // 인증 확인이 끝난 뒤, 저장소/컬렉션이 바뀔 때마다 로드.
  useEffect(() => {
    if (authLoading) return
    let cancelled = false
    setLoading(true)
    repo
      .list<T>(name)
      .then((data) => {
        if (!cancelled) setItems(data)
      })
      .catch((err) => {
        console.error(`[reflect] "${name}" 목록 로드 실패:`, err)
        if (!cancelled) setItems([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [repo, name, authLoading])

  const add = useCallback(
    (item: T) => {
      setItems((prev) => [item, ...prev]) // 낙관적 추가
      repo.add(name, item).catch((err) => {
        console.error(`[reflect] "${name}" 저장 실패:`, err)
        reload() // 실패 시 서버 상태로 되돌림
      })
    },
    [repo, name, reload],
  )

  const remove = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((x) => x.id !== id)) // 낙관적 삭제
      repo.remove(name, id).catch((err) => {
        console.error(`[reflect] "${name}" 삭제 실패:`, err)
        reload()
      })
    },
    [repo, name, reload],
  )

  return { items, loading, mode: repo.mode, add, remove }
}
