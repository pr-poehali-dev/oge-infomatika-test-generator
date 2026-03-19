import { useState } from "react";
import HomePage from "@/components/HomePage";
import ReferencePage from "@/components/ReferencePage";
import RandomTestPage from "@/components/RandomTestPage";
import TaskSelectPage from "@/components/TaskSelectPage";
import StatsPage from "@/components/StatsPage";
import NavBar from "@/components/NavBar";

export type Page = "home" | "reference" | "random-test" | "task-select" | "stats";

export interface TestResult {
  date: string;
  mode: string;
  score: number;
  total: number;
  percentage: number;
  grade: string;
}

export default function Index() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [results, setResults] = useState<TestResult[]>([]);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addResult = (result: TestResult) => {
    setResults((prev) => [result, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <NavBar currentPage={currentPage} navigate={navigate} />
      <main>
        {currentPage === "home" && <HomePage navigate={navigate} />}
        {currentPage === "reference" && <ReferencePage />}
        {currentPage === "random-test" && (
          <RandomTestPage navigate={navigate} addResult={addResult} />
        )}
        {currentPage === "task-select" && (
          <TaskSelectPage navigate={navigate} addResult={addResult} />
        )}
        {currentPage === "stats" && <StatsPage results={results} navigate={navigate} />}
      </main>
    </div>
  );
}
