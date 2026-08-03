interface FeedbackPayload {
  type: string;
  message: string;
  name?: string;
}

interface FeedbackResult {
  ok: boolean;
  remainingSeconds?: number;
  error?: string;
}

async function sendFeedback(payload: FeedbackPayload): Promise<FeedbackResult> {
  const res = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (res.status === 429) {
    return { ok: false, remainingSeconds: data.remainingSeconds };
  }
  if (!res.ok) {
    return { ok: false, error: data.error || "Bilinmeyen hata" };
  }
  return { ok: true };
}

function formatRemaining(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes} dk ${seconds.toString().padStart(2, "0")} sn`;
}

export function initFeedbackForm() {
  const form = document.getElementById("feedback-form") as HTMLFormElement | null;
  const status = document.getElementById("feedback-status");
  const submitBtn = form?.querySelector("button[type=submit]") as HTMLButtonElement | null;
  if (!form || !submitBtn) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const type = (document.getElementById("type") as HTMLSelectElement).value;
    const message = (document.getElementById("message") as HTMLTextAreaElement).value.trim();
    const name = (document.getElementById("name") as HTMLInputElement).value.trim();
    if (!message) return;

    submitBtn.disabled = true;
    if (status) {
      status.textContent = "Gönderiliyor...";
      status.className = "text-sm mt-2 text-ink-dim";
    }

    const result = await sendFeedback({ type, message, name });

    if (result.ok) {
      if (status) {
        status.textContent = "Gönderildi, teşekkürler!";
        status.className = "text-sm mt-2 text-signal-green";
      }
      form.reset();
    } else if (result.remainingSeconds !== undefined) {
      if (status) {
        status.textContent = `Bu kategoride tekrar gönderebilmek için ${formatRemaining(result.remainingSeconds)} bekleyin.`;
        status.className = "text-sm mt-2 text-signal-amber";
      }
    } else {
      if (status) {
        status.textContent = "Bir hata oluştu, tekrar deneyin.";
        status.className = "text-sm mt-2 text-signal-red";
      }
    }

    submitBtn.disabled = false;
  });
}