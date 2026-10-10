"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useGemsStore } from "@/store/gemsStore";
import { useSoundStore } from "@/store/soundStore";
import {
  Trophy,
  RefreshCw,
  Target,
  Volume2,
  VolumeX,
  Gamepad2,
  Sparkles,
  Timer,
} from "lucide-react";

// Target types definition
type TargetType = "standard" | "gold" | "extra" | "penalty" | "defender";

interface TargetObj {
  id: number;
  x: number; // percentage 10 to 90
  y: number; // percentage 15 to 55
  baseY: number;
  vx: number;
  type: TargetType;
  points: number;
  radius: number;
  phase: number;
  amplitude: number;
  hitEffectTimer?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  shape?: "circle" | "star" | "gem";
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
  alpha: number;
  vy: number;
}

type GameMode = "classic" | "speed";
type BallSkin = "classic" | "fireball" | "cyber" | "gem";

export default function TargetShootoutGame() {
  const { addGems, updateHighScore, highScore } = useGemsStore();
  const { playSound, soundEnabled, toggleSound } = useSoundStore();

  // Mode and Skin settings
  const [mode, setMode] = useState<GameMode>("classic");
  const [ballSkin, setBallSkin] = useState<BallSkin>("classic");

  // Game state
  const [shotsLeft, setShotsLeft] = useState(5);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [gemsEarned, setGemsEarned] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [shotsHit, setShotsHit] = useState(0);
  const [totalShotsFired, setTotalShotsFired] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(true);

  // Sync state refs so canvas animation loop doesn't restart on every state update
  const modeRef = useRef(mode);
  const ballSkinRef = useRef(ballSkin);
  const shotsLeftRef = useRef(shotsLeft);
  const timeLeftRef = useRef(timeLeft);
  const scoreRef = useRef(score);
  const streakRef = useRef(streak);
  const gameOverRef = useRef(gameOver);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    ballSkinRef.current = ballSkin;
  }, [ballSkin]);
  useEffect(() => {
    shotsLeftRef.current = shotsLeft;
  }, [shotsLeft]);
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  useEffect(() => {
    streakRef.current = streak;
  }, [streak]);
  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  // Canvas & animation refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Pointer position for aiming trajectory line
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);

  // Interactive 3D Cursor Repulsion Box Physics State
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [boxTransform, setBoxTransform] = useState(
    "perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0,0,0)"
  );
  const [boxGlow, setBoxGlow] = useState("0 25px 50px -12px rgba(0, 0, 0, 0.7)");

  const handleMouseMoveBox = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cX = rect.left + rect.width / 2;
    const cY = rect.top + rect.height / 2;

    const mouseX = e.clientX - cX;
    const mouseY = e.clientY - cY;

    // Repulsion physics calculation: container tilts away & repels from cursor position
    const rotX = (mouseY / (rect.height / 2)) * -5;
    const rotY = (mouseX / (rect.width / 2)) * 5;
    const transX = (mouseX / (rect.width / 2)) * -6;
    const transY = (mouseY / (rect.height / 2)) * -6;

    setBoxTransform(
      `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translate3d(${transX.toFixed(2)}px, ${transY.toFixed(2)}px, 12px)`
    );
    setBoxGlow(
      `${-transX * 3}px ${-transY * 3}px 45px rgba(239, 68, 68, 0.35), 0 25px 50px -12px rgba(0, 0, 0, 0.8)`
    );
  };

  const handleMouseLeaveBox = () => {
    setBoxTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)");
    setBoxGlow("0 25px 50px -12px rgba(0, 0, 0, 0.7)");
  };

  // Gameplay physics refs - persistent target positions
  const targetsRef = useRef<TargetObj[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatersRef = useRef<FloatingText[]>([]);

  // Ball trajectory flight ref
  const ballRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    progress: number; // 0 to 1
    duration: number; // frames (~20 frames @ 60fps = 0.33s)
    rotation: number;
  }>({
    active: false,
    startX: 50,
    startY: 88,
    targetX: 50,
    targetY: 88,
    progress: 0,
    duration: 20,
    rotation: 0,
  });

  const nextFloaterId = useRef(1);

  // Initialize target objects (ONLY called on game start / restart)
  const initTargets = useCallback(() => {
    targetsRef.current = [
      {
        id: 1,
        x: 22,
        y: 20,
        baseY: 20,
        vx: 0.35,
        type: "gold",
        points: 150,
        radius: 22,
        phase: 0,
        amplitude: 8,
      },
      {
        id: 2,
        x: 75,
        y: 30,
        baseY: 30,
        vx: -0.4,
        type: "standard",
        points: 50,
        radius: 24,
        phase: Math.PI / 2,
        amplitude: 10,
      },
      {
        id: 3,
        x: 45,
        y: 45,
        baseY: 45,
        vx: 0.3,
        type: "extra",
        points: 100,
        radius: 20,
        phase: Math.PI,
        amplitude: 6,
      },
      {
        id: 4,
        x: 82,
        y: 22,
        baseY: 22,
        vx: -0.45,
        type: "penalty",
        points: -50,
        radius: 22,
        phase: Math.PI * 1.5,
        amplitude: 12,
      },
      {
        id: 5,
        x: 50,
        y: 35,
        baseY: 35,
        vx: 0.55,
        type: "defender",
        points: 0,
        radius: 26,
        phase: 0,
        amplitude: 0,
      },
    ];
  }, []);

  // Initialize targets once on initial mount
  useEffect(() => {
    initTargets();
  }, [initTargets]);

  // Timer loop for Speed Time Attack mode
  useEffect(() => {
    if (mode !== "speed" || gameOver || !gameStarted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mode, gameOver, gameStarted]);

  // Restart game handler
  const restartGame = (selectedMode: GameMode = mode) => {
    setMode(selectedMode);
    setShotsLeft(selectedMode === "classic" ? 5 : 999);
    setTimeLeft(30);
    setScore(0);
    setGemsEarned(0);
    setStreak(0);
    setMaxStreak(0);
    setShotsHit(0);
    setTotalShotsFired(0);
    setGameOver(false);
    setGameStarted(true);

    ballRef.current.active = false;
    ballRef.current.progress = 0;

    particlesRef.current = [];
    floatersRef.current = [];
    initTargets();
    playSound("click");
  };

  // Trigger end of game
  const triggerGameOver = () => {
    setGameOver(true);
    playSound("win");

    const canvas = canvasRef.current;
    if (canvas) {
      const width = canvas.width;
      const height = canvas.height;
      for (let i = 0; i < 60; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 2;
        particlesRef.current.push({
          x: width / 2,
          y: height / 3,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          life: 0,
          maxLife: Math.random() * 40 + 30,
          color: ["#f59e0b", "#ef4444", "#10b981", "#3b82f6", "#ec4899"][
            Math.floor(Math.random() * 5)
          ],
          size: Math.random() * 6 + 3,
          shape: Math.random() > 0.5 ? "star" : "circle",
        });
      }
    }
  };

  // Helper to spawn explosion particles on hit
  const spawnHitParticles = (xPx: number, yPx: number, type: TargetType) => {
    const count = type === "gold" ? 30 : type === "penalty" ? 25 : 18;
    const colors =
      type === "gold"
        ? ["#f59e0b", "#fbbf24", "#fef08a", "#ffffff"]
        : type === "penalty"
        ? ["#ef4444", "#dc2626", "#991b1b", "#000000"]
        : type === "extra"
        ? ["#06b6d4", "#22d3ee", "#e0f2fe", "#ffffff"]
        : type === "defender"
        ? ["#9333ea", "#a855f7", "#e9d5ff"]
        : ["#10b981", "#34d399", "#a7f3d0", "#ffffff"];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 1.5;
      particlesRef.current.push({
        x: xPx,
        y: yPx,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 0,
        maxLife: Math.random() * 25 + 15,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 5 + 2,
        shape: type === "gold" ? "star" : type === "extra" ? "gem" : "circle",
      });
    }
  };

  // Add floating feedback text
  const addFloater = (xPct: number, yPct: number, text: string, color: string) => {
    floatersRef.current.push({
      id: nextFloaterId.current++,
      x: xPct,
      y: yPct,
      text,
      color,
      size: 18,
      alpha: 1,
      vy: -0.6,
    });
  };

  // Shoot ball towards target point
  const handleShoot = (targetXPct: number, targetYPct: number) => {
    if (gameOverRef.current) {
      restartGame(modeRef.current);
      return;
    }
    if (ballRef.current.active) return;

    if (modeRef.current === "classic") {
      if (shotsLeftRef.current <= 0) {
        triggerGameOver();
        return;
      }
      const nextShots = Math.max(0, shotsLeftRef.current - 1);
      shotsLeftRef.current = nextShots;
      setShotsLeft(nextShots);
    }

    playSound("kick");
    setTotalShotsFired((prev) => prev + 1);

    ballRef.current = {
      active: true,
      startX: 50,
      startY: 88,
      targetX: targetXPct,
      targetY: targetYPct,
      progress: 0,
      duration: 20,
      rotation: 0,
    };
  };

  // Process hit logic when ball lands (uses refs so it doesn't re-create)
  const processImpact = useCallback(
    (targetXPct: number, targetYPct: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = canvas.width;
      const h = canvas.height;

      const ballPxX = (targetXPct / 100) * w;
      const ballPxY = (targetYPct / 100) * h;

      let hitTarget: TargetObj | null = null;

      for (const t of targetsRef.current) {
        const tPxX = (t.x / 100) * w;
        const tPxY = (t.y / 100) * h;
        const dist = Math.hypot(ballPxX - tPxX, ballPxY - tPxY);

        if (dist <= t.radius + 12) {
          hitTarget = t;
          break;
        }
      }

      const currentScore = scoreRef.current;
      const currentStreak = streakRef.current;
      const currentMode = modeRef.current;

      if (hitTarget) {
        setShotsHit((prev) => prev + 1);
        spawnHitParticles(ballPxX, ballPxY, hitTarget.type);

        // Flash target hit ring indicator effect without jumping position!
        hitTarget.hitEffectTimer = 15;

        // Bounce target speed smoothly in opposite direction on hit
        hitTarget.vx = -hitTarget.vx;

        if (hitTarget.type === "defender") {
          playSound("penalty");
          setStreak(0);
          addFloater(targetXPct, targetYPct, "BLOCKED BY DEFENDER!", "#a855f7");
        } else if (hitTarget.type === "penalty") {
          playSound("penalty");
          setStreak(0);
          const penPts = hitTarget.points;
          const newScore = Math.max(0, currentScore + penPts);
          setScore(newScore);
          addFloater(targetXPct, targetYPct, `${penPts} PENALTY!`, "#ef4444");
        } else {
          const newStreak = currentStreak + 1;
          setStreak(newStreak);
          setMaxStreak((prev) => Math.max(prev, newStreak));

          const multiplier =
            newStreak >= 5 ? 5 : newStreak >= 3 ? 3 : newStreak >= 2 ? 2 : 1;

          const basePts = hitTarget.points;
          const totalPts = basePts * multiplier;
          const gems = Math.round(totalPts / 2);

          const newScore = currentScore + totalPts;
          setScore(newScore);
          setGemsEarned((g) => g + gems);
          addGems(gems);

          if (multiplier >= 3) {
            playSound("combo");
            addFloater(
              targetXPct,
              targetYPct,
              `🔥 ${multiplier}X STREAK! +${totalPts} PTS (+${gems} GEMS)`,
              "#f59e0b"
            );
          } else if (hitTarget.type === "gold") {
            playSound("swish");
            addFloater(
              targetXPct,
              targetYPct,
              `GOLDEN HIT! +${totalPts} PTS (+${gems} GEMS)`,
              "#fbbf24"
            );
          } else if (hitTarget.type === "extra") {
            playSound("extraShot");
            if (currentMode === "classic") {
              setShotsLeft((s) => s + 1);
              addFloater(
                targetXPct,
                targetYPct,
                `+1 EXTRA SHOT! +${totalPts} PTS`,
                "#22d3ee"
              );
            } else {
              setTimeLeft((t) => t + 5);
              addFloater(
                targetXPct,
                targetYPct,
                `+5 SECONDS! +${totalPts} PTS`,
                "#22d3ee"
              );
            }
          } else {
            playSound("score");
            addFloater(
              targetXPct,
              targetYPct,
              `+${totalPts} PTS (+${gems} GEMS)`,
              "#10b981"
            );
          }
        }
      } else {
        playSound("click");
        setStreak(0);
        addFloater(targetXPct, targetYPct, "MISS!", "#71717a");
      }

      if (currentMode === "classic" && shotsLeftRef.current - 1 <= 0) {
        setTimeout(() => {
          triggerGameOver();
          updateHighScore(scoreRef.current);
        }, 300);
      } else if (currentMode === "speed") {
        updateHighScore(scoreRef.current);
      }
    },
    [addGems, playSound, updateHighScore]
  );

  // Main 60 FPS Canvas Render Loop (Decoupled from state re-renders)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 1;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      if (
        canvas.width !== rect.width * dpr ||
        canvas.height !== rect.height * dpr
      ) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // --- 1. Draw Field Graphics ---
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(0, h * 0.55);
      ctx.lineTo(w, h * 0.55);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(w / 2, h * 0.55, 45, 0, Math.PI * 2);
      ctx.stroke();

      // Goal box
      ctx.fillStyle = "rgba(239, 68, 68, 0.06)";
      ctx.strokeStyle = "rgba(239, 68, 68, 0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(w * 0.15, h * 0.08, w * 0.7, h * 0.45, 16);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = "rgba(239, 68, 68, 0.08)";
      ctx.lineWidth = 1;
      for (let xPx = w * 0.15; xPx <= w * 0.85; xPx += 20) {
        ctx.beginPath();
        ctx.moveTo(xPx, h * 0.08);
        ctx.lineTo(xPx, h * 0.53);
        ctx.stroke();
      }

      // --- 2. Update & Draw Smooth Moving Targets ---
      targetsRef.current.forEach((t) => {
        // Move Target horizontally smoothly back & forth within fixed bounds
        t.x += t.vx;
        if (t.x > 82) {
          t.x = 82;
          t.vx = -Math.abs(t.vx);
        } else if (t.x < 18) {
          t.x = 18;
          t.vx = Math.abs(t.vx);
        }

        // Sine wave vertical float
        t.phase += 0.03;
        t.y = t.baseY + (Math.sin(t.phase) * t.amplitude) / 10;

        const pxX = (t.x / 100) * w;
        const pxY = (t.y / 100) * h;

        ctx.save();
        ctx.translate(pxX, pxY);

        const pulse = Math.sin(time * 0.1 + t.id) * 3;
        let extraRadius = 0;
        if (t.hitEffectTimer && t.hitEffectTimer > 0) {
          t.hitEffectTimer -= 1;
          extraRadius = t.hitEffectTimer * 0.8;
        }

        if (t.type === "gold") {
          ctx.shadowColor = "#f59e0b";
          ctx.shadowBlur = 15;
          ctx.fillStyle = "#78350f";
          ctx.strokeStyle = "#fbbf24";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, t.radius + pulse + extraRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.strokeStyle = "#fef08a";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, t.radius * 0.6, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = "#fbbf24";
          ctx.font = "900 11px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`+${t.points}`, 0, 0);
        } else if (t.type === "extra") {
          ctx.shadowColor = "#06b6d4";
          ctx.shadowBlur = 12;
          ctx.fillStyle = "#164e63";
          ctx.strokeStyle = "#22d3ee";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, t.radius + pulse + extraRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#67e8f9";
          ctx.font = "900 10px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(modeRef.current === "classic" ? "+1 SHOT" : "+5 SEC", 0, 0);
        } else if (t.type === "penalty") {
          ctx.shadowColor = "#ef4444";
          ctx.shadowBlur = 12;
          ctx.fillStyle = "#450a0a";
          ctx.strokeStyle = "#f87171";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, t.radius + extraRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#fca5a5";
          ctx.font = "900 10px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("-50 PTS", 0, 0);
        } else if (t.type === "defender") {
          ctx.shadowColor = "#a855f7";
          ctx.shadowBlur = 10;
          ctx.fillStyle = "#3b0764";
          ctx.strokeStyle = "#c084fc";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(-t.radius, -12, t.radius * 2, 24, 8);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#e9d5ff";
          ctx.font = "900 9px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("SHIELD", 0, 0);
        } else {
          ctx.shadowColor = "#10b981";
          ctx.shadowBlur = 10;
          ctx.fillStyle = "#064e3b";
          ctx.strokeStyle = "#34d399";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, t.radius + pulse * 0.5 + extraRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#a7f3d0";
          ctx.font = "900 11px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`+${t.points}`, 0, 0);
        }
        ctx.restore();
      });

      // --- 3. Draw Dotted Aiming Trajectory Line ---
      if (!ballRef.current.active && mousePosRef.current && !gameOverRef.current) {
        const ballPxX = (50 / 100) * w;
        const ballPxY = (88 / 100) * h;
        const aimPxX = mousePosRef.current.x;
        const aimPxY = mousePosRef.current.y;

        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(ballPxX, ballPxY);
        ctx.lineTo(aimPxX, aimPxY);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.strokeStyle = "rgba(239, 68, 68, 0.7)";
        ctx.beginPath();
        ctx.arc(aimPxX, aimPxY, 14, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // --- 4. Update & Draw Particles ---
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.life += 1;

        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife);

      // --- 5. Update & Draw Ball Flight Trajectory ---
      const ball = ballRef.current;
      const skin = ballSkinRef.current;

      if (ball.active) {
        ball.progress += 1 / ball.duration;
        ball.rotation += 0.3;

        const curXPct = ball.startX + (ball.targetX - ball.startX) * ball.progress;
        const curYPct = ball.startY + (ball.targetY - ball.startY) * ball.progress;

        const ballPxX = (curXPct / 100) * w;
        const ballPxY = (curYPct / 100) * h;

        const arcZ = Math.sin(ball.progress * Math.PI) * 40;
        const drawPxY = ballPxY - arcZ;

        const scale = 1.0 - ball.progress * 0.5;
        const radius = 18 * scale;

        ctx.save();
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.beginPath();
        ctx.ellipse(ballPxX, ballPxY + 10, radius * 1.2, radius * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (time % 2 === 0) {
          particlesRef.current.push({
            x: ballPxX,
            y: drawPxY,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            life: 0,
            maxLife: 15,
            color:
              skin === "fireball"
                ? "#ef4444"
                : skin === "cyber"
                ? "#06b6d4"
                : skin === "gem"
                ? "#10b981"
                : "rgba(255,255,255,0.6)",
            size: Math.random() * 4 + 2,
          });
        }

        ctx.save();
        ctx.translate(ballPxX, drawPxY);
        ctx.rotate(ball.rotation);

        if (skin === "fireball") {
          ctx.shadowColor = "#ef4444";
          ctx.shadowBlur = 20;
          const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, radius);
          grad.addColorStop(0, "#fef08a");
          grad.addColorStop(0.5, "#f97316");
          grad.addColorStop(1, "#dc2626");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (skin === "cyber") {
          ctx.shadowColor = "#06b6d4";
          ctx.shadowBlur = 20;
          ctx.fillStyle = "#0284c7";
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (skin === "gem") {
          ctx.shadowColor = "#10b981";
          ctx.shadowBlur = 20;
          ctx.fillStyle = "#059669";
          ctx.strokeStyle = "#6ee7b7";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.shadowColor = "rgba(0,0,0,0.5)";
          ctx.shadowBlur = 10;
          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "#18181b";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#18181b";
          ctx.beginPath();
          ctx.arc(0, 0, radius * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        if (ball.progress >= 1.0) {
          ball.active = false;
          processImpact(ball.targetX, ball.targetY);
        }
      } else if (!gameOverRef.current) {
        const ballPxX = (50 / 100) * w;
        const ballPxY = (88 / 100) * h;

        ctx.save();
        ctx.shadowColor = "rgba(239, 68, 68, 0.6)";
        ctx.shadowBlur = 15;
        ctx.fillStyle =
          skin === "fireball"
            ? "#ea580c"
            : skin === "cyber"
            ? "#0284c7"
            : skin === "gem"
            ? "#059669"
            : "#ffffff";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ballPxX, ballPxY, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // --- 6. Update & Draw Floating Feedback Text ---
      floatersRef.current.forEach((f) => {
        f.y += f.vy;
        f.alpha -= 0.018;

        if (f.alpha > 0) {
          const pxX = (f.x / 100) * w;
          const pxY = (f.y / 100) * h;

          ctx.save();
          ctx.globalAlpha = Math.max(0, f.alpha);
          ctx.font = "900 13px sans-serif";
          ctx.fillStyle = f.color;
          ctx.shadowColor = "rgba(0,0,0,0.8)";
          ctx.shadowBlur = 6;
          ctx.textAlign = "center";
          ctx.fillText(f.text, pxX, pxY);
          ctx.restore();
        }
      });

      floatersRef.current = floatersRef.current.filter((f) => f.alpha > 0);

      ctx.restore();
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [processImpact]);

  // Accuracy calculation
  const accuracyPct =
    totalShotsFired > 0 ? Math.round((shotsHit / totalShotsFired) * 100) : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMoveBox}
      onMouseLeave={handleMouseLeaveBox}
      style={{
        transform: boxTransform,
        boxShadow: boxGlow,
        transition: "transform 0.15s ease-out, box-shadow 0.15s ease-out",
      }}
      className="w-full max-w-4xl mx-auto my-8 bg-zinc-950/95 border border-zinc-800 rounded-3xl p-5 sm:p-8 relative overflow-hidden text-white select-none backdrop-blur-xl"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Controls & Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-zinc-900 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/70 text-red-400 text-[10px] font-black uppercase tracking-widest border border-red-500/40 shadow-sm">
              <Gamepad2 className="w-3.5 h-3.5 text-red-500" />
              <span>60 FPS ARENA MINI-GAME</span>
            </span>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[10px] font-bold border border-zinc-800 flex items-center gap-1 cursor-pointer transition"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-red-500" />
              )}
              <span>{soundEnabled ? "SOUND ON" : "MUTED"}</span>
            </button>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mt-1.5 flex items-center gap-2">
            <span>ARENA TARGET SHOOTOUT</span>
            <Target className="w-6 h-6 text-red-500 animate-pulse" />
          </h2>
          <p className="text-xs text-zinc-400 font-medium mt-0.5">
            Aim using mouse/touch & click to shoot. Chain streaks for multiplier bonuses and earn profile Gems!
          </p>
        </div>

        {/* HUD Box */}
        <div className="flex items-center gap-2 sm:gap-3 bg-black/80 p-3 rounded-2xl border border-zinc-900 font-mono text-xs font-black shrink-0 justify-between sm:justify-end">
          {mode === "classic" ? (
            <div className="text-center px-2">
              <span className="text-[9px] text-zinc-500 block uppercase">SHOTS</span>
              <span className="text-red-400 text-base">{shotsLeft}/5</span>
            </div>
          ) : (
            <div className="text-center px-2">
              <span className="text-[9px] text-zinc-500 block uppercase">TIME</span>
              <span className="text-amber-400 text-base">{timeLeft}s</span>
            </div>
          )}

          <div className="w-[1px] h-8 bg-zinc-800" />
          <div className="text-center px-2">
            <span className="text-[9px] text-zinc-500 block uppercase">SCORE</span>
            <span className="text-white text-base">{score}</span>
          </div>
          <div className="w-[1px] h-8 bg-zinc-800" />
          <div className="text-center px-2">
            <span className="text-[9px] text-zinc-500 block uppercase font-sans">COMBO</span>
            <span
              className={`text-base ${
                streak >= 3
                  ? "text-amber-400 animate-bounce"
                  : streak >= 2
                  ? "text-emerald-400"
                  : "text-zinc-400"
              }`}
            >
              {streak > 1 ? `${streak}x 🔥` : "1x"}
            </span>
          </div>
          <div className="w-[1px] h-8 bg-zinc-800" />
          <div className="text-center px-2">
            <span className="text-[9px] text-zinc-500 block uppercase">BEST</span>
            <span className="text-amber-400 text-base">{highScore}</span>
          </div>
        </div>
      </div>

      {/* Mode & Ball Selector Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 bg-zinc-900/60 p-2.5 rounded-2xl border border-zinc-800/80">
        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-1">MODE:</span>
          <button
            onClick={() => restartGame("classic")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1 ${
              mode === "classic"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                : "bg-zinc-800/80 text-zinc-400 hover:text-white"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>CLASSIC (5 SHOTS)</span>
          </button>
          <button
            onClick={() => restartGame("speed")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1 ${
              mode === "speed"
                ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
                : "bg-zinc-800/80 text-zinc-400 hover:text-white"
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>SPEED ATTACK (30S)</span>
          </button>
        </div>

        {/* Ball Skin Selector */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-1">BALL:</span>
          <button
            onClick={() => setBallSkin("classic")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              ballSkin === "classic"
                ? "bg-white text-black font-black"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            ⚽ Classic
          </button>
          <button
            onClick={() => setBallSkin("fireball")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              ballSkin === "fireball"
                ? "bg-red-500 text-white font-black"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            🔥 Fireball
          </button>
          <button
            onClick={() => setBallSkin("cyber")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              ballSkin === "cyber"
                ? "bg-cyan-500 text-black font-black"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            ⚡ Cyber
          </button>
          <button
            onClick={() => setBallSkin("gem")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              ballSkin === "gem"
                ? "bg-emerald-500 text-black font-black"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            💎 Gem
          </button>
        </div>
      </div>

      {/* Main Game Playing Canvas Arena */}
      <div className="relative w-full h-[340px] sm:h-[420px] bg-gradient-to-b from-zinc-950 via-zinc-900 to-black rounded-2xl border-2 border-zinc-800 overflow-hidden shadow-inner cursor-crosshair">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            mousePosRef.current = {
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            };
          }}
          onMouseLeave={() => {
            mousePosRef.current = null;
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickXPct = ((e.clientX - rect.left) / rect.width) * 100;
            const clickYPct = ((e.clientY - rect.top) / rect.height) * 100;
            handleShoot(clickXPct, clickYPct);
          }}
        />

        {/* Game Over Screen Overlay Modal */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 z-30 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 animate-bounce shadow-xl">
              <Trophy className="w-8 h-8 text-amber-400" />
            </div>

            <h3 className="text-3xl font-black uppercase text-white tracking-tight">
              SHOOTOUT COMPLETE!
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800 w-full max-w-lg font-mono">
              <div className="text-center p-2 bg-black/50 rounded-xl">
                <span className="text-[10px] text-zinc-500 block uppercase">FINAL SCORE</span>
                <span className="text-white text-lg font-black">{score}</span>
              </div>
              <div className="text-center p-2 bg-black/50 rounded-xl">
                <span className="text-[10px] text-zinc-500 block uppercase">GEMS EARNED</span>
                <span className="text-amber-400 text-lg font-black">+{gemsEarned}</span>
              </div>
              <div className="text-center p-2 bg-black/50 rounded-xl">
                <span className="text-[10px] text-zinc-500 block uppercase">ACCURACY</span>
                <span className="text-emerald-400 text-lg font-black">{accuracyPct}%</span>
              </div>
              <div className="text-center p-2 bg-black/50 rounded-xl">
                <span className="text-[10px] text-zinc-500 block uppercase">MAX STREAK</span>
                <span className="text-rose-400 text-lg font-black">{maxStreak}x</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => restartGame(mode)}
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
              <a
                href="/gems"
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-zinc-800 transition"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Redeem Gems Perks</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Target Legend Footer */}
      <div className="mt-4 pt-3 border-t border-zinc-900 flex flex-wrap items-center justify-between text-[11px] font-medium text-zinc-400 gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-300" />
            Gold Target (+150 PTS)
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-300" />
            Standard Target (+50 PTS)
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-cyan-300" />
            Bonus Extra Target (+1 Shot/5s)
          </span>
          <span className="flex items-center gap-1.5 text-purple-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 border border-purple-300" />
            Goalkeeper Shield (Blocks)
          </span>
          <span className="flex items-center gap-1.5 text-red-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-red-300" />
            Penalty (-50 PTS)
          </span>
        </div>

        <div className="text-zinc-500 text-[10px]">
          Total Earned Gems automatically synced to your profile balance.
        </div>
      </div>
    </div>
  );
}
