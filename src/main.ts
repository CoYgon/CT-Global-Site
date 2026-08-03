// main.ts
// Tek giriş noktası. Her modül tek bir işten sorumlu (single responsibility,
// evet bu bir kişilik proje ama disiplin disiplindir).

import "./style.css";
import { runBootSequence } from "./terminal";
import { renderProjectGrid } from "./projects";
import { initEasterEgg } from "./easter-egg";
import { initGithubSection } from "./github";
import { initFeedbackForm } from "./feedback";
import { GITHUB_PROFILE_URL, GITHUB_USERNAME } from "./config";
initFeedbackForm();
// index.html'deki küçük GitHub linklerinin (header ikonu, footer satırı)
// href'lerini TEK bir yerden (config.ts) besliyoruz. Asıl GitHub bölümü
// (canlı istatistikler) github.ts'e ait — initGithubSection() onu yönetiyor.
function initGithubLinks(): void {
  const headerLink = document.getElementById("github-header-link") as HTMLAnchorElement | null;
  if (headerLink) headerLink.href = GITHUB_PROFILE_URL;

  const footerLink = document.getElementById("github-footer-link") as HTMLAnchorElement | null;
  if (footerLink) {
    footerLink.href = GITHUB_PROFILE_URL;
    footerLink.textContent = `github.com/${GITHUB_USERNAME}`;
  }
}

// NOT: gatekeeper.ts'i BİLEREK burada static import etmiyoruz. Monaco Editor
// tek başına ~2MB'lık bir chunk — statik import edersen o chunk hero bölümü
// boyanmadan ÖNCE indirilmeye başlar ve ilk açılış hissini yavaşlatır.
// Bunun yerine tarayıcı boşta kalır kalmaz (requestIdleCallback) dinamik
// olarak yüklüyoruz: kullanıcı boot sequence'ı okurken Monaco arka planda
// sessizce hazırlanıyor. Elit kullanıcı fark etmez bile, sadece hisseder.
function loadGatekeeperModule(): void {
  const start = () => {
    void import("./gatekeeper").then(({ mountGatekeeperEditor, evaluateGatekeeper }) => {
      mountGatekeeperEditor("monaco-editor");

      const runBtn = document.getElementById("run-btn");
      runBtn?.addEventListener("click", () => void evaluateGatekeeper("gatekeeper-output"));
    });
  };

  const ric = (window as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void })
    .requestIdleCallback;

  if (typeof ric === "function") {
    ric(start, { timeout: 1500 });
  } else {
    window.setTimeout(start, 300);
  }
}

function initClock(): void {
  const clockEl = document.getElementById("clock");
  if (!clockEl) return;

  const tick = () => {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString("tr-TR", { hour12: false });
  };

  tick();
  window.setInterval(tick, 1000);
}

function initFooterYear(): void {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

function bootstrap(): void {
  initClock();
  initFooterYear();
  initGithubLinks();
  initEasterEgg();
  renderProjectGrid("project-grid");
  loadGatekeeperModule();

  // Artık canlı bir fetch değil, build-time'da hazırlanmış statik JSON'u
  // okuyup render ediyor — senkron, network gecikmesi yok.
  initGithubSection("github-panel");

  // Boot sequence'ı sayfa çizildikten hemen sonra, hafif bir gecikmeyle başlatıyoruz
  // — kullanıcı sayfanın "canlanışını" görsün, anında dolu bir ekranla karşılaşmasın.
  window.setTimeout(() => {
    void runBootSequence("boot-terminal");
  }, 200);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
