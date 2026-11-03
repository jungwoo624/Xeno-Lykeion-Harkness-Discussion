// "나의 AI 성찰" 개인 공간 도메인 타입.
// 하크니스의 핵심(자기 생각을 정리·표현)을 개인 성찰로 옮긴 3가지 기록을 정의한다.

import type { Answers, ScoringResult } from './scoring'

/** 공통: 모든 기록이 공유하는 필드 */
interface BaseEntry {
  /** 기록 고유 id */
  id: string
  /** 작성 시각 (ISO 8601) */
  createdAt: string
}

/**
 * 배움 기록 한 건.
 * "AI와 함께 알게 된 것"과 "그에 대한 내 생각"을 분리해서 적는다.
 */
export interface LearningEntry extends BaseEntry {
  /** 무엇에 대해 (주제) */
  topic: string
  /** AI와 함께 알게 된 내용 */
  learned: string
  /** 그에 대한 나의 생각·판단 (하크니스 핵심) */
  myThought: string
}

/**
 * 감정 일기 한 건.
 * AI와 소통하며 느낀 감정을 "내용"과 분리해서 기록한다.
 */
export interface EmotionEntry extends BaseEntry {
  /** 선택한 감정 id 목록 (emotions.ts 참조) */
  emotionIds: string[]
  /** 감정 강도 (1=약함 ~ 5=강함) */
  intensity: number
  /** 어떤 상황에서 느꼈는지 */
  situation: string
  /** 왜 그렇게 느꼈는지 (선택) */
  note: string
}

/**
 * AI 인식 자가진단 1회 결과.
 */
export interface SelfCheckRecord extends BaseEntry {
  /** 문항 응답 (문항 id → 1~5) */
  answers: Answers
  /** 채점 결과 스냅샷 */
  result: ScoringResult
}

/** localStorage에 저장되는 성찰 공간 컬렉션 종류 */
export type ReflectCollection = 'learning' | 'emotion' | 'selfcheck'
