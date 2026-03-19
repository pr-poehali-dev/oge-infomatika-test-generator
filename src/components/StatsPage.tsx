import { TestResult, Page } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface Props {
  results: TestResult[];
  navigate: (page: Page) => void;
}

function getGradeColor(grade: string): string {
  const map: Record<string, string> = {
    "5": "var(--accent-green)",
    "4": "var(--accent-blue)",
    "3": "var(--accent-orange)",
    "2": "var(--accent-red)",
  };
  return map[grade] ?? "var(--accent-blue)";
}

export default function StatsPage({ results, navigate }: Props) {
  if (results.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Статистика</h1>
          <p className="text-[var(--text-secondary)]">История ваших результатов</p>
        </div>

        <div className="bg-white border border-[var(--border-light)] rounded-2xl p-12 text-center shadow-sm">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Нет результатов</h2>
          <p className="text-[var(--text-secondary)] mb-6 max-w-sm mx-auto">
            Пройдите первый тест — и здесь появится история ваших результатов и оценок
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => navigate("random-test")}
              className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium"
            >
              <Icon name="Shuffle" size={16} />
              Пройти вариант
            </button>
            <button
              onClick={() => navigate("task-select")}
              className="btn-secondary flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium"
            >
              <Icon name="Target" size={16} />
              Выбрать задание
            </button>
          </div>
        </div>
      </div>
    );
  }

  const avgPct = Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length);
  const bestPct = Math.max(...results.map((r) => r.percentage));
  const avgGrade = results.length > 0
    ? (results.reduce((s, r) => s + Number(r.grade), 0) / results.length).toFixed(1)
    : "—";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Статистика</h1>
        <p className="text-[var(--text-secondary)]">Всего попыток: {results.length}</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Средний балл", value: `${avgPct}%`, icon: "TrendingUp", color: "var(--accent-blue)" },
          { label: "Лучший результат", value: `${bestPct}%`, icon: "Trophy", color: "var(--accent-green)" },
          { label: "Средняя оценка", value: avgGrade, icon: "Star", color: "var(--accent-orange)" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[var(--border-light)] rounded-2xl p-4 text-center shadow-sm">
            <Icon name={s.icon} size={20} style={{ color: s.color }} className="mx-auto mb-2" />
            <div className="text-xl font-bold text-[var(--text-primary)]">{s.value}</div>
            <div className="text-xs text-[var(--text-secondary)] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Results list */}
      <h2 className="font-bold text-[var(--text-primary)] mb-4">История</h2>
      <div className="space-y-3">
        {results.map((r, idx) => (
          <div
            key={idx}
            className="bg-white border border-[var(--border-light)] rounded-xl p-4 shadow-sm flex items-center gap-4"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ backgroundColor: getGradeColor(r.grade) }}
            >
              {r.grade}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[var(--text-primary)] truncate">{r.mode}</p>
              <p className="text-sm text-[var(--text-secondary)]">{r.date}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-bold" style={{ color: getGradeColor(r.grade) }}>{r.percentage}%</p>
              <p className="text-xs text-[var(--text-secondary)]">{r.score}/{r.total}</p>
            </div>
            <div className="w-16">
              <div className="w-full bg-[var(--bg-card)] rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${r.percentage}%`, backgroundColor: getGradeColor(r.grade) }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-3 flex-wrap">
        <button
          onClick={() => navigate("random-test")}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium"
        >
          <Icon name="Shuffle" size={16} />
          Новый вариант
        </button>
        <button
          onClick={() => navigate("task-select")}
          className="btn-secondary flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium"
        >
          <Icon name="Target" size={16} />
          Выбрать задание
        </button>
      </div>
    </div>
  );
}
