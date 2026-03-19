import { Page } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface NavBarProps {
  currentPage: Page;
  navigate: (page: Page) => void;
}

const navItems: { page: Page; label: string; icon: string }[] = [
  { page: "home", label: "Главная", icon: "Home" },
  { page: "reference", label: "Справочник", icon: "BookOpen" },
  { page: "random-test", label: "Вариант", icon: "Shuffle" },
  { page: "task-select", label: "Задание", icon: "Target" },
  { page: "stats", label: "Статистика", icon: "BarChart2" },
];

export default function NavBar({ currentPage, navigate }: NavBarProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[var(--border-light)] shadow-sm">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-2 font-bold text-[var(--accent-blue)] text-lg tracking-tight"
        >
          <span className="text-xl">💻</span>
          <span className="hidden sm:block">ИнфОГЭ</span>
        </button>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${currentPage === item.page
                  ? "bg-[var(--accent-blue)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
                }`}
            >
              <Icon name={item.icon} size={15} />
              <span className="hidden md:block">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}