(function(){
const KC={Measure:"#3266ad",Model:"#8a4fb3",Make:"#b06a1e",Manufacture:"#2f8f6b"};
const D2R=Math.PI/180, YR0=1600,YR1=2025;
const tfrac=y=>Math.max(0,Math.min(1,(y-YR0)/(YR1-YR0)));
const byId=Object.fromEntries(CARDS.map(c=>[c.id,c]));
const maxc=Math.max(1,...COUNTRIES.map(o=>o.c));
// centroid of data for initial view
let cLon=0,cLat=0;(function(){let x=0,y=0,z=0,n=0;for(const c of CARDS){if(c.lat==null)continue;const la=c.lat*D2R,lo=c.lon*D2R;x+=Math.cos(la)*Math.cos(lo);y+=Math.cos(la)*Math.sin(lo);z+=Math.sin(la);n++;}cLon=Math.atan2(y,x)/D2R;cLat=Math.atan2(z,Math.hypot(x,y))/D2R;})();
let rotLon=cLon, rotLat=Math.min(55,cLat+6), scale=0, T=2030, playing=false, timer=null;
const svg=document.getElementById('g'), tip=document.getElementById('tip');
let W=0,H=0,cx=0,cy=0;
function size(){const r=svg.getBoundingClientRect();W=r.width;H=r.height;cx=W/2;cy=H/2;if(!scale)scale=Math.min(W,H)*0.46;}
function proj(lon,lat){const l=(lon-rotLon)*D2R,p=lat*D2R,p0=rotLat*D2R;const cosc=Math.sin(p0)*Math.sin(p)+Math.cos(p0)*Math.cos(p)*Math.cos(l);const x=scale*Math.cos(p)*Math.sin(l);const y=scale*(Math.cos(p0)*Math.sin(p)-Math.sin(p0)*Math.cos(p)*Math.cos(l));return [cx+x,cy-y,cosc];}
function vis(lon,lat){const l=(lon-rotLon)*D2R,p=lat*D2R,p0=rotLat*D2R;return Math.sin(p0)*Math.sin(p)+Math.cos(p0)*Math.cos(p)*Math.cos(l)>=0;}
function ringPath(ring){let pts=[];for(let i=0;i<ring.length;i++){const p=proj(ring[i][0],ring[i][1]);if(p[2]>=0)pts.push(p[0].toFixed(1)+" "+p[1].toFixed(1));}return pts.length<3?null:"M"+pts.join("L")+"Z";}
function gline(co){let d="",pen=false;for(const c of co){const p=proj(c[0],c[1]);if(p[2]>=0){d+=(pen?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1);pen=true;}else pen=false;}return d;}
function render(){
 size();let s="";
 s+=`<circle cx="${cx}" cy="${cy}" r="${scale}" fill="#dbe5ee" stroke="rgba(0,0,0,.22)" stroke-width="1.2"/>`;
 // graticule
 let g="";for(let lon=-180;lon<180;lon+=30){const co=[];for(let lat=-90;lat<=90;lat+=4)co.push([lon,lat]);g+=`<path d="${gline(co)}" fill="none" stroke="rgba(0,0,0,.06)" stroke-width=".6"/>`;}
 for(let lat=-60;lat<=60;lat+=30){const co=[];for(let lon=-180;lon<=180;lon+=4)co.push([lon,lat]);g+=`<path d="${gline(co)}" fill="none" stroke="rgba(0,0,0,.06)" stroke-width=".6"/>`;}
 s+=g;
 // countries
 for(const o of COUNTRIES){const fill=o.c>0?`rgba(176,106,30,${(0.12+0.6*o.c/maxc).toFixed(3)})`:"#e7e3db";for(const ring of o.r){const d=ringPath(ring);if(d)s+=`<path d="${d}" fill="${fill}" stroke="rgba(0,0,0,.14)" stroke-width=".4"/>`;}}
 // arcs
 for(const c of CARDS){if(c.lat==null)continue;for(const en of (c.en||[])){const b=byId[en];if(!b||b.lat==null||b.year>T)continue;if(Math.abs(c.lat-b.lat)<0.2&&Math.abs(c.lon-b.lon)<0.2)continue;if(!vis(c.lon,c.lat)||!vis(b.lon,b.lat))continue;const A=proj(c.lon,c.lat),B=proj(b.lon,b.lat);const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-Math.hypot(B[0]-A[0],B[1]-A[1])*0.18;s+=`<path d="M${A[0].toFixed(1)} ${A[1].toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${B[0].toFixed(1)} ${B[1].toFixed(1)}" fill="none" stroke="${KC[b.kind]}" stroke-opacity="${(0.1+0.3*tfrac(b.year)).toFixed(2)}" stroke-width="1"/>`;}}
 // dots
 const rsc=Math.max(.6,Math.min(3,scale/(Math.min(W,H)*0.46)));
 for(const c of CARDS){if(c.lat==null||c.year>T)continue;const p=proj(c.lon,c.lat);if(p[2]<0)continue;const r=(3+Math.min(4,(c.en?c.en.length:0)*0.8))*rsc;s+=`<circle class="dot" data-id="${encodeURIComponent(c.id)}" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${r.toFixed(1)}" fill="${KC[c.kind]}" fill-opacity="${(0.3+0.65*tfrac(c.year)).toFixed(2)}" stroke="#fff" stroke-width=".8"/>`;}
 // hub labels (top cities by count)
 for(const h of HUBS){if(!vis(h.lon,h.lat))continue;const p=proj(h.lon,h.lat);s+=`<text x="${p[0].toFixed(1)}" y="${(p[1]-9).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="600" fill="#1c1c1c" style="paint-order:stroke;stroke:#f5f3ef;stroke-width:2.6px">${h.city}</text>`;}
 svg.innerHTML=s;
 svg.querySelectorAll('.dot').forEach(el=>{el.style.cursor='pointer';el.onmousemove=e=>showTip(decodeURIComponent(el.dataset.id),e);el.onmouseleave=()=>tip.style.display='none';});
 document.getElementById('hint').textContent=`${CARDS.filter(c=>c.lat!=null&&c.year<=T).length} of ${CARDS.length} tools through ${T}`;
}
// hubs
const hg={};CARDS.forEach(c=>{if(c.lat==null)return;const k=c.lat.toFixed(1)+","+c.lon.toFixed(1);(hg[k]=hg[k]||[]).push(c);});
const HUBS=Object.values(hg).map(g=>({n:g.length,city:(g[0].place||'').split(',')[0],lat:g[0].lat,lon:g[0].lon})).filter(h=>h.n>=3).sort((a,b)=>b.n-a.n).slice(0,12);
function showTip(id,e){const c=byId[id];tip.style.borderLeftColor=KC[c.kind];tip.innerHTML=`<div class="t" style="color:${KC[c.kind]}">${c.name}</div><div class="m">${c.kind} · ${c.place} · ${c.year}</div><div class="s">${c.sig||''}</div>`;tip.style.display='block';tip.style.left=Math.min(e.clientX+14,window.innerWidth-270)+'px';tip.style.top=(e.clientY+14)+'px';}
// interaction
let dn=false,lx,ly;
svg.addEventListener('mousedown',e=>{if(e.target.classList.contains('dot'))return;dn=true;lx=e.clientX;ly=e.clientY;svg.classList.add('drag');e.preventDefault();});
window.addEventListener('mousemove',e=>{if(!dn)return;const k=0.25*(300/scale);rotLon-=(e.clientX-lx)*k;rotLat+=(e.clientY-ly)*k;rotLat=Math.max(-90,Math.min(90,rotLat));lx=e.clientX;ly=e.clientY;render();});
window.addEventListener('mouseup',()=>{dn=false;svg.classList.remove('drag');});
svg.addEventListener('wheel',e=>{e.preventDefault();scale*=(e.deltaY<0?1.15:0.87);scale=Math.max(80,Math.min(6000,scale));render();},{passive:false});
const yr=document.getElementById('yr'),ylab=document.getElementById('ylab');
yr.oninput=e=>{stop();T=+e.target.value;ylab.textContent=T;render();};
function stop(){playing=false;clearInterval(timer);const b=document.getElementById('play');b.textContent='▶ play';b.classList.remove('on');}
document.getElementById('play').onclick=function(){if(playing){stop();return;}playing=true;this.textContent='❚❚ pause';this.classList.add('on');if(T>=2030)T=1600;timer=setInterval(()=>{if(T>=2030){stop();return;}T=Math.min(2030,T+4);yr.value=T;ylab.textContent=T;render();},90);};
document.getElementById('reset').onclick=()=>{rotLon=cLon;rotLat=Math.min(55,cLat+6);scale=Math.min(W,H)*0.46;render();};
window.addEventListener('resize',render);
render();
})();
