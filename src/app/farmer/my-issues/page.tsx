"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Clock, CheckCircle, ArrowLeft, Loader2, MapPin } from "lucide-react";

export default function MyIssuesPage() {
  const router = useRouter();
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("jeevraksha_user");
    if (!stored) { router.push("/login"); return; }
    
    const user = JSON.parse(stored);
    
    fetch(`/api/my-issues?userId=${user.id}`)
      .then(r => r.json())
      .then(data => {
        setIssues(data.issues || []);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f5f4fb] flex flex-col p-4 md:p-8">
      <div className="max-w-4xl mx-auto w-full">
        <header className="flex items-center gap-3 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
            <span className="text-2xl">📋</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">My Reported Issues</h1>
            <p className="text-sm text-gray-500 font-medium mt-0.5">Track the status of your animal health reports</p>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
          </div>
        ) : issues.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🌱</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">No issues reported yet</h2>
            <p className="text-gray-500 mt-2 mb-6">When you report a sick animal, you can track its progress here.</p>
            <Link href="/farmer/report" className="inline-flex items-center px-6 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition shadow-md">
              Report an Issue Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {issues.map(issue => (
              <div key={issue.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-4 transition hover:shadow-md">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      issue.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
                      issue.riskLevel === 'MEDIUM' ? 'bg-orange-100 text-orange-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {issue.riskLevel} RISK
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {new Date(issue.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {issue.animal.species} {issue.animal.breed ? `(${issue.animal.breed})` : ''} - {issue.symptoms.map((s:any)=>s.name).join(', ')}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><AlertCircle className="w-4 h-4"/> {issue.animalsAffected} affected</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {issue.locationVillage}</span>
                  </div>
                </div>

                <div className="md:border-l md:border-gray-100 md:pl-5 md:w-48 shrink-0 flex flex-col justify-center">
                  <p className="text-xs uppercase font-bold text-gray-400 mb-1.5 tracking-wider">Status</p>
                  
                  {(!issue.cases || issue.cases.length === 0) ? (
                    <div className="flex items-center gap-2 text-amber-600 font-bold bg-amber-50 px-3 py-2 rounded-lg">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Under Review</span>
                    </div>
                  ) : issue.cases[0].status === "CLOSED" || issue.cases[0].status === "RECOVERED" ? (
                    <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-3 py-2 rounded-lg">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Resolved</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-blue-600 font-bold bg-blue-50 px-3 py-2 rounded-lg">
                      <Clock className="w-4 h-4 animate-pulse" />
                      <span className="text-sm">Active Case</span>
                    </div>
                  )}
                  
                  {issue.cases?.[0] && (
                    <p className="text-[10px] text-gray-400 mt-2 font-medium">Case #{issue.cases[0].id.slice(-6).toUpperCase()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
