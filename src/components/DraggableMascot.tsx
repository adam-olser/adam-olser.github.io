import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Retro Web Audio ────────────────────────────────────────────────────────
let audioCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}
function beep(freq: number, duration: number, type: OscillatorType = 'square', vol = 0.12) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch { /* blocked */ }
}
function playPickup()      { beep(440, 0.06); setTimeout(() => beep(660, 0.08), 60); }
function playRelease()     { beep(660, 0.06); setTimeout(() => beep(440, 0.1),  50); }
function playInteractive() { beep(880, 0.04, 'square', 0.1); setTimeout(() => beep(1100, 0.06, 'square', 0.08), 40); }
function playWiggle()      { [0,40,80].forEach((d,i) => setTimeout(() => beep(523+i*130, 0.05, 'triangle', 0.1), d)); }
function playSpawn()       { [0,60,120].forEach((d,i) => setTimeout(() => beep(330+i*110, 0.07, 'sine', 0.09), d)); }

// ─── Visor mascot SVG ────────────────────────────────────────────────────────
function TamagotchiSVG({ phase, opacity = 1 }: { phase: string; opacity?: number }) {
  const isHeld   = phase === 'catching' || phase === 'holding';
  const isHappy  = phase === 'happy';
  const isBounce = phase === 'bounce';

  // Body squish: wide+flat when held, tall+narrow when bouncing
  const scaleX = isHeld ? 1.16 : isBounce ? 0.88 : 1;
  const scaleY = isHeld ? 0.84 : isBounce ? 1.16 : 1;

  return (
    <svg
      viewBox="0 0 80 92"
      width={76}
      height={88}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: `scaleX(${scaleX}) scaleY(${scaleY})`,
        transition: 'transform 0.13s cubic-bezier(0.34,1.56,0.64,1)',
        overflow: 'visible',
        display: 'block',
        opacity,
      }}
      aria-hidden
    >
      {/* Drop shadow */}
      <ellipse cx="40" cy="88" rx={isHeld ? 26 : 17} ry="3"
        fill="currentColor" opacity={isHeld ? 0.06 : 0.16}
        style={{ transition: 'all 0.15s ease' }}
      />

      {/* Antenna stem */}
      <line x1="40" y1="14" x2="40" y2="4"
        stroke="rgb(var(--color-primary))" strokeWidth="2"
        strokeLinecap="round" opacity="0.7"
      />
      {/* Antenna tip */}
      <circle cx="40" cy="3" r="3.5"
        fill="rgb(var(--color-primary))" opacity={isHappy ? 1 : 0.65}
      />
      {/* Antenna glow when happy */}
      {isHappy && (
        <circle cx="40" cy="3" r="6"
          fill="rgb(var(--color-primary))" opacity="0.2"
        />
      )}

      {/* ── Body — wide rounded-rect helmet ── */}
      <rect x="7" y="14" width="66" height="64" rx="30"
        fill="rgb(var(--color-surface-container-high))"
        stroke="rgb(var(--color-primary))"
        strokeWidth="2.2"
      />

      {/* Ear nubs */}
      <circle cx="7"  cy="46" r="5"
        fill="rgb(var(--color-surface-container-high))"
        stroke="rgb(var(--color-primary))" strokeWidth="1.8"
      />
      <circle cx="73" cy="46" r="5"
        fill="rgb(var(--color-surface-container-high))"
        stroke="rgb(var(--color-primary))" strokeWidth="1.8"
      />

      {/* ── Visor window ── */}
      <rect x="15" y="22" width="50" height="40" rx="18"
        fill="rgb(var(--color-surface-container-lowest))"
        stroke="rgb(var(--color-primary))" strokeWidth="1.5"
      />
      {/* Visor reflection streak */}
      <line x1="19" y1="25" x2="31" y2="25"
        stroke="rgb(var(--color-primary))" strokeWidth="1.2"
        strokeLinecap="round" opacity="0.18"
      />

      {/* ── Eyes ── */}
      {isHeld ? (
        /* squinting lines when held */
        <>
          <line x1="25" y1="40" x2="35" y2="40"
            stroke="rgb(var(--color-primary))" strokeWidth="3"
            strokeLinecap="round"
          />
          <line x1="45" y1="40" x2="55" y2="40"
            stroke="rgb(var(--color-primary))" strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      ) : isHappy ? (
        /* happy arc eyes */
        <>
          <path d="M24 43 Q30 37 36 43"
            stroke="rgb(var(--color-primary))" strokeWidth="2.8"
            fill="none" strokeLinecap="round"
          />
          <path d="M44 43 Q50 37 56 43"
            stroke="rgb(var(--color-primary))" strokeWidth="2.8"
            fill="none" strokeLinecap="round"
          />
        </>
      ) : (
        /* default round eyes with pupils */
        <>
          <circle cx="30" cy="40" r="6.5" fill="rgb(var(--color-primary))" opacity="0.9" />
          <circle cx="50" cy="40" r="6.5" fill="rgb(var(--color-primary))" opacity="0.9" />
          <circle cx="31.5" cy="41" r="3" fill="rgb(var(--color-surface-container-lowest))" />
          <circle cx="51.5" cy="41" r="3" fill="rgb(var(--color-surface-container-lowest))" />
          {/* eye shine */}
          <circle cx="33"   cy="38" r="1.2" fill="rgb(var(--color-primary))" opacity="0.6" />
          <circle cx="53"   cy="38" r="1.2" fill="rgb(var(--color-primary))" opacity="0.6" />
        </>
      )}

      {/* ── Mouth ── */}
      {isHappy ? (
        <path d="M28 53 Q40 62 52 53"
          stroke="rgb(var(--color-primary))" strokeWidth="2.2"
          fill="none" strokeLinecap="round"
        />
      ) : isHeld ? (
        <line x1="31" y1="53" x2="49" y2="53"
          stroke="rgb(var(--color-primary))" strokeWidth="2"
          strokeLinecap="round" opacity="0.7"
        />
      ) : (
        <path d="M31 52 Q40 56 49 52"
          stroke="rgb(var(--color-primary))" strokeWidth="2"
          fill="none" strokeLinecap="round" opacity="0.8"
        />
      )}

      {/* ── Blush (happy only) ── */}
      {isHappy && (
        <>
          <circle cx="19" cy="47" r="5" fill="rgb(var(--color-primary))" opacity="0.18" />
          <circle cx="61" cy="47" r="5" fill="rgb(var(--color-primary))" opacity="0.18" />
        </>
      )}
    </svg>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface Vec2 { x: number; y: number }

