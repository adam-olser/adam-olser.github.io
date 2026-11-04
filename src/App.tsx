import { useSyncExternalStore } from "react";
import { useLenis } from "./hooks/useLenis";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Work } from "./components/Work";
import { Skills } from "./components/Skills";
import { Story } from "./components/Story";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

// Theme lives on <html class="dark"> (set by the inline script in index.html).
// Reading it through useSyncExternalStore keeps hydration clean: the server snapshot is light.
const subscribeTheme = (cb: () => void) => {
  const o = new MutationObserver(cb);
  o.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => o.disconnect();
};
const getDark = () => document.documentElement.classList.contains("dark");

function App() {
  const isDark = useSyncExternalStore(subscribeTheme, getDark, () => false);

  useLenis();

  function toggleTheme() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
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
