#!/usr/bin/env python3
"""Rebuild data/cards.js and data/countries.js from the Obsidian vault.
Usage: python3 regenerate.py     (needs: pip install pyshp)
"""
import re, glob, os, json
VAULT = os.environ.get("VAULT", "/Users/Vassilis/Documents/Obsidian Vault")
HERE = os.path.dirname(os.path.abspath(__file__))

def field(fm, k):
    m = re.search(r'^%s:\s*(.*)$' % re.escape(k), fm, re.M)
    return m.group(1).strip().strip('"') if m else ""
def clist(fm, k):
    b = re.search(r'^%s:\n((?:\s*-\s*.*\n?)*)' % k, fm, re.M)
    return re.findall(r'\[\[Tooling Card - ([^\]|]+?)(?:\|[^\]]*)?\]\]', b.group(1)) if b else []
def threads(fm):
    b = re.search(r'^Threads:\n((?:\s*-\s*.*\n?)*)', fm, re.M)
    return re.findall(r'\[\[Thread - ([^\]|]+?)(?:\|[^\]]*)?\]\]', b.group(1)) if b else []

cards = []
for p in sorted(glob.glob(os.path.join(VAULT, "Tooling Card - *.md"))):
    cid = os.path.basename(p)[len("Tooling Card - "):-3]
    fm = re.match(r'^---\n(.*?)\n---\n', open(p, encoding="utf-8").read(), re.S).group(1)
    y, lat, lon, th = field(fm,"Year"), field(fm,"Lat"), field(fm,"Lon"), threads(fm)
    cards.append(dict(id=cid, name=field(fm,"Name"), kind=field(fm,"Kind"),
        year=int(y) if y.isdigit() else 0, place=field(fm,"Place"), person=field(fm,"Person"),
        sig=field(fm,"Significance"), threads=th, primary=th[0] if th else "—",
        lat=float(lat) if lat else None, lon=float(lon) if lon else None,
        bo=clist(fm,"BuildsOn"), en=clist(fm,"Enables"), country=""))
open(os.path.join(HERE,"data/cards.js"),"w").write("window.CARDS="+json.dumps(cards,ensure_ascii=False)+";")
print("cards.js:", len(cards), "cards")

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
