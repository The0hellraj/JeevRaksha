"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mic, MicOff, MapPin } from "lucide-react";
import dynamic from "next/dynamic";

const LocationPickerMap = dynamic(() => import("../../../components/maps/LocationPickerMap"), { ssr: false });

const SYMPTOMS = ["Fever", "Cough", "Loss of appetite", "Diarrhea", "Weakness", "Sudden death", "Blistering", "Excessive salivation", "Nasal discharge", "Lameness"];

export default function ReportPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<any>(null);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isListeningSymptoms, setIsListeningSymptoms] = useState(false);
  const [aiSymptomText, setAiSymptomText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const [drafting, setDrafting] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [isListeningDraft, setIsListeningDraft] = useState(false);

  const [form, setForm] = useState({
    animalId: "",
    symptoms: [] as string[],
    severity: "MILD",
    deaths: 0 as number | "",
    animalsAffected: 1 as number | "",
    vaccinatedCount: 0 as number | "",
    temperature: "",
    duration: "",
    locationVillage: "",
    locationBlock: "",
    locationDistrict: "",
    latitude: null as number | null,
    longitude: null as number | null,
    additionalNotes: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("jeevraksha_user");
    if (!stored) { router.push("/login"); return; }
    const u = JSON.parse(stored);
    setUser(u);
    fetch(`/api/animals?ownerId=${u.id}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setAnimals(data); });
  }, [router]);

  function toggleSymptom(sym: string) {
    setForm((f) => ({
      ...f,
      symptoms: f.symptoms.includes(sym) ? f.symptoms.filter((s) => s !== sym) : [...f.symptoms, sym],
    }));
  }

  const startListening = () => {
    const SpeechRecognition = typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setForm(f => ({ ...f, additionalNotes: f.additionalNotes ? f.additionalNotes + " " + transcript : transcript }));
    };
    recognition.onerror = (e: any) => { console.error(e); setIsListening(false); };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const startListeningSymptoms = () => {
    const SpeechRecognition = typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null;
    if (!SpeechRecognition) return alert("Speech recognition is not supported in this browser.");
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    
    recognition.onstart = () => setIsListeningSymptoms(true);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setAiSymptomText(prev => prev ? prev + " " + transcript : transcript);
    };
    recognition.onerror = (e: any) => { console.error(e); setIsListeningSymptoms(false); };
    recognition.onend = () => setIsListeningSymptoms(false);
    recognition.start();
  };

  const analyzeSymptoms = async () => {
    if (!aiSymptomText.trim()) return;
    setAnalyzing(true);
    try {
      const res = await fetch("/api/map-symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: aiSymptomText, predefinedSymptoms: SYMPTOMS })
      });
      const data = await res.json();
      if (data.matched && data.matched.length > 0) {
        setForm(f => {
          const newSymptoms = new Set([...f.symptoms, ...data.matched]);
          return { ...f, symptoms: Array.from(newSymptoms) };
        });
        setAiSymptomText("");
      } else {
        alert("Could not automatically map symptoms. Please try again or select manually.");
      }
    } catch (e) {
      console.error(e);
      alert("Error reaching AI service.");
    }
    setAnalyzing(false);
  };

  const startListeningDraft = () => {
    const SpeechRecognition = typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null;
    if (!SpeechRecognition) return alert("Speech recognition is not supported in this browser.");
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    
    recognition.onstart = () => setIsListeningDraft(true);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setDraftText(prev => prev ? prev + " " + transcript : transcript);
    };
    recognition.onerror = (e: any) => { console.error(e); setIsListeningDraft(false); };
    recognition.onend = () => setIsListeningDraft(false);
    recognition.start();
  };

  const autoDraftReport = async () => {
    if (!draftText.trim()) return;
    setDrafting(true);
    try {
      const res = await fetch("/api/draft-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: draftText, predefinedSymptoms: SYMPTOMS })
      });
      if (res.ok) {
        const data = await res.json();
        setForm(f => ({
          ...f,
          symptoms: data.symptoms || f.symptoms,
          severity: data.severity || f.severity,
          animalsAffected: data.animalsAffected !== undefined ? data.animalsAffected : f.animalsAffected,
          deaths: data.deaths !== undefined ? data.deaths : f.deaths,
          locationVillage: data.locationVillage || f.locationVillage,
          additionalNotes: data.additionalNotes || f.additionalNotes,
        }));
        alert("Form auto-filled successfully! Please review the details.");
      } else {
        alert("Failed to draft report.");
      }
    } catch (e) {
      console.error(e);
      alert("Error reaching AI service.");
    }
    setDrafting(false);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.animalId) { setError("Please select an animal."); return; }
    if (form.symptoms.length === 0) { setError("Please select at least one symptom."); return; }
    if (!form.locationVillage) { setError("Please enter the village name."); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/health-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, reporterId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Submission failed"); setLoading(false); return; }
      setSubmittedReport(data);
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  if (submitted && submittedReport) {
    const riskColor = submittedReport.riskLevel === "HIGH" ? "red" : submittedReport.riskLevel === "MEDIUM" ? "yellow" : "green";
    return (
      <div className="min-h-screen bg-[#f5f4fb] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${riskColor === "red" ? "bg-red-100" : riskColor === "yellow" ? "bg-yellow-100" : "bg-green-100"}`}>
            <span className="text-3xl">{riskColor === "red" ? "⚠️" : riskColor === "yellow" ? "⚡" : "✅"}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Report Submitted</h2>
          <p className="text-gray-500 text-center text-sm mb-6">रिपोर्ट सफलतापूर्वक जमा हुई</p>

          <div className={`p-4 rounded-lg mb-4 ${riskColor === "red" ? "bg-red-50 border border-red-200" : riskColor === "yellow" ? "bg-yellow-50 border border-yellow-200" : "bg-green-50 border border-green-200"}`}>
            <p className={`text-sm font-bold ${riskColor === "red" ? "text-red-700" : riskColor === "yellow" ? "text-yellow-700" : "text-green-700"}`}>
              Risk Assessment: {submittedReport.riskLevel} (Score: {submittedReport.riskScore}/100)
            </p>
            <p className={`text-sm mt-1 ${riskColor === "red" ? "text-red-600" : riskColor === "yellow" ? "text-yellow-600" : "text-green-600"}`}>
              {submittedReport.recommendedAction}
            </p>
          </div>

          <p className="text-xs text-gray-400 text-center mb-4">Report ID: {submittedReport.id}</p>
          <div className="space-y-2">
            <button onClick={() => { setSubmitted(false); setForm({ animalId: "", symptoms: [], severity: "MILD", deaths: 0, animalsAffected: 1, vaccinatedCount: 0, temperature: "", duration: "", locationVillage: "", locationBlock: "", locationDistrict: "", latitude: null, longitude: null, additionalNotes: "" }); }} className="w-full py-2 bg-violet-600 text-white rounded-lg font-bold hover:bg-violet-700 transition">
              Submit Another Report
            </button>
            <Link href="/dashboard" className="block w-full py-2 text-center bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f4fb]">
      {/* Topbar */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-violet-700 to-purple-500 bg-clip-text text-transparent">JeevRaksha</h1>
          <p className="text-xs text-gray-500">{user?.name || "Loading..."}</p>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/farmer/my-issues" className="text-sm font-bold text-gray-600 hover:text-violet-700">My Issues</Link>
          <Link href="/farmer/chat" className="text-sm font-bold text-violet-700 hover:text-violet-900 bg-violet-100 px-3 py-1.5 rounded-full flex items-center gap-1 transition">
            <Mic className="w-4 h-4" /> Ask AI
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-violet-700 hidden md:block">Dashboard →</Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-br from-violet-100 to-purple-50 px-6 py-5 border-b border-violet-200">
            <h2 className="text-lg font-extrabold text-violet-800 flex items-center gap-2">
              <span className="text-xl">✨</span> AI Issue Reporter
            </h2>
            <p className="text-violet-600 text-sm mt-1">Speak or type your entire issue, and AI will draft the report for you! (अपनी समस्या बोलें, AI फॉर्म भर देगा)</p>
          </div>
          <div className="p-6">
            <div className="flex gap-2">
              <button type="button" onClick={startListeningDraft} className={`p-3 rounded-lg flex-shrink-0 transition flex items-center justify-center ${isListeningDraft ? 'bg-red-100 text-red-600 animate-pulse border border-red-200' : 'bg-white border border-gray-300 text-gray-500 hover:text-violet-700 hover:bg-violet-50 hover:border-violet-300'}`} title="Speak">
                {isListeningDraft ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              <textarea 
                value={draftText} 
                onChange={e => setDraftText(e.target.value)} 
                placeholder="Example: Meri 3 gaay bimar hai, ek mar gayi hai. Unhe bukhar aur khansi hai. Main Rampur gaon se hu." 
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-violet-500 resize-none" 
                rows={2}
              />
            </div>
            <button 
              type="button" 
              onClick={autoDraftReport} 
              disabled={drafting || !draftText.trim()} 
              className="mt-3 w-full bg-violet-600 text-white px-4 py-3 rounded-lg font-bold disabled:opacity-50 hover:bg-violet-700 transition"
            >
              {drafting ? "Drafting Report..." : "Auto-Fill Form"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-br from-violet-700 to-purple-600 px-6 py-5 text-white">
            <h2 className="text-xl font-bold">Report Animal Health Issue</h2>
            <p className="text-violet-200 text-sm mt-1">पशु स्वास्थ्य समस्या दर्ज करें</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
            )}

            {/* Animal Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Animal (पशु चुनें) *</label>
              {animals.length === 0 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700 font-medium">No animals registered.</p>
                  <Link href="/farmer/animals/register" className="text-sm text-violet-700 font-bold hover:underline">+ Register an animal first</Link>
                </div>
              ) : (
                <select
                  required
                  value={form.animalId}
                  onChange={(e) => setForm((f) => ({ ...f, animalId: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-violet-500 outline-none"
                >
                  <option value="">-- Select an animal --</option>
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.species} ({a.breed || "Unknown"}) – {a.village}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Symptoms (लक्षण) *</label>

              {/* AI Auto-Match Input */}
              <div className="flex gap-2 mb-4 bg-gray-50 p-2 rounded-lg border border-gray-200">
                <button type="button" onClick={startListeningSymptoms} className={`p-2 rounded-md transition flex-shrink-0 ${isListeningSymptoms ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-violet-100 text-violet-700 hover:bg-violet-200'}`} title="Speak symptoms">
                  {isListeningSymptoms ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <input type="text" value={aiSymptomText} onChange={e => setAiSymptomText(e.target.value)} placeholder="Type or speak symptoms to auto-match..." className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-violet-500" />
                <button type="button" onClick={analyzeSymptoms} disabled={analyzing || !aiSymptomText.trim()} className="bg-violet-600 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-bold disabled:opacity-50 hover:bg-violet-700 transition flex-shrink-0">
                  {analyzing ? "Analyzing..." : "Auto Match"}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {SYMPTOMS.map((sym) => (
                  <label key={sym} className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition ${form.symptoms.includes(sym) ? "bg-violet-50 border-violet-500" : "border-gray-200 hover:bg-gray-50"}`}>
                    <input
                      type="checkbox"
                      checked={form.symptoms.includes(sym)}
                      onChange={() => toggleSymptom(sym)}
                      className="accent-violet-600"
                    />
                    <span className="text-sm text-gray-800">{sym}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Severity (गंभीरता) *</label>
              <div className="grid grid-cols-3 gap-2">
                {["MILD", "MODERATE", "SEVERE"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, severity: s }))}
                    className={`py-2 rounded-lg border text-sm font-semibold transition ${form.severity === s
                      ? s === "SEVERE" ? "bg-red-600 text-white border-red-600" : s === "MODERATE" ? "bg-yellow-500 text-white border-yellow-500" : "bg-violet-600 text-white border-violet-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                  >
                    {s === "MILD" ? "Mild (हल्का)" : s === "MODERATE" ? "Moderate (मध्यम)" : "Severe (गंभीर)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Animals Affected *</label>
                <input type="number" min="0" value={form.animalsAffected}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm((f) => ({ ...f, animalsAffected: val === "" ? "" : parseInt(val) }));
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-violet-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Deaths</label>
                <input type="number" min="0" value={form.deaths}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm((f) => ({ ...f, deaths: val === "" ? "" : parseInt(val) }));
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-violet-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Vaccinated Animals</label>
                <input type="number" min="0" value={form.vaccinatedCount}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm((f) => ({ ...f, vaccinatedCount: val === "" ? "" : parseInt(val) }));
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-violet-500 outline-none" />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location (स्थान) *</label>
              <div className="mb-4">
                <LocationPickerMap 
                  onLocationSelect={(lat, lng) => setForm(f => ({ ...f, latitude: lat, longitude: lng }))} 
                />
                {form.latitude && form.longitude && (
                  <p className="text-xs text-emerald-600 mt-1 font-bold flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Location captured: {form.latitude.toFixed(4)}, {form.longitude.toFixed(4)}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input type="text" placeholder="Village / ग्राम *" value={form.locationVillage}
                  onChange={(e) => setForm((f) => ({ ...f, locationVillage: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-violet-500 text-sm outline-none" required />
                <input type="text" placeholder="Block / ब्लॉक" value={form.locationBlock}
                  onChange={(e) => setForm((f) => ({ ...f, locationBlock: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-violet-500 text-sm outline-none" />
                <input type="text" placeholder="District / जिला" value={form.locationDistrict}
                  onChange={(e) => setForm((f) => ({ ...f, locationDistrict: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-violet-500 text-sm outline-none" />
              </div>
            </div>

            {/* Notes with Speech-to-Text */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">Additional Notes</label>
                <button 
                  type="button" 
                  onClick={startListening}
                  className={`text-xs flex items-center gap-1 font-semibold px-2 py-1 rounded-md transition ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-violet-100 text-violet-700 hover:bg-violet-200'}`}
                >
                  {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                  {isListening ? "Listening..." : "Speak (Hindi/English)"}
                </button>
              </div>
              <textarea rows={3} value={form.additionalNotes}
                onChange={(e) => setForm((f) => ({ ...f, additionalNotes: e.target.value }))}
                placeholder="Describe any other symptoms or observations... You can type or use the mic button."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-violet-500 resize-none outline-none" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-violet-700 hover:to-purple-700 disabled:opacity-60 transition shadow-md">
              {loading ? "Submitting..." : "Submit Report (रिपोर्ट जमा करें)"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
