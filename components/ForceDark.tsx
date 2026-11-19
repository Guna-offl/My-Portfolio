"use client";

import { useLayoutEffect } from "react";

/** The case study is designed dark. Keep it dark here without changing the saved theme choice. */
export default function ForceDark() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const prev = root.dataset.theme;
    delete root.dataset.theme;
    return () => { if (prev) root.dataset.theme = prev; };
  }, []);
  return null;
}
