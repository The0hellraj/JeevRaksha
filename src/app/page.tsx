"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  FlaskConical,
  Globe,
  HeartPulse,
  LayoutDashboard,
  MapPin,
  Menu,
  MessageSquare,
  PlusCircle,
  Shield,
  Star,
  Syringe,
  TrendingUp,
  Users,
  Wifi,
} from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("jeevraksha_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 px-6 md:px-20 py-0 flex items-center justify-between shadow-sm" style={{ height: "64px" }}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-700 rounded-lg flex items-center justify-center shadow-md shadow-violet-200">
            <HeartPulse className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">JeevRaksha</span>
        </Link>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "Services", href: "#services" },
            { label: "How It Works", href: "#how" },
            { label: "Our Team", href: "#team" },
            { label: "Dashboard", href: "/dashboard" },
          ].map(({ label, href }) => (
            <a key={label} href={href} className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
              {label}
            </a>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link href="/login" className="hidden md:inline-flex text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">
                Sign In
              </Link>
              <Link href="/register" className="hidden sm:inline-flex items-center text-sm font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 transition-colors px-4 py-2 rounded-lg border border-violet-100">
                Create Account
              </Link>
            </>
          ) : (
            <Link href="/dashboard" className="inline-flex text-sm font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 transition-colors px-3 py-2 rounded-lg border border-violet-100">
              Dashboard
            </Link>
          )}
          <Link href="/farmer/report" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-colors px-4 py-2 rounded-lg shadow-md shadow-violet-200">
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Report Issue</span>
            <span className="inline sm:hidden">Report</span>
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-16 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 40%, #6d28d9 100%)" }}>
        {/* Subtle grid overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
          backgroundSize: "32px 32px"
        }} />
        {/* Glow blobs */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-fuchsia-500/15 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-20 flex flex-col md:flex-row items-center justify-between min-h-[90vh] gap-16 py-20">
          {/* Left */}
          <div className="flex-1 text-white z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm px-3.5 py-1.5 rounded-full mb-8">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-white/85 tracking-wide uppercase">Live Livestock Surveillance Platform</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Animal Health
              <br />
              Intelligence for
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">
                Rural India.
              </span>
            </h1>

            <p className="text-base text-white/65 mb-10 leading-relaxed">
              AI-powered surveillance connecting 8,000+ farmers, veterinarians, and government officials to detect, respond to, and prevent livestock disease outbreaks in real time.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-14">
              <Link href="/farmer/report" className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-violet-700 font-semibold rounded-xl hover:bg-violet-50 transition shadow-lg shadow-black/20 text-sm">
                <ClipboardList className="w-4 h-4" />
                Report Animal Issue
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition text-sm">
                <LayoutDashboard className="w-4 h-4" />
                View Dashboard
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {[
                  "photo-1633332755192-727a05c4013d",
                  "photo-1494790108377-be9c29b29330",
                  "photo-1607990281513-2c110a25bd8c",
                ].map((id) => (
                  <img
                    key={id}
                    src={`https://images.unsplash.com/${id}?w=40&h=40&fit=crop&crop=face`}
                    className="w-8 h-8 rounded-full border-2 border-violet-700 object-cover"
                    alt="User"
                  />
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-violet-700 bg-violet-500 flex items-center justify-center text-[10px] font-bold text-white">+8k</div>
              </div>
              <div>
                <div className="flex items-center gap-0.5 mb-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-white/60 text-xs">Trusted by 8,000+ farmers & vets</p>
              </div>
            </div>
          </div>

          {/* Right — floating dashboard card */}
          <div className="flex-1 relative flex justify-center items-center z-10 min-h-[480px] w-full max-w-md">
            {/* Main image */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=600&q=85&fit=crop"
                alt="Veterinarian with livestock"
                className="w-full h-[420px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-violet-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-bold text-sm">Field Veterinarian Network</p>
                <p className="text-white/60 text-xs mt-0.5">Active across 22 states in India</p>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-3.5 flex items-center gap-3 min-w-[180px] border border-gray-100">
              <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">High Risk Detected</p>
                <p className="text-[11px] text-red-500 font-medium mt-0.5">Rampur Village, UP</p>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-3.5 flex items-center gap-3 min-w-[190px] border border-gray-100">
              <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Syringe className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Vaccination Complete</p>
                <p className="text-[11px] text-emerald-600 font-medium mt-0.5">240 animals today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── TRUSTED BY ── */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 md:px-20">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">Trusted & referenced by leading institutions</p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {["ICAR", "IVRI", "NDDB", "Animal Husbandry Dept.", "NHM"].map((name) => (
              <span key={name} className="text-sm font-bold text-gray-300 tracking-widest uppercase">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {[
              { num: "50M+", label: "Animals Monitored", Icon: Activity },
              { num: "98%", label: "Early Detection Rate", Icon: TrendingUp },
              { num: "3,200+", label: "Field Vets Onboard", Icon: Users },
              { num: "22+", label: "States Covered", Icon: MapPin },
            ].map(({ num, label, Icon }) => (
              <div key={label} className="bg-white flex flex-col items-center justify-center py-10 px-6 text-center">
                <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-violet-600" />
                </div>
                <p className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">{num}</p>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 md:px-20">
          <div className="max-w-2xl mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-600 mb-4">What We Offer</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">Comprehensive surveillance<br />for every stage of care</h2>
            <p className="text-gray-500 text-base leading-relaxed">
              From first symptom report to laboratory confirmation and treatment — JeevRaksha covers the full animal health management lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { Icon: ClipboardList, title: "Health Reporting", desc: "Farmers & field workers log symptoms instantly with guided, multilingual forms.", color: "violet" },
              { Icon: Shield, title: "Risk Assessment", desc: "AI engine scores outbreak risk 0–100 in real-time based on 12+ parameters.", color: "red" },
              { Icon: MapPin, title: "Disease Mapping", desc: "Geospatial risk clusters visualized on interactive, live-updating maps.", color: "blue" },
              { Icon: Bell, title: "Alert System", desc: "High-risk zones automatically trigger SMS, push, and dashboard alerts.", color: "amber" },
              { Icon: FlaskConical, title: "Lab Tracking", desc: "Sample collection, dispatch, and result tracking — end to end.", color: "teal" },
              { Icon: Syringe, title: "Vaccination Mgmt", desc: "Schedule, track, and report vaccination drives across all registered animals.", color: "emerald" },
              { Icon: BarChart3, title: "Analytics Dashboard", desc: "Real-time analytics for block, district, and state-level decision makers.", color: "purple" },
              { Icon: Wifi, title: "Offline Support", desc: "Works in low-connectivity areas; syncs automatically when reconnected.", color: "indigo" },
            ].map(({ Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-violet-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-default">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 bg-${color}-50 group-hover:bg-${color}-100 transition-colors`}>
                  <Icon className={`w-5 h-5 text-${color}-600`} />
                </div>
                <h3 className="font-bold text-gray-800 text-sm mb-2">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-20">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-600 mb-4">How It Works</span>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-10 leading-tight">From field report<br />to resolved case in hours</h2>

              <div className="space-y-3">
                {[
                  {
                    step: "01",
                    title: "Farmer Reports an Issue",
                    desc: "Farmer submits a symptom report from their phone — with GPS location, animal ID, photo, and symptom checklist.",
                    Icon: ClipboardList,
                  },
                  {
                    step: "02",
                    title: "AI Risk Engine Assesses",
                    desc: "Our system scores the risk 0–100 based on severity, mortality rate, nearby cluster data, and historical patterns.",
                    Icon: Activity,
                  },
                  {
                    step: "03",
                    title: "Alerts Are Generated",
                    desc: "High-risk reports automatically create case files, notify assigned veterinarians, and alert government departments.",
                    Icon: Bell,
                  },
                  {
                    step: "04",
                    title: "Vet Responds & Treats",
                    desc: "Field vets visit, log field findings, collect lab samples, and enter treatment records — all in one platform.",
                    Icon: HeartPulse,
                  },
                ].map(({ step, title, desc, Icon }) => (
                  <div key={step} className="flex gap-4 p-4 rounded-xl hover:bg-violet-50/60 transition-colors group">
                    <div className="flex-shrink-0 flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-md shadow-violet-200">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-300">{step}</span>
                    </div>
                    <div className="pt-1">
                      <h3 className="font-bold text-gray-800 text-sm mb-1">{title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-violet-100 border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=700&q=85&fit=crop"
                  alt="Veterinarian examining livestock"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-violet-950/70 via-violet-950/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-bold">Field Veterinarian Network</p>
                  <p className="text-white/60 text-sm mt-0.5">3,200+ trained vets across 22 states</p>
                </div>
              </div>

              {/* Floating metric */}
              <div className="absolute -top-5 -left-5 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Avg. Response Time</p>
                  <p className="font-extrabold text-gray-900 text-lg leading-none">4.2 hrs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section id="team" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 md:px-20">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-600 mb-4">Our Experts</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-3 leading-tight">Meet our veterinary leadership</h2>
            <p className="text-gray-400 text-sm">Seasoned professionals leading India's most advanced livestock health network</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { name: "Dr. Priya Sharma", role: "Chief Veterinarian", img: "photo-1559839734-2b71ea197ec2" },
              { name: "Dr. Amit Patel", role: "Epidemiologist", img: "photo-1612349317150-e413f6a5b16d" },
              { name: "Dr. Sunita Rao", role: "Lab Specialist", img: "photo-1651008376811-b90baee60c1f" },
              { name: "Dr. Rajesh Kumar", role: "Field Coordinator", img: "photo-1582750433449-648ed127bb54" },
            ].map(({ name, role, img }, i) => (
              <div key={name} className="group rounded-2xl overflow-hidden bg-white border border-gray-100 hover:border-violet-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div className="overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/${img}?w=300&h=300&fit=crop&crop=face`}
                    alt={name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <p className="font-bold text-gray-800 text-sm">{name}</p>
                  <p className="text-violet-600 text-xs font-medium mt-0.5">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-20">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-600 mb-6">Testimonial</span>
              <div className="flex items-center gap-1 mb-5">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <blockquote className="text-2xl font-bold text-gray-800 leading-relaxed mb-8">
                "JeevRaksha helped us detect an FMD outbreak in our village 3 days earlier than usual. We saved 40+ animals from a preventable disease."
              </blockquote>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=60&h=60&fit=crop&crop=face"
                  className="w-11 h-11 rounded-full object-cover border-2 border-gray-100"
                  alt="Ramesh Kumar"
                />
                <div>
                  <p className="font-bold text-gray-800 text-sm">Ramesh Kumar</p>
                  <p className="text-xs text-gray-400 mt-0.5">Dairy Farmer, Varanasi (UP)</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=700&q=85&fit=crop"
                alt="Happy livestock farmer"
                className="rounded-2xl shadow-xl w-full h-80 object-cover border border-gray-100"
              />
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="font-extrabold text-gray-900 text-xl leading-none">40%</p>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">Faster outbreak response</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #6d28d9 100%)" }}>
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
          backgroundSize: "32px 32px"
        }} />
        <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[100px]" />

        <div className="relative max-w-3xl mx-auto px-6 text-center text-white">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-8">
            <MessageSquare className="w-3.5 h-3.5" />
            Get Started Today
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 leading-[1.1] tracking-tight">
            Protect your livestock.<br />
            <span className="text-yellow-300">Start monitoring today.</span>
          </h2>
          <p className="text-white/60 mb-10 text-base max-w-lg mx-auto leading-relaxed">
            Join 8,000+ farmers and veterinarians already using JeevRaksha to detect and prevent disease outbreaks across India.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-violet-700 font-bold rounded-xl hover:bg-yellow-50 transition shadow-lg shadow-black/20 text-sm"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition text-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              View Live Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-950 text-white pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <HeartPulse className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-bold">JeevRaksha</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                AI-powered animal health surveillance & early warning system for rural India.
              </p>
              <p className="text-gray-600 text-xs">पशु स्वास्थ्य सुरक्षा प्रणाली</p>
            </div>

            {/* Platform */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Platform</p>
              <div className="space-y-2.5">
                {[
                  { label: "Report Issue", href: "/farmer/report" },
                  { label: "My Issues", href: "/farmer/my-issues" },
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Risk Map", href: "/dashboard/map" },
                  { label: "AI Assistant", href: "/farmer/chat" },
                ].map(({ label, href }) => (
                  <Link key={label} href={href} className="block text-sm text-gray-500 hover:text-white transition-colors">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Users */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Users</p>
              <div className="space-y-2.5">
                {["Farmers (किसान)", "Veterinarians", "Field Workers", "Lab Technicians", "Govt. Officials"].map(u => (
                  <p key={u} className="text-sm text-gray-500">{u}</p>
                ))}
              </div>
            </div>

            {/* Account */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Account</p>
              <div className="space-y-2.5">
                <Link href="/login" className="block text-sm text-gray-500 hover:text-white transition-colors">Sign In</Link>
                <Link href="/register" className="block text-sm text-gray-500 hover:text-white transition-colors">Create Account</Link>
              </div>
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Languages</p>
                <p className="text-sm text-gray-500">English / हिंदी</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-3 pt-8">
            <p className="text-xs text-gray-600">© 2026 JeevRaksha. All rights reserved.</p>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Globe className="w-3 h-3" />
              <span>Built for Bharat</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
