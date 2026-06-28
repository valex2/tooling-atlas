#!/usr/bin/env python3
"""Bundle the multi-file views into ONE self-contained, offline file: tooling-atlas.html.
Each view's <script src> assets are inlined, per-view nav stripped, and all views are
wrapped in a polished tabbed shell (Home + one srcdoc iframe). Opens by double-click and
renders inside a single-file preview. Run after regenerate.py (sync.sh does both)."""
import re, os, json

HERE = os.path.dirname(os.path.abspath(__file__))
VIEWS = [("Globe","map.html"),("Timeline","views/atlas.html"),("Tree","views/tree.html"),
         ("Deck","views/deck.html"),("Table","table.html"),("Dashboard","dashboard.html")]
BLURB = {
 "Globe":"Where each tool was invented, and how each fed a later one somewhere else.",
 "Timeline":"Every tool on a time axis, in lanes by thread, geography, or the four Ms.",
 "Tree":"The genealogy: which tool built on which, branching through time.",
 "Deck":"Flip cards — the moment on the front, the aftermath on the back.",
 "Table":"A sortable, filterable database of every tool.",
 "Dashboard":"Coverage by kind, decade, and thread, plus the gaps still to fill.",
}
MS = [("Measure","#3266ad","see what is there — a microscope, an X-ray, a way to read DNA"),
      ("Model","#8a4fb3","reason about it — an equation or rule that predicts without building"),
      ("Make","#b06a1e","build one working copy — a single transistor, engine, or molecule"),
      ("Manufacture","#2f8f6b","build a billion, cheap and identical, on a factory floor")]

# Front/Back text is only needed by the Deck; slim it out of the other views' data to keep the bundle small.
_jsonp = os.path.join(HERE, "data/cards.json")
if os.path.exists(_jsonp):
    cards = json.loads(open(_jsonp, encoding="utf-8").read())
else:  # fallback: parse the window.CARDS=… assignment in cards.js
    cards = json.loads(open(os.path.join(HERE,"data/cards.js"),encoding="utf-8").read().split("=",1)[1].rstrip().rstrip(";"))
SLIM_JS = "window.CARDS=" + json.dumps([{k:v for k,v in c.items() if k not in ("front","back")} for c in cards], ensure_ascii=False) + ";"

def inline(relpath, slim=False):
    path = os.path.join(HERE, relpath); base = os.path.dirname(path)
    txt = open(path, encoding="utf-8").read()
    def rep(m):
        src = m.group(1)
        if src.startswith("http"): return ""
        if slim and os.path.basename(src) == "cards.js":
            return "<script>\n" + SLIM_JS + "\n</script>"
        return "<script>\n" + open(os.path.normpath(os.path.join(base, src)), encoding="utf-8").read() + "\n</script>"
    txt = re.sub(r'<script src="([^"]+)"></script>', rep, txt)
    txt = re.sub(r'<div id="appnav"[^>]*>.*?</div>', '', txt, flags=re.S)
    return txt

views = {label: inline(p, slim=(label != "Deck")) for label, p in VIEWS}
order = [label for label, _ in VIEWS]
data = json.dumps(views).replace("</", "<\\/")
n_cards = len(cards)
n_threads = len({t for c in cards for t in c.get("threads",[])})
n_countries = len({c.get("country") for c in cards if c.get("country")})
yrs = [c["year"] for c in cards if c.get("year")]
span = "%d–%d" % (min(yrs), max(yrs))

fav = ("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>"
       "<rect width='8' height='8' fill='%233266ad'/><rect x='8' width='8' height='8' fill='%238a4fb3'/>"
       "<rect y='8' width='8' height='8' fill='%23b06a1e'/><rect x='8' y='8' width='8' height='8' fill='%232f8f6b'/></svg>")

ms_html = "".join(
 f'<div class="m"><span class="sw" style="background:{c}"></span><b>{n}</b><span class="md">{d}</span></div>'
 for n,c,d in MS)
view_cards = "".join(
 f'<button class="vc" data-k="{k}"><span class="vn">{k}</span><span class="vd">{BLURB[k]}</span></button>'
 for k in order)

