window.VAULT="Obsidian Vault";
window.obsidianURL=function(id){return "obsidian://open?vault="+encodeURIComponent(VAULT)+"&file="+encodeURIComponent("Tooling Card - "+id);};
window.__byId=(window.CARDS?Object.fromEntries(CARDS.map(c=>[c.id,c])):{});
window.showDetail=function(c){
 if(typeof c==="string")c=__byId[c]||{name:c};
 const KC={Measure:"#3266ad",Model:"#8a4fb3",Make:"#b06a1e",Manufacture:"#2f8f6b"};
 const col=KC[c.kind]||"#999", id=c.id||(c.name||"").replace(/\//g,"-");
 const lst=a=>(a&&a.length)?a.map(x=>'<span style="display:inline-block;background:#f0ede7;border-radius:8px;padding:1px 7px;margin:2px 3px 0 0;font-size:11px">'+x+'</span>').join(""):"<span style='color:#bbb'>—</span>";
 let p=document.getElementById("appdetail");
 if(!p){p=document.createElement("div");p.id="appdetail";p.style.cssText="position:fixed;top:0;right:0;width:330px;max-width:92vw;height:100%;background:#fff;border-left:.5px solid rgba(0,0,0,.15);box-shadow:-8px 0 30px rgba(0,0,0,.12);z-index:2000;overflow:auto;padding:18px 18px 50px;font:13px/1.5 -apple-system,BlinkMacSystemFont,sans-serif;color:#1c1c1c";document.body.appendChild(p);}
 p.innerHTML='<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px"><div style="font-size:16px;font-weight:600;color:'+col+'">'+(c.name||"")+'</div><span id="appdx" style="cursor:pointer;color:#999;font-size:18px;line-height:1">✕</span></div>'
 +'<div style="color:#6f6f6f;font-size:12px;margin:3px 0 2px">'+(c.kind||"")+' · '+(c.place||"")+' · '+(c.year||"")+'</div>'
 +'<div style="color:#6f6f6f;font-size:12px">'+(c.person||"")+'</div>'
 +(c.tool?'<div style="font-size:12px;margin-top:6px;font-style:italic;color:#555">'+c.tool+'</div>':"")
 +'<div style="font-size:13px;line-height:1.55;margin-top:10px">'+(c.sig||"")+'</div>'
 +'<div style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#999;margin-top:14px">Threads</div>'+lst(c.threads)
 +'<div style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#999;margin-top:10px">Builds on</div>'+lst(c.bo)
 +'<div style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#999;margin-top:6px">Enables</div>'+lst(c.en)
 +'<a href="'+obsidianURL(id)+'" style="display:inline-block;margin-top:16px;background:'+col+';color:#fff;text-decoration:none;padding:7px 13px;border-radius:9px;font-size:12.5px">Open note in Obsidian ↗</a>';
 p.style.display="block";
 document.getElementById("appdx").onclick=()=>p.style.display="none";
};
window.getState=function(){const o={};(location.hash||"").replace(/^#/,"").split("&").forEach(kv=>{if(!kv)return;const i=kv.indexOf("=");const k=i<0?kv:kv.slice(0,i);o[k]=i<0?"":decodeURIComponent(kv.slice(i+1));});return o;};
window.setState=function(patch){const o=getState();Object.assign(o,patch);const s=Object.entries(o).filter(e=>e[1]!==""&&e[1]!=null).map(e=>e[0]+"="+encodeURIComponent(e[1])).join("&");history.replaceState(null,"",location.pathname+(s?"#"+s:""));navHash();};
function navHash(){document.querySelectorAll("#appnav a").forEach(a=>{const b=a.getAttribute("href").split("#")[0];a.setAttribute("href",b+location.hash);});}
window.addEventListener("DOMContentLoaded",navHash);
