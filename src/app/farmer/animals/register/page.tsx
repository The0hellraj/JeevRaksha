"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterAnimalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    species: "",
    breed: "",
    age: "",
    gender: "Female",
    weight: "",
    village: "",
    block: "",
    district: "",
  });

  function get(k: string) { return (form as any)[k]; }
  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const stored = localStorage.getItem("jeevraksha_user");
    if (!stored) { router.push("/login"); return; }
    const user = JSON.parse(stored);

    try {
      const res = await fetch("/api/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ownerId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to register animal"); setLoading(false); return; }
      router.push("/farmer/report");
    } catch {
      setError("Network error.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        <Link href="/farmer/report" className="text-sm text-gray-500 hover:text-violet-700 mb-4 inline-block">← Back to Report</Link>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-violet-700 px-6 py-5 text-white">
            <h2 className="text-xl font-bold">Register New Animal</h2>
            <p className="text-violet-200 text-sm mt-1">नया पशु पंजीकृत करें</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Species *</label>
                <select required value={form.species} onChange={(e) => set("species", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-violet-500">
                  <option value="">Select...</option>
                  {["Cow", "Buffalo", "Goat", "Sheep", "Pig", "Poultry", "Horse", "Camel"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Breed</label>
                <input type="text" value={form.breed} onChange={(e) => set("breed", e.target.value)}
                  placeholder="e.g. Gir, Murrah"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                <select value={form.gender} onChange={(e) => set("gender", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-violet-500">
                  <option>Female</option>
                  <option>Male</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Age (years)</label>
                <input type="number" min="0" value={form.age} onChange={(e) => set("age", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Weight (kg)</label>
                <input type="number" min="0" value={form.weight} onChange={(e) => set("weight", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-violet-500" />
              </div>
            </div>

            <hr />
            <h3 className="text-sm font-bold text-gray-700">Location</h3>
            <div className="grid grid-cols-3 gap-2">
              {[["village", "Village *"], ["block", "Block *"], ["district", "District *"]].map(([k, label]) => (
                <div key={k}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                  <input required type="text" value={get(k)} onChange={(e) => set(k, e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-violet-500 text-sm" />
                </div>
              ))}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 disabled:opacity-60 transition">
              {loading ? "Registering..." : "Register Animal"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
