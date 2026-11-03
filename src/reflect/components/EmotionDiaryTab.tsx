// 감정 일기 탭.
// AI와 소통하며 느낀 감정을 "내용"과 분리해서 선택·기록한다.

import { useState } from 'react'
import { useCollection } from '../useCollection'
import { newId } from '../storage'
import { formatDateTime } from '../format'
import {
  EMOTIONS,
  TONE_LABEL,
  emotionToneClass,
  getEmotion,
  type EmotionTone,
} from '../emotions'
import type { EmotionEntry } from '../types'

const TONE_ORDER: EmotionTone[] = ['positive', 'mixed', 'tough']
const INTENSITY_LABELS = ['', '아주 약함', '약함', '보통', '강함', '아주 강함']

export function EmotionDiaryTab() {
  const { items, add, remove } = useCollection<EmotionEntry>('emotion')
  const [selected, setSelected] = useState<string[]>([])
  const [intensity, setIntensity] = useState(3)
  const [situation, setSituation] = useState('')
  const [note, setNote] = useState('')

  const canSave = selected.length > 0

  const toggleEmotion = (id: string): void => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const handleSave = (): void => {
    if (!canSave) return
    add({
      id: newId(),
      createdAt: new Date().toISOString(),
      emotionIds: selected,
      intensity,
      situation: situation.trim(),
      note: note.trim(),
    })
    setSelected([])
    setIntensity(3)
    setSituation('')
    setNote('')
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm leading-relaxed text-slate-600">
        AI와 이야기하며 느낀 <b className="text-slate-900">감정</b>을 골라보세요. 무엇을 배웠는지와
        별개로, 내 마음이 어땠는지 따로 들여다보는 시간입니다.
      </p>

      {/* 입력 폼 */}
      <section className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-slate-700">
            지금 어떤 감정인가요? <span className="text-rose-500">*</span>
          </span>
          {TONE_ORDER.map((tone) => (
            <div key={tone} className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-slate-400">{TONE_LABEL[tone]}</span>
              <div className="flex flex-wrap gap-2">
                {EMOTIONS.filter((e) => e.tone === tone).map((e) => {
                  const active = selected.includes(e.id)
                  return (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => toggleEmotion(e.id)}
                      aria-pressed={active}
                      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                        active
                          ? `${emotionToneClass(e.tone)} ring-2 ring-offset-1 ring-current`
                          : 'border-gray-200 bg-white text-slate-600 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-1">{e.emoji}</span>
                      {e.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-slate-700">
            감정의 강도: <span className="text-teal-700">{INTENSITY_LABELS[intensity]}</span>
          </span>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full accent-teal-600"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-slate-700">어떤 상황이었나요? (선택)</span>
          <input
            type="text"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="예: AI에게 숙제를 물어봤을 때"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-slate-700">왜 그렇게 느꼈을까요? (선택)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="그 감정의 이유를 떠오르는 대로 적어보세요."
            className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </label>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            감정 기록
          </button>
        </div>
      </section>

      {/* 기록 목록 */}
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-slate-500">
          내 감정 일기 {items.length > 0 && `(${items.length})`}
        </h3>
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 py-10 text-center text-sm text-slate-400">
            아직 기록이 없어요. 지금 느낌을 남겨보세요.
          </p>
        ) : (
          items.map((entry) => (
            <article
              key={entry.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {entry.emotionIds.map((id) => {
                    const e = getEmotion(id)
                    if (!e) return null
                    return (
                      <span
                        key={id}
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${emotionToneClass(e.tone)}`}
                      >
                        {e.emoji} {e.label}
                      </span>
                    )
                  })}
                </div>
                <DeleteButton onClick={() => remove(entry.id)} />
              </div>

              <div className="mt-2 flex items-center gap-2">
                <IntensityDots value={entry.intensity} />
                <span className="text-xs text-slate-400">{formatDateTime(entry.createdAt)}</span>
              </div>

              {entry.situation && (
                <p className="mt-2 text-sm text-slate-700">
                  <span className="font-medium text-slate-500">상황 · </span>
                  {entry.situation}
                </p>
              )}
              {entry.note && (
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{entry.note}</p>
              )}
            </article>
          ))
        )}
      </section>
    </div>
  )
}

function IntensityDots({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5" title={`강도 ${value}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${i < value ? 'bg-teal-500' : 'bg-slate-200'}`}
        />
      ))}
    </span>
  )
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="기록 삭제"
      className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
    >
      삭제
    </button>
  )
}
