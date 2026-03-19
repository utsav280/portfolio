import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;cursor:none!important}
html{scroll-behavior:smooth}
body{background:#040412;overflow-x:hidden;font-family:'Space Grotesk',system-ui,sans-serif}
@keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
@keyframes gshift{0%{background-position:0%}50%{background-position:100%}100%{background-position:0%}}
@keyframes float{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-18px) rotate(1deg)}}
@keyframes sla{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
@keyframes dpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.8)}}
@keyframes blink{50%{opacity:0}}
@keyframes lload{to{width:100%}}
@keyframes lpulse{from{opacity:.65}to{opacity:1}}
.gname{background:linear-gradient(135deg,#fff 20%,#00d4ff 60%,#7b2fff 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-size:300%;animation:gshift 6s ease infinite}
.gem{font-style:normal;background:linear-gradient(135deg,#00d4ff,#7b2fff);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sline{animation:sla 2.2s ease-in-out infinite}
.dpulse{animation:dpulse 2s ease-in-out infinite}
.blink{animation:blink .7s step-end infinite;display:inline-block;width:2px;height:1.15em;background:#00d4ff;vertical-align:text-bottom;margin-left:2px}
.fl1{animation:float 7s ease-in-out infinite}
.fl2{animation:float 7s ease-in-out -2.5s infinite}
.fl3{animation:float 7s ease-in-out -5s infinite}
.lpulse{animation:lpulse 1.2s ease-in-out infinite alternate}
.lbar{animation:lload 2.2s cubic-bezier(.4,0,.2,1) forwards;height:100%;width:0;background:linear-gradient(90deg,#00d4ff,#7b2fff);border-radius:2px}
.rv{opacity:0;transform:translateY(38px);transition:opacity .8s ease,transform .8s ease}
.rv.on{opacity:1;transform:none}
.rv2{opacity:0;transform:translateY(38px);transition:opacity .8s .12s ease,transform .8s .12s ease}
.rv2.on{opacity:1;transform:none}
.rv3{opacity:0;transform:translateY(38px);transition:opacity .8s .24s ease,transform .8s .24s ease}
.rv3.on{opacity:1;transform:none}
.bfill{width:0;transition:width 1.3s cubic-bezier(.4,0,.2,1);height:100%;background:linear-gradient(90deg,#00d4ff,#7b2fff);border-radius:2px;box-shadow:0 0 10px rgba(0,212,255,.4)}
`;

const P = "#00d4ff",
  S = "#7b2fff",
  A = "#00ff88";
const MT = "rgba(228,228,248,.45)",
  TX = "#e4e4f8";
const BG_CARD = "rgba(255,255,255,.025)";
const BD = "rgba(0,212,255,.12)",
  BDH = "rgba(0,212,255,.38)";
const G = `linear-gradient(135deg,${P},${S})`;
const DVD = {
  width: "100%",
  height: "1px",
  background: `linear-gradient(90deg,transparent,rgba(0,212,255,.15),transparent)`,
};
const JB = "'JetBrains Mono',monospace";

const SecLabel = ({ n, lbl }) => (
  <div
    style={{
      fontFamily: JB,
      fontSize: "11.5px",
      letterSpacing: "4px",
      textTransform: "uppercase",
      color: P,
      marginBottom: "14px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }}
  >
    {n} — {lbl}{" "}
    <span
      style={{
        width: "50px",
        height: "1px",
        background: `rgba(0,212,255,.4)`,
        display: "inline-block",
      }}
    />
  </div>
);
const SecTitle = ({ children }) => (
  <h2
    style={{
      fontSize: "clamp(34px,5vw,58px)",
      fontWeight: 700,
      letterSpacing: "-1.5px",
      lineHeight: 1.1,
      marginBottom: "56px",
    }}
  >
    {children}
  </h2>
);

export default function Portfolio() {
  const canvasRef = useRef(null);
  const curRef = useRef(null);
  const crgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [tc, setTc] = useState("");
  const [navUp, setNavUp] = useState(false);

  // Cursor
  useEffect(() => {
    let rx = 0,
      ry = 0,
      mx = 0,
      my = 0,
      af;
    const mm = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (curRef.current) {
        curRef.current.style.left = mx + "px";
        curRef.current.style.top = my + "px";
      }
    };
    const loop = () => {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      if (crgRef.current) {
        crgRef.current.style.left = rx + "px";
        crgRef.current.style.top = ry + "px";
      }
      af = requestAnimationFrame(loop);
    };
    document.addEventListener("mousemove", mm);
    loop();
    return () => {
      document.removeEventListener("mousemove", mm);
      cancelAnimationFrame(af);
    };
  }, []);

  const cIn = () => {
    if (!curRef.current) return;
    curRef.current.style.width = "18px";
    curRef.current.style.height = "18px";
    if (crgRef.current) {
      crgRef.current.style.width = "54px";
      crgRef.current.style.height = "54px";
    }
  };
  const cOut = () => {
    if (!curRef.current) return;
    curRef.current.style.width = "8px";
    curRef.current.style.height = "8px";
    if (crgRef.current) {
      crgRef.current.style.width = "38px";
      crgRef.current.style.height = "38px";
    }
  };

  // Loader
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 2400);
    return () => clearTimeout(t);
  }, []);

  // Three.js
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ren = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    ren.setPixelRatio(Math.min(devicePixelRatio, 2));
    ren.setSize(innerWidth, innerHeight);
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(
      70,
      innerWidth / innerHeight,
      0.1,
      1000,
    );
    cam.position.z = 30;
    scene.add(new THREE.AmbientLight(0x001133, 0.9));
    const L1 = new THREE.PointLight(0x00d4ff, 2.5, 80);
    L1.position.set(18, 18, 10);
    scene.add(L1);
    const L2 = new THREE.PointLight(0x7b2fff, 2, 70);
    L2.position.set(-18, -10, 10);
    scene.add(L2);
    const N = 1800,
      pos = new Float32Array(N * 3),
      col = new Float32Array(N * 3);
    const c1 = new THREE.Color(0x00d4ff),
      c2 = new THREE.Color(0x7b2fff),
      c3 = new THREE.Color(0x00ff88);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 170;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 170;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 90;
      const t = Math.random();
      const c =
        t < 0.5
          ? c1.clone().lerp(c2, t * 2)
          : c2.clone().lerp(c3, (t - 0.5) * 2);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pg.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const pts = new THREE.Points(
      pg,
      new THREE.PointsMaterial({
        size: 0.28,
        vertexColors: true,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(pts);
    const geos = [
      new THREE.IcosahedronGeometry(2.2, 0),
      new THREE.TorusGeometry(1.9, 0.45, 8, 22),
      new THREE.OctahedronGeometry(2.1, 0),
      new THREE.TetrahedronGeometry(2.3, 0),
      new THREE.IcosahedronGeometry(1.4, 0),
      new THREE.TorusGeometry(1.4, 0.3, 6, 16),
    ];
    const OP = [
      [-16, 9, -12],
      [15, -7, -9],
      [-9, -13, -6],
      [19, 11, -14],
      [-19, 3, -16],
      [8, 15, -10],
    ];
    const OR = [
      [0.005, 0.008, 0.003],
      [0.007, 0.004, 0.009],
      [0.003, 0.009, 0.006],
      [0.008, 0.003, 0.007],
      [0.006, 0.007, 0.004],
      [0.004, 0.006, 0.008],
    ];
    const OC = [0x00d4ff, 0x7b2fff, 0x00ff88];
    const objs = geos.map((g, i) => {
      const m = new THREE.Mesh(
        g,
        new THREE.MeshPhongMaterial({
          color: OC[i % 3],
          wireframe: true,
          transparent: true,
          opacity: 0.14,
        }),
      );
      m.position.set(...OP[i]);
      m.userData.r = OR[i];
      scene.add(m);
      return m;
    });
    let mmx = 0,
      mmy = 0,
      T = 0,
      af;
    const onMM = (e) => {
      mmx = (e.clientX / innerWidth - 0.5) * 0.6;
      mmy = -(e.clientY / innerHeight - 0.5) * 0.4;
    };
    const onRS = () => {
      cam.aspect = innerWidth / innerHeight;
      cam.updateProjectionMatrix();
      ren.setSize(innerWidth, innerHeight);
    };
    document.addEventListener("mousemove", onMM);
    window.addEventListener("resize", onRS);
    const animate = () => {
      af = requestAnimationFrame(animate);
      T += 0.005;
      pts.rotation.y = T * 0.018;
      pts.rotation.x = T * 0.009;
      objs.forEach((o, i) => {
        o.rotation.x += o.userData.r[0];
        o.rotation.y += o.userData.r[1];
        o.rotation.z += o.userData.r[2];
        o.position.y += Math.sin(T + i * 1.2) * 0.007;
      });
      cam.position.x += (mmx * 8 - cam.position.x) * 0.04;
      cam.position.y += (mmy * 5 - cam.position.y) * 0.04;
      cam.lookAt(scene.position);
      L1.position.x = Math.sin(T * 0.4) * 22;
      L1.position.y = Math.cos(T * 0.25) * 14;
      L2.position.x = Math.cos(T * 0.35) * 18;
      L2.position.y = Math.sin(T * 0.5) * 16;
      ren.render(scene, cam);
    };
    animate();
    return () => {
      cancelAnimationFrame(af);
      document.removeEventListener("mousemove", onMM);
      window.removeEventListener("resize", onRS);
      ren.dispose();
    };
  }, []);

  // Typewriter
  useEffect(() => {
    const roles = [
      "Frontend Developer",
      "React.js Expert",
      "TypeScript Engineer",
      "UI Performance Ninja",
      "Component Architect",
    ];
    let ri = 0,
      ci = 0,
      del = false,
      tm;
    const tw = () => {
      const cur = roles[ri];
      if (del) {
        ci--;
        setTc(cur.slice(0, ci));
        if (ci === 0) {
          del = false;
          ri = (ri + 1) % roles.length;
          tm = setTimeout(tw, 500);
          return;
        }
        tm = setTimeout(tw, 48);
      } else {
        ci++;
        setTc(cur.slice(0, ci));
        if (ci === cur.length) {
          del = true;
          tm = setTimeout(tw, 2200);
          return;
        }
        tm = setTimeout(tw, 88);
      }
    };
    tm = setTimeout(tw, 3100);
    return () => clearTimeout(tm);
  }, []);

  // Scroll
  useEffect(() => {
    const rvEls = document.querySelectorAll(".rv,.rv2,.rv3");
    const ro = new IntersectionObserver(
      (en) =>
        en.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("on");
            ro.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    rvEls.forEach((el) => ro.observe(el));
    const snums = document.querySelectorAll(".snum");
    const sno = new IntersectionObserver(
      (en) =>
        en.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target,
              tgt = parseFloat(el.dataset.t),
              suf = el.dataset.s || "",
              dec = String(tgt).includes(".");
            let cur = 0;
            const itv = setInterval(() => {
              cur += tgt / (1600 / 16);
              if (cur >= tgt) {
                cur = tgt;
                clearInterval(itv);
              }
              el.textContent = (dec ? cur.toFixed(1) : Math.floor(cur)) + suf;
            }, 16);
            sno.unobserve(el);
          }
        }),
      { threshold: 0.5 },
    );
    snums.forEach((el) => sno.observe(el));
    const bars = document.querySelectorAll(".bfill");
    const bro = new IntersectionObserver(
      (en) =>
        en.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => {
              e.target.style.width = e.target.dataset.w + "%";
            }, 250);
            bro.unobserve(e.target);
          }
        }),
      { threshold: 0.3 },
    );
    bars.forEach((b) => bro.observe(b));
    let lastY = 0;
    const onSc = () => {
      const y = scrollY;
      setNavUp(y > lastY && y > 80);
      lastY = y;
    };
    window.addEventListener("scroll", onSc, { passive: true });
    return () => {
      ro.disconnect();
      sno.disconnect();
      bro.disconnect();
      window.removeEventListener("scroll", onSc);
    };
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  const tilt = (e, card) => {
    const r = card.getBoundingClientRect(),
      x = e.clientX - r.left - r.width / 2,
      y = e.clientY - r.top - r.height / 2;
    card.style.transform = `translateY(-8px) rotateX(${(y / r.height) * -14}deg) rotateY(${(x / r.width) * 14}deg)`;
  };

  const SKILLS = [
    [
      "⚛",
      "Frontend (React Stack)",
      [
        "React.js",
        "TypeScript",
        "JavaScript ES6+",
        "HTML5",
        "CSS3",
        "TailwindCSS",
      ],
    ],
    [
      "🗄",
      "State Management",
      [
        "Redux Toolkit",
        "Context API",
        "React Hooks",
        "useState",
        "useEffect",
        "useReducer",
      ],
    ],
    [
      "🔌",
      "API Integration",
      [
        "REST APIs",
        "Axios",
        "Fetch API",
        "Async/Await",
        "Error Handling",
        "Loading States",
      ],
    ],
    [
      "⚡",
      "Performance",
      [
        "React.memo",
        "useMemo",
        "useCallback",
        "Code Splitting",
        "Lazy Loading",
        "Memoization",
      ],
    ],
    [
      "🔧",
      "Dev Tools",
      ["Git / GitHub", "VS Code", "Figma", "Vite", "Webpack", "Locofy"],
    ],
    [
      "🏛",
      "Architecture",
      [
        "Component Design",
        "Agile / Scrum",
        "Design Systems",
        "Responsive UI",
        "Modular Patterns",
      ],
    ],
  ];
  const BARS = [
    ["React.js / TypeScript", 95],
    ["JavaScript ES6+", 92],
    ["CSS3 / TailwindCSS", 90],
    ["Redux Toolkit", 85],
    ["REST API Integration", 88],
  ];
  const PROJECTS = [
    {
      ico: "🍽️",
      t: "Restaurant Finder",
      d: "React-based restaurant discovery platform with dynamic API-driven listings and efficient filtering logic. Built with performance-first mindset and smooth UX interactions.",
      tags: ["React.js", "JavaScript", "REST API", "CSS3"],
    },
    {
      ico: "✈️",
      t: "AI Travel Planner",
      d: "AI-powered itinerary planner using asynchronous API calls and dynamic UI rendering. Generates smart travel plans with real-time data and seamless interactive UX.",
      tags: ["React.js", "AI API", "Async/Await", "TailwindCSS"],
    },
    {
      ico: "🎬",
      t: "Netflix Clone",
      d: "Fully functional streaming UI with real-time movie data from TMDB APIs. Features genre-based browsing, dynamic carousels, and pixel-perfect React components.",
      tags: ["React.js", "TMDB API", "Redux", "CSS3"],
    },
  ];
  const EXP = [
    {
      date: "OCT 2024 — PRESENT",
      co: "Infosys Finacle",
      role: "Senior System Engineer · Frontend Developer (React.js)",
      pts: [
        "Build scalable, reusable React + TypeScript components for enterprise banking apps.",
        "Translate Figma designs into responsive pixel-perfect UI using modern layout techniques.",
        "Reduced unnecessary re-renders by 30% using memoization, useMemo & useCallback.",
        "Integrate REST APIs with robust loading, error, and empty state handling.",
        "Refactor legacy frontend modules improving stability and maintainability.",
      ],
    },
    {
      date: "AUG 2022 — SEP 2024",
      co: "Infosys Finacle",
      role: "System Engineer · Frontend Developer (React.js)",
      pts: [
        "Developed responsive UI modules using React.js, JavaScript ES6+, HTML5 & CSS3.",
        "Implemented modular component architecture reducing dev effort by 35%.",
        "Integrated REST APIs with API response mapping and dynamic state updates.",
        "Collaborated with backend & QA teams in Agile sprint cycles to ship features on time.",
      ],
    },
  ];

  const cardHover = (e, enter) => {
    const c = e.currentTarget;
    c.style.borderColor = enter ? BDH : BD;
    if (!enter) c.style.transform = "";
  };

  return (
    <>
      <style>{CSS}</style>

      {/* Custom Cursor */}
      <div
        ref={curRef}
        style={{
          position: "fixed",
          width: "8px",
          height: "8px",
          background: P,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99999,
          transform: "translate(-50%,-50%)",
          boxShadow: `0 0 12px ${P},0 0 40px rgba(0,212,255,.4)`,
          transition: "width .15s,height .15s",
        }}
      />
      <div
        ref={crgRef}
        style={{
          position: "fixed",
          width: "38px",
          height: "38px",
          border: `1.5px solid rgba(0,212,255,.55)`,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99998,
          transform: "translate(-50%,-50%)",
          transition: "width .12s,height .12s",
        }}
      />

      {/* Loader */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100000,
          background: "#040412",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "22px",
          transition: "opacity .9s ease,visibility .9s ease",
          opacity: loaded ? 0 : 1,
          visibility: loaded ? "hidden" : "visible",
        }}
      >
        <div
          className="lpulse"
          style={{
            fontFamily: JB,
            fontSize: "52px",
            fontWeight: 700,
            background: G,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          UG
        </div>
        <div
          style={{
            width: "200px",
            height: "2px",
            background: "rgba(255,255,255,.08)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div className="lbar" />
        </div>
        <div
          className="blink"
          style={{
            fontFamily: JB,
            fontSize: "11px",
            color: MT,
            letterSpacing: "3px",
            animation: "blink .7s step-end infinite",
            display: "block",
            width: "auto",
            height: "auto",
            background: "none",
            marginLeft: 0,
            verticalAlign: "baseline",
          }}
        >
          LOADING PORTFOLIO...
        </div>
      </div>

      {/* Three.js BG */}
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
      />

      {/* App */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          color: TX,
          overflowX: "hidden",
        }}
      >
        {/* NAV */}
        <nav
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            height: "68px",
            padding: "0 6vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(4,4,18,.65)",
            backdropFilter: "blur(22px)",
            borderBottom: "1px solid rgba(0,212,255,.07)",
            transition: "transform .3s ease",
            transform: navUp ? "translateY(-100%)" : "none",
          }}
        >
          <div
            style={{
              fontFamily: JB,
              fontSize: "18px",
              fontWeight: 700,
              background: G,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Utsav.dev
          </div>
          <div style={{ display: "flex", gap: "32px" }}>
            {["about", "experience", "skills", "projects", "contact"].map(
              (s) => (
                <button
                  key={s}
                  onClick={() => scrollTo(s)}
                  onMouseEnter={cIn}
                  onMouseLeave={cOut}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "12px",
                    fontWeight: 500,
                    letterSpacing: "1.8px",
                    textTransform: "uppercase",
                    color: MT,
                    cursor: "none",
                    transition: "color .3s",
                    padding: "4px 0",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = P)}
                  onMouseOut={(e) => (e.currentTarget.style.color = MT)}
                >
                  {s.toUpperCase()}
                </button>
              ),
            )}
          </div>
        </nav>

        {/* HERO */}
        <section
          id="hero"
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            padding: "0 8vw",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {[
            ["⚛ React.js", "13%", "28%", "fl1"],
            ["📦 TypeScript", "7%", "52%", "fl2"],
            ["🎨 TailwindCSS", "19%", "71%", "fl3"],
          ].map(([t, r, top, fl]) => (
            <div
              key={t}
              className={fl}
              style={{
                position: "absolute",
                right: r,
                top: top,
                fontFamily: JB,
                fontSize: "11px",
                padding: "8px 16px",
                background: "rgba(0,212,255,.05)",
                border: "1px solid rgba(0,212,255,.18)",
                borderRadius: "6px",
                color: P,
                backdropFilter: "blur(12px)",
                pointerEvents: "none",
              }}
            >
              {t}
            </div>
          ))}
          <div style={{ maxWidth: "760px" }}>
            <div
              style={{
                fontFamily: JB,
                fontSize: "12px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: A,
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                animation: "fadeUp .7s 2.3s both",
              }}
            >
              <div style={{ width: "36px", height: "1px", background: A }} />
              <div
                className="dpulse"
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: A,
                  boxShadow: `0 0 8px ${A}`,
                }}
              />
              Available for opportunities
            </div>
            <h1
              style={{
                fontSize: "clamp(54px,9vw,100px)",
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-3px",
                marginBottom: "14px",
                animation: "fadeUp .7s 2.5s both",
              }}
            >
              <span className="gname">Utsav Goyal</span>
            </h1>
            <div
              style={{
                fontFamily: JB,
                fontSize: "clamp(18px,2.8vw,28px)",
                color: MT,
                marginBottom: "26px",
                animation: "fadeUp .7s 2.7s both",
                minHeight: "46px",
              }}
            >
              <span style={{ color: P }}>{tc}</span>
              <span className="blink" />
            </div>
            <p
              style={{
                fontSize: "16.5px",
                lineHeight: 1.85,
                color: MT,
                maxWidth: "540px",
                marginBottom: "44px",
                animation: "fadeUp .7s 2.9s both",
              }}
            >
              <strong style={{ color: TX }}>Frontend Developer</strong> crafting
              enterprise-grade web apps with{" "}
              <strong style={{ color: TX }}>React.js</strong> &{" "}
              <strong style={{ color: TX }}>TypeScript</strong>. 3.5+ years
              building scalable UI systems at{" "}
              <strong style={{ color: TX }}>Infosys Finacle</strong> — turning
              Figma into flawless, fast production UIs.
            </p>
            <div
              style={{
                display: "flex",
                gap: "14px",
                flexWrap: "wrap",
                animation: "fadeUp .7s 3.1s both",
              }}
            >
              {[
                ["View My Work", "projects", true],
                ["Get In Touch", "contact", false],
              ].map(([lbl, t, pri]) => (
                <button
                  key={t}
                  onClick={() => scrollTo(t)}
                  onMouseEnter={cIn}
                  onMouseLeave={cOut}
                  style={{
                    padding: "13px 30px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "1.2px",
                    textTransform: "uppercase",
                    cursor: "none",
                    transition: "all .3s",
                    background: pri ? G : "transparent",
                    color: pri ? "#fff" : P,
                    border: pri ? "none" : `1px solid rgba(0,212,255,.35)`,
                    boxShadow: pri ? `0 0 28px rgba(0,212,255,.25)` : "none",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = pri
                      ? "0 0 50px rgba(0,212,255,.45)"
                      : "0 0 22px rgba(0,212,255,.2)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = pri
                      ? "0 0 28px rgba(0,212,255,.25)"
                      : "none";
                  }}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "38px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              animation: "fadeUp .7s 3.5s both",
            }}
          >
            <span
              style={{
                fontFamily: JB,
                fontSize: "9px",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: MT,
              }}
            >
              Scroll
            </span>
            <div
              className="sline"
              style={{
                width: "1px",
                height: "56px",
                background: `linear-gradient(to bottom,${P},transparent)`,
              }}
            />
          </div>
        </section>

        <div style={DVD} />

        {/* ABOUT */}
        <section id="about" style={{ padding: "110px 8vw" }}>
          <div className="rv">
            <SecLabel n="01" lbl="About" />
          </div>
          <div className="rv">
            <SecTitle>
              Turning ideas into <em className="gem">experiences</em>
            </SecTitle>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "72px",
              alignItems: "center",
            }}
          >
            <div
              className="rv2"
              style={{ fontSize: "16.5px", lineHeight: 1.9, color: MT }}
            >
              <p style={{ marginBottom: "18px" }}>
                I'm a{" "}
                <strong style={{ color: TX }}>Senior Frontend Developer</strong>{" "}
                at Infosys Finacle, specializing in enterprise-scale banking
                applications with React.js and TypeScript.
              </p>
              <p style={{ marginBottom: "18px" }}>
                My expertise spans architecting{" "}
                <strong style={{ color: TX }}>modular component systems</strong>
                , integrating REST APIs, and{" "}
                <strong style={{ color: TX }}>optimizing performance</strong>{" "}
                for production.
              </p>
              <p>
                Great software lives at the intersection of{" "}
                <strong style={{ color: TX }}>engineering discipline</strong>{" "}
                and <strong style={{ color: TX }}>design sensibility</strong>.
                Every component I write is built to last.
              </p>
            </div>
            <div
              className="rv3"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {[
                ["3.5", "+", "Years Experience"],
                ["30", "%", "Performance Boost"],
                ["35", "%", "Dev Effort Saved"],
                ["10", "+", "Projects Shipped"],
              ].map(([t, s, l]) => (
                <div
                  key={l}
                  onMouseEnter={cIn}
                  onMouseLeave={cOut}
                  style={{
                    padding: "26px",
                    borderRadius: "14px",
                    background: BG_CARD,
                    border: `1px solid ${BD}`,
                    backdropFilter: "blur(12px)",
                    textAlign: "center",
                    transition: "all .3s",
                    cursor: "none",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = BDH;
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = BD;
                    e.currentTarget.style.transform = "";
                  }}
                >
                  <div
                    className="snum"
                    data-t={t}
                    data-s={s}
                    style={{
                      fontSize: "46px",
                      fontWeight: 700,
                      lineHeight: 1,
                      background: G,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      marginBottom: "8px",
                    }}
                  >
                    0
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: MT,
                      letterSpacing: "2.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div style={DVD} />

        {/* EXPERIENCE */}
        <section id="experience" style={{ padding: "110px 8vw" }}>
          <div className="rv">
            <SecLabel n="02" lbl="Experience" />
          </div>
          <div className="rv">
            <SecTitle>
              Where I've <em className="gem">worked</em>
            </SecTitle>
          </div>
          <div style={{ position: "relative", paddingLeft: "36px" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "1px",
                background: `linear-gradient(to bottom,${P},${S} 60%,transparent)`,
              }}
            />
            {EXP.map((item, i) => (
              <div
                key={i}
                className={i === 0 ? "rv" : "rv2"}
                style={{
                  position: "relative",
                  marginBottom: "56px",
                  paddingLeft: "36px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "-44px",
                    top: "10px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "#040412",
                    border: `2px solid ${P}`,
                    boxShadow: `0 0 14px rgba(0,212,255,.45)`,
                  }}
                />
                <div
                  style={{
                    fontFamily: JB,
                    fontSize: "11px",
                    color: P,
                    letterSpacing: "2px",
                    marginBottom: "6px",
                  }}
                >
                  {item.date}
                </div>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    marginBottom: "4px",
                  }}
                >
                  {item.co}
                </div>
                <div
                  style={{
                    fontFamily: JB,
                    fontSize: "13.5px",
                    color: MT,
                    marginBottom: "18px",
                  }}
                >
                  {item.role}
                </div>
                <ul style={{ listStyle: "none" }}>
                  {item.pts.map((p, j) => (
                    <li
                      key={j}
                      style={{
                        fontSize: "14.5px",
                        color: MT,
                        lineHeight: 1.75,
                        marginBottom: "10px",
                        paddingLeft: "18px",
                        position: "relative",
                      }}
                    >
                      <span style={{ position: "absolute", left: 0, color: P }}>
                        ▸
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div style={DVD} />

        {/* SKILLS */}
        <section id="skills" style={{ padding: "110px 8vw" }}>
          <div className="rv">
            <SecLabel n="03" lbl="Skills" />
          </div>
          <div className="rv">
            <SecTitle>
              My <em className="gem">toolkit</em>
            </SecTitle>
          </div>
          <div
            className="rv2"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: "20px",
              marginBottom: "50px",
            }}
          >
            {SKILLS.map(([ico, cat, tags]) => (
              <div
                key={cat}
                onMouseEnter={cIn}
                onMouseLeave={cOut}
                style={{
                  padding: "26px",
                  borderRadius: "14px",
                  background: BG_CARD,
                  border: `1px solid ${BD}`,
                  backdropFilter: "blur(12px)",
                  transition: "all .3s",
                  cursor: "none",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = BDH;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = BD;
                  e.currentTarget.style.transform = "";
                }}
              >
                <div
                  style={{
                    fontFamily: JB,
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: P,
                    marginBottom: "18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {ico} {cat}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {tags.map((tg) => (
                    <span
                      key={tg}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "4px",
                        fontSize: "12.5px",
                        fontWeight: 500,
                        background: "rgba(255,255,255,.04)",
                        border: "1px solid rgba(255,255,255,.08)",
                        color: TX,
                        transition: "all .3s",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "rgba(0,212,255,.1)";
                        e.currentTarget.style.borderColor = BDH;
                        e.currentTarget.style.color = P;
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,.04)";
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,.08)";
                        e.currentTarget.style.color = TX;
                        e.currentTarget.style.transform = "";
                      }}
                    >
                      {tg}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="rv3">
            {BARS.map(([n, w]) => (
              <div key={n} style={{ marginBottom: "22px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "7px",
                  }}
                >
                  <span style={{ fontSize: "13.5px", fontWeight: 600 }}>
                    {n}
                  </span>
                  <span style={{ fontFamily: JB, fontSize: "11px", color: P }}>
                    {w}%
                  </span>
                </div>
                <div
                  style={{
                    height: "3px",
                    background: "rgba(255,255,255,.05)",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div className="bfill" data-w={w} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={DVD} />

        {/* PROJECTS */}
        <section id="projects" style={{ padding: "110px 8vw" }}>
          <div className="rv">
            <SecLabel n="04" lbl="Projects" />
          </div>
          <div className="rv">
            <SecTitle>
              Things I've <em className="gem">built</em>
            </SecTitle>
          </div>
          <div
            className="rv2"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: "22px",
            }}
          >
            {PROJECTS.map(({ ico, t, d, tags }) => (
              <div
                key={t}
                onMouseEnter={cIn}
                onMouseLeave={cOut}
                onMouseMove={(e) => tilt(e, e.currentTarget)}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "";
                  e.currentTarget.style.borderColor = BD;
                  cOut();
                }}
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: BG_CARD,
                  border: `1px solid ${BD}`,
                  backdropFilter: "blur(12px)",
                  transition: "border-color .4s ease",
                  cursor: "none",
                  transformStyle: "preserve-3d",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = BDH;
                  e.currentTarget.style.boxShadow =
                    "0 20px 60px rgba(0,212,255,.1)";
                }}
              >
                <div
                  style={{
                    padding: "26px 26px 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "10px",
                      background: `linear-gradient(135deg,rgba(0,212,255,.12),rgba(123,47,255,.12))`,
                      border: `1px solid rgba(0,212,255,.18)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "22px",
                    }}
                  >
                    {ico}
                  </div>
                  <a
                    href="https://github.com/utsav280"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={cIn}
                    onMouseLeave={cOut}
                    style={{
                      width: "30px",
                      height: "30px",
                      background: "rgba(255,255,255,.05)",
                      border: "1px solid rgba(255,255,255,.1)",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: MT,
                      textDecoration: "none",
                      fontSize: "14px",
                      transition: "all .3s",
                      fontFamily: JB,
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "rgba(0,212,255,.1)";
                      e.currentTarget.style.borderColor = P;
                      e.currentTarget.style.color = P;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,.05)";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,.1)";
                      e.currentTarget.style.color = MT;
                    }}
                  >
                    ↗
                  </a>
                </div>
                <div style={{ padding: "18px 26px 26px" }}>
                  <div
                    style={{
                      fontSize: "19px",
                      fontWeight: 700,
                      marginBottom: "9px",
                    }}
                  >
                    {t}
                  </div>
                  <div
                    style={{
                      fontSize: "13.5px",
                      color: MT,
                      lineHeight: 1.72,
                      marginBottom: "18px",
                    }}
                  >
                    {d}
                  </div>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}
                  >
                    {tags.map((tg) => (
                      <span
                        key={tg}
                        style={{
                          padding: "4px 11px",
                          borderRadius: "20px",
                          fontFamily: JB,
                          fontSize: "10.5px",
                          fontWeight: 500,
                          background: "rgba(0,212,255,.08)",
                          color: P,
                          border: `1px solid rgba(0,212,255,.15)`,
                        }}
                      >
                        {tg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={DVD} />

        {/* CERTIFICATIONS */}
        <section id="certifications" style={{ padding: "110px 8vw" }}>
          <div className="rv">
            <SecLabel n="05" lbl="Certifications" />
          </div>
          <div className="rv">
            <SecTitle>
              Keep <em className="gem">learning</em>
            </SecTitle>
          </div>
          <div
            className="rv2"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
              gap: "18px",
            }}
          >
            {[
              ["🏆", "JavaScript (ES6+)", "Udemy"],
              ["⚛", "React.js", "NamasteDev"],
              ["🎓", "React.js", "Infosys"],
            ].map(([ico, n, i]) => (
              <div
                key={n + i}
                onMouseEnter={cIn}
                onMouseLeave={cOut}
                style={{
                  padding: "22px",
                  borderRadius: "12px",
                  background: BG_CARD,
                  border: `1px solid ${BD}`,
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  transition: "all .3s",
                  cursor: "none",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = BDH;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = BD;
                  e.currentTarget.style.transform = "";
                }}
              >
                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "10px",
                    background: G,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    flexShrink: 0,
                  }}
                >
                  {ico}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      marginBottom: "3px",
                    }}
                  >
                    {n}
                  </div>
                  <div
                    style={{ fontFamily: JB, fontSize: "11.5px", color: MT }}
                  >
                    {i}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={DVD} />

        {/* CONTACT */}
        <section
          id="contact"
          style={{ padding: "120px 8vw", textAlign: "center" }}
        >
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <div
              className="rv"
              style={{
                fontFamily: JB,
                fontSize: "11.5px",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: P,
                marginBottom: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              06 — Contact{" "}
              <span
                style={{
                  width: "50px",
                  height: "1px",
                  background: `rgba(0,212,255,.4)`,
                  display: "inline-block",
                }}
              />
            </div>
            <div className="rv">
              <h2
                style={{
                  fontSize: "clamp(38px,6vw,70px)",
                  fontWeight: 700,
                  letterSpacing: "-2.5px",
                  lineHeight: 1,
                  marginBottom: "22px",
                }}
              >
                Let's build something <em className="gem">great</em>
              </h2>
            </div>
            <div className="rv2">
              <p
                style={{
                  fontSize: "16.5px",
                  color: MT,
                  lineHeight: 1.8,
                  marginBottom: "44px",
                }}
              >
                Open to new opportunities. Whether you have a project in mind, a
                position to fill, or just want to talk frontend — my inbox is
                always open.
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: "14px",
                }}
              >
                {[
                  ["✉", "mailto:utsav28feb@gmail.com", "utsav28feb@gmail.com"],
                  ["in", "https://linkedin.com/in/utsav-goyal28", "LinkedIn"],
                  ["⌥", "https://github.com/utsav280", "GitHub"],
                  ["☎", "tel:+918630967084", "+91 86309 67084"],
                ].map(([ico, href, lbl]) => (
                  <a
                    key={lbl}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    onMouseEnter={cIn}
                    onMouseLeave={cOut}
                    style={{
                      padding: "13px 26px",
                      borderRadius: "8px",
                      border: `1px solid ${BD}`,
                      background: BG_CARD,
                      color: TX,
                      textDecoration: "none",
                      fontSize: "13.5px",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      transition: "all .3s",
                      cursor: "none",
                      backdropFilter: "blur(10px)",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = P;
                      e.currentTarget.style.color = P;
                      e.currentTarget.style.boxShadow =
                        "0 0 24px rgba(0,212,255,.14)";
                      e.currentTarget.style.transform = "translateY(-3px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = BD;
                      e.currentTarget.style.color = TX;
                      e.currentTarget.style.boxShadow = "";
                      e.currentTarget.style.transform = "";
                    }}
                  >
                    <span style={{ fontSize: "17px" }}>{ico}</span> {lbl}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer
          style={{
            textAlign: "center",
            padding: "30px",
            borderTop: "1px solid rgba(255,255,255,.05)",
            fontFamily: JB,
            fontSize: "11.5px",
            color: MT,
            letterSpacing: "1px",
          }}
        >
          Designed & Built with <span style={{ color: P }}>React.js</span> +{" "}
          <span style={{ color: S }}>TailwindCSS</span> by{" "}
          <span style={{ color: A }}>Utsav Goyal</span> — 2025 ⚡
        </footer>
      </div>
    </>
  );
}
