import React, { useEffect, useMemo, useState } from "react";

export default function Timer({ startedAt, durationMinutes, onExpire }) {
  const startTs = useMemo(() => new Date(startedAt).getTime(), [startedAt]);
  const durationMs = durationMinutes * 60 * 1000;
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(
    0,
    Math.floor((startTs + durationMs - now) / 1000)
  );
  useEffect(() => {
    if (remaining === 0) {
      onExpire?.();
    }
  }, [remaining, onExpire]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <div className="timer-pill text-sm sm:text-lg w-[80px] sm:w-[100px] text-center  flex items-center justify-center bg-white border border-slate-300 rounded-full shadow font-medium text-slate-700">
      {mm}:{ss}
    </div>
  );
}
