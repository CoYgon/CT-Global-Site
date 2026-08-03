// gatekeeper.ts
// Sitenin kalbi burası. Monaco'yu mount ediyoruz, bilerek bozuk bir Caesar-cipher
// çözücü koyuyoruz, kullanıcı düzeltip RUN'a basınca kodu çalıştırıp beklenen
// çıktıyla karşılaştırıyoruz.
//
// Güvenlik notu: kod çalıştırma kısmı artık ana sayfa thread'inde DEĞİL,
// `sandbox-runner.ts` üzerinden `allow-same-origin` OLMAYAN izole bir iframe
// içinde gerçekleşiyor. Bu dosya sadece sonucu bekliyor ve gösteriyor —
// detaylar için sandbox-runner.ts'e bak.

// DİKKAT: Bilerek `import * as monaco from "monaco-editor"` KULLANMIYORUZ.
// O import tüm dilleri (Python, Rust, SQL, Solidity, dahi COBOL bile) ve
// TypeScript dil sunucusunu bundle'a gömer — çıktı ~3.2MB'a fırlıyor.
// Biz sadece "editor.api" çekirdeğini + JavaScript syntax highlighting'i
// alıyoruz. Sonuç: aynı deneyim, çok daha küçük bundle. "Ultra hızlı" sözü
// boşuna verilmedi.
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import { DISCORD_INVITE } from "./config";
import { runInSandbox } from "./sandbox-runner";

// Monaco'nun worker'larını Vite'a tanıtıyoruz. Bunu atlarsan editör "yüklendi
// ama hiçbir şey çalışmıyor" diye küsüp sessiz kalır — en can sıkıcı bug türü.
self.MonacoEnvironment = {
  getWorker() {
    // Bu proje sadece JS syntax highlighting kullandığı için tüm dilleri
    // (json/css/html/ts) worker'a boğmuyoruz — tek worker yeterli, bundle'ı şişirmiyoruz.
    return new editorWorker();
  },
};

// ─────────────────────────────────────────────────────────────
// Sınav verisi
// ─────────────────────────────────────────────────────────────

const SHIFT_KEY = 5;
const CIPHER_TEXT = "BJQHTRJ_YT_YMJ_QFG"; // "WELCOME_TO_THE_LAB" mesajının shift=5 ile şifreli hali
const EXPECTED_PLAINTEXT = "WELCOME_TO_THE_LAB";

const STARTER_CODE = `// ══════════════════════════════════════════
// GATEKEEPER PROTOCOL v1.2.0
// ══════════════════════════════════════════
// Bu fonksiyon Caesar-cipher ile şifrelenmiş bir mesajı çözmesi
// gerekiyor ama... bir yerlerde bug var. (Kahve molasında yazılmış,
// klasik.) Tek satırlık bir hata. Bulabilecek misin?

function decodeMessage(cipherText, shift) {
  let result = "";

  for (let i = 0; i < cipherText.length; i++) {
    if (cipherText[i] === "_") {
      result += "_";
      continue;
    }

    const code = cipherText.charCodeAt(i) - 65; // 'A' = 0, 'B' = 1, ....
    const decoded = (code + shift + 26) % 26;

    result += String.fromCharCode(decoded + 65);
  }

  return result;
}

// Bu kısma dokunma — sadece decodeMessage() içindeki mantığı düzelt.
const CIPHER = "${CIPHER_TEXT}";
const SHIFT = ${SHIFT_KEY};

function run() {
  return decodeMessage(CIPHER, SHIFT);
}
`;

// ─────────────────────────────────────────────────────────────
// Monaco kurulumu
// ─────────────────────────────────────────────────────────────

let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null;

function defineGatekeeperTheme() {
  monaco.editor.defineTheme("gatekeeper-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "4b535d", fontStyle: "italic" },
      { token: "keyword", foreground: "58a6ff" },
      { token: "string", foreground: "39ff14" },
      { token: "number", foreground: "f0b429" },
    ],
    colors: {
      "editor.background": "#0d1117",
      "editor.foreground": "#c9d1d9",
      "editorCursor.foreground": "#39ff14",
      "editorLineNumber.foreground": "#4b535d",
      "editorLineNumber.activeForeground": "#58a6ff",
      "editor.selectionBackground": "#1c2129",
      "editor.lineHighlightBackground": "#13181f",
    },
  });
}

