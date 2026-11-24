"use client";

import { useEffect, useRef } from "react";

/**
 * Replaces the mouse pointer on every page with a small solid #F7402D square that changes slightly with what is under it:
 *   default        8px solid square (also over text)
 *   links, buttons 12px hollow square (2px outline), so it never turns into a big block over large clickable cards
 *   disabled       a smaller, dimmed square
 *   mouse pressed  shrinks slightly
 * Only on devices with a real pointer, and only once this has loaded, so there is never a moment with no cursor.
 */
export default function SquareCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("has-sq");

    let x = 0, y = 0, target: Element | null = null, raf = 0;
    const update = () => {
      raf = 0;
      el.style.translate = `${x}px ${y}px`;
      el.style.opacity = "1";
      let state = "";
      if (target?.closest("[aria-disabled='true']")) state = "off";
      else if (target?.closest("a, button, [role='button']")) state = "link";
      el.dataset.state = state;
    };
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY; target = e.target as Element | null;
      if (!raf) raf = requestAnimationFrame(update);   // one update per frame, however fast the mouse moves
    };
    const down = () => { el.dataset.down = "1"; };
    const up = () => { el.dataset.down = "0"; };
    const hide = () => { el.style.opacity = "0"; };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    root.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-sq");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      root.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, []);

  return <div ref={ref} aria-hidden className="sq" />;
}
