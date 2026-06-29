#!/usr/bin/env python3
"""Rebuild data/cards.js + data/cards.json + data/countries.js.

Source of truth = the committed `source/` markdown bundle (synced from the
Obsidian vault by sync.sh). Regeneration reads `source/` so the atlas is fully
reproducible from the repo alone, with no vault present.
Usage: python3 regenerate.py     (needs: pip install pyshp)
Override the input dir with CARDS_SRC=/path python3 regenerate.py
"""
import re, glob, os, json, sys
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.environ.get("CARDS_SRC", os.path.join(HERE, "source"))

def field(fm, k):
    m = re.search(r'^%s:\s*(.*)$' % re.escape(k), fm, re.M)
    return m.group(1).strip().strip('"') if m else ""
def clist(fm, k):
    b = re.search(r'^%s:\n((?:\s*-\s*.*\n?)*)' % k, fm, re.M)
    return re.findall(r'\[\[Tooling Card - ([^\]|]+?)(?:\|[^\]]*)?\]\]', b.group(1)) if b else []
def threads(fm):
    b = re.search(r'^Threads:\n((?:\s*-\s*.*\n?)*)', fm, re.M)
    return re.findall(r'\[\[Thread - ([^\]|]+?)(?:\|[^\]]*)?\]\]', b.group(1)) if b else []
def mdlite(s):
    # minimal markdown -> HTML for the deck's Front/Back faces (links, bold, italic)
    # URL allows one level of balanced parens so Wikipedia links like
    # ...John_H._Hall_(gunsmith) aren't truncated at the inner ")".
    s = re.sub(r'\[([^\]]+)\]\((https?://(?:[^\s()]|\([^\s()]*\))*)\)',
               r'<a href="\2" target="_blank" rel="noopener">\1</a>', s)
    s = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', s)
    s = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<i>\1</i>', s)
    return re.sub(r'\s+', ' ', s).strip()

def parse_year(s):
    # Tolerate "1769", "c. 1800", "1769?", "1980s", "552 CE"; 0 = unknown.
    m = re.search(r'\d{1,4}', s or "")
    return int(m.group()) if m else 0

if not os.path.isdir(SRC):
    sys.exit("Source dir not found: %s\n(run sync.sh to bundle source/ from the vault)" % SRC)

cards, skipped, warns = [], [], []
for p in sorted(glob.glob(os.path.join(SRC, "Tooling Card - *.md"))):
    cid = os.path.basename(p)[len("Tooling Card - "):-3]
    raw = open(p, encoding="utf-8").read()
    mfm = re.match(r'^---\n(.*?)\n---\n', raw, re.S)
    if not mfm:                      # no/garbled frontmatter — skip, don't crash the run
        skipped.append(cid); continue
    fm, body = mfm.group(1), raw[mfm.end():]
    # Front/Back faces from the body; stop before the off-card *Curator's note:* (kept private)
    fb = re.search(r'\*\*Front\.\*\*(.*?)\*\*Back\.\*\*(.*?)(?:\n\*Curator|\Z)', body, re.S)
    front = mdlite(fb.group(1)) if fb else ""
    back  = mdlite(fb.group(2)) if fb else ""
    y, lat, lon, th = field(fm,"Year"), field(fm,"Lat"), field(fm,"Lon"), threads(fm)
    if y and not parse_year(y): warns.append("%s: unparseable Year %r -> 0" % (cid, y))
    cards.append(dict(id=cid, name=field(fm,"Name") or cid, kind=field(fm,"Kind"),
        year=parse_year(y), place=field(fm,"Place"), person=field(fm,"Person"),
        sig=field(fm,"Significance"), goal=field(fm,"Goal"), mech=field(fm,"Mechanism"),
        tool=field(fm,"Tool"), era=field(fm,"Era"), conf=field(fm,"Confidence"),
        front=front, back=back,
        threads=th, primary=th[0] if th else "—",
        lat=float(lat) if lat else None, lon=float(lon) if lon else None,
        bo=clist(fm,"BuildsOn"), en=clist(fm,"Enables"), country=""))

# Validate cross-references resolve to real cards (a typo'd [[link]] is silently broken otherwise).
ids = {c["id"] for c in cards}
for c in cards:
    for k in ("bo", "en"):
        bad = [x for x in c[k] if x not in ids]
        if bad: warns.append("%s: %s -> unknown %s" % (c["id"], k, ", ".join(bad)))
if skipped: print("WARN skipped (no frontmatter):", ", ".join(skipped))
for w in warns: print("WARN", w)
# NOTE: cards.js is written below, AFTER the point-in-polygon pass fills c["country"].

# countries (basemap rings + tool counts), bundled Natural Earth shapefile
import shapefile
SHP = os.path.join(HERE, "data/ne/naturalearth_lowres")
sf = shapefile.Reader(shp=SHP+".shp", dbf=SHP+".dbf", encoding="latin1")
def simp(r, tol=0.5):
    o=[r[0]]; l=r[0]
    for q in r[1:-1]:
        if abs(q[0]-l[0])+abs(q[1]-l[1])>=tol: o.append(q); l=q
    o.append(r[-1]); return o
def pip(x,y,r):
    ins=False; n=len(r); j=n-1
    for i in range(n):
        xi,yi=r[i]; xj,yj=r[j]
        if ((yi>y)!=(yj>y)) and (x<(xj-xi)*(y-yi)/((yj-yi) or 1e-12)+xi): ins=not ins
        j=i
    return ins
fld=[x[0] for x in sf.fields[1:]]; nidx=fld.index("name"); recs=sf.records(); names=[r[nidx] for r in recs]
shapes=sf.shapes()
Cr=[[sh.points[a:b] for a,b in zip(list(sh.parts), list(sh.parts)[1:]+[len(sh.points)])] for sh in shapes]
cnt=[0]*len(Cr)
for c in cards:
    if c["lat"] is None: continue
    for i,rings in enumerate(Cr):
        if any(pip(c["lon"],c["lat"],r) for r in rings if len(r)>3): cnt[i]+=1; c["country"]=names[i]; break
cards_json = json.dumps(cards, ensure_ascii=False)
open(os.path.join(HERE,"data/cards.js"),"w").write("window.CARDS="+cards_json+";")
open(os.path.join(HERE,"data/cards.json"),"w").write(cards_json)
print("cards.js:", len(cards), "cards;", sum(1 for c in cards if c["country"]), "with country")
out=[]
for rings,c,nm in zip(Cr,cnt,names):
    rr=[]
    for r in rings:
        if max(p[1] for p in r) < -56 or len(r)<4: continue
        s=simp(r)
        if len(s)>=4: rr.append([[round(x,2),round(y,2)] for x,y in s])
    if rr: out.append({"r":rr,"c":c,"n":nm})
open(os.path.join(HERE,"data/countries.js"),"w").write("window.COUNTRIES="+json.dumps(out,separators=(",",":"))+";")
print("countries.js:", len(out), "countries")
print("done. Open index.html.")
