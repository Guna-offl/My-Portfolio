"use client";

import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

const read = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

/** Current theme, kept in sync with the `data-theme` attribute on <html>. Dark is the default. */
export const useTheme = (): Theme => useSyncExternalStore(subscribe, read, () => "dark");

/** Switch theme with a short colour fade, and remember the choice on this device. */
export function setTheme(next: Theme) {
  const root = document.documentElement;
  root.classList.add("theme-fade");
  if (next === "light") root.dataset.theme = "light"; else delete root.dataset.theme;
  try { localStorage.setItem("theme", next); } catch {}
  window.setTimeout(() => root.classList.remove("theme-fade"), 350);
}

export function ThemeToggle({ flush = false }: { flush?: boolean }) {
  const theme = useTheme();
  const next: Theme = theme === "light" ? "dark" : "light";
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className={`${flush ? "" : "-mr-2 "}flex size-8 items-center justify-center rounded-full text-fg/70 transition hover:bg-fg/5 hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-fg`}
    >
      <svg className="size-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {theme === "light" ? (
          <path d="M16.5 11.5A6.5 6.5 0 0 1 8.5 3.5a6.5 6.5 0 1 0 8 8Z" />
        ) : (
          <>
            <circle cx="10" cy="10" r="3.5" />
            <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M4.3 15.7l1.4-1.4M14.3 5.7l1.4-1.4" />
          </>
        )}
      </svg>
    </button>
  );
}
