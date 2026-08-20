"use client";

import { useEffect, useState } from "react";

function greetingFor(hour: number) {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
}

export function Greeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    const update = () =>
      setGreeting(greetingFor(new Date().getHours()));
    update();
    const iv = window.setInterval(update, 60_000);
    return () => window.clearInterval(iv);
  }, []);

  return (
    <header className="atlas-enter pb-14 pt-14">
      <h1
        className="display text-[52px] tracking-tightest text-white md:text-[64px]"
        style={{ minHeight: "1.1em" }}
      >
        {greeting ? `${greeting}, ${name}` : " "}
      </h1>
      <p className="mt-6 text-[14px] tracking-tightish text-bone-400">
        First Team, 2026/27
      </p>
    </header>
  );
}
