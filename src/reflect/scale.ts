// 청소년용 AI 인식 자가진단 척도.
// my-app의 I-AIPIS 4개 하위척도(신뢰·의존·불안·효능감) 구조를 유지하되,
// 문항을 청소년이 바로 이해할 수 있는 표현으로 다듬었다.
// 주의: `id`는 기존 기록과 매핑이 깨지지 않도록 안정적으로 유지할 것.

import type { ScaleDefinition, ScoreBand } from './scoring'

export const AI_AWARENESS_SCALE: ScaleDefinition = {
  code: 'AI-AWARE-youth_v1',
  title: 'AI 인식 자가진단',
  description:
    'AI를 쓰면서 내가 어떤 태도를 갖고 있는지 스스로 돌아보는 체크입니다. 정답은 없어요. 솔직하게 답할수록 더 도움이 됩니다.',
  likertLabels: {
    1: '전혀 아니다',
    2: '아니다',
    3: '보통이다',
    4: '그렇다',
    5: '매우 그렇다',
  },
  subscales: [
    {
      id: 'trust',
      label: 'AI 신뢰',
      description: 'AI가 준 정보를 얼마나 믿고, 또 비판적으로 따져보는지.',
    },
    {
      id: 'dependence',
      label: 'AI 의존',
      description: '생각하고 결정할 때 AI에 얼마나 기대는지.',
    },
    {
      id: 'anxiety',
      label: 'AI 불안',
      description: 'AI를 쓰거나 마주할 때 느끼는 걱정·부담.',
    },
    {
      id: 'self_efficacy',
      label: 'AI 활용 효능감',
      description: 'AI를 내 목적에 맞게 잘 다루고 판단할 수 있다는 자신감.',
    },
  ],
  items: [
    // ── AI 신뢰
    { id: 't1', subscaleId: 'trust', text: 'AI가 알려준 내용은 대체로 맞다고 믿는다.' },
    { id: 't2', subscaleId: 'trust', text: 'AI가 준 정보는 따로 확인하지 않아도 된다고 생각한다.' },
    { id: 't3', subscaleId: 'trust', text: '중요한 것을 정할 때 AI의 말을 믿고 따른다.' },
    { id: 't4', subscaleId: 'trust', text: 'AI는 사람보다 공정하고 편견이 적다고 생각한다.' },

    // ── AI 의존
    { id: 'd1', subscaleId: 'dependence', text: '과제나 글을 할 때 AI 없이는 시작하기 어렵다.' },
    { id: 'd2', subscaleId: 'dependence', text: '궁금한 게 생기면 친구보다 AI에게 먼저 물어본다.' },
    { id: 'd3', subscaleId: 'dependence', text: 'AI를 못 쓰게 되면 공부나 할 일이 막막해진다.' },
    { id: 'd4', subscaleId: 'dependence', text: '스스로 생각하기보다 AI의 답을 그대로 쓰는 편이다.' },

    // ── AI 불안 (a4는 역채점)
    { id: 'a1', subscaleId: 'anxiety', text: 'AI가 너무 빨리 발전해서 따라가기 벅차다고 느낀다.' },
    { id: 'a2', subscaleId: 'anxiety', text: 'AI가 만든 정보가 진짜인지 가짜인지 헷갈려 스트레스를 받는다.' },
    { id: 'a3', subscaleId: 'anxiety', text: 'AI 때문에 내 개인정보가 샐까 봐 걱정된다.' },
    { id: 'a4', subscaleId: 'anxiety', text: 'AI를 쓸 때 마음이 차분하고 편안하다.', reverse: true },

    // ── AI 활용 효능감
    { id: 's1', subscaleId: 'self_efficacy', text: '새로운 AI 도구가 나와도 금방 익힐 자신이 있다.' },
    { id: 's2', subscaleId: 'self_efficacy', text: '원하는 답을 얻기 위해 AI에게 질문을 잘 다듬을 수 있다.' },
    { id: 's3', subscaleId: 'self_efficacy', text: 'AI가 준 답이 맞는지 스스로 판단할 수 있다.' },
    { id: 's4', subscaleId: 'self_efficacy', text: 'AI를 활용해 나만의 창의적인 결과물을 만들 수 있다.' },
  ],
}

/**
 * 하위척도 × 밴드별 성찰 피드백.
 * 평가가 아니라 "스스로 돌아보게" 하는 질문·제안 톤으로 작성.
 */
const FEEDBACK: Record<string, Record<ScoreBand, string>> = {
  trust: {
    low: 'AI의 답을 꼼꼼히 의심하고 확인하는 편이에요. 건강한 비판 능력이에요. 가끔은 AI를 유용한 출발점으로 믿고 활용해도 좋아요.',
    moderate: 'AI를 적당히 믿으면서도 따져보는 균형을 갖고 있어요. "이 정보의 근거는 뭘까?"를 한 번 더 물어보면 더 단단해져요.',
    high: 'AI를 많이 신뢰하는 편이에요. AI도 틀리거나 편향될 수 있다는 걸 기억하고, 중요한 정보는 다른 출처로 꼭 확인해봐요.',
  },
  dependence: {
    low: 'AI에 기대기보다 스스로 생각하고 결정하는 힘이 강해요. AI는 생각을 넓히는 도구로 곁들여도 좋아요.',
    moderate: 'AI를 도구로 쓰면서도 내 판단을 유지하고 있어요. "이건 내가 먼저 생각해볼까?"를 떠올리는 순간을 늘려봐요.',
    high: 'AI에 꽤 많이 의존하고 있어요. 가끔은 AI 없이 먼저 내 생각을 적어본 뒤 AI와 비교해보면 생각하는 힘이 자라요.',
  },
  anxiety: {
    low: 'AI를 비교적 편안하게 대하고 있어요. 그 여유를 유지하면서 새로운 도구도 즐겁게 탐색해봐요.',
    moderate: 'AI에 대해 약간의 걱정이 있어요. 자연스러운 감정이에요. 무엇이 불안한지 구체적으로 적어보면 다루기 쉬워져요.',
    high: 'AI를 마주할 때 부담이나 걱정이 큰 편이에요. 어떤 점이 가장 불안한지 감정 일기에 적어보고, 믿을 만한 어른과 이야기해봐요.',
  },
  self_efficacy: {
    low: '아직 AI를 다루는 게 어렵게 느껴질 수 있어요. 괜찮아요. 작은 질문부터 연습하면 금방 익숙해져요.',
    moderate: 'AI를 어느 정도 다룰 수 있다고 느껴요. 질문을 다듬거나 결과를 검증하는 연습을 더하면 자신감이 올라가요.',
    high: 'AI를 목적에 맞게 잘 활용하고 판단하는 자신감이 높아요. 그 능력을 친구들을 돕거나 창의적 프로젝트에 써봐요.',
  },
}

/** 하위척도 id와 밴드로 성찰 피드백 문구를 반환한다. */
export function subscaleFeedback(subscaleId: string, band: ScoreBand): string {
  return FEEDBACK[subscaleId]?.[band] ?? ''
}
