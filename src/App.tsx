import { useState, useEffect } from "react";
import { useLenis } from "./hooks/useLenis";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Work } from "./components/Work";
import { Skills } from "./components/Skills";
import { Story } from "./components/Story";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

function App() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  useLenis();

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

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Nav isDark={isDark} onThemeToggle={toggleTheme} />
      <main>
        <Hero />
        <Work />
        <Skills />
        <Story />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
