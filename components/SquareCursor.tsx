"use client";

import { useEffect, useRef } from "react";

/**
 * Replaces the mouse pointer with a solid #F7402D square (14px, hard edges), as in the reference.
 * Only on devices with a real pointer, and only once this has loaded, so there is never a moment
 * with no cursor. The square grows slightly over links and buttons.
 */
export default function SquareCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("k-square-cursor");
    const move = (e: PointerEvent) => {
      el.style.translate = `${e.clientX}px ${e.clientY}px`;
      el.style.opacity = "1";
      el.dataset.hot = (e.target as Element | null)?.closest?.("a, button, [role='button']") ? "1" : "0";
    };
    const hide = () => { el.style.opacity = "0"; };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      root.classList.remove("k-square-cursor");
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, []);

  return <div ref={ref} aria-hidden className="k-sq" />;
}
