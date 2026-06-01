"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function ChangePasswordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ current: "", newPw: "", confirm: "" });
  const [show, setShow] = useState({ current: false, new: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => { if (status === "unauthenticated") router.push("/login"); }, [status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.newPw !== form.confirm) { setError("Yeni şifreler eşleşmiyor."); return; }
    if (form.newPw.length < 6) { setError("Şifre en az 6 karakter olmalı."); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: form.current, newPassword: form.newPw }),
    });
    const data = await res.json();
    if (res.ok) { setSuccess(true); setForm({ current: "", newPw: "", confirm: "" }); }
    else setError(data.error || "Bir hata oluştu.");
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-950">
      <Header />
      <main className="flex-1 bg-[#0a0a0a] dark:bg-gray-950 py-14 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF785]/15 dark:bg-[#FFE74F]/30 flex items-center justify-center mx-auto mb-4">
              <Lock size={26} className="text-[#FFF785]" />
            </div>
            <h1 className="text-2xl font-bold text-white dark:text-white">Şifre Değiştir</h1>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">Hesabınızın güvenliği için güçlü bir şifre seçin.</p>
          </div>

          <div className="bg-[#111111] dark:bg-gray-900 rounded-2xl border border-white/5 dark:border-gray-800 shadow-2xl p-7">
            {success ? (
              <div className="text-center py-4">
                <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
                <p className="font-semibold text-white dark:text-white">Şifreniz güncellendi!</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">E-posta adresinize bildirim gönderildi.</p>
                <Link href="/profile" className="inline-block mt-4 text-[#FFF785] hover:underline text-sm font-medium">Profil'e dön →</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="bg-[#FFF785]/10 dark:bg-[#FFE74F]/20 border border-[#FFF785]/20 dark:border-[#FFE74F] text-[#FFE74F] dark:text-[#FFF785] text-sm p-3 rounded-xl">{error}</div>}
                {[
                  { label: "Mevcut Şifre", key: "current" as const, showKey: "current" as const },
                  { label: "Yeni Şifre", key: "newPw" as const, showKey: "new" as const },
                  { label: "Yeni Şifre (Tekrar)", key: "confirm" as const, showKey: "new" as const },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-200 dark:text-gray-600 mb-1.5">{label}</label>
                    <input
                      type="password"
                      value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      required
                      className="w-full border border-white/10 dark:border-gray-700 bg-[#111111] dark:bg-gray-800 text-white dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#FFF785] transition"
                    />
                  </div>
                ))}
                <button type="submit" disabled={loading}
                  className="w-full bg-[#FFF785] hover:bg-[#FFF785] disabled:opacity-60 text-[#0a0a0a] py-3 rounded-xl font-semibold text-sm transition mt-2">
                  {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
