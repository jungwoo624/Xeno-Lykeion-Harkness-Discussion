// 성찰 공간 컬렉션을 다루는 상태 훅.
// localStorage 저장소를 감싸 add/remove 시 상태를 불변 갱신한다.

import { useCallback, useState } from 'react'
import { addItem, loadCollection, removeItem } from './storage'
import type { ReflectCollection } from './types'

interface UseCollectionResult<T> {
  items: T[]
  add: (item: T) => void
  remove: (id: string) => void
}

/** 지정한 컬렉션을 읽고, 추가·삭제를 제공하는 훅 */
export function useCollection<T extends { id: string }>(
  name: ReflectCollection,
): UseCollectionResult<T> {
  // 최초 렌더에서 한 번만 localStorage를 읽는다.
  const [items, setItems] = useState<T[]>(() => loadCollection<T>(name))

  const add = useCallback(
    (item: T) => {
      setItems(addItem<T>(name, item))
    },
    [name],
  )

  const remove = useCallback(
    (id: string) => {
      setItems(removeItem<T>(name, id))
    },
    [name],
  )

  return { items, add, remove }
}
