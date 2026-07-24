#!/usr/bin/env python3
"""Rebuild data/cards.js + data/cards.json + data/countries.js.

Source of truth = the committed `source/` markdown bundle (synced from the
Obsidian vault by sync.sh). Regeneration reads `source/` so the atlas is fully
reproducible from the repo alone, with no vault present.
Usage: python3 regenerate.py     (needs: pip install pyshp)
Override the input dir with CARDS_SRC=/path python3 regenerate.py -- the directory
must be a COMPLETE bundle: both `Tooling Card - *.md` and `Thread - *.md`. Threads
are validated against the Thread files found there, so a cards-only directory is
rejected outright rather than reported as 161 identical "unknown thread" failures.
"""
import re, glob, os, json, sys
# Diagnostics quote vault text ("Peenemünde"), so stdout must not be locale-ASCII
# either -- under LC_ALL=C the snap/override reports would otherwise crash the run
# before a single output file is written.
for _s in (sys.stdout, sys.stderr):
    if hasattr(_s, "reconfigure"): _s.reconfigure(encoding="utf-8", errors="replace")
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
def esc(s):
    # The double quote matters as much as the angle brackets: mdlite interpolates the
    # captured URL straight into href="...", and the URL character class permits a raw
    # quote, so [x](https://e.com/a"onmouseover="alert(1)) closed the attribute and
    # emitted a live event handler. The vault is trusted, so this was never remote XSS
    # — but the "authored text can never inject markup" invariant below was simply false.
    return (s.replace("&", "&amp;").replace("<", "&lt;")
             .replace(">", "&gt;").replace('"', "&quot;"))
def mdlite(s):
    # minimal markdown -> HTML for the deck's Front/Back faces (links, bold, italic)
    # Escape FIRST: authored text can then never inject markup, while the <a>/<b>/<i>
    # emitted below are added after escaping and so reach the browser intact. The
    # markdown delimiters ([ ] ( ) * ) and the [[wikilink]] brackets handled in the
    # post-pass are untouched by escaping, so both syntaxes still work.
    s = esc(s)
    # URL allows one level of balanced parens so Wikipedia links like
    # ...John_H._Hall_(gunsmith) aren't truncated at the inner ")".
    s = re.sub(r'\[([^\]]+)\]\((https?://(?:[^\s()]|\([^\s()]*\))*)\)',
               r'<a href="\2" target="_blank" rel="noopener">\1</a>', s)
    s = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', s)
    s = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<i>\1</i>', s)
    return re.sub(r'\s+', ' ', s).strip()

def parse_year(s):
    # Tolerate "1769", "c. 1800", "1769?", "1980s", "552 CE".
    # Returns None when nothing parses -- NOT 0, which is a legitimate parsed year and
    # is falsy, so an `if not parse_year(y)` caller used to report year 0 as a parse
    # failure. Since warnings became fatal that spurious warning would fail the build.
    m = re.search(r'\d{1,4}', s or "")
    return int(m.group()) if m else None

if not os.path.isdir(SRC):
    sys.exit("Source dir not found: %s\n(run sync.sh to bundle source/ from the vault)" % SRC)

cards, skipped, warns = [], [], []
for p in sorted(glob.glob(os.path.join(SRC, "Tooling Card - *.md"))):
    cid = os.path.basename(p)[len("Tooling Card - "):-3]
    raw = open(p, encoding="utf-8").read()
    mfm = re.match(r'^---\n(.*?)\n---\n', raw, re.S)
    if not mfm:                      # no/garbled frontmatter — collected, then fatal below
        skipped.append(cid); continue
    fm, body = mfm.group(1), raw[mfm.end():]
    # Front/Back faces from the body; stop before the off-card *Curator's note:* (kept private)
    fb = re.search(r'\*\*Front\.\*\*(.*?)\*\*Back\.\*\*(.*?)(?:\n\*Curator|\Z)', body, re.S)
    front = mdlite(fb.group(1)) if fb else ""
    back  = mdlite(fb.group(2)) if fb else ""
    # An unmatched **Front.**/**Back.** used to yield "" silently and the Deck then
    # rendered a blank face; say so instead.
    if not front: warns.append("%s: empty Front (no **Front.** section?)" % cid)
    if not back:  warns.append("%s: empty Back (no **Back.** section?)" % cid)
    y, lat, lon, th = field(fm,"Year"), field(fm,"Lat"), field(fm,"Lon"), threads(fm)
    if y and parse_year(y) is None: warns.append("%s: unparseable Year %r -> 0" % (cid, y))
    cards.append(dict(id=cid, name=field(fm,"Name") or cid, kind=field(fm,"Kind"),
        year=parse_year(y) or 0, place=field(fm,"Place"), person=field(fm,"Person"),
        sig=field(fm,"Significance"), goal=field(fm,"Goal"), mech=field(fm,"Mechanism"),
        tool=field(fm,"Tool"), era=field(fm,"Era"), conf=field(fm,"Confidence"),
        front=front, back=back,
        threads=th, primary=th[0] if th else "—",
        lat=float(lat) if lat else None, lon=float(lon) if lon else None,
        bo=clist(fm,"BuildsOn"), en=clist(fm,"Enables"), country=""))

