# DevLab // Gatekeeper Terminal

Sıradan bir portfolyo değil. 200 kişilik elit bir geliştirici topluluğuna açılan,
Monaco Editor tabanlı interaktif bir "sınav kapısı".

Vite + Vanilla TypeScript + TailwindCSS + Monaco Editor. React yok, framework
şişkinliği yok — sadece derleyici ve tarayıcı.

## Klasör yapısı

```
devlab-gatekeeper/
├── index.html                        # Tüm section'ların iskeleti + CSP meta
├── package.json
├── tsconfig.json
├── vite.config.ts                    # Monaco worker + chunk yapılandırması
├── tailwind.config.js                # Renk/font/animasyon token sistemi
├── postcss.config.js
├── vercel.json                       # Vercel için HTTP güvenlik başlıkları
├── github.config.json                # GitHub kullanıcı adı — tek kaynak
├── .gitignore
├── .github/
│   └── workflows/
│       └── security.yml              # npm audit + tsc/build + CodeQL (CI)
├── scripts/
│   └── fetch-github-stats.mjs        # Build zamanı GitHub veri çekme script'i
├── public/
│   ├── favicon.svg
│   ├── sandbox.html                  # Gatekeeper kod çalıştırma izolasyonu
│   └── _headers                      # Cloudflare Pages/Netlify header seti
└── src/
    ├── main.ts                # Tek giriş noktası, modülleri bağlar
    ├── style.css               # Tailwind katmanları + CRT/terminal efektleri
    ├── terminal.ts             # Hero'daki daktilo efektli boot sequence
    ├── gatekeeper.ts           # Monaco kurulumu + bug'lı sınav + yargılama
    ├── sandbox-runner.ts       # Kullanıcı kodunu izole iframe'de çalıştırır
    ├── projects.ts             # Devlog grid'i (gerçek proje verisi)
    ├── github.ts               # GitHub bölümü (statik JSON'dan render eder)
    ├── github-stats.json       # ÜRETİLİR — repoya girmez, prebuild yazar
    ├── config.ts               # Tek yerden düzenlenebilir sabitler
    ├── easter-egg.ts           # "hjkl" / "sudo" → Matrix rain + backdoor konsolu
    └── vite-env.d.ts
```

## Yerel geliştirme

```bash
npm install
npm run dev
```

`http://localhost:5173` açılır, dosya kaydettiğinde HMR ile anında güncellenir.

## Prod build

```bash
npm run build
npm run preview   # dist/ çıktısını yerelde test etmek için
```

`dist/` klasörü tamamen statik dosyalardan oluşur — sunucu tarafı hiçbir şey
gerekmez.

## Sıfır maliyetle deploy

### Vercel

