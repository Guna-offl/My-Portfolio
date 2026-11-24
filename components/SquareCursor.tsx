"use client";

import { useEffect, useRef } from "react";

/**
 * Replaces the mouse pointer on every page with a solid #F7402D square (14px, hard edges).
 * Only on devices with a real pointer, and only once this has loaded, so there is never a moment
 * with no cursor. The square grows over links and buttons, and dims over disabled items.
 */
export default function SquareCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("has-sq");
    const move = (e: PointerEvent) => {
      el.style.translate = `${e.clientX}px ${e.clientY}px`;
      el.style.opacity = "1";
      const t = e.target as Element | null;
      el.dataset.state = t?.closest?.("[aria-disabled='true']") ? "off" : t?.closest?.("a, button, [role='button']") ? "link" : "";
    };
    const hide = () => { el.style.opacity = "0"; };
    window.addEventListener("pointermove", move, { passive: true });
    root.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      root.classList.remove("has-sq");
      window.removeEventListener("pointermove", move);
      root.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, []);

  return <div ref={ref} aria-hidden className="sq" />;
}
