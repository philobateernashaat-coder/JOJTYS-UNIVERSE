import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';

type Props = {
  scene: number;
  goTo: (scene: number) => void;
  stars: number;
  addStars: (amount: number) => void;
  replay: () => void;
};

const letter = `HAPPY BIRTHDAY, MY HOMIEEE!! 😝❤️🎂

WELCOME TO 18, GRANDMAAA 😝💀🎉 JUST KIDDINGGGG.

Honestly, Homie, I'm really glad we're friends. 😝❤️ You're one of those people who make life more fun just by being around, and I'm genuinely grateful to have you as my homie. 🫶🏻💗

And don't worry... I'M DEFINITELY NOT DONE ANNOYING YOU YET, HOMIE. 😝💀❤️

Never forget how special you are.

HAPPY BIRTHDAYYYY, JOJTYYYYY!! 🎂🎀💗

Your philopyyyyyc ❤️`;

const scanner = [
  'AGE: 18',
  'GRANDMA ENERGY: UNCONFIRMED',
  'CHAOS LEVEL: EXTREMELY HIGH',
  'LOYAL HOMIE STATUS: LEGENDARY',
  'MATURITY UPDATE: INSTALLATION FAILED 😝💀',
];

function SceneFrame({ children, scene, className = '' }: { children: ReactNode; scene: number; className?: string }) {
  return <section className={`scene scene-${scene} ${className}`} aria-label={`Birthday journey scene ${scene}`} key={scene}>{children}</section>;
}

function Stars({ count = 42 }: { count?: number }) {
  return <div className="starfield" aria-hidden="true">{Array.from({ length: count }, (_, i) => <i key={i} style={{ '--x': `${(i * 37 + 7) % 100}%`, '--y': `${(i * 61 + 3) % 100}%`, '--delay': `${(i % 9) * -0.7}s`, '--size': `${i % 5 === 0 ? 3 : 1 + (i % 2)}px` } as CSSProperties} />)}</div>;
}

function Intro({ next }: { next: () => void }) {
  const [entering, setEntering] = useState(false);
  const begin = () => { if (entering) return; setEntering(true); window.setTimeout(next, 850); };
  return <SceneFrame scene={1} className={entering ? 'warp' : ''}>
    <Stars />
    <div className="scene-kicker">A VERY OFFICIAL COSMIC INVITATION <span>NO. 18—1020</span></div>
    <div className="intro-copy"><p className="eyebrow">A whole universe, just for you</p><h1>HAIII<br /><em>JOJTYYYYY!!</em> <span>😝😍</span></h1><p className="intro-sub">Your Philopyyyyyc has created a tiny universe for you. 👀💗</p></div>
    <div className="orbit-stage">
      <div className="orbit orbit-one" /><div className="orbit orbit-two" />
      <button className="planet" onClick={begin} aria-label="Enter the universe through the planet" data-testid="button-enter-planet"><span>JOJTY</span></button>
      <button className="gift-portal" onClick={begin} aria-label="Open the cosmic gift portal" data-testid="button-enter-gift"><span className="gift-star">✦</span><span>OPEN<br />PORTAL</span></button>
      {entering && <div className="warp-particles" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ '--angle': `${i * 15}deg`, '--delay': `${(i % 6) * 18}ms`, '--distance': `${110 + (i % 5) * 20}px` } as CSSProperties} />)}</div>}
      <span className="orbit-note note-one">HOMIE HQ</span><span className="orbit-note note-two">EST. OCT 20, 2026</span>
    </div>
    <p className="scene-hint">TAP THE PLANET OR THE GIFT TO ENTER</p>
    <div className="bottom-mark"><span>PHILOPYYYYYC × JOJTY</span><span>THE UNIVERSE IS YOURS</span></div>
  </SceneFrame>;
}

