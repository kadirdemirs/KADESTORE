"use client";
import { useEffect, useState } from "react";
import { Trash2, Shield, User } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleToggleRole(user: any) {
    const newRole = user.role === "admin" ? "user" : "admin";
    if (!confirm(`Bu kullanıcıyı ${newRole === "admin" ? "admin" : "normal kullanıcı"} yapmak istiyor musunuz?`)) return;
    await fetch(`/api/users/${user.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: newRole }) });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu kullanıcıyı silmek istiyor musunuz? Bu işlem geri alınamaz.")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    load();
  }

  const rankColors: Record<string, string> = {
    Bronze: "text-[#FFF785]", Silver: "text-gray-500", Gold: "text-yellow-500",
    Platinum: "text-cyan-500", Diamond: "text-blue-500", Elite: "text-purple-500", none: "text-gray-500",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Kullanıcılar</h1>
        <p className="text-gray-500 text-sm">{users.length} kullanıcı</p>
      </div>

      <div className="bg-[#111111] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Yükleniyor...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Kullanıcı bulunamadı.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#0a0a0a] border-b border-white/5">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Kullanıcı</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rol</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Puan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rank</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Siparişler</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Kayıt</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#0a0a0a]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#FFF785] flex items-center justify-center text-[#0a0a0a] text-xs font-bold flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-white/5 text-gray-600"}`}>
                      {user.role === "admin" ? "Admin" : "Kullanıcı"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#FFF785] font-semibold">{user.points}</td>
                  <td className={`px-4 py-3 text-xs font-medium ${rankColors[user.rank || "none"]}`}>
                    {user.rank === "none" || !user.rank ? "—" : user.rank}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{user._count?.orders ?? 0}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString("tr-TR")}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => handleToggleRole(user)} title={user.role === "admin" ? "Admin yetkisini kaldır" : "Admin yap"}
                        className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition">
                        {user.role === "admin" ? <User size={14} /> : <Shield size={14} />}
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="p-1.5 text-gray-500 hover:text-[#FFF785] hover:bg-[#FFF785]/10 rounded-lg transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