interface Ghost {
  id: number;
  x: number;
  y: number;
  opacity: number;
  phase: string;
}

const GHOST_MIN_DIST    = 22;   // px between ghost samples
const GHOST_INIT_OPACITY = 0.55;
const GHOST_DECAY       = 0.028; // opacity lost per frame
const MAX_GHOSTS        = 10;

// ─── Component ───────────────────────────────────────────────────────────────
export function DraggableMascot() {
  const [pos,    setPos]    = useState<Vec2>({ x: 0, y: 0 });
  const [phase,  setPhase]  = useState<'idle'|'catching'|'holding'|'settling'|'happy'|'bounce'>('idle');
  const [ghosts, setGhosts] = useState<Ghost[]>([]);

  const vel         = useRef<Vec2>({ x: 0, y: 0 });
  const lastPos     = useRef<Vec2>({ x: 0, y: 0 });
  const isDragging  = useRef(false);
  const dragStart   = useRef<Vec2>({ x: 0, y: 0 });
  const posRef      = useRef<Vec2>({ x: 0, y: 0 });
  const phaseRef    = useRef<string>('idle');
  const rafRef      = useRef<number>(0);
  const settleRef   = useRef<ReturnType<typeof setTimeout>>();
  const ghostsRef   = useRef<Ghost[]>([]);
  const ghostIdRef  = useRef(0);
  const ghostRafRef = useRef<number>(0);
  const lastGhostXY = useRef<Vec2>({ x: 0, y: 0 });

  // Keep refs in sync
  useEffect(() => { posRef.current  = pos;   }, [pos]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // ── Ghost decay loop (runs while there are live ghosts) ──
  const startGhostDecay = useCallback(() => {
    cancelAnimationFrame(ghostRafRef.current);
    const decay = () => {
      const live = ghostsRef.current
        .map(g => ({ ...g, opacity: g.opacity - GHOST_DECAY }))
        .filter(g => g.opacity > 0);
      ghostsRef.current = live;
      setGhosts([...live]);
      if (live.length > 0) {
        ghostRafRef.current = requestAnimationFrame(decay);
      }
    };
    ghostRafRef.current = requestAnimationFrame(decay);
  }, []);

  // ── Add a ghost at a position ──
  const addGhost = useCallback((x: number, y: number, ph: string) => {
    const dx = x - lastGhostXY.current.x;
    const dy = y - lastGhostXY.current.y;
    if (Math.hypot(dx, dy) < GHOST_MIN_DIST) return;
    lastGhostXY.current = { x, y };
    const next = [
      ...ghostsRef.current,
      { id: ghostIdRef.current++, x, y, opacity: GHOST_INIT_OPACITY, phase: ph },
    ].slice(-MAX_GHOSTS);
    ghostsRef.current = next;
    startGhostDecay();
  }, [startGhostDecay]);

  // ── Spring-settle animation ──
  const startSettle = useCallback(() => {
    setPhase('settling');
    cancelAnimationFrame(rafRef.current);

    const stiffness = 0.18;
    const damping   = 0.62;

    const tick = () => {
      const p = posRef.current;
      const v = vel.current;

      const fx = -stiffness * p.x;
      const fy = -stiffness * p.y;
      v.x = (v.x + fx) * damping;
      v.y = (v.y + fy) * damping;

      const nx = p.x + v.x;
      const ny = p.y + v.y;
      posRef.current = { x: nx, y: ny };
      setPos({ x: nx, y: ny });

      // Sample ghosts during spring-back
      addGhost(nx, ny, 'holding');

      if (Math.abs(nx) < 0.5 && Math.abs(ny) < 0.5 && Math.abs(v.x) < 0.3 && Math.abs(v.y) < 0.3) {
        posRef.current = { x: 0, y: 0 };
        setPos({ x: 0, y: 0 });
        vel.current = { x: 0, y: 0 };
        setPhase('bounce');
        clearTimeout(settleRef.current);
        settleRef.current = setTimeout(() => setPhase('idle'), 300);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [addGhost]);

  // ── Pointer handlers ──
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDragging.current = true;
    dragStart.current  = { x: e.clientX - posRef.current.x, y: e.clientY - posRef.current.y };
    lastPos.current    = { x: e.clientX, y: e.clientY };
    vel.current        = { x: 0, y: 0 };
    // Reset ghost sampling origin to current pos so first move is relative
    lastGhostXY.current = { x: posRef.current.x, y: posRef.current.y };
    cancelAnimationFrame(rafRef.current);
    clearTimeout(settleRef.current);
    playPickup();
    setPhase('catching');
    setTimeout(() => { if (isDragging.current) setPhase('holding'); }, 80);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const nx = e.clientX - dragStart.current.x;
    const ny = e.clientY - dragStart.current.y;
    vel.current.x = e.clientX - lastPos.current.x;
    vel.current.y = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    posRef.current  = { x: nx, y: ny };
    setPos({ x: nx, y: ny });
    // Drop ghost trail
    addGhost(nx, ny, 'holding');
  }, [addGhost]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const wasDragged = Math.abs(posRef.current.x) > 4 || Math.abs(posRef.current.y) > 4;
    playRelease();
    if (wasDragged) {
      startSettle();
    } else {
      playWiggle();
      playInteractive();
      setPhase('happy');
      clearTimeout(settleRef.current);
      settleRef.current = setTimeout(() => setPhase('idle'), 600);
    }
  }, [startSettle]);

  // Cleanup
  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    cancelAnimationFrame(ghostRafRef.current);
    clearTimeout(settleRef.current);
  }, []);

  const isHeld = phase === 'catching' || phase === 'holding';
  const label  = isHeld ? 'Release mascot' : 'Grab the mascot';

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: 130, height: 160 }}
    >
      {/* ── Ghost duplicates (absolutely offset from container centre) ── */}
      {ghosts.map(g => (
        <div
          key={g.id}
          style={{
            position: 'absolute',
            transform: `translate(${g.x}px, ${g.y}px)`,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
            filter: 'blur(0.6px)',
          }}
        >
          <TamagotchiSVG phase={g.phase} opacity={g.opacity} />
        </div>
      ))}

      {/* ── Main mascot (flex-centred, offset by pos) ── */}
      <div
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          cursor: isHeld ? 'grabbing' : 'grab',
          willChange: 'transform',
          animation: phase === 'idle' ? 'mascot-float 2.8s ease-in-out infinite' : 'none',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        role="button"
        tabIndex={0}
        aria-label={label}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            playWiggle();
            playSpawn();
            setPhase('happy');
            clearTimeout(settleRef.current);
            settleRef.current = setTimeout(() => setPhase('idle'), 600);
          }
        }}
      >
        <TamagotchiSVG phase={phase} />
      </div>

      {/* ── Hint label ── */}
      <span
        className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-on-surface-variant/50 pointer-events-none whitespace-nowrap tracking-wider uppercase font-mono"
        aria-hidden
      >
        {isHeld ? 'throw me!' : 'grab me'}
      </span>

      {/* Keyframe */}
      <style>{`
        @keyframes mascot-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
