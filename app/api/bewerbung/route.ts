import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "bewerbungen.json");

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

async function readAll(): Promise<Bewerbung[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeAll(data: Bewerbung[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}


// Meta Conversions API
async function capiLeadSenden(req: Request, eventId: string) {
  const pixelId = "947894408307993";
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
  const ua = req.headers.get("user-agent") || "";
  const cookies = req.headers.get("cookie") || "";
  const fbp = (cookies.match(/(?:^|;\s*)_fbp=([^;]+)/) || [])[1] || "";
  const fbc = (cookies.match(/(?:^|;\s*)_fbc=([^;]+)/) || [])[1] || "";
  try {
    await fetch(`https://graph.facebook.com/v23.0/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [{
          event_name: "Lead",
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          action_source: "website",
          event_source_url: "https://www.abteilungsleitung-verpackung.ch/",
          user_data: {
            ...(ip ? { client_ip_address: ip } : {}),
            ...(ua ? { client_user_agent: ua } : {}),
            ...(fbp ? { fbp } : {}),
            ...(fbc ? { fbc } : {}),
          },
        }],
      }),
      signal: AbortSignal.timeout(10000),
    });
  } catch { /* best-effort */ }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { erfahrung, ausbildung, fuehrung, sprachen, vorname, nachname, email, telefon, score } = body;

    if (!vorname || !nachname || !email) {
      return NextResponse.json({ error: "Pflichtfelder fehlen." }, { status: 400 });
    }

    const bewerbung: Bewerbung = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      erfahrung: erfahrung || "",
      ausbildung: ausbildung || "",
      fuehrung: fuehrung || "",
      sprachen: sprachen || [],
      vorname,
      nachname,
      email,
      telefon: telefon || "",
      score: typeof score === "number" ? score : 0,
      status: "neu",
    };

    const all = await readAll();
    all.push(bewerbung);
    await writeAll(all);

    const eventId = crypto.randomUUID();
    capiLeadSenden(req, eventId).catch(() => {});

    return NextResponse.json({ success: true, id: bewerbung.id, eventId });
  } catch {
    return NextResponse.json({ error: "Server-Fehler" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("key");

  if (secret !== "bachmann2024") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const all = await readAll();
  return NextResponse.json(all);
}

export async function PATCH(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("key");

  if (secret !== "bachmann2024") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const { id, status } = await req.json();
  if (!id || !status) {
    return NextResponse.json({ error: "id und status sind Pflichtfelder" }, { status: 400 });
  }

  const all = await readAll();
  const idx = all.findIndex(b => b.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Bewerbung nicht gefunden" }, { status: 404 });
  }

  all[idx].status = status;
  await writeAll(all);
  return NextResponse.json({ success: true });
}
