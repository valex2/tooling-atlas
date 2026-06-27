window.onerror=function(msg,src,ln,col){try{let b=document.getElementById("apperr");if(!b){b=document.createElement("div");b.id="apperr";b.style.cssText="position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#b0261e;color:#fff;font:12px/1.4 monospace;padding:8px 12px;white-space:pre-wrap";document.body&&document.body.appendChild(b);}b.textContent="JS error: "+msg+"  ("+(src||"").split("/").pop()+":"+ln+":"+col+")";}catch(e){}return false;};
window.VAULT="Obsidian Vault";
window.KCOL={Measure:"#3266ad",Model:"#8a4fb3",Make:"#b06a1e",Manufacture:"#2f8f6b"};
window.obsidianURL=function(id){return "obsidian://open?vault="+encodeURIComponent(VAULT)+"&file="+encodeURIComponent("Tooling Card - "+id);};
window.rebuildById=function(){window.__byId=(window.CARDS?Object.fromEntries(CARDS.map(c=>[c.id,c])):{});return window.__byId;};
window.__byId=window.rebuildById();
window.showDetail=function(c){
 if(!Object.keys(__byId).length&&window.CARDS)rebuildById();
 if(typeof c==="string")c=__byId[c]||{name:c};
 const KC=KCOL, col=KC[c.kind]||"#999", id=c.id||(c.name||"").replace(/\//g,"-");
 const chips=a=>(a&&a.length)?a.map(x=>'<span style="display:inline-block;background:#f0ede7;border-radius:8px;padding:1px 7px;margin:2px 3px 0 0;font-size:11px">'+x+'</span>').join(""):"<span style='color:#bbb'>—</span>";
 const nav=a=>(a&&a.length)?a.map(x=>'<span class="xnav" data-id="'+encodeURIComponent(x)+'" style="cursor:pointer;display:inline-block;background:#efe7dd;border:.5px solid #e0d3c2;border-radius:8px;padding:1px 7px;margin:2px 3px 0 0;font-size:11px;color:#7a5a30">'+(__byId[x]?__byId[x].name:x)+'</span>').join(""):"<span style='color:#bbb'>—</span>";
 let p=document.getElementById("appdetail");
 if(!p){p=document.createElement("div");p.id="appdetail";p.style.cssText="position:fixed;top:0;right:0;width:330px;max-width:92vw;height:100%;background:#fff;border-left:.5px solid rgba(0,0,0,.15);box-shadow:-8px 0 30px rgba(0,0,0,.12);z-index:2000;overflow:auto;padding:18px 18px 50px;font:13px/1.5 -apple-system,BlinkMacSystemFont,sans-serif;color:#1c1c1c";document.body.appendChild(p);}
 p.innerHTML='<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px"><div style="font-size:16px;font-weight:600;color:'+col+'">'+(c.name||"")+'</div><span id="appdx" style="cursor:pointer;color:#999;font-size:18px;line-height:1">✕</span></div>'
 +'<div style="color:#6f6f6f;font-size:12px;margin:3px 0 2px">'+(c.kind||"")+' · '+(c.place||"")+' · '+(c.year||"")+(c.goal?' · Goal '+c.goal:"")+(c.mech?' · '+c.mech:"")+'</div>'
 +'<div style="color:#6f6f6f;font-size:12px">'+(c.person||"")+'</div>'
 +(c.tool?'<div style="font-size:12px;margin-top:6px;font-style:italic;color:#555">'+c.tool+'</div>':"")
 +'<div style="font-size:13px;line-height:1.55;margin-top:10px">'+(c.sig||"")+'</div>'
 +'<div style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#999;margin-top:14px">Threads</div>'+chips(c.threads)
 +'<div style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#999;margin-top:10px">Builds on</div>'+nav(c.bo)
 +'<div style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#999;margin-top:6px">Enables</div>'+nav(c.en)
 +'<a href="'+obsidianURL(id)+'" style="display:inline-block;margin-top:16px;background:'+col+';color:#fff;text-decoration:none;padding:7px 13px;border-radius:9px;font-size:12.5px">Open note in Obsidian ↗</a>';
 p.style.display="block";
 document.getElementById("appdx").onclick=()=>p.style.display="none";
 p.querySelectorAll(".xnav").forEach(el=>el.onclick=()=>{const c2=__byId[decodeURIComponent(el.dataset.id)];if(c2)showDetail(c2);});
};
// URL state
window.getState=function(){const o={};(location.hash||"").replace(/^#/,"").split("&").forEach(kv=>{if(!kv)return;const i=kv.indexOf("=");const k=i<0?kv:kv.slice(0,i);o[k]=i<0?"":decodeURIComponent(kv.slice(i+1));});return o;};
window.setState=function(patch){const o=getState();Object.assign(o,patch);const s=Object.entries(o).filter(e=>e[1]!==""&&e[1]!=null).map(e=>e[0]+"="+encodeURIComponent(e[1])).join("&");try{history.replaceState(null,"",location.pathname+(s?"#"+s:""));}catch(e){try{location.hash=s;}catch(e2){}}buildNav();};
// dynamic nav
const NAVITEMS=[["Home","index.html"],["Globe","map.html"],["Timeline","views/atlas.html"],["Tree","views/tree.html"],["Deck","views/deck.html"],["Table","table.html"],["Dashboard","dashboard.html"]];
function buildNav(){const el=document.getElementById("appnav");if(!el)return;const views=location.pathname.indexOf("/views/")>=0;const cur=location.pathname.split("/").pop()||"index.html";
 el.innerHTML=NAVITEMS.map(([label,file])=>{let h=file;if(views){h=file.indexOf("views/")===0?file.slice(6):"../"+file;}const key=file.split("/").pop();const act=key===cur?"background:#1c1c1c;color:#fff;":"background:#fff;color:#1c1c1c;";return '<a href="'+h+location.hash+'" style="text-decoration:none;padding:2px 9px;border-radius:11px;border:.5px solid rgba(0,0,0,.15);'+act+'font-size:11.5px">'+label+'</a>';}).join("");}
// help overlay
function helpHTML(){const KC=KCOL;const ms=[["Measure","seeing what's there: a microscope, an X-ray, a way to read DNA"],["Model","a way to think about it: an equation or rule that lets you predict without touching the real thing"],["Make","building one working copy: a single transistor, engine, or molecule"],["Manufacture","building a billion of them, cheap and identical, on a factory floor"]];
 return '<div style="background:#fff;max-width:560px;margin:10vh auto;border-radius:14px;padding:24px 26px;font:14px/1.6 -apple-system,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.3);position:relative">'
 +'<span id="helpx" style="position:absolute;top:14px;right:18px;cursor:pointer;color:#999;font-size:20px">✕</span>'
 +'<div style="font-size:18px;font-weight:600;margin-bottom:8px">The four jobs a tool does</div>'
 +'<p style="margin:0 0 12px">Every tool here does one of four jobs, and they fall in order.</p>'
 +ms.map(m=>'<div style="border-left:4px solid '+KC[m[0]]+';padding:4px 10px;margin:6px 0;background:#faf9f6;border-radius:0 8px 8px 0"><b style="color:'+KC[m[0]]+'">'+m[0]+'</b> — '+m[1]+'.</div>').join("")
 +'<p style="margin:12px 0 0;font-weight:600">See it, understand it, build one, build a million.</p>'
 +'<p style="margin:8px 0 0;color:#555">And because ideas are free to copy, the lead that lasts almost always sits at the far end — in the making at scale, where the skill is in the doing and can\'t be written down.</p>'
 +'</div>';}
function mountHelp(){if(document.getElementById("helpbtn"))return;
 const b=document.createElement("div");b.id="helpbtn";b.textContent="?";b.title="What do the four colours mean?";
 b.style.cssText="position:fixed;bottom:14px;right:14px;width:30px;height:30px;border-radius:50%;background:#1c1c1c;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;cursor:pointer;z-index:1500;box-shadow:0 4px 14px rgba(0,0,0,.25)";
 const ov=document.createElement("div");ov.id="helpov";ov.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:3000;display:none";ov.innerHTML=helpHTML();
 document.body.appendChild(b);document.body.appendChild(ov);
 b.onclick=()=>{ov.style.display="block";};
 ov.onclick=e=>{if(e.target===ov||e.target.id==="helpx")ov.style.display="none";};}
window.addEventListener("DOMContentLoaded",()=>{window.rebuildById();buildNav();mountHelp();});
