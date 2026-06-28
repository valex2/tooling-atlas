window.onerror=function(msg,src,ln,col){try{let b=document.getElementById("apperr");if(!b){b=document.createElement("div");b.id="apperr";b.style.cssText="position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#b0261e;color:#fff;font:12px/1.4 monospace;padding:8px 12px;white-space:pre-wrap";document.body&&document.body.appendChild(b);}b.textContent="JS error: "+msg+"  ("+(src||"").split("/").pop()+":"+ln+":"+col+")";}catch(e){}return false;};
window.VAULT="Obsidian Vault";
// KCOL = bright fills (dots, bars, stripes). KINK = darkened variants for TEXT/links on the
// cream background — Make & Manufacture fail WCAG contrast as text otherwise. KGLY = a
// non-colour channel for kind (so colour-blind readers and B/W printouts still distinguish them).
window.KCOL={Measure:"#3266ad",Model:"#8a4fb3",Make:"#b06a1e",Manufacture:"#2f8f6b"};
window.KINK={Measure:"#2b5896",Model:"#7a429e",Make:"#8a5212",Manufacture:"#1d7350"};
window.KGLY={Measure:"◇",Model:"◯",Make:"△",Manufacture:"▦"};
// Single source of truth for historical era bands (used by every view). Edit here only.
window.ERAS=[["Medieval",1200,1400],["Renaissance",1400,1600],["Scientific Revolution",1600,1687],["Enlightenment",1687,1760],["Industrial Revolution",1760,1840],["2nd Industrial Rev.",1840,1914],["World War I",1914,1918],["Interwar",1918,1939],["World War II",1939,1945],["Cold War",1945,1991],["Information Age",1991,2008],["AI Age",2008,2031]];
window.obsidianURL=function(id){return "obsidian://open?vault="+encodeURIComponent(VAULT)+"&file="+encodeURIComponent("Tooling Card - "+id);};
// Open a card in the Deck (card) view. In the single-file shell (iframes) ask the parent to switch tabs; otherwise deep-link to the deck.
window.openCard=function(name){name=name||"";
 try{if(window.parent&&window.parent!==window){window.parent.postMessage({type:"opencard",id:name},"*");return;}}catch(e){}
 var views=location.pathname.indexOf("/views/")>=0;var deck=views?"deck.html":"views/deck.html";
 location.href=deck+"#card="+encodeURIComponent(name);};
