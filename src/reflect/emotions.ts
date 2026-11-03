// AI와 소통하며 느낄 수 있는 감정 카탈로그.
// 감정을 "내용"과 분리해서 고르고 기록할 수 있도록 미리 정의한 목록이다.

export type EmotionTone = 'positive' | 'mixed' | 'tough'

export interface Emotion {
  id: string
  label: string
  emoji: string
  tone: EmotionTone
}

export const EMOTIONS: Emotion[] = [
  // 긍정
  { id: 'curious', label: '호기심', emoji: '🤔', tone: 'positive' },
  { id: 'excited', label: '신남', emoji: '✨', tone: 'positive' },
  { id: 'proud', label: '뿌듯함', emoji: '😊', tone: 'positive' },
  { id: 'relieved', label: '편안함', emoji: '😌', tone: 'positive' },
  { id: 'grateful', label: '고마움', emoji: '🙏', tone: 'positive' },
  // 복합
  { id: 'surprised', label: '놀라움', emoji: '😮', tone: 'mixed' },
  { id: 'confused', label: '헷갈림', emoji: '😵‍💫', tone: 'mixed' },
  { id: 'doubtful', label: '의심', emoji: '🧐', tone: 'mixed' },
  { id: 'bored', label: '심심함', emoji: '😐', tone: 'mixed' },
  // 어려움
  { id: 'anxious', label: '불안', emoji: '😟', tone: 'tough' },
  { id: 'frustrated', label: '답답함', emoji: '😤', tone: 'tough' },
  { id: 'pressured', label: '부담', emoji: '😰', tone: 'tough' },
  { id: 'disappointed', label: '실망', emoji: '😞', tone: 'tough' },
  { id: 'lonely', label: '외로움', emoji: '🥲', tone: 'tough' },
]

const BY_ID = new Map(EMOTIONS.map((e) => [e.id, e]))

/** id로 감정 하나를 찾는다 (없으면 undefined) */
export function getEmotion(id: string): Emotion | undefined {
  return BY_ID.get(id)
}

/** 톤별 배지 색상 (라이트 테마) */
export function emotionToneClass(tone: EmotionTone): string {
  switch (tone) {
    case 'positive':
      return 'bg-teal-50 text-teal-700 border-teal-200'
    case 'mixed':
      return 'bg-sky-50 text-sky-700 border-sky-200'
    case 'tough':
      return 'bg-rose-50 text-rose-700 border-rose-200'
  }
}

export const TONE_LABEL: Record<EmotionTone, string> = {
  positive: '긍정',
  mixed: '복합',
  tough: '어려움',
}
