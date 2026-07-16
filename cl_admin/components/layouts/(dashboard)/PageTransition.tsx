"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [phase, setPhase] = useState<"idle" | "exit" | "enter">("idle");
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    if (pathname === prevPathnameRef.current) return;
    prevPathnameRef.current = pathname;

    // Exit phase
    setPhase("exit");
    const exitTimer = setTimeout(() => {
      setDisplayChildren(children);
      setPhase("enter");
      // Settle to idle after enter animation
      const enterTimer = setTimeout(() => setPhase("idle"), 300);
      return () => clearTimeout(enterTimer);
    }, 180);

    return () => clearTimeout(exitTimer);
  }, [pathname, children]);

  const style: React.CSSProperties =
    phase === "exit"
      ? { opacity: 0, transform: "translateY(6px)", transition: "opacity 180ms ease, transform 180ms ease" }
      : phase === "enter"
      ? { opacity: 0, transform: "translateY(-4px)", transition: "none" }
      : { opacity: 1, transform: "translateY(0)", transition: "opacity 280ms ease, transform 280ms ease" };

  return (
    <div style={style} className="h-full">
      {displayChildren}
    </div>
  );
}