function Certificate({ next }: { next: () => void }) {
  const [shown, setShown] = useState(0);
  const [busy, setBusy] = useState(false);
  useEffect(() => { const timer = window.setInterval(() => setShown(v => Math.min(scanner.length, v + 1)), 660); return () => window.clearInterval(timer); }, []);
  const continueOnce = () => { if (busy || shown < scanner.length) return; setBusy(true); window.setTimeout(next, 420); };
  return <SceneFrame scene={2}>
    <Stars count={30} />
    <div className="control-top"><span>HOMIE STATUS TERMINAL</span><span className="live-indicator">SYSTEM ONLINE</span></div>
    <div className="certificate-wrap">
      <p className="eyebrow">BIRTHDAY AUTHENTICATION / OCT 20, 2026</p>
      <h2>CONGRATULATIONS,<br /><em>Yaaa BAGHLAAAA!</em> 😝💀🎉</h2>
      <p className="cert-sub">WELCOME TO 18, GRANDMAAA 😝💀🎉 JUST KIDDINGGGG.</p>
      <div className="scanner-panel" aria-label="Birthday scanner results">
        <div className="scanner-beam" />
        {scanner.map((result, index) => <div className={`scan-line ${index < shown ? 'revealed' : ''}`} key={result} data-testid={`status-scan-${index + 1}`}><span className="scan-check">{index < shown ? '◆' : '·'}</span>{result}<span className="scan-status">{index < shown ? 'VERIFIED' : 'SCANNING'}</span></div>)}
      </div>
      {shown === scanner.length && <div className="approved">APPROVED BY NOBODY.</div>}
      <button className="pill-button" onClick={continueOnce} disabled={shown < scanner.length || busy} data-testid="button-certificate-continue">CONTINUE THE ADVENTURE ➜</button>
    </div>
    <div className="control-footer"><span>SCANNING SUBJECT: JOJTY / HOMIE</span><span>CONFIDENCE: QUESTIONABLE</span></div>
  </SceneFrame>;
}

type GameEntity = { x: number; y: number; type: 'star' | 'obstacle'; id: number };
type GameInputMode = 'button' | 'swipe' | null;
type ArenaMetrics = { width: number; height: number; dpr: number };

function drawGameStar(context: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(x, y - size);
  context.lineTo(x + size * 0.24, y - size * 0.24);
  context.lineTo(x + size, y);
  context.lineTo(x + size * 0.24, y + size * 0.24);
  context.lineTo(x, y + size);
  context.lineTo(x - size * 0.24, y + size * 0.24);
  context.lineTo(x - size, y);
  context.lineTo(x - size * 0.24, y - size * 0.24);
  context.closePath();
  context.fill();
}

function drawGameFrame(
  context: CanvasRenderingContext2D | null,
  metrics: ArenaMetrics,
  entities: GameEntity[],
  playerX: number,
  slowUntil: number,
  now: number,
) {
  const { width, height, dpr } = metrics;
  if (!context || !width || !height) return;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);

  for (const entity of entities) {
    const x = entity.x * width / 100;
    const y = entity.y * height / 100;
    if (entity.type === 'star') {
      drawGameStar(context, x, y, 10, '#ffe59a');
    } else {
      context.beginPath();
      context.arc(x, y, 8, 0, Math.PI * 2);
      context.fillStyle = '#e68eb4';
      context.fill();
      context.beginPath();
      context.moveTo(x - 4, y - 4);
      context.lineTo(x + 4, y + 4);
      context.moveTo(x + 4, y - 4);
      context.lineTo(x - 4, y + 4);
      context.strokeStyle = '#392642';
      context.lineWidth = 2;
      context.stroke();
    }
  }

  const playerY = height * 0.82;
  const playerPixelX = playerX * width / 100;
  const slowed = now < slowUntil;
  context.beginPath();
  context.arc(playerPixelX, playerY, 16, 0, Math.PI * 2);
  context.fillStyle = slowed ? '#e68eb4' : '#f2cb8a';
  context.fill();
  context.strokeStyle = '#fff0bd';
  context.lineWidth = 2;
  context.stroke();
  drawGameStar(context, playerPixelX, playerY, 8, '#594274');
}

