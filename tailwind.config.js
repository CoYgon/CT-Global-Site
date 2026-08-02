/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,js}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Tek bir isim uzayı: her yerde bu token'ları kullan, "gri-500" gibi
        // rastgele Tailwind default'larına düşme. Marka disiplini budur.
        void: {
          DEFAULT: "#05070a", // en derin katman — body background
          900: "#0a0e14",
          800: "#0d1117", // GitHub Dark referansı — panel/kart zemini
          700: "#13181f",
          600: "#1c2129",
          border: "#21262d",
        },
        signal: {
          green: "#39ff14", // "matrix" yeşili — canlı/başarı sinyali
          "green-dim": "#1fae0c",
          blue: "#58a6ff", // "cyber" mavisi — bilgi/link sinyali
          red: "#ff4d4d", // hata sinyali
          amber: "#f0b429", // uyarı sinyali
        },
        ink: {
          DEFAULT: "#c9d1d9", // ana metin
          dim: "#8b949e", // ikincil metin
          faint: "#4b535d", // yorum satırı tonu / çok pasif metin
        },
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      animation: {
        blink: "blink 1.05s steps(1) infinite",
        scanline: "scanline 8s linear infinite",
        "flicker-slow": "flicker 6s infinite",
        "pulse-glow": "pulseGlow 2.4s ease-in-out infinite",
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "93%": { opacity: "0.86" },
          "94%": { opacity: "1" },
          "96%": { opacity: "0.9" },
          "97%": { opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0px rgba(57,255,20,0.0)" },
          "50%": { boxShadow: "0 0 22px rgba(57,255,20,0.35)" },
        },
      },
      boxShadow: {
        terminal: "0 0 0 1px rgba(88,166,255,0.08), 0 20px 60px -20px rgba(0,0,0,0.8)",
      },
    },
  },
  plugins: [],
};
