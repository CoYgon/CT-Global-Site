import{e as g}from"./monaco-DWB41ioc.js";import{D as E}from"./index-MEsfr9Ik.js";function h(e){return new Worker(""+new URL("editor.worker-DRJWgvDN.js",import.meta.url).href,{type:"module",name:e?.name})}const p=3e3;function T(e){return new Promise(n=>{const t=document.createElement("iframe");t.setAttribute("sandbox","allow-scripts"),t.style.display="none",t.setAttribute("aria-hidden","true");let o=!1;const s=()=>{window.removeEventListener("message",c),window.clearTimeout(k),t.remove()},a=i=>{o||(o=!0,s(),n(i))};function c(i){if(i.source!==t.contentWindow)return;const r=i.data;!r||r.__gatekeeperResult!==!0||(r.ok?a({ok:!0,value:r.value}):a({ok:!1,error:r.error??"Bilinmeyen hata"}))}const k=window.setTimeout(()=>{a({ok:!1,error:`Zaman aşımı (${p}ms) — sonsuz döngün mü var acaba?`})},p);window.addEventListener("message",c),t.addEventListener("load",()=>{t.contentWindow?.postMessage({__gatekeeperRun:!0,code:e},"*")}),t.src="./sandbox.html",document.body.appendChild(t)})}self.MonacoEnvironment={getWorker(){return new h}};const b=5,w="BJQHTRJ_YT_YMJ_QFG",m="WELCOME_TO_THE_LAB",y=`// ══════════════════════════════════════════
// GATEKEEPER PROTOCOL v1.3
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

    const code = cipherText.charCodeAt(i) - 65; // 'A' = 0, 'B' = 1, ...

    // BUG BURADA: şifrelerken +shift yapıldıysa, ÇÖZERKEN -shift yapman lazım.
    // Şu an ikisini de topluyoruz, bu da mesajı ÇÖZMEK yerine daha da BOZUYOR.
    const decoded = (code + shift + 26) % 26;

    result += String.fromCharCode(decoded + 65);
  }

  return result;
}

// Bu kısma dokunma — sadece decodeMessage() içindeki mantığı düzelt.
const CIPHER = "${w}";
const SHIFT = ${b};

function run() {
  return decodeMessage(CIPHER, SHIFT);
}
`;let d=null;function C(){g.defineTheme("gatekeeper-dark",{base:"vs-dark",inherit:!0,rules:[{token:"comment",foreground:"4b535d",fontStyle:"italic"},{token:"keyword",foreground:"58a6ff"},{token:"string",foreground:"39ff14"},{token:"number",foreground:"f0b429"}],colors:{"editor.background":"#0d1117","editor.foreground":"#c9d1d9","editorCursor.foreground":"#39ff14","editorLineNumber.foreground":"#4b535d","editorLineNumber.activeForeground":"#58a6ff","editor.selectionBackground":"#1c2129","editor.lineHighlightBackground":"#13181f"}})}function B(e){const n=document.getElementById(e);n&&(C(),d=g.create(n,{value:y,language:"javascript",theme:"gatekeeper-dark",fontFamily:"'JetBrains Mono', 'Fira Code', monospace",fontSize:13.5,lineHeight:22,minimap:{enabled:!1},scrollBeyondLastLine:!1,automaticLayout:!0,padding:{top:16},renderLineHighlight:"all",smoothScrolling:!0,cursorBlinking:"smooth",tabSize:2}))}function u(e,n){e.innerHTML=n.join(`
`),e.scrollTop=e.scrollHeight}let l=!1;async function R(e){const n=document.getElementById(e);if(!n||!d||l)return;l=!0;const t=document.getElementById("run-btn");t&&(t.disabled=!0);const o=d.getValue();u(n,['<span class="out-dim">$ node gatekeeper_exam.js</span>',`<span class="out-info">→ izole sandbox'ta çalıştırılıyor (iframe, allow-same-origin YOK)...</span>`]);try{await S(420);const s=await T(o);if(!s.ok){u(n,['<span class="out-dim">$ node gatekeeper_exam.js</span>','<span class="out-error">✗ SyntaxError / RuntimeError</span>',`<span class="out-error">${f(s.error)}</span>`,'<span class="out-dim">// kod bile parse edilemedi. bir kere daha oku.</span>']);return}const a=String(s.value);a===m?(u(n,['<span class="out-dim">$ node gatekeeper_exam.js</span>','<span class="out-success">✓ DECODE SUCCESSFUL</span>',`<span class="out-dim">plaintext:</span> <span class="out-success">${a}</span>`,"",'<span class="out-info">[ACCESS GRANTED]</span>','<span class="out-dim">// kapı açıldı. topluluğa katıl:</span>',`<span class="out-success">https://${E}</span>`]),_(n)):u(n,['<span class="out-dim">$ node gatekeeper_exam.js</span>','<span class="out-error">✗ DECODE MISMATCH</span>',`<span class="out-dim">beklenen uzunluk:</span> ${m.length}`,`<span class="out-dim">alınan çıktı:</span> <span class="out-error">${f(a)}</span>`,"",'<span class="out-error">[ACCESS DENIED]</span>','<span class="out-dim">// ipucu: şifrelerken toplandıysa, çözerken çıkarman lazım.</span>'])}finally{l=!1,t&&(t.disabled=!1)}}function S(e){return new Promise(n=>window.setTimeout(n,e))}function _(e){e.classList.add("animate-pulse-glow"),window.setTimeout(()=>e.classList.remove("animate-pulse-glow"),2600)}function f(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}export{R as evaluateGatekeeper,B as mountGatekeeperEditor};
