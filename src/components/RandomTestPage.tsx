import { useState } from "react";
import { variants } from "@/data/chemistryData";
import TestView from "@/components/TestView";
import Icon from "@/components/ui/icon";
import { Page, TestResult } from "@/pages/Index";

interface Props {
  navigate: (page: Page) => void;
  addResult: (result: TestResult) => void;
}

export default function RandomTestPage({ navigate, addResult }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [started, setStarted] = useState(false);

  const startRandom = () => {
    const idx = Math.floor(Math.random() * variants.length);
    setSelectedVariant(variants[idx].id);
    setStarted(true);
  };

  const startVariant = (id: number) => {
    setSelectedVariant(id);
    setStarted(true);
  };

  if (started && selectedVariant !== null) {
    const variant = variants.find((v) => v.id === selectedVariant)!;
    return (
      <TestView
        questions={variant.questions}
        title={`Вариант ${selectedVariant}`}
        subtitle="10 заданий · Напишите ответы самостоятельно"
        navigate={navigate}
        addResult={(r) => addResult({ ...r, mode: `Вариант ${selectedVariant}` })}
        onBack={() => { setStarted(false); setSelectedVariant(null); }}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Случайный вариант</h1>
        <p className="text-[var(--text-secondary)]">10 заданий по всем темам ОГЭ по информатике</p>
      </div>

      {/* Main CTA */}
      <div className="bg-gradient-to-br from-[var(--accent-blue)] to-[#1d4ed8] rounded-2xl p-6 text-white mb-8 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Icon name="Shuffle" size={22} />
          </div>
          <div>
            <h2 className="font-bold text-lg">Случайный вариант</h2>
            <p className="text-blue-100 text-sm">Система подберёт один из 10 готовых вариантов</p>
          </div>
        </div>
        <button
          onClick={startRandom}
          className="w-full bg-white text-[var(--accent-blue)] font-semibold py-3 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
        >
          <Icon name="Play" size={18} />
          Пройти случайный вариант
        </button>
      </div>

      {/* Choose specific variant */}
      <h2 className="font-bold text-[var(--text-primary)] text-lg mb-4">Или выберите вариант</h2>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {variants.map((v) => (
          <button
            key={v.id}
            onClick={() => startVariant(v.id)}
            className="bg-white border border-[var(--border-light)] rounded-xl p-4 text-center hover:border-[var(--accent-blue)] hover:shadow-sm transition-all group"
          >
            <div className="text-xl font-bold text-[var(--accent-blue)] group-hover:scale-110 transition-transform">
              {v.id}
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">вариант</div>
          </button>
        ))}
      </div>

      <div className="mt-8 bg-[var(--bg-card)] rounded-xl p-4 flex gap-3">
        <Icon name="Info" size={18} className="text-[var(--text-secondary)] shrink-0 mt-0.5" />
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          В каждом варианте 10 заданий по разным темам: системы счисления, кодирование, логика, алгоритмы, электронные таблицы, сети и расчёты. Ответы пишете самостоятельно.
        </p>
      </div>
    </div>
  );
}