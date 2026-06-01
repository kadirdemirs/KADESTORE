"use client";
import { motion } from "framer-motion";

export default function HeroBackdrop() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Sol controller silueti */}
      <motion.div
        initial={{ opacity: 0, x: -60, rotate: -25 }}
        animate={{ opacity: 0.15, x: 0, rotate: -18 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-1/3 left-[-60px] md:left-[2%] w-[280px] md:w-[420px] -translate-y-1/2"
      >
        <svg viewBox="0 0 512 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF785" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFE74F" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <path
            d="M120 70c40-30 100-30 136 0h0c36-30 96-30 136 0 50 35 80 100 80 150 0 36-28 60-58 60-22 0-38-14-46-34l-18-44H162l-18 44c-8 20-24 34-46 34-30 0-58-24-58-60 0-50 30-115 80-150Zm75 70h-40v-25h-25v25h-40v25h40v25h25v-25h40v-25Zm150 25c0 12 10 22 22 22s22-10 22-22-10-22-22-22-22 10-22 22Zm-60-45c0 12 10 22 22 22s22-10 22-22-10-22-22-22-22 10-22 22Z"
            fill="url(#g1)"
            stroke="#FFF785"
            strokeOpacity="0.4"
            strokeWidth="1.5"
          />
        </svg>
      </motion.div>

      {/* Sağ üst — abstract triangle / corner */}
      <motion.div
        initial={{ opacity: 0, x: 60, rotate: 20 }}
        animate={{ opacity: 0.18, x: 0, rotate: 15 }}
        transition={{ duration: 1.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-1/4 right-[-40px] md:right-[3%] w-[260px] md:w-[380px]"
      >
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFE74F" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Joystick analog with concentric rings */}
          <circle cx="200" cy="200" r="180" stroke="url(#g2)" strokeWidth="1" fill="none" />
          <circle cx="200" cy="200" r="140" stroke="#FFF785" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 6" fill="none" />
          <circle cx="200" cy="200" r="90" stroke="#FFF785" strokeOpacity="0.4" strokeWidth="1.5" fill="none" />
          <circle cx="200" cy="200" r="50" fill="url(#g2)" />
          <circle cx="200" cy="200" r="14" fill="#FFF785" fillOpacity="0.6" />
          {/* Crosshair */}
          <line x1="200" y1="20" x2="200" y2="60" stroke="#FFF785" strokeOpacity="0.5" strokeWidth="2" />
          <line x1="200" y1="340" x2="200" y2="380" stroke="#FFF785" strokeOpacity="0.5" strokeWidth="2" />
          <line x1="20" y1="200" x2="60" y2="200" stroke="#FFF785" strokeOpacity="0.5" strokeWidth="2" />
          <line x1="340" y1="200" x2="380" y2="200" stroke="#FFF785" strokeOpacity="0.5" strokeWidth="2" />
        </svg>
      </motion.div>

      {/* Vertical scan lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 3px, rgba(255,255,255,0.5) 3px, rgba(255,255,255,0.5) 4px)",
        }}
      />

      {/* Pulse rays */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1.05, opacity: 0.5 }}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#FFF785]/10"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 0.4 }}
        transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#FFF785]/15"
      />
    </div>
  );
}