export function mountGatekeeperEditor(containerId: string): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  defineGatekeeperTheme();

  editorInstance = monaco.editor.create(container, {
    value: STARTER_CODE,
    language: "javascript",
    theme: "gatekeeper-dark",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: 13.5,
    lineHeight: 22,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true, // container resize olduğunda editör de resize olsun
    padding: { top: 16 },
    renderLineHighlight: "all",
    smoothScrolling: true,
    cursorBlinking: "smooth",
    tabSize: 2,
  });
}

// ─────────────────────────────────────────────────────────────
// Yargılama mantığı
// ─────────────────────────────────────────────────────────────

function writeOutput(el: HTMLElement, lines: string[]): void {
  el.innerHTML = lines.join("\n");
  el.scrollTop = el.scrollHeight;
}

/**
 * RUN butonuna art arda basılmasını engelliyoruz. Bu bir "büyük DoS savunması"
 * değil ama hem gereksiz iframe oluşturmayı/yok etmeyi önlüyor hem de UX'i
 * netleştiriyor: bir çalıştırma bitmeden yenisi başlamıyor.
 */
let isRunning = false;

export async function evaluateGatekeeper(outputId: string): Promise<void> {
  const outputEl = document.getElementById(outputId);
  if (!outputEl || !editorInstance || isRunning) return;

  isRunning = true;
  const runBtn = document.getElementById("run-btn") as HTMLButtonElement | null;
  if (runBtn) runBtn.disabled = true;

  const code = editorInstance.getValue();

  writeOutput(outputEl, [
    `<span class="out-dim">$ node gatekeeper_exam.js</span>`,
    `<span class="out-info">→ izole sandbox'ta çalıştırılıyor (iframe, allow-same-origin YOK)...</span>`,
  ]);

  try {
    // Küçük bir "işleniyor" gecikmesi — anında sonuç gelirse sahte gibi durur,
    // gerçek bir terminalin nefes alması lazım.
    await sleep(420);

    const result = await runInSandbox(code);

    if (!result.ok) {
      writeOutput(outputEl, [
        `<span class="out-dim">$ node gatekeeper_exam.js</span>`,
        `<span class="out-error">✗ SyntaxError / RuntimeError</span>`,
        `<span class="out-error">${escapeHtml(result.error)}</span>`,
        `<span class="out-dim">// kod bile parse edilemedi. bir kere daha oku.</span>`,
      ]);
      return;
    }

    const output = String(result.value);

    if (output === EXPECTED_PLAINTEXT) {
      writeOutput(outputEl, [
        `<span class="out-dim">$ node gatekeeper_exam.js</span>`,
        `<span class="out-success">✓ DECODE SUCCESSFUL</span>`,
        `<span class="out-dim">plaintext:</span> <span class="out-success">${output}</span>`,
        ``,
        `<span class="out-info">[ACCESS GRANTED]</span>`,
        `<span class="out-dim">// kapı açıldı. topluluğa katıl:</span>`,
        `<span class="out-success">https://${DISCORD_INVITE}</span>`,
      ]);
      pulseSuccess(outputEl);
    } else {
      writeOutput(outputEl, [
        `<span class="out-dim">$ node gatekeeper_exam.js</span>`,
        `<span class="out-error">✗ DECODE MISMATCH</span>`,
        `<span class="out-dim">beklenen uzunluk:</span> ${EXPECTED_PLAINTEXT.length}`,
        `<span class="out-dim">alınan çıktı:</span> <span class="out-error">${escapeHtml(
          output
        )}</span>`,
        ``,
        `<span class="out-error">[ACCESS DENIED]</span>`,
        `<span class="out-dim">// ipucu: şifrelerken toplandıysa, çözerken çıkarman lazım.</span>`,
      ]);
    }
  } finally {
    isRunning = false;
    if (runBtn) runBtn.disabled = false;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function pulseSuccess(el: HTMLElement) {
  el.classList.add("animate-pulse-glow");
  window.setTimeout(() => el.classList.remove("animate-pulse-glow"), 2600);
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
