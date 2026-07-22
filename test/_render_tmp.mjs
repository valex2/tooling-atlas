import puppeteer from 'puppeteer-core';
const OUT='/private/tmp/claude-503/-Users-Vassilis-Desktop-Tooling-tooling-atlas/8b9a8716-44ff-4f11-9f89-04cdd6e9d0ee/scratchpad';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox','--hide-scrollbars']});
const errs=[];
for(const [w,h,tag] of [[1440,900,'desktop'],[390,844,'mobile']]){
  const p=await b.newPage();
  p.on('console',m=>{if(m.type()==='error')errs.push(tag+': '+m.text())});
  p.on('pageerror',e=>errs.push(tag+' pageerror: '+e.message));
  await p.setViewport({width:w,height:h,deviceScaleFactor:1});
  await p.goto('http://127.0.0.1:8791/views/relay.html',{waitUntil:'networkidle0'});
  await new Promise(r=>setTimeout(r,500));
  await p.screenshot({path:`${OUT}/relay-${tag}.png`});
  if(tag==='desktop'){
    const d=await p.evaluate(()=>{
      const gut=[...document.querySelectorAll('#chart text')].filter(t=>+t.getAttribute('x')<200)
        .map(t=>({x:+t.getAttribute('x'),y:+t.getAttribute('y'),s:t.textContent,w:t.getComputedTextLength()}));
      const over=gut.filter(g=>g.x+g.w>200);
      // hold-lane labels: check collisions inside each y row
      const lane=[...document.querySelectorAll('#chart text')].filter(t=>+t.getAttribute('x')>=200)
        .map(t=>({x:+t.getAttribute('x'),y:+t.getAttribute('y'),s:t.textContent,w:t.getComputedTextLength()}));
      const rows={};lane.forEach(l=>{(rows[l.y]=rows[l.y]||[]).push(l)});
      const coll=[];
      Object.values(rows).forEach(r=>{r.sort((a,b)=>a.x-b.x);for(let i=1;i<r.length;i++) if(r[i].x < r[i-1].x+r[i-1].w) coll.push([r[i-1].s,r[i].s,r[i-1].y]);});
      const right=lane.filter(l=>l.x+l.w>1220);
      return {gutterLines:gut.map(g=>g.s),gutterOverflow:over,collisions:coll,pastRight:right,
        svgW:document.getElementById('chart').getAttribute('width'),
        bodyOverflow:document.documentElement.scrollWidth>window.innerWidth};
    });
    console.log(JSON.stringify(d,null,1).slice(0,9000));
  }
  if(tag==='mobile'){
    const m=await p.evaluate(()=>({over:document.documentElement.scrollWidth>window.innerWidth,
      topH:document.querySelector('.top').getBoundingClientRect().height}));
    console.log('MOBILE',JSON.stringify(m));
  }
  await p.close();
}
await b.close();
console.log('CONSOLE ERRORS:',errs.length?errs:'none');
