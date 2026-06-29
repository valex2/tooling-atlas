(function(){
const KC=window.KCOL, KINK=window.KINK, KGLY=window.KGLY;   // single source of truth (shared.js)
const KINDS=["Measure","Model","Make","Manufacture"];
const COLS=[["name","Tool"],["kind","Kind"],["year","Year"],["place","Place"],["threads","Threads"],["links","Links"],["sig","Significance"]];
let q="",kind=null,selT=[],goal="",mech="",decade="",sortK="year",sortDir=1;
try{const st=getState();if(st.kind)kind=st.kind;selT=getThreads();if(st.q)q=st.q;if(st.goal)goal=st.goal;if(st.mech)mech=st.mech;if(st.decade)decade=st.decade;}catch(e){}
const allThreads=[...new Set(CARDS.flatMap(c=>c.threads))].sort();
document.getElementById("thread").innerHTML='<option value="">all threads</option>'+allThreads.map(t=>`<option>${t}</option>`).join("");
document.getElementById("kinds").innerHTML=KINDS.map(k=>`<button class="chip" data-k="${k}" style="border-color:${KC[k]}">${k}</button>`).join("");
function headRow(){document.getElementById("head").innerHTML=COLS.map(c=>`<th data-k="${c[0]}">${c[1]}${sortK===c[0]?(sortDir>0?" ▲":" ▼"):""}</th>`).join("");
 document.querySelectorAll("#head th").forEach(th=>th.onclick=()=>{const k=th.dataset.k;if(sortK===k)sortDir*=-1;else{sortK=k;sortDir=1;}render();});}
function val(c,k){return k==="links"?(c.bo.length+c.en.length):k==="threads"?c.threads.join(", "):c[k];}
function rows(){
 let r=CARDS.filter(c=>{
  if(kind&&c.kind!==kind)return false;
  if(selT.length&&!threadMatch(c,selT))return false;
  if(goal&&c.goal!==goal)return false;
  if(mech&&c.mech!==mech)return false;
  if(decade&&Math.floor(c.year/10)*10!==+decade)return false;
  if(q){const hay=(c.name+" "+(c.person||"")+" "+(c.place||"")+" "+c.threads.join(" ")+" "+(c.sig||"")).toLowerCase();if(!hay.includes(q))return false;}
  return true;});
 r.sort((a,b)=>{let x=val(a,sortK),y=val(b,sortK);if(typeof x==="string")x=x.toLowerCase(),y=(""+y).toLowerCase();return x<y?-sortDir:x>y?sortDir:0;});
 return r;
}
function render(){
 headRow();
 const r=rows();
 document.getElementById("body").innerHTML=r.map(c=>`<tr>
  <td><b>${c.name}</b><div class="thr">${c.person||""}</div></td>
  <td><span class="kpill" style="background:${KC[c.kind]}1f;color:${KINK[c.kind]}"><span aria-hidden="true">${KGLY[c.kind]}</span> ${c.kind}</span></td>
  <td>${c.year}</td><td>${c.place||""}</td>
  <td class="thr">${c.threads.join(", ")}</td>
  <td title="builds on ${c.bo.length}, enables ${c.en.length}">${c.bo.length}→${c.en.length}</td>
  <td class="sig">${c.sig||""}</td></tr>`).join("");
 document.getElementById("count").innerHTML=`${r.length} of ${CARDS.length} tools`+selT.map(t=>` · <span class="tpill" data-t="${encodeURIComponent(t)}" style="cursor:pointer;color:#33302b">${t} ✕</span>`).join("")+(decade?` · <span style="cursor:pointer;color:#33302b" id="cdec">${decade}s ✕</span>`:"");
 const cd=document.getElementById("cdec");if(cd)cd.onclick=()=>{decade="";render();};
 document.querySelectorAll('#count .tpill').forEach(el=>el.onclick=()=>{const t=decodeURIComponent(el.dataset.t);selT=selT.filter(x=>x!==t);render();});
 document.querySelectorAll('#body tr').forEach((tr,ix)=>{tr.style.cursor='pointer';tr.onclick=()=>showDetail(r[ix]);});
 try{setState({kind:kind||'',thread:selT.join(','),q:q||'',goal:goal||'',mech:mech||'',decade:decade||''});}catch(e){}
 document.querySelectorAll("#kinds .chip").forEach(b=>b.classList.toggle("on",b.dataset.k===kind));
}
document.getElementById("q").oninput=e=>{q=e.target.value.toLowerCase();render();};
document.getElementById("thread").onchange=e=>{const v=e.target.value;if(v&&!selT.includes(v))selT.push(v);e.target.value="";render();};
document.getElementById("goal").onchange=e=>{goal=e.target.value;render();};
document.getElementById("mech").onchange=e=>{mech=e.target.value;render();};
document.querySelectorAll("#kinds .chip").forEach(b=>b.onclick=()=>{kind=kind===b.dataset.k?null:b.dataset.k;render();});
document.getElementById("reset").onclick=()=>{q="";kind=null;selT=[];goal="";mech="";decade="";document.getElementById("q").value="";document.getElementById("thread").value="";document.getElementById("goal").value="";document.getElementById("mech").value="";render();};
try{if(q){document.getElementById('q').value=q;}if(goal)document.getElementById('goal').value=goal;if(mech)document.getElementById('mech').value=mech;}catch(e){}
render();
})();
