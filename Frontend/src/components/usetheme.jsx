import { useEffect, useState } from "react";

function useTheme() {
  const [theme, setTheme] = useState(localStorage.theme || "light");

  useEffect(() => {
    if (
      theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.theme = theme;
  }, [theme]);

  function mode() {
    setTheme((e) => (e === "light" ? "dark" : "light"));
  }

  return { theme, mode };
}

export default useTheme;
