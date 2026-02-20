import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════════
   THANK YOU — by Eswar
   Concept: "Signal Received"
   
   Intro: A cinematic encrypted-data terminal boots up,
   scanning & authenticating the incoming message.
   Progress bar locks. A clean flash. Then the world 
   opens — minimal, precise, unforgettable.
   
   No libraries. Pure React + CSS. Nothing like it.
══════════════════════════════════════════════════════ */

const GLYPHS = "アイウエカキクΩΨΓΛ∑∆∞≡⊕⌘01ABCDEFabcdef█▓▒░⟨⟩±×";
const ICE     = "#a8d8f0";
const CYAN    = "#00c8ff";
const GOLD    = "#e8b84b";
const WHITE   = "#f0f6ff";
const BG      = "#04080f";

const rand    = (a, b) => a + Math.random() * (b - a);
const randInt = (a, b) => Math.floor(rand(a, b));
const pick    = (arr)  => arr[randInt(0, arr.length)];

/* ─── Scramble text hook ─────────────────────────── */
function useScramble(target, active, ms = 1000) {
  const [out, setOut] = useState(() =>
    target.split("").map(c => (c === " " ? " " : pick(GLYPHS.split("")))).join("")
  );
  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const total = Math.ceil(ms / 16);
    const id = setInterval(() => {
      frame++;
      const done = Math.floor((frame / total) * target.length);
      setOut(
        target.split("").map((c, i) =>
          i < done ? c : c === " " ? " " : pick(GLYPHS.split(""))
        ).join("")
      );
      if (frame >= total) { setOut(target); clearInterval(id); }
    }, 16);
    return () => clearInterval(id);
  }, [active]);
  return out;
}

/* ─── Matrix canvas ───────────────────────────────── */
function MatrixCanvas({ opacity }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const cx = cv.getContext("2d");
    let af;
    const W = () => { cv.width = window.innerWidth; cv.height = window.innerHeight; };
    W(); window.addEventListener("resize", W);
    const cols = Math.ceil(cv.width / 16);
    const drops = Array.from({ length: cols }, () => rand(0, cv.height / 14));
    const step = () => {
      cx.fillStyle = "rgba(4,8,15,0.15)";
      cx.fillRect(0, 0, cv.width, cv.height);
      cx.font = "12px 'Courier New'";
      drops.forEach((y, i) => {
        const highlight = Math.random() > 0.96;
        cx.fillStyle = highlight ? "#fff" : i % 5 === 0 ? `${GOLD}88` : `${CYAN}28`;
        cx.fillText(pick(GLYPHS.split("")), i * 16, y * 14);
        if (y * 14 > cv.height && Math.random() > 0.975) drops[i] = 0;
        else drops[i] += rand(0.15, 0.6);
      });
      af = requestAnimationFrame(step);
    };
    step();
    return () => { cancelAnimationFrame(af); window.removeEventListener("resize", W); };
  }, []);
  return (
    <canvas ref={ref} style={{
      position:"fixed", inset:0, zIndex:1, pointerEvents:"none",
      opacity, transition:"opacity 1.4s ease",
    }} />
  );
}

/* ─── Aurora canvas ───────────────────────────────── */
function AuroraCanvas({ on }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!on) return;
    const cv = ref.current; if (!cv) return;
    const cx = cv.getContext("2d");
    let af, t = 0;
    const W = () => { cv.width = window.innerWidth; cv.height = window.innerHeight; };
    W(); window.addEventListener("resize", W);
    const orbs = [
      [0.5,  0.4, 320, CYAN,  0.055],
      [0.28, 0.52, 220, GOLD,  0.038],
      [0.72, 0.48, 180, "#2060ff", 0.044],
    ];
    const step = () => {
      cx.clearRect(0, 0, cv.width, cv.height);
      orbs.forEach(([rx, ry, r, hex, a]) => {
        const x = cv.width  * rx + Math.sin(t * 0.35 + rx) * 40;
        const y = cv.height * ry + Math.cos(t * 0.28 + ry) * 28;
        const g = cx.createRadialGradient(x, y, 0, x, y, r);
        // convert hex to rgba manually
        const R = parseInt(hex.slice(1,3),16);
        const G = parseInt(hex.slice(3,5),16);
        const B = parseInt(hex.slice(5,7),16);
        g.addColorStop(0, `rgba(${R},${G},${B},${a})`);
        g.addColorStop(1, `rgba(${R},${G},${B},0)`);
        cx.beginPath();
        cx.arc(x, y, r, 0, Math.PI * 2);
        cx.fillStyle = g;
        cx.fill();
      });
      t += 0.012;
      af = requestAnimationFrame(step);
    };
    step();
    return () => { cancelAnimationFrame(af); window.removeEventListener("resize", W); };
  }, [on]);
  return <canvas ref={ref} style={{ position:"fixed", inset:0, zIndex:2, pointerEvents:"none" }} />;
}

