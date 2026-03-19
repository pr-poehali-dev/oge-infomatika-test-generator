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

function checkAnswer(q: Question, userAns: string): boolean {
  const ua = userAns.trim().toLowerCase();
  const ca = q.answer.trim().toLowerCase();
  if (q.type === "choice") return ua === ca;
  if (!ua) return false;
  return ca.includes(ua) || ua.includes(ca.split(/[,;\s]/)[0].trim());
}

// SVG-иллюстрации для заданий с исполнителем
function TurtleIllustration({ description }: { description: string }) {
  if (description === "turtle_square") {
    return (
      <svg viewBox="0 0 160 160" className="w-36 h-36" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="30" width="100" height="100" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="5,3"/>
        <circle cx="30" cy="30" r="5" fill="#2563eb"/>
        <polygon points="130,25 140,30 130,35" fill="#16a34a"/>
        <text x="80" y="155" textAnchor="middle" fontSize="11" fill="#64748b">Квадрат 4×4</text>
        <text x="80" y="25" textAnchor="middle" fontSize="10" fill="#2563eb">4</text>
        <text x="145" y="85" fontSize="10" fill="#2563eb">4</text>
      </svg>
    );
  }
  if (description === "turtle_triangle") {
    return (
      <svg viewBox="0 0 160 160" className="w-36 h-36" xmlns="http://www.w3.org/2000/svg">
        <polygon points="80,20 145,135 15,135" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="5,3"/>
        <circle cx="80" cy="20" r="5" fill="#2563eb"/>
        <polygon points="145,125 155,135 145,145" fill="#16a34a"/>
        <text x="80" y="155" textAnchor="middle" fontSize="11" fill="#64748b">Правильный треугольник</text>
      </svg>
    );
  }
  if (description === "turtle_rectangle") {
    return (
      <svg viewBox="0 0 160 120" className="w-44 h-36" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="120" height="80" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="5,3"/>
        <circle cx="20" cy="20" r="5" fill="#2563eb"/>
        <polygon points="130,15 140,20 130,25" fill="#16a34a"/>
        <text x="80" y="115" textAnchor="middle" fontSize="11" fill="#64748b">Прямоугольник 3×2</text>
        <text x="80" y="15" textAnchor="middle" fontSize="10" fill="#2563eb">3</text>
        <text x="150" y="65" fontSize="10" fill="#2563eb">2</text>
      </svg>
    );
  }
  // turtle_path_1 — произвольный путь
  return (
    <svg viewBox="0 0 160 120" className="w-44 h-36" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="60" x2="70" y2="60" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="5,3"/>
      <line x1="70" y1="60" x2="70" y2="30" stroke="#ea580c" strokeWidth="2.5" strokeDasharray="5,3"/>
      <line x1="70" y1="30" x2="120" y2="30" stroke="#16a34a" strokeWidth="2.5" strokeDasharray="5,3"/>
      <circle cx="20" cy="60" r="5" fill="#2563eb"/>
      <polygon points="115,25 125,30 115,35" fill="#16a34a"/>
      <text x="45" y="75" fontSize="10" fill="#2563eb">5</text>
      <text x="75" y="47" fontSize="10" fill="#ea580c">3</text>
      <text x="90" y="25" fontSize="10" fill="#16a34a">5</text>
    </svg>
  );
}

