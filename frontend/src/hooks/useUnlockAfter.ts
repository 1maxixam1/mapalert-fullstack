// useUnlockAfter.ts
import { useEffect, useState } from "react";

const HOURS_16_MS = 16 * 60 * 60 * 1000;

export function useUnlockAfter(createdAtMs?: number, tickMs = 30_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), tickMs); // actualiza cada 30s
    return () => clearInterval(id);
  }, [tickMs]);

  if (!createdAtMs) return { unlocked: false, remainingMs: Infinity, unlockAt: null };

  const unlockAt = createdAtMs + HOURS_16_MS;
  const remainingMs = Math.max(0, unlockAt - now);
  const unlocked = remainingMs === 0;
  return { unlocked, remainingMs, unlockAt };
}

export function formatRemaining(ms: number) {
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  return `${h}h ${m}m`;
}
