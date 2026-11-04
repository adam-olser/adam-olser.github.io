import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CAREER_LOG } from '../data/careerLog';

// Karel's world: a grid, a robot that hunts beepers, and a small shader for the glow.
// Click or tap the grid to drop a beeper. Each pickup reports the next career-log line.

export interface HeroProgress {
  picked: number;
  lines: ReadonlyArray<readonly [string, string]>;
}

interface Props {
  onProgress: (p: HeroProgress) => void;
  reduceMotion: boolean;
}

const VERT = 'void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }';
const FRAG = /* glsl */ `
precision highp float;
uniform vec2 uRes; uniform float uDpr, uCell, uCols, uRows, uTime, uBlink, uMove, uCA;
uniform sampler2D uHeat; uniform vec2 uBot, uDir, uMouse;
uniform vec3 uAccent, uBg, uInk;
vec4 tex(vec2 p){ return texture2D(uHeat, vec2(p.x/(uCols*uCell), 1.0 - p.y/(uRows*uCell))); }
float heat(vec2 p){ return tex(p).r; }
float rbox(vec2 q, vec2 c, vec2 b, float r){ return length(max(abs(q-c)-b+r, 0.0)) - r; }
float cov(float d){ return smoothstep(0.02, -0.02, d); }
void main(){
  vec2 p = vec2(gl_FragCoord.x, uRes.y*uDpr - gl_FragCoord.y) / uDpr;
  vec2 cellId = floor(p / uCell); vec2 f = fract(p / uCell) - 0.5; vec2 ctr = (cellId + 0.5) * uCell;
  float mdist = length(p - uMouse); float ca = uCA * smoothstep(180.0, 0.0, mdist) * uCell * 0.35;
  vec3 col = uBg;
  col = mix(col, uInk, 0.22 * smoothstep(0.07, 0.03, length(f)));
  float mask = smoothstep(0.38, 0.32, max(abs(f.x), abs(f.y)));
  vec3 core = vec3(heat(ctr + vec2(ca, 0.0)), heat(ctr), heat(ctr - vec2(ca, 0.0))) * mask;
  col = mix(col, uAccent, core * 0.6);
  float bl = 0.0;
  for (int i = 0; i < 8; i++){ float a = float(i) * 0.7854; bl += heat(p + vec2(cos(a), sin(a)) * uCell * 1.3); }
  col = mix(col, uAccent, clamp(bl / 8.0, 0.0, 1.0) * 0.4);
  float bp = tex(ctr).g; float dia = abs(f.x) + abs(f.y);
  float pulse = 0.5 + 0.5 * sin(uTime * 3.0 + cellId.x * 1.7 + cellId.y * 2.3);
  col = mix(col, uAccent, bp * 0.3 * (0.6 + 0.4 * pulse) * smoothstep(0.5, 0.05, length(f)));
  col = mix(col, uAccent, bp * smoothstep(0.27, 0.21, dia));
  col = mix(col, uBg, bp * smoothstep(0.1, 0.06, dia));
  vec2 q = (p - uBot) / (uCell * 1.7); q.y += sin(uTime * 14.0) * 0.015 * uMove;
  float halo = exp(-length(q) * 3.2) * 0.35; col = mix(col, uAccent, halo);
  float body = rbox(q, vec2(0.0, 0.06), vec2(0.30, 0.22), 0.07);
  float ant = min(rbox(q, vec2(0.0, -0.25), vec2(0.022, 0.07), 0.01), length(q - vec2(0.0, -0.36 - 0.02 * sin(uTime * 6.0))) - 0.05);
  float tread = min(rbox(q, vec2(-0.19, 0.33), vec2(0.1, 0.055), 0.04), rbox(q, vec2(0.19, 0.33), vec2(0.1, 0.055), 0.04));
  float visor = rbox(q, vec2(0.0, 0.03), vec2(0.21, 0.1), 0.05);
  vec2 ep = uDir * vec2(0.07, 0.05); float ey = 0.07 * uBlink;
  float eyes = min(rbox(q, vec2(-0.09, 0.03) + ep, vec2(0.04, max(ey, 0.008)), 0.03), rbox(q, vec2(0.09, 0.03) + ep, vec2(0.04, max(ey, 0.008)), 0.03));
  col = mix(col, uAccent, cov(min(min(body, ant), tread)));
  col = mix(col, uBg, cov(visor));
  col = mix(col, uAccent, cov(eyes));
  col *= 1.0 - 0.03 * step(0.5, fract(gl_FragCoord.y / (3.0 * uDpr)));
  vec2 uv = p / uRes; col = mix(col, uBg, smoothstep(0.35, 0.75, length((uv - 0.5) * vec2(1.0, 1.4))) * 0.6);
  gl_FragColor = vec4(col, 1.0);
}`;

