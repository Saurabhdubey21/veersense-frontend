import { useState, useEffect, useRef } from "react";
import {
  Shield, ShieldCheck, User, ArrowLeft, Bell,
  ChevronRight, Lock, Bot, Stethoscope, TrendingUp,
  ClipboardList, CalendarClock, Compass, Gauge, Users,
  CheckCircle2, Send, X, LogOut, AlertTriangle,
  Heart, Moon, Activity, Target, MessageCircle,
  Phone, FileText, BarChart2, Eye, EyeOff, Star, Zap
} from "lucide-react";

/* ── Design tokens ── */
const T = {
  ink:"#10192B", inkL:"#1B2B40", olive:"#414A38", olive2:"#4F6B4A",
  brass:"#B8922F", brass2:"#D4A83A", paper:"#EDE9DD", paperD:"#D8D2C0",
  cream:"#F7F5EC", crimson:"#9C3B2E", crimsonL:"#C0392B",
  slate:"#8D9AAE", mist:"#3A4A61",
};
const H = { fontFamily:"'Spectral',serif" };
const S = { fontFamily:"'Inter',sans-serif" };

function useFonts() {
  useEffect(() => {
    if (document.getElementById("vs-f")) return;
    const lk = document.createElement("link");
    lk.id = "vs-f"; lk.rel = "stylesheet";
    lk.href = "https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(lk);
    const st = document.createElement("style");
    st.textContent = `
      *{box-sizing:border-box;margin:0;padding:0}
      input,button,select,textarea{font-family:inherit;outline:none}
      button{cursor:pointer;border:none;background:none}
      ::-webkit-scrollbar{width:4px}
      ::-webkit-scrollbar-thumb{background:rgba(184,146,47,0.4);border-radius:2px}
      @keyframes spin{to{transform:rotate(360deg)}}
      @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
    `;
    document.head.appendChild(st);
  }, []);
}

/* ── Hero SVG illustration ── */
function HeroArt() {
  return (
    <svg viewBox="0 0 480 820" preserveAspectRatio="xMidYMid slice"
      style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}>
      <defs>
        <linearGradient id="saff" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#C9631F"/>
          <stop offset="100%" stopColor="#E08A3C"/>
        </linearGradient>
        <linearGradient id="verd" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#2D4A28"/>
          <stop offset="100%" stopColor="#4F6B4A"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#1B3A5C" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#10192B" stopOpacity="0"/>
        </radialGradient>
      </defs>

      <rect width="480" height="820" fill="#0B1220"/>
      <rect width="480" height="820" fill="url(#glow)"/>

      <circle cx="380" cy="80" r="24" fill="#EDE9DD" opacity="0.09"/>
      <circle cx="368" cy="74" r="18" fill="#0B1220" opacity="0.5"/>

      {[...Array(40)].map((_, i) => (
        <circle key={i}
          cx={(i * 137 + 53) % 480}
          cy={(i * 97 + 17) % 300}
          r={((i * 7) % 3) * 0.3 + 0.3}
          fill="#EDE9DD"
          opacity={0.2 + (i % 4) * 0.1}/>
      ))}

      <path d="M0 480 L60 380 L120 430 L180 340 L240 400 L300 310 L360 370 L420 300 L480 350 L480 820 L0 820 Z"
        fill="#0D1825" opacity="0.9"/>
      <path d="M0 520 L80 440 L150 480 L220 400 L280 450 L340 380 L400 430 L480 390 L480 820 L0 820 Z"
        fill="#111E2E" opacity="0.85"/>

      <g opacity="0.42">
        <path d="M40 60 C140 30 300 50 460 20 L460 105 C300 135 140 110 40 140 Z" fill="url(#saff)"/>
        <path d="M40 140 C140 110 300 135 460 105 L460 190 C300 210 140 190 40 215 Z" fill="#DED3B2"/>
        <path d="M40 215 C140 190 300 210 460 190 L460 275 C300 295 140 275 40 298 Z" fill="url(#verd)"/>
        <g transform="translate(310,170)" opacity="0.9">
          <circle r="30" fill="none" stroke="#1C3A7A" strokeWidth="2.2"/>
          <circle r="6" fill="#1C3A7A"/>
          {[...Array(24)].map((_, i) => (
            <line key={i} x1="0" y1="6"
              x2={28 * Math.sin(i * Math.PI / 12)}
              y2={28 * Math.cos(i * Math.PI / 12)}
              stroke="#1C3A7A" strokeWidth="1.2"/>
          ))}
        </g>
        <rect x="38" y="55" width="3" height="260" fill="#8A7A50" opacity="0.6"/>
      </g>

      <g fill="#0B1220" opacity="0.85">
        <rect x="20" y="550" width="50" height="200"/>
        <rect x="10" y="545" width="70" height="12"/>
        <rect x="5" y="537" width="80" height="10"/>
        <circle cx="45" cy="500" r="5" fill="#B8922F" opacity="0.7"/>
        <rect x="44" y="460" width="2" height="40" fill="#8A7A50" opacity="0.5"/>
      </g>

      <line x1="80" y1="680" x2="480" y2="650" stroke="#2C3E50" strokeWidth="1.5" strokeDasharray="6 4"/>

      <g transform="translate(200,480)" fill="#0B1220" opacity="0.95">
        <ellipse cx="40" cy="8" rx="22" ry="14"/>
        <rect x="18" y="12" width="44" height="6" rx="1"/>
        <ellipse cx="40" cy="26" rx="13" ry="14"/>
        <path d="M22 42 C26 38 34 36 40 36 C46 36 54 38 58 42 L65 90 L15 90 Z"/>
        <rect x="55" y="44" width="16" height="28" rx="2"/>
        <path d="M22 46 L5 68 L10 72 L28 55"/>
        <path d="M58 46 L78 58 L75 63 L56 52"/>
        <rect x="4" y="50" width="60" height="5" rx="2" transform="rotate(15,4,50)"/>
        <path d="M28 90 L18 140 L28 140 L38 110 L42 140 L55 140 L48 90 Z"/>
        <rect x="14" y="138" width="18" height="8" rx="2"/>
        <rect x="44" y="138" width="16" height="8" rx="2"/>
      </g>

      {[0, 1, 2, 3, 4].map(i => (
        <g key={i}
          transform={`translate(${58 + i * 30},${590 - i * 8}) scale(${0.38 - i * 0.03})`}
          fill="#0B1220" opacity={0.6 - i * 0.08}>
          <ellipse cx="40" cy="8" rx="22" ry="14"/>
          <rect x="18" y="12" width="44" height="6" rx="1"/>
          <ellipse cx="40" cy="26" rx="13" ry="14"/>
          <path d="M22 42 C26 38 34 36 40 36 C46 36 54 38 58 42 L65 90 L15 90 Z"/>
          <path d="M28 90 L18 140 L28 140 L38 110 L42 140 L55 140 L48 90 Z"/>
        </g>
      ))}

      <rect x="0" y="730" width="480" height="90" fill="#0B1220" opacity="0.85"/>
    </svg>
  );
}