HOME = f"""<section id="home"><div class="hwrap">
 <p class="kicker">An atlas of the tools behind technology leadership</p>
 <h1>Tooling Atlas</h1>
 <p class="lede">Leadership in a field tends to follow leadership in its <em>tools</em> — and the lead migrates over time. Here are <b>{n_cards}</b> tools spanning <b>{span}</b>, each one an instrument, machine, method, or process someone built and others picked up, mapped four ways.</p>
 <div class="stats"><span><b>{n_cards}</b> tools</span><span><b>{n_threads}</b> threads</span><span><b>{n_countries}</b> countries</span><span><b>{span}</b></span></div>
 <h2>The four jobs a tool does</h2>
 <p class="sub">Every tool here does one of four jobs, and they fall in order.</p>
 <div class="ms">{ms_html}</div>
 <p class="tagline">See it, understand it, build one, build a million.</p>
 <h2>Six ways to read it</h2>
 <div class="views">{view_cards}</div>
</div></section>"""

shell = """<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tooling Atlas — how tools make technology leadership</title>
<meta name="description" content="An interactive atlas of __NC__ tools across __SPAN__: leadership in a field follows leadership in its tools. Explore as a globe, timeline, genealogy tree, deck, table, and coverage dashboard.">
<meta name="theme-color" content="#f5f3ef">
<meta property="og:type" content="website">
<meta property="og:title" content="Tooling Atlas">
<meta property="og:description" content="__NC__ tools across __SPAN__, mapped four ways — leadership in a field follows leadership in its tools.">
<meta name="twitter:card" content="summary">
<link rel="icon" href="__FAV__">
<style>
 :root{--ink:#1c1c1c;--mut:#6f6f6f;--bg:#f5f3ef;--card:#fff;--line:rgba(0,0,0,.12);
  --Measure:#3266ad;--Model:#8a4fb3;--Make:#b06a1e;--Manufacture:#2f8f6b;
  --serif:"Charter","Iowan Old Style","Palatino Linotype",Georgia,"Times New Roman",serif;
  --sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
 *{box-sizing:border-box}
 html,body{margin:0;height:100%}
 body{display:flex;flex-direction:column;background:var(--bg);color:var(--ink);font:14px/1.55 var(--sans);-webkit-font-smoothing:antialiased}
 header{display:flex;align-items:baseline;gap:16px;padding:11px 20px;background:rgba(255,255,255,.86);
  backdrop-filter:saturate(1.4) blur(8px);border-bottom:.5px solid var(--line);flex-wrap:wrap;position:sticky;top:0;z-index:10}
 .brand{font-family:var(--serif);font-size:17px;font-weight:600;letter-spacing:.01em;cursor:pointer;color:var(--ink);white-space:nowrap}
 .brand .dot{display:inline-block;width:7px;height:7px;border-radius:2px;margin-right:7px;vertical-align:1px;
  background:linear-gradient(135deg,var(--Measure) 0 25%,var(--Model) 25% 50%,var(--Make) 50% 75%,var(--Manufacture) 75%)}
 nav{display:flex;gap:5px;flex-wrap:wrap}
 .tab{border:.5px solid var(--line);background:#fff;border-radius:999px;padding:5px 13px;font-size:12.5px;
  cursor:pointer;color:var(--ink);transition:background .12s,color .12s,border-color .12s}
 .tab:hover{background:#efece6}
 .tab.on{background:var(--ink);color:#fff;border-color:var(--ink)}
 main{flex:1;min-height:0;position:relative}
 #frame{border:0;width:100%;height:100%;display:block;background:var(--bg)}
 /* home */
 #home{height:100%;overflow:auto}
 .hwrap{max-width:760px;margin:0 auto;padding:54px 24px 80px}
 .kicker{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);margin:0 0 10px}
 h1{font-family:var(--serif);font-weight:600;font-size:46px;line-height:1.02;letter-spacing:-.01em;margin:0 0 18px}
 .lede{font-size:18px;line-height:1.6;color:#39362f;margin:0 0 22px}
 .lede em{font-style:italic}
 .stats{display:flex;gap:26px;flex-wrap:wrap;padding:16px 0;border-top:.5px solid var(--line);border-bottom:.5px solid var(--line);margin-bottom:34px;color:var(--mut);font-size:13px}
 .stats b{color:var(--ink);font-size:16px;font-weight:600;margin-right:5px}
 h2{font-family:var(--serif);font-weight:600;font-size:21px;margin:30px 0 4px}
 .sub{color:var(--mut);margin:0 0 16px;font-size:13.5px}
 .ms{display:grid;gap:9px}
 .m{display:grid;grid-template-columns:auto auto 1fr;align-items:baseline;gap:10px;padding:10px 14px;background:var(--card);border:.5px solid var(--line);border-radius:10px}
 .m .sw{width:11px;height:11px;border-radius:3px;align-self:center}
 .m b{font-weight:600}
 .m .md{color:var(--mut);font-size:13px}
 .tagline{font-family:var(--serif);font-style:italic;font-size:18px;color:#5a4a32;text-align:center;margin:26px 0 4px}
 .views{display:grid;grid-template-columns:1fr 1fr;gap:10px}
 .vc{text-align:left;background:var(--card);border:.5px solid var(--line);border-radius:11px;padding:13px 15px;cursor:pointer;transition:border-color .12s,transform .06s,box-shadow .12s}
 .vc:hover{border-color:rgba(0,0,0,.28);box-shadow:0 4px 16px rgba(0,0,0,.06);transform:translateY(-1px)}
 .vc .vn{display:block;font-weight:600;font-size:14.5px;margin-bottom:3px}
 .vc .vd{display:block;color:var(--mut);font-size:12.5px;line-height:1.5}
 .foot{color:var(--mut);font-size:12px;margin-top:34px;padding-top:16px;border-top:.5px solid var(--line)}
 @media (max-width:620px){h1{font-size:34px}.lede{font-size:16px}.views{grid-template-columns:1fr}
  .m{grid-template-columns:auto 1fr;grid-auto-flow:row}.m .md{grid-column:1/-1}}
</style></head><body>
<header>
 <span class="brand" data-k="Home"><span class="dot"></span>Tooling Atlas</span>
 <nav id="tabs"></nav>
</header>
<main>__HOME__<iframe id="frame" title="Tooling Atlas view" hidden></iframe></main>
<script>
const VIEWS=__DATA__, ORDER=__ORDER__, TABS=["Home"].concat(ORDER);
const tabs=document.getElementById('tabs'),frame=document.getElementById('frame'),home=document.getElementById('home');
let pendingCard=null;
frame.onload=function(){if(pendingCard){try{frame.contentWindow.postMessage({type:'focuscard',id:pendingCard},'*');}catch(e){}pendingCard=null;}};
window.addEventListener('message',function(e){if(e.data&&e.data.type==='opencard'){pendingCard=e.data.id;show('Deck');}});
function show(k){
 if(!TABS.includes(k))k="Home";
 const isHome=k==="Home";
 home.style.display=isHome?'block':'none';
 frame.hidden=isHome;
 if(!isHome)frame.srcdoc=VIEWS[k];
 [...tabs.children].forEach(b=>b.classList.toggle('on',b.dataset.k===k));
 try{localStorage.setItem('ta-tab',k);}catch(e){}
}
TABS.forEach(k=>{const b=document.createElement('button');b.className='tab';b.dataset.k=k;b.textContent=k;b.onclick=()=>show(k);tabs.appendChild(b);});
document.querySelectorAll('[data-k]').forEach(el=>{if(el.tagName!=='BUTTON'||el.classList.contains('vc'))el.style.cursor='pointer';el.addEventListener('click',()=>show(el.dataset.k));});
let start="Home";try{const s=localStorage.getItem('ta-tab');if(s&&TABS.includes(s))start=s;}catch(e){}
show(start);
</script></body></html>"""

out = (shell.replace("__DATA__", data).replace("__ORDER__", json.dumps(order))
            .replace("__HOME__", HOME).replace("__FAV__", fav)
            .replace("__NC__", str(n_cards)).replace("__SPAN__", span))
open(os.path.join(HERE, "tooling-atlas.html"), "w", encoding="utf-8").write(out)
print("tooling-atlas.html:", len(out)//1024, "KB ·", n_cards, "tools ·", n_threads, "threads ·", n_countries, "countries ·", span)
