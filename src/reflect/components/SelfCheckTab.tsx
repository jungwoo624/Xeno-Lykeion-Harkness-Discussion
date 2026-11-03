// AI 인식 자가진단 탭.
// I-AIPIS 기반 문항에 Likert(1~5)로 응답 → 채점·저장 → 결과·추이 표시.

import { useMemo, useState } from 'react'
import { useCollection } from '../useCollection'
import { newId } from '../storage'
import { formatDateTime } from '../format'
import { AI_AWARENESS_SCALE } from '../scale'
import { scoreAnswers, bandLabel, bandColorClass, type Answers, type LikertValue } from '../scoring'
import type { SelfCheckRecord } from '../types'
import { SelfCheckResult } from './SelfCheckResult'

const SCALE = AI_AWARENESS_SCALE
const LIKERT_VALUES: LikertValue[] = [1, 2, 3, 4, 5]

type Mode = 'form' | 'result'

export function SelfCheckTab() {
  const { items, add, remove } = useCollection<SelfCheckRecord>('selfcheck')
  const [mode, setMode] = useState<Mode>('form')
  const [answers, setAnswers] = useState<Answers>({})
  const [justSaved, setJustSaved] = useState<SelfCheckRecord | null>(null)

  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === SCALE.items.length

  const setAnswer = (itemId: string, value: LikertValue): void => {
    setAnswers((prev) => ({ ...prev, [itemId]: value }))
  }

  const handleSubmit = (): void => {
    if (!allAnswered) return
    const record: SelfCheckRecord = {
      id: newId(),
      createdAt: new Date().toISOString(),
      answers,
      result: scoreAnswers(SCALE, answers),
    }
    add(record)
    setJustSaved(record)
    setMode('result')
  }

  const handleRetake = (): void => {
    setAnswers({})
    setJustSaved(null)
    setMode('form')
  }

  if (mode === 'result' && justSaved) {
    return (
      <div className="flex flex-col gap-6">
        <SelfCheckResult result={justSaved.result} />
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleRetake}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-gray-400"
          >
            다시 진단하기
          </button>
        </div>
        <HistorySection items={items} onRemove={remove} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm leading-relaxed text-slate-600">
        {SCALE.description}
      </p>

      {/* 진행률 */}
      <div className="sticky top-16 z-10 rounded-xl border border-gray-200 bg-white/90 px-4 py-2.5 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          <span>
            {answeredCount} / {SCALE.items.length} 문항
          </span>
          <span>{Math.round((answeredCount / SCALE.items.length) * 100)}%</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-teal-500 transition-all"
            style={{ width: `${(answeredCount / SCALE.items.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 하위척도별 문항 */}
      {SCALE.subscales.map((sub) => (
        <section key={sub.id} className="flex flex-col gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">{sub.label}</h3>
            <p className="text-xs text-slate-500">{sub.description}</p>
          </div>
          {SCALE.items
            .filter((it) => it.subscaleId === sub.id)
            .map((item) => (
              <fieldset
                key={item.id}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <legend className="sr-only">{item.text}</legend>
                <p className="text-sm font-medium text-slate-800">{item.text}</p>
                <div className="mt-3 grid grid-cols-5 gap-1.5">
                  {LIKERT_VALUES.map((v) => {
                    const active = answers[item.id] === v
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setAnswer(item.id, v)}
                        aria-pressed={active}
                        className={`flex flex-col items-center gap-1 rounded-lg border px-1 py-2 text-center transition-all ${
                          active
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-gray-200 text-slate-500 hover:border-teal-200 hover:bg-teal-50/40'
                        }`}
                      >
                        <span className="text-sm font-bold">{v}</span>
                        <span className="text-[10px] leading-tight">{SCALE.likertLabels[v]}</span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            ))}
        </section>
      ))}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!allAnswered}
        className="sticky bottom-4 rounded-lg bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-teal-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
      >
        {allAnswered ? '결과 보기' : `${SCALE.items.length - answeredCount}문항 더 응답해주세요`}
      </button>

      {items.length > 0 && <HistorySection items={items} onRemove={remove} />}
    </div>
  )
}

interface HistorySectionProps {
  items: SelfCheckRecord[]
  onRemove: (id: string) => void
}

function HistorySection({ items, onRemove }: HistorySectionProps) {
  const sorted = useMemo(
    () =>
      [...items].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [items],
  )

  if (sorted.length === 0) return null

  return (
    <section className="flex flex-col gap-3 border-t border-gray-200 pt-6">
      <h3 className="text-sm font-semibold text-slate-500">지난 진단 기록 ({sorted.length})</h3>
      {sorted.map((rec) => (
        <article
          key={rec.id}
          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${bandColorClass(rec.result.totalBand)}`}
              >
                종합 {bandLabel(rec.result.totalBand)} · {rec.result.totalMean.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">{formatDateTime(rec.createdAt)}</span>
            </div>
            <button
              type="button"
              onClick={() => onRemove(rec.id)}
              className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              삭제
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {rec.result.subscales.map((s) => (
              <span
                key={s.subscaleId}
                className="rounded-md bg-slate-50 px-2 py-0.5 text-xs text-slate-600"
              >
                {s.subscaleLabel} {s.mean.toFixed(1)}
              </span>
            ))}
          </div>
        </article>
      ))}
    </section>
  )
}
