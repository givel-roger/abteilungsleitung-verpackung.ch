import Link from "next/link";
import Image from "next/image";

export default function Impressum() {
  return (
    <div className="min-h-screen bg-warm text-foreground">
      <nav className="border-b border-border bg-white">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo-bachmann-pink-opt.png" alt="Confiserie Bachmann" width={280} height={158} className="h-12 w-auto" unoptimized />
          </Link>
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
            <h2 className="text-lg font-semibold text-foreground mb-3">Kontakt</h2>
            <p>
              Irma Eckermann, Leadhunter<br />
              E-Mail: <a href="mailto:info@leadhunter.ch" className="text-foreground underline">info@leadhunter.ch</a><br />
              Tel: <a href="tel:+41794190070" className="text-foreground underline">+41 79 419 00 70</a>
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

      <footer className="bg-primary text-white py-10">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Confiserie Bachmann AG</p>
          <div className="flex gap-6">
            <Link href="/impressum" className="text-white">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
