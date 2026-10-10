"use client";

import React, { useEffect, useRef, useState } from "react";
import { Trophy, Target } from "lucide-react";
import { useSoundStore } from "@/store/soundStore";

interface SportsItem {
  id: number;
  name: string;
  emoji: string;
  icon?: React.ReactNode;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  color: string;
  bgGlow: string;
}

export default function FloatingSportsIcons() {
  const { playSound } = useSoundStore();
  const [items, setItems] = useState<SportsItem[]>([]);
  const itemsRef = useRef<SportsItem[]>([]);
  const animRef = useRef<number | null>(null);

  // Mouse & Drag State
  const mouseRef = useRef<{ x: number; y: number; prevX: number; prevY: number }>({
    x: -1000,
    y: -1000,
    prevX: -1000,
    prevY: -1000,
  });
  const draggingIdRef = useRef<number | null>(null);

  // Sparkle burst particles on interaction
  const particlesRef = useRef<
    { id: number; x: number; y: number; vx: number; vy: number; life: number; color: string }[]
  >([]);
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize a curated set of 5 distinct, larger floating sports icons
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initialItems: SportsItem[] = [
      {
        id: 1,
        name: "Football",
        emoji: "⚽",
        icon: <span className="text-3xl sm:text-4xl">⚽</span>,
        x: window.innerWidth * 0.14,
        y: window.innerHeight * 0.18,
        vx: 0.7,
        vy: 0.4,
        size: 80,
        rotation: 0,
        vRot: 0.4,
        color: "#ffffff",
        bgGlow: "rgba(255, 255, 255, 0.45)",
      },
      {
        id: 2,
        name: "Basketball",
        emoji: "🏀",
        icon: <span className="text-3xl sm:text-4xl">🏀</span>,
        x: window.innerWidth * 0.84,
        y: window.innerHeight * 0.18,
        vx: -0.6,
        vy: 0.5,
        size: 84,
        rotation: 0,
        vRot: -0.6,
        color: "#f97316",
        bgGlow: "rgba(249, 115, 22, 0.55)",
      },
      {
        id: 3,
        name: "Tennis",
        emoji: "🎾",
        icon: <span className="text-3xl sm:text-4xl">🎾</span>,
        x: window.innerWidth * 0.88,
        y: window.innerHeight * 0.35,
        vx: 0.5,
        vy: -0.6,
        size: 76,
        rotation: 0,
        vRot: 0.8,
        color: "#84cc16",
        bgGlow: "rgba(132, 204, 22, 0.55)",
      },
      {
        id: 4,
        name: "Badminton",
        emoji: "🏸",
        icon: <span className="text-3xl sm:text-4xl">🏸</span>,
        x: window.innerWidth * 0.10,
        y: window.innerHeight * 0.35,
        vx: -0.5,
        vy: -0.5,
        size: 76,
        rotation: 0,
        vRot: -0.5,
        color: "#06b6d4",
        bgGlow: "rgba(6, 182, 212, 0.55)",
      },
      {
        id: 5,
        name: "Trophy",
        emoji: "🏆",
        icon: <Trophy className="w-10 h-10 text-amber-400" />,
        x: window.innerWidth * 0.48,
        y: window.innerHeight * 0.28,
        vx: 0.4,
        vy: -0.4,
        size: 82,
        rotation: 0,
        vRot: 0.3,
        color: "#fbbf24",
        bgGlow: "rgba(251, 191, 36, 0.55)",
      },
    ];

    itemsRef.current = initialItems;
    setItems(initialItems);
  }, []);

  // Global mouse move & touch listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseUp = () => {
      if (draggingIdRef.current !== null) {
        const flickVx = (mouseRef.current.x - mouseRef.current.prevX) * 0.6;
        const flickVy = (mouseRef.current.y - mouseRef.current.prevY) * 0.6;

        itemsRef.current = itemsRef.current.map((item) => {
          if (item.id === draggingIdRef.current) {
            return {
              ...item,
              vx: Math.max(-14, Math.min(14, flickVx || (Math.random() - 0.5) * 4)),
              vy: Math.max(-14, Math.min(14, flickVy || (Math.random() - 0.5) * 4)),
            };
          }
          return item;
        });

        playSound("kick");
        draggingIdRef.current = null;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [playSound]);

  // Main 60 FPS Physics & Canvas Particle Loop
  useEffect(() => {
    let lastTime = performance.now();

    const updatePhysics = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const windowW = typeof window !== "undefined" ? window.innerWidth : 1200;
      const windowH = typeof window !== "undefined" ? window.innerHeight : 800;
      const mouse = mouseRef.current;
      const draggingId = draggingIdRef.current;

      itemsRef.current = itemsRef.current.map((item) => {
        let { x, y, vx, vy, rotation, vRot, size } = item;

        // --- 1. Dynamic Collision Wall with Red Venue Ticker Strip ---
        const margin = size / 2 + 10;
        let maxY = windowH - margin;

        const stripEl = document.getElementById("venue-ticker-strip");
        if (stripEl) {
          const rect = stripEl.getBoundingClientRect();
          if (rect.top > 0 && rect.top < windowH) {
            maxY = Math.min(maxY, rect.top - size / 2 - 8);
          }
        }

        if (item.id === draggingId) {
          x = Math.max(margin, Math.min(windowW - margin, mouse.x));
          y = Math.min(mouse.y, maxY);
          vx = (mouse.x - mouse.prevX) * 0.6;
          vy = (mouse.y - mouse.prevY) * 0.6;
          vRot = vx * 0.2;
        } else {
          // --- 2. Cursor Repulsion Force Field ---
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.hypot(dx, dy);
          const repelRadius = 180;

          if (dist < repelRadius && dist > 1) {
            const force = (1 - dist / repelRadius) * 2.5;
            vx += (dx / dist) * force;
            vy += (dy / dist) * force;
            vRot += (dx > 0 ? 0.35 : -0.35) * force;
          }

          // --- 3. Update Position & Rotation ---
          x += vx;
          y += vy;
          rotation += vRot;

          // --- 4. Air Resistance / Friction ---
          vx *= 0.985;
          vy *= 0.985;
          vRot *= 0.98;

          if (Math.abs(vx) < 0.15) vx += (Math.random() - 0.5) * 0.08;
          if (Math.abs(vy) < 0.15) vy += (Math.random() - 0.5) * 0.08;

          // Horizontal Bouncing
          if (x < margin) {
            x = margin;
            vx = Math.abs(vx) * 0.8;
          } else if (x > windowW - margin) {
            x = windowW - margin;
            vx = -Math.abs(vx) * 0.8;
          }

          // Vertical Bouncing (Bounces off top ceiling & top of red venue ticker strip!)
          if (y < margin) {
            y = margin;
            vy = Math.abs(vy) * 0.8;
          } else if (y > maxY) {
            y = maxY;
            vy = -Math.abs(vy) * 0.85; // Bounce back UP!
            vRot += (Math.random() - 0.5) * 2.5;
          }
        }

        return {
          ...item,
          x,
          y,
          vx,
          vy,
          rotation,
          vRot,
        };
      });

      setItems([...itemsRef.current]);

      // Render Sparkle Particles
      const canvas = particleCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          if (canvas.width !== windowW || canvas.height !== windowH) {
            canvas.width = windowW;
            canvas.height = windowH;
          }

          ctx.clearRect(0, 0, windowW, windowH);

          particlesRef.current.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.life += 1;

            const alpha = Math.max(0, 1 - p.life / 25);
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.random() * 3.5 + 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          });

          particlesRef.current = particlesRef.current.filter((p) => p.life < 25);
        }
      }

      animRef.current = requestAnimationFrame(updatePhysics);
    };

    animRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, []);

  const spawnSparkles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      particlesRef.current.push({
        id: Math.random(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        color,
      });
    }
  };

  const handleMouseDown = (id: number, item: SportsItem, e: React.MouseEvent) => {
    e.stopPropagation();
    draggingIdRef.current = id;
    playSound("click");
    spawnSparkles(item.x, item.y, item.color);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Particle Canvas Overlay */}
      <canvas ref={particleCanvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Curated Larger Interactive Sports Icons (Layered Behind Texts) */}
      {items.map((item) => {
        const isDragging = draggingIdRef.current === item.id;

        return (
          <div
            key={item.id}
            onMouseDown={(e) => handleMouseDown(item.id, item, e)}
            className={`absolute pointer-events-auto cursor-grab active:cursor-grabbing transition-transform duration-75 flex items-center justify-center rounded-full backdrop-blur-xl border-2 ring-2 ring-offset-2 ring-offset-black/60 shadow-2xl ${
              isDragging
                ? "scale-125 z-10 ring-red-500 border-red-400"
                : "hover:scale-115 z-0 ring-white/30"
            }`}
            style={{
              left: `${item.x}px`,
              top: `${item.y}px`,
              width: `${item.size}px`,
              height: `${item.size}px`,
              transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
              backgroundColor: "rgba(10, 10, 15, 0.88)",
              borderColor: item.color,
              boxShadow: `0 0 30px ${item.bgGlow}, 0 0 15px ${item.color}, inset 0 0 15px rgba(255,255,255,0.2)`,
            }}
            title={`Interactive ${item.name} — Drag or flick around!`}
          >
            <div className="pointer-events-none flex items-center justify-center">
              {item.icon}
            </div>
          </div>
        );
      })}
    </div>
  );
}
