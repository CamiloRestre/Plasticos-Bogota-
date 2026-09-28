"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useReducedMotion } from "./landing/use-reduced-motion";

const objects = [
  { size: 178, top: "8%", left: "8%", opacity: 0.08, blur: 36, duration: 30, delay: 0 },
  { size: 112, top: "20%", left: "46%", opacity: 0.1, blur: 24, duration: 24, delay: 1.4 },
  { size: 72, top: "66%", left: "8%", opacity: 0.14, blur: 10, duration: 21, delay: 0.8 },
  { size: 54, top: "72%", left: "40%", opacity: 0.12, blur: 2, duration: 18, delay: 2.2 },
  { size: 138, top: "52%", left: "80%", opacity: 0.07, blur: 32, duration: 34, delay: 1 },
  { size: 48, top: "14%", left: "82%", opacity: 0.15, blur: 0, duration: 20, delay: 3 },
  { size: 86, top: "82%", left: "66%", opacity: 0.09, blur: 16, duration: 27, delay: 1.7 },
  { size: 42, top: "42%", left: "24%", opacity: 0.13, blur: 0, duration: 22, delay: 2.8 },
];

export function FloatingObjects() {
  const reducedMotion = useReducedMotion();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) return;
    const move = (event: PointerEvent) => {
      setPointer({
        x: (event.clientX / window.innerWidth - 0.5) * 18,
        y: (event.clientY / window.innerHeight - 0.5) * 14,
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reducedMotion]);

  return (
    <div className="floating-objects" aria-hidden="true">
      {objects.map((object, index) => (
        <motion.div
          key={`${object.top}-${object.left}`}
          className={`floating-object floating-object-${index + 1}`}
          style={{
            top: object.top,
            left: object.left,
            width: object.size,
            height: object.size,
            opacity: object.opacity,
            filter: `blur(${object.blur}px)`,
            translate: reducedMotion ? undefined : `${pointer.x * (index + 1) / 8}px ${pointer.y * (index + 1) / 8}px`,
          }}
          animate={
            reducedMotion
              ? undefined
              : {
                  x: [-12, 14, -8, 12, -12],
                  y: [12, -18, 8, -14, 12],
                  rotate: [0, 90, 180, 270, 360],
                }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: object.duration,
                  delay: object.delay,
                  ease: "easeInOut",
                  repeat: Infinity,
                }
          }
        />
      ))}
    </div>
  );
}