/* ─── Sparks ──────────────────────────────────────── */
function Sparks({ list }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:30, pointerEvents:"none" }}>
      {list.map(s => (
        <div key={s.id} style={{
          position:"absolute",
          left: s.x, top: s.y,
          width: s.sz, height: s.sz,
          borderRadius:"50%",
          background: s.col,
          boxShadow:`0 0 ${s.sz*2}px ${s.col}`,
          opacity:0,
          animation:`sfz 1s cubic-bezier(.2,.8,.3,1) ${s.d}s forwards`,
          "--tx":`${s.tx}px`, "--ty":`${s.ty}px`,
        }} />
      ))}
    </div>
  );
}

/* ─── INTRO SCREEN ────────────────────────────────── */
function Intro({ onDone }) {
  const [gOp,  setGOp]    = useState(0);
  const [pct,  setPct]    = useState(0);
  const [msg,  setMsg]    = useState("INITIALIZING SECURE CHANNEL...");
  const [lock, setLock]   = useState(false);
  const [flash,setFlash]  = useState(false);
  const [ring, setRing]   = useState(false);

  const animPct = (from, to, dur) => {
    const t0 = performance.now();
    const go = now => {
      const p = Math.min((now - t0) / dur, 1);
      setPct(Math.round(from + (to - from) * p));
      if (p < 1) requestAnimationFrame(go);
    };
    requestAnimationFrame(go);
  };

  useEffect(() => {
    const S = (ms, fn) => setTimeout(fn, ms);
    const ts = [
      S(180,  () => { setGOp(0.65); }),
      S(400,  () => { setRing(true); animPct(0, 34, 700); }),
      S(1100, () => { setMsg("VERIFYING SENDER IDENTITY..."); animPct(34, 61, 550); }),
      S(1700, () => { setMsg("DECRYPTING PAYLOAD..."); animPct(61, 88, 450); }),
      S(2200, () => { setMsg("ALL CHECKS PASSED ✓"); animPct(88, 100, 280); setLock(true); }),
      S(2580, () => { setGOp(0); setFlash(true); }),
      S(2900, () => { setFlash(false); onDone(); }),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      position:"fixed", inset:0, background:BG,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      zIndex:9999, overflow:"hidden",
    }}>
      <style>{`
        @keyframes spinR  { to{transform:rotate(360deg)} }
        @keyframes spinL  { to{transform:rotate(-360deg)} }
        @keyframes fOut   { 0%{opacity:1} 100%{opacity:0} }
        @keyframes ringPulse { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.2);opacity:0} }
      `}</style>

      <MatrixCanvas opacity={gOp} />
      {flash && <div style={{ position:"fixed", inset:0, background:"#fff", zIndex:200, animation:"fOut .32s ease forwards" }} />}

      <div style={{ position:"relative", zIndex:10, display:"flex", flexDirection:"column", alignItems:"center", gap:"2.6rem" }}>

        {/* Orbital rings */}
        <div style={{ position:"relative", width:148, height:148, display:"flex", alignItems:"center", justifyContent:"center" }}>
          {ring && [0,1,2].map(i => (
            <div key={`pr${i}`} style={{
              position:"absolute", inset:0, borderRadius:"50%",
              border:`1px solid ${[CYAN, GOLD, ICE][i]}`,
              animation:`ringPulse ${1.8+i*.9}s ease-out ${i*.5}s infinite`,
            }} />
          ))}
          {[{s:148,d:0.8,c:CYAN,dash:"6 5"},{s:112,d:-1.3,c:GOLD,dash:"2 9"},{s:76,d:0.5,c:ICE,dash:"1 12"}].map((o,i)=>(
            <svg key={i} width={o.s} height={o.s}
              style={{ position:"absolute", animation:`spin${o.d>0?"R":"L"} ${Math.abs(o.d)*3+2}s linear infinite` }}>
              <circle cx={o.s/2} cy={o.s/2} r={o.s/2-2}
                fill="none" stroke={o.c} strokeWidth="1"
                strokeDasharray={o.dash}
                style={{ filter: lock ? `drop-shadow(0 0 5px ${o.c})` : "none", transition:"filter 0.5s" }}
              />
            </svg>
          ))}
          {/* Center dot */}
          <div style={{
            width: lock ? 16 : 8, height: lock ? 16 : 8, borderRadius:"50%",
            background: lock ? GOLD : CYAN,
            boxShadow:`0 0 ${lock?22:10}px ${lock?GOLD:CYAN}`,
            transition:"all .45s cubic-bezier(.34,1.56,.64,1)",
          }} />
        </div>

        {/* Status */}
        <p style={{
          fontFamily:"'Courier New', monospace", fontSize:".7rem",
          letterSpacing:".3em", textTransform:"uppercase",
          color: lock ? GOLD : CYAN, transition:"color .4s", margin:0,
        }}>
          {msg}
        </p>

        {/* Progress */}
        <div style={{ width:260 }}>
          <div style={{
            width:"100%", height:1, background:"rgba(0,200,255,.1)",
            borderRadius:1, overflow:"hidden", marginBottom:".55rem",
          }}>
            <div style={{
              height:"100%", width:`${pct}%`,
              background:`linear-gradient(90deg,${CYAN},${GOLD})`,
              transition:"width .12s linear",
              boxShadow:`0 0 8px ${CYAN}`,
            }} />
          </div>
          <span style={{
            fontFamily:"'Courier New', monospace", fontSize:".6rem",
            letterSpacing:".18em", color:"rgba(168,216,240,.35)",
          }}>
            {String(pct).padStart(3,"0")}% — ESWAR.DEV / CONTACT / MSG_RECV
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN THANK YOU ──────────────────────────────── */
export default function ThankYou() {
  const [done,    setDone]    = useState(false);
  const [ready,   setReady]   = useState(false);
  const [sparks,  setSparks]  = useState([]);
  const [cd,      setCd]      = useState(12);
  const sid = useRef(0);
  const cdRef = useRef(null);

  const s1 = useScramble("Thank you for reaching out.",  ready, 950);
  const s2 = useScramble("Message received.",             ready, 850);
  const s3 = useScramble("I'll respond within 24 hours.",ready,1100);

  useEffect(() => {
    if (!done) return;
    setTimeout(() => setReady(true), 80);
  }, [done]);

  useEffect(() => {
    if (!ready) return;
    cdRef.current = setInterval(() => {
      setCd(c => {
        if (c <= 1) { clearInterval(cdRef.current); window.location.href = "index.html"; return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(cdRef.current);
  }, [ready]);

  const boom = useCallback((x, y) => {
    if (!ready) return;
    const cols = [CYAN, GOLD, ICE, WHITE, "#88ccff"];
    const batch = Array.from({ length: 22 }, (_, i) => {
      const a = (Math.PI * 2 * i) / 22 + rand(-0.1, 0.1);
      const v = rand(55, 165);
      return { id: sid.current++, x, y, tx: Math.cos(a)*v, ty: Math.sin(a)*v,
               sz: rand(3, 7), col: pick(cols), d: rand(0, 0.07) };
    });
    setSparks(p => [...p, ...batch]);
    setTimeout(() => setSparks(p => p.filter(s => !batch.includes(s))), 1200);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    boom(window.innerWidth * .5, window.innerHeight * .38);
    const iv = setInterval(() =>
      boom(rand(100, window.innerWidth-100), rand(80, window.innerHeight*.5)), 3200
    );
    return () => clearInterval(iv);
  }, [ready]);

  if (!done) return <Intro onDone={() => setDone(true)} />;

  return (
    <div onClick={e => boom(e.clientX, e.clientY)}
      style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
        background:BG, overflow:"hidden", position:"relative", cursor:"crosshair" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap');
        @keyframes sfz {
          0%  { opacity:1; transform:translate(0,0) scale(1); }
          100%{ opacity:0; transform:translate(var(--tx),var(--ty)) scale(.15); }
        }
        @keyframes cardIn {
          0%  { opacity:0; transform:scale(.86) translateY(36px); filter:blur(18px); }
          65% { opacity:1; transform:scale(1.02) translateY(-3px); filter:blur(0); }
          100%{ opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes fUp {
          from{ opacity:0; transform:translateY(22px); }
          to  { opacity:1; transform:translateY(0); }
        }
        @keyframes traceB {
          from{ stroke-dashoffset:2200; }
          to  { stroke-dashoffset:0; }
        }
        @keyframes lineW {
          from{ transform:scaleX(0); }
          to  { transform:scaleX(1); }
        }
        @keyframes blink {
          0%,100%{ opacity:1; }
          50%    { opacity:0; }
        }
        @keyframes pulse2 {
          0%  { transform:scale(1); opacity:.6; }
          100%{ transform:scale(1.9); opacity:0; }
        }
        @keyframes float {
          0%,100%{ transform:translateY(0); }
          50%    { transform:translateY(-9px); }
        }
        @keyframes cdBar {
          from{ transform:scaleX(1); }
          to  { transform:scaleX(0); }
        }
        .btn-e {
          font-family:'DM Mono',monospace;
          font-size:.7rem; font-weight:500;
          letter-spacing:.22em; text-transform:uppercase;
          padding:.85rem 2rem; border-radius:2px;
          text-decoration:none; display:inline-flex; align-items:center;
          position:relative; overflow:hidden; cursor:pointer;
          transition:color .3s, box-shadow .3s, border-color .3s;
        }
        .btn-e span{ position:relative; z-index:1; }
        .btn-main{
          border:1px solid ${CYAN}; color:${CYAN}; background:transparent;
        }
        .btn-main::before{
          content:''; position:absolute; inset:0;
          background:${CYAN};
          transform:translateX(-101%);
          transition:transform .38s cubic-bezier(.77,0,.18,1);
        }
        .btn-main:hover::before{ transform:translateX(0); }
        .btn-main:hover{ color:${BG}; box-shadow:0 0 28px ${CYAN}55; }
        .btn-ghost{
          border:1px solid rgba(168,216,240,.18);
          color:rgba(168,216,240,.45); background:transparent;
        }
        .btn-ghost:hover{
          border-color:${GOLD}; color:${GOLD};
          box-shadow:0 0 18px ${GOLD}33;
        }
      `}</style>

      <AuroraCanvas on={ready} />
      <Sparks list={sparks} />

      <div style={{
        position:"relative", zIndex:10,
        opacity: ready ? 1 : 0,
        animation: ready ? "cardIn 1.1s cubic-bezier(.34,1.08,.64,1) forwards" : "none",
      }}>
        {/* SVG border trace */}
        <svg style={{
          position:"absolute", inset:-2,
          width:"calc(100% + 4px)", height:"calc(100% + 4px)",
          pointerEvents:"none", zIndex:20, overflow:"visible",
        }} viewBox="0 0 560 530" preserveAspectRatio="none">
          <rect x="2" y="2" width="556" height="526" rx="3" ry="3"
            fill="none" stroke={CYAN} strokeWidth="1"
            strokeDasharray="2200" strokeDashoffset="2200"
            style={{ animation: ready ? "traceB 2s ease .25s forwards" : "none" }}
          />
        </svg>

        {/* Card */}
        <div style={{
          width:"min(560px,calc(100vw - 2.4rem))",
          background:"rgba(6,12,22,.96)",
          border:"1px solid rgba(0,200,255,.07)",
          borderRadius:3,
          padding:"3.5rem 3.2rem 3rem",
          position:"relative", overflow:"hidden",
          animation:"float 6s ease-in-out 2s infinite",
          backdropFilter:"blur(20px)",
        }}>

          {/* Shimmer sweep */}
          <div style={{
            position:"absolute", inset:0, pointerEvents:"none",
            background:`linear-gradient(115deg, transparent 35%, rgba(0,200,255,.06) 50%, transparent 65%)`,
            animation:"lineW 3s linear infinite",
          }} />

          {/* Top bar */}
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            marginBottom:"2.8rem",
            opacity:0, animation: ready ? "fUp .7s ease .4s forwards" : "none",
          }}>
            <div style={{ display:"flex", gap:".4rem" }}>
              {[GOLD, CYAN, "rgba(168,216,240,.25)"].map((c,i) => (
                <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:c, boxShadow:`0 0 5px ${c}` }} />
              ))}
            </div>
            <span style={{
              fontFamily:"'DM Mono',monospace", fontSize:".6rem",
              letterSpacing:".24em", color:"rgba(168,216,240,.25)",
            }}>
              ESWAR / CONTACT / ACK_RECEIVED
            </span>
            <div style={{
              width:7, height:7, borderRadius:"50%",
              background:"#1dff88", boxShadow:"0 0 8px #1dff88",
              animation:"blink 2.2s ease infinite",
            }} />
          </div>

          {/* Signal node row */}
          <div style={{
            display:"flex", alignItems:"center", gap:"1rem", marginBottom:"2.6rem",
            opacity:0, animation: ready ? "fUp .7s ease .6s forwards" : "none",
          }}>
            <div style={{ position:"relative", width:44, height:44, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              {[0,1].map(i => (
                <div key={i} style={{
                  position:"absolute", inset:0, borderRadius:"50%",
                  border:`1px solid ${CYAN}`,
                  animation:`pulse2 ${1.6 + i*.9}s ease-out ${i*.45}s infinite`,
                }} />
              ))}
              <div style={{ width:12, height:12, borderRadius:"50%", background:CYAN, boxShadow:`0 0 12px ${CYAN}` }} />
            </div>
            <div style={{
              flex:1, height:1,
              background:`linear-gradient(90deg,${CYAN}70,transparent)`,
              transformOrigin:"left",
              animation: ready ? "lineW 1s ease .8s backwards" : "none",
            }} />
            <span style={{
              fontFamily:"'DM Mono',monospace", fontSize:".62rem",
              letterSpacing:".2em", color:CYAN,
            }}>SIGNAL ✓</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily:"'DM Serif Display', Georgia, serif",
            fontSize:"clamp(2.6rem,6vw,3.8rem)", fontWeight:400,
            color:WHITE, lineHeight:1.05,
            margin:"0 0 .4rem", letterSpacing:"-.02em",
            opacity:0, animation: ready ? "fUp .8s ease .9s forwards" : "none",
          }}>
            Thank{" "}
            <em style={{
              fontStyle:"italic",
              background:`linear-gradient(135deg,${CYAN} 20%,${GOLD})`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            }}>you.</em>
          </h1>

          {/* Gold rule */}
          <div style={{
            height:1, marginBottom:"2.4rem",
            background:`linear-gradient(90deg,${GOLD}70,transparent)`,
            transformOrigin:"left",
            opacity:0, animation: ready ? "lineW .9s ease 1.1s forwards" : "none",
          }} />

          {/* Scramble lines */}
          <div style={{
            display:"flex", flexDirection:"column", gap:".55rem", marginBottom:"2.8rem",
            opacity:0, animation: ready ? "fUp .7s ease 1.2s forwards" : "none",
          }}>
            {[
              { text:s1, col:ICE,                        num:"01" },
              { text:s2, col:"rgba(168,216,240,.5)",     num:"02", cursor:true },
              { text:s3, col:"rgba(168,216,240,.5)",     num:"03" },
            ].map(({text, col, num, cursor}) => (
              <div key={num} style={{
                fontFamily:"'DM Mono',monospace", fontSize:".9rem",
                color:col, lineHeight:1.75, display:"flex", gap:".55rem", alignItems:"baseline",
              }}>
                <span style={{ color:GOLD, opacity:.5, userSelect:"none", flexShrink:0 }}>{num}.</span>
                {text}
                {cursor && (
                  <span style={{
                    width:2, height:"1.1em", background:CYAN, display:"inline-block",
                    animation:"blink 1.1s step-end infinite", marginLeft:2,
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{
            display:"flex", gap:"1rem", flexWrap:"wrap",
            opacity:0, animation: ready ? "fUp .7s ease 1.5s forwards" : "none",
          }}>
            <a href="index.html" className="btn-e btn-main"
              onClick={() => { clearInterval(cdRef.current); setCd(null); }}>
              <span>← Portfolio</span>
            </a>
            <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noreferrer"
              className="btn-e btn-ghost"
              onClick={() => { clearInterval(cdRef.current); setCd(null); }}>
              <span>LinkedIn ↗</span>
            </a>
          </div>

          {/* Countdown bar */}
          {cd !== null && (
            <div style={{
              marginTop:"2.4rem",
              opacity:0, animation: ready ? "fUp .6s ease 1.8s forwards" : "none",
            }}>
              <div style={{ height:1, background:"rgba(168,216,240,.07)", borderRadius:1, overflow:"hidden", marginBottom:".5rem" }}>
                <div style={{
                  height:"100%",
                  background:`linear-gradient(90deg,${GOLD},${CYAN})`,
                  transformOrigin:"left",
                  animation:`cdBar ${cd}s linear forwards`,
                }} />
              </div>
              <span style={{
                fontFamily:"'DM Mono',monospace", fontSize:".6rem",
                letterSpacing:".18em", color:"rgba(168,216,240,.28)",
              }}>
                AUTO-RETURN IN {cd}s — CLICK ANYWHERE TO LAUNCH SPARKS
              </span>
            </div>
          )}

          {/* Corner accents */}
          <div style={{
            position:"absolute", top:0, right:0, width:48, height:48,
            borderTop:`1px solid ${GOLD}55`, borderRight:`1px solid ${GOLD}55`,
            borderRadius:"0 3px 0 0", pointerEvents:"none",
          }} />
          <div style={{
            position:"absolute", bottom:0, left:0, width:32, height:32,
            borderBottom:`1px solid rgba(0,200,255,.12)`,
            borderLeft:`1px solid rgba(0,200,255,.12)`,
            borderRadius:"0 0 0 3px", pointerEvents:"none",
          }} />
        </div>
      </div>
    </div>
  );
}
