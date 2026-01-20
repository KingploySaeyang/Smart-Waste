import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const INPUT_FILE = "scripts/translations.th.json";
const OUTPUT_DIR = "public/i18n";
const TARGET_LANGS = ["en", "ms"];

// 🔁 เปลี่ยน endpoint ให้เสถียรกว่า libretranslate.com
const TRANSLATE_API = "https://libretranslate.com/translate";

// ⏱ หน่วงเวลา (ms) กัน rate limit
const DELAY_MS = 800;

// ❌ คำที่ห้ามแปล
const PROTECTED_TERMS = [
  "BIN",
  "RFID",
  "MAC",
  "GPS",
  "Smart Waste",
  "Admin",
  "Driver",
  "User"
];

// ================= utils =================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function protectTerms(text) {
  let t = text;
  PROTECTED_TERMS.forEach((term, i) => {
    t = t.replaceAll(term, `__TERM_${i}__`);
  });
  return t;
}

function restoreTerms(text) {
  let t = text;
  PROTECTED_TERMS.forEach((term, i) => {
    t = t.replaceAll(`__TERM_${i}__`, term);
  });
  return t;
}

// ============== translate =================

async function translateValue(value, targetLang) {
  // ไม่ใช่ string → ไม่ต้องแปล
  if (typeof value !== "string") {
    return value;
  }

  try {
    const res = await fetch(TRANSLATE_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: protectTerms(value),
        source: "th",
        target: targetLang,
        format: "text"
      })
    });

    // ❗ server ปฏิเสธ
    if (!res.ok) {
      console.warn(`⚠️ Translate failed (${res.status}) → use original`);
      return value;
    }

    const data = await res.json();

    // ❗ response ไม่สมบูรณ์
    if (!data || typeof data.translatedText !== "string") {
      console.warn("⚠️ No translatedText → use original");
      return value;
    }

    return restoreTerms(data.translatedText);

  } catch (err) {
    console.warn("⚠️ Translate error → use original", err.message);
    return value;
  }
}

// ================= build ==================

async function build() {
  const source = JSON.parse(fs.readFileSync(INPUT_FILE, "utf8"));
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // 🇹🇭 ภาษาไทย (ต้นฉบับ)
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "th.js"),
    `window.SW_LANG = ${JSON.stringify(source, null, 2)};`,
    "utf8"
  );

  for (const lang of TARGET_LANGS) {
    console.log(`🌐 Translating to ${lang}...`);
    const out = {};

    for (const key of Object.keys(source)) {
      out[key] = await translateValue(source[key], lang);
      await sleep(DELAY_MS); // ⏱ กัน rate limit
    }

    fs.writeFileSync(
      path.join(OUTPUT_DIR, `${lang}.js`),
      `window.SW_LANG = ${JSON.stringify(out, null, 2)};`,
      "utf8"
    );
  }

  console.log("✅ i18n build complete");
}

build().catch(err => {
  console.error("❌ Build failed:", err);
});
