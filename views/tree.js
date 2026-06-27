(function(){
const KC={Measure:"#3266ad",Model:"#8a4fb3",Make:"#b06a1e",Manufacture:"#2f8f6b"};
const byId=Object.fromEntries(CARDS.map(c=>[c.id,c]));
const ERAS=[["Medieval / Renaissance",1400,1600],["Scientific Revolution",1600,1687],["Enlightenment",1687,1760],["Industrial Revolution",1760,1840],["2nd Industrial Rev.",1840,1914],["World War I",1914,1918],["Interwar",1918,1939],["World War II",1939,1945],["Cold War",1945,1991],["Information Age",1991,2008],["AI Age",2008,2031]];
const EVENTS=[[1769,"Watt steam engine"],[1776,"American Revolution"],[1957,"Sputnik"],[1969,"Moon landing"],[1971,"Microprocessor"],[1989,"World Wide Web"],[2003,"Iraq War"],[2007,"iPhone"],[2012,"Deep learning"],[2020,"COVID-19"]];
const minY=1400,maxY=2030,x0=170,PPY=5.2,W=118,H=34;
const xs=y=>x0+(Math.max(minY,Math.min(maxY,y))-minY)*PPY;
// auto lanes by primary thread, ordered by earliest member
const prim=c=>(c.threads&&c.threads.length?c.threads[0]:"—");
const tmin={};CARDS.forEach(c=>{const t=prim(c);tmin[t]=Math.min(tmin[t]??9999,c.year||9999);});
const lanes=[...new Set(CARDS.map(prim))].sort((a,b)=>(tmin[a]-tmin[b]));
let sel=null,q="",pos={},layoutH=0,layoutW=0;try{const st=getState();if(st.q)q=st.q;}catch(e){}
const scroll=document.getElementById("scroll"),stage=document.getElementById("stage"),svg=document.getElementById("edges"),tip=document.getElementById("tip");
function layout(){pos={};let curY=40;const LM={},items={};lanes.forEach(l=>items[l]=[]);
 CARDS.forEach(c=>items[prim(c)].push(c));
 const meta=[];
 for(const l of lanes){const arr=items[l].sort((a,b)=>a.year-b.year);const rr=[];
  for(const c of arr){const x=xs(c.year);let r=-1;for(let i=0;i<rr.length;i++)if(x-rr[i]>=10){r=i;break;}if(r<0){r=rr.length;rr.push(0);}rr[r]=x+W;c._r=r;c._x=x;}
  const nr=Math.max(1,rr.length);for(const c of arr){c._y=curY+c._r*(H+10);pos[c.id]={x:c._x,y:c._y};}
  LM[l]=curY+(nr*(H+10)-10)/2;meta.push([l,LM[l],curY,curY+nr*(H+10)]);curY+=nr*(H+10)+18;}
 layoutH=curY+10;layoutW=xs(maxY)+W+20;return meta;}
function anc(id,s){for(const p of (byId[id].bo||[]))if(byId[p]&&!s.has(p)){s.add(p);anc(p,s);}return s;}
function desc(id,s){for(const e of (byId[id].en||[]))if(byId[e]&&!s.has(e)){s.add(e);desc(e,s);}return s;}
function pinLabels(){document.querySelectorAll('#stage .lanelab').forEach(e=>{if(e.dataset.bl==null)e.dataset.bl=parseFloat(e.style.left)||0;e.style.left=((+e.dataset.bl)+scroll.scrollLeft)+'px';});}
function render(){const meta=layout();
 stage.style.width=layoutW+"px";stage.style.height=layoutH+"px";
 svg.setAttribute("width",layoutW);svg.setAttribute("height",layoutH);svg.setAttribute("viewBox","0 0 "+layoutW+" "+layoutH);
 let lit=null;if(sel){lit=new Set([sel]);anc(sel,lit);desc(sel,lit);}
 let h="";
 meta.forEach((m,i)=>{if(i%2)h+=`<div style="position:absolute;left:0;top:${m[2]}px;width:${layoutW}px;height:${m[3]-m[2]}px;background:rgba(0,0,0,.03);z-index:0"></div>`;});
 ERAS.forEach((e,i)=>{const a=xs(e[1]),b=xs(e[2]);h+=`<div style="position:absolute;left:${a}px;top:0;height:${layoutH}px;border-left:1px solid rgba(0,0,0,.08);z-index:0"></div><div style="position:absolute;left:${(a+b)/2}px;top:2px;transform:translateX(-50%);font-size:9px;font-weight:600;color:rgba(0,0,0,.32);z-index:4;white-space:nowrap;background:rgba(252,251,249,.85);padding:0 3px">${e[0]}</div>`;});
 EVENTS.forEach((ev,i)=>{const x=xs(ev[0]);h+=`<div style="position:absolute;left:${x}px;top:16px;height:${layoutH-16}px;border-left:1px solid rgba(154,106,58,.35);z-index:0"></div><div style="position:absolute;left:${x}px;top:16px;width:6px;height:6px;border-radius:50%;background:#9a6a3a;transform:translate(-3px,-3px);z-index:4"></div><div style="position:absolute;left:${x+3}px;top:${i%2?16:27}px;font-size:8px;color:#7a5a30;background:rgba(252,251,249,.85);padding:0 2px;z-index:4;white-space:nowrap">${ev[1]}</div>`;});
 for(let y=1400;y<=2030;y+=10){const gx=xs(y),mj=y%50===0;h+=`<div class="gl ${mj?'maj':''}" style="left:${gx}px;top:24px;height:${layoutH-30}px"></div>`;if(mj)h+=`<div class="yr" style="left:${gx+2}px;color:#999;font-weight:600">${y}</div>`;}
 for(const m of meta)h+=`<div class="lanelab" style="top:${m[1]}px">${m[0]}</div>`;
 for(const c of CARDS){const dimd=lit&&!lit.has(c.id);const hl=(lit&&lit.has(c.id)&&c.id!==sel)||(q&&(c.name.toLowerCase().includes(q)));
  h+=`<div class="c${dimd?' dim':''}${c.id===sel?' sel':''}${hl?' hl':''}" data-id="${encodeURIComponent(c.id)}" style="left:${c._x}px;top:${c._y}px;border-left-color:${KC[c.kind]}"><div class="ti" style="color:${KC[c.kind]}">${c.name}</div><div class="yt">${c.kind} · ${c.year}</div></div>`;}
 [...stage.querySelectorAll('.c,.lanelab,.gl,.yr,div[style*="z-index:0"]')].forEach(e=>e.remove());
 stage.insertAdjacentHTML("beforeend",h);
 let e="";for(const c of CARDS){const a=pos[c.id];if(!a)continue;for(const en of (c.en||[])){const b=pos[en];if(!b)continue;const on=lit?(lit.has(c.id)&&lit.has(en)):true;const op=lit?(on?.9:.05):.25;const x1=a.x+W,y1=a.y+H/2,x2=b.x,y2=b.y+H/2,mx=(x1+x2)/2;e+=`<path d="M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}" fill="none" stroke="${KC[byId[en].kind]}" stroke-opacity="${op}" stroke-width="${(lit&&on)?2:1}"/>`;}}
 svg.innerHTML=e;
 stage.querySelectorAll('.c').forEach(el=>{const id=decodeURIComponent(el.dataset.id);el.onclick=()=>{sel=sel===id?null:id;try{showDetail(byId[id]);}catch(e){}render();};el.onmousemove=ev=>showTip(id,ev);el.onmouseleave=()=>tip.style.display='none';});
 document.getElementById("hint")&&(document.getElementById("hint").textContent="");
 pinLabels();
}
function showTip(id,e){const c=byId[id];tip.style.borderLeftColor=KC[c.kind];tip.innerHTML=`<div class="t" style="color:${KC[c.kind]}">${c.name}</div><div class="m">${c.kind} · ${c.place} · ${c.year}</div><div class="s">${c.sig||''}</div>`;tip.style.display='block';tip.style.left=Math.min(e.clientX+14,window.innerWidth-270)+'px';tip.style.top=(e.clientY+14)+'px';}
document.getElementById("q").oninput=e=>{q=e.target.value.toLowerCase();try{setState({q:q});}catch(e){}render();};
try{if(q)document.getElementById("q").value=q;}catch(e){}
document.getElementById("reset").onclick=()=>{sel=null;q="";document.getElementById("q").value="";render();};
scroll.addEventListener('scroll',pinLabels);render();
})();
