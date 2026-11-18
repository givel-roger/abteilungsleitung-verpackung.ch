"use client";

import { useState, useEffect, useCallback } from "react";

type Bewerbung = {
  id: string;
  timestamp: string;
  erfahrung: string;
  ausbildung: string;
  fuehrung: string;
  sprachen: string[];
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  score: number;
  status: "neu" | "kontaktiert" | "gespraech" | "eingestellt" | "abgesagt";
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  neu: { label: "Neu", color: "bg-blue-100 text-blue-800" },
  kontaktiert: { label: "Kontaktiert", color: "bg-yellow-100 text-yellow-800" },
  gespraech: { label: "Gespräch", color: "bg-purple-100 text-purple-800" },
  eingestellt: { label: "Eingestellt", color: "bg-green-100 text-green-800" },
  abgesagt: { label: "Abgesagt", color: "bg-red-100 text-red-800" },
};

const ERFAHRUNG_LABELS: Record<string, string> = {
  produktion_lebensmittel: "Lebensmittelproduktion",
  produktion_andere: "Andere Produktion",
  logistik_lager: "Logistik / Lager",
  quereinsteiger: "Quereinsteiger",
};

const AUSBILDUNG_LABELS: Record<string, string> = {
  lebensmittel_abgeschlossen: "Lebensmittel abgeschlossen",
  andere_abgeschlossen: "Andere Ausbildung",
  in_ausbildung: "In Ausbildung",
  keine_praxis: "Keine, aber Praxis",
};

const FUEHRUNG_LABELS: Record<string, string> = {
  ja_mehrjaehrig: "Mehrjährig",
  ja_erste: "Erste Erfahrung",
  nein_interesse: "Nein, aber Interesse",
  nein: "Nein",
};

function ScoreBadge({ score }: { score: number }) {
  let color = "bg-red-100 text-red-700";
  if (score >= 70) color = "bg-green-100 text-green-700";
  else if (score >= 50) color = "bg-yellow-100 text-yellow-700";
  else if (score >= 30) color = "bg-orange-100 text-orange-700";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${color}`}>
      {score}%
    </span>
  );
}

export default function Cockpit() {
  const [key, setKey] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [data, setData] = useState<Bewerbung[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Bewerbung | null>(null);
  const [sortBy, setSortBy] = useState<"score" | "date">("score");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bewerbung?key=${encodeURIComponent(key)}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json);
      setLoggedIn(true);
    } catch {
      alert("Zugriff verweigert oder Fehler.");
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem("cockpit_key") : null;
    if (stored) {
      setKey(stored);
    }
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/bewerbung?key=${encodeURIComponent(key)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem("cockpit_key", key);
    load();
  }

  const sorted = [...data].sort((a, b) => {
    if (sortBy === "score") return b.score - a.score;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const stats = {
    total: data.length,
    neu: data.filter(d => d.status === "neu").length,
    avgScore: data.length ? Math.round(data.reduce((s, d) => s + d.score, 0) / data.length) : 0,
    top: data.filter(d => d.score >= 70).length,
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cockpit</h1>
          <p className="text-gray-500 text-sm mb-6">Bewerbungen für Stv. Abteilungsleitung Verpackung</p>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Zugangscode"
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-blue-500"
          />
          <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors cursor-pointer">
            {loading ? "..." : "Anmelden"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Bewerbungs-Cockpit</h1>
          <p className="text-xs text-gray-500">Stv. Abteilungsleitung Verpackung · Confiserie Bachmann</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={load} className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">↻ Aktualisieren</button>
          <button onClick={() => { setLoggedIn(false); sessionStorage.removeItem("cockpit_key"); }} className="text-sm text-red-600 hover:text-red-800 cursor-pointer">Abmelden</button>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Bewerbungen", val: stats.total, color: "text-gray-900" },
            { label: "Neue", val: stats.neu, color: "text-blue-600" },
            { label: "Ø Score", val: `${stats.avgScore}%`, color: "text-yellow-600" },
            { label: "Top-Kandidaten (≥70%)", val: stats.top, color: "text-green-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">{data.length} Bewerbung{data.length !== 1 ? "en" : ""}</p>
          <div className="flex gap-2">
            <button onClick={() => setSortBy("score")} className={`text-xs px-3 py-1.5 rounded-full cursor-pointer ${sortBy === "score" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}>Nach Score</button>
            <button onClick={() => setSortBy("date")} className={`text-xs px-3 py-1.5 rounded-full cursor-pointer ${sortBy === "date" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}>Nach Datum</button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {sorted.length === 0 ? (
            <div className="p-12 text-center text-gray-400">Noch keine Bewerbungen eingegangen.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">E-Mail</th>
                    <th className="px-4 py-3">Erfahrung</th>
                    <th className="px-4 py-3">Führung</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Datum</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sorted.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3"><ScoreBadge score={b.score} /></td>
                      <td className="px-4 py-3 font-medium text-gray-900">{b.vorname} {b.nachname}</td>
                      <td className="px-4 py-3 text-gray-600">{b.email}</td>
                      <td className="px-4 py-3 text-gray-600">{ERFAHRUNG_LABELS[b.erfahrung] || b.erfahrung}</td>
                      <td className="px-4 py-3 text-gray-600">{FUEHRUNG_LABELS[b.fuehrung] || b.fuehrung}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_LABELS[b.status]?.color || ""}`}>
                          {STATUS_LABELS[b.status]?.label || b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{new Date(b.timestamp).toLocaleDateString("de-CH")}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelected(b)} className="text-blue-600 hover:text-blue-800 text-xs cursor-pointer">Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selected.vorname} {selected.nachname}</h2>
                <p className="text-sm text-gray-500">{selected.email} {selected.telefon && `· ${selected.telefon}`}</p>
              </div>
              <ScoreBadge score={selected.score} />
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Erfahrung</p>
                <p className="text-sm font-medium text-gray-900">{ERFAHRUNG_LABELS[selected.erfahrung] || selected.erfahrung}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Ausbildung</p>
                <p className="text-sm font-medium text-gray-900">{AUSBILDUNG_LABELS[selected.ausbildung] || selected.ausbildung}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Führungserfahrung</p>
                <p className="text-sm font-medium text-gray-900">{FUEHRUNG_LABELS[selected.fuehrung] || selected.fuehrung}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Sprachen</p>
                <p className="text-sm font-medium text-gray-900">{selected.sprachen.join(", ") || "—"}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bewerbung eingegangen</p>
                <p className="text-sm font-medium text-gray-900">{new Date(selected.timestamp).toLocaleString("de-CH")}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Status ändern</p>
              <div className="flex flex-wrap gap-2">
                {(["neu", "kontaktiert", "gespraech", "eingestellt", "abgesagt"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => { updateStatus(selected.id, s); setSelected({ ...selected, status: s }); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                      selected.status === s
                        ? STATUS_LABELS[s].color + " ring-2 ring-offset-1 ring-gray-300"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {STATUS_LABELS[s].label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setSelected(null)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors">
              Schliessen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
