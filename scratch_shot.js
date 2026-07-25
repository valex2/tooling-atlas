const puppeteer=require('./test/node_modules/puppeteer-core');
(async()=>{
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox','--window-size=1200,900']});
const p=await b.newPage();
await p.setViewport({width:1200,height:900});
const errs=[];p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:8731/views/map.html',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1200));
// measure dots at cold open
const s1=await p.evaluate(()=>{const g=document.getElementById('g');return{dots:g.querySelectorAll('.dot').length,texts:g.querySelectorAll('text').length,htmlKB:(g.innerHTML.length/1024).toFixed(0),hint:document.getElementById('hint')?.textContent}});
console.log('COLD-OPEN',JSON.stringify(s1));
await p.screenshot({path:'/private/tmp/claude-503/-Users-Vassilis-Desktop-Tooling-tooling-atlas/8b9a8716-44ff-4f11-9f89-04cdd6e9d0ee/scratchpad/cold.png'});
// jump to 2024 full, no thread: clear thread then set slider max
await p.evaluate(()=>{location.hash='';});
await new Promise(r=>setTimeout(r,300));
// use the year slider to max + click play then stop after a bit
const sl=await p.$('#year, input[type=range]');
const s2=await p.evaluate(()=>{const g=document.getElementById('g');return{dots:g.querySelectorAll('.dot').length,texts:g.querySelectorAll('text').length,htmlKB:(g.innerHTML.length/1024).toFixed(0),hint:document.getElementById('hint')?.textContent}});
console.log('AFTER-HASH-CLEAR',JSON.stringify(s2));
await p.screenshot({path:'/private/tmp/claude-503/-Users-Vassilis-Desktop-Tooling-tooling-atlas/8b9a8716-44ff-4f11-9f89-04cdd6e9d0ee/scratchpad/state2.png'});
console.log('ERRORS',errs.length,errs.slice(0,3).join(' | '));
await b.close();
})().catch(e=>{console.error('FAIL',e.message);process.exit(1)});
