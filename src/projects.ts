// projects.ts
// Not: Buradaki projeler placeholder değil — gerçek repo'lardan geliyor.
// Sahte "Lorem Ipsum Enterprise CRM" kartlarıyla elit bir kitleyi kandıramazsın,
// onlar README'yi okur.

import { GITHUB_PROFILE_URL } from "./config";

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  category: "systems" | "security" | "tooling";
  /** Repo slug'ı — GITHUB_PROFILE_URL ile birleşip tam URL'i oluşturur. */
  repoSlug: string;
}

export const PROJECTS: Project[] = [
  {
    id: "sentinelos",
    title: "SentinelOS",
    tagline: "Sıfırdan yazılmış x86_64 sunucu OS'u",
    description:
      "MBR bootloader'dan başlayıp protected/long mode geçişi, VGA/serial output, fiziksel bellek yönetimi, IDT/PIC/PIT ve round-robin scheduler'a kadar tamamı NASM ve C ile. MSR tabanlı syscall arayüzü ve kernel-space shell (mem, ps, reboot, halt) dahil.",
    stack: ["NASM", "C", "x86_64", "Bare Metal"],
    category: "systems",
    repoSlug: "sentinelos",
  },
  {
    id: "dpi-firewall",
    title: "Sentinel DPI Firewall",
    tagline: "Zero-dependency Linux güvenlik duvarı",
    description:
      "Raw socket'ler (AF_PACKET) üzerinden Ethernet/IP/TCP/UDP paketlerini elle parse eden, imza tabanlı derin paket incelemesi (DPI) yapan, port taramalarını yakalayıp fork/execvp ile iptables üzerinden otomatik banlayan sıfır bağımlılıklı bir C projesi.",
    stack: ["C", "Raw Sockets", "iptables", "Linux"],
    category: "security",
    repoSlug: "sentinel-dpi-firewall",
  },
  {
    id: "osint-platform",
    title: "Sentinel OSINT Platform",
    tagline: "nmap, sqlmap, dirsearch, sherlock — tek panelde",
    description:
      "nmap, sqlmap, dirsearch ve sherlock'u orkestrasyon eden bir Node.js/Express dashboard. Server-Sent Events ile canlı log akışı, severity bazlı renklendirilmiş sonuçlar ve koyu cyber-security estetiği.",
    stack: ["Node.js", "Express", "SSE", "TailwindCSS"],
    category: "security",
    repoSlug: "sentinel-osint-platform",
  },
  {
    id: "sentinel-core",
    title: "sentinel-core",
    tagline: "Zero-dependency Python ağ güvenliği kütüphanesi",
    description:
      "XOR şifreleme, async TCP networking ve yapılandırılmış loglama sağlayan bağımsız bir Python paketi. pytest test suite'i, GitHub Actions CI/CD ve PyPI dağıtımıyla üretime hazır.",
    stack: ["Python", "asyncio", "PyPI", "pytest"],
    category: "tooling",
    repoSlug: "sentinel-core",
  },
  {
    id: "self-healing",
    title: "Self-Healing System",
    tagline: "Windows için kendini onaran arka plan servisi",
    description:
      "C++20 ile yazılmış bir Win32 servisi: SMART disk sağlığı izleme, SQLCipher ile şifrelenmiş loglama, registry onarımı ve süreç optimizasyonu. Sistem kendi kendine bakıyor, sen kahveni içmeye devam ediyorsun.",
    stack: ["C++20", "Win32 API", "SQLCipher"],
    category: "systems",
    repoSlug: "self-healing-system",
  },
  {
    id: "code-studio",
    title: "Sentinel Code Studio",
    tagline: "Tarayıcı içi, tek dosyalık IDE",
    description:
      "Monaco Editor entegrasyonlu, yedi menü kategorili, Find/Replace ve Command Palette modalleriyle donatılmış, tamamen tek HTML dosyasında yaşayan tarayıcı tabanlı bir kod editörü. Bu sitenin Gatekeeper bölümünü inşa ederken kullandığımız araçla aynı aile.",
    stack: ["TypeScript", "Monaco Editor", "Vanilla JS"],
    category: "tooling",
    repoSlug: "sentinel-code-studio",
  },
];

const CATEGORY_LABEL: Record<Project["category"], string> = {
  systems: "sistem",
  security: "güvenlik",
  tooling: "araç",
};

const CATEGORY_COLOR: Record<Project["category"], string> = {
  systems: "text-signal-blue border-signal-blue/30 bg-signal-blue/10",
  security: "text-signal-red border-signal-red/30 bg-signal-red/10",
  tooling: "text-signal-green border-signal-green/30 bg-signal-green/10",
};

// Küçük GitHub octicon'u — kart footer'ındaki repo linkinde kullanılıyor.
const GITHUB_ICON_SVG = `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>`;

function renderCard(project: Project): string {
  const badgeClass = CATEGORY_COLOR[project.category];
  const stackList = project.stack
    .map(
      (tech) =>
        `<span class="rounded border border-void-border bg-void-700/60 px-2 py-0.5 text-[11px] text-ink-dim">${tech}</span>`
    )
    .join("");
  const repoUrl = `${GITHUB_PROFILE_URL}/${project.repoSlug}`;

  return `
    <article class="project-card rounded-lg border border-void-border bg-void-800/60 p-5 transition hover:border-signal-green/40">
      <div class="mb-3 flex items-start justify-between gap-3">
        <h3 class="text-lg font-semibold text-white">${project.title}</h3>
        <span class="shrink-0 rounded border px-2 py-0.5 text-[10px] uppercase tracking-wide ${badgeClass}">
          ${CATEGORY_LABEL[project.category]}
        </span>
      </div>
      <p class="mb-3 text-sm text-signal-blue/90">${project.tagline}</p>
      <p class="mb-4 text-sm leading-relaxed text-ink-dim">${project.description}</p>
      <div class="mb-4 flex flex-wrap gap-1.5">${stackList}</div>
      <a
        href="${repoUrl}"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 text-xs text-ink-dim transition hover:text-signal-green"
      >
        ${GITHUB_ICON_SVG}
        <span>repo/${project.repoSlug}</span>
        <span aria-hidden="true">↗</span>
      </a>
    </article>
  `;
}

export function renderProjectGrid(containerId: string): void {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = PROJECTS.map(renderCard).join("");
}
