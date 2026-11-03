// "나의 AI 성찰" 개인 공간 페이지.
// 하크니스의 핵심(자기 생각을 정리·표현)을 개인 성찰로 옮긴 세 가지 공간을 탭으로 제공한다.
// 로그인 없이 누구나 사용하며, 기록은 이 브라우저(localStorage)에 저장된다.

import { useState } from 'react'
import { LearningLogTab } from './components/LearningLogTab'
import { EmotionDiaryTab } from './components/EmotionDiaryTab'
import { SelfCheckTab } from './components/SelfCheckTab'

type TabId = 'learning' | 'emotion' | 'selfcheck'

const TABS: { id: TabId; label: string; icon: string; desc: string }[] = [
  { id: 'learning', label: '배움 기록', icon: '📝', desc: 'AI와 알게 된 것 + 내 생각' },
  { id: 'emotion', label: '감정 일기', icon: '💗', desc: '느낀 감정을 분리해 기록' },
  { id: 'selfcheck', label: 'AI 인식 자가진단', icon: '🧭', desc: '내 태도 돌아보기' },
]

export function ReflectionPage() {
  const [tab, setTab] = useState<TabId>('learning')

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* 헤더 */}
      <header className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-teal-600">나의 AI 성찰 공간</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          AI와 나 사이, 생각과 감정을 정리하기
        </h1>
        <p className="text-sm leading-relaxed text-slate-600">
          AI를 쓰며 알게 된 것과 내 생각, 그리고 느낀 감정을 나눠서 기록해보세요. 기록은 이
          기기에만 저장되며 로그인은 필요 없습니다.
        </p>
      </header>

      {/* 탭 */}
      <nav className="mt-6 grid grid-cols-3 gap-2" aria-label="성찰 공간 탭">
        {TABS.map(({ id, label, icon, desc }) => {
          const active = tab === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-current={active}
              className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-center transition-all ${
                active
                  ? 'border-teal-500 bg-teal-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-teal-200'
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span
                className={`text-sm font-semibold ${active ? 'text-teal-700' : 'text-slate-700'}`}
              >
                {label}
              </span>
              <span className="hidden text-[11px] leading-tight text-slate-400 sm:block">
                {desc}
              </span>
            </button>
          )
        })}
      </nav>

      {/* 본문 */}
      <div className="mt-8">
        {tab === 'learning' && <LearningLogTab />}
        {tab === 'emotion' && <EmotionDiaryTab />}
        {tab === 'selfcheck' && <SelfCheckTab />}
      </div>
    </main>
  )
}
