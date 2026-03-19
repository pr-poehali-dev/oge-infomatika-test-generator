import { useState } from "react";
import { Question } from "@/data/chemistryData";
import Icon from "@/components/ui/icon";
import { TestResult } from "@/pages/Index";
import { Page } from "@/pages/Index";

interface TestViewProps {
  questions: Question[];
  title: string;
  subtitle: string;
  navigate: (page: Page) => void;
  addResult: (result: TestResult) => void;
  onBack: () => void;
}

function getGrade(pct: number): string {
  if (pct >= 90) return "5";
  if (pct >= 70) return "4";
  if (pct >= 50) return "3";
  return "2";
}

function getGradeLabel(grade: string): string {
  const map: Record<string, string> = { "5": "Отлично!", "4": "Хорошо", "3": "Удовлетворительно", "2": "Неудовлетворительно" };
  return map[grade] ?? "";
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

export default function TestView({ questions, title, subtitle, navigate, addResult, onBack }: TestViewProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showHints, setShowHints] = useState<Record<number, boolean>>({});

  const handleAnswer = (qId: number, val: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = () => {
    const score = questions.filter((q) => {
      const userAns = (answers[q.id] ?? "").trim().toLowerCase();
      const correctAns = q.answer.toLowerCase();
      return userAns.length > 2 && (correctAns.includes(userAns) || userAns.includes(correctAns.split(" ")[0]));
    }).length;

    const pct = Math.round((score / questions.length) * 100);
    const grade = getGrade(pct);

    addResult({
      date: new Date().toLocaleString("ru-RU"),
      mode: title,
      score,
      total: questions.length,
      percentage: pct,
      grade,
    });

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    const score = questions.filter((q) => {
      const userAns = (answers[q.id] ?? "").trim().toLowerCase();
      const correctAns = q.answer.toLowerCase();
      return userAns.length > 2 && (correctAns.includes(userAns) || userAns.includes(correctAns.split(" ")[0]));
    }).length;
    const pct = Math.round((score / questions.length) * 100);
    const grade = getGrade(pct);

    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
        {/* Results card */}
        <div className="bg-white border border-[var(--border-light)] rounded-2xl p-8 shadow-sm text-center mb-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-white"
            style={{ backgroundColor: getGradeColor(grade) }}
          >
            {grade}
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{getGradeLabel(grade)}</h2>
          <p className="text-[var(--text-secondary)] mb-4">
            Правильных ответов: <span className="font-semibold text-[var(--text-primary)]">{score} из {questions.length}</span>
          </p>
          <div className="w-full bg-[var(--bg-card)] rounded-full h-3 mb-2">
            <div
              className="h-3 rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, backgroundColor: getGradeColor(grade) }}
            />
          </div>
          <p className="text-lg font-bold" style={{ color: getGradeColor(grade) }}>{pct}%</p>
        </div>

        {/* Answer review */}
        <h3 className="font-bold text-[var(--text-primary)] mb-4 text-lg">Разбор ответов</h3>
        <div className="space-y-4">
          {questions.map((q) => {
            const userAns = (answers[q.id] ?? "").trim();
            const correctAns = q.answer.toLowerCase();
            const isOk = userAns.length > 2 && (correctAns.includes(userAns.toLowerCase()) || userAns.toLowerCase().includes(correctAns.split(" ")[0]));

            return (
              <div
                key={q.id}
                className="bg-white border rounded-xl p-4 shadow-sm"
                style={{ borderColor: isOk ? "var(--accent-green)" : "var(--accent-red)" }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-white text-xs mt-0.5"
                    style={{ backgroundColor: isOk ? "var(--accent-green)" : "var(--accent-red)" }}
                  >
                    {isOk ? "✓" : "✗"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">
                      Задание {q.taskNumber} — {q.topic}
                    </p>
                    <p className="text-[var(--text-primary)] text-sm mb-3">{q.text}</p>
                    <div className="space-y-1.5">
                      <div className="bg-[var(--bg-card)] rounded-lg px-3 py-2 text-sm">
                        <span className="text-[var(--text-secondary)]">Ваш ответ: </span>
                        <span className="text-[var(--text-primary)]">{userAns || "—"}</span>
                      </div>
                      <div
                        className="rounded-lg px-3 py-2 text-sm"
                        style={{ backgroundColor: isOk ? "var(--bg-green)" : "#fff5f5" }}
                      >
                        <span className="text-[var(--text-secondary)]">Правильный ответ: </span>
                        <span className="font-medium" style={{ color: isOk ? "var(--accent-green)" : "var(--accent-red)" }}>
                          {q.answer}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onBack} className="btn-secondary flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium flex-1">
            <Icon name="ArrowLeft" size={16} />
            Назад
          </button>
          <button onClick={() => navigate("stats")} className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium flex-1">
            <Icon name="BarChart2" size={16} />
            Статистика
          </button>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).filter((k) => answers[Number(k)]?.trim()).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] transition-colors">
          <Icon name="ArrowLeft" size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">{title}</h1>
          <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>
        </div>
        <div className="ml-auto text-sm text-[var(--text-secondary)] bg-[var(--bg-card)] px-3 py-1.5 rounded-lg">
          {answeredCount}/{questions.length}
        </div>
      </div>

      {/* Progress */}
      <div className="w-full bg-[var(--bg-card)] rounded-full h-1.5 mb-8">
        <div
          className="h-1.5 rounded-full bg-[var(--accent-blue)] transition-all duration-300"
          style={{ width: `${(answeredCount / questions.length) * 100}%` }}
        />
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white border border-[var(--border-light)] rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-blue)] text-[var(--accent-blue)] flex items-center justify-center text-sm font-bold shrink-0">
                {idx + 1}
              </div>
              <div>
                <span className="text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-card)] px-2 py-0.5 rounded-md">
                  Задание {q.taskNumber} · {q.topic}
                </span>
                <p className="mt-2 text-[var(--text-primary)] leading-relaxed">{q.text}</p>
              </div>
            </div>

            <textarea
              value={answers[q.id] ?? ""}
              onChange={(e) => handleAnswer(q.id, e.target.value)}
              placeholder="Введите ваш ответ..."
              rows={2}
              className="w-full border border-[var(--border-light)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] bg-[var(--bg-card)] focus:outline-none focus:border-[var(--accent-blue)] resize-none transition-colors"
            />

            {q.hint && (
              <div className="mt-2">
                <button
                  onClick={() => setShowHints((p) => ({ ...p, [q.id]: !p[q.id] }))}
                  className="text-xs text-[var(--accent-blue)] hover:underline flex items-center gap-1"
                >
                  <Icon name="Lightbulb" size={12} />
                  {showHints[q.id] ? "Скрыть подсказку" : "Показать подсказку"}
                </button>
                {showHints[q.id] && (
                  <div className="mt-2 bg-[var(--bg-blue)] rounded-lg px-3 py-2 text-xs text-[var(--accent-blue)] animate-fade-in">
                    💡 {q.hint}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={handleSubmit}
          className="btn-primary w-full py-3.5 rounded-xl font-semibold text-base flex items-center justify-center gap-2"
        >
          <Icon name="CheckCircle" size={20} />
          Завершить и проверить
        </button>
      </div>
    </div>
  );
}
