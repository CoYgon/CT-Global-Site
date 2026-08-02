// sandbox-runner.ts
// Gatekeeper sınavındaki kullanıcı kodunu artık ana sayfanın thread'inde
// `new Function()` ile ÇALIŞTIRMIYORUZ. Onun yerine `public/sandbox.html`
// adında, KENDİ CSP'sine sahip, `allow-same-origin` OLMAYAN sandboxed bir
// <iframe> içine gömüyoruz.
//
// Bunun somut anlamı: sandbox.html içindeki kod...
//   - opak (unique) bir origin'de çalışır — sitenin origin'iyle AYNI DEĞİLDİR.
//   - localStorage, sessionStorage, cookie'lere ERİŞEMEZ.
//   - parent penceredeki DOM'a, window nesnesine ERİŞEMEZ.
//   - `credentials: include` ile aynı-origin isteği ATAMAZ (opak origin'i var).
//   - top-level navigation / pop-up açamaz (sandbox bunu izin vermediği sürece).
//   - ana sayfanın (sıkı) CSP'sini MİRAS ALMAZ — çünkü srcdoc değil, gerçek
//     bir dosya URL'inden yükleniyor. Bkz. public/sandbox.html içindeki not.
// Kullanıcı sonsuz döngü yazarsa da bir timeout ile iframe'i yok ediyoruz,
// sekmeyi kilitlemesin diye.

const EXECUTION_TIMEOUT_MS = 3000;

export type SandboxResult = { ok: true; value: unknown } | { ok: false; error: string };

interface GatekeeperResultMessage {
  __gatekeeperResult?: boolean;
  ok?: boolean;
  value?: unknown;
  error?: string;
}

/**
 * Kullanıcının kodunu izole bir sandboxed iframe'de (public/sandbox.html)
 * çalıştırır ve sonucu postMessage üzerinden alır. `allow-scripts` VAR ama
 * `allow-same-origin` BİLEREK YOK — bu ikisinin birlikte verilmesi sandbox'ı
 * anlamsızlaştırır (iframe kendi origin'ine "same-origin" olur ve izolasyon
 * çöker).
 */
export function runInSandbox(userCode: string): Promise<SandboxResult> {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.style.display = "none";
    iframe.setAttribute("aria-hidden", "true");

    let settled = false;

    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(timeoutId);
      iframe.remove();
    };

    const settle = (result: SandboxResult) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(result);
    };

    function onMessage(event: MessageEvent) {
      // Mesajın gerçekten bizim oluşturduğumuz iframe'den geldiğini
      // doğruluyoruz — sayfadaki başka bir postMessage kaynağına güvenmiyoruz.
      if (event.source !== iframe.contentWindow) return;
      const data = event.data as GatekeeperResultMessage;
      if (!data || data.__gatekeeperResult !== true) return;

      if (data.ok) {
        settle({ ok: true, value: data.value });
      } else {
        settle({ ok: false, error: data.error ?? "Bilinmeyen hata" });
      }
    }

    const timeoutId = window.setTimeout(() => {
      settle({
        ok: false,
        error: `Zaman aşımı (${EXECUTION_TIMEOUT_MS}ms) — sonsuz döngün mü var acaba?`,
      });
    }, EXECUTION_TIMEOUT_MS);

    window.addEventListener("message", onMessage);

    iframe.addEventListener("load", () => {
      iframe.contentWindow?.postMessage({ __gatekeeperRun: true, code: userCode }, "*");
    });

    // BASE_URL, vite.config.ts'deki `base: "./"` ayarına göre Vite tarafından
    // enjekte ediliyor — GitHub Pages'in alt-path'inde de doğru çözülsün diye
    // sabit "/sandbox.html" yerine bunu kullanıyoruz.
    iframe.src = `${import.meta.env.BASE_URL}sandbox.html`;
    document.body.appendChild(iframe);
  });
}
