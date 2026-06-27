(function(){
const KC={Measure:"#3266ad",Model:"#8a4fb3",Make:"#b06a1e",Manufacture:"#2f8f6b"};
const KINDS=["Measure","Model","Make","Manufacture"];
const COLS=[["name","Tool"],["kind","Kind"],["year","Year"],["place","Place"],["threads","Threads"],["links","Links"],["sig","Significance"]];
let q="",kind=null,thread="",sortK="year",sortDir=1;
try{const st=getState();if(st.kind)kind=st.kind;if(st.thread)thread=st.thread;if(st.q)q=st.q;}catch(e){}
const allThreads=[...new Set(CARDS.flatMap(c=>c.threads))].sort();
document.getElementById("thread").innerHTML='<option value="">all threads</option>'+allThreads.map(t=>`<option>${t}</option>`).join("");
document.getElementById("kinds").innerHTML=KINDS.map(k=>`<button class="chip" data-k="${k}" style="border-color:${KC[k]}">${k}</button>`).join("");
function headRow(){document.getElementById("head").innerHTML=COLS.map(c=>`<th data-k="${c[0]}">${c[1]}${sortK===c[0]?(sortDir>0?" ▲":" ▼"):""}</th>`).join("");
 document.querySelectorAll("#head th").forEach(th=>th.onclick=()=>{const k=th.dataset.k;if(sortK===k)sortDir*=-1;else{sortK=k;sortDir=1;}render();});}
function val(c,k){return k==="links"?(c.bo.length+c.en.length):k==="threads"?c.threads.join(", "):c[k];}
function rows(){
 let r=CARDS.filter(c=>{
  if(kind&&c.kind!==kind)return false;
  if(thread&&!c.threads.includes(thread))return false;
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
  <td><span class="kpill" style="background:${KC[c.kind]}22;color:${KC[c.kind]}">${c.kind}</span></td>
  <td>${c.year}</td><td>${c.place||""}</td>
  <td class="thr">${c.threads.join(", ")}</td>
  <td title="builds on ${c.bo.length}, enables ${c.en.length}">${c.bo.length}→${c.en.length}</td>
  <td class="sig">${c.sig||""}</td></tr>`).join("");
 document.getElementById("count").textContent=`${r.length} of ${CARDS.length} tools`;
 document.querySelectorAll('#body tr').forEach((tr,ix)=>{tr.style.cursor='pointer';tr.onclick=()=>showDetail(r[ix]);});
 try{setState({kind:kind||'',thread:thread||'',q:q||''});}catch(e){}
 document.querySelectorAll("#kinds .chip").forEach(b=>b.classList.toggle("on",b.dataset.k===kind));
}
document.getElementById("q").oninput=e=>{q=e.target.value.toLowerCase();render();};
document.getElementById("thread").onchange=e=>{thread=e.target.value;render();};
document.querySelectorAll("#kinds .chip").forEach(b=>b.onclick=()=>{kind=kind===b.dataset.k?null:b.dataset.k;render();});
document.getElementById("reset").onclick=()=>{q="";kind=null;thread="";document.getElementById("q").value="";document.getElementById("thread").value="";render();};
try{if(q){document.getElementById('q').value=q;}if(thread){document.getElementById('thread').value=thread;}}catch(e){}
render();
})();