# Validate cross-references resolve to real cards (a typo'd [[link]] is silently broken otherwise).
ids = {c["id"] for c in cards}
# Threads are files too, so a typo'd [[Thread - Machien Learning]] would otherwise
# mint a phantom thread and orphan the card into a group of one.
thread_ids = {os.path.basename(p)[len("Thread - "):-3]
              for p in glob.glob(os.path.join(SRC, "Thread - *.md"))}
# Every card carries Threads, so an empty thread set is never "no threads authored" —
# it means SRC is not a complete bundle (the documented CARDS_SRC override pointed at a
# cards-only directory). Say that once, instead of failing all 161 cards identically.
if not thread_ids:
    sys.exit("No 'Thread - *.md' files in %s\n"
             "(CARDS_SRC must name a complete bundle: Tooling Cards *and* Threads)" % SRC)
for c in cards:
    for k in ("bo", "en"):
        bad = [x for x in c[k] if x not in ids]
        if bad: warns.append("%s: %s -> unknown %s" % (c["id"], k, ", ".join(bad)))
    bad = [t for t in c["threads"] if t not in thread_ids]
    if bad: warns.append("%s: threads -> unknown %s" % (c["id"], ", ".join(bad)))
# Wikilinks in the Front/Back body. mdlite can't do these inline: resolving one
# needs the id -> name map, which only exists once every card is parsed (and the
# two differ — [[Tooling Card - TCP-IP]] must link to the card named "TCP/IP").
# The Deck already listens on hashchange for #card=<name>, so a plain anchor
# needs no new JS. Anything unresolvable degrades to its display text, never to
# a raw [[...]] shipped to the browser.
from urllib.parse import quote as _q
name_by_id = {c["id"]: c["name"] for c in cards}
def wikilinks(s, cid):
    def card(m):
        tgt, alias = m.group(1), m.group(2)
        # esc() ran over the body before this pass, so a target containing & < > "
        # arrives escaped while name_by_id keys come from raw filenames. Unescape
        # before lookup or [[Tooling Card - AT&T Long Lines]] would silently miss and
        # degrade to plain text. (No such id exists today; this keeps it that way.)
        tgt = (tgt.replace("&quot;", '"').replace("&gt;", ">")
                  .replace("&lt;", "<").replace("&amp;", "&"))
        nm = name_by_id.get(tgt)
        if not nm:
            warns.append("%s: body link -> unknown card %r" % (cid, tgt))
            return alias or tgt
        # alias comes from already-escaped body text; nm comes straight from
        # frontmatter, so escape it here too.
        return '<a href="#card=%s" class="xcard">%s</a>' % (_q(nm), alias or esc(nm))
    s = re.sub(r'\[\[Tooling Card - ([^\]|]+?)(?:\|([^\]]*))?\]\]', card, s)
    # Threads have no page of their own; render the label and drop the brackets.
    return re.sub(r'\[\[(?:Thread - )?([^\]|]+?)(?:\|([^\]]*))?\]\]',
                  lambda m: m.group(2) or m.group(1), s)
for c in cards:
    c["front"], c["back"] = wikilinks(c["front"], c["id"]), wikilinks(c["back"], c["id"])