const STEP_MS = 140;
const MAX_BEEPERS = 12;

// The site stores colors as "r g b" channel triplets in CSS variables.
function readColor(name: string, into: THREE.Color) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).map(Number);
  if (v.length === 3 && v.every((n) => !Number.isNaN(n))) into.setRGB(v[0] / 255, v[1] / 255, v[2] / 255);
}

export default function HeroCanvas({ onProgress, reduceMotion }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(onProgress);
  progressRef.current = onProgress;

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = canvas?.parentElement;
    if (!canvas || !stage) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    } catch {
      return; // no WebGL: the CSS dot-grid behind the canvas stays
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uRes: { value: new THREE.Vector2(1, 1) }, uDpr: { value: 1 }, uCell: { value: 28 }, uCols: { value: 1 }, uRows: { value: 1 },
      uTime: { value: 0 }, uBlink: { value: 1 }, uMove: { value: 1 }, uCA: { value: 1 },
      uHeat: { value: null as THREE.DataTexture | null },
      uBot: { value: new THREE.Vector2(-999, -999) }, uDir: { value: new THREE.Vector2(1, 0) }, uMouse: { value: new THREE.Vector2(-999, -999) },
      uAccent: { value: new THREE.Color() }, uBg: { value: new THREE.Color() }, uInk: { value: new THREE.Color() },
    };
    const material = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms });
    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));

    let cell = 28, cols = 1, rows = 1;
    let heat = new Float32Array(1), beepers = new Uint8Array(1), bytes = new Uint8Array(2);
    let tex: THREE.DataTexture | null = null;
    const bot = { x: 3, y: 3, dx: 1, dy: 0, px: 3, py: 3 };
    let lastStep = 0, visible = true, picked = 0, beeperCount = 0, raf = 0;
    let shown: Array<readonly [string, string]> = [];
    let mouseCell: { x: number; y: number } | null = null;

    const readTheme = () => {
      readColor('--color-primary', uniforms.uAccent.value);
      readColor('--color-surface-container', uniforms.uBg.value);
      readColor('--color-on-surface-variant', uniforms.uInk.value);
    };

    const report = () => progressRef.current({ picked, lines: shown });

    const spawn = (n: number) => {
      for (let k = 0, tries = 0; k < n && tries < 200 && beeperCount < MAX_BEEPERS; tries++) {
        const x = 1 + Math.floor(Math.random() * (cols - 2)), y = 1 + Math.floor(Math.random() * (rows - 2));
        const free = !beepers[y * cols + x] && Math.abs(x - bot.x) + Math.abs(y - bot.y) > 3;
        if (free) { beepers[y * cols + x] = 1; beeperCount++; k++; }
      }
    };

    const render = (t: number) => {
      const k = reduceMotion ? 1 : Math.min((t - lastStep) / STEP_MS, 1);
      const cx = bot.px + (bot.x - bot.px) * k, cy = bot.py + (bot.y - bot.py) * k;
      uniforms.uBot.value.set((cx + 0.5) * cell, (cy + 0.5) * cell);
      uniforms.uDir.value.set(bot.dx, bot.dy);
      uniforms.uTime.value = t / 1000;
      uniforms.uMove.value = reduceMotion ? 0 : 1;
      const ph = (t / 1000) % 4.2;
      uniforms.uBlink.value = ph > 4.0 ? Math.max(0.1, Math.abs(ph - 4.1) * 10) : 1;
      for (let i = 0; i < heat.length; i++) {
        bytes[i * 2] = Math.max(0, Math.min(255, heat[i] * 255));
        bytes[i * 2 + 1] = beepers[i] ? 255 : 0;
      }
      if (tex) tex.needsUpdate = true;
      renderer.render(scene, camera);
    };

    const size = () => {
      const r = stage.getBoundingClientRect();
      const dpr = r.width < 600 ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      cell = r.width < 600 ? 22 : 28;
      uniforms.uCell.value = cell;
      renderer.setPixelRatio(dpr);
      renderer.setSize(r.width, r.height, false);
      cols = Math.max(6, Math.ceil(r.width / cell));
      rows = Math.max(6, Math.ceil(r.height / cell));
      heat = new Float32Array(cols * rows);
      beepers = new Uint8Array(cols * rows);
      bytes = new Uint8Array(cols * rows * 2);
      beeperCount = 0;
      tex?.dispose();
      tex = new THREE.DataTexture(bytes, cols, rows, THREE.RGFormat, THREE.UnsignedByteType);
      tex.minFilter = tex.magFilter = THREE.LinearFilter;
      tex.unpackAlignment = 1;
      tex.needsUpdate = true;
      uniforms.uHeat.value = tex;
      uniforms.uCols.value = cols; uniforms.uRows.value = rows;
      uniforms.uRes.value.set(r.width, r.height); uniforms.uDpr.value = dpr;
      bot.x = Math.min(bot.x, cols - 2); bot.y = Math.min(bot.y, rows - 2); bot.px = bot.x; bot.py = bot.y;
      spawn(Math.max(3, Math.round((cols * rows) / 110)));
      readTheme();
      render(0);
    };

    const pickup = (x: number, y: number) => {
      beepers[y * cols + x] = 0; beeperCount--; picked++;
      const i = (picked - 1) % CAREER_LOG.length;
      if (i === 0) shown = [];
      shown = [...shown, CAREER_LOG[i]].slice(-5);
      for (const [ox, oy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) {
        const gx = x + ox, gy = y + oy;
        if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) heat[gy * cols + gx] = 1;
      }
      spawn(1);
      report();
    };

    const step = () => {
      let target = -1, best = Infinity;
      for (let i = 0; i < beepers.length; i++) {
        if (!beepers[i]) continue;
        const d = Math.abs((i % cols) - bot.x) + Math.abs(Math.floor(i / cols) - bot.y);
        if (d < best) { best = d; target = i; }
      }
      if (target < 0) { spawn(2); return; }
      const ddx = (target % cols) - bot.x, ddy = Math.floor(target / cols) - bot.y;
      const keep = (bot.dx !== 0 && ddx !== 0 && Math.sign(ddx) === bot.dx) || (bot.dy !== 0 && ddy !== 0 && Math.sign(ddy) === bot.dy);
      if (!keep) {
        if (Math.abs(ddx) >= Math.abs(ddy) && ddx !== 0) { bot.dx = Math.sign(ddx); bot.dy = 0; }
        else { bot.dx = 0; bot.dy = Math.sign(ddy); }
      }
      bot.px = bot.x; bot.py = bot.y; bot.x += bot.dx; bot.y += bot.dy;
      heat[bot.y * cols + bot.x] = 1;
      if (beepers[bot.y * cols + bot.x]) pickup(bot.x, bot.y);
    };

    let lastFrame = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || t - lastFrame < 32) return; // ~30fps is plenty for a slow grid
      lastFrame = t;
      if (t - lastStep > STEP_MS) { lastStep = t; step(); }
      for (let i = 0; i < heat.length; i++) if (heat[i] > 0) heat[i] = Math.max(0, heat[i] - 0.028);
      if (mouseCell) {
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const gx = mouseCell.x + dx, gy = mouseCell.y + dy;
          if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
            const j = gy * cols + gx;
            heat[j] = Math.max(heat[j], dx || dy ? 0.5 : 0.95);
          }
        }
      }
      render(t);
    };

    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      uniforms.uMouse.value.set(x, y);
      mouseCell = { x: Math.floor(x / cell), y: Math.floor(y / cell) };
      if (reduceMotion && mouseCell.x >= 0 && mouseCell.x < cols && mouseCell.y >= 0 && mouseCell.y < rows) {
        heat[mouseCell.y * cols + mouseCell.x] = 1;
        render(0);
      }
    };
    const onLeave = () => { mouseCell = null; uniforms.uMouse.value.set(-999, -999); };
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('a, button')) return;
      const r = stage.getBoundingClientRect();
      const gx = Math.floor((e.clientX - r.left) / cell), gy = Math.floor((e.clientY - r.top) / cell);
      if (gx < 0 || gy < 0 || gx >= cols || gy >= rows) return;
      if (beepers[gy * cols + gx]) { if (reduceMotion) { pickup(gx, gy); render(0); } return; }
      if (beeperCount >= MAX_BEEPERS) return;
      beepers[gy * cols + gx] = 1; beeperCount++; heat[gy * cols + gx] = 1;
      if (reduceMotion) render(0);
    };

    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointerdown', onDown);
    window.addEventListener('resize', size);
    const io = new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; });
    io.observe(stage);
    const themeObserver = new MutationObserver(() => { readTheme(); if (reduceMotion) render(0); });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    size();
    if (!reduceMotion) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointerdown', onDown);
      window.removeEventListener('resize', size);
      io.disconnect();
      themeObserver.disconnect();
      tex?.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full block" />;
}
