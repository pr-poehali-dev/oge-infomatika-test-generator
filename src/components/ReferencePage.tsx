import { useState } from "react";
import { referenceTopics } from "@/data/chemistryData";
import Icon from "@/components/ui/icon";

export default function ReferencePage() {
  const [activeTopic, setActiveTopic] = useState<number | null>(null);

  const selected = referenceTopics.find((t) => t.id === activeTopic);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Справочник</h1>
        <p className="text-[var(--text-secondary)]">Теоретическая база для подготовки к ОГЭ по химии</p>
      </div>

      <div className="grid md:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <div className="space-y-1">
          {referenceTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(topic.id === activeTopic ? null : topic.id)}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${activeTopic === topic.id
                  ? "bg-[var(--accent-blue)] text-white shadow-sm"
                  : "bg-white border border-[var(--border-light)] text-[var(--text-primary)] hover:border-[var(--accent-blue)]"
                }`}
            >
              <span className="text-lg">{topic.icon}</span>
              <span className="text-sm font-medium leading-tight">{topic.title}</span>
              <Icon
                name={activeTopic === topic.id ? "ChevronDown" : "ChevronRight"}
                size={14}
                className="ml-auto shrink-0 opacity-60"
              />
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {selected ? (
            <div className="bg-white border border-[var(--border-light)] rounded-2xl p-6 shadow-sm animate-fade-in">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-light)]">
                <span className="text-3xl">{selected.icon}</span>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{selected.title}</h2>
              </div>
              <div className="space-y-6">
                {selected.content.map((block, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 bg-[var(--bg-blue)] text-[var(--accent-blue)] rounded-md flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      {block.subtitle}
                    </h3>
                    <div className="bg-[var(--bg-card)] rounded-xl p-4 text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-line">
                      {block.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[var(--border-light)] rounded-2xl p-8 text-center shadow-sm">
              <div className="text-4xl mb-4">📚</div>
              <p className="text-[var(--text-secondary)]">Выбери тему слева, чтобы открыть справочный материал</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
