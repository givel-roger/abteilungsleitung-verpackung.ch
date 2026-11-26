"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

type FormData = {
  erfahrung: string;
  ausbildung: string;
  fuehrung: string;
  sprachen: string[];
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
};

const INITIAL: FormData = {
  erfahrung: "",
  ausbildung: "",
  fuehrung: "",
  sprachen: [],
  vorname: "",
  nachname: "",
  email: "",
  telefon: "",
};

function scoreApplication(d: FormData): number {
  let s = 0;
  if (d.erfahrung === "produktion_lebensmittel") s += 30;
  else if (d.erfahrung === "produktion_andere") s += 20;
  else if (d.erfahrung === "logistik_lager") s += 15;
  else if (d.erfahrung === "quereinsteiger") s += 5;

  if (d.ausbildung === "lebensmittel_abgeschlossen") s += 25;
  else if (d.ausbildung === "andere_abgeschlossen") s += 15;
  else if (d.ausbildung === "in_ausbildung") s += 10;
  else if (d.ausbildung === "keine_praxis") s += 5;

  if (d.fuehrung === "ja_mehrjaehrig") s += 25;
  else if (d.fuehrung === "ja_erste") s += 18;
  else if (d.fuehrung === "nein_interesse") s += 8;
  else if (d.fuehrung === "nein") s += 2;

  if (d.sprachen.includes("deutsch")) s += 15;
  if (d.sprachen.includes("englisch")) s += 3;
  if (d.sprachen.includes("franzoesisch")) s += 2;
  if (d.sprachen.includes("weitere")) s += 2;
  return Math.min(s, 100);
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function nextStep() {
    if (step < 3) {
      setStep(step + 1);
      setTimeout(scrollToForm, 100);
    }
  }
  function prevStep() {
    if (step > 0) {
      setStep(step - 1);
      setTimeout(scrollToForm, 100);
    }
  }

  function toggleSprache(val: string) {
    setForm(prev => ({
      ...prev,
      sprachen: prev.sprachen.includes(val)
        ? prev.sprachen.filter(s => s !== val)
        : [...prev.sprachen, val],
    }));
  }

  async function handleSubmit() {
    setSending(true);
    setError("");
    try {
      const score = scoreApplication(form);
      const res = await fetch("/api/bewerbung", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, score }),
      });
      if (!res.ok) throw new Error("Fehler beim Senden");
      const j = await res.json().catch(() => ({}));
      const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
      if (fbq) fbq("track", "Lead", { content_name: "bewerbung" }, j.eventId ? { eventID: j.eventId } : undefined);
      setSent(true);
    } catch {
      setError("Etwas ist schiefgelaufen. Bitte versuche es erneut.");
    } finally {
      setSending(false);
    }
  }

  const canNext = [
    () => !!form.erfahrung,
    () => !!form.ausbildung,
    () => !!form.fuehrung,
    () => form.vorname.trim() !== "" && form.nachname.trim() !== "" && form.email.trim() !== "",
  ];

  const stepLabels = ["Erfahrung", "Ausbildung", "Führung", "Kontakt"];

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-4">
            <Image src="/logo-bachmann-pink-opt.png" alt="Confiserie Bachmann" width={280} height={158} className="h-14 w-auto" priority unoptimized />
          </a>
          <a href="#bewerbung" onClick={(e) => { e.preventDefault(); scrollToForm(); }} className="bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-2.5 text-sm rounded-full transition-colors">
            Jetzt bewerben
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-b from-primary to-primary-light pt-32 pb-16 sm:pt-36 sm:pb-20 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10">
          <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">
            <div>
              <p className="inline-flex items-center gap-2 text-accent text-sm font-medium tracking-wide mb-6">
                <span className="w-2 h-2 bg-accent rounded-full" />
                Wir stellen ein · Luzern
              </p>

              <h1 className="text-white text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.1] mb-6">
                Stv. Abteilungsleitung<br />
                Verpackung <span className="text-white/60">(100%)</span>
              </h1>

              <p className="text-white/75 text-lg leading-relaxed max-w-xl mb-8">
                Du organisierst gern, packst mit an und willst Verantwortung übernehmen?
                Werde Teil unseres Verpackungsteams und gestalte den Alltag in der
                Confiserie Bachmann in Luzern aktiv mit.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <button onClick={scrollToForm} className="bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-full text-base transition-colors cursor-pointer">
                  In 60 Sekunden bewerben →
                </button>
                <a href="#rolle" className="border border-white/30 hover:border-white/60 text-white px-6 py-4 rounded-full text-base transition-colors">
                  Aufgaben ansehen
                </a>
              </div>

              <p className="text-white/50 text-sm mb-8">
                Kein Lebenslauf nötig zum Start. Wir melden uns persönlich bei dir.
              </p>

              <div className="flex flex-wrap gap-3 text-sm text-white/70">
                <span className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  6005 Luzern
                </span>
                <span className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  100% · Festanstellung
                </span>
                <span className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Mo–Fr, ab 06:30 Uhr
                </span>
              </div>
            </div>

            {/* Stelle auf einen Blick */}
            <div className="bg-card rounded-2xl p-6 space-y-4 hidden lg:block">
              <h3 className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase mb-2">Die Stelle auf einen Blick</h3>
              {[
                { icon: "📦", title: "Verpackung Confiserie", desc: "Schokolade, Backwaren, Feingebäck" },
                { icon: "👥", title: "Stellvertretende Führung", desc: "Team leiten, wenn die Leitung fehlt" },
                { icon: "🎓", title: "Lebensmittel-Ausbildung ideal", desc: "Weiterbildung in Führung von Vorteil" },
                { icon: "🇩🇪", title: "Deutsch zwingend", desc: "Schriftlich und mündlich sehr gut" },
              ].map((c) => (
                <div key={c.title} className="flex items-start gap-3 bg-white/5 rounded-xl px-4 py-3">
                  <span className="text-xl mt-0.5">{c.icon}</span>
                  <div>
                    <p className="text-white font-medium text-sm">{c.title}</p>
                    <p className="text-white/50 text-xs">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="bg-primary-light border-t border-white/10 py-5">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10 flex flex-wrap justify-center gap-8 sm:gap-14 text-sm text-white/70">
          {[
            { icon: "⭐", text: "Seit 1897 in Luzern" },
            { icon: "🏪", text: "Über 30 Filialen" },
            { icon: "👨‍👩‍👧‍👦", text: "Familiär geführt" },
            { icon: "📍", text: "Luzern, Zentralschweiz" },
          ].map((b) => (
            <span key={b.text} className="flex items-center gap-2">
              <span>{b.icon}</span> {b.text}
            </span>
          ))}
        </div>
      </section>

      {/* ── DEINE ROLLE ── */}
      <section id="rolle" className="py-20 sm:py-28 bg-warm">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10">
          <FadeIn>
            <p className="inline-block bg-white border border-border text-foreground text-xs font-semibold tracking-[0.15em] uppercase px-4 py-2 rounded-full mb-6">Deine Rolle</p>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground mb-4 leading-tight">
              Vom Allrounder zur<br />stellvertretenden Führung.
            </h2>
            <p className="text-muted text-lg max-w-2xl mb-16 leading-relaxed">
              Du unterstützt die Abteilungsleitung Verpackung, übernimmst Verantwortung
              für das Team und die Prozesse — und packst selbst mit an, wenn es drauf ankommt.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-10">
            <FadeIn>
              <h3 className="font-semibold text-lg text-foreground mb-5 flex items-center gap-2">
                <span className="w-8 h-8 bg-accent/15 text-accent rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                Deine Aufgaben
              </h3>
              <ul className="space-y-4 text-muted text-[15px] leading-relaxed">
                <li className="flex gap-3"><span className="text-accent mt-1">●</span> Tägliche Organisation und Steuerung der Verpackung unterstützen</li>
                <li className="flex gap-3"><span className="text-accent mt-1">●</span> Personal- und fachliche Verantwortung bei Abwesenheit der Leitung</li>
                <li className="flex gap-3"><span className="text-accent mt-1">●</span> Termingerechte Auslieferung in der geforderten Qualität sicherstellen</li>
                <li className="flex gap-3"><span className="text-accent mt-1">●</span> Mengen, Qualität und Prozesse überwachen und eingreifen</li>
                <li className="flex gap-3"><span className="text-accent mt-1">●</span> Hygiene-, Qualitäts- und Arbeitssicherheitsvorschriften einhalten</li>
                <li className="flex gap-3"><span className="text-accent mt-1">●</span> Ideen einbringen und Prozesse laufend verbessern (KVP)</li>
              </ul>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h3 className="font-semibold text-lg text-foreground mb-5 flex items-center gap-2">
                <span className="w-8 h-8 bg-accent/15 text-accent rounded-full flex items-center justify-center text-sm font-bold">★</span>
                Das bringst du mit
              </h3>
              <ul className="space-y-4 text-muted text-[15px] leading-relaxed">
                <li className="flex gap-3"><span className="text-accent mt-1">●</span> Mehrjährige Erfahrung in Produktion oder vergleichbarem Umfeld</li>
                <li className="flex gap-3"><span className="text-accent mt-1">●</span> Idealerweise erste Führungserfahrung oder Stellvertretung</li>
                <li className="flex gap-3"><span className="text-accent mt-1">●</span> Abgeschlossene Ausbildung im Lebensmittelbereich oder vergleichbar</li>
                <li className="flex gap-3"><span className="text-accent mt-1">●</span> Eigenverantwortliche, lösungsorientierte Arbeitsweise</li>
                <li className="flex gap-3"><span className="text-accent mt-1">●</span> Sehr gutes Deutsch (mündlich und schriftlich)</li>
                <li className="flex gap-3"><span className="text-accent mt-1">●</span> Teamfähigkeit, Kommunikationsstärke und Belastbarkeit</li>
              </ul>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h3 className="font-semibold text-lg text-foreground mb-5 flex items-center gap-2">
                <span className="w-8 h-8 bg-accent/15 text-accent rounded-full flex items-center justify-center text-sm font-bold">♥</span>
                Das bieten wir
              </h3>
              <ul className="space-y-4 text-muted text-[15px] leading-relaxed">
                <li className="flex gap-3"><span className="text-accent mt-1">●</span> Anstellungsbedingungen gemäss GAV der Bäcker-Confiseure</li>
                <li className="flex gap-3"><span className="text-accent mt-1">●</span> Personalrabatte in Filialen und Cafés</li>
                <li className="flex gap-3"><span className="text-accent mt-1">●</span> Unterstützung bei Weiterbildung und Karriereentwicklung</li>
                <li className="flex gap-3"><span className="text-accent mt-1">●</span> Sichere Stelle in einem traditionsreichen Familienunternehmen</li>
                <li className="flex gap-3"><span className="text-accent mt-1">●</span> Abwechslungsreiche Aufgabe mit viel Eigenverantwortung</li>
                <li className="flex gap-3"><span className="text-accent mt-1">●</span> Zentraler Arbeitsort in Luzern, gute ÖV-Anbindung</li>
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── BEWERBUNG FORM ── */}
      <section id="bewerbung" ref={formRef} className="bg-surface py-20 sm:py-28 scroll-mt-20">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10 text-center mb-12">
          <FadeIn>
            <p className="inline-block bg-white border border-border text-foreground text-xs font-semibold tracking-[0.15em] uppercase px-4 py-2 rounded-full mb-6">Bewerbung</p>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground mb-4 leading-tight">
              In 4 kurzen Schritten zu uns
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto">
              Keine langen Formulare. Beantworte ein paar Fragen und hinterlasse deine
              Kontaktdaten. Den Rest besprechen wir persönlich.
            </p>
          </FadeIn>
        </div>

        {sent ? (
          <FadeIn className="max-w-[600px] mx-auto px-5">
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="font-display text-3xl text-foreground mb-3">Merci für deine Bewerbung!</h3>
              <p className="text-muted text-lg">Wir melden uns persönlich bei dir. Bis bald bei der Confiserie Bachmann!</p>
            </div>
          </FadeIn>
        ) : (
          <div className="max-w-[600px] mx-auto px-5">
            {/* Progress */}
            <div className="flex items-center justify-between mb-2 text-sm text-muted">
              <span>Schritt {step + 1} von 4</span>
              <span>{stepLabels[step]}</span>
            </div>
            <div className="h-1.5 bg-border rounded-full mb-8 overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${((step + 1) / 4) * 100}%` }} />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10">
              {/* Step 1: Erfahrung */}
              {step === 0 && (
                <div>
                  <p className="inline-block bg-surface text-foreground text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full mb-4">Dein Hintergrund</p>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Woher bringst du deine Erfahrung mit?</h3>
                  <p className="text-muted text-sm mb-6">Am besten passt jemand mit Produktionserfahrung im Lebensmittelbereich. Wähle, was am ehesten zutrifft.</p>
                  <div className="space-y-3">
                    {[
                      { val: "produktion_lebensmittel", icon: "🍫", label: "Aus der Lebensmittelproduktion oder Verpackung" },
                      { val: "produktion_andere", icon: "🏭", label: "Aus einer anderen Produktion oder Fertigung" },
                      { val: "logistik_lager", icon: "📦", label: "Aus Logistik, Lager oder Kommissionierung" },
                      { val: "quereinsteiger", icon: "✨", label: "Quereinsteiger, motiviert einzusteigen" },
                    ].map((o) => (
                      <button
                        key={o.val}
                        onClick={() => setForm({ ...form, erfahrung: o.val })}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                          form.erfahrung === o.val
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-accent/40"
                        }`}
                      >
                        <span className="text-xl">{o.icon}</span>
                        <span className="text-[15px] text-foreground flex-1">{o.label}</span>
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          form.erfahrung === o.val ? "border-accent bg-accent" : "border-border"
                        }`}>
                          {form.erfahrung === o.val && <span className="w-2 h-2 bg-white rounded-full" />}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Ausbildung */}
              {step === 1 && (
                <div>
                  <p className="inline-block bg-surface text-foreground text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full mb-4">Ausbildung</p>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Hast du eine Ausbildung im Lebensmittelbereich?</h3>
                  <p className="text-muted text-sm mb-6">Eine Ausbildung im Food-Bereich ist ideal, aber kein Muss. Wir schauen aufs Gesamtbild.</p>
                  <div className="space-y-3">
                    {[
                      { val: "lebensmittel_abgeschlossen", icon: "🎓", label: "Ja, Lebensmittelbereich abgeschlossen" },
                      { val: "andere_abgeschlossen", icon: "📋", label: "Andere Ausbildung abgeschlossen" },
                      { val: "in_ausbildung", icon: "📚", label: "In Ausbildung oder konkret geplant" },
                      { val: "keine_praxis", icon: "💪", label: "Nein, dafür viel Praxiserfahrung" },
                    ].map((o) => (
                      <button
                        key={o.val}
                        onClick={() => setForm({ ...form, ausbildung: o.val })}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                          form.ausbildung === o.val
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-accent/40"
                        }`}
                      >
                        <span className="text-xl">{o.icon}</span>
                        <span className="text-[15px] text-foreground flex-1">{o.label}</span>
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          form.ausbildung === o.val ? "border-accent bg-accent" : "border-border"
                        }`}>
                          {form.ausbildung === o.val && <span className="w-2 h-2 bg-white rounded-full" />}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Führungserfahrung */}
              {step === 2 && (
                <div>
                  <p className="inline-block bg-surface text-foreground text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full mb-4">Führung</p>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Hast du bereits Führungserfahrung?</h3>
                  <p className="text-muted text-sm mb-6">Als Stellvertretung übernimmst du Verantwortung fürs Team. Erste Erfahrung ist ideal, aber nicht zwingend.</p>
                  <div className="space-y-3">
                    {[
                      { val: "ja_mehrjaehrig", icon: "👑", label: "Ja, mehrjährige Führungserfahrung" },
                      { val: "ja_erste", icon: "🌟", label: "Ja, erste Erfahrung oder Stellvertretung" },
                      { val: "nein_interesse", icon: "🚀", label: "Nein, aber grosses Interesse an Führung" },
                      { val: "nein", icon: "🤝", label: "Nein, ich arbeite lieber im Team mit" },
                    ].map((o) => (
                      <button
                        key={o.val}
                        onClick={() => setForm({ ...form, fuehrung: o.val })}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                          form.fuehrung === o.val
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-accent/40"
                        }`}
                      >
                        <span className="text-xl">{o.icon}</span>
                        <span className="text-[15px] text-foreground flex-1">{o.label}</span>
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          form.fuehrung === o.val ? "border-accent bg-accent" : "border-border"
                        }`}>
                          {form.fuehrung === o.val && <span className="w-2 h-2 bg-white rounded-full" />}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Kontaktdaten */}
              {step === 3 && (
                <div>
                  <p className="inline-block bg-surface text-foreground text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full mb-4">Kontaktdaten</p>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Wie können wir dich erreichen?</h3>
                  <p className="text-muted text-sm mb-6">Wir melden uns persönlich bei dir und besprechen alles Weitere. Deinen Lebenslauf kannst du später ganz entspannt nachreichen.</p>

                  <div className="space-y-4">
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Welche Sprachen sprichst du? <span className="text-muted/60 normal-case font-normal">(Mehrfachauswahl)</span></p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { val: "deutsch", label: "Deutsch", badge: "zwingend" },
                          { val: "franzoesisch", label: "Französisch", badge: "" },
                          { val: "englisch", label: "Englisch", badge: "" },
                          { val: "weitere", label: "Weitere", badge: "" },
                        ].map((s) => (
                          <button
                            key={s.val}
                            onClick={() => toggleSprache(s.val)}
                            className={`flex items-center justify-between gap-2 px-4 py-3 rounded-lg border-2 text-sm transition-all cursor-pointer text-left ${
                              form.sprachen.includes(s.val)
                                ? "border-accent bg-accent/5"
                                : "border-border hover:border-accent/40"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                form.sprachen.includes(s.val) ? "border-accent bg-accent" : "border-border"
                              }`}>
                                {form.sprachen.includes(s.val) && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                              </span>
                              {s.label}
                            </div>
                            {s.badge && <span className="text-[10px] text-accent font-medium bg-accent/10 px-2 py-0.5 rounded-full">{s.badge}</span>}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Vorname *</label>
                        <input
                          type="text"
                          value={form.vorname}
                          onChange={(e) => setForm({ ...form, vorname: e.target.value })}
                          placeholder="Max"
                          className="mt-1 w-full border-2 border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Nachname *</label>
                        <input
                          type="text"
                          value={form.nachname}
                          onChange={(e) => setForm({ ...form, nachname: e.target.value })}
                          placeholder="Muster"
                          className="mt-1 w-full border-2 border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted uppercase tracking-wider">E-Mail *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="max.muster@email.ch"
                        className="mt-1 w-full border-2 border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted uppercase tracking-wider">Telefon</label>
                      <input
                        type="tel"
                        value={form.telefon}
                        onChange={(e) => setForm({ ...form, telefon: e.target.value })}
                        placeholder="+41 79 123 45 67"
                        className="mt-1 w-full border-2 border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex gap-3 mt-8">
                {step > 0 && (
                  <button onClick={prevStep} className="border-2 border-border hover:border-foreground/30 text-muted px-6 py-3 rounded-full text-sm font-medium transition-colors cursor-pointer">
                    Zurück
                  </button>
                )}
                {step < 3 ? (
                  <button
                    onClick={nextStep}
                    disabled={!canNext[step]()}
                    className="flex-1 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-full text-sm transition-colors cursor-pointer"
                  >
                    Weiter
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canNext[3]() || sending}
                    className="flex-1 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-full text-sm transition-colors cursor-pointer"
                  >
                    {sending ? "Wird gesendet..." : "Bewerbung absenden"}
                  </button>
                )}
              </div>
              {error && <p className="text-red-600 text-sm mt-3 text-center">{error}</p>}
            </div>
          </div>
        )}
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 sm:py-28 bg-warm">
        <div className="max-w-[700px] mx-auto px-5 sm:px-10">
          <FadeIn className="text-center mb-12">
            <p className="inline-block bg-white border border-border text-foreground text-xs font-semibold tracking-[0.15em] uppercase px-4 py-2 rounded-full mb-6">Häufige Fragen</p>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground leading-tight">
              Gut zu wissen
            </h2>
          </FadeIn>

          <div className="space-y-3">
            {[
              {
                q: "Muss ich Erfahrung in der Lebensmittelbranche haben?",
                a: "Erfahrung in der Lebensmittelproduktion ist ideal, aber kein Muss. Wenn du Erfahrung in einer vergleichbaren Produktion oder im Lager mitbringst und motiviert bist, freuen wir uns auf deine Bewerbung."
              },
              {
                q: "Brauche ich schon Führungserfahrung?",
                a: "Erste Führungserfahrung oder Erfahrung als Stellvertretung ist von Vorteil, aber nicht zwingend. Wichtig ist, dass du Verantwortung übernehmen willst und das Team unterstützen kannst."
              },
              {
                q: "Wie sind die Arbeitszeiten?",
                a: "Die Stelle ist 100%, Montag bis Freitag. Arbeitsbeginn ab 06:30 Uhr. In saisonalen Spitzenzeiten kann gelegentlich Samstagsarbeit anfallen."
              },
              {
                q: "Wie geht es nach der Bewerbung weiter?",
                a: "Nach deiner Bewerbung melden wir uns persönlich bei dir — in der Regel innerhalb weniger Tage. Es folgt ein erstes Kennenlerngespräch, bei dem wir schauen, ob es von beiden Seiten passt."
              },
              {
                q: "Wo genau ist der Arbeitsort?",
                a: "Der Arbeitsort ist an der Werkhofstrasse 20, 6005 Luzern. Gut erreichbar mit dem ÖV und auch mit dem Auto."
              },
            ].map((faq, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left bg-white border border-border rounded-xl px-6 py-5 cursor-pointer transition-colors hover:border-accent/30"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-foreground">{faq.q}</span>
                    <span className={`text-muted transition-transform shrink-0 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                  </div>
                  {openFaq === i && (
                    <p className="text-muted text-sm leading-relaxed mt-3 pr-8">{faq.a}</p>
                  )}
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-primary text-white py-14">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10">
          <div className="grid sm:grid-cols-3 gap-10 mb-10">
            <div>
              <Image src="/logo-bachmann-pink-opt.png" alt="Confiserie Bachmann" width={280} height={158} className="h-14 w-auto mb-4" unoptimized />
              <p className="text-white/50 text-sm leading-relaxed">
                Seit 1897 in Luzern — Confiserie, Bäckerei und mehr.
                Mit über 30 Filialen und einem familiären Team.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-3">Kontakt</p>
              <div className="text-white/60 text-sm space-y-1">
                <p className="text-white/80 font-medium">Irma Eckermann</p>
                <p>Leadhunter</p>
                <p>info@leadhunter.ch</p>
                <p>+41 79 419 00 70</p>
                <p>Cheerstrasse 13b</p>
                <p>CH-6014 Luzern</p>
              </div>
            </div>
            <div>
              <p className="font-semibold mb-3">Stelle</p>
              <div className="text-sm space-y-2">
                <a href="#bewerbung" onClick={(e) => { e.preventDefault(); scrollToForm(); }} className="block text-white/60 hover:text-accent transition-colors">Jetzt bewerben</a>
                <a href="#rolle" className="block text-white/60 hover:text-accent transition-colors">Aufgaben</a>
                <a href="#faq" className="block text-white/60 hover:text-accent transition-colors">Häufige Fragen</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/30">
            <p>© {new Date().getFullYear()} Confiserie Bachmann · <span className="text-white/20">v1.3.1</span></p>
            <div className="flex gap-6">
              <a href="/impressum" className="hover:text-white/60 transition-colors">Impressum</a>
              <a href="/datenschutz" className="hover:text-white/60 transition-colors">Datenschutz</a>
            </div>
            <p className="text-white/20">Stv. Abteilungsleitung Verpackung (100%)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