/* ════════════════════════════════════════════════
   MAIN SHELL
════════════════════════════════════════════════ */
export default function VeerSense() {
    const [backendStatus, setBackendStatus] = useState("Checking...");
    const [personnel, setPersonnel] = useState([]);
  useFonts();
  const [screen, setScreen] = useState("welcome");
  const [officerData, setOfficerData] = useState(null);
  const [personnelData, setPersonnelData] = useState(null);

    useEffect(() => {
  fetch("https://veersense-backend.onrender.com/api/status")
    .then((response) => response.json())
    .then((data) => {
      setBackendStatus(data.message);
    })
    .catch(() => {
      setBackendStatus("Backend not connected");
    });

  fetch("https://veersense-backend.onrender.com/api/personnel")
    .then((response) => response.json())
    .then((data) => {
      setPersonnel(data);
    })
    .catch((error) => {
      console.error("Error fetching personnel:", error);
    });
}, []);

  const go = (s, data) => {
    if (s === "officer-dash" && data) setOfficerData(data);
    if (s === "personnel-dash" && data) setPersonnelData(data);
    setScreen(s);
  };

  return (
    <div style={{ ...S, background:"#0B1220", minHeight:"100vh",
      display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}>
        <div style={{
  position: "fixed",
  bottom: 10,
  right: 10,
  padding: "8px 12px",
  background: "#414A38",
  color: "white",
  borderRadius: 8,
  fontSize: 12,
  zIndex: 9999
}}>
  Backend: {backendStatus}
</div>
      <div style={{ width:"100%", maxWidth:480, borderRadius:4, overflow:"hidden",
        boxShadow:"0 32px 80px rgba(0,0,0,0.6)",
        border:"1px solid rgba(255,255,255,0.07)", minHeight:820 }}>
        {screen === "welcome"          && <Welcome go={go}/>}
        {screen === "officer-login"    && <OfficerLogin go={go}/>}
        {screen === "personnel-login"  && <PersonnelLogin go={go}/>}
        {screen === "officer-dash" && (
  <OfficerDash
    go={go}
    data={officerData}
    personnel={personnel}
  />
)}
        {screen === "personnel-dash"   && <PersonnelDash go={go} data={personnelData}/>}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   WELCOME SCREEN
════════════════════════════════════════════════ */
function Welcome({ go }) {
  return (
    <div style={{ position:"relative", minHeight:820, overflow:"hidden" }}>
      <HeroArt/>
      <div style={{ position:"absolute", inset:0,
        background:"linear-gradient(180deg,rgba(11,18,32,0.88) 0%,rgba(11,18,32,0.18) 28%,rgba(11,18,32,0.32) 62%,rgba(11,18,32,0.97) 100%)" }}/>

      <div style={{ position:"relative", display:"flex", flexDirection:"column",
        alignItems:"center", padding:"52px 28px 44px", minHeight:820 }}>

        <div style={{ width:90, height:90, borderRadius:"50%",
          border:"1.5px solid rgba(184,146,47,0.65)",
          background:"rgba(184,146,47,0.07)",
          display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18 }}>
          <Shield size={38} strokeWidth={1.3} color={T.brass}/>
        </div>

        <p style={{ ...S, fontSize:10, letterSpacing:"0.2em", color:T.slate,
          marginBottom:10, textAlign:"center" }}>
          MINISTRY OF HOME AFFAIRS &nbsp;·&nbsp; CAPF WELFARE DIVISION
        </p>

        <h1 style={{ ...H, fontSize:54, fontWeight:700, color:T.paper,
          letterSpacing:"-1px", lineHeight:1, marginBottom:10, textAlign:"center" }}>
          VeerSense
        </h1>

        <p style={{ ...S, fontSize:13, color:"rgba(237,233,221,0.48)",
          textAlign:"center", maxWidth:300, lineHeight:1.65, marginBottom:10 }}>
          AI-powered predictive welfare monitoring for uniformed forces
        </p>

        <div style={{ display:"flex", alignItems:"center", gap:6,
          background:"rgba(184,146,47,0.1)", border:"1px solid rgba(184,146,47,0.3)",
          borderRadius:20, padding:"5px 14px", marginBottom:52 }}>
          <Star size={10} color={T.brass} fill={T.brass}/>
          <span style={{ fontSize:10, color:T.brass, letterSpacing:"0.15em" }}>SIH 2025 &nbsp;·&nbsp; PROBLEM SIH25186</span>
        </div>

        <div style={{ flex:1 }}/>

        <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:12 }}>
          <button onClick={() => go("officer-login")}
            style={{ width:"100%", display:"flex", alignItems:"center", gap:16,
              padding:"18px 20px", borderRadius:6, textAlign:"left",
              background:T.paper, border:"none" }}>
            <div style={{ width:44, height:44, borderRadius:8, flexShrink:0,
              background:`linear-gradient(135deg,${T.olive},${T.olive2})`,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <ShieldCheck size={22} color="white" strokeWidth={1.6}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ ...H, color:T.ink, fontWeight:600, fontSize:16, marginBottom:2 }}>
                Welfare Officer / Commander
              </div>
              <div style={{ ...S, color:"#5A5138", fontSize:12 }}>
                Unit oversight, risk dashboard &amp; AI advisor
              </div>
            </div>
            <ChevronRight size={18} color="#8A7A50"/>
          </button>

          <button onClick={() => go("personnel-login")}
            style={{ width:"100%", display:"flex", alignItems:"center", gap:16,
              padding:"18px 20px", borderRadius:6, textAlign:"left",
              background:"rgba(237,233,221,0.07)",
              border:"1px solid rgba(184,146,47,0.25)" }}>
            <div style={{ width:44, height:44, borderRadius:8, flexShrink:0,
              background:"linear-gradient(135deg,#1B4F72,#2980B9)",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <User size={22} color="white" strokeWidth={1.6}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ ...H, color:T.paper, fontWeight:600, fontSize:16, marginBottom:2 }}>
                Army Personnel
              </div>
              <div style={{ ...S, color:T.slate, fontSize:12 }}>
                Personal wellness check &amp; AI health advisor
              </div>
            </div>
            <ChevronRight size={18} color={T.slate}/>
          </button>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:24 }}>
          <Lock size={11} color={T.slate}/>
          <span style={{ fontSize:11, color:"rgba(141,154,174,0.65)" }}>
            Individual data anonymized &amp; never used for disciplinary action
          </span>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   OFFICER LOGIN
════════════════════════════════════════════════ */
function OfficerLogin({ go }) {
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [showP, setShowP] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!id || !pass) { setErr("Please fill both fields"); return; }
    setLoading(true); setErr("");
    setTimeout(() => {
      if ((id === "admin" && pass === "1234") || (id.length >= 3 && pass.length >= 4)) {
        go("officer-dash", { id, role:"Welfare Officer" });
      } else {
        setErr("Invalid credentials. Demo: admin / 1234");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div style={{ background:T.cream, minHeight:820, padding:"36px 28px" }}>
      <button onClick={() => go("welcome")}
        style={{ display:"flex", alignItems:"center", gap:8, color:"#5A5138", fontSize:13, marginBottom:36 }}>
        <ArrowLeft size={16}/> Back
      </button>
      <div style={{ textAlign:"center", marginBottom:36 }}>
        <div style={{ width:72, height:72, borderRadius:"50%",
          background:"rgba(184,146,47,0.1)", border:`1.5px solid ${T.brass}`,
          display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
          <ShieldCheck size={30} color={T.brass} strokeWidth={1.5}/>
        </div>
        <h2 style={{ ...H, color:T.ink, fontWeight:600, fontSize:26, marginBottom:6 }}>Officer Portal</h2>
        <p style={{ ...S, color:"#5A5138", fontSize:13 }}>Unit welfare oversight &amp; command dashboard</p>
      </div>
      <LF label="Officer ID" placeholder="e.g. WO-04417 or admin" value={id} onChange={setId}/>
      <LF label="Password" placeholder="••••••••" type={showP ? "text" : "password"} value={pass} onChange={setPass}
        suffix={<button onClick={() => setShowP(!showP)} style={{ color:"#8A7A50" }}>
          {showP ? <EyeOff size={14}/> : <Eye size={14}/>}
        </button>}/>
      {err && <p style={{ color:T.crimsonL, fontSize:12, marginBottom:12 }}>{err}</p>}
      <button onClick={submit} disabled={loading}
        style={{ width:"100%", padding:"14px", borderRadius:6,
          background:`linear-gradient(135deg,${T.olive},${T.olive2})`,
          color:"white", ...H, fontWeight:600, fontSize:15, opacity:loading ? 0.7 : 1,
          display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
        {loading ? <><Spin/> Verifying...</> : "Sign in to Dashboard"}
      </button>
      <div style={{ textAlign:"center", marginTop:20, padding:"12px",
        background:"rgba(184,146,47,0.08)", borderRadius:6, border:"1px solid rgba(184,146,47,0.2)" }}>
        <p style={{ fontSize:11, color:"#8A7A50" }}>Demo: ID = <strong>admin</strong> | Pass = <strong>1234</strong></p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   PERSONNEL LOGIN
════════════════════════════════════════════════ */
function PersonnelLogin({ go }) {
  const [svc, setSvc] = useState("");
  const [rank, setRank] = useState("Constable");
  const [unit, setUnit] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    setTimeout(() => go("personnel-dash", { svc: svc || "Anonymous", rank, unit }), 900);
  };

  return (
    <div style={{ background:T.cream, minHeight:820, padding:"36px 28px" }}>
      <button onClick={() => go("welcome")}
        style={{ display:"flex", alignItems:"center", gap:8, color:"#5A5138", fontSize:13, marginBottom:36 }}>
        <ArrowLeft size={16}/> Back
      </button>
      <div style={{ textAlign:"center", marginBottom:36 }}>
        <div style={{ width:72, height:72, borderRadius:"50%",
          background:"rgba(79,107,74,0.12)", border:`1.5px solid ${T.olive2}`,
          display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
          <User size={30} color={T.olive2} strokeWidth={1.5}/>
        </div>
        <h2 style={{ ...H, color:T.ink, fontWeight:600, fontSize:26, marginBottom:6 }}>Personnel Check-In</h2>
        <p style={{ ...S, color:"#5A5138", fontSize:13 }}>Your responses are completely anonymous &amp; encrypted</p>
      </div>
      <LF label="Service Number (optional)" placeholder="e.g. CRPF-2291178 or leave blank" value={svc} onChange={setSvc}/>
      <div style={{ marginBottom:16 }}>
        <label style={{ display:"block", fontSize:12, color:"#5A5138", marginBottom:6 }}>Rank</label>
        <select value={rank} onChange={e => setRank(e.target.value)}
          style={{ width:"100%", padding:"11px 14px", borderRadius:6,
            background:"#F0EDE0", border:"1px solid #C9C2A6", color:T.ink, fontSize:14 }}>
          {["Constable","Head Constable","ASI","SI","Inspector","DSP","SP"].map(r => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>
      <LF label="Unit / Battalion" placeholder="e.g. 42 Bn CRPF" value={unit} onChange={setUnit}/>
      <div style={{ background:"rgba(79,107,74,0.08)", border:"1px solid rgba(79,107,74,0.25)",
        borderRadius:6, padding:"10px 14px", marginBottom:20,
        display:"flex", alignItems:"flex-start", gap:8 }}>
        <Lock size={13} color={T.olive2} style={{ marginTop:2, flexShrink:0 }}/>
        <p style={{ fontSize:11, color:"#4A6044", lineHeight:1.6 }}>
          Your identity is never linked to your responses. Only anonymized unit-level trends reach your officers.
        </p>
      </div>
      <button onClick={submit} disabled={loading}
        style={{ width:"100%", padding:"14px", borderRadius:6,
          background:"linear-gradient(135deg,#1B4F72,#2980B9)",
          color:"white", ...H, fontWeight:600, fontSize:15,
          display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
        {loading ? <><Spin color="white"/> Starting check-in...</> : "Start My Wellness Check"}
      </button>
    </div>
  );
}

function LF({ label, placeholder, type="text", value, onChange, suffix }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:"block", fontSize:12, color:"#5A5138", marginBottom:6 }}>{label}</label>
      <div style={{ position:"relative" }}>
        <input type={type} placeholder={placeholder} value={value}
          onChange={e => onChange(e.target.value)}
          style={{ width:"100%", padding:"11px 14px", paddingRight: suffix ? 40 : 14,
            borderRadius:6, background:"#F0EDE0", border:"1px solid #C9C2A6",
            color:T.ink, fontSize:14 }}/>
        {suffix && (
          <div style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)" }}>
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   OFFICER DASHBOARD
════════════════════════════════════════════════ */
function OfficerDash({ go, data ,personnel}) {
  const [tab, setTab] = useState("overview");
  const [chatOpen, setChatOpen] = useState(false);
  console.log("Officer Dashboard Personnel:", personnel);

  const tabs = [
    { id:"overview",   icon:<BarChart2 size={15}/>,    label:"Overview" },
    { id:"personnel",  icon:<Users size={15}/>,         label:"Personnel" },
    { id:"assess",     icon:<Target size={15}/>,        label:"Assess" },
    { id:"alerts",     icon:<Bell size={15}/>,          label:"Alerts" },
  ];

  return (
    <div style={{ background:"#F5F3EC", minHeight:820, display:"flex", flexDirection:"column" }}>
      <div style={{ background:T.ink, padding:"14px 20px",
        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:6,
            background:`linear-gradient(135deg,${T.olive},${T.brass})`,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Shield size={16} color="white" strokeWidth={1.5}/>
          </div>
          <div>
            <div style={{ ...H, color:T.paper, fontWeight:600, fontSize:15 }}>VeerSense</div>
            <div style={{ fontSize:10, color:T.slate }}>Welfare Officer &nbsp;·&nbsp; {data?.id}</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#4CAF50",
            animation:"blink 2s infinite" }}/>
          <button onClick={() => go("welcome")} style={{ color:T.slate }}><LogOut size={16}/></button>
        </div>
      </div>

      <div style={{ background:T.ink, display:"flex",
        borderTop:"1px solid rgba(255,255,255,0.07)", padding:"0 4px" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex:1, padding:"10px 4px", display:"flex", flexDirection:"column",
              alignItems:"center", gap:3,
              borderBottom:`2px solid ${tab === t.id ? T.brass : "transparent"}` }}>
            <span style={{ color: tab === t.id ? T.brass : T.slate }}>{t.icon}</span>
            <span style={{ fontSize:9, color: tab === t.id ? T.brass : T.slate }}>{t.label}</span>
          </button>
        ))}
      </div>

      <div style={{ flex:1, overflow:"auto" }}>
        {tab === "overview"   && <OOverview/>}
        {tab === "personnel"  && <OPersonnel personnel={personnel}/>}
        {tab === "assess"     && <OAssess/>}
        {tab === "alerts"     && <OAlerts/>}
      </div>

      <button onClick={() => setChatOpen(true)}
        style={{ position:"fixed", bottom:24, right:24,
          width:52, height:52, borderRadius:"50%",
          background:`linear-gradient(135deg,${T.olive},${T.brass})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 6px 24px rgba(184,146,47,0.4)", zIndex:50 }}>
        <Bot size={22} color="white"/>
      </button>

      {chatOpen && <ChatModal onClose={() => setChatOpen(false)} role="officer"/>}
    </div>
  );
}

function OOverview() {
  const kpis = [
    { label:"Force Wellness Index", val:"76.4", sub:"+2.1 vs last cycle", color:T.olive2 },
    { label:"High Risk Personnel",  val:"241",  sub:"Immediate action needed", color:T.crimsonL },
    { label:"Medium Risk",          val:"334",  sub:"Monitoring required", color:"#D4870A" },
    { label:"Stable Personnel",     val:"425",  sub:"42.5% of force", color:T.olive2 },
  ];
  const borderColors = [T.olive2, T.crimsonL, "#D4870A", T.olive2];
  return (
    <div style={{ padding:20 }}>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ ...H, color:T.ink, fontWeight:700, fontSize:22, marginBottom:4 }}>Welfare Overview</h2>
        <p style={{ fontSize:12, color:"#6B7280" }}>
          Real-time &nbsp;·&nbsp; 1,000 personnel &nbsp;·&nbsp; {new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
        </p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ background:"white", borderRadius:10, padding:"14px 16px",
            borderLeft:`4px solid ${borderColors[i]}`, boxShadow:"0 1px 6px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize:11, color:"#9ca3af", marginBottom:6 }}>{k.label}</div>
            <div style={{ ...H, fontSize:30, fontWeight:700, color:k.color }}>{k.val}</div>
            <div style={{ fontSize:10, color:"#9ca3af", marginTop:2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background:"white", borderRadius:10, padding:16, marginBottom:12,
        boxShadow:"0 1px 6px rgba(0,0,0,0.06)" }}>
        <div style={{ ...H, fontWeight:700, fontSize:14, marginBottom:12, color:T.ink }}>
          8-Week Stress Trend
        </div>
        <LineChart pts={[38,44,41,52,48,58,55,62]} color={T.olive2}/>
      </div>

      <div style={{ background:"white", borderRadius:10, padding:16, marginBottom:12,
        boxShadow:"0 1px 6px rgba(0,0,0,0.06)" }}>
        <div style={{ ...H, fontWeight:700, fontSize:14, marginBottom:12, color:T.ink }}>Risk by Rank</div>
        {[
          { label:"Constable",   pct:72, color:T.crimsonL },
          { label:"Head Const.", pct:58, color:T.crimsonL },
          { label:"ASI",         pct:42, color:"#D4870A" },
          { label:"SI",          pct:28, color:T.olive2 },
          { label:"Inspector+",  pct:15, color:T.olive2 },
        ].map((d, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
            <span style={{ fontSize:11, color:"#6b7280", width:80, textAlign:"right", flexShrink:0 }}>{d.label}</span>
            <div style={{ flex:1, background:"#f3f4f6", borderRadius:4, height:20, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${d.pct}%`, background:d.color, borderRadius:4,
                display:"flex", alignItems:"center", paddingLeft:8,
                fontSize:10, fontWeight:600, color:"white" }}>{d.pct}%</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background:"rgba(192,57,43,0.07)", border:"1px solid rgba(192,57,43,0.25)",
        borderRadius:10, padding:"12px 16px", display:"flex", gap:10, alignItems:"flex-start" }}>
        <AlertTriangle size={18} color={T.crimsonL} style={{ flexShrink:0, marginTop:1 }}/>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:T.crimsonL, marginBottom:2 }}>
            241 personnel require immediate welfare intervention
          </div>
          <div style={{ fontSize:11, color:"#9ca3af" }}>Switch to Alerts tab to view individual cases</div>
        </div>
      </div>
    </div>
  );
}

function LineChart({ pts, color }) {
  const max = Math.max(...pts), min = Math.min(...pts);
  const W = 300, H = 70;
  const step = W / (pts.length - 1);
  const y = v => H - (v - min) / (max - min) * (H - 10) - 5;
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${y(p)}`).join(" ");
  const area = path + ` L ${(pts.length - 1) * step} ${H} L 0 ${H} Z`;
  return (
    <svg viewBox={`-5 0 ${W + 10} ${H + 20}`} style={{ width:"100%" }}>
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#ag)"/>
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round"/>
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={i * step} cy={y(p)} r="3.5" fill={color}/>
          <text x={i * step} y={H + 14} textAnchor="middle" fontSize="8" fill="#9ca3af">W{i+1}</text>
        </g>
      ))}
    </svg>
  );
}

function OPersonnel({ personnel }) {
  return (
    <div style={{ padding:20 }}>
      <h2 style={{ ...H, color:T.ink, fontWeight:700, fontSize:20, marginBottom:16 }}>Personnel Register</h2>
      <div style={{ background:"white", borderRadius:10, overflow:"hidden", boxShadow:"0 1px 6px rgba(0,0,0,0.06)" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ background:"#f9fafb" }}>
                {["ID","Name","Service ID","Rank","Department"].map(h => (
                  <th key={h} style={{ padding:"10px", textAlign:"left", fontSize:10,
                    color:"#9ca3af", fontWeight:600, borderBottom:"1px solid #f3f4f6" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {personnel && personnel.length > 0 ? (
                personnel.map((p) => (
                  <tr key={p.id} style={{ borderBottom:"1px solid #f9fafb" }}>
                    <td style={{ padding:"10px", fontFamily:"monospace", fontSize:11, color:"#6b7280" }}>{p.id}</td>
                    <td style={{ padding:"10px", color:T.ink }}>{p.name}</td>
                    <td style={{ padding:"10px", color:T.ink }}>{p.service_id}</td>
                    <td style={{ padding:"10px", color:T.ink }}>{p.rank}</td>
                    <td style={{ padding:"10px", color:T.ink }}>{p.department}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding:"20px", textAlign:"center", color:"#9ca3af" }}>
                    No personnel records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OAssess() {
  const [v, setV] = useState({ dep:18, duty:10, nights:6, sleep:6, inc:2, soc:5, well:6, fam:1 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const upd = (k, val) => setV(p => ({ ...p, [k]: +val }));

  const calcScore = () => {
    let s = 0;
    s += (v.dep / 36) * 28;
    s += (Math.max(0, v.duty - 8) / 8) * 22;
    s += (v.nights / 20) * 14;
    s += v.fam * 10;
    s += (v.inc / 10) * 14;
    s -= ((v.sleep - 3) / 7) * 16;
    s -= (v.soc / 10) * 8;
    s -= (v.well / 10) * 10;
    return Math.max(0, Math.min(100, Math.round(s)));
  };

  const predict = () => {
    setLoading(true);
    setTimeout(() => {
      const score = calcScore();
      const risk = score >= 60 ? "High" : score >= 35 ? "Medium" : "Low";
      setResult({ score, risk });
      setLoading(false);
    }, 800);
  };

  const sliders = [
    { k:"dep",   label:"Deployment Duration", min:1,  max:36, unit:" months" },
    { k:"duty",  label:"Duty Hours / Day",    min:8,  max:16, step:0.5, unit:"h" },
    { k:"nights",label:"Night Shifts / Month",min:0,  max:20, unit:"" },
    { k:"sleep", label:"Sleep Hours / Night", min:3,  max:10, step:0.5, unit:"h" },
    { k:"inc",   label:"Traumatic Incidents", min:0,  max:10, unit:"" },
    { k:"soc",   label:"Social Support (1-10)",min:1, max:10, unit:"" },
    { k:"well",  label:"Wellness Score (1-10)",min:1, max:10, unit:"" },
  ];

  const rColor = result ? (result.risk === "High" ? T.crimsonL : result.risk === "Medium" ? "#D4870A" : T.olive2) : T.olive2;

  return (
    <div style={{ padding:20 }}>
      <h2 style={{ ...H, color:T.ink, fontWeight:700, fontSize:20, marginBottom:4 }}>Individual Assessment</h2>
      <p style={{ fontSize:12, color:"#6b7280", marginBottom:20 }}>Run an AI risk prediction for any personnel profile</p>
      <div style={{ background:"white", borderRadius:10, padding:18, marginBottom:16,
        boxShadow:"0 1px 6px rgba(0,0,0,0.06)" }}>
        {sliders.map(sl => (
          <div key={sl.k} style={{ marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:12, color:"#374151" }}>{sl.label}</span>
              <span style={{ ...H, fontSize:15, fontWeight:700, color:T.olive2 }}>
                {v[sl.k]}{sl.unit}
              </span>
            </div>
            <input type="range" min={sl.min} max={sl.max} step={sl.step || 1}
              value={v[sl.k]} onChange={e => upd(sl.k, e.target.value)}
              style={{ width:"100%", accentColor:T.olive2 }}/>
          </div>
        ))}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, color:"#374151", marginBottom:8 }}>Family Separated?</div>
          <div style={{ display:"flex", gap:8 }}>
            {[{ val:0, l:"No" }, { val:1, l:"Yes — Separated" }].map(o => (
              <button key={o.val} onClick={() => upd("fam", o.val)}
                style={{ flex:1, padding:"8px", borderRadius:6, fontSize:12, fontWeight:500,
                  background: v.fam === o.val ? T.olive2 : "#f3f4f6",
                  color: v.fam === o.val ? "white" : "#374151",
                  border:`1px solid ${v.fam === o.val ? T.olive2 : "#e5e7eb"}` }}>
                {o.l}
              </button>
            ))}
          </div>
        </div>
        <button onClick={predict} disabled={loading}
          style={{ width:"100%", padding:"13px", borderRadius:8,
            background:`linear-gradient(135deg,${T.olive},${T.brass})`,
            color:"white", fontWeight:600, fontSize:14,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          {loading ? <><Spin color="white"/> Analyzing...</> : "Run AI Prediction"}
        </button>
      </div>
      {result && (
        <div style={{ background:"white", borderRadius:10, padding:18,
          borderLeft:`4px solid ${rColor}`, boxShadow:"0 1px 6px rgba(0,0,0,0.06)" }}>
          <div style={{ ...H, fontSize:20, fontWeight:700, marginBottom:6, color:rColor }}>
            {result.risk} Risk &nbsp;·&nbsp; Score: {result.score}/100
          </div>
          <p style={{ fontSize:13, color:"#374151" }}>
            {result.risk === "High"
              ? "Immediate welfare counseling required. Consider deployment rotation and mandatory rest."
              : result.risk === "Medium"
              ? "Schedule a welfare check-in within 2 weeks. Review night shift and leave patterns."
              : "Personnel is stable. Continue routine monitoring."}
          </p>
        </div>
      )}
    </div>
  );
}

function OAlerts() {
  const alerts = [
    { id:"CAPF0034", rank:"Constable",   issue:"32-month continuous deployment", urgency:"High" },
    { id:"CAPF0089", rank:"Constable",   issue:"15.2h avg duty, 4.2h sleep",     urgency:"High" },
    { id:"CAPF0127", rank:"Head Const.", issue:"Family separation > 24 months",  urgency:"High" },
    { id:"CAPF0290", rank:"SI",          issue:"Night shift load 18/month",       urgency:"Medium" },
    { id:"CAPF0445", rank:"Head Const.", issue:"Wellness score below threshold",  urgency:"Medium" },
  ];
  return (
    <div style={{ padding:20 }}>
      <h2 style={{ ...H, color:T.ink, fontWeight:700, fontSize:20, marginBottom:16 }}>Active Alerts</h2>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {alerts.map((a, i) => (
          <div key={i} style={{ background:"white", borderRadius:10, padding:"14px 16px",
            borderLeft:`4px solid ${a.urgency === "High" ? T.crimsonL : "#D4870A"}`,
            boxShadow:"0 1px 6px rgba(0,0,0,0.06)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontFamily:"monospace", fontSize:12, color:"#6b7280" }}>{a.id}</span>
              <span style={{ fontSize:11, padding:"2px 8px", borderRadius:20, fontWeight:600,
                background: a.urgency === "High" ? "rgba(192,57,43,0.1)" : "rgba(212,135,10,0.1)",
                color: a.urgency === "High" ? T.crimsonL : "#D4870A" }}>{a.urgency}</span>
            </div>
            <div style={{ fontSize:13, fontWeight:600, color:T.ink, marginBottom:2 }}>{a.rank}</div>
            <div style={{ fontSize:12, color:"#6b7280", marginBottom:10 }}>{a.issue}</div>
            <button onClick={() => alert(`Counseling flagged for ${a.id}`)}
              style={{ padding:"6px 14px", borderRadius:6, fontSize:12, fontWeight:600,
                background:T.ink, color:T.paper }}>
              Flag for Counseling
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   PERSONNEL DASHBOARD
════════════════════════════════════════════════ */
function PersonnelDash({ go, data }) {
  const [tab, setTab] = useState("home");
  const [chatOpen, setChatOpen] = useState(false);
  const [stressResult, setStressResult] = useState(null);

  const tabs = [
    { id:"home",     icon:<Gauge size={15}/>,         label:"Home" },
    { id:"assess",   icon:<ClipboardList size={15}/>, label:"Check-In" },
    { id:"wellness", icon:<Heart size={15}/>,          label:"Wellness" },
    { id:"support",  icon:<MessageCircle size={15}/>, label:"Support" },
  ];

  return (
    <div style={{ background:"#0F1825", minHeight:820, display:"flex", flexDirection:"column" }}>
      <div style={{ background:T.ink, padding:"14px 20px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:6,
            background:"linear-gradient(135deg,#1B4F72,#2980B9)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Shield size={16} color="white" strokeWidth={1.5}/>
          </div>
          <div>
            <div style={{ ...H, color:T.paper, fontWeight:600, fontSize:15 }}>VeerSense</div>
            <div style={{ fontSize:10, color:T.slate }}>{data?.rank} &nbsp;·&nbsp; Anonymous check-in</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ fontSize:10, color:"#4CAF50", display:"flex", alignItems:"center", gap:4 }}>
            <Lock size={10}/> Encrypted
          </div>
          <button onClick={() => go("welcome")} style={{ color:T.slate }}><LogOut size={16}/></button>
        </div>
      </div>

      <div style={{ background:T.ink, display:"flex",
        borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"0 4px" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex:1, padding:"10px 4px", display:"flex", flexDirection:"column",
              alignItems:"center", gap:3,
              borderBottom:`2px solid ${tab === t.id ? "#2980B9" : "transparent"}` }}>
            <span style={{ color: tab === t.id ? "#5DADE2" : T.slate }}>{t.icon}</span>
            <span style={{ fontSize:9, color: tab === t.id ? "#5DADE2" : T.slate }}>{t.label}</span>
          </button>
        ))}
      </div>

      <div style={{ flex:1, overflow:"auto" }}>
        {tab === "home"     && <PHome data={data} onAssess={() => setTab("assess")} result={stressResult}/>}
        {tab === "assess"   && <PAssess onResult={r => { setStressResult(r); setTab("home"); }}/>}
        {tab === "wellness" && <PWellness/>}
        {tab === "support"  && <PSupport onChat={() => setChatOpen(true)}/>}
      </div>

      <button onClick={() => setChatOpen(true)}
        style={{ position:"fixed", bottom:24, right:24,
          width:52, height:52, borderRadius:"50%",
          background:"linear-gradient(135deg,#1B4F72,#2980B9)",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 6px 24px rgba(41,128,185,0.45)", zIndex:50 }}>
        <Bot size={22} color="white"/>
      </button>

      {chatOpen && <ChatModal onClose={() => setChatOpen(false)} role="personnel" stressResult={stressResult}/>}
    </div>
  );
}

function PHome({ data, onAssess, result }) {
  const score = result?.score || 28;
  const risk  = result?.risk  || "Low";
  const color = risk === "High" ? T.crimsonL : risk === "Medium" ? "#D4870A" : T.olive2;
  const pct   = score / 100;
  const angle = -90 + pct * 180;

  return (
    <div style={{ padding:20 }}>
      <p style={{ fontSize:12, color:T.slate }}>Jai Hind, {data?.rank || "Constable"}</p>
      <h2 style={{ ...H, color:T.paper, fontWeight:700, fontSize:22, marginBottom:2 }}>
        Your Wellness Overview
      </h2>
      <p style={{ fontSize:11, color:"#4CAF50", marginBottom:16 }}>
        Your data stays with you — only trends reach your unit
      </p>

      <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:12, padding:20, marginBottom:16, textAlign:"center" }}>
        <svg width="220" height="130" viewBox="0 0 220 130" style={{ display:"block", margin:"0 auto" }}>
          <path d="M20 110 A90 90 0 0 1 200 110" fill="none"
            stroke="rgba(255,255,255,0.08)" strokeWidth="16" strokeLinecap="round"/>
          <path d="M20 110 A90 90 0 0 1 200 110" fill="none"
            stroke={color} strokeWidth="16" strokeLinecap="round"
            strokeDasharray={`${pct * 283} 283`}/>
          <g transform={`rotate(${angle},110,110)`}>
            <line x1="110" y1="110" x2="110" y2="38"
              stroke={T.paper} strokeWidth="2.5" strokeLinecap="round"/>
          </g>
          <circle cx="110" cy="110" r="6" fill={T.paper}/>
        </svg>
        <div style={{ ...H, fontSize:28, fontWeight:700, color, marginTop:-4 }}>{risk}</div>
        <div style={{ fontSize:12, color:T.slate, marginTop:2 }}>Stress Score: {score}/100</div>
        {!result && (
          <button onClick={onAssess}
            style={{ marginTop:12, padding:"8px 20px", borderRadius:20, fontSize:12, fontWeight:600,
              background:"rgba(41,128,185,0.2)", border:"1px solid #2980B9", color:"#5DADE2" }}>
            Take your check-in now
          </button>
        )}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        {[
          { icon:<Moon size={18}/>,      title:"Sleep",       sub:"Last: " + (result?.sleep || 6.5) + "h" },
          { icon:<Activity size={18}/>,  title:"Resilience",  sub:"14-day streak" },
          { icon:<TrendingUp size={18}/>,title:"Stress Trend",sub:"Improving" },
          { icon:<CalendarClock size={18}/>, title:"Leave Due", sub:"8 days pending" },
        ].map((t, i) => (
          <div key={i} style={{ background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"14px" }}>
            <div style={{ color:"#5DADE2", marginBottom:8 }}>{t.icon}</div>
            <div style={{ ...H, color:T.paper, fontWeight:600, fontSize:13, marginBottom:2 }}>{t.title}</div>
            <div style={{ fontSize:11, color:T.slate }}>{t.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background:T.ink, border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:12, padding:16 }}>
        <div style={{ ...H, color:T.brass, fontWeight:600, fontSize:13, marginBottom:12,
          display:"flex", alignItems:"center", gap:6 }}>
          <Compass size={14}/> Get Support Now
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:8, padding:12 }}>
            <Stethoscope size={18} color={T.brass}/>
            <div style={{ ...H, color:T.paper, fontWeight:600, fontSize:12, marginTop:8, marginBottom:2 }}>
              Talk to Your Doctor
            </div>
            <div style={{ fontSize:10, color:T.slate }}>Confidential, in-person</div>
          </div>
          <div style={{ background:"rgba(41,128,185,0.1)", border:"1px solid rgba(41,128,185,0.3)",
            borderRadius:8, padding:12 }}>
            <Bot size={18} color="#5DADE2"/>
            <div style={{ ...H, color:T.paper, fontWeight:600, fontSize:12, marginTop:8, marginBottom:2 }}>
              AI Health Advisor
            </div>
            <div style={{ fontSize:10, color:T.slate }}>Real-time, private chat</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PAssess({ onResult }) {
  const [v, setV] = useState({
    mood:3, energy:5, sleep:6, dep:12, duty:10, nights:6,
    wstress:5, fam:1, well:5, soc:5, ex:3, inc:1
  });
  const [loading, setLoading] = useState(false);
  const upd = (k, val) => setV(p => ({ ...p, [k]: +val }));

  const calcScore = () => {
    let s = 0;
    s += (v.dep / 36) * 28;
    s += (Math.max(0, v.duty - 8) / 8) * 22;
    s += (v.nights / 20) * 14;
    s += v.fam * 10;
    s += (v.inc / 10) * 14;
    s += (v.wstress / 10) * 10;
    s -= ((v.sleep - 3) / 7) * 16;
    s -= (v.soc / 10) * 8;
    s -= (v.well / 10) * 10;
    s -= (v.ex / 7) * 8;
    s -= (v.mood / 5) * 10;
    s -= (v.energy / 10) * 6;
    return Math.max(0, Math.min(100, Math.round(s)));
  };

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      const score = calcScore();
      const risk = score >= 60 ? "High" : score >= 35 ? "Medium" : "Low";
      onResult({ score, risk, sleep: v.sleep, ...v });
    }, 1000);
  };

  const moodEmoji = ["", "😞", "😕", "😐", "🙂", "😄"];

  const sections = [
    { title:"Mood & Energy", fields:[
      { k:"mood",    label:"Mood right now",      min:1, max:5,  fmt: x => moodEmoji[x] },
      { k:"energy",  label:"Energy level (1-10)", min:1, max:10 },
      { k:"sleep",   label:"Sleep last night",    min:3, max:10, step:0.5, unit:"h" },
    ]},
    { title:"Work and Deployment", fields:[
      { k:"dep",     label:"Continuous deployment", min:0, max:36, unit:" months" },
      { k:"duty",    label:"Duty hours / day",      min:8, max:16, step:0.5, unit:"h" },
      { k:"nights",  label:"Night shifts this month",min:0,max:20 },
      { k:"wstress", label:"Work stress (1-10)",     min:1, max:10 },
    ]},
    { title:"Mental Wellbeing", fields:[
      { k:"well",    label:"Overall wellness (1-10)", min:1, max:10 },
      { k:"soc",     label:"Peer support (1-10)",     min:1, max:10 },
      { k:"ex",      label:"Exercise days / week",    min:0, max:7 },
      { k:"inc",     label:"Traumatic incidents",     min:0, max:10 },
    ]},
  ];

  return (
    <div style={{ padding:20 }}>
      <h2 style={{ ...H, color:T.paper, fontWeight:700, fontSize:20, marginBottom:4 }}>Wellness Check-In</h2>
      <p style={{ fontSize:12, color:T.slate, marginBottom:20 }}>2 minutes &nbsp;·&nbsp; 100% anonymous &nbsp;·&nbsp; Not stored</p>

      <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:10, padding:16, marginBottom:12 }}>
        <div style={{ fontSize:13, color:T.paper, marginBottom:8 }}>Family situation</div>
        <div style={{ display:"flex", gap:8 }}>
          {[{ val:0, l:"Family nearby" }, { val:1, l:"Separated from family" }].map(o => (
            <button key={o.val} onClick={() => upd("fam", o.val)}
              style={{ flex:1, padding:"9px", borderRadius:8, fontSize:12, fontWeight:500,
                background: v.fam === o.val ? "rgba(41,128,185,0.3)" : "rgba(255,255,255,0.05)",
                border:`1px solid ${v.fam === o.val ? "#2980B9" : "rgba(255,255,255,0.1)"}`,
                color: v.fam === o.val ? "#5DADE2" : T.slate }}>
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {sections.map((sec, si) => (
        <div key={si} style={{ background:"rgba(255,255,255,0.04)",
          border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:16, marginBottom:12 }}>
          <div style={{ ...H, color:T.paper, fontWeight:600, fontSize:14, marginBottom:14 }}>
            {sec.title}
          </div>
          {sec.fields.map(f => (
            <div key={f.k} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:12, color:T.slate }}>{f.label}</span>
                <span style={{ ...H, fontSize:18, fontWeight:700, color:"#5DADE2" }}>
                  {f.fmt ? f.fmt(v[f.k]) : v[f.k] + (f.unit || "")}
                </span>
              </div>
              <input type="range" min={f.min} max={f.max} step={f.step || 1}
                value={v[f.k]} onChange={e => upd(f.k, e.target.value)}
                style={{ width:"100%", accentColor:"#2980B9" }}/>
            </div>
          ))}
        </div>
      ))}

      <button onClick={submit} disabled={loading}
        style={{ width:"100%", padding:"15px", borderRadius:10,
          background:"linear-gradient(135deg,#1B4F72,#2980B9)",
          color:"white", fontWeight:700, fontSize:15,
          display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
        {loading ? <><Spin color="white"/> Analyzing your profile...</> : "Check My Wellness"}
      </button>
    </div>
  );
}

function PWellness() {
  const tips = [
    { icon:"🌙", title:"Sleep Protocol", desc:"Aim for 7-8 hours. Even 20 extra minutes reduces cortisol by 18%." },
    { icon:"🏃", title:"Move Daily", desc:"20 minutes of walking activates endorphins and reduces anxiety markers." },
    { icon:"🧘", title:"Breathing Drill", desc:"4-count inhale, 4-count hold, 4-count exhale. Do 5 cycles twice daily." },
    { icon:"🤝", title:"Buddy System", desc:"Check in on one colleague today. Peer connection is the strongest resilience factor." },
    { icon:"📵", title:"Digital Rest", desc:"30 minutes off screens before sleep improves deep sleep quality by 25%." },
    { icon:"💧", title:"Hydration", desc:"Dehydration by 2% impairs cognitive performance. Keep a bottle at your post." },
  ];
  return (
    <div style={{ padding:20 }}>
      <h2 style={{ ...H, color:T.paper, fontWeight:700, fontSize:20, marginBottom:4 }}>Wellness Tips</h2>
      <p style={{ fontSize:12, color:T.slate, marginBottom:20 }}>Science-backed strategies for field conditions</p>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {tips.map((t, i) => (
          <div key={i} style={{ background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:10, padding:"14px 16px",
            display:"flex", gap:14, alignItems:"flex-start" }}>
            <div style={{ fontSize:24, flexShrink:0 }}>{t.icon}</div>
            <div>
              <div style={{ ...H, color:T.paper, fontWeight:600, fontSize:14, marginBottom:4 }}>{t.title}</div>
              <div style={{ fontSize:12, color:T.slate, lineHeight:1.6 }}>{t.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PSupport({ onChat }) {
  const items = [
    { icon:<Bot size={22} color="#5DADE2"/>,       title:"AI Health Advisor",   desc:"Instant, private, judgment-free wellness chat powered by Claude AI", action:"Start Chat", onClick: onChat },
    { icon:<Stethoscope size={22} color={T.brass}/>, title:"Talk to Your Doctor", desc:"Book a confidential session with your unit Medical Officer", action:"Request Appointment", onClick: () => alert("Appointment request sent to Medical Officer") },
    { icon:<Phone size={22} color="#E74C3C"/>,       title:"CAPF Helpline",       desc:"24/7 confidential mental health helpline for all CAPF personnel", action:"1800-XXX-XXXX", onClick: () => alert("Helpline: 1800-XXX-XXXX") },
    { icon:<Users size={22} color={T.olive2}/>,      title:"Peer Support Group",  desc:"Connect with trained peer supporters in your battalion", action:"Find Support", onClick: () => alert("Connecting to peer support network...") },
    { icon:<FileText size={22} color={T.slate}/>,    title:"Self-Help Resources", desc:"Guided exercises, breathing drills, and stress management guides", action:"Browse Resources", onClick: () => alert("Opening resource library...") },
  ];
  return (
    <div style={{ padding:20 }}>
      <h2 style={{ ...H, color:T.paper, fontWeight:700, fontSize:20, marginBottom:4 }}>Support Resources</h2>
      <p style={{ fontSize:12, color:T.slate, marginBottom:20 }}>All channels are confidential. Reaching out is strength.</p>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {items.map((it, i) => (
          <div key={i} style={{ background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:16 }}>
            <div style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:10 }}>
              <div style={{ flexShrink:0 }}>{it.icon}</div>
              <div>
                <div style={{ ...H, color:T.paper, fontWeight:600, fontSize:14, marginBottom:4 }}>{it.title}</div>
                <div style={{ fontSize:12, color:T.slate, lineHeight:1.55 }}>{it.desc}</div>
              </div>
            </div>
            <button onClick={it.onClick}
              style={{ width:"100%", padding:"9px", borderRadius:8, fontSize:13, fontWeight:600,
                background:"rgba(255,255,255,0.05)",
                border:"1px solid rgba(255,255,255,0.15)", color:T.paper }}>
              {it.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   AI CHAT MODAL
════════════════════════════════════════════════ */
function ChatModal({ onClose, role, stressResult }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const isOfficer = role === "officer";

  const sysPrompt = isOfficer
    ? "You are an expert AI Welfare Advisor for CAPF (Central Armed Police Forces) officers in India. Help welfare officers understand stress patterns, plan interventions, and support battalion mental health. Be practical, evidence-based, and sensitive to the military context. Keep responses concise and actionable."
    : `You are a compassionate AI Health Advisor for CAPF personnel in India. ${stressResult ? `The person's current stress score is ${stressResult.score}/100 (${stressResult.risk} risk level).` : ""} Provide warm, practical, culturally sensitive advice. Be empathetic, never clinical. Always recommend speaking to a Welfare Officer or Medical Officer for serious concerns. Keep responses to 2-3 short paragraphs.`;

  const welcome = isOfficer
    ? "Hello, Officer. I am your AI Welfare Advisor. Ask me about stress indicators, intervention strategies, or how to support your unit's mental health."
    : `Jai Hind. I am your AI Health Advisor — completely private and confidential. ${stressResult ? `I can see your stress level is ${stressResult.risk} (${stressResult.score}/100). ` : ""}Tell me how you are feeling and I will help.`;

  useEffect(() => { setMsgs([{ role:"ai", text: welcome }]); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMsgs(p => [...p, { role:"user", text: userMsg }]);
    setLoading(true);

    try {
      const history = msgs.slice(1).map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text
      }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:1000,
          system: sysPrompt,
          messages: [...history, { role:"user", content: userMsg }]
        })
      });
      const d = await res.json();
      const reply = d.content?.[0]?.text || getOfflineReply(stressResult?.risk);
      setMsgs(p => [...p, { role:"ai", text: reply }]);
    } catch {
      setMsgs(p => [...p, { role:"ai", text: getOfflineReply(stressResult?.risk) }]);
    }
    setLoading(false);
  };

  const getOfflineReply = (risk) => {
    if (risk === "High") return "You are carrying a very heavy load right now. Please speak to your Welfare Officer or Medical Officer today. You can also call the CAPF helpline 1800-XXX-XXXX which is confidential and available 24 hours a day. You do not have to carry this alone.";
    if (risk === "Medium") return "Thank you for checking in. I would recommend protecting your sleep time, taking short breaks during duty, and connecting with a trusted colleague. Your Welfare Officer is also available if you want to talk.";
    return "You are doing well. Keep maintaining your healthy habits — sleep, exercise, and staying connected with your unit.";
  };

  const quickQs = isOfficer
    ? ["What are early signs of burnout?","How do I handle a high-risk case?","Best interventions for long deployments?"]
    : ["I have been feeling very stressed","I cannot sleep well lately","I miss my family a lot"];

  const bg = isOfficer ? T.cream : "#0F1825";
  const textMain = isOfficer ? T.ink : T.paper;
  const border = isOfficer ? "#DED6BC" : "rgba(255,255,255,0.08)";
  const msgBg = isOfficer ? "white" : "rgba(255,255,255,0.06)";
  const inputBg = isOfficer ? "#F0EDE0" : "rgba(255,255,255,0.06)";
  const inputBorder = isOfficer ? "#C9C2A6" : "rgba(255,255,255,0.12)";
  const userMsgBg = isOfficer
    ? `linear-gradient(135deg,${T.olive},${T.olive2})`
    : "linear-gradient(135deg,#1B4F72,#2980B9)";
  const sendBg = isOfficer
    ? `linear-gradient(135deg,${T.olive},${T.brass})`
    : "linear-gradient(135deg,#1B4F72,#2980B9)";

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.72)",
      backdropFilter:"blur(6px)", zIndex:200,
      display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div style={{ width:"100%", maxWidth:480, background:bg, borderRadius:"16px 16px 0 0",
        border:`1px solid ${border}`, maxHeight:"85vh",
        display:"flex", flexDirection:"column" }}>

        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${border}`,
          display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:"50%",
            background:"linear-gradient(135deg,#1B4F72,#2980B9)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Bot size={18} color="white"/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ ...H, color:textMain, fontWeight:600, fontSize:15 }}>AI Health Advisor</div>
            <div style={{ fontSize:11, color: isOfficer ? "#5A5138" : T.slate }}>
              Powered by Claude &nbsp;·&nbsp; Private &amp; Encrypted
            </div>
          </div>
          <button onClick={onClose} style={{ color: isOfficer ? "#5A5138" : T.slate }}><X size={20}/></button>
        </div>

        <div style={{ flex:1, overflow:"auto", padding:16,
          display:"flex", flexDirection:"column", gap:10 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ maxWidth:"85%", alignSelf: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ padding:"11px 14px", borderRadius:12, fontSize:13, lineHeight:1.65,
                background: m.role === "user" ? userMsgBg : msgBg,
                color: m.role === "user" ? "white" : textMain,
                border: m.role === "user" ? "none" : `1px solid ${border}` }}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ maxWidth:"85%", alignSelf:"flex-start" }}>
              <div style={{ padding:"11px 14px", borderRadius:12,
                background:msgBg, border:`1px solid ${border}`,
                display:"flex", gap:8, alignItems:"center" }}>
                <Spin color={isOfficer ? T.olive2 : "#5DADE2"}/>
                <span style={{ fontSize:12, color: isOfficer ? "#5A5138" : T.slate }}>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {msgs.length <= 1 && (
          <div style={{ padding:"0 16px 8px", display:"flex", gap:6, flexWrap:"wrap" }}>
            {quickQs.map((q, i) => (
              <button key={i} onClick={() => setInput(q)}
                style={{ padding:"5px 10px", borderRadius:20, fontSize:11,
                  background: isOfficer ? "rgba(184,146,47,0.1)" : "rgba(41,128,185,0.15)",
                  border:`1px solid ${isOfficer ? T.brass : "rgba(41,128,185,0.4)"}`,
                  color: isOfficer ? T.brass : "#5DADE2" }}>
                {q}
              </button>
            ))}
          </div>
        )}

        <div style={{ padding:"12px 16px", borderTop:`1px solid ${border}`,
          display:"flex", gap:10 }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Type your message..."
            style={{ flex:1, padding:"10px 14px", borderRadius:8, fontSize:13,
              background:inputBg, border:`1px solid ${inputBorder}`, color:textMain }}/>
          <button onClick={send} disabled={loading || !input.trim()}
            style={{ width:40, height:40, borderRadius:8, flexShrink:0,
              background:sendBg,
              display:"flex", alignItems:"center", justifyContent:"center",
              opacity: loading || !input.trim() ? 0.5 : 1 }}>
            <Send size={16} color="white"/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   UTILITY
════════════════════════════════════════════════ */
function Spin({ color="#B8922F" }) {
  return (
    <div style={{ width:16, height:16, flexShrink:0,
      border:"2px solid rgba(255,255,255,0.15)",
      borderTopColor:color, borderRadius:"50%",
      animation:"spin 0.7s linear infinite" }}/>
  );
}
