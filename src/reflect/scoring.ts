// I-AIPIS(통합 AI 심리영향 척도) 채점 로직.
// my-app/lib/iaipis/scoring.ts 구조를 harkness-app(라이트 테마)으로 이식하고
// 청소년 성찰용 밴드 피드백을 추가했다.

export type LikertValue = 1 | 2 | 3 | 4 | 5

export interface Subscale {
  id: string
  label: string
  description: string
}

export interface ScaleItem {
  id: string
  subscaleId: string
  text: string
  /** 역채점 문항 여부 */
  reverse?: boolean
}

export interface ScaleDefinition {
  code: string
  title: string
  description: string
  likertLabels: Record<LikertValue, string>
  subscales: Subscale[]
  items: ScaleItem[]
}

/** 문항 id → 응답값(1~5) */
export type Answers = Record<string, LikertValue>

export type ScoreBand = 'low' | 'moderate' | 'high'

export interface SubscaleScore {
  subscaleId: string
  subscaleLabel: string
  mean: number
  sum: number
  itemCount: number
  band: ScoreBand
}

export interface ScoringResult {
  totalMean: number
  totalSum: number
  totalItemCount: number
  totalBand: ScoreBand
  subscales: SubscaleScore[]
}

const LIKERT_MIN: LikertValue = 1
const LIKERT_MAX: LikertValue = 5

function reverseScore(value: LikertValue): LikertValue {
  return (LIKERT_MAX + LIKERT_MIN - value) as LikertValue
}

function classifyBand(mean: number): ScoreBand {
  if (mean < 2.5) return 'low'
  if (mean < 3.5) return 'moderate'
  return 'high'
}

/** 응답을 하위척도별로 집계해 평균·밴드를 계산한다. */
export function scoreAnswers(scale: ScaleDefinition, answers: Answers): ScoringResult {
  const itemsBySubscale = new Map<string, ScaleItem[]>()
  for (const item of scale.items) {
    const list = itemsBySubscale.get(item.subscaleId) ?? []
    list.push(item)
    itemsBySubscale.set(item.subscaleId, list)
  }

  const subscales: SubscaleScore[] = scale.subscales.map((sub) => {
    const items = itemsBySubscale.get(sub.id) ?? []
    let sum = 0
    let count = 0

    for (const item of items) {
      const raw = answers[item.id]
      if (raw === undefined) continue
      const value = item.reverse ? reverseScore(raw) : raw
      sum += value
      count += 1
    }

    const mean = count > 0 ? sum / count : 0
    return {
      subscaleId: sub.id,
      subscaleLabel: sub.label,
      sum,
      itemCount: count,
      mean: Number(mean.toFixed(2)),
      band: classifyBand(mean),
    }
  })

  const totalSum = subscales.reduce((acc, s) => acc + s.sum, 0)
  const totalItemCount = subscales.reduce((acc, s) => acc + s.itemCount, 0)
  const totalMean = totalItemCount > 0 ? totalSum / totalItemCount : 0

  return {
    totalSum,
    totalItemCount,
    totalMean: Number(totalMean.toFixed(2)),
    totalBand: classifyBand(totalMean),
    subscales,
  }
}

export function bandLabel(band: ScoreBand): string {
  switch (band) {
    case 'low':
      return '낮음'
    case 'moderate':
      return '보통'
    case 'high':
      return '높음'
  }
}

/** 밴드별 배지 색상 (라이트 테마) */
export function bandColorClass(band: ScoreBand): string {
  switch (band) {
    case 'low':
      return 'text-emerald-700 bg-emerald-50 border-emerald-200'
    case 'moderate':
      return 'text-amber-700 bg-amber-50 border-amber-200'
    case 'high':
      return 'text-rose-700 bg-rose-50 border-rose-200'
  }
}
