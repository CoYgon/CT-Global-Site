import { defineConfig } from "vite";

// NOT: `base: "./"` kritik önemde. Bunu "/" olarak bırakırsan GitHub Pages'de
// asset'ler 404 verir çünkü repo bir alt path'te yaşar (kullanici.github.io/repo/).
// Vercel'de zaten fark etmez ama GH Pages için hayat memat meselesi.
export default defineConfig({
  base: "./",
  build: {
    target: "esnext", // top-level await + modern worker syntax için şart
    outDir: "dist",
    sourcemap: false, // prod'da kaynak kodu ifşa etmiyoruz, biz "gatekeeper" ruhundayız
    chunkSizeWarningLimit: 3000, // Monaco tek başına ~2.5MB, bu normal, panik yok
    rollupOptions: {
      output: {
        // Monaco'yu ayrı bir chunk'a izole ediyoruz ki ana bundle hafif kalsın
        manualChunks: {
          monaco: ["monaco-editor"],
        },
      },
    },
  },
  optimizeDeps: {
    // Vite'ın dev modunda worker'ları önceden pre-bundle etmesini sağlıyoruz.
    // Bunu yapmazsan ilk "npm run dev" açılışında editör sonsuza kadar yüklenir.
    include: ["monaco-editor/esm/vs/editor/editor.worker"],
    esbuildOptions: {
      target: "esnext",
    },
  },
  worker: {
    format: "es",
  },
  server: {
    port: 5173,
    open: true,
  },
});