if skipped: print("WARN skipped (no frontmatter):", ", ".join(skipped))
for w in warns: print("WARN", w)
# Validation has to be able to fail the build, or it is only advice: test/check.py
# gates on returncode alone, so an advisory warning is one nobody is forced to read.
# Bail BEFORE writing any output, leaving data/ at its last-good state rather than
# shipping a corpus we already know is broken.
if warns or skipped:
    sys.exit("FAILED: %d warning(s), %d skipped file(s) — fix source/ and re-run." % (len(warns), len(skipped)))
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
# The bundled Natural Earth outline is 110m, so a coastal site can sit just
# offshore of every ring and match no country (Hsinchu, Malibu, La Jolla,
# Peenemuende all did). Points that miss every polygon snap to the nearest
# coastline within MAX_SNAP; past that they stay blank rather than be
# attributed to whatever landmass happens to be closest.
import math
MAX_SNAP = 1.2   # degrees, ~130 km at the equator
def seg_d2(px,py,ax,ay,bx,by,kx):
    dx,dy=(bx-ax)*kx,by-ay
    L=dx*dx+dy*dy
    t=0.0 if L<=0 else max(0.0,min(1.0,(((px-ax)*kx)*dx+(py-ay)*dy)/L))
    qx,qy=((px-ax)*kx)-t*dx,(py-ay)-t*dy
    return qx*qx+qy*qy
def nearest_country(lon,lat):
    kx=math.cos(math.radians(lat)) or 1e-9
    best,bi=MAX_SNAP**2,-1
    for i,rings in enumerate(Cr):
        for r in rings:
            if len(r)<=3: continue
            for j in range(len(r)-1):
                d2=seg_d2(lon,lat,r[j][0],r[j][1],r[j+1][0],r[j+1][1],kx)
                if d2<best: best,bi=d2,i
    return bi
# The authored `Place` string is a human statement of where something happened;
# the polygon test is an inference from a coordinate that can land across a
# border (CERN's 46.23/6.06 reads as France). Where they disagree, the author
# wins and we say so — `country` must never contradict `place`, because the
# views key off both and would otherwise silently disagree with each other.
PLACE_ALIAS={"usa":"United States of America","u.s.":"United States of America",
 "us":"United States of America","united states":"United States of America",
 "england":"United Kingdom","scotland":"United Kingdom","wales":"United Kingdom",
 "britain":"United Kingdom","great britain":"United Kingdom","uk":"United Kingdom",
 "holland":"Netherlands","the netherlands":"Netherlands",
 "soviet union":"Russia","ussr":"Russia","hong kong":"China"}
NAME_BY_LOWER={n.lower():n for n in names}
def stated_country(place):
    """The country the Place string itself names, or '' if it names none."""
    tok=(place or "").split(",")[-1].strip().lower()
    return PLACE_ALIAS.get(tok) or NAME_BY_LOWER.get(tok,"")
snapped=[];overridden=[]
for c in cards:
    if c["lat"] is None: continue
    hit=-1
    for i,rings in enumerate(Cr):
        # Even-odd across ALL rings of a shape, not any(): a ring nested inside
        # another is a hole (Lesotho inside South Africa, Vatican/San Marino inside
        # Italy). any() read every ring as solid, so a point in the hole counted as
        # a hit -- and since the first matching record wins and South Africa precedes
        # Lesotho in record order, the enclave was silently swallowed.
        # NO length filter here: parity needs EVERY ring, outer and hole alike. Filtering
        # `len(r)>3` dropped short HOLES too, and a point inside a dropped hole silently
        # reverted to the any()-style answer this loop exists to fix. pip() is already
        # safe on a degenerate ring (it can only return False), so nothing needs filtering.
        if sum(pip(c["lon"],c["lat"],r) for r in rings) % 2: hit=i; break
    if hit<0:
        hit=nearest_country(c["lon"],c["lat"])
        if hit>=0: snapped.append("%s (%s) -> %s" % (c["id"], c["place"], names[hit]))
    stated=stated_country(c.get("place"))
    if stated and stated in NAME_BY_LOWER.values() and (hit<0 or names[hit]!=stated):
        was=names[hit] if hit>=0 else "(none)"
        overridden.append("%s (%s): polygon said %s, Place says %s" % (c["id"],c["place"],was,stated))
        hit=names.index(stated)
    if hit>=0: cnt[hit]+=1; c["country"]=names[hit]
for s in snapped: print("snapped to nearest coast:", s)
for s in overridden: print("place-string override:", s)

# --- swimlane region -------------------------------------------------------
# The Timeline used to own this mapping and derive the lane from `country` in the
# view. That made the view a second geography database: it and the globe derived
# geography independently and disagreed (CERN was "Continental Europe" in one and
# "France" in the other). Geography is DATA, so it is derived exactly once, here,
# and emitted per card. No view may re-derive it.
#
# `place` is consulted for one thing only: subdividing the US, the sole case where
# the atlas wants finer-than-country lanes.
COUNTRY_LANE={"Netherlands":"Netherlands","United Kingdom":"Britain","France":"France",
 "Germany":"Continental Europe","Italy":"Continental Europe","Switzerland":"Continental Europe",
 "Sweden":"Continental Europe","Finland":"Continental Europe","Austria":"Continental Europe",
 "Belgium":"Continental Europe","Denmark":"Continental Europe","Norway":"Continental Europe",
 "Spain":"Continental Europe","Poland":"Continental Europe","Czechia":"Continental Europe",
 "Canada":"Canada","Russia":"Russia","Kazakhstan":"Russia","Georgia":"Russia",
 "Ukraine":"Russia","Belarus":"Russia","India":"India","Japan":"Japan",
 "Taiwan":"Taiwan","China":"China","South Korea":"South Korea"}
