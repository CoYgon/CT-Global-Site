// config.ts
// Sitedeki tüm "kendi bilgilerinle değiştir" sabitleri TEK bu dosyada.
// Başka hiçbir dosyada hardcoded link olmasın istedik — bir şeyi güncellemek
// için 5 dosyada arama yapmak elit bir mühendisin vaktine saygısızlıktır.
//
// GITHUB_USERNAME artık BURADA değil, repo kökündeki github.config.json'da —
// çünkü aynı değeri hem bu TS dosyası hem de scripts/fetch-github-stats.mjs
// (build zamanı çalışan düz Node script'i) okuyor. Tek kaynak, iki tüketici.
import githubConfig from "../github.config.json";

export const GITHUB_USERNAME = githubConfig.username;

export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

// TODO: Bu siteyi push'ladığın repo'nun gerçek adıyla değiştir.
export const SITE_REPO_URL = `${GITHUB_PROFILE_URL}/devlab-gatekeeper`;

// TODO: Kendi gerçek Discord davet linkinle değiştir.
export const DISCORD_INVITE = "discord.gg/devlab";
