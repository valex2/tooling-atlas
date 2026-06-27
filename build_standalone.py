#!/usr/bin/env python3
"""Bundle the multi-file views into ONE self-contained, offline file: tooling-atlas.html.
Each view's <script src> assets are inlined, the per-view nav is stripped, and all
views are wrapped in a tabbed shell (one iframe, srcdoc-swapped). Opens by double-click
and renders inside a single-file preview. Run after regenerate.py (sync.sh does both)."""
import re, os, json

HERE = os.path.dirname(os.path.abspath(__file__))
VIEWS = [("Globe","map.html"),("Timeline","views/atlas.html"),("Tree","views/tree.html"),
         ("Deck","views/deck.html"),("Table","table.html"),("Dashboard","dashboard.html")]

def inline(relpath):
    path = os.path.join(HERE, relpath)
    base = os.path.dirname(path)
    txt = open(path, encoding="utf-8").read()
    def rep(m):
        src = m.group(1)
        if src.startswith("http"): return ""          # no CDNs in the offline bundle
        code = open(os.path.normpath(os.path.join(base, src)), encoding="utf-8").read()
        return "<script>\n" + code + "\n</script>"
    txt = re.sub(r'<script src="([^"]+)"></script>', rep, txt)
    txt = re.sub(r'<div id="appnav"[^>]*>.*?</div>', '', txt, flags=re.S)  # parent tab bar replaces it
    return txt

views = {label: inline(p) for label, p in VIEWS}
order = [label for label, _ in VIEWS]
data = json.dumps(views).replace("</", "<\\/")   # keep </script> from closing the shell script

shell = """<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tooling Atlas</title>
<style>
 html,body{margin:0;height:100%;background:#f5f3ef;color:#1c1c1c;
  font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
 #bar{display:flex;align-items:center;gap:7px;padding:9px 16px;background:#fff;
  border-bottom:.5px solid rgba(0,0,0,.12);flex-wrap:wrap;box-shadow:0 1px 6px rgba(0,0,0,.04)}
 #bar .ttl{font-weight:600;font-size:15px;margin-right:8px;letter-spacing:.01em}
 #bar .tagline{color:#9a6a3a;font-size:11.5px;margin-left:auto;font-style:italic}
 .tab{border:.5px solid rgba(0,0,0,.15);background:#fff;border-radius:14px;padding:5px 14px;
  font-size:12.5px;cursor:pointer;color:#1c1c1c;transition:background .12s,color .12s}
 .tab:hover{background:#efece6}
 .tab.on{background:#1c1c1c;color:#fff;border-color:#1c1c1c}
 #frame{border:0;width:100%;height:calc(100vh - 50px);display:block;background:#f5f3ef}
 @media (max-width:560px){#bar .tagline{display:none}}
</style></head><body>
<div id="bar"><span class="ttl">&#128302; Tooling Atlas</span><span id="tabs"></span>
<span class="tagline">See it, understand it, build one, build a million.</span></div>
<iframe id="frame" title="Tooling Atlas view"></iframe>
<script>
const VIEWS=__DATA__, ORDER=__ORDER__;
const tabs=document.getElementById('tabs'), frame=document.getElementById('frame');
function show(k){frame.srcdoc=VIEWS[k];[...tabs.children].forEach(b=>b.classList.toggle('on',b.dataset.k===k));}
ORDER.forEach(k=>{const b=document.createElement('button');b.className='tab';b.dataset.k=k;b.textContent=k;b.onclick=()=>show(k);tabs.appendChild(b);});
show(ORDER[0]);
</script></body></html>"""

out = shell.replace("__DATA__", data).replace("__ORDER__", json.dumps(order))
open(os.path.join(HERE, "tooling-atlas.html"), "w", encoding="utf-8").write(out)
kb = len(out)//1024
print("tooling-atlas.html:", kb, "KB,", len(views), "views bundled offline")
