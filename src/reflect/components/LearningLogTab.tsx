// 배움 기록 탭.
// "AI와 함께 알게 된 것"과 "그에 대한 내 생각"을 분리해서 적는다. (하크니스 핵심)

import { useState } from 'react'
import { useCollection } from '../useCollection'
import { newId } from '../storage'
import { formatDateTime } from '../format'
import type { LearningEntry } from '../types'

export function LearningLogTab() {
  const { items, add, remove } = useCollection<LearningEntry>('learning')
  const [topic, setTopic] = useState('')
  const [learned, setLearned] = useState('')
  const [myThought, setMyThought] = useState('')

  // 내용과 내 생각이 모두 있어야 "분리 기록"이 완성된다.
  const canSave = learned.trim().length > 0 && myThought.trim().length > 0

  const handleSave = (): void => {
    if (!canSave) return
    add({
      id: newId(),
      createdAt: new Date().toISOString(),
      topic: topic.trim(),
      learned: learned.trim(),
      myThought: myThought.trim(),
    })
    setTopic('')
    setLearned('')
    setMyThought('')
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm leading-relaxed text-slate-600">
        AI와 대화하며 <b className="text-slate-900">알게 된 것</b>과, 그에 대한{' '}
        <b className="text-teal-700">내 생각</b>을 나눠서 적어보세요. 받아들인 정보와 내 판단을
        구분하는 연습이 생각하는 힘을 키웁니다.
      </p>

      {/* 입력 폼 */}
      <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <Field label="주제 (선택)">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="예: 기후변화, 진로 고민, 수학 문제…"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </Field>

        <Field label="AI와 함께 알게 된 것" required>
          <textarea
            value={learned}
            onChange={(e) => setLearned(e.target.value)}
            rows={3}
            placeholder="AI가 알려준 내용, 새로 배운 사실이나 관점을 적어보세요."
            className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </Field>

        <Field label="그에 대한 내 생각 · 판단" required accent>
          <textarea
            value={myThought}
            onChange={(e) => setMyThought(e.target.value)}
            rows={3}
            placeholder="그 내용에 동의하나요? 의심스러운 점은? 나라면 어떻게 생각할까요?"
            className="w-full resize-y rounded-lg border border-teal-200 bg-teal-50/40 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </Field>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            기록 저장
          </button>
        </div>
      </section>

      {/* 기록 목록 */}
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-slate-500">
          내 배움 기록 {items.length > 0 && `(${items.length})`}
        </h3>
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 py-10 text-center text-sm text-slate-400">
            아직 기록이 없어요. 첫 배움을 남겨보세요.
          </p>
        ) : (
          items.map((entry) => (
            <article
              key={entry.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {entry.topic && (
                    <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      {entry.topic}
                    </span>
                  )}
                  <p className="mt-1 text-xs text-slate-400">{formatDateTime(entry.createdAt)}</p>
                </div>
                <DeleteButton onClick={() => remove(entry.id)} />
              </div>

              <dl className="mt-3 flex flex-col gap-3">
                <div>
                  <dt className="text-xs font-semibold text-slate-500">알게 된 것</dt>
                  <dd className="mt-0.5 whitespace-pre-wrap text-sm text-slate-800">
                    {entry.learned}
                  </dd>
                </div>
                <div className="rounded-lg border-l-4 border-teal-400 bg-teal-50/60 py-2 pl-3">
                  <dt className="text-xs font-semibold text-teal-700">내 생각</dt>
                  <dd className="mt-0.5 whitespace-pre-wrap text-sm text-slate-800">
                    {entry.myThought}
                  </dd>
                </div>
              </dl>
            </article>
          ))
        )}
      </section>
    </div>
  )
}

interface FieldProps {
  label: string
  required?: boolean
  accent?: boolean
  children: React.ReactNode
}

function Field({ label, required, accent, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={`text-sm font-semibold ${accent ? 'text-teal-700' : 'text-slate-700'}`}>
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      {children}
    </label>
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
