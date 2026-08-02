// easter-egg.ts
// Klavyeyi global olarak dinliyoruz. Kullanıcı bir input/textarea/Monaco
// içine yazıyorsa müdahale ETMİYORUZ — aksi halde Gatekeeper sınavında
// "sudo" kelimesini kod yorumuna yazan biri anında flashbang yer, kötü UX.

const TRIGGERS = ["hjkl", "sudo"];
const MAX_BUFFER = 10;

let keyBuffer = "";
let isPlaying = false;

function isTypingInEditableField(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea") return true;
  if (target.isContentEditable) return true;
  // Monaco kendi gizli textarea'sını .monaco-editor içine mount ediyor
  if (target.closest(".monaco-editor")) return true;
  return false;
}

function drawMatrixFrame(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, drops: number[]) {
  const chars = "アイウエオカキクケコ0123456789ABCDEF$#@%&";

  ctx.fillStyle = "rgba(5, 7, 10, 0.12)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "16px monospace";

  for (let i = 0; i < drops.length; i++) {
    const char = chars[Math.floor(Math.random() * chars.length)];
    const x = i * 16;
    const y = drops[i] * 16;

    ctx.fillStyle = Math.random() > 0.95 ? "#ffffff" : "#39ff14";
    ctx.fillText(char, x, y);

    if (y > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

async function playMatrixBurst(durationMs: number): Promise<void> {
  const canvas = document.getElementById("matrix-canvas") as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Narrow'ı closure'lar boyunca korumak için yeni bir const'a bağlıyoruz —
  // TS bazen nested function'larda orijinal null-check'i unutuyor.
  const safeCanvas = canvas;
  const safeCtx = ctx;

  safeCanvas.width = window.innerWidth;
  safeCanvas.height = window.innerHeight;
  safeCanvas.classList.remove("hidden");

  const columns = Math.floor(safeCanvas.width / 16);
  const drops = new Array(columns).fill(1);

  let rafId: number;
  const start = performance.now();

  return new Promise((resolve) => {
    function frame(now: number) {
      drawMatrixFrame(safeCanvas, safeCtx, drops);
      if (now - start < durationMs) {
        rafId = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(rafId);
        safeCanvas.classList.add("hidden");
        safeCtx.clearRect(0, 0, safeCanvas.width, safeCanvas.height);
        resolve();
      }
    }
    rafId = requestAnimationFrame(frame);
  });
}

function shakeScreen(): void {
  document.body.style.transition = "transform 0.05s ease-in-out";
  let shakes = 0;
  const maxShakes = 6;
  const interval = window.setInterval(() => {
    const offset = shakes % 2 === 0 ? "translateX(-6px)" : "translateX(6px)";
    document.body.style.transform = offset;
    shakes++;
    if (shakes >= maxShakes) {
      window.clearInterval(interval);
      document.body.style.transform = "translateX(0)";
    }
  }, 55);
}

async function triggerBackdoor(): Promise<void> {
  if (isPlaying) return;
  isPlaying = true;

  shakeScreen();
  await playMatrixBurst(2000);

  const consoleEl = document.getElementById("backdoor-console");
  if (consoleEl) {
    consoleEl.classList.remove("hidden");
    consoleEl.classList.add("flex");
    requestAnimationFrame(() => consoleEl.classList.remove("opacity-0"));

    window.setTimeout(() => {
      consoleEl.classList.add("opacity-0");
      window.setTimeout(() => {
        consoleEl.classList.add("hidden");
        consoleEl.classList.remove("flex");
      }, 300);
    }, 2200);
  }

  isPlaying = false;
}

export function initEasterEgg(): void {
  window.addEventListener("keydown", (event) => {
    if (isTypingInEditableField(event.target)) return;

    // Sadece tek karakterli tuşları buffer'a ekliyoruz (ok tuşları, Shift vs. yok sayılır)
    if (event.key.length !== 1) return;

    keyBuffer = (keyBuffer + event.key.toLowerCase()).slice(-MAX_BUFFER);

    for (const trigger of TRIGGERS) {
      if (keyBuffer.endsWith(trigger)) {
        keyBuffer = "";
        void triggerBackdoor();
        break;
      }
    }
  });
}
