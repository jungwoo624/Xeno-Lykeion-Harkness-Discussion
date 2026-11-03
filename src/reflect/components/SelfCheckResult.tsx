// 자가진단 결과 뷰. 총점 밴드 + 하위척도별 막대·밴드·성찰 피드백을 보여준다.

import { subscaleFeedback } from '../scale'
import { bandColorClass, bandLabel, type ScoringResult } from '../scoring'

interface SelfCheckResultProps {
  result: ScoringResult
  /** 상단 요약 문구 표시 여부 (기록 열람 시에는 생략 가능) */
  showHeadline?: boolean
}

/** 평균(1~5)을 0~100% 막대 너비로 변환 */
function toPercent(mean: number): number {
  return Math.round(((mean - 1) / 4) * 100)
}

export function SelfCheckResult({ result, showHeadline = true }: SelfCheckResultProps) {
  return (
    <div className="flex flex-col gap-5">
      {showHeadline && (
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-teal-50 to-white p-5 shadow-sm">
          <p className="text-sm font-medium text-teal-700">자가진단 완료</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            아래는 네 가지 영역에서 지금의 내 태도를 비춰본 결과예요. 높고 낮음은 좋고 나쁨이
            아니라, 스스로를 돌아보는 거울입니다.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {result.subscales.map((s) => (
          <div
            key={s.subscaleId}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-bold text-slate-900">{s.subscaleLabel}</h4>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${bandColorClass(s.band)}`}
              >
                {bandLabel(s.band)} · {s.mean.toFixed(1)}
              </span>
            </div>

            {/* 막대 */}
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-teal-500 transition-all"
                style={{ width: `${toPercent(s.mean)}%` }}
              />
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {subscaleFeedback(s.subscaleId, s.band)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
