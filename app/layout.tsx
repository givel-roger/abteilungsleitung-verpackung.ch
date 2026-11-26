import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stv. Abteilungsleitung Verpackung (100%) – Confiserie Bachmann, Luzern",
  description:
    "Bewirb dich jetzt als Stv. Abteilungsleitung Verpackung bei der Confiserie Bachmann in Luzern. In 60 Sekunden bewerben – kein Lebenslauf nötig.",
  keywords: [
    "stellvertretende abteilungsleitung verpackung",
    "confiserie bachmann",
    "job luzern",
    "verpackung lebensmittel",
    "führungsposition produktion",
    "bachmann karriere",
  ],
  metadataBase: new URL("https://www.abteilungsleitung-verpackung.ch"),
  openGraph: {
    type: "website",
    locale: "de_CH",
    url: "https://www.abteilungsleitung-verpackung.ch",
    siteName: "Confiserie Bachmann Karriere",
    title: "Stv. Abteilungsleitung Verpackung (100%) – Confiserie Bachmann",
    description:
      "Werde Teil der Confiserie Bachmann in Luzern. Bewirb dich jetzt als Stv. Abteilungsleitung Verpackung – in 60 Sekunden, ohne Lebenslauf.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JobPosting",
              title: "Stv. Abteilungsleitung Verpackung (100%)",
              description:
                "Stellvertretende Abteilungsleitung Verpackung bei der Confiserie Bachmann in Luzern. Führung, Organisation und Qualitätssicherung in der Verpackung von Confiserie- und Backwaren.",
              hiringOrganization: {
                "@type": "Organization",
                name: "Confiserie Bachmann",
                sameAs: "https://www.bachmann-karriere.ch",
                logo: "https://www.abteilungsleitung-verpackung.ch/images/logo-bachmann.png",
              },
              jobLocation: {
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Werkhofstrasse 20",
                  addressLocality: "Luzern",
                  postalCode: "6005",
                  addressCountry: "CH",
                },
              },
              employmentType: "FULL_TIME",
              workHours: "Mo–Fr, ab 06:30 Uhr",
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");fbq("init","947894408307993");fbq("track","PageView");`,
          }}
        />
        <noscript>
          <img height="1" width="1" style={{ display: "none" }} src="https://www.facebook.com/tr?id=947894408307993&ev=PageView&noscript=1" alt="" />
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
