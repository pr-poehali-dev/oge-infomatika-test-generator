import { useState } from "react";
import { allQuestions, Question } from "@/data/chemistryData";
import TestView from "@/components/TestView";
import Icon from "@/components/ui/icon";
import { Page, TestResult } from "@/pages/Index";

interface Props {
  navigate: (page: Page) => void;
  addResult: (result: TestResult) => void;
}

const taskTopics: Record<number, { topic: string; icon: string; desc: string }> = {
  1: { topic: "Алгоритм для исполнителя", icon: "🤖", desc: "Черепашка, Робот, числовые команды" },
  2: { topic: "Количество информации", icon: "📊", desc: "Формула Хартли, мощность алфавита" },
  3: { topic: "Системы счисления", icon: "🔢", desc: "Перевод чисел, арифметика в системах" },
  4: { topic: "Файловая система", icon: "📁", desc: "Пути, маски поиска, расширения" },
  5: { topic: "Электронные таблицы", icon: "📈", desc: "Формулы, функции СУММ, МАКС, ЕСЛИ" },
  6: { topic: "Логические выражения", icon: "⚡", desc: "И, ИЛИ, НЕ, таблицы истинности" },
  7: { topic: "Трассировка алгоритма", icon: "⚙️", desc: "Циклы, ветвления, псевдокод" },
  8: { topic: "Кодирование. Объём файлов", icon: "💾", desc: "Текст, изображения, аудио" },
  9: { topic: "Передача данных", icon: "🌐", desc: "Скорость, время, объём канала" },
  10: { topic: "Базы данных", icon: "🗄️", desc: "Запросы, таблицы, условия выборки" },
};

export default function TaskSelectPage({ navigate, addResult }: Props) {
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [started, setStarted] = useState(false);

  // Собираем все вопросы одного типа задания из всех вариантов
  const getTaskQuestions = (taskNum: number): Question[] => {
    return Object.values(allQuestions)
      .map((qs) => qs.find((q) => q.taskNumber === taskNum))
      .filter(Boolean) as Question[];
  };

  if (started && selectedTask !== null) {
    const questions = getTaskQuestions(selectedTask);
    const info = taskTopics[selectedTask];
    return (
      <TestView
        questions={questions}
        title={`Задание ${selectedTask} — ${info.topic}`}
        subtitle={`${info.icon} ${questions.length} примеров · Все варианты этого типа задания`}
        navigate={navigate}
        addResult={(r) => addResult({ ...r, mode: `Задание №${selectedTask}` })}
        onBack={() => { setStarted(false); setSelectedTask(null); }}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Выбрать задание</h1>
        <p className="text-[var(--text-secondary)]">Выберите тему — получите все 10 примеров этого типа задания из разных вариантов</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {Object.entries(taskTopics).map(([num, info]) => {
          const taskNum = Number(num);
          const questions = getTaskQuestions(taskNum);
          return (
            <button
              key={taskNum}
              onClick={() => { setSelectedTask(taskNum); setStarted(true); }}
              className="group bg-white border border-[var(--border-light)] rounded-2xl p-5 text-left hover:border-[var(--accent-blue)] hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[var(--bg-blue)] rounded-xl flex items-center justify-center text-lg shrink-0">
                  {info.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[var(--accent-blue)] bg-[var(--bg-blue)] px-2 py-0.5 rounded-md">
                      №{taskNum}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">{questions.length} заданий</span>
                  </div>
                  <h3 className="font-semibold text-[var(--text-primary)]">{info.topic}</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{info.desc}</p>
                </div>
                <Icon
                  name="ChevronRight"
                  size={16}
                  className="text-[var(--text-secondary)] group-hover:text-[var(--accent-blue)] transition-colors shrink-0 mt-1"
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 bg-[var(--bg-blue)] border border-blue-100 rounded-xl p-4 flex gap-3">
        <Icon name="Target" size={18} className="text-[var(--accent-blue)] shrink-0 mt-0.5" />
        <p className="text-sm text-[var(--accent-blue)] leading-relaxed">
          При выборе задания вы увидите все 10 примеров этого типа из разных вариантов — отличный способ отработать конкретную тему.
        </p>
      </div>
    </div>
  );
}