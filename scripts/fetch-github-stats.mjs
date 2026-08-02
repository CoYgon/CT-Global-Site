#!/usr/bin/env node
// fetch-github-stats.mjs
//
// Neden bu script var: tarayıcıdan doğrudan api.github.com'a çağrı atmak
// KÖTÜ bir fikirmiş — unauthenticated GitHub API limiti (60 istek/saat)
// bir IP'yi kullanan TÜM ziyaretçiler arasında paylaşılıyor. Ofis/VPN/CGNAT
// gibi paylaşımlı bir ağdan bir kişi limiti bitirdiğinde, o IP'den gelen
// HERKES 403 yiyor — tam olarak yaşadığımız sorun buydu.
//
// Çözüm: veriyi tarayıcıda değil, BUILD ZAMANINDA (bu script `npm run dev`
// ve `npm run build`'den önce otomatik çalışır — bkz. package.json'daki
// "predev"/"prebuild") tek seferlik çekip src/github-stats.json'a yazıyoruz.
// Tarayıcı artık GitHub'a hiç gitmiyor, sadece kendi statik JSON'umuzu
// okuyor. Bedeli: veri "canlı" değil, "son deploy zamanı" kadar güncel —
// bir portfolyo sitesi için fazlasıyla yeterli bir taviz.

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CONFIG_PATH = join(ROOT, "github.config.json");
const OUTPUT_PATH = join(ROOT, "src", "github-stats.json");

const { username } = JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));

function writeFallback() {
  writeFileSync(
    OUTPUT_PATH,
    JSON.stringify(
      { ok: false, fetchedAt: new Date().toISOString(), username, user: null, repos: [] },
      null,
      2
    )
  );
}

async function main() {
  try {
    const headers = { "User-Agent": "devlab-gatekeeper-build-script" };
    // CI ortamında GITHUB_TOKEN secret'ı varsa kullan — authenticated
    // istekler 60/saat yerine 5000/saat limitine sahip, bu script'in
    // kendi kendine rate-limit'e takılmasını da önler.
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(
        `https://api.github.com/users/${username}/repos?sort=stars&direction=desc&per_page=3`,
        { headers }
      ),
    ]);

    if (!userRes.ok) {
      throw new Error(`GitHub API ${userRes.status} (${await userRes.text()})`);
    }

    const user = await userRes.json();
    const repos = reposRes.ok ? await reposRes.json() : [];

    const output = {
      ok: true,
      fetchedAt: new Date().toISOString(),
      username,
      user: {
        login: user.login,
        name: user.name,
        bio: user.bio,
        avatar_url: user.avatar_url,
        public_repos: user.public_repos,
        followers: user.followers,
        following: user.following,
        html_url: user.html_url,
      },
      repos: (Array.isArray(repos) ? repos : []).map((r) => ({
        name: r.name,
        html_url: r.html_url,
        stargazers_count: r.stargazers_count,
        language: r.language,
      })),
    };

    writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
    console.log(`[github-stats] "${username}" için veri güncellendi (${output.fetchedAt}).`);
  } catch (err) {
    console.warn(`[github-stats] Çekilemedi: ${err instanceof Error ? err.message : String(err)}`);

    if (existsSync(OUTPUT_PATH)) {
      console.warn("[github-stats] Önceki başarılı önbellek korunuyor, build durdurulmuyor.");
      return;
    }

    console.warn("[github-stats] Önbellek de yok, zarif bir fallback yazılıyor.");
    writeFallback();
  }
}

main();
