const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./gatekeeper-BCWsnhNG.js","./monaco-DWB41ioc.js","./monaco-D6UqZ-mj.css"])))=>i.map(i=>d[i]);
import{_ as k}from"./monaco-DWB41ioc.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function i(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(n){if(n.ep)return;n.ep=!0;const a=i(n);fetch(n.href,a)}})();const v=[{text:"> Sistem başlatılıyor...",style:"prompt",pauseAfter:450},{text:"  [OK] Kernel modülleri yüklendi (7/7)",style:"ok",pauseAfter:250},{text:"> Kullanıcı doğrulanıyor...",style:"prompt",pauseAfter:600},{text:"  [OK] Parmak izi eşleşmedi ama umursamıyoruz, devam.",style:"ok",pauseAfter:350},{text:"> Hoş geldin.",style:"prompt",pauseAfter:300},{text:"  Biz burada kod yazar, sistemleri zorlar ve eğleniriz.",style:"plain",pauseAfter:500},{text:"",pauseAfter:100},{text:"> Aşağı kaydır. Kapı seni bekliyor.",style:"prompt"}],w=18;function S(e){switch(e){case"prompt":return"term-prompt";case"ok":return"term-ok";default:return"text-ink"}}function g(e){return new Promise(t=>setTimeout(t,e))}async function E(e,t,i){const r=document.createElement("p");r.className=`term-line ${S(t.style)}`,e.insertBefore(r,i);for(const n of t.text)r.textContent+=n,t.text.length>0&&await g(w);t.pauseAfter&&await g(t.pauseAfter)}async function C(e){const t=document.getElementById(e);if(!t)return;t.innerHTML="";const i=document.createElement("span");i.className="term-cursor",t.appendChild(i);for(const r of v)await E(t,r,i),t.scrollTop=t.scrollHeight}const T="Coygon",_={username:T},y=_.username,d=`https://github.com/${y}`,ee="discord.gg/devlab",I=[{id:"sentinelos",title:"SentinelOS",tagline:"Sıfırdan yazılmış x86_64 sunucu OS'u",description:"MBR bootloader'dan başlayıp protected/long mode geçişi, VGA/serial output, fiziksel bellek yönetimi, IDT/PIC/PIT ve round-robin scheduler'a kadar tamamı NASM ve C ile. MSR tabanlı syscall arayüzü ve kernel-space shell (mem, ps, reboot, halt) dahil.",stack:["NASM","C","x86_64","Bare Metal"],category:"systems",repoSlug:"sentinelos"},{id:"dpi-firewall",title:"Sentinel DPI Firewall",tagline:"Zero-dependency Linux güvenlik duvarı",description:"Raw socket'ler (AF_PACKET) üzerinden Ethernet/IP/TCP/UDP paketlerini elle parse eden, imza tabanlı derin paket incelemesi (DPI) yapan, port taramalarını yakalayıp fork/execvp ile iptables üzerinden otomatik banlayan sıfır bağımlılıklı bir C projesi.",stack:["C","Raw Sockets","iptables","Linux"],category:"security",repoSlug:"sentinel-dpi-firewall"},{id:"osint-platform",title:"Sentinel OSINT Platform",tagline:"nmap, sqlmap, dirsearch, sherlock — tek panelde",description:"nmap, sqlmap, dirsearch ve sherlock'u orkestrasyon eden bir Node.js/Express dashboard. Server-Sent Events ile canlı log akışı, severity bazlı renklendirilmiş sonuçlar ve koyu cyber-security estetiği.",stack:["Node.js","Express","SSE","TailwindCSS"],category:"security",repoSlug:"sentinel-osint-platform"},{id:"sentinel-core",title:"sentinel-core",tagline:"Zero-dependency Python ağ güvenliği kütüphanesi",description:"XOR şifreleme, async TCP networking ve yapılandırılmış loglama sağlayan bağımsız bir Python paketi. pytest test suite'i, GitHub Actions CI/CD ve PyPI dağıtımıyla üretime hazır.",stack:["Python","asyncio","PyPI","pytest"],category:"tooling",repoSlug:"sentinel-core"},{id:"self-healing",title:"Self-Healing System",tagline:"Windows için kendini onaran arka plan servisi",description:"C++20 ile yazılmış bir Win32 servisi: SMART disk sağlığı izleme, SQLCipher ile şifrelenmiş loglama, registry onarımı ve süreç optimizasyonu. Sistem kendi kendine bakıyor, sen kahveni içmeye devam ediyorsun.",stack:["C++20","Win32 API","SQLCipher"],category:"systems",repoSlug:"self-healing-system"},{id:"code-studio",title:"Sentinel Code Studio",tagline:"Tarayıcı içi, tek dosyalık IDE",description:"Monaco Editor entegrasyonlu, yedi menü kategorili, Find/Replace ve Command Palette modalleriyle donatılmış, tamamen tek HTML dosyasında yaşayan tarayıcı tabanlı bir kod editörü. Bu sitenin Gatekeeper bölümünü inşa ederken kullandığımız araçla aynı aile.",stack:["TypeScript","Monaco Editor","Vanilla JS"],category:"tooling",repoSlug:"sentinel-code-studio"}],L={systems:"sistem",security:"güvenlik",tooling:"araç"},P={systems:"text-signal-blue border-signal-blue/30 bg-signal-blue/10",security:"text-signal-red border-signal-red/30 bg-signal-red/10",tooling:"text-signal-green border-signal-green/30 bg-signal-green/10"},A='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>';function $(e){const t=P[e.category],i=e.stack.map(n=>`<span class="rounded border border-void-border bg-void-700/60 px-2 py-0.5 text-[11px] text-ink-dim">${n}</span>`).join(""),r=`${d}/${e.repoSlug}`;return`
    <article class="project-card rounded-lg border border-void-border bg-void-800/60 p-5 transition hover:border-signal-green/40">
      <div class="mb-3 flex items-start justify-between gap-3">
        <h3 class="text-lg font-semibold text-white">${e.title}</h3>
        <span class="shrink-0 rounded border px-2 py-0.5 text-[10px] uppercase tracking-wide ${t}">
          ${L[e.category]}
        </span>
      </div>
      <p class="mb-3 text-sm text-signal-blue/90">${e.tagline}</p>
      <p class="mb-4 text-sm leading-relaxed text-ink-dim">${e.description}</p>
      <div class="mb-4 flex flex-wrap gap-1.5">${i}</div>
      <a
        href="${r}"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 text-xs text-ink-dim transition hover:text-signal-green"
      >
        ${A}
        <span>repo/${e.repoSlug}</span>
        <span aria-hidden="true">↗</span>
      </a>
    </article>
  `}function B(e){const t=document.getElementById(e);t&&(t.innerHTML=I.map($).join(""))}const z=["hjkl","sudo"];let c="",p=!1;function M(e){if(!(e instanceof HTMLElement))return!1;const t=e.tagName.toLowerCase();return!!(t==="input"||t==="textarea"||e.isContentEditable||e.closest(".monaco-editor"))}function O(e,t,i){const r="アイウエオカキクケコ0123456789ABCDEF$#@%&";t.fillStyle="rgba(5, 7, 10, 0.12)",t.fillRect(0,0,e.width,e.height),t.font="16px monospace";for(let n=0;n<i.length;n++){const a=r[Math.floor(Math.random()*r.length)],o=n*16,s=i[n]*16;t.fillStyle=Math.random()>.95?"#ffffff":"#39ff14",t.fillText(a,o,s),s>e.height&&Math.random()>.975&&(i[n]=0),i[n]++}}async function R(e){const t=document.getElementById("matrix-canvas");if(!t)return;const i=t.getContext("2d");if(!i)return;const r=t,n=i;r.width=window.innerWidth,r.height=window.innerHeight,r.classList.remove("hidden");const a=Math.floor(r.width/16),o=new Array(a).fill(1);let s;const h=performance.now();return new Promise(b=>{function m(x){O(r,n,o),x-h<e?s=requestAnimationFrame(m):(cancelAnimationFrame(s),r.classList.add("hidden"),n.clearRect(0,0,r.width,r.height),b())}s=requestAnimationFrame(m)})}function G(){document.body.style.transition="transform 0.05s ease-in-out";let e=0;const t=6,i=window.setInterval(()=>{const r=e%2===0?"translateX(-6px)":"translateX(6px)";document.body.style.transform=r,e++,e>=t&&(window.clearInterval(i),document.body.style.transform="translateX(0)")},55)}async function D(){if(p)return;p=!0,G(),await R(2e3);const e=document.getElementById("backdoor-console");e&&(e.classList.remove("hidden"),e.classList.add("flex"),requestAnimationFrame(()=>e.classList.remove("opacity-0")),window.setTimeout(()=>{e.classList.add("opacity-0"),window.setTimeout(()=>{e.classList.add("hidden"),e.classList.remove("flex")},300)},2200)),p=!1}function N(){window.addEventListener("keydown",e=>{if(!M(e.target)&&e.key.length===1){c=(c+e.key.toLowerCase()).slice(-10);for(const t of z)if(c.endsWith(t)){c="",D();break}}})}const F="2026-08-02T14:21:12.723Z",H={login:"CoYgon",avatar_url:"https://avatars.githubusercontent.com/u/306320173?v=4",public_repos:11,followers:0,following:0,html_url:"https://github.com/CoYgon"},U=[{name:"DomainPlus",html_url:"https://github.com/CoYgon/DomainPlus",stargazers_count:1,language:"JavaScript"},{name:"CT-Global-Site",html_url:"https://github.com/CoYgon/CT-Global-Site",stargazers_count:0,language:"TypeScript"},{name:"OSINT-BROWSER",html_url:"https://github.com/CoYgon/OSINT-BROWSER",stargazers_count:0,language:"JavaScript"}],Y={fetchedAt:F,user:H,repos:U},u=Y;function l(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function q(e){try{return new Date(e).toLocaleString("tr-TR",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}catch{return e}}function K(e){e.innerHTML=`
    <div class="text-sm text-ink-dim">
      <p class="text-signal-amber">// build zamanında veri çekilemedi (rate limit ya da GITHUB_USERNAME henüz ayarlanmadı olabilir).</p>
      <p class="mt-2">Profili yine de doğrudan ziyaret edebilirsin:</p>
      <a href="${d}" target="_blank" rel="noopener noreferrer" class="mt-2 inline-flex items-center gap-1.5 text-signal-green hover:underline">
        ${d} ↗
      </a>
    </div>
  `}function W(e,t,i,r){const n=i.map(a=>`
        <a
          href="${a.html_url}"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center justify-between gap-3 rounded border border-void-border bg-void-700/40 px-3 py-2 text-xs transition hover:border-signal-green/40"
        >
          <span class="truncate text-ink">${l(a.name)}</span>
          <span class="flex shrink-0 items-center gap-3 text-ink-faint">
            ${a.language?`<span>${l(a.language)}</span>`:""}
            <span class="text-signal-amber">★ ${a.stargazers_count}</span>
          </span>
        </a>
      `).join("");e.innerHTML=`
    <div class="grid gap-6 sm:grid-cols-[auto_1fr]">
      <img
        src="${t.avatar_url}"
        alt="${l(t.login)} avatarı"
        width="72"
        height="72"
        class="h-[72px] w-[72px] rounded-md border border-void-border"
        loading="lazy"
      />
      <div class="min-w-0">
        <p class="text-lg font-semibold text-white">${l(t.login)}</p>
        <p class="text-sm text-signal-blue/90">@${l(t.login)}</p>
        
      </div>
    </div>

    <div class="mt-6 grid grid-cols-3 gap-2 text-center sm:gap-3">
      <div class="rounded border border-void-border bg-void-700/40 py-3">
        <p class="text-lg font-semibold text-signal-green sm:text-xl">${t.public_repos}</p>
        <p class="text-[10px] uppercase tracking-wide text-ink-faint sm:text-[11px]">repo</p>
      </div>
      <div class="rounded border border-void-border bg-void-700/40 py-3">
        <p class="text-lg font-semibold text-signal-green sm:text-xl">${t.followers}</p>
        <p class="text-[10px] uppercase tracking-wide text-ink-faint sm:text-[11px]">takipçi</p>
      </div>
      <div class="rounded border border-void-border bg-void-700/40 py-3">
        <p class="text-lg font-semibold text-signal-green sm:text-xl">${t.following}</p>
        <p class="text-[10px] uppercase tracking-wide text-ink-faint sm:text-[11px]">takip</p>
      </div>
    </div>

    ${n?`
      <div class="mt-6">
        <p class="mb-2 text-[11px] uppercase tracking-wide text-ink-faint">yıldızına göre en iyi repo'lar</p>
        <div class="flex flex-col gap-2">${n}</div>
      </div>
    `:""}

    <a
      href="${t.html_url}"
      target="_blank"
      rel="noopener noreferrer"
      class="mt-6 inline-flex items-center gap-2 rounded-md border border-signal-green/40 bg-signal-green/10 px-5 py-2.5 text-sm text-signal-green transition hover:bg-signal-green/20"
    >
      &gt; profili_takip_et
    </a>

    <p class="mt-4 text-[11px] text-ink-faint">
      // veri build zamanında çekildi · son güncelleme: ${q(r)}
    </p>
  `}function j(e){const t=document.getElementById(e);if(t){if(!u.user){K(t);return}W(t,u.user,u.repos,u.fetchedAt)}}function V(){const e=document.getElementById("github-header-link");e&&(e.href=d);const t=document.getElementById("github-footer-link");t&&(t.href=d,t.textContent=`github.com/${y}`)}function J(){const e=()=>{k(async()=>{const{mountGatekeeperEditor:i,evaluateGatekeeper:r}=await import("./gatekeeper-BCWsnhNG.js");return{mountGatekeeperEditor:i,evaluateGatekeeper:r}},__vite__mapDeps([0,1,2]),import.meta.url).then(({mountGatekeeperEditor:i,evaluateGatekeeper:r})=>{i("monaco-editor"),document.getElementById("run-btn")?.addEventListener("click",()=>void r("gatekeeper-output"))})},t=window.requestIdleCallback;typeof t=="function"?t(e,{timeout:1500}):window.setTimeout(e,300)}function X(){const e=document.getElementById("clock");if(!e)return;const t=()=>{const i=new Date;e.textContent=i.toLocaleTimeString("tr-TR",{hour12:!1})};t(),window.setInterval(t,1e3)}function Z(){const e=document.getElementById("year");e&&(e.textContent=String(new Date().getFullYear()))}function f(){X(),Z(),V(),N(),B("project-grid"),J(),j("github-panel"),window.setTimeout(()=>{C("boot-terminal")},200)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",f):f();export{ee as D};