function MiniGame({ next, total, addStars }: { next: () => void; total: number; addStars: (amount: number) => void }) {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(20);
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);
  const runningRef = useRef(false);
  const secondsRef = useRef(20);
  const direction = useRef(0);
  const xRef = useRef(50);
  const entities = useRef<GameEntity[]>([]);
  const scoreRef = useRef(0);
  const lastSpawn = useRef(0);
  const raf = useRef<number | null>(null);
  const startAt = useRef(0);
  const slowUntil = useRef(0);
  const arenaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const arenaMetrics = useRef<ArenaMetrics>({ width: 0, height: 0, dpr: 1 });
  const activePointer = useRef<number | null>(null);
  const inputMode = useRef<GameInputMode>(null);

  const releasePointer = useCallback((pointerId?: number) => {
    if (pointerId !== undefined && activePointer.current !== pointerId) return;
    activePointer.current = null;
    inputMode.current = null;
    direction.current = 0;
  }, []);

  const movePlayerTo = useCallback((clientX: number) => {
    const bounds = arenaRef.current?.getBoundingClientRect();
    if (!bounds || bounds.width <= 0) return;
    const position = ((clientX - bounds.left) / bounds.width) * 100;
    xRef.current = Math.max(7, Math.min(93, position));
  }, []);

  useEffect(() => {
    const arena = arenaRef.current;
    const canvas = canvasRef.current;
    if (!arena || !canvas) return;
    const resize = () => {
      const bounds = arena.getBoundingClientRect();
      const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2);
      arenaMetrics.current = { width: bounds.width, height: bounds.height, dpr };
      const width = Math.round(bounds.width * dpr);
      const height = Math.round(bounds.height * dpr);
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
      contextRef.current = canvas.getContext('2d');
    };
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
    observer?.observe(arena);
    window.addEventListener('resize', resize);
    resize();
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (inputMode.current !== 'swipe' || activePointer.current !== event.pointerId) return;
      event.preventDefault();
      movePlayerTo(event.clientX);
    };
    const onPointerEnd = (event: PointerEvent) => releasePointer(event.pointerId);
    const onBlur = () => releasePointer();
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerEnd);
    window.addEventListener('pointercancel', onPointerEnd);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);
      window.removeEventListener('blur', onBlur);
      releasePointer();
    };
  }, [movePlayerTo, releasePointer]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!runningRef.current) return;
      const key = event.key.toLowerCase();
      if (key === 'arrowleft' || key === 'a') { event.preventDefault(); direction.current = -1; }
      if (key === 'arrowright' || key === 'd') { event.preventDefault(); direction.current = 1; }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === 'arrowleft' || key === 'arrowright' || key === 'a' || key === 'd') direction.current = 0;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const start = () => {
    if (runningRef.current) return;
    releasePointer();
    direction.current = 0;
    xRef.current = 50;
    entities.current = [];
    scoreRef.current = 0;
    slowUntil.current = 0;
    secondsRef.current = 20;
    setScore(0);
    setSeconds(20);
    setWon(false);
    startAt.current = performance.now();
    lastSpawn.current = startAt.current;
    runningRef.current = true;
    setRunning(true);
  };

  useEffect(() => {
    if (!running) return;
    runningRef.current = true;
    let previous = performance.now();
    let pausedAt = 0;

    const finish = (victory: boolean) => {
      runningRef.current = false;
      direction.current = 0;
      releasePointer();
      raf.current = null;
      if (victory) setWon(true);
      setRunning(false);
    };

    const pause = () => {
      if (!pausedAt) pausedAt = performance.now();
      direction.current = 0;
      releasePointer();
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      raf.current = null;
    };

    const frame = (now: number) => {
      if (!runningRef.current) { raf.current = null; return; }
      if (document.hidden) { pause(); return; }
      if (pausedAt) {
        const hiddenDuration = now - pausedAt;
        startAt.current += hiddenDuration;
        lastSpawn.current += hiddenDuration;
        previous = now;
        pausedAt = 0;
      }

      const dt = Math.min(Math.max(0, (now - previous) / 1000), 0.05);
      previous = now;
      const remaining = Math.max(0, 20 - (now - startAt.current) / 1000);
      const shownSeconds = Math.ceil(remaining);
      if (shownSeconds !== secondsRef.current) {
        secondsRef.current = shownSeconds;
        setSeconds(shownSeconds);
      }

      const speed = now < slowUntil.current ? 24 : 58;
      xRef.current = Math.max(7, Math.min(93, xRef.current + direction.current * speed * dt));
      if (now - lastSpawn.current >= 760) {
        entities.current.push({
          x: 10 + Math.random() * 80,
          y: -5,
          type: Math.random() < 0.73 ? 'star' : 'obstacle',
          id: now,
        });
        lastSpawn.current = now;
      }

      let collected = 0;
      entities.current = entities.current.filter(entity => {
        entity.y += (entity.type === 'star' ? 30 : 26) * dt;
        const hit = Math.abs(entity.x - xRef.current) < 9 && Math.abs(entity.y - 82) < 9;
        if (hit && entity.type === 'star') { collected++; return false; }
        if (hit && entity.type === 'obstacle') { slowUntil.current = Math.max(slowUntil.current, now + 450); return false; }
        return entity.y < 105;
      });

      if (collected) {
        const credited = Math.min(collected, 10 - scoreRef.current);
        if (credited > 0) {
          scoreRef.current += credited;
          setScore(scoreRef.current);
          addStars(credited);
        }
      }
      drawGameFrame(contextRef.current, arenaMetrics.current, entities.current, xRef.current, slowUntil.current, now);

      if (scoreRef.current >= 10) { finish(true); return; }
      if (remaining <= 0) { finish(false); return; }
      raf.current = requestAnimationFrame(frame);
    };

    const onVisibilityChange = () => {
      if (document.hidden) { pause(); return; }
      if (!runningRef.current) return;
      if (pausedAt) {
        const hiddenDuration = performance.now() - pausedAt;
        startAt.current += hiddenDuration;
        lastSpawn.current += hiddenDuration;
        previous = performance.now();
        pausedAt = 0;
      }
      if (raf.current === null) raf.current = requestAnimationFrame(frame);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    if (document.hidden) pause();
    else raf.current = requestAnimationFrame(frame);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      raf.current = null;
      runningRef.current = false;
      releasePointer();
    };
  }, [running, addStars, releasePointer]);

  const holdDirection = (value: number, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!runningRef.current || !event.isPrimary || activePointer.current !== null) return;
    event.preventDefault();
    event.stopPropagation();
    activePointer.current = event.pointerId;
    inputMode.current = 'button';
    direction.current = value;
    try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* Window pointer listeners still release the hold. */ }
  };

  const beginSwipe = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!runningRef.current || !event.isPrimary || activePointer.current !== null) return;
    if (event.target instanceof Element && event.target.closest('button')) return;
    event.preventDefault();
    activePointer.current = event.pointerId;
    inputMode.current = 'swipe';
    direction.current = 0;
    movePlayerTo(event.clientX);
    try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* Window pointer listeners still track the swipe. */ }
  };

  const stopPointer = (event: ReactPointerEvent<HTMLButtonElement | HTMLDivElement>) => releasePointer(event.pointerId);
  return <SceneFrame scene={3}>
    <Stars count={24} />
    <div className="game-heading"><p className="eyebrow">FIELD TEST / HOMIE TRAINING</p><h2>BaghlAAA<br /><em>Star Run</em></h2><p>Twenty seconds. Ten stars. Absolutely no dignity required.</p></div>
    <div className="game-layout">
      <div
        className="game-arena"
        ref={arenaRef}
        aria-label="Star Run game area"
        data-testid="game-arena"
        onPointerDown={beginSwipe}
        onPointerUp={stopPointer}
        onPointerCancel={stopPointer}
        onLostPointerCapture={stopPointer}
      >
        <div className="arena-grid" />
        <canvas ref={canvasRef} className="game-canvas" aria-hidden="true" />
        <div className="game-hud"><span>TIME <b data-testid="status-game-timer">{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</b></span><span>STARS <b data-testid="status-game-score">{score} / 10</b></span></div>
        {!running && !won && <div className="arena-overlay"><span>{seconds < 20 ? 'TIME IS UP' : 'READY, HOMIE?'}</span><button className="small-button" onClick={start} data-testid="button-game-start">{seconds < 20 ? 'PLAY AGAIN' : 'START THE RUN'}</button></div>}
        {won && <div className="arena-overlay win-overlay"><span>STARS SECURED</span><strong>10 / 10</strong></div>}
      </div>
      <aside className="game-side">
        <div className="game-rule"><span className="rule-number">01</span><p>Collect ten birthday stars before the timer hits zero.</p></div>
        <div className="game-rule"><span className="rule-number">02</span><p>Avoid the silly space clutter. A bonk only slows you down.</p></div>
        <div className="game-rule"><span className="rule-number">03</span><p>Use ← → or A / D. On touch, hold a direction.</p></div>
        <div className="total-stars">UNIVERSE STAR BANK <b data-testid="status-total-stars">{total}</b></div>
      </aside>
    </div>
    <div className="touch-controls" aria-label="Touch game controls">
      <button onPointerDown={event => holdDirection(-1, event)} onPointerUp={stopPointer} onPointerCancel={stopPointer} onLostPointerCapture={stopPointer} aria-label="LEFT — hold to move left" data-testid="button-game-left"><span className="control-arrow">←</span><span className="control-name">LEFT</span></button>
      <span>MOVE YOUR LITTLE COSMIC SELF</span>
      <button onPointerDown={event => holdDirection(1, event)} onPointerUp={stopPointer} onPointerCancel={stopPointer} onLostPointerCapture={stopPointer} aria-label="RIGHT — hold to move right" data-testid="button-game-right"><span className="control-arrow">→</span><span className="control-name">RIGHT</span></button>
    </div>
    {won ? <div className="game-win-message"><h3>MISSION COMPLETE: CERTIFIED BAGHLAAA 😝💀🏆</h3><p>18 YEARS OF CHAOS. AND THE ADVENTURE CONTINUES.</p><button className="pill-button" onClick={next} data-testid="button-game-continue">CONTINUE ➜</button></div> : <button className="text-restart" onClick={start} disabled={running} data-testid="button-game-restart">{running ? 'RUN IN PROGRESS' : 'RESTART ROUND'}</button>}
  </SceneFrame>;
}

