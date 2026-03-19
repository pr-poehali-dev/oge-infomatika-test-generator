import { Page } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface HomePageProps {
  navigate: (page: Page) => void;
}

const features = [
  {
    icon: "BookOpen",
    title: "Справочник",
    desc: "10 тем с теорией и примерами — всё что нужно для подготовки",
    page: "reference" as Page,
    color: "var(--accent-green)",
    bg: "var(--bg-green)",
  },
  {
    icon: "Shuffle",
    title: "Случайный вариант",
    desc: "10 заданий в случайном варианте — как на реальном экзамене",
    page: "random-test" as Page,
    color: "var(--accent-blue)",
    bg: "var(--bg-blue)",
  },
  {
    icon: "Target",
    title: "Отдельное задание",
    desc: "Выбери номер задания и тренируйся прицельно",
    page: "task-select" as Page,
    color: "var(--accent-purple)",
    bg: "var(--bg-purple)",
  },
  {
    icon: "BarChart2",
    title: "Статистика",
    desc: "Смотри свои результаты, оценки и прогресс",
    page: "stats" as Page,
    color: "var(--accent-orange)",
    bg: "var(--bg-orange)",
  },
];

export default function HomePage({ navigate }: HomePageProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 pb-16">
      {/* Hero */}
      <section className="text-center pt-14 pb-12">
        <div className="inline-flex items-center gap-2 bg-[var(--bg-blue)] text-[var(--accent-blue)] px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Icon name="GraduationCap" size={15} />
          Подготовка к ОГЭ по химии
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] leading-tight mb-4">
          Выучи химию <br />
          <span className="text-[var(--accent-blue)]">и сдай ОГЭ</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto mb-8 leading-relaxed">
          Справочник, тесты и разбор заданий по всем темам ОГЭ. Тренируйся с реальными вопросами из банка ФИПИ.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => navigate("random-test")}
            className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-base"
          >
            <Icon name="Shuffle" size={18} />
            Пройти вариант
          </button>
          <button
            onClick={() => navigate("reference")}
            className="btn-secondary flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-base"
          >
            <Icon name="BookOpen" size={18} />
            Открыть справочник
          </button>
        </div>
      </section>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        {[
          { num: "10", label: "вариантов" },
          { num: "100", label: "заданий" },
          { num: "10", label: "тем" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[var(--border-light)] rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-[var(--accent-blue)]">{s.num}</div>
            <div className="text-sm text-[var(--text-secondary)] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {features.map((f) => (
          <button
            key={f.page}
            onClick={() => navigate(f.page)}
            className="group text-left bg-white border border-[var(--border-light)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: f.bg }}
            >
              <Icon name={f.icon} size={22} style={{ color: f.color }} />
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] text-lg mb-1">{f.title}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
            <div
              className="flex items-center gap-1 mt-4 text-sm font-medium"
              style={{ color: f.color }}
            >
              Перейти
              <Icon name="ArrowRight" size={14} />
            </div>
          </button>
        ))}
      </div>

      {/* Topics preview */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Темы в справочнике</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Строение атома", "Периодическая система", "Химическая связь",
            "Классы веществ", "Типы реакций", "Ионный обмен",
            "ОВР", "Качественные реакции", "Расчёты по формулам", "Расчёты по уравнениям"
          ].map((topic) => (
            <button
              key={topic}
              onClick={() => navigate("reference")}
              className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-lg text-sm text-[var(--text-secondary)] hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)] transition-colors"
            >
              {topic}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