1. Repo'yu GitHub'a push'la.
2. [vercel.com/new](https://vercel.com/new) üzerinden repo'yu import et.
3. Framework preset: **Vite**. Build command: `npm run build`, output dir: `dist`.
4. Deploy — Vercel her push'ta otomatik yeniden build alır.

Ekstra ayar gerekmez, `vite.config.ts` içindeki `base: "./"` Vercel'de zaten
sorunsuz çalışır (kök domain'de servis edildiği için).

### GitHub Pages

1. `package.json`'daki `deploy:gh-pages` script'i zaten hazır (`gh-pages` paketi
   devDependencies'te).
2. Repo ayarlarında Pages kaynağını `gh-pages` branch'i olarak seç.
3. Deploy et:

```bash
npm run deploy:gh-pages
```

Bu komut önce `npm run build` çalıştırır, sonra `dist/`'i `gh-pages` branch'ine
push'lar. `base: "./"` sayesinde site `kullanici.github.io/repo-adi/` gibi bir
alt path'te de asset 404'ü yaşamadan çalışır.

**Not:** GitHub Pages custom HTTP header göndermeye izin vermiyor — bu yüzden
`vercel.json` / `public/_headers` içindeki header'lar (X-Frame-Options, HSTS,
Permissions-Policy...) GH Pages'de uygulanmaz, sadece `index.html`'deki meta
CSP çalışır. Header seviyesinde tam sertleştirme istiyorsan Vercel veya
Cloudflare Pages kullan.

## GitHub istatistikleri nasıl güncelleniyor

`03_github` bölümündeki avatar/repo/takipçi verisi **tarayıcıda değil, build
zamanında** çekiliyor (`scripts/fetch-github-stats.mjs`, `npm run dev` ve
`npm run build`'den önce otomatik çalışır — `package.json`'daki
`predev`/`prebuild`). Sonuç `src/github-stats.json`'a yazılır ve site onu
statik bir dosya olarak import eder. Tarayıcı hiçbir zaman `api.github.com`'a
gitmez.

**Neden böyle:** GitHub'ın unauthenticated API limiti (60 istek/saat) IP
başına — ofis/VPN/CGNAT gibi paylaşımlı bir ağdan bir kişi limiti bitirince o
IP'den gelen HERKES 403 yer. Canlı tarayıcı-taraflı fetch bunu ilk sürümde
yaşattı; build-time fetch bu sınıfın tamamını ortadan kaldırıyor.

**Vercel'de daha güvenilir hâle getirmek istersen (opsiyonel):** Project
Settings → Environment Variables'a scope'suz bir GitHub Personal Access
Token'ı `GITHUB_TOKEN` adıyla ekle. Authenticated istekler 60/saat yerine
5000/saat limitine sahip, build script'i otomatik olarak bunu kullanır
(`scripts/fetch-github-stats.mjs` içindeki `process.env.GITHUB_TOKEN` kontrolü).
Eklemesen de çalışır — sadece build'in tam o saatte rate limit'e denk gelme
ihtimali (nadir ama sıfır değil) biraz düşer.

Build script'i bir sebepten (rate limit, offline) veri çekemezse ve elinde
önceki başarılı bir `src/github-stats.json` varsa onu KORUR, build'i
başarısız etmez. Hiç önbellek yoksa zarif bir `ok: false` fallback yazar ve
site "profili doğrudan ziyaret et" linkini gösterir — çökmez.

Kendi kullanıcı adını ayarlamak için `github.config.json`'daki `"username"`
alanını değiştirmen yeterli — hem build script'i hem `src/config.ts` buradan
okuyor.

## Güvenlik sertleştirme

Bu site, kod çalıştırma özelliği barındırdığı ve elit bir güvenlik kitlesine
hitap ettiği için normalden fazla güvenlik katmanına sahip. Hepsi test edildi
(`tsc --noEmit` + `vite build` temiz geçiyor):

1. **Gatekeeper kod çalıştırma artık ana sayfa thread'inde değil, izole bir
   sandbox'ta.** `src/sandbox-runner.ts`, kullanıcının kodunu
   `public/sandbox.html`'e — `sandbox="allow-scripts"` OLAN ama
   `allow-same-origin` OLMAYAN bir `<iframe>` içine — postMessage ile
   gönderiyor. Sonuç: kullanıcı kodu opak bir origin'de çalışır, sitenin
   cookie'sine, localStorage'ına, DOM'una ya da aynı-origin isteklerine
   erişemez. `allow-scripts` + `allow-same-origin`'in BİRLİKTE verilmesi
   sandbox'ı anlamsızlaştırır — bu projede bilerek sadece `allow-scripts` var.
2. **Çalıştırma zaman aşımlı (3sn).** Kullanıcı sonsuz döngü yazarsa iframe
   otomatik yok ediliyor, sekme kilitlenmiyor.
3. **RUN butonu rate-limitli.** Bir çalıştırma bitmeden yenisi başlamıyor
   (`isRunning` kilidi + buton `disabled` state'i) — gereksiz iframe
   oluşturma/yok etme döngüsünü ve yanlışlıkla spam'i engelliyor.
4. **Content-Security-Policy.** `index.html`'deki meta CSP, ana sayfanın
   `script-src`'ini `'self'`'e kilitliyor — `unsafe-inline` / `unsafe-eval`
   YOK. Bunun mümkün olmasının sebebi #1: kod çalıştırma ana dokümandan tamamen
   ayrıştırıldı. `public/sandbox.html`'in KENDİ (daha gevşek, ama izole)
   CSP'si var — çünkü `srcdoc` değil gerçek bir URL üzerinden yüklendiği için
   ana sayfanın politikasını miras almıyor (CSP inheritance sadece
   `about:srcdoc` / `blob:` / `data:` dokümanları için geçerli).
5. **Diğer HTTP güvenlik başlıkları** (`vercel.json` / `public/_headers`):
   `X-Frame-Options: SAMEORIGIN` (clickjacking), `X-Content-Type-Options: nosniff`
   (MIME sniffing), `Referrer-Policy: strict-origin-when-cross-origin`,
   `Permissions-Policy` (kamera/mikrofon/konum kapalı), `Strict-Transport-Security`
   (HSTS, HTTPS zorunlu).
6. **XSS'e karşı manuel escape.** `github.ts` (API'den gelen bio/isim/repo adı)
   ve `gatekeeper.ts` (kullanıcının kod çıktısı) `innerHTML`'e yazmadan önce
   `escapeHtml()`'den geçiyor — API'den ya da kullanıcı kodundan gelen bir
   string asla ham HTML olarak render edilmiyor.
7. **Dış linkler `rel="noopener noreferrer"` ile.** Reverse tabnabbing'e karşı
   — yeni sekmede açılan bir sayfa `window.opener` üzerinden orijinal sekmeyi
   yönlendiremiyor.
8. **`npm audit` + CodeQL, CI'da otomatik.** `.github/workflows/security.yml`
   her push/PR'da ve haftalık olarak bağımlılıkları (`npm audit --audit-level=high`)
   ve kaynak kodu (CodeQL statik analiz) tarıyor.
9. **Prod build'de sourcemap yok, minimal bilgi sızıntısı.** `vite.config.ts`
   içinde `sourcemap: false` — üretim çıktısı orijinal kaynak yapısını ifşa
   etmiyor.
10. **Secrets asla repoya girmiyor.** `.gitignore` içinde `.env*` (örnek hariç)
    ve `.vercel/` var; zaten bu proje hiçbir API anahtarı gerektirmiyor (GitHub
    API'si unauthenticated, public endpoint).

Hiçbiri "hack-proof" iddiası değil — statik bir sitenin gerçekçi tehdit modeli
zaten sınırlı (veritabanı yok, kullanıcı hesabı yok, sunucu tarafı kod yok).
Buradaki katmanlar, var olan tek gerçek saldırı yüzeyini (Gatekeeper'ın kod
çalıştırma özelliği) olabildiğince izole etmeye odaklanıyor.

## Mimari kararlar (neden böyle yaptık)

- **React yok:** Site büyük ölçüde statik + birkaç etkileşim noktası. Framework
  ek yükünü (hydration, virtual DOM) haklı çıkaracak bir karmaşıklık yok.
- **GSAP yok:** Boot sequence ve kart hover efektleri `requestAnimationFrame` /
  CSS transition ile çözülüyor. Ekstra 60KB'lık bir animasyon kütüphanesi
  gerektirmeyecek kadar basit bir animasyon yüzeyimiz var.
- **Monaco `editor.api` + sadece `javascript` dil paketi import ediliyor:**
  `monaco-editor`'ı doğrudan import etmek TypeScript, Python, Rust, SQL... gibi
  30+ dilin tamamını bundle'a gömer (~3.2MB). Biz sadece JS syntax highlighting
  kullandığımız için `editor.api` çekirdeğini + tek bir dil paketini alıyoruz.
- **Monaco `requestIdleCallback` ile dinamik import ediliyor:** Editor'ün
  chunk'ı (~2.2MB, Monaco'nun kendi doğası gereği büyük) tarayıcı boşta
  kaldığında arka planda yükleniyor; hero/boot sequence bunu beklemiyor. İlk
  boyama (`index.js` ~8KB) neredeyse anında oluyor.
- **Kod çalıştırma izole bir sandbox'ta:** Gatekeeper sınavı kullanıcının kodunu
  artık ana sayfa thread'inde değil, `allow-same-origin` olmayan sandboxed bir
  iframe'de çalıştırıyor. Detaylar için yukarıdaki "Güvenlik sertleştirme"
  bölümüne bak.

## Gatekeeper sınavını değiştirmek istersen

`src/gatekeeper.ts` içindeki `STARTER_CODE`, `CIPHER_TEXT`, `SHIFT_KEY` ve
`EXPECTED_PLAINTEXT` sabitlerini değiştirerek bug'ı ve beklenen çözümü
tamamen kendi algoritmanla değiştirebilirsin. `evaluateGatekeeper()` sadece
`run()` fonksiyonunun dönüş değerini `EXPECTED_PLAINTEXT` ile karşılaştırıyor
— algoritma ne olursa olsun mantık aynı kalır.

`DISCORD_INVITE` sabitini kendi gerçek davet linkinle değiştirmeyi unutma.
