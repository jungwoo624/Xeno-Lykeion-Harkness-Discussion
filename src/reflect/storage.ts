// 성찰 공간 데이터 저장소 (localStorage 구현).
// 저장소 패턴: 컬렉션 단위로 list/add/remove를 제공한다.
// 나중에 Firestore 등으로 교체하려면 이 파일의 구현만 바꾸면 된다.

import type { ReflectCollection } from './types'

const PREFIX = 'xeno.reflect.v1.'

/** 브라우저 localStorage 사용 가능 여부 (SSR·프라이빗 모드 대비) */
function getStore(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    return window.localStorage
  } catch {
    return null
  }
}

/** 컬렉션 전체를 읽어온다. 실패 시 빈 배열. */
export function loadCollection<T>(name: ReflectCollection): T[] {
  const store = getStore()
  if (!store) return []
  try {
    const raw = store.getItem(PREFIX + name)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch (err) {
    console.error(`[reflect] "${name}" 로드 실패:`, err)
    return []
  }
}

/** 컬렉션 전체를 저장한다. 성공 여부 반환. */
function saveCollection<T>(name: ReflectCollection, items: T[]): boolean {
  const store = getStore()
  if (!store) return false
  try {
    store.setItem(PREFIX + name, JSON.stringify(items))
    return true
  } catch (err) {
    console.error(`[reflect] "${name}" 저장 실패:`, err)
    return false
  }
}

/** 새 항목을 맨 앞에 추가하고 저장한다. 갱신된 목록을 반환(불변). */
export function addItem<T>(name: ReflectCollection, item: T): T[] {
  const next = [item, ...loadCollection<T>(name)]
  saveCollection(name, next)
  return next
}

/** id로 항목을 삭제하고 저장한다. 갱신된 목록을 반환(불변). */
export function removeItem<T extends { id: string }>(
  name: ReflectCollection,
  id: string,
): T[] {
  const next = loadCollection<T>(name).filter((it) => it.id !== id)
  saveCollection(name, next)
  return next
}

/** 고유 id 생성 (crypto.randomUUID 우선, 미지원 시 폴백) */
export function newId(): string {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  } catch {
    // 폴백으로 진행
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}
