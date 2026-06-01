export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-white/10 border-t-[#FFF785] rounded-full animate-spin" />
        <p className="text-[10px] tracking-[0.3em] text-gray-500 uppercase absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
          Yükleniyor
        </p>
      </div>
    </div>
  );
}
