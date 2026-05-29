import React, { useEffect, useState } from "react";
import { PiggyBank } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Elegant loading counter simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Small delay before transition out
          setTimeout(() => {
            setIsFading(true);
            setTimeout(onComplete, 500); // Wait for transition animation
          }, 300);
          return 100;
        }
        // Organic loading speed jumps
        const next = prev + Math.floor(Math.random() * 8) + 4;
        return next > 100 ? 100 : next;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-all duration-500 ease-out ${
        isFading ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{ backgroundColor: "#2D1F1B" }}
    >
      {/* Background soft ambient blur spots */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary rounded-full filter blur-[120px] opacity-20 animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary rounded-full filter blur-[100px] opacity-10 animate-float-loop" />

      {/* Main Logo Card */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Piggybank ring outer */}
        <div className="relative flex items-center justify-center w-24 h-24 mb-6 rounded-3xl bg-primary/10 border border-primary/20 p-5 shadow-glow animate-float-loop">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/30 to-secondary/10 blur-sm" />
          <PiggyBank className="w-12 h-12 text-primary relative z-10 animate-pulse" />
        </div>

        {/* Brand Text */}
        <h1 className="text-3xl font-bold tracking-tight text-[#FFF7F5] mb-2 font-sans">
          Nabun<span className="text-primary font-bold">Yuk</span>
        </h1>
        <p className="text-xs tracking-widest text-[#FFD0C7]/60 uppercase mb-12">
          Tabungan Bersama Online
        </p>

        {/* Custom Progress Bar */}
        <div className="w-60 h-2 bg-[#FFF7F5]/10 rounded-full overflow-hidden mb-3 border border-white/5 p-[1px]">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percent Label */}
        <span className="text-xs font-mono text-[#FFD0C7]/80">{progress}%</span>
      </div>

      {/* Aesthetic credit overlay at the bottom */}
      <div className="absolute bottom-8 text-[10px] tracking-widest text-primary/40 font-mono">
        PREMIUM FINTECH DASHBOARD
      </div>
    </div>
  );
}
