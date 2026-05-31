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
      <main className="flex-1 bg-gray-50 dark:bg-gray-950 py-14 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
              <Lock size={26} className="text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Şifre Değiştir</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Hesabınızın güvenliği için güçlü bir şifre seçin.</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-7">
            {success ? (
              <div className="text-center py-4">
                <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
                <p className="font-semibold text-gray-900 dark:text-white">Şifreniz güncellendi!</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">E-posta adresinize bildirim gönderildi.</p>
                <Link href="/profile" className="inline-block mt-4 text-amber-500 hover:underline text-sm font-medium">Profil'e dön →</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400 text-sm p-3 rounded-xl">{error}</div>}
                {[
                  { label: "Mevcut Şifre", key: "current" as const, showKey: "current" as const },
                  { label: "Yeni Şifre", key: "newPw" as const, showKey: "new" as const },
                  { label: "Yeni Şifre (Tekrar)", key: "confirm" as const, showKey: "new" as const },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                    <input
                      type="password"
                      value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      required
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                ))}
                <button type="submit" disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white py-3 rounded-xl font-semibold text-sm transition mt-2">
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