function Letter({ next }: { next: () => void }) {
  const [opened, setOpened] = useState(false);
  return <SceneFrame scene={4}>
    <Stars count={30} />
    <div className="letter-intro"><p className="eyebrow">A SMALL THING, FROM YOUR HOMIE</p><h2>One little<br /><em>cosmic post.</em></h2><p>Handle with care. Or don't. You're you.</p></div>
    {!opened ? <button className="envelope" onClick={() => setOpened(true)} aria-label="Open the birthday letter" data-testid="button-open-letter"><span className="envelope-flap" /><span className="seal">J</span><span className="envelope-label">FOR HOMIE, ALWAYS</span></button> : <article className="letter-paper" data-testid="text-birthday-letter"><div className="letter-topline">A NOTE FROM YOUR PHILOPYYYYYC</div><p>{letter}</p><button className="pill-button" onClick={next} data-testid="button-letter-continue">KEEP GOING ➜</button></article>}
    {!opened && <p className="scene-hint">TAP TO OPEN YOUR LETTER</p>}
  </SceneFrame>;
}

function Finale({ stars, replay }: { stars: number; replay: () => void }) {
  const [revealed, setRevealed] = useState(false);
  const [lines, setLines] = useState(0);
  const reveal = useCallback(() => { if (revealed) return; setRevealed(true); }, [revealed]);
  useEffect(() => { if (!revealed) return; const timers = [450, 1400, 2350, 3300].map((delay, index) => window.setTimeout(() => setLines(index + 1), delay)); return () => timers.forEach(window.clearTimeout); }, [revealed]);
  return <SceneFrame scene={5} className={revealed ? 'finale-live' : ''}>
    <Stars count={revealed ? 90 : 48} />
    <div className="finale-top"><span>HOMIE CONSTELLATION / 18</span><span>{stars} STARS IN YOUR ORBIT</span></div>
    <div className="finale-main">
      <p className="eyebrow">A MESSAGE FROM YOUR PERMANENT HOMIE</p>
      {!revealed && <><h2>WAIT, HOMIE...<br /><em>ONE LAST THING.</em> 👀💗</h2><button className="final-gift" onClick={reveal} aria-label="Open the last birthday gift" data-testid="button-final-gift"><span className="gift-rings" /><span className="final-gift-box"><i /><b /></span><span className="gift-caption">ONE LAST GIFT</span></button></>}
      {revealed && <div className="final-lines" aria-live="polite">
        {lines > 0 && <p>NO MATTER HOW OLD YOU GET, YOU'LL ALWAYS BE MY HOMIEEE. 😝❤️🫂</p>}
        {lines > 1 && <p>YOUR HOMIE STATUS IS PERMANENT.<br />NO REFUNDS. NO CANCELLATIONS. 😝💀❤️</p>}
        {lines > 2 && <h2>HAPPY 18TH BIRTHDAY,<br /><em>JOJTYYYYY!!</em> 😝😍🎂</h2>}
        {lines > 3 && <><p className="signoff">Forever your Philopyyyyyc ❤️</p><button className="pill-button replay-button" onClick={replay} data-testid="button-replay">REPLAY THE UNIVERSE ↺</button></>}
      </div>}
    </div>
    <div className="finale-star-bank" aria-label={`${stars} collected stars`}>{Array.from({ length: Math.min(stars, 50) }, (_, i) => <span key={i} style={{ '--i': i } as CSSProperties}>✦</span>)}<small>{stars} COLLECTED STARS</small></div>
    {revealed && lines > 3 && <div className="celebration-burst" aria-hidden="true">{Array.from({ length: 22 }, (_, i) => <i key={i} style={{ '--i': i } as CSSProperties} />)}</div>}
  </SceneFrame>;
}

export default function Universe({ scene, goTo, stars, addStars, replay }: Props) {
  return <>
    {scene === 1 && <Intro next={() => goTo(2)} />}
    {scene === 2 && <Certificate next={() => goTo(3)} />}
    {scene === 3 && <MiniGame next={() => goTo(4)} total={stars} addStars={addStars} />}
    {scene === 4 && <Letter next={() => goTo(5)} />}
    {scene === 5 && <Finale stars={stars} replay={replay} />}
  </>;
}
