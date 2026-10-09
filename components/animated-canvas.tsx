"use client";

import { useEffect, useRef } from "react";

interface AnimatedCanvasProps {
  particleCount?: number;
  particleColor?: string;
  lineColor?: string;
  particleSize?: number;
  connectionDistance?: number;
  speed?: number;
  className?: string;
}

type Particle = { x: number; y: number; vx: number; vy: number; size: number };

export default function AnimatedCanvas({
  particleCount = 60,
  particleColor = "#4caf50",
  lineColor = "rgba(76, 175, 80, 0.18)",
  particleSize = 2,
  connectionDistance = 120,
  speed = 0.3,
  className,
}: AnimatedCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const mobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = mobile ? 30 : particleCount;
    const distance = mobile ? 100 : connectionDistance;
    const velocity = mobile ? 0.15 : speed;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pointer = { x: -Infinity, y: -Infinity, active: false };
    const particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let scrollY = 0;

    const resize = () => {
      const bounds = parent.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    for (let index = 0; index < count; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const magnitude = velocity * (0.5 + Math.random());
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * magnitude,
        vy: Math.sin(angle) * magnitude,
        size: particleSize * (0.7 + Math.random() * 0.7),
      });
    }

    const render = () => {
      context.clearRect(0, 0, width, height);
      const centerX = width * 0.78;
      const centerY = height * 0.5;
      const pulse = reducedMotion ? 0 : Math.sin(performance.now() * 0.001) * 0.04;
      const glow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) * 0.62);
      glow.addColorStop(0, "rgba(183, 216, 52, 0.16)");
      glow.addColorStop(0.32, "rgba(47, 125, 79, 0.08)");
      glow.addColorStop(1, "rgba(247, 250, 248, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
      context.save();
      context.translate(centerX, centerY);
      context.rotate(-0.18);
      context.strokeStyle = "rgba(47, 125, 79, 0.16)";
      context.lineWidth = 1;
      for (const radius of [Math.min(width, height) * 0.22, Math.min(width, height) * 0.34, Math.min(width, height) * 0.46]) {
        context.beginPath();
        context.ellipse(0, 0, radius * 1.45, radius, pulse + radius * 0.001, 0, Math.PI * 2);
        context.stroke();
      }
      context.restore();
      for (const particle of particles) {
        if (!reducedMotion && document.visibilityState !== "hidden") {
          if (pointer.active) {
            const dx = particle.x - pointer.x;
            const dy = particle.y - pointer.y;
            const distanceToPointer = Math.hypot(dx, dy);
            if (distanceToPointer > 0 && distanceToPointer < 150) {
              const force = (150 - distanceToPointer) / 1500;
              particle.vx += (dx / distanceToPointer) * force;
              particle.vy += (dy / distanceToPointer) * force;
            }
          }
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vx *= 0.995;
          particle.vy *= 0.995;
          if (particle.x < 0 || particle.x > width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > height) particle.vy *= -1;
          particle.x = Math.max(0, Math.min(width, particle.x));
          particle.y = Math.max(0, Math.min(height, particle.y));
        }
      }

      context.strokeStyle = lineColor;
      context.lineWidth = 0.7;
      for (let first = 0; first < particles.length; first += 1) {
        for (let second = first + 1; second < particles.length; second += 1) {
          const a = particles[first];
          const b = particles[second];
          const gap = Math.hypot(a.x - b.x, a.y - b.y);
          if (gap < distance) {
            context.globalAlpha = 1 - gap / distance;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
          }
        }
      }
      context.globalAlpha = 0.5;
      context.fillStyle = particleColor;
      for (const particle of particles) {
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      if (!reducedMotion && document.visibilityState !== "hidden") animationFrame = requestAnimationFrame(render);
    };

    const movePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
    };
    const clearPointer = () => { pointer.active = false; };
    const handleScroll = () => {
      scrollY = window.scrollY;
      canvas.style.transform = `translateY(${scrollY * 0.2}px)`;
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && !reducedMotion) {
        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(render);
      }
    };
    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(parent);
    window.addEventListener("pointermove", movePointer, { passive: true });
    window.addEventListener("pointerleave", clearPointer);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", movePointer);
      window.removeEventListener("pointerleave", clearPointer);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [connectionDistance, particleColor, particleCount, particleSize, lineColor, speed]);

  return <div className={`animated-canvas${className ? ` ${className}` : ""}`} aria-hidden="true"><canvas ref={canvasRef} /></div>;
}