USSUB=[("US Northeast",["New Jersey","Murray Hill","Massachusetts","Cambridge, USA","Bedford",
  "Connecticut","New York","Princeton","Pennsylvania","Schenectady","Derby, USA","Maryland",
  "Bell Labs","Armonk","Yorktown"]),
 ("US Midwest",["Detroit","Midwest","Michigan","Ohio","Cincinnati","Chicago","Illinois",
  "Wisconsin","Indiana"]),
 ("Silicon Valley / California",["California","Silicon Valley","Santa Clara","Stanford",
  "Berkeley","Hawthorne","Mountain View","San Francisco","San Diego","Pasadena","Caltech",
  "Palo Alto","Menlo","Sunnyvale","Cupertino","San Jose","Malibu","Anaheim","La Jolla",
  "Emeryville","Canoga Park"])]
# City keywords back up the state token: a card whose Place omits "California" (a data slip the
# region tags used to inherit silently) still lands in-lane. Only consulted for US cards
# (COUNTRY_LANE resolves every non-US country first), so a same-named foreign city cannot misfire.
# Lane display order, west to east with the US split out. Emitted per card as
# `regionOrd` rather than as a separate global: build_standalone.py re-serialises
# cards.js from cards.json for every view but the Deck, so a second `window.*`
# statement in cards.js would not survive into the single-file bundle. A per-card
# ordinal always does, and sorting the distinct regions by it reproduces this list
# filtered to the regions actually present -- which is exactly what the view needs.
LANE_ORDER=["Netherlands","Britain","France","Continental Europe","US Northeast","US Midwest",
 "Silicon Valley / California","US (other)","Canada","Russia","India","Japan","Taiwan","China",
 "South Korea","Other"]
# The US-band grouping and its short sub-labels. These used to live in the Timeline view
# (GEOGROUP/SUBLABEL); they are geography, so they belong here with the rest of it. Emitted
# per card as regionGroup/regionSub so the view derives no geography of its own.
US_SUB={"US Northeast":"Northeast","US Midwest":"Midwest",
 "Silicon Valley / California":"Silicon Valley","US (other)":"Other"}
def region_group(region): return "United States" if region in US_SUB else region
def region_sub(region): return US_SUB.get(region, region)
def region_of(c):
    # Prefer the polygon/override country; fall back to the country the Place string itself
    # names so a card that lacks coordinates but states its country is not mislabelled
    # "Other" (0 cards today, but the failure mode is silent, so close it).
    country=c["country"] or stated_country(c.get("place"))
    lane=COUNTRY_LANE.get(country)
    if lane: return lane
    if country=="United States of America":
        for lab,keys in USSUB:
            for k in keys:
                if k in (c["place"] or ""): return lab
        return "US (other)"
    return "Other"
for c in cards:
    c["region"]=region_of(c)
    c["regionOrd"]=LANE_ORDER.index(c["region"])
    c["regionGroup"]=region_group(c["region"])
    c["regionSub"]=region_sub(c["region"])

cards_json = json.dumps(cards, ensure_ascii=False)
open(os.path.join(HERE,"data/cards.js"),"w",encoding="utf-8").write("window.CARDS="+cards_json+";")
open(os.path.join(HERE,"data/cards.json"),"w",encoding="utf-8").write(cards_json)
print("cards.js:", len(cards), "cards;", sum(1 for c in cards if c["country"]), "with country")
out=[]
for rings,c,nm in zip(Cr,cnt,names):
    rr=[]
    for r in rings:
        if max(p[1] for p in r) < -56 or len(r)<4: continue
        s=simp(r)
        if len(s)>=4: rr.append([[round(x,2),round(y,2)] for x,y in s])
    if rr: out.append({"r":rr,"c":c,"n":nm})
open(os.path.join(HERE,"data/countries.js"),"w",encoding="utf-8").write("window.COUNTRIES="+json.dumps(out,separators=(",",":"))+";")
print("countries.js:", len(out), "countries")
print("done. Open index.html.")
