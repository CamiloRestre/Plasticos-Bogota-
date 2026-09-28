"use client";

import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(once = true) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) observer.disconnect();
      } else if (!once) {
        setInView(false);
      }
    }, { threshold: 0.14 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [once]);

  return { ref, inView };
}