// Таблица в условии задания
function QuestionTable({ tableData }: { tableData: NonNullable<Question["tableData"]> }) {
  return (
    <div className="overflow-x-auto mt-3 mb-1">
      <table className="w-full text-sm border-collapse rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-[var(--bg-blue)]">
            {tableData.headers.map((h, i) => (
              <th key={i} className="border border-[var(--border-light)] px-3 py-2 text-left text-[var(--accent-blue)] font-semibold whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-[var(--bg-card)]"}>
              {row.map((cell, ci) => (
                <td key={ci} className="border border-[var(--border-light)] px-3 py-2 text-[var(--text-primary)] whitespace-nowrap font-mono text-xs">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Блок псевдокода алгоритма
function AlgorithmBlock({ lines }: { lines: string[] }) {
  return (
    <div className="mt-3 mb-1 bg-gray-900 rounded-xl p-4 font-mono text-sm overflow-x-auto">
      {lines.map((line, i) => {
        const indent = line.match(/^(\s+)/)?.[1]?.length ?? 0;
        const trimmed = line.trimStart();
        const isKeyword = /^(ПОКА|КОНЕЦ|ЕСЛИ|ТО|ИНАЧЕ|ПОВТОРИТЬ|ВЫВЕСТИ|ВВЕСТИ)/.test(trimmed);
        return (
          <div key={i} style={{ paddingLeft: `${indent * 4}px` }} className="leading-6">
            <span className={isKeyword ? "text-blue-400 font-semibold" : "text-green-300"}>
              {trimmed}
            </span>
          </div>
        );
      })}
    </div>
  );
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
    const score = questions.filter((q) => checkAnswer(q, answers[q.id] ?? "")).length;
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
    const score = questions.filter((q) => checkAnswer(q, answers[q.id] ?? "")).length;
    const pct = Math.round((score / questions.length) * 100);
    const grade = getGrade(pct);

    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
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
            <div className="h-3 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: getGradeColor(grade) }} />
          </div>
          <p className="text-lg font-bold" style={{ color: getGradeColor(grade) }}>{pct}%</p>
        </div>

        <h3 className="font-bold text-[var(--text-primary)] mb-4 text-lg">Разбор ответов</h3>
        <div className="space-y-4">
          {questions.map((q) => {
            const isOk = checkAnswer(q, answers[q.id] ?? "");
            const userAns = answers[q.id] ?? "";
            const correctLabel = q.type === "choice"
              ? q.options?.find(o => o.value === q.answer)?.label ?? q.answer
              : q.answer;
            const userLabel = q.type === "choice"
              ? q.options?.find(o => o.value === userAns)?.label ?? "—"
              : (userAns || "—");

            return (
              <div key={q.id} className="bg-white border rounded-xl p-4 shadow-sm"
                style={{ borderColor: isOk ? "var(--accent-green)" : "var(--accent-red)" }}>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-white text-xs mt-0.5"
                    style={{ backgroundColor: isOk ? "var(--accent-green)" : "var(--accent-red)" }}>
                    {isOk ? "✓" : "✗"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">
                      Задание {q.taskNumber} — {q.topic}
                    </p>
                    <p className="text-[var(--text-primary)] text-sm mb-3 whitespace-pre-line">{q.text}</p>
                    <div className="space-y-1.5">
                      <div className="bg-[var(--bg-card)] rounded-lg px-3 py-2 text-sm">
                        <span className="text-[var(--text-secondary)]">Ваш ответ: </span>
                        <span className="text-[var(--text-primary)]">{userLabel}</span>
                      </div>
                      <div className="rounded-lg px-3 py-2 text-sm"
                        style={{ backgroundColor: isOk ? "var(--bg-green)" : "#fff5f5" }}>
                        <span className="text-[var(--text-secondary)]">Правильный ответ: </span>
                        <span className="font-medium" style={{ color: isOk ? "var(--accent-green)" : "var(--accent-red)" }}>
                          {correctLabel}
                        </span>
                      </div>
                      {q.hint && (
                        <div className="bg-[var(--bg-blue)] rounded-lg px-3 py-2 text-xs text-[var(--accent-blue)]">
                          💡 {q.hint}
                        </div>
                      )}
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

      <div className="w-full bg-[var(--bg-card)] rounded-full h-1.5 mb-8">
        <div className="h-1.5 rounded-full bg-[var(--accent-blue)] transition-all duration-300"
          style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white border border-[var(--border-light)] rounded-2xl p-5 shadow-sm">
            {/* Номер и тема */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--bg-blue)] text-[var(--accent-blue)] flex items-center justify-center text-sm font-bold shrink-0">
                {idx + 1}
              </div>
              <div>
                <span className="text-xs font-semibold text-[var(--accent-blue)] bg-[var(--bg-blue)] px-2 py-0.5 rounded-md">
                  Задание {q.taskNumber} · {q.topic}
                </span>
              </div>
            </div>

            {/* Иллюстрация для исполнителя */}
            {q.imageDescription && (
              <div className="flex justify-center mb-3">
                <div className="bg-[var(--bg-card)] rounded-xl p-3 inline-block">
                  <TurtleIllustration description={q.imageDescription} />
                </div>
              </div>
            )}

            {/* Таблица в условии */}
            {q.tableData && <QuestionTable tableData={q.tableData} />}

            {/* Текст задания */}
            <p className="text-[var(--text-primary)] leading-relaxed whitespace-pre-line mb-4">{q.text}</p>

            {/* Псевдокод */}
            {q.algorithmLines && <AlgorithmBlock lines={q.algorithmLines} />}

            {/* Вариант ответа: выбор */}
            {q.type === "choice" && q.options && (
              <div className="space-y-2 mt-3">
                {q.options.map((opt) => {
                  const selected = answers[q.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(q.id, opt.value)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150
                        ${selected
                          ? "border-[var(--accent-blue)] bg-[var(--bg-blue)] text-[var(--accent-blue)] font-medium"
                          : "border-[var(--border-light)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[var(--accent-blue)]"
                        }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Вариант ответа: краткий */}
            {q.type !== "choice" && (
              <div className="mt-3">
                <input
                  type="text"
                  value={answers[q.id] ?? ""}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  placeholder="Введите ответ..."
                  className="w-full border border-[var(--border-light)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] bg-[var(--bg-card)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                />
              </div>
            )}

            {/* Подсказка */}
            {q.hint && (
              <div className="mt-3">
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
