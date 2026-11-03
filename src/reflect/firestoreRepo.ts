// 성찰 공간 Firestore 저장소.
// 사용자별 하위 컬렉션 users/{uid}/reflect* 에 기록을 저장한다.
// createdAt(ISO 문자열) 단일 필드 정렬만 사용하므로 복합 색인이 필요 없다.

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { ReflectRepo } from './reflectRepo'
import type { ReflectCollection } from './types'

/** 컬렉션 종류 → Firestore 하위 컬렉션 이름 */
const SUBPATH: Record<ReflectCollection, string> = {
  learning: 'reflectLearning',
  emotion: 'reflectEmotion',
  selfcheck: 'reflectSelfcheck',
}

/** 특정 사용자(uid)의 Firestore 기반 저장소를 만든다. */
export function createFirestoreRepo(uid: string): ReflectRepo {
  return {
    mode: 'cloud',

    async list<T extends { id: string }>(name: ReflectCollection): Promise<T[]> {
      if (!db) return []
      const col = collection(db, 'users', uid, SUBPATH[name])
      const snap = await getDocs(query(col, orderBy('createdAt', 'desc')))
      return snap.docs.map((d) => d.data() as T)
    },

    async add<T extends { id: string }>(name: ReflectCollection, item: T): Promise<void> {
      if (!db) throw new Error('Firestore가 설정되지 않았습니다.')
      // 문서 id = 기록 id (중복 방지 + 삭제 용이)
      await setDoc(doc(db, 'users', uid, SUBPATH[name], item.id), item)
    },

    async remove(name: ReflectCollection, id: string): Promise<void> {
      if (!db) throw new Error('Firestore가 설정되지 않았습니다.')
      await deleteDoc(doc(db, 'users', uid, SUBPATH[name], id))
    },
  }
}
