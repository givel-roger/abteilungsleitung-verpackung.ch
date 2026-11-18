import Link from "next/link";
import Image from "next/image";

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-warm text-foreground">
      <nav className="border-b border-border bg-white">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo-bachmann-pink.png" alt="Confiserie Bachmann" width={280} height={158} className="h-12 w-auto" />
          </Link>
          <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
            Zurück zur Stelle
          </Link>
        </div>
      </nav>

      <main className="max-w-[700px] mx-auto px-5 sm:px-10 py-20">
        <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-12">Datenschutzerklärung</h1>

        <div className="space-y-8 text-base text-muted leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Verantwortliche Stelle</h2>
            <p>
              Confiserie Bachmann AG<br />
              Werkhofstrasse 20<br />
              6005 Luzern<br />
              Kontakt: Irma Eckermann, Leadhunter<br />
              E-Mail: <a href="mailto:info@leadhunter.ch" className="text-foreground underline">info@leadhunter.ch</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Erhebung und Verwendung von Daten</h2>
            <p>
              Wenn du das Bewerbungsformular auf dieser Website nutzt, erheben wir die von dir
              angegebenen Daten (Vorname, Nachname, E-Mail-Adresse, Telefonnummer sowie deine Angaben
              zu Erfahrung, Ausbildung, Führungskompetenz und Sprachkenntnissen). Diese Daten
              verwenden wir ausschliesslich zur Bearbeitung deiner Bewerbung.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Rechtsgrundlage</h2>
            <p>
              Die Verarbeitung deiner Daten erfolgt auf Grundlage deiner Einwilligung
              (Art. 6 Abs. 1 lit. a DSGVO) sowie zur Durchführung vorvertraglicher Massnahmen
              (Art. 6 Abs. 1 lit. b DSGVO). In der Schweiz gilt zusätzlich das
              Bundesgesetz über den Datenschutz (DSG).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Speicherdauer</h2>
            <p>
              Deine Bewerbungsdaten werden nur so lange gespeichert, wie es für die Bearbeitung
              deiner Bewerbung erforderlich ist. In der Regel werden Daten abgelehnter
              Bewerbungen nach 6 Monaten gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Weitergabe an Dritte</h2>
            <p>
              Deine Daten werden nicht an Dritte weitergegeben, es sei denn, dies ist zur
              Durchführung des Bewerbungsprozesses erforderlich.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Deine Rechte</h2>
            <p>
              Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung und
              Einschränkung der Verarbeitung deiner personenbezogenen Daten. Kontaktiere
              uns dazu unter{" "}
              <a href="mailto:info@leadhunter.ch" className="text-foreground underline">info@leadhunter.ch</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Cookies</h2>
            <p>
              Diese Website verwendet keine Tracking-Cookies und keine Analyse-Tools.
              Es werden nur technisch notwendige Cookies verwendet.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">SSL-Verschlüsselung</h2>
            <p>
              Diese Website nutzt aus Sicherheitsgründen eine SSL-Verschlüsselung.
              Eine verschlüsselte Verbindung erkennst du daran, dass die Adresszeile
              des Browsers von «http://» auf «https://» wechselt.
            </p>
          </section>
        </div>
      </main>

      <footer className="bg-primary text-white py-10">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Confiserie Bachmann AG</p>
          <div className="flex gap-6">
            <Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="text-white">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
