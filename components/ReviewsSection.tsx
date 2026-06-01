"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Star, MessageSquare } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string };
}

export default function ReviewsSection({ gameId }: { gameId: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/reviews?gameId=${gameId}`);
    const data = await res.json();
    setReviews(data.reviews || []);
    setAverage(data.average || 0);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [gameId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, rating, comment }),
    });
    const data = await res.json();
    if (res.ok) {
      setShowForm(false);
      setComment("");
      load();
    } else {
      setError(data.error || "Hata oluştu.");
    }
    setSubmitting(false);
  }

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Yorumlar</h2>
          <p className="text-sm text-gray-400">
            {reviews.length > 0
              ? `${reviews.length} yorum · Ortalama ${average.toFixed(1)} / 5`
              : "Henüz yorum yok"}
          </p>
        </div>
        {session && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a] px-4 py-2 rounded-full text-sm font-semibold transition"
          >
            <MessageSquare size={14} /> Yorum Yaz
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-[#111111] border border-white/5 rounded-2xl p-5 mb-5">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Puanınız</label>
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={`p-1 transition ${n <= rating ? "text-[#FFF785]" : "text-white/20"}`}
              >
                <Star size={26} fill={n <= rating ? "#FFF785" : "transparent"} />
              </button>
            ))}
          </div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Yorumunuz</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            minLength={5}
            maxLength={1000}
            rows={4}
            placeholder="Bu oyun hakkındaki düşünceleriniz..."
            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFF785]/60 transition"
          />
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a] px-5 py-2.5 rounded-full text-sm font-semibold disabled:opacity-60"
            >
              {submitting ? "Gönderiliyor..." : "Gönder"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border border-white/10 text-gray-300 px-5 py-2.5 rounded-full text-sm hover:bg-white/5"
            >
              İptal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">Yorumlar yükleniyor...</p>
      ) : reviews.length === 0 ? (
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-8 text-center">
          <MessageSquare size={32} className="text-white/10 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Bu oyun için henüz yorum yapılmamış.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-[#111111] border border-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#FFF785] flex items-center justify-center text-[#0a0a0a] text-xs font-bold">
                  {r.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{r.user.name}</p>
                  <p className="text-[10px] text-gray-500">
                    {new Date(r.createdAt).toLocaleDateString("tr-TR")}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      size={13}
                      className={n <= r.rating ? "text-[#FFF785]" : "text-white/20"}
                      fill={n <= r.rating ? "#FFF785" : "transparent"}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
