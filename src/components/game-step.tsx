import { useRef, useEffect, useState } from "react";
import { Button, Text, VStack } from "@chakra-ui/react";

const W = 400;
const H = 270;
const CX = W / 2;
const CY = 88;
const CR = 26;
const BX = W / 2;
const BY = 220;
const BALL_R = 13;
const GRAVITY = 0.22;
const MIN_RING = CR + 6;
const MAX_RING = CR + 42;

interface Props { nextStep: () => void }

export default function GameStep({ nextStep }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [won, setWon] = useState(false);
  const [hint, setHint] = useState("Segure e arraste para cima para capturar o pokémon!");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const eevee = new Image();
    eevee.src = "/images/eeve.png";

    const s = {
      bx: BX, by: BY, bvx: 0, bvy: 0,
      flying: false,
      dragging: false,
      dragX: BX, dragY: BY,
      ringR: MAX_RING,
      ringDir: -1 as 1 | -1,
      cShake: 0,
      phase: "ready" as "ready" | "flying" | "caught",
      frame: 0,
      won: false,
    };

    function resetBall() {
      s.bx = BX; s.by = BY; s.bvx = 0; s.bvy = 0;
      s.flying = false; s.dragging = false;
      s.dragX = BX; s.dragY = BY;
      s.phase = "ready";
    }

    function drawCreature() {
      const size = CR * 3.5;
      const ox = s.cShake > 0 ? Math.sin(s.cShake * 0.9) * 5 : 0;
      ctx.save();
      ctx.translate(CX + ox, CY);
      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.beginPath(); ctx.ellipse(0, CR + 6, CR * 0.75, 6, 0, 0, Math.PI * 2); ctx.fill();
      // Eevee image centered
      if (eevee.complete && eevee.naturalWidth > 0) {
        ctx.drawImage(eevee, -size / 2, -size / 2, size, size);
      }
      ctx.restore();
    }

    function drawRing() {
      if (s.phase === "caught") return;
      const t = (s.ringR - MIN_RING) / (MAX_RING - MIN_RING);
      const r = Math.round(t * 200);
      const g = Math.round(200 - t * 100);
      ctx.strokeStyle = `rgba(${r},${g},40,0.85)`;
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(CX, CY, s.ringR, 0, Math.PI * 2); ctx.stroke();
    }

    function drawBall(x: number, y: number) {
      ctx.save(); ctx.translate(x, y);

      if (!s.flying) {
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        ctx.beginPath(); ctx.ellipse(0, BALL_R + 4, BALL_R * 0.7, 4, 0, 0, Math.PI * 2); ctx.fill();
      }

      // Top half
      ctx.fillStyle = "#f07a22";
      ctx.beginPath(); ctx.arc(0, 0, BALL_R, Math.PI, 0, false); ctx.closePath(); ctx.fill();
      // Bottom half
      ctx.fillStyle = "#f5f5f5";
      ctx.beginPath(); ctx.arc(0, 0, BALL_R, 0, Math.PI, false); ctx.closePath(); ctx.fill();
      // Stripe
      ctx.fillStyle = "#2d3a4a";
      ctx.fillRect(-BALL_R, -2, BALL_R * 2, 4);
      // Button
      ctx.fillStyle = "white";
      ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#2d3a4a"; ctx.lineWidth = 1.5; ctx.stroke();
      // Outline
      ctx.strokeStyle = "#2d3a4a"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(0, 0, BALL_R, 0, Math.PI * 2); ctx.stroke();
      // Shine
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.beginPath(); ctx.ellipse(-4, -5, 3, 2, -0.5, 0, Math.PI * 2); ctx.fill();

      ctx.restore();
    }

    function drawTrajectory() {
      if (!s.dragging || s.dragY >= BY - 10) return;
      const dx = s.dragX - BX, dy = s.dragY - BY;
      const POWER = 0.12;
      let px = BX, py = BY, pvx = dx * POWER, pvy = dy * POWER;
      for (let i = 0; i < 24; i++) {
        pvy += GRAVITY; px += pvx; py += pvy;
        if (py > H) break;
        const r = Math.max(3.5 - i * 0.13, 0.5);
        ctx.fillStyle = `rgba(240,122,34,${0.55 - i * 0.02})`;
        ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
      }
    }

    function drawScene() {
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#e0f0e0"); bg.addColorStop(1, "#b0d8b0");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // Arena oval
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.beginPath(); ctx.ellipse(W / 2, H - 30, W * 0.42, 38, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.38)"; ctx.lineWidth = 2; ctx.stroke();

      // Ground
      ctx.fillStyle = "#7ab878"; ctx.fillRect(0, H - 32, W, 32);
      ctx.fillStyle = "#5c9e5a"; ctx.fillRect(0, H - 32, W, 7);
    }

    function drawHintBubble() {
      if (s.phase !== "ready" || s.flying || s.dragging) return;
      const text = "Segure e arraste ↑";
      ctx.font = "13px sans-serif";
      const tw = ctx.measureText(text).width;
      const bx = W / 2 - tw / 2 - 12, bw = tw + 24, bh = 26, bRadius = 8;
      const bby = BY + 24;
      ctx.fillStyle = "rgba(78,109,128,0.82)";
      ctx.beginPath();
      ctx.moveTo(bx + bRadius, bby);
      ctx.lineTo(bx + bw - bRadius, bby);
      ctx.arcTo(bx + bw, bby, bx + bw, bby + bRadius, bRadius);
      ctx.lineTo(bx + bw, bby + bh - bRadius);
      ctx.arcTo(bx + bw, bby + bh, bx + bw - bRadius, bby + bh, bRadius);
      ctx.lineTo(bx + bRadius, bby + bh);
      ctx.arcTo(bx, bby + bh, bx, bby + bh - bRadius, bRadius);
      ctx.lineTo(bx, bby + bRadius);
      ctx.arcTo(bx, bby, bx + bRadius, bby, bRadius);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "white"; ctx.textAlign = "center";
      ctx.fillText(text, W / 2, bby + 17);
    }

    function drawCaughtOverlay() {
      if (s.phase !== "caught" || s.cShake > 0) return;
      ctx.fillStyle = "rgba(0,0,0,0.38)"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "white"; ctx.textAlign = "center";
      ctx.font = "bold 22px sans-serif"; ctx.fillText("🎉 Capturado!", W / 2, H / 2 - 8);
      ctx.font = "14px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.88)";
      ctx.fillText("Missão cumprida!", W / 2, H / 2 + 18);
    }

    function update() {
      s.frame++;

      if (s.phase !== "caught") {
        s.ringR += s.ringDir * 0.45;
        if (s.ringR <= MIN_RING) s.ringDir = 1;
        if (s.ringR >= MAX_RING) s.ringDir = -1;
      }

      if (s.flying) {
        s.bvy += GRAVITY;
        s.bx += s.bvx; s.by += s.bvy;

        const dx = s.bx - CX, dy = s.by - CY;
        if (Math.sqrt(dx * dx + dy * dy) < CR + BALL_R - 5) {
          s.phase = "caught"; s.flying = false; s.cShake = 35;
          if (!s.won) { s.won = true; setWon(true); setHint("Você capturou! 🎉"); }
        }

        if (s.bx < -30 || s.bx > W + 30 || s.by < -30 || s.by > H + 20) {
          resetBall(); setHint("Quase! Tente de novo 🎯");
        }
      }

      if (s.cShake > 0) s.cShake--;
    }

    function draw() {
      drawScene();
      drawRing();
      drawCreature();
      drawTrajectory();
      if (s.phase !== "caught") drawBall(s.bx, s.by);
      drawHintBubble();
      drawCaughtOverlay();
    }

    let reqId: number;
    function loop() { update(); draw(); reqId = requestAnimationFrame(loop); }
    reqId = requestAnimationFrame(loop);

    function getPos(e: MouseEvent | TouchEvent) {
      if (!canvas) throw new Error("Canvas not available");
      const rect = canvas.getBoundingClientRect();
      const sx = W / rect.width, sy = H / rect.height;
      if ("touches" in e) return { x: (e.touches[0].clientX - rect.left) * sx, y: (e.touches[0].clientY - rect.top) * sy };
      return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
    }

    function onDown(e: MouseEvent | TouchEvent) {
      if (s.flying || s.phase === "caught") return;
      e.preventDefault();
      const p = getPos(e);
      s.dragging = true; s.dragX = p.x; s.dragY = p.y;
    }

    function onMove(e: MouseEvent | TouchEvent) {
      if (!s.dragging) return;
      e.preventDefault();
      const p = getPos(e);
      s.dragX = p.x; s.dragY = p.y;
    }

    function onUp() {
      if (!s.dragging) return;
      s.dragging = false;
      const dy = s.dragY - BY;
      if (dy >= -10) return;
      const dx = s.dragX - BX;
      const POWER = 0.12;
      s.bvx = dx * POWER; s.bvy = dy * POWER;
      s.flying = true; s.phase = "flying";
    }

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("touchstart", onDown, { passive: false });
    canvas.addEventListener("touchmove", onMove, { passive: false });
    canvas.addEventListener("touchend", onUp);

    return () => {
      cancelAnimationFrame(reqId);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("touchstart", onDown);
      canvas.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("touchend", onUp);
    };
  }, []);

  return (
    <VStack textAlign="center" gap={2}>
      <Text fontSize="xl" fontWeight="bold">Vamos testar suas habilidades! 🎯</Text>
      <Text fontSize="sm" color="gray.500">{hint}</Text>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ width: "100%", borderRadius: "12px", border: "2px solid #4e6d80", cursor: "crosshair", touchAction: "none" }}
      />
      <Button
        w="full"
        bgGradient="linear(to-r, brandOrange, brandYellow)"
        color="white"
        onClick={nextStep}
        isDisabled={!won}
      >
        Continuar
      </Button>
    </VStack>
  );
}
