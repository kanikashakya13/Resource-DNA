import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Dna,
  Share2,
  Building2,
  Microscope,
  CalendarCheck,
  Settings2,
  Truck,
  QrCode,
  Bell,
  ShieldCheck,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { openAuth } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* =========================================================================
          SECTION A: NAVIGATION BAR
         ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Brand */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 text-left group focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-800 text-cyan-300 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Dna className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-cyan-800 transition-colors">
                Resource DNA
              </span>
              <span className="block text-[10px] font-semibold text-cyan-700 tracking-wider uppercase">
                Scientific Resource Network
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm font-medium text-slate-700 hover:text-cyan-700 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-sm font-medium text-slate-700 hover:text-cyan-700 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm font-medium text-slate-700 hover:text-cyan-700 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-sm font-medium text-slate-700 hover:text-cyan-700 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('roles')}
              className="text-sm font-medium text-slate-700 hover:text-cyan-700 transition-colors"
            >
              Platform Roles
            </button>
          </nav>

          {/* Auth Actions (Login / Sign Up) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => openAuth('login')}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors rounded-lg hover:bg-slate-100/80 cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => openAuth('signup')}
              className="px-4.5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-cyan-800 rounded-lg shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Sign Up</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm font-medium text-slate-800"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left py-2 text-sm font-medium text-slate-800"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left py-2 text-sm font-medium text-slate-800"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left py-2 text-sm font-medium text-slate-800"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('roles')}
              className="block w-full text-left py-2 text-sm font-medium text-slate-800"
            >
              Platform Roles
            </button>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuth('login');
                }}
                className="w-full py-2.5 text-center text-sm font-semibold text-slate-800 border border-slate-300 rounded-lg"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuth('signup');
                }}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-slate-900 rounded-lg shadow-sm"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          SECTION B: HERO SECTION
         ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-16 lg:py-24">
        {/* Subtle scientific grid background overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading, Tagline, Verbatim Description, Auth CTAs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Trust Kicker */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Inter-Institutional Scientific Sharing Ecosystem</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Resource DNA
              </h1>

              {/* Tagline */}
              <p className="text-xl sm:text-2xl font-medium text-cyan-300 leading-snug">
                “The Building Blocks of Every Breakthrough.”
              </p>

              {/* Exact Homepage Description (Verbatim as required) */}
              <div className="space-y-4 text-slate-300 text-base sm:text-lg leading-relaxed pt-2">
                <p className="font-semibold text-white text-lg">
                  Every great discovery begins with the right resources. 🧬
                </p>
                <p>
                  Meet Resource DNA—a platform designed to bring researchers, students, laboratories, and equipment providers together.
                </p>
                <p>
                  From a single scientific instrument to a fully equipped research laboratory, discover the resources you need to experiment, explore, and innovate. Connect with providers, request bookings, and make laboratory resources more accessible—all in one place.
                </p>
                <p>
                  We believe that great ideas shouldn't be held back by limited access to equipment or research facilities. By connecting the people who have resources with those who need them, we're helping build a more collaborative world of science and innovation.
                </p>
                <p className="font-medium text-cyan-200">
                  Find your resources. Fuel your curiosity. Create what's next.
                </p>
              </div>

              {/* Primary Sign Up & Secondary Login Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => openAuth('signup')}
                  className="px-7 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-base rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Sign Up Now</span>
                  <ArrowRight className="w-5 h-5 text-slate-950" />
                </button>
                <button
                  onClick={() => openAuth('login')}
                  className="px-7 py-3.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-white font-semibold text-base rounded-xl transition-all cursor-pointer"
                >
                  Login to Account
                </button>
              </div>

              {/* Security reassurance */}
              <div className="flex items-center gap-6 pt-4 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Verified Research Credentials</span>
                </div>
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-cyan-400" />
                  <span>Chain-of-Custody QR Verification</span>
                </div>
              </div>
            </div>

            {/* Right Column: High Quality Scientific Imagery */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-800/50">
                <img
                  src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1000&q=80"
                  alt="High-resolution cryogenic electron microscopy instrument and research laboratory"
                  className="w-full h-[440px] object-cover object-center"
                  loading="eager"
                  onError={(e) => {
                    // Fallback to solid scientific backdrop if network is restricted
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
                    <Microscope className="w-4 h-4" />
                    <span>Cross-Facility Instrumentation Sharing</span>
                  </div>
                  <p className="text-xs text-slate-200">
                    Connecting advanced instrumentation suites, specialized microscopes, and high-containment laboratories across academic and private institutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION C: ABOUT RESOURCE DNA
         ========================================================================= */}
      <section id="about" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1000&q=80"
                  alt="Scientific research cleanroom laboratory suite"
                  className="w-full h-[400px] object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs p-3 rounded-lg bg-slate-900/80 backdrop-blur-xs">
                  <p className="font-semibold text-cyan-300">Democratizing Advanced Research</p>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    Bridging resource availability gaps to accelerate breakthrough discoveries.
                  </p>
                </div>
              </div>
            </div>

            {/* Narrative Column */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-5">
              <span className="text-xs font-bold tracking-wider uppercase text-cyan-700">
                About The Platform
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Empowering Scientific Discovery Through Shared Infrastructure
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Resource DNA was founded on a simple conviction: world-changing scientific breakthroughs should never be bottlenecked by institutional equipment shortages or capital barriers.
              </p>
              <p className="text-slate-600 text-base leading-relaxed">
                Across universities, research hospitals, and biotech incubators, million-dollar scientific instruments sit idle between projects, while neighboring researchers and graduate students wait months for access or stall promising hypotheses. Resource DNA unifies these fragmented assets into a secure, collaborative ecosystem.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Maximized Instrument Utilization</h3>
                  <p className="text-xs text-slate-600">
                    Host institutions monetize available capacity while funding facility upkeep and graduate research fellowships.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Accelerated Time-to-Data</h3>
                  <p className="text-xs text-slate-600">
                    Researchers book verified core facilities without multi-quarter capital procurement or lengthy grant approvals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION D: PLATFORM FEATURES (All 9 specified features without listings)
         ========================================================================= */}
      <section id="features" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold tracking-wider uppercase text-cyan-700">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Platform Features Built for Scientific Rigor
            </h2>
            <p className="text-slate-600 text-base">
              A purpose-built infrastructure facilitating trusted equipment reservations, certified chain of custody, and inter-institutional collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-cyan-500/50 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-700 flex items-center justify-center mb-4">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1. Resource Sharing</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect people and core facilities who own scientific resources with researchers and students who need access to them.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-cyan-500/50 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">2. Laboratory Access</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Help researchers discover suitable research facilities and certified cleanroom suites within the platform after logging in.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-cyan-500/50 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <Microscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">3. Equipment Access</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Support access to specialized scientific instruments and analytical systems through the authenticated user experience.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-cyan-500/50 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">4. Booking Management</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Submit, manage, approve, and track booking requests with date ranges, research purpose validation, and status updates.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-cyan-500/50 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Settings2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">5. Provider Management</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Allow providers to manage their scientific equipment, facility listings, day rates, safety guidelines, and incoming reservations.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-cyan-500/50 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">6. Delivery Coordination</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Support delivery assignments, pickup details, drop-off locations, delivery status, and tracking where delivery is selected.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-cyan-500/50 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 text-violet-700 flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">7. QR-Based Handover and Return</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Support authorized equipment exchange verification using unique digital tokens that prevent unauthorized or duplicate actions.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-cyan-500/50 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 text-sky-700 flex items-center justify-center mb-4">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">8. Notifications</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Keep relevant researchers, providers, and delivery partners informed about booking decisions and transit updates in real-time.
              </p>
            </div>

            {/* Feature 9 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-cyan-500/50 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">9. Secure Role-Based Access</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Provide separate, authenticated experiences tailored specifically for Researchers, Providers, and Delivery Partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION E: HOW IT WORKS (Simple process diagram without catalogue listings)
         ========================================================================= */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold tracking-wider uppercase text-cyan-700">
              The Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How Resource DNA Works
            </h2>
            <p className="text-slate-600 text-base">
              A transparent, verified 4-step workflow connecting scientific discovery with laboratory resources.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-extrabold text-lg flex items-center justify-center mb-4 ring-4 ring-cyan-100">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Create Account & Role</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Create an account and select the appropriate role (Researcher, Provider, or Delivery Partner) with institutional verification.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-extrabold text-lg flex items-center justify-center mb-4 ring-4 ring-cyan-100">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Submit Booking Request</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Researchers submit resource booking requests inside their dashboard, selecting dates, purpose, and delivery requirements.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-extrabold text-lg flex items-center justify-center mb-4 ring-4 ring-cyan-100">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Provider Review & Approval</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Providers review requests, inspect safety certifications, and coordinate approved bookings with automated verification tokens.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-extrabold text-lg flex items-center justify-center mb-4 ring-4 ring-cyan-100">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Delivery & QR Verification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Delivery partners handle assigned deliveries where delivery is selected, followed by authorized QR handover verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION F: USER ROLES (Explaining the 3 roles without exposing dashboards)
         ========================================================================= */}
      <section id="roles" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold tracking-wider uppercase text-cyan-700">
              Ecosystem Roles
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Tailored Experiences for Every Stakeholder
            </h2>
            <p className="text-slate-600 text-base">
              Each user role receives a dedicated, authenticated dashboard designed strictly for their workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Researcher Card */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center mb-5">
                <Microscope className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Researcher</h3>
              <p className="text-xs text-cyan-700 font-semibold mb-3">Academic, Clinical & Student Innovators</p>
              <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                Search, filter, and discover scientific equipment and laboratory spaces inside your authenticated dashboard. Submit booking reservations, track rental timelines, and scan handover QR codes.
              </p>
              <ul className="text-xs text-slate-600 space-y-2 mb-6 border-t border-slate-100 pt-4 mt-auto">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Authenticated resource & lab discovery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Direct reservation requests with delivery toggle</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Dedicated Scan Handover/Return QR capability</span>
                </li>
              </ul>
              <button
                onClick={() => openAuth('signup', 'researcher')}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Sign Up as Researcher
              </button>
            </div>

            {/* Provider Card */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center mb-5">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Provider</h3>
              <p className="text-xs text-indigo-700 font-semibold mb-3">Universities, Core Facilities & Lab Owners</p>
              <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                Manage scientific instruments and laboratory suites from one Provider dashboard. Review booking requests, approve researchers, and display booking-specific verification QR codes.
              </p>
              <ul className="text-xs text-slate-600 space-y-2 mb-6 border-t border-slate-100 pt-4 mt-auto">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Unified Equipment & Lab management</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Booking approval and availability controls</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Display handover and return QR codes</span>
                </li>
              </ul>
              <button
                onClick={() => openAuth('signup', 'provider')}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Sign Up as Provider
              </button>
            </div>

            {/* Delivery Partner Card */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-5">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delivery Partner</h3>
              <p className="text-xs text-emerald-700 font-semibold mb-3">Certified Scientific Transport & Logistics</p>
              <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                View assigned equipment transports, coordinate pickup from core facilities, handle sensitive instrumentation handling, and update transit statuses to ensure zero chain-of-custody gaps.
              </p>
              <ul className="text-xs text-slate-600 space-y-2 mb-6 border-t border-slate-100 pt-4 mt-auto">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Assigned transport manifest & instructions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Multi-stage status progression tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Specialized transport without QR distractions</span>
                </li>
              </ul>
              <button
                onClick={() => openAuth('signup', 'delivery')}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Sign Up as Delivery Partner
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION G: CALL TO ACTION (Create Account / Login)
         ========================================================================= */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 flex items-center justify-center mx-auto shadow-inner">
            <Dna className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Ready to Accelerate Your Next Discovery?
          </h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
            Join the inter-institutional network empowering laboratories and researchers to collaborate, share instrumentation, and build what’s next.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => openAuth('signup')}
              className="px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-base rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Create Your Account</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>
            <button
              onClick={() => openAuth('login')}
              className="px-8 py-3.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-base rounded-xl transition-all cursor-pointer"
            >
              Already Registered? Login
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION H: FOOTER
         ========================================================================= */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
            {/* Brand Column */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2.5 text-white">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                  <Dna className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold">Resource DNA</span>
              </div>
              <p className="text-xs font-medium text-cyan-400">
                “The Building Blocks of Every Breakthrough.”
              </p>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                A scientific resource-sharing platform connecting researchers, students, laboratory resource providers, and delivery partners.
              </p>
            </div>

            {/* Navigation Column */}
            <div className="md:col-span-3 space-y-2">
              <p className="text-xs font-bold text-white uppercase tracking-wider">Navigation</p>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="hover:text-cyan-300 transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('about')}
                    className="hover:text-cyan-300 transition-colors"
                  >
                    About Resource DNA
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="hover:text-cyan-300 transition-colors"
                  >
                    Platform Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('how-it-works')}
                    className="hover:text-cyan-300 transition-colors"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('roles')}
                    className="hover:text-cyan-300 transition-colors"
                  >
                    Platform Roles
                  </button>
                </li>
              </ul>
            </div>

            {/* Account & Support Column */}
            <div className="md:col-span-4 space-y-2">
              <p className="text-xs font-bold text-white uppercase tracking-wider">Access & Support</p>
              <div className="flex flex-col gap-2 text-xs">
                <button
                  onClick={() => openAuth('login')}
                  className="text-left text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Member Login
                </button>
                <button
                  onClick={() => openAuth('signup')}
                  className="text-left text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Create New Account / Sign Up
                </button>
                <div className="pt-2 text-[11px] text-slate-500">
                  <p>Core Facility Verification Desk: Mon–Fri 08:00–18:00 PST</p>
                  <p>Inquiries: Institutional Partner Support</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} Resource DNA. All rights reserved.</p>
            <p className="text-[11px]">The Building Blocks of Every Breakthrough.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