window.rebuildById=function(){window.__byId=(window.CARDS?Object.fromEntries(CARDS.map(c=>[c.id,c])):{});return window.__byId;};
window.__byId=window.rebuildById();
window.showDetail=function(c){
 if(!Object.keys(__byId).length&&window.CARDS)rebuildById();
 if(typeof c==="string")c=__byId[c]||{name:c};
 const KC=KCOL, col=KC[c.kind]||"#999", ink=(KINK[c.kind]||"#444"), gly=(KGLY[c.kind]||""), id=c.id||(c.name||"").replace(/\//g,"-");
 const chips=a=>(a&&a.length)?a.map(x=>'<span style="display:inline-block;background:#f0ede7;border-radius:8px;padding:1px 7px;margin:2px 3px 0 0;font-size:11px">'+x+'</span>').join(""):"<span style='color:#bbb'>—</span>";
 const nav=a=>(a&&a.length)?a.map(x=>'<span class="xnav" data-id="'+encodeURIComponent(x)+'" style="cursor:pointer;display:inline-block;background:#efe7dd;border:.5px solid #e0d3c2;border-radius:8px;padding:1px 7px;margin:2px 3px 0 0;font-size:11px;color:#7a5a30">'+(__byId[x]?__byId[x].name:x)+'</span>').join(""):"<span style='color:#bbb'>—</span>";
 let p=document.getElementById("appdetail");
 if(!p){p=document.createElement("div");p.id="appdetail";p.style.cssText="position:fixed;top:0;right:0;width:330px;max-width:92vw;height:100%;background:#fff;border-left:.5px solid rgba(0,0,0,.15);box-shadow:-8px 0 30px rgba(0,0,0,.12);z-index:2000;overflow:auto;padding:18px 18px 50px;font:13px/1.5 -apple-system,BlinkMacSystemFont,sans-serif;color:#1c1c1c";document.body.appendChild(p);}
 p.innerHTML='<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px"><div style="font-family:var(--serif),Charter,Georgia,serif;font-size:18px;font-weight:600;line-height:1.15;color:'+ink+'"><span aria-hidden="true" style="font-size:13px;margin-right:5px">'+gly+'</span>'+(c.name||"")+'</div><button id="appdx" aria-label="Close panel" style="cursor:pointer;color:#777;font-size:18px;line-height:1;background:none;border:0;padding:2px 4px">✕</button></div>'
 +'<div style="color:#6f6f6f;font-size:12px;margin:3px 0 2px">'+(c.kind||"")+' · '+(c.place||"")+' · '+(c.year||"")+(c.goal?' · Goal '+c.goal:"")+(c.mech?' · '+c.mech:"")+'</div>'
 +'<div style="color:#6f6f6f;font-size:12px">'+(c.person||"")+'</div>'
 +(c.tool?'<div style="font-size:12px;margin-top:6px;font-style:italic;color:#555">'+c.tool+'</div>':"")
 +'<div style="font-size:13px;line-height:1.55;margin-top:10px">'+(c.sig||"")+'</div>'
 +'<div style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#999;margin-top:14px">Threads</div>'+chips(c.threads)
 +'<div style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#999;margin-top:10px">Builds on</div>'+nav(c.bo)
 +'<div style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#999;margin-top:6px">Enables</div>'+nav(c.en)
 +'<button id="appcard" style="cursor:pointer;display:inline-block;margin:16px 8px 0 0;background:'+ink+';color:#fff;padding:7px 13px;border:0;border-radius:9px;font-size:12.5px">Open as card ↗</button>'
 +(location.protocol==='file:'?'<a href="'+obsidianURL(id)+'" style="display:inline-block;margin-top:16px;background:#5a5a5a;color:#fff;text-decoration:none;padding:7px 13px;border-radius:9px;font-size:12.5px">Open note in Obsidian ↗</a>':'');
 p.style.display="block";
 document.getElementById("appdx").onclick=()=>p.style.display="none";
 var _oc=document.getElementById("appcard");if(_oc)_oc.onclick=function(){openCard(c.name||c.id);};
 p.querySelectorAll(".xnav").forEach(el=>el.onclick=()=>{const c2=__byId[decodeURIComponent(el.dataset.id)];if(c2)showDetail(c2);});
};
// URL state
window.getState=function(){const o={};(location.hash||"").replace(/^#/,"").split("&").forEach(kv=>{if(!kv)return;const i=kv.indexOf("=");const k=i<0?kv:kv.slice(0,i);o[k]=i<0?"":decodeURIComponent(kv.slice(i+1));});return o;};
window.setState=function(patch){const o=getState();Object.assign(o,patch);const s=Object.entries(o).filter(e=>e[1]!==""&&e[1]!=null).map(e=>e[0]+"="+encodeURIComponent(e[1])).join("&");try{history.replaceState(null,"",location.pathname+(s?"#"+s:""));}catch(e){try{location.hash=s;}catch(e2){}}buildNav();};
// Unified thread selection (shared by Globe, Timeline, Table). `thread` hash param = comma-joined list.
window.getThreads=function(){return ((getState().thread)||"").split(",").map(s=>s.trim()).filter(Boolean);};
window.setThreads=function(arr){setState({thread:(arr||[]).join(",")});};
window.threadMatch=function(card,arr){return !arr||!arr.length||arr.some(t=>(card.threads||[]).includes(t));};
// dynamic nav
const NAVITEMS=[["Home","index.html"],["Globe","map.html"],["Timeline","views/atlas.html"],["Tree","views/tree.html"],["Deck","views/deck.html"],["Table","table.html"],["Dashboard","dashboard.html"]];
function buildNav(){const el=document.getElementById("appnav");if(!el)return;const views=location.pathname.indexOf("/views/")>=0;const cur=location.pathname.split("/").pop()||"index.html";
 el.innerHTML=NAVITEMS.map(([label,file])=>{let h=file;if(views){h=file.indexOf("views/")===0?file.slice(6):"../"+file;}const key=file.split("/").pop();const act=key===cur?"background:#1c1c1c;color:#fff;":"background:#fff;color:#1c1c1c;";return '<a href="'+h+location.hash+'" style="text-decoration:none;padding:2px 9px;border-radius:11px;border:.5px solid rgba(0,0,0,.15);'+act+'font-size:11.5px">'+label+'</a>';}).join("");}
// help overlay
function helpHTML(){const KC=KCOL;const ms=[["Measure","seeing what's there: a microscope, an X-ray, a way to read DNA"],["Model","a way to think about it: an equation or rule that lets you predict without touching the real thing"],["Make","building one working copy: a single transistor, engine, or molecule"],["Manufacture","building a billion of them, cheap and identical, on a factory floor"]];
 return '<div style="background:#fff;max-width:560px;margin:10vh auto;border-radius:14px;padding:24px 26px;font:14px/1.6 -apple-system,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.3);position:relative">'
 +'<span id="helpx" style="position:absolute;top:14px;right:18px;cursor:pointer;color:#999;font-size:20px">✕</span>'
 +'<div style="font-family:Charter,\'Iowan Old Style\',Georgia,serif;font-size:20px;font-weight:600;margin-bottom:8px">The four jobs a tool does</div>'
 +'<p style="margin:0 0 12px">Every tool here does one of four jobs, and they fall in order.</p>'
 +ms.map(m=>'<div style="border-left:4px solid '+KC[m[0]]+';padding:4px 10px;margin:6px 0;background:#faf9f6;border-radius:0 8px 8px 0"><b style="color:'+KC[m[0]]+'">'+m[0]+'</b> — '+m[1]+'.</div>').join("")
 +'<p style="margin:12px 0 0;font-weight:600">See it, understand it, build one, build a million.</p>'
 +'<p style="margin:8px 0 0;color:#555">And because ideas are free to copy, the lead that lasts almost always sits at the far end — in the making at scale, where the skill is in the doing and can\'t be written down.</p>'
 +'</div>';}
function mountHelp(){if(document.getElementById("helpbtn"))return;
 const b=document.createElement("button");b.id="helpbtn";b.textContent="?";b.title="What do the four colours mean?";b.setAttribute("aria-label","What do the four colours mean?");
 b.style.cssText="position:fixed;bottom:14px;right:14px;width:30px;height:30px;border:0;border-radius:50%;background:#1c1c1c;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;cursor:pointer;z-index:1500;box-shadow:0 4px 14px rgba(0,0,0,.25)";
 const ov=document.createElement("div");ov.id="helpov";ov.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:3000;display:none";ov.innerHTML=helpHTML();
 document.body.appendChild(b);document.body.appendChild(ov);
 b.onclick=()=>{ov.style.display="block";};
 ov.onclick=e=>{if(e.target===ov||e.target.id==="helpx")ov.style.display="none";};}
// Inject cross-cutting chrome from one place: favicon (was only on Home), an accessibility
// baseline (visible keyboard focus, reduced-motion, tabular numerals), and a small-screen
// guard so the fixed nav never overprints a view's title. Every view picks these up for free.
function injectChrome(){
 if(!document.querySelector('link[rel="icon"]')){
  const f="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><rect width='8' height='8' fill='%233266ad'/><rect x='8' width='8' height='8' fill='%238a4fb3'/><rect y='8' width='8' height='8' fill='%23b06a1e'/><rect x='8' y='8' width='8' height='8' fill='%232f8f6b'/></svg>";
  const l=document.createElement("link");l.rel="icon";l.href=f;document.head.appendChild(l);
 }
 if(!document.getElementById("ta-a11y")){
  const s=document.createElement("style");s.id="ta-a11y";
  s.textContent=
   ":focus-visible{outline:2px solid #1c1c1c;outline-offset:2px;border-radius:3px}"+
   "a:focus-visible,button:focus-visible,[tabindex]:focus-visible{outline:2px solid #1c1c1c;outline-offset:2px}"+
   ".num,.yr,.ylab,.car,td{font-variant-numeric:tabular-nums}"+   // align digits like an instrument
   "#appnav a:focus-visible{outline-offset:1px}"+
   "@media (prefers-reduced-motion:reduce){*{animation-duration:.001ms!important;transition-duration:.001ms!important;scroll-behavior:auto!important}}"+
   "@media (max-width:640px){#appnav{position:static!important;justify-content:flex-end;padding:6px 8px 0}body>.top>h1,body>.top h1{margin-top:4px}}";
  document.head.appendChild(s);
 }
 const nav=document.getElementById("appnav");
 if(nav){nav.setAttribute("role","navigation");nav.setAttribute("aria-label","Views");}
}
document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;
 const d=document.getElementById("appdetail");if(d&&d.style.display!=="none"){d.style.display="none";return;}
 const o=document.getElementById("helpov");if(o&&o.style.display==="block")o.style.display="none";});
window.addEventListener("DOMContentLoaded",()=>{window.rebuildById();injectChrome();buildNav();mountHelp();});
