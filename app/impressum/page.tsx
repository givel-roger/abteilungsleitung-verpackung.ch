import Link from "next/link";

export default function Impressum() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg">Confiserie Bachmann</Link>
          <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
            Zurück zur Stelle
          </Link>
        </div>
      </nav>

      <main className="max-w-[700px] mx-auto px-5 sm:px-10 py-20">
        <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-12">Impressum</h1>

        <div className="space-y-8 text-base text-muted leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Verantwortlich für diese Stellenanzeige</h2>
            <p>
              Confiserie Bachmann AG<br />
              Werkhofstrasse 20<br />
              6005 Luzern
            </p>
            <p className="mt-3">
              Web: <a href="https://www.bachmann-karriere.ch" target="_blank" rel="noopener noreferrer" className="text-foreground underline">www.bachmann-karriere.ch</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Kontakt HR</h2>
            <p>
              Suzi Marques, HR-Generalistin<br />
              E-Mail: <a href="mailto:suzi.marques@confiserie.ch" className="text-foreground underline">suzi.marques@confiserie.ch</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Haftungsausschluss</h2>
            <p>
              Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit,
              Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen.
            </p>
            <p className="mt-3">
              Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art,
              welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten
              Informationen entstanden sind, werden ausgeschlossen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Urheberrechte</h2>
            <p>
              Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen
              Dateien auf dieser Website gehören ausschliesslich der Confiserie Bachmann AG oder den
              speziell genannten Rechteinhabern.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-border py-10">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted/50">
          <p>© {new Date().getFullYear()} Confiserie Bachmann AG</p>
          <div className="flex gap-6">
            <Link href="/impressum" className="text-foreground">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
