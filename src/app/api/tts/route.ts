import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const ELEVEN_API_URL = "https://api.elevenlabs.io/v1/text-to-speech";

async function parseEnvFile(filename: ".env.local" | ".env"): Promise<Record<string, string>> {
  try {
    const path = join(process.cwd(), filename);
    let raw = await readFile(path, "utf8");
    if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
    const out: Record<string, string> = {};
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim().replace(/^\uFEFF/, "");
      let value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      value = value.replace(/\s+#.*$/, "").trim();
      if (key) out[key] = value;
    }
    return out;
  } catch {
    return {};
  }
}

function getEnv(name: string): string {
  const direct = process.env[name];
  if (direct && direct.trim()) return direct.trim();

  // Fallback for edge cases (e.g. UTF-8 BOM in .env key)
  const match = Object.keys(process.env).find((k) => k.replace(/^\uFEFF/, "") === name);
  if (!match) return "";
  const value = process.env[match];
  return value ? value.trim() : "";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    // Read env files fresh every request so voice/key changes apply immediately.
    const envLocal = await parseEnvFile(".env.local");
    const envBase = await parseEnvFile(".env");
    const apiKey = (
      envLocal.ELEVENLABS_API_KEY ||
      envBase.ELEVENLABS_API_KEY ||
      getEnv("ELEVENLABS_API_KEY") ||
      ""
    ).trim();
    const voiceId = (
      envLocal.ELEVENLABS_VOICE_ID ||
      envBase.ELEVENLABS_VOICE_ID ||
      getEnv("ELEVENLABS_VOICE_ID") ||
      ""
    ).trim();
    const modelId = (
      envLocal.ELEVENLABS_MODEL_ID ||
      envBase.ELEVENLABS_MODEL_ID ||
      getEnv("ELEVENLABS_MODEL_ID") ||
      "eleven_multilingual_v2"
    ).trim();

    if (!apiKey) {
      return NextResponse.json(
        { error: "ELEVENLABS_API_KEY not configured", cwd: process.cwd() },
        { status: 503 }
      );
    }
    if (!voiceId) {
      return NextResponse.json(
        { error: "ELEVENLABS_VOICE_ID not configured in .env" },
        { status: 503 }
      );
    }

    const elevenRes = await fetch(`${ELEVEN_API_URL}/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        // Use the voice's own configured defaults from ElevenLabs.
        // Hardcoded settings can make a custom voice sound off/robotic.
      }),
      cache: "no-store",
    });

    if (!elevenRes.ok) {
      const details = await elevenRes.text();
      return NextResponse.json(
        {
          error: "ElevenLabs request failed",
          status: elevenRes.status,
          voiceId,
          modelId,
          details,
        },
        { status: 502 }
      );
    }

    const audioBuffer = await elevenRes.arrayBuffer();
    const bytes = new Uint8Array(audioBuffer);
    // Some error paths still return 200 with a JSON body; never forward that as "mp3".
    if (bytes.length > 0 && bytes[0] === 0x7b) {
      return NextResponse.json(
        {
          error: "ElevenLabs returned JSON instead of audio",
          details: new TextDecoder().decode(audioBuffer.slice(0, 500)),
        },
        { status: 502 }
      );
    }
    if (audioBuffer.byteLength < 64) {
      return NextResponse.json({ error: "ElevenLabs audio response too small" }, { status: 502 });
    }

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
        "X-TTS-Provider": "elevenlabs",
        "X-TTS-Voice-Id": voiceId,
        "X-TTS-Model-Id": modelId,
        "X-TTS-Env-Source": envLocal.ELEVENLABS_VOICE_ID
          ? ".env.local"
          : envBase.ELEVENLABS_VOICE_ID
            ? ".env"
            : "process.env",
        "X-TTS-Cwd": process.cwd(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "TTS proxy failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
