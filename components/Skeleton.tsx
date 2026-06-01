"use client";

interface SkeletonProps {
  className?: string;
}

// Tek skeleton blok — istediğin boyutta kullan
export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden bg-white/5 rounded-xl ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,247,133,0.08) 50%, transparent 100%)",
          animation: "shimmer 1.6s linear infinite",
        }}
      />
      <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
    </div>
  );
}

// Oyun kartı için hazır kullanım
export function GameCardSkeleton() {
  return (
    <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
      <Skeleton className="h-44 rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between mt-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

// Profil kütüphane (AccountCard) için
export function AccountCardSkeleton() {
  return (
    <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
      <Skeleton className="h-32 rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-9 w-full mt-2" />
      </div>
    </div>
  );
}
