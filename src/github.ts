// github.ts
// ESKİ HALİ: tarayıcıdan doğrudan api.github.com'a fetch atıyordu. Bu, IP
// başına paylaşımlı 60 istek/saat limitine takılınca sitedeki HERKESİ
// etkileyen bir 403'e yol açtı (bkz. scripts/fetch-github-stats.mjs'deki not).
//
// YENİ HALİ: hiçbir canlı network çağrısı yok. Veri build zamanında
// scripts/fetch-github-stats.mjs tarafından src/github-stats.json'a
// yazılıyor, biz burada sadece o statik JSON'u import edip render ediyoruz.
// Sonuç: sıfır rate-limit riski, sıfır "veri çekilemedi" ekranı (ta ki build
// zamanında script gerçekten başarısız olmadıkça — o durumda da zaten
// önceki başarılı önbellek korunuyor).

import { GITHUB_PROFILE_URL } from "./config";
import githubStats from "./github-stats.json";

interface GithubStatsUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

interface GithubStatsRepo {
  name: string;
  html_url: string;
  stargazers_count: number;
  language: string | null;
}

interface GithubStatsFile {
  ok: boolean;
  fetchedAt: string;
  username: string;
  user: GithubStatsUser | null;
  repos: GithubStatsRepo[];
}

const stats = githubStats as GithubStatsFile;

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatFetchedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function renderError(container: HTMLElement): void {
  // Build script'i başarısız olduysa VE hiç önbellek yoksa buraya düşer.
  // Site çökmesin diye zarif bir fallback gösteriyoruz.
  container.innerHTML = `
    <div class="text-sm text-ink-dim">
      <p class="text-signal-amber">// build zamanında veri çekilemedi (rate limit ya da GITHUB_USERNAME henüz ayarlanmadı olabilir).</p>
      <p class="mt-2">Profili yine de doğrudan ziyaret edebilirsin:</p>
      <a href="${GITHUB_PROFILE_URL}" target="_blank" rel="noopener noreferrer" class="mt-2 inline-flex items-center gap-1.5 text-signal-green hover:underline">
        ${GITHUB_PROFILE_URL} ↗
      </a>
    </div>
  `;
}

function renderProfile(container: HTMLElement, user: GithubStatsUser, topRepos: GithubStatsRepo[], fetchedAt: string): void {
  const repoItems = topRepos
    .map(
      (repo) => `
        <a
          href="${repo.html_url}"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center justify-between gap-3 rounded border border-void-border bg-void-700/40 px-3 py-2 text-xs transition hover:border-signal-green/40"
        >
          <span class="truncate text-ink">${escapeHtml(repo.name)}</span>
          <span class="flex shrink-0 items-center gap-3 text-ink-faint">
            ${repo.language ? `<span>${escapeHtml(repo.language)}</span>` : ""}
            <span class="text-signal-amber">★ ${repo.stargazers_count}</span>
          </span>
        </a>
      `
    )
    .join("");

  container.innerHTML = `
    <div class="grid gap-6 sm:grid-cols-[auto_1fr]">
      <img
        src="${user.avatar_url}"
        alt="${escapeHtml(user.login)} avatarı"
        width="72"
        height="72"
        class="h-[72px] w-[72px] rounded-md border border-void-border"
        loading="lazy"
      />
      <div class="min-w-0">
        <p class="text-lg font-semibold text-white">${escapeHtml(user.name ?? user.login)}</p>
        <p class="text-sm text-signal-blue/90">@${escapeHtml(user.login)}</p>
        ${user.bio ? `<p class="mt-2 text-sm text-ink-dim">${escapeHtml(user.bio)}</p>` : ""}
      </div>
    </div>

    <div class="mt-6 grid grid-cols-3 gap-2 text-center sm:gap-3">
      <div class="rounded border border-void-border bg-void-700/40 py-3">
        <p class="text-lg font-semibold text-signal-green sm:text-xl">${user.public_repos}</p>
        <p class="text-[10px] uppercase tracking-wide text-ink-faint sm:text-[11px]">repo</p>
      </div>
      <div class="rounded border border-void-border bg-void-700/40 py-3">
        <p class="text-lg font-semibold text-signal-green sm:text-xl">${user.followers}</p>
        <p class="text-[10px] uppercase tracking-wide text-ink-faint sm:text-[11px]">takipçi</p>
      </div>
      <div class="rounded border border-void-border bg-void-700/40 py-3">
        <p class="text-lg font-semibold text-signal-green sm:text-xl">${user.following}</p>
        <p class="text-[10px] uppercase tracking-wide text-ink-faint sm:text-[11px]">takip</p>
      </div>
    </div>

    ${
      repoItems
        ? `
      <div class="mt-6">
        <p class="mb-2 text-[11px] uppercase tracking-wide text-ink-faint">yıldızına göre en iyi repo'lar</p>
        <div class="flex flex-col gap-2">${repoItems}</div>
      </div>
    `
        : ""
    }

    <a
      href="${user.html_url}"
      target="_blank"
      rel="noopener noreferrer"
      class="mt-6 inline-flex items-center gap-2 rounded-md border border-signal-green/40 bg-signal-green/10 px-5 py-2.5 text-sm text-signal-green transition hover:bg-signal-green/20"
    >
      &gt; profili_takip_et
    </a>

    <p class="mt-4 text-[11px] text-ink-faint">
      // veri build zamanında çekildi · son güncelleme: ${formatFetchedAt(fetchedAt)}
    </p>
  `;
}

export function initGithubSection(containerId: string): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!stats.ok || !stats.user) {
    renderError(container);
    return;
  }

  renderProfile(container, stats.user, stats.repos, stats.fetchedAt);
}
