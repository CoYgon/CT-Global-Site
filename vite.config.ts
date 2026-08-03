import { defineConfig } from "vite";

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
    allowedHosts: true,
  },
});
