import { useEffect, useState } from "react";

function getTimeLeft(targetDate) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="rounded-2xl border border-white/10 bg-navy-800/60 px-8 py-6 text-center">
        <p className="font-display font-bold text-xl text-cyan-400">EVENT COMPLETED</p>
      </div>
    );
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex justify-center gap-3 md:gap-5">
      {units.map((u) => (
        <div key={u.label} className="w-16 md:w-24 rounded-xl border border-white/10 bg-navy-800/60 py-4 text-center">
          <div className="font-display font-bold text-2xl md:text-4xl text-cyan-400 tabular-nums">
            {String(u.value).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[10px] md:text-xs uppercase tracking-wider text-white/50">{u.label}</div>
        </div>
      ))}
    </div>
  );
}
