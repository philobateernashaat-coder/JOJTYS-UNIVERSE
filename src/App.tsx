import { useCallback, useEffect, useState } from 'react';
import Universe from '@/components/Universe';

const SCENE_KEY = 'jojtys-universe-scene';
const STAR_KEY = 'jojtys-universe-stars';

function readStored(key: string, fallback: number): number {
  try {
    const value = Number(window.localStorage.getItem(key));
    return Number.isFinite(value) && value >= 0 ? value : fallback;
  } catch { return fallback; }
}

function App() {
  const [scene, setScene] = useState(() => Math.min(5, Math.max(1, readStored(SCENE_KEY, 1))));
  const [stars, setStars] = useState(() => readStored(STAR_KEY, 0));

  useEffect(() => {
    document.title = "JOJTY'S UNIVERSE";
    const description = document.querySelector('meta[name="description"]') ?? document.createElement('meta');
    description.setAttribute('name', 'description');
    description.setAttribute('content', "A tiny universe for Jojty, made by her Philopyyyyyc.");
    document.head.appendChild(description);
  }, []);

  const goTo = useCallback((next: number) => {
    setScene(next);
    try { window.localStorage.setItem(SCENE_KEY, String(next)); } catch { /* Continue without storage. */ }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const addStars = useCallback((amount: number) => {
    setStars(current => {
      const updated = current + amount;
      try { window.localStorage.setItem(STAR_KEY, String(updated)); } catch { /* Keep the current session playable. */ }
      return updated;
    });
  }, []);
  const replay = useCallback(() => {
    try { window.localStorage.removeItem(SCENE_KEY); window.localStorage.removeItem(STAR_KEY); } catch { /* Reset this session even without storage. */ }
    setStars(0);
    setScene(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return <main className="universe-shell">
    <div className="universe-grain" aria-hidden="true" />
    <div className="journey-progress" aria-label={`Scene ${scene} of 5`}>
      <span className="brand-stamp">J<span>U</span></span>
      <div className="progress-track">{[1, 2, 3, 4, 5].map(step => <i key={step} className={scene >= step ? 'active' : ''} />)}</div>
      <span className="progress-label">SCENE {String(scene).padStart(2, '0')} <b>/ 05</b></span>
    </div>
    <Universe scene={scene} goTo={goTo} stars={stars} addStars={addStars} replay={replay} />
  </main>;
}

export default App;
