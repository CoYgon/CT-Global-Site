// terminal.ts
// Hero section'daki sahte boot sequence. GSAP çekmeye gerek yok — bu iş için
// setTimeout + template string yeterince "hafif vanilla JS animasyon" oluyor.
// (Bundle boyutunu her byte'ında hesap veriyoruz, elit bir topluluğa yakışır.)

type BootLine = {
  text: string;
  /** "prompt" -> mavi "> " öneki, "ok" -> yeşil, "plain" -> düz metin */
  style?: "prompt" | "ok" | "plain";
  /** Bu satırdan sonra ne kadar beklenecek (ms) */
  pauseAfter?: number;
};

const BOOT_SEQUENCE: BootLine[] = [
  { text: "> Sistem başlatılıyor...", style: "prompt", pauseAfter: 450 },
  { text: "  [OK] Kernel modülleri yüklendi (7/7)", style: "ok", pauseAfter: 250 },
  { text: "> Kullanıcı doğrulanıyor...", style: "prompt", pauseAfter: 600 },
  { text: "  [OK] Parmak izi eşleşmedi ama umursamıyoruz, devam.", style: "ok", pauseAfter: 350 },
  { text: "> Hoş geldin.", style: "prompt", pauseAfter: 300 },
  {
    text: "  Biz burada kod yazar, sistemleri zorlar ve eğleniriz.",
    style: "plain",
    pauseAfter: 500,
  },
  { text: "", pauseAfter: 100 },
  { text: "> Aşağı kaydır. Kapı seni bekliyor.", style: "prompt" },
];

const TYPE_SPEED_MS = 18; // karakter başına gecikme

function styleClassFor(style: BootLine["style"]): string {
  switch (style) {
    case "prompt":
      return "term-prompt";
    case "ok":
      return "term-ok";
    default:
      return "text-ink";
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Bir satırı karakter karakter yazdırır ve container'a ekler.
 * cursorEl her satırdan sonra en sona taşınır ki "aktif imleç" hissi kaybolmasın.
 */
async function typeLine(container: HTMLElement, line: BootLine, cursorEl: HTMLElement) {
  const p = document.createElement("p");
  p.className = `term-line ${styleClassFor(line.style)}`;
  container.insertBefore(p, cursorEl);

  for (const char of line.text) {
    p.textContent += char;
    // Her karakterde beklemek yerine, boş satırları anında geçiyoruz —
    // kullanıcı sabırsızsa bile 20 saniyelik boot ekranına mahkum etmiyoruz.
    if (line.text.length > 0) {
      await sleep(TYPE_SPEED_MS);
    }
  }

  if (line.pauseAfter) {
    await sleep(line.pauseAfter);
  }
}

export async function runBootSequence(containerId: string): Promise<void> {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  const cursor = document.createElement("span");
  cursor.className = "term-cursor";
  container.appendChild(cursor);

  for (const line of BOOT_SEQUENCE) {
    await typeLine(container, line, cursor);
    container.scrollTop = container.scrollHeight;
  }

  // Boot bitince imleç sonsuza kadar yanıp sönmeye devam ediyor —
  // sistem "hazır ve bekliyor" mesajı veriyor.
}
