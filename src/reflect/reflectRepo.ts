// 성찰 공간 저장소 추상화.
// 로그인 + Firebase 설정 시 Firestore(클라우드), 그 외엔 localStorage(이 기기)로 자동 전환한다.

import { isFirebaseConfigured } from '../lib/firebase'
import { addItem, loadCollection, removeItem } from './storage'
import { createFirestoreRepo } from './firestoreRepo'
import type { ReflectCollection } from './types'

export type RepoMode = 'cloud' | 'local'

export interface ReflectRepo {
  /** 현재 저장 위치 */
  mode: RepoMode
  list<T extends { id: string }>(name: ReflectCollection): Promise<T[]>
  add<T extends { id: string }>(name: ReflectCollection, item: T): Promise<void>
  remove(name: ReflectCollection, id: string): Promise<void>
}

/** localStorage 기반 저장소 (로그인 불필요) */
const localRepo: ReflectRepo = {
  mode: 'local',
  async list<T extends { id: string }>(name: ReflectCollection): Promise<T[]> {
    return loadCollection<T>(name)
  },
  async add<T extends { id: string }>(name: ReflectCollection, item: T): Promise<void> {
    addItem<T>(name, item)
  },
  async remove(name: ReflectCollection, id: string): Promise<void> {
    removeItem(name, id)
  },
}

/**
 * 현재 상황에 맞는 저장소를 반환한다.
 * @param uid 로그인한 사용자 uid (미로그인 시 null)
 */
export function createRepo(uid: string | null): ReflectRepo {
  if (isFirebaseConfigured && uid) return createFirestoreRepo(uid)
  return localRepo
}
