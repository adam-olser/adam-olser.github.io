import { useState, useEffect } from "react";
import { useGitHub } from "./hooks/useGitHub";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Work } from "./components/Work";
import { Skills } from "./components/Skills";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

function App() {
  const { user, repositories, loading, error } = useGitHub();
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  function toggleTheme() {
    setIsDark((d) => !d);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-on-surface">
        <div className="w-12 h-12 rounded-full border-4 border-surface-container-high border-t-primary animate-spin" />
        <p className="text-sm uppercase tracking-widest text-on-surface-variant font-medium">
          Loading portfolio…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Nav isDark={isDark} onThemeToggle={toggleTheme} />
      <main>
        <Hero user={user} />
        <Work repositories={repositories} error={error} />
        <Skills />
        <About />
        <Contact user={user} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
