(function(){
const KC={Measure:"#3266ad",Model:"#8a4fb3",Make:"#b06a1e",Manufacture:"#2f8f6b"};
const D2R=Math.PI/180, YR0=1600,YR1=2025;
const tfrac=y=>Math.max(0,Math.min(1,(y-YR0)/(YR1-YR0)));
const byId=Object.fromEntries(CARDS.map(c=>[c.id,c]));
const YS=CARDS.map(c=>c.year).filter(y=>y).sort((a,b)=>a-b);
function qYear(frac){const i=Math.min(YS.length-1,Math.max(0,Math.round(frac*(YS.length-1))));return YS[i];}
const maxc=Math.max(1,...COUNTRIES.map(o=>o.c));
// centroid of data for initial view
let cLon=0,cLat=0;(function(){let x=0,y=0,z=0,n=0;for(const c of CARDS){if(c.lat==null)continue;const la=c.lat*D2R,lo=c.lon*D2R;x+=Math.cos(la)*Math.cos(lo);y+=Math.cos(la)*Math.sin(lo);z+=Math.sin(la);n++;}cLon=Math.atan2(y,x)/D2R;cLat=Math.atan2(z,Math.hypot(x,y))/D2R;})();
let rotLon=cLon, rotLat=Math.min(55,cLat+6), scale=0, T=0, playing=false, timer=null, foundId=null;
let selThread="";try{const st=getState();if(st.thread)selThread=st.thread;}catch(e){}
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
 COUNTRIES.forEach((o,ci)=>{const fill=o.c>0?`rgba(176,106,30,${(0.12+0.6*o.c/maxc).toFixed(3)})`:"#e7e3db";for(const ring of o.r){const d=ringPath(ring);if(d)s+=`<path class="cty" data-ci="${ci}" d="${d}" fill="${fill}" stroke="rgba(0,0,0,.14)" stroke-width=".4"/>`;}});
 // arcs
 for(const c of CARDS){if(c.lat==null)continue;for(const en of (c.en||[])){const b=byId[en];if(!b||b.lat==null||b.year>T)continue;if(Math.abs(c.lat-b.lat)<0.2&&Math.abs(c.lon-b.lon)<0.2)continue;if(!vis(c.lon,c.lat)||!vis(b.lon,b.lat))continue;if(selThread&&(!c.threads.includes(selThread)||!b.threads.includes(selThread)))continue;const A=proj(c.lon,c.lat),B=proj(b.lon,b.lat);const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-Math.hypot(B[0]-A[0],B[1]-A[1])*0.18;s+=`<path d="M${A[0].toFixed(1)} ${A[1].toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${B[0].toFixed(1)} ${B[1].toFixed(1)}" fill="none" stroke="${KC[b.kind]}" stroke-opacity="${(0.1+0.3*tfrac(b.year)).toFixed(2)}" stroke-width="1"/>`;}}
 // dots
 const rsc=Math.max(.6,Math.min(3,scale/(Math.min(W,H)*0.46)));
 for(const c of CARDS){if(c.lat==null)continue;const fnd=c.id===foundId;if(c.year>T&&!fnd)continue;const p=proj(c.lon,c.lat);if(p[2]<0)continue;const r=(3+Math.min(4,(c.en?c.en.length:0)*0.8))*rsc*(fnd?1.6:1);const off=selThread&&!c.threads.includes(selThread);const fo=fnd?1:(off?0.07:(0.3+0.65*tfrac(c.year)));s+=`<circle class="dot" data-id="${encodeURIComponent(c.id)}" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${r.toFixed(1)}" fill="${KC[c.kind]}" fill-opacity="${fo}" stroke="${fnd?'#111':'#fff'}" stroke-width="${fnd?'2.2':'.8'}"/>`;}
 // hub labels (top cities by count)
 for(const h of HUBS){if(!vis(h.lon,h.lat))continue;const p=proj(h.lon,h.lat);s+=`<text x="${p[0].toFixed(1)}" y="${(p[1]-9).toFixed(1)}" text-anchor="middle" font-size="7.5" font-weight="600" fill="#333" style="paint-order:stroke;stroke:#f5f3ef;stroke-width:2px">${h.city}</text>`;}
 svg.innerHTML=s;
 svg.querySelectorAll('.dot').forEach(el=>{el.style.cursor='pointer';el.onmousemove=e=>showTip(decodeURIComponent(el.dataset.id),e);el.onmouseleave=()=>tip.style.display='none';el.onclick=()=>{try{showDetail(byId[decodeURIComponent(el.dataset.id)]);}catch(e){}};});
 svg.querySelectorAll('.cty').forEach(el=>{el.style.cursor='pointer';el.onclick=()=>{if(!moved)showCountry(+el.dataset.ci);};});
 document.getElementById('hint').textContent=`${CARDS.filter(c=>c.lat!=null&&c.year<=T).length} of ${CARDS.length} tools through ${T}`;
 renderChips();
}
// hubs
const hg={};CARDS.forEach(c=>{if(c.lat==null)return;const k=c.lat.toFixed(1)+","+c.lon.toFixed(1);(hg[k]=hg[k]||[]).push(c);});
const HUBS=Object.values(hg).map(g=>({n:g.length,city:(g[0].place||'').split(',')[0],lat:g[0].lat,lon:g[0].lon})).filter(h=>h.n>=3).sort((a,b)=>b.n-a.n).slice(0,12);
const PANELCSS="position:fixed;top:0;right:0;width:330px;max-width:92vw;height:100%;background:#fff;border-left:.5px solid rgba(0,0,0,.15);box-shadow:-8px 0 30px rgba(0,0,0,.12);z-index:2000;overflow:auto;padding:18px 18px 50px;font:13px/1.5 -apple-system,BlinkMacSystemFont,sans-serif;color:#1c1c1c";
function countryChart(inC){const w=294,h=112,x0=6,x1=w-6,y0=10,yb=h-15,mn=1600,mx=2030;const sx=y=>x0+(Math.max(mn,Math.min(mx,y))-mn)/(mx-mn)*(x1-x0);
 function cum(cards,norm){if(!cards.length)return"";const ys=cards.map(c=>c.year).filter(Boolean).sort((a,b)=>a-b);let d="M"+x0+" "+yb;let n=0;for(const y of ys){n++;d+=" L"+sx(y).toFixed(1)+" "+yb+" L"+sx(y).toFixed(1)+" "+(yb-(n/norm)*(yb-y0)).toFixed(1);}d+=" L"+x1+" "+(yb-(n/norm)*(yb-y0)).toFixed(1);return d;}
 const wTot=CARDS.filter(c=>c.year).length,cTot=inC.length||1;
 let s='<svg width="'+w+'" height="'+h+'" style="display:block;margin:10px 0">';
 for(let y=1700;y<=2000;y+=100){const x=sx(y);s+='<line x1="'+x+'" y1="'+y0+'" x2="'+x+'" y2="'+yb+'" stroke="#eee"/><text x="'+x+'" y="'+(h-3)+'" font-size="8" fill="#bbb" text-anchor="middle">'+y+'</text>';}
 s+='<path d="'+cum(CARDS.filter(c=>c.year),wTot)+'" fill="none" stroke="#bbb" stroke-width="1" stroke-dasharray="3 3" opacity=".75"/>';
 s+='<path d="'+cum(inC,cTot)+'" fill="none" stroke="#7a5a30" stroke-width="1.5"/>';
 const by={};inC.forEach(c=>{(by[c.year]=by[c.year]||[]).push(c);});
 Object.values(by).forEach(g=>g.sort((a,b)=>a.kind<b.kind?-1:1).forEach((c,i)=>{const x=sx(c.year),yy=yb-5-i*7;s+='<circle class="cdot" data-id="'+encodeURIComponent(c.id)+'" cx="'+x.toFixed(1)+'" cy="'+yy+'" r="3.4" fill="'+KC[c.kind]+'" fill-opacity=".92" stroke="#fff" stroke-width=".6" style="cursor:pointer"><title>'+c.name+' ('+c.year+')</title></circle>';}));
 s+='<line x1="'+x0+'" y1="'+yb+'" x2="'+x1+'" y2="'+yb+'" stroke="#ccc"/><text x="'+x0+'" y="'+(y0+2)+'" font-size="7.5" fill="#9a6a3a">cumulative — dashed = world shape</text></svg>';return s;}
function showCountry(ci){const o=COUNTRIES[ci];if(!o)return;const name=o.n||"(area)";const inC=CARDS.filter(c=>c.country===name).sort((a,b)=>a.year-b.year);
 let p=document.getElementById('appdetail');if(!p){p=document.createElement('div');p.id='appdetail';p.style.cssText=PANELCSS;document.body.appendChild(p);}
 const bk={};inC.forEach(c=>bk[c.kind]=(bk[c.kind]||0)+1);
 const bars=["Measure","Model","Make","Manufacture"].filter(k=>bk[k]).map(k=>'<span style="display:inline-block;background:'+KC[k]+'22;color:'+KC[k]+';border-radius:8px;padding:1px 7px;margin:2px 3px 0 0;font-size:11px">'+k+' '+bk[k]+'</span>').join("");
 const list=inC.map(c=>'<div class="ctool" data-id="'+encodeURIComponent(c.id)+'" style="cursor:pointer;padding:3px 0;border-bottom:.5px solid #eee;font-size:12px"><span style="color:'+KC[c.kind]+'">●</span> '+c.name+' <span style="color:#aaa">'+c.year+'</span></div>').join("")||"<div style='color:#bbb'>No tools recorded here.</div>";
 p.innerHTML='<div style="display:flex;justify-content:space-between"><div style="font-size:16px;font-weight:600">'+name+'</div><span id="appdx" style="cursor:pointer;color:#999;font-size:18px">✕</span></div><div style="color:#6f6f6f;font-size:12px;margin:2px 0 8px">'+inC.length+' tool'+(inC.length!=1?'s':'')+'</div>'+bars+countryChart(inC)+'<div style="margin-top:6px">'+list+'</div>';
 p.style.display='block';document.getElementById('appdx').onclick=()=>p.style.display='none';
 p.querySelectorAll('.ctool').forEach(el=>el.onclick=()=>{try{showDetail(byId[decodeURIComponent(el.dataset.id)]);}catch(e){}});
 p.querySelectorAll('.cdot').forEach(el=>el.onclick=()=>{try{showDetail(byId[decodeURIComponent(el.dataset.id)]);}catch(e){}});}
function renderChips(){const el=document.getElementById('chips');if(!el)return;const list=CARDS.filter(c=>c.year<=T);
 let html='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><div style="font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:#888">Innovations through '+T+' ('+list.length+')</div><span id="chipstog" style="cursor:pointer;color:#888;font-size:13px">'+(chipsOpen?'▾':'▸')+'</span></div>';
 if(chipsOpen){for(let i=ERAS.length-1;i>=0;i--){const nm=ERAS[i][0],a=ERAS[i][1],b=ERAS[i][2];const grp=list.filter(c=>c.year>=a&&c.year<b).sort((x,y)=>y.year-x.year);if(!grp.length)continue;html+='<div style="font-size:9.5px;font-weight:600;color:#9a6a3a;margin:9px 0 2px;border-bottom:.5px solid #eee">'+nm+'</div>'+grp.map(c=>'<div class="chip2" data-id="'+encodeURIComponent(c.id)+'" style="cursor:pointer;display:flex;gap:6px;align-items:baseline;padding:2px 4px;border-radius:6px"><span style="color:#aaa;font-size:10px;min-width:30px">'+c.year+'</span><span style="color:'+KC[c.kind]+';font-size:7px">●</span><span style="font-size:11.5px">'+c.name+'</span></div>').join("");}}
 el.innerHTML=html;const tg=document.getElementById('chipstog');if(tg)tg.onclick=()=>{chipsOpen=!chipsOpen;renderChips();};
 el.querySelectorAll('.chip2').forEach(d=>{d.onmouseenter=()=>d.style.background='#efece6';d.onmouseleave=()=>d.style.background='';d.onclick=()=>{const c=byId[decodeURIComponent(d.dataset.id)];if(!c)return;foundId=c.id;rotLon=c.lon;rotLat=Math.max(-80,Math.min(80,c.lat));render();try{showDetail(c);}catch(e){}};});}
function showTip(id,e){const c=byId[id];tip.style.borderLeftColor=KC[c.kind];tip.innerHTML=`<div class="t" style="color:${KC[c.kind]}">${c.name}</div><div class="m">${c.kind} · ${c.place} · ${c.year}</div><div class="s">${c.sig||''}</div>`;tip.style.display='block';tip.style.left=Math.min(e.clientX+14,window.innerWidth-270)+'px';tip.style.top=(e.clientY+14)+'px';}
// interaction
let dn=false,lx,ly,moved=false,chipsOpen=true;
const ERAS=[['Medieval / Renaissance',1400,1600],['Scientific Revolution',1600,1687],['Enlightenment',1687,1760],['Industrial Revolution',1760,1840],['2nd Industrial Rev.',1840,1914],['World War I',1914,1918],['Interwar',1918,1939],['World War II',1939,1945],['Cold War',1945,1991],['Information Age',1991,2008],['AI Age',2008,2031]];
svg.addEventListener('mousedown',e=>{if(e.target.classList.contains('dot'))return;dn=true;moved=false;lx=e.clientX;ly=e.clientY;svg.classList.add('drag');e.preventDefault();});
window.addEventListener('mousemove',e=>{if(!dn)return;moved=true;const k=0.25*(300/scale);rotLon-=(e.clientX-lx)*k;rotLat+=(e.clientY-ly)*k;rotLat=Math.max(-90,Math.min(90,rotLat));lx=e.clientX;ly=e.clientY;render();});
window.addEventListener('mouseup',()=>{dn=false;svg.classList.remove('drag');});
svg.addEventListener('wheel',e=>{e.preventDefault();scale*=(e.deltaY<0?1.15:0.87);scale=Math.max(80,Math.min(6000,scale));render();},{passive:false});
const yr=document.getElementById('yr'),ylab=document.getElementById('ylab');
yr.oninput=e=>{stop();T=qYear(+e.target.value/1000);ylab.textContent=T;render();};
function stop(){playing=false;clearInterval(timer);const b=document.getElementById('play');b.textContent='▶ play';b.classList.remove('on');}
document.getElementById('play').onclick=function(){if(playing){stop();return;}playing=true;this.textContent='❚❚ pause';this.classList.add('on');let v=(+yr.value>=1000)?0:+yr.value;timer=setInterval(()=>{v+=14;if(v>=1000){v=1000;T=qYear(1);yr.value=1000;ylab.textContent=T;render();stop();return;}T=qYear(v/1000);yr.value=v;ylab.textContent=T;render();},90);};
document.getElementById('reset').onclick=()=>{rotLon=cLon;rotLat=Math.min(55,cLat+6);scale=Math.min(W,H)*0.46;render();};
document.getElementById('msearch').oninput=e=>{const q=e.target.value.toLowerCase();if(!q){foundId=null;
let selThread="";try{const st=getState();if(st.thread)selThread=st.thread;}catch(e){}render();return;}const c=CARDS.find(c=>c.lat!=null&&c.name.toLowerCase().includes(q));if(c){foundId=c.id;rotLon=c.lon;rotLat=Math.max(-80,Math.min(80,c.lat));if(scale<320)scale=420;render();}};
(function(){const sel=document.getElementById('mthread');if(!sel)return;const ths=[...new Set(CARDS.flatMap(c=>c.threads))].sort();sel.innerHTML='<option value="">all threads</option>'+ths.map(t=>`<option>${t}</option>`).join('');sel.onchange=e=>{selThread=e.target.value;try{setState({thread:selThread});}catch(e){}render();};
 try{if(selThread)sel.value=selThread;}catch(e){}})();
window.addEventListener('resize',render);
T=qYear(1);document.getElementById('ylab').textContent=T;render();
})();
