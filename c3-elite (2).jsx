import { useState, useEffect, useRef, useMemo } from "react";

// ─── AUTH CONFIG ─────────────────────────────────────────────────────────────
// Owner credentials — only YOU can log in as owner and see admin panel
const OWNER_EMAIL = "owner@c3elite.in";
const OWNER_PASSWORD = "C3Elite@2026";
// Student demo account
const STUDENT_EMAIL = "student@c3elite.in";
const STUDENT_PASSWORD = "student123";

// ─── STORAGE HELPERS ─────────────────────────────────────────────────────────
const STORAGE_KEY = "c3elite_uploads";
const AUTH_KEY = "c3elite_session";

async function loadUploads() {
  try {
    const r = await window.storage.get(STORAGE_KEY);
    return r ? JSON.parse(r.value) : { mocks: [], lectures: [], currentAffairs: [], notes: [] };
  } catch { return { mocks: [], lectures: [], currentAffairs: [], notes: [] }; }
}

async function saveUploads(data) {
  try { await window.storage.set(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

async function loadSession() {
  try {
    const r = await window.storage.get(AUTH_KEY);
    return r ? JSON.parse(r.value) : null;
  } catch { return null; }
}

async function saveSession(session) {
  try { await window.storage.set(AUTH_KEY, JSON.stringify(session)); } catch {}
}

async function clearSession() {
  try { await window.storage.delete(AUTH_KEY); } catch {}
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    if (email === OWNER_EMAIL && password === OWNER_PASSWORD) {
      const session = { email, role: "owner", name: "Owner" };
      await saveSession(session);
      onLogin(session);
    } else if (email === STUDENT_EMAIL && password === STUDENT_PASSWORD) {
      const session = { email, role: "student", name: "Arjun" };
      await saveSession(session);
      onLogin(session);
    } else {
      setError("Invalid credentials. Access denied.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.navy, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', system-ui, sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Background glow orbs */}
      <div style={{ position: "absolute", top: "15%", left: "20%", width: 400, height: 400, background: `radial-gradient(circle, ${COLORS.blue}18 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "15%", width: 300, height: 300, background: `radial-gradient(circle, ${COLORS.cyan}12 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", right: "30%", width: 200, height: 200, background: `radial-gradient(circle, ${COLORS.purple}10 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 420, padding: "0 20px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 16, background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`, fontSize: 24, fontWeight: 900, marginBottom: 16, boxShadow: `0 0 40px ${COLORS.blue}40` }}>C³</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.white, letterSpacing: "-0.5px" }}>C³ ELITE</div>
          <div style={{ fontSize: 12, color: COLORS.cyan, letterSpacing: 3, textTransform: "uppercase", marginTop: 4 }}>Command • Conquer • Cloud</div>
          <div style={{ fontSize: 13, color: COLORS.slate, marginTop: 10 }}>India's Premier Exam Operating System</div>
        </div>

        {/* Card */}
        <div style={{ background: "linear-gradient(135deg, rgba(20,29,47,0.98) 0%, rgba(11,17,32,0.99) 100%)", border: `1px solid ${COLORS.navyBorder}`, borderRadius: 16, padding: "32px 28px" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.white, marginBottom: 24 }}>Secure Login</div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: COLORS.slate, fontWeight: 600, letterSpacing: 0.5, display: "block", marginBottom: 6 }}>EMAIL ADDRESS</label>
            <input
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Enter your email"
              style={{ width: "100%", padding: "11px 14px", background: COLORS.navyLight, border: `1px solid ${COLORS.navyBorder}`, borderRadius: 8, color: COLORS.white, fontSize: 14, outline: "none" }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: COLORS.slate, fontWeight: 600, letterSpacing: 0.5, display: "block", marginBottom: 6 }}>PASSWORD</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="Enter your password"
                style={{ width: "100%", padding: "11px 40px 11px 14px", background: COLORS.navyLight, border: `1px solid ${COLORS.navyBorder}`, borderRadius: 8, color: COLORS.white, fontSize: 14, outline: "none" }}
              />
              <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: COLORS.slate, cursor: "pointer", fontSize: 14 }}>
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ padding: "10px 14px", background: `${COLORS.crimson}15`, border: `1px solid ${COLORS.crimson}40`, borderRadius: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: COLORS.crimson }}>⚠ {error}</span>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            style={{ width: "100%", padding: "12px", borderRadius: 10, background: loading || !email || !password ? COLORS.navyBorder : `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`, border: "none", color: loading || !email || !password ? COLORS.slate : "#fff", fontSize: 15, fontWeight: 800, cursor: loading || !email || !password ? "not-allowed" : "pointer", transition: "all 0.2s", letterSpacing: 0.5 }}
          >
            {loading ? "Authenticating..." : "Access Platform →"}
          </button>

          <div style={{ marginTop: 20, padding: "12px 14px", background: COLORS.navyCard, borderRadius: 8, border: `1px solid ${COLORS.navyBorder}` }}>
            <div style={{ fontSize: 11, color: COLORS.slate, marginBottom: 6, fontWeight: 600 }}>DEMO STUDENT LOGIN</div>
            <div style={{ fontSize: 11, color: COLORS.slate }}>Email: <span style={{ color: COLORS.cyan }}>{STUDENT_EMAIL}</span></div>
            <div style={{ fontSize: 11, color: COLORS.slate, marginTop: 2 }}>Password: <span style={{ color: COLORS.cyan }}>{STUDENT_PASSWORD}</span></div>
            <div style={{ fontSize: 10, color: COLORS.slate, marginTop: 5, opacity: 0.5 }}>Owner access credentials are private.</div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: COLORS.slate }}>
          🔒 Secured access • Unauthorized entry prohibited
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ onClose }) {
  const [activeTab, setActiveTab] = useState("mocks");
  const [uploads, setUploads] = useState({ mocks: [], lectures: [], currentAffairs: [], notes: [] });
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadUploads().then(setUploads); }, []);

  const tabs = [
    { id: "mocks", label: "📝 Mock Tests", icon: "📝" },
    { id: "lectures", label: "🎬 Lectures", icon: "🎬" },
    { id: "currentAffairs", label: "📡 Current Affairs", icon: "📡" },
    { id: "notes", label: "📄 Notes/PDFs", icon: "📄" },
  ];

  const fields = {
    mocks: [
      { key: "title", label: "Test Title", placeholder: "e.g. UPSC Prelims Mock #13" },
      { key: "subject", label: "Subject/Exam", placeholder: "e.g. UPSC GS, SSC CGL Tier-1" },
      { key: "date", label: "Scheduled Date", placeholder: "e.g. June 10, 2025 9:00 AM" },
      { key: "totalQ", label: "Total Questions", placeholder: "e.g. 100" },
      { key: "duration", label: "Duration (mins)", placeholder: "e.g. 120" },
      { key: "difficulty", label: "Difficulty", placeholder: "Easy / Medium / Hard" },
      { key: "link", label: "Test Link / Drive URL", placeholder: "https://..." },
      { key: "prize", label: "Prize Pool (optional)", placeholder: "e.g. ₹10,000" },
    ],
    lectures: [
      { key: "title", label: "Lecture Title", placeholder: "e.g. Polity: DPSP Deep Dive" },
      { key: "subject", label: "Subject", placeholder: "e.g. Polity, Economy" },
      { key: "topic", label: "Topic Covered", placeholder: "e.g. Articles 36-51" },
      { key: "duration", label: "Duration", placeholder: "e.g. 1h 45m" },
      { key: "link", label: "Video URL (YouTube/Drive)", placeholder: "https://..." },
      { key: "thumbnail", label: "Thumbnail URL (optional)", placeholder: "https://..." },
      { key: "notes", label: "Notes/Description", placeholder: "Brief overview..." },
    ],
    currentAffairs: [
      { key: "title", label: "Article/Topic Title", placeholder: "e.g. India-US iCET Summit 2025" },
      { key: "date", label: "Date", placeholder: "e.g. June 5, 2025" },
      { key: "source", label: "Source", placeholder: "e.g. The Hindu, PIB" },
      { key: "tags", label: "Tags (comma separated)", placeholder: "e.g. IR, Defence, UPSC" },
      { key: "summary", label: "Summary", placeholder: "Key points of the news..." },
      { key: "prelimsFacts", label: "Prelims Facts (one per line)", placeholder: "Fact 1\nFact 2" },
      { key: "mainsAngle", label: "Mains Angle", placeholder: "How this is relevant for Mains..." },
      { key: "link", label: "Full Article Link (optional)", placeholder: "https://..." },
    ],
    notes: [
      { key: "title", label: "File Title", placeholder: "e.g. Polity Complete Notes" },
      { key: "subject", label: "Subject", placeholder: "e.g. Polity" },
      { key: "type", label: "Type", placeholder: "PDF / Image / Doc" },
      { key: "link", label: "Google Drive / Direct URL", placeholder: "https://drive.google.com/..." },
      { key: "description", label: "Description", placeholder: "What's covered in this file..." },
      { key: "pages", label: "Pages/Size (optional)", placeholder: "e.g. 48 pages" },
    ],
  };

  const handleAdd = async () => {
    if (!form.title && !form.link) return;
    const newItem = { ...form, id: Date.now(), uploadedAt: new Date().toLocaleString() };
    const updated = { ...uploads, [activeTab]: [newItem, ...uploads[activeTab]] };
    setUploads(updated);
    await saveUploads(updated);
    setForm({});
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = async (id) => {
    const updated = { ...uploads, [activeTab]: uploads[activeTab].filter(i => i.id !== id) };
    setUploads(updated);
    await saveUploads(updated);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
      <div style={{ width: "min(96vw, 900px)", maxHeight: "90vh", background: COLORS.navySurface, border: `1px solid ${COLORS.navyBorder}`, borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${COLORS.navyBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(6,182,212,0.06))", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: COLORS.white }}>👑 Owner Admin Panel</div>
            <div style={{ fontSize: 12, color: COLORS.cyan, marginTop: 2 }}>Upload & Manage Content • Visible only to you</div>
          </div>
          <button onClick={onClose} style={{ padding: "7px 14px", borderRadius: 8, background: COLORS.navyCard, border: `1px solid ${COLORS.navyBorder}`, color: COLORS.slate, fontSize: 13, cursor: "pointer" }}>✕ Close</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, padding: "12px 24px 0", borderBottom: `1px solid ${COLORS.navyBorder}`, flexShrink: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setActiveTab(t.id); setForm({}); }} style={{ padding: "8px 16px", borderRadius: "8px 8px 0 0", border: `1px solid ${activeTab === t.id ? COLORS.blue : COLORS.navyBorder}`, borderBottom: "none", background: activeTab === t.id ? `${COLORS.blue}20` : COLORS.navyCard, color: activeTab === t.id ? COLORS.blue : COLORS.slate, fontSize: 13, fontWeight: activeTab === t.id ? 700 : 400, cursor: "pointer" }}>
              {t.label} <span style={{ fontSize: 11, marginLeft: 4, color: activeTab === t.id ? COLORS.cyan : COLORS.slate }}>({uploads[t.id]?.length || 0})</span>
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Upload Form */}
          <div>
            <div style={{ fontSize: 13, color: COLORS.cyan, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Add New</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {fields[activeTab].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, color: COLORS.slate, fontWeight: 600, letterSpacing: 0.5, display: "block", marginBottom: 4 }}>{f.label.toUpperCase()}</label>
                  {f.key === "summary" || f.key === "prelimsFacts" || f.key === "mainsAngle" || f.key === "notes" || f.key === "description" ? (
                    <textarea
                      value={form[f.key] || ""} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder} rows={3}
                      style={{ width: "100%", padding: "8px 12px", background: COLORS.navyLight, border: `1px solid ${COLORS.navyBorder}`, borderRadius: 8, color: COLORS.white, fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit" }}
                    />
                  ) : (
                    <input
                      value={form[f.key] || ""} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      style={{ width: "100%", padding: "8px 12px", background: COLORS.navyLight, border: `1px solid ${COLORS.navyBorder}`, borderRadius: 8, color: COLORS.white, fontSize: 13, outline: "none" }}
                    />
                  )}
                </div>
              ))}
              <button
                onClick={handleAdd}
                style={{ padding: "11px", borderRadius: 8, background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", marginTop: 4, transition: "opacity 0.2s" }}
              >
                {saved ? "✅ Saved!" : "⬆ Upload & Save"}
              </button>
            </div>
          </div>

          {/* Uploaded list */}
          <div>
            <div style={{ fontSize: 13, color: COLORS.cyan, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Uploaded ({uploads[activeTab]?.length || 0})</div>
            {uploads[activeTab]?.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: COLORS.slate, fontSize: 13, background: COLORS.navyCard, borderRadius: 8, border: `1px dashed ${COLORS.navyBorder}` }}>
                No content uploaded yet. Add your first item →
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {uploads[activeTab].map(item => (
                  <div key={item.id} style={{ padding: "12px 14px", background: COLORS.navyCard, border: `1px solid ${COLORS.navyBorder}`, borderRadius: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: COLORS.white, fontWeight: 600 }}>{item.title || "(Untitled)"}</div>
                        {item.subject && <div style={{ fontSize: 11, color: COLORS.cyan, marginTop: 2 }}>{item.subject}</div>}
                        {item.date && <div style={{ fontSize: 11, color: COLORS.slate, marginTop: 1 }}>📅 {item.date}</div>}
                        {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: COLORS.blue, marginTop: 2, display: "block", wordBreak: "break-all" }}>🔗 {item.link.length > 40 ? item.link.slice(0, 40) + "..." : item.link}</a>}
                        <div style={{ fontSize: 10, color: COLORS.slate, marginTop: 4 }}>Added: {item.uploadedAt}</div>
                      </div>
                      <button onClick={() => handleDelete(item.id)} style={{ padding: "4px 9px", borderRadius: 6, background: `${COLORS.crimson}15`, border: `1px solid ${COLORS.crimson}40`, color: COLORS.crimson, fontSize: 11, cursor: "pointer", flexShrink: 0 }}>🗑 Del</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


const COLORS = {
  navy: "#0a0f1e",
  navyMid: "#0d1528",
  navySurface: "#111827",
  navyCard: "#141d2f",
  navyBorder: "#1e2d4a",
  navyLight: "#1a2640",
  blue: "#3b82f6",
  blueGlow: "#60a5fa",
  cyan: "#06b6d4",
  cyanGlow: "#22d3ee",
  gold: "#f59e0b",
  goldLight: "#fcd34d",
  emerald: "#10b981",
  emeraldLight: "#34d399",
  orange: "#f97316",
  crimson: "#ef4444",
  purple: "#8b5cf6",
  slate: "#94a3b8",
  slateLight: "#cbd5e1",
  white: "#f8fafc",
};

const subjectData = [
  { name: "Polity", completion: 78, retention: 82, accuracy: 74, color: COLORS.blue, icon: "⚖" },
  { name: "History", completion: 65, retention: 70, accuracy: 68, color: COLORS.purple, icon: "📜" },
  { name: "Geography", completion: 72, retention: 68, accuracy: 71, color: COLORS.emerald, icon: "🌏" },
  { name: "Economy", completion: 55, retention: 60, accuracy: 58, color: COLORS.gold, icon: "📈" },
  { name: "Environment", completion: 45, retention: 55, accuracy: 62, color: COLORS.emeraldLight, icon: "🌿" },
  { name: "Science", completion: 60, retention: 65, accuracy: 69, color: COLORS.cyan, icon: "⚗" },
  { name: "Quant", completion: 70, retention: 75, accuracy: 72, color: COLORS.orange, icon: "∑" },
  { name: "Reasoning", completion: 80, retention: 78, accuracy: 82, color: COLORS.blue, icon: "🧩" },
  { name: "English", completion: 85, retention: 88, accuracy: 86, color: COLORS.cyanGlow, icon: "✒" },
  { name: "Curr. Affairs", completion: 40, retention: 50, accuracy: 55, color: COLORS.crimson, icon: "📰" },
];

const mockQuestions = [
  {
    id: 1,
    question: "Which of the following is NOT a feature of the basic structure of the Indian Constitution?",
    options: [
      "Supremacy of the Constitution",
      "Judicial Review",
      "Federalism with strong centre",
      "Parliamentary form of government",
    ],
    correct: 2,
    explanation:
      "The basic structure doctrine, established in Kesavananda Bharati case (1973), includes supremacy of the Constitution, rule of law, judicial review, and parliamentary democracy. 'Federalism with strong centre' is a feature of the constitutional structure, but 'basic structure' specifically refers to indestructible features. The Supreme Court has never explicitly listed a 'strong centre' as a basic structure element.",
    difficulty: "Hard",
    subject: "Polity",
    prelims: true,
  },
  {
    id: 2,
    question: "The 'Wassenaar Arrangement' is associated with:",
    options: [
      "Nuclear non-proliferation",
      "Export controls on conventional arms and dual-use goods",
      "Chemical weapons prohibition",
      "Biological weapons convention",
    ],
    correct: 1,
    explanation:
      "The Wassenaar Arrangement on Export Controls for Conventional Arms and Dual-Use Goods and Technologies was established in 1996. India became a member in 2017. It aims to prevent destabilizing accumulations of arms and dual-use items. UPSC frequently asks about India's membership in multilateral export control regimes.",
    difficulty: "Medium",
    subject: "International Relations",
    prelims: true,
  },
  {
    id: 3,
    question: "Which enzyme is responsible for converting sucrose into glucose and fructose?",
    options: ["Amylase", "Invertase (Sucrase)", "Lactase", "Maltase"],
    correct: 1,
    explanation:
      "Invertase (also called Sucrase) catalyzes the hydrolysis of sucrose into glucose and fructose. This process is called 'inversion' because the optical rotation of the products differs from sucrose. SSC CGL frequently tests basic biochemistry.",
    difficulty: "Easy",
    subject: "Science",
    prelims: true,
  },
];

const roadmapData = {
  UPSC: {
    Prelims: {
      Polity: {
        Constitution: {
          "Basic Structure Doctrine": { status: "mastered", questions: 45, accuracy: 92 },
          "Fundamental Rights": { status: "strong", questions: 62, accuracy: 85 },
          "DPSP": { status: "revision", questions: 38, accuracy: 74 },
          "Amendment Procedure": { status: "learning", questions: 22, accuracy: 65 },
        },
        Parliament: {
          "Lok Sabha Powers": { status: "strong", questions: 55, accuracy: 88 },
          "Rajya Sabha Composition": { status: "revision", questions: 40, accuracy: 76 },
          "Parliamentary Committees": { status: "learning", questions: 18, accuracy: 62 },
        },
      },
      History: {
        "Ancient India": {
          "Indus Valley Civilization": { status: "mastered", questions: 52, accuracy: 91 },
          "Vedic Period": { status: "strong", questions: 48, accuracy: 84 },
          "Mauryan Empire": { status: "revision", questions: 35, accuracy: 78 },
        },
        "Modern India": {
          "1857 Revolt": { status: "strong", questions: 42, accuracy: 86 },
          "Freedom Movement": { status: "learning", questions: 28, accuracy: 68 },
          "Partition": { status: "not_started", questions: 0, accuracy: 0 },
        },
      },
      Geography: {
        "Physical Geography": {
          "Indian Rivers": { status: "mastered", questions: 60, accuracy: 90 },
          "Himalayas": { status: "strong", questions: 45, accuracy: 83 },
          "Monsoon System": { status: "revision", questions: 32, accuracy: 75 },
        },
      },
    },
    "Mains GS-I": {
      "Indian Heritage & Culture": {
        "Art Forms": {
          "Classical Dances": { status: "revision", questions: 25, accuracy: 72 },
          "Music Traditions": { status: "learning", questions: 15, accuracy: 60 },
        },
      },
    },
  },
};

const STATUS_CONFIG = {
  not_started: { label: "Not Started", color: "#374151", bg: "#1f2937", dot: "#6b7280" },
  learning: { label: "Learning", color: "#1d4ed8", bg: "#1e3a5f", dot: "#3b82f6" },
  revision: { label: "Revision", color: "#92400e", bg: "#3d1f06", dot: "#f59e0b" },
  strong: { label: "Strong", color: "#065f46", bg: "#064e3b", dot: "#10b981" },
  mastered: { label: "Mastered", color: "#4c1d95", bg: "#2e1065", dot: "#8b5cf6" },
};

const weeklyData = [
  { day: "Mon", hours: 6.5, score: 72 },
  { day: "Tue", hours: 7.2, score: 78 },
  { day: "Wed", hours: 5.8, score: 68 },
  { day: "Thu", hours: 8.1, score: 85 },
  { day: "Fri", hours: 7.5, score: 80 },
  { day: "Sat", hours: 9.2, score: 90 },
  { day: "Sun", hours: 4.2, score: 60 },
];

const currentAffairs = [
  {
    id: 1,
    title: "India-US Strategic Partnership: Technology Transfer & Defence Co-production",
    date: "June 4, 2025",
    source: "The Hindu Editorial",
    relevance: "High",
    tags: ["IR", "Defence", "Tech"],
    summary:
      "The iCET (Initiative on Critical and Emerging Technologies) framework has formalized defence-technology co-production between India and the US. Key agreements include GE F414 jet engine manufacturing in India, semiconductor ecosystem development, and AI collaboration for defence applications.",
    keyTakeaways: [
      "GE F414 engine technology transfer for LCA Mk2",
      "CHIPS Act alignment for semiconductor supply chains",
      "Space situational awareness data sharing",
    ],
    prelimsFacts: [
      "iCET launched at PM Modi-Biden summit 2023",
      "GE F414 produces ~98kN thrust",
      "India joins US Semiconductor consortium",
    ],
    mainsInsights:
      "This represents a paradigm shift from India's traditional non-alignment to what strategists call 'multi-alignment.' The technology transfer reflects India's emerging status as a trusted partner in the Indo-Pacific security architecture.",
    expectedQuestions: [
      "What is the significance of iCET for India's defence modernization?",
      "Discuss the evolution of India-US strategic partnership from estrangement to convergence.",
    ],
  },
  {
    id: 2,
    title: "RBI's Monetary Policy: Balancing Growth and Inflation in 2025",
    date: "June 3, 2025",
    source: "Economic Times",
    relevance: "High",
    tags: ["Economy", "RBI", "Monetary Policy"],
    summary:
      "The RBI MPC maintained repo rate at 6.5% citing sticky core inflation while acknowledging GDP growth moderation to 6.8% for FY25. Governor highlights transmission mechanism challenges and unconventional policy tools.",
    keyTakeaways: [
      "Repo rate held at 6.5% for 7th consecutive meeting",
      "GDP growth projection revised to 6.8%",
      "Standing Deposit Facility at 6.25%",
    ],
    prelimsFacts: [
      "MPC has 6 members: 3 RBI + 3 external",
      "Inflation target: 4% ± 2%",
      "MCLR = benchmark lending rate",
    ],
    mainsInsights:
      "The RBI's stance reflects the classic monetary policy trilemma. With global rate cuts beginning, India must calibrate domestic policy against capital flow management and exchange rate stability.",
    expectedQuestions: [
      "Examine the challenges faced by India's monetary policy in a post-pandemic world.",
      "How does the inflation targeting framework constrain RBI's policy space?",
    ],
  },
];

const flashcards = [
  {
    front: "Article 32",
    back: "Right to Constitutional Remedies — Dr. Ambedkar called it the 'Heart and Soul' of the Constitution. Allows citizens to move Supreme Court for enforcement of Fundamental Rights. Can be suspended only during National Emergency (Art. 359).",
    category: "Constitution",
    difficulty: "Medium",
  },
  {
    front: "Purchasing Power Parity (PPP)",
    back: "A method of measuring the relative purchasing power of different countries' currencies over the same types of goods. India is the 3rd largest economy by PPP. PPP exchange rate eliminates price level differences between countries.",
    category: "Economy",
    difficulty: "Easy",
  },
  {
    front: "Ramsar Convention",
    back: "International treaty (1971) for conservation and sustainable use of wetlands. India has 75+ Ramsar sites. Chilika Lake (Odisha) was India's first Ramsar site (1981). Loktak Lake, Wular Lake, Bhitarkanika are important sites frequently asked in UPSC.",
    category: "Environment",
    difficulty: "Medium",
  },
  {
    front: "Operation Flood",
    back: "India's National Dairy Development Programme launched in 1970 by Dr. Verghese Kurien ('Milkman of India'). Created AMUL model. Made India the world's largest milk producer. Three phases: 1970-80, 1981-85, 1985-96.",
    category: "Economy",
    difficulty: "Easy",
  },
];

const sidebarItems = [
  { id: "command", label: "Command Center", icon: "⌘" },
  { id: "roadmap", label: "Roadmap", icon: "🗺" },
  { id: "arena", label: "Mock Arena", icon: "⚔" },
  { id: "vault", label: "CA Vault", icon: "📡" },
  { id: "mentor", label: "AI Mentor", icon: "🤖" },
  { id: "revision", label: "Revision Engine", icon: "🔄" },
  { id: "performance", label: "Performance Lab", icon: "📊" },
  { id: "rank", label: "Rank Predictor", icon: "🎯" },
  { id: "focus", label: "Focus Room", icon: "🧘" },
];

// Circular Progress Component
function CircularProgress({ percentage, size = 80, strokeWidth = 6, color, label, sub }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={COLORS.navyBorder} strokeWidth={strokeWidth} />
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.white }}>{percentage}%</span>
        </div>
      </div>
      {label && <span style={{ fontSize: 11, color: COLORS.slate, textAlign: "center" }}>{label}</span>}
      {sub && <span style={{ fontSize: 10, color: color, textAlign: "center" }}>{sub}</span>}
    </div>
  );
}

// Bar Chart
function MiniBar({ value, max = 100, color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <span style={{ fontSize: 11, color: COLORS.slate, width: 80, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 6, background: COLORS.navyBorder, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: color, borderRadius: 3, transition: "width 1s ease" }} />
      </div>
      <span style={{ fontSize: 11, color, width: 32, textAlign: "right", fontWeight: 600 }}>{value}%</span>
    </div>
  );
}

// Glass Card
function GlassCard({ children, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "linear-gradient(135deg, rgba(20,29,47,0.95) 0%, rgba(11,17,32,0.98) 100%)",
        border: `1px solid ${COLORS.navyBorder}`,
        borderRadius: 12,
        padding: "16px 18px",
        backdropFilter: "blur(10px)",
        cursor: onClick ? "pointer" : "default",
        transition: "border-color 0.2s, transform 0.2s",
        ...style,
      }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.borderColor = COLORS.blue; e.currentTarget.style.transform = "translateY(-1px)"; } }}
      onMouseLeave={e => { if (onClick) { e.currentTarget.style.borderColor = COLORS.navyBorder; e.currentTarget.style.transform = "translateY(0)"; } }}
    >
      {children}
    </div>
  );
}

// Stat Badge
function StatBadge({ label, value, color = COLORS.blue, icon }) {
  return (
    <div style={{ background: COLORS.navyCard, border: `1px solid ${COLORS.navyBorder}`, borderRadius: 8, padding: "10px 14px", minWidth: 100 }}>
      <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color, letterSpacing: "-0.5px" }}>{value}</div>
      <div style={{ fontSize: 11, color: COLORS.slate, marginTop: 2 }}>{label}</div>
    </div>
  );
}

// ─── COMMAND CENTER ──────────────────────────────────────────────────────────
function CommandCenter() {
  const [activeExam, setActiveExam] = useState("UPSC");
  const [tasks, setTasks] = useState([
    { id: 1, text: "Read The Hindu Editorial", done: true, type: "reading" },
    { id: 2, text: "Solve Quant Set (30 Qs)", done: false, type: "practice" },
    { id: 3, text: "Revision Sprint: Polity Ch 3-5", done: false, type: "revision" },
    { id: 4, text: "PYQ Analysis: Economy 2019-22", done: true, type: "analysis" },
    { id: 5, text: "Mock Test Review: Science", done: false, type: "mock" },
    { id: 6, text: "Current Affairs: June 4 Digest", done: false, type: "reading" },
  ]);

  const exams = ["UPSC", "SSC CGL", "Banking", "Railways"];
  const examStats = {
    UPSC: { rank: "4,218", percentile: "91.2", streak: 47, hours: 892, consistency: 87 },
    "SSC CGL": { rank: "12,450", percentile: "85.6", streak: 23, hours: 445, consistency: 78 },
    Banking: { rank: "8,920", percentile: "88.1", streak: 15, hours: 320, consistency: 72 },
    Railways: { rank: "22,100", percentile: "82.3", streak: 8, hours: 180, consistency: 65 },
  };
  const stats = examStats[activeExam];
  const taskTypeColor = { reading: COLORS.blue, practice: COLORS.orange, revision: COLORS.gold, analysis: COLORS.purple, mock: COLORS.crimson };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Welcome Header */}
      <div style={{ background: "linear-gradient(135deg, #0d1f3c 0%, #0a1528 50%, #111827 100%)", border: `1px solid ${COLORS.navyBorder}`, borderRadius: 16, padding: "24px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, background: `radial-gradient(circle, ${COLORS.blue}20 0%, transparent 70%)`, borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -30, left: 200, width: 120, height: 120, background: `radial-gradient(circle, ${COLORS.cyan}15 0%, transparent 70%)`, borderRadius: "50%" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: COLORS.cyan, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Mission Active — Day 47</div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: COLORS.white, margin: 0, letterSpacing: "-0.5px" }}>
              Welcome back, <span style={{ background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.cyan})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Arjun</span>
            </h1>
            <p style={{ color: COLORS.slate, fontSize: 14, marginTop: 6, marginBottom: 0 }}>You're in the top 9% nationally. Keep the momentum — 3 tasks pending today.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <StatBadge label="National Rank" value={stats.rank} color={COLORS.gold} icon="🏆" />
            <StatBadge label="Percentile" value={`${stats.percentile}%`} color={COLORS.cyan} icon="📊" />
            <StatBadge label="Day Streak" value={stats.streak} color={COLORS.emerald} icon="🔥" />
            <StatBadge label="Study Hours" value={stats.hours} color={COLORS.purple} icon="⏱" />
          </div>
        </div>
      </div>

      {/* Exam Switcher */}
      <div style={{ display: "flex", gap: 8 }}>
        {exams.map(exam => (
          <button
            key={exam}
            onClick={() => setActiveExam(exam)}
            style={{
              padding: "8px 18px", borderRadius: 8, border: `1px solid ${activeExam === exam ? COLORS.blue : COLORS.navyBorder}`,
              background: activeExam === exam ? `linear-gradient(135deg, ${COLORS.blue}30, ${COLORS.cyan}15)` : COLORS.navyCard,
              color: activeExam === exam ? COLORS.blueGlow : COLORS.slate,
              fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
            }}
          >
            {exam}
          </button>
        ))}
      </div>

      {/* Mission Status */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
        {[
          { label: "Today's Tasks", value: "6", sub: "3 completed", color: COLORS.blue, icon: "✅" },
          { label: "Pending Revisions", value: "14", sub: "Due this week", color: COLORS.gold, icon: "🔄" },
          { label: "Mock Tests Due", value: "2", sub: "This weekend", color: COLORS.orange, icon: "📝" },
          { label: "Momentum Score", value: "87%", sub: "Weekly avg", color: COLORS.emerald, icon: "⚡" },
          { label: "Weak Topics", value: "5", sub: "Need attention", color: COLORS.crimson, icon: "⚠" },
        ].map((item, i) => (
          <GlassCard key={i}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: item.color }}>{item.value}</div>
            <div style={{ fontSize: 13, color: COLORS.white, fontWeight: 600, marginTop: 2 }}>{item.label}</div>
            <div style={{ fontSize: 11, color: COLORS.slate, marginTop: 2 }}>{item.sub}</div>
          </GlassCard>
        ))}
      </div>

      {/* Progress + Daily Mission in 2 cols */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Subject Progress */}
        <GlassCard style={{ gridColumn: "1" }}>
          <div style={{ fontSize: 13, color: COLORS.cyan, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Subject Mastery</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
            {subjectData.map((sub, i) => (
              <CircularProgress key={i} percentage={sub.completion} size={64} strokeWidth={5} color={sub.color} label={sub.name} sub={`${sub.accuracy}% acc`} />
            ))}
          </div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${COLORS.navyBorder}` }}>
            <div style={{ fontSize: 11, color: COLORS.slate, marginBottom: 8 }}>Retention Rates</div>
            {subjectData.slice(0, 5).map((sub, i) => (
              <MiniBar key={i} value={sub.retention} color={sub.color} label={sub.name} />
            ))}
          </div>
        </GlassCard>

        {/* Daily Mission Planner */}
        <GlassCard>
          <div style={{ fontSize: 13, color: COLORS.cyan, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Daily Mission Planner</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {tasks.map(task => (
              <div
                key={task.id}
                onClick={() => setTasks(prev => prev.map(t => t.id === task.id ? { ...t, done: !t.done } : t))}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                  background: task.done ? `${COLORS.emerald}12` : COLORS.navyLight,
                  border: `1px solid ${task.done ? COLORS.emerald + "40" : COLORS.navyBorder}`,
                  borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: 4, border: `2px solid ${task.done ? COLORS.emerald : COLORS.navyBorder}`,
                  background: task.done ? COLORS.emerald : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all 0.2s",
                }}>
                  {task.done && <span style={{ fontSize: 11, color: "#fff" }}>✓</span>}
                </div>
                <span style={{ fontSize: 13, color: task.done ? COLORS.slate : COLORS.slateLight, textDecoration: task.done ? "line-through" : "none", flex: 1 }}>{task.text}</span>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: taskTypeColor[task.type], flexShrink: 0 }} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${COLORS.navyBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: COLORS.slate }}>
              {tasks.filter(t => t.done).length}/{tasks.length} completed
            </span>
            <div style={{ height: 6, flex: 1, margin: "0 12px", background: COLORS.navyBorder, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${(tasks.filter(t => t.done).length / tasks.length) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${COLORS.emerald}, ${COLORS.cyan})`, borderRadius: 3 }} />
            </div>
            <span style={{ fontSize: 12, color: COLORS.emerald, fontWeight: 700 }}>
              {Math.round((tasks.filter(t => t.done).length / tasks.length) * 100)}%
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Weekly Heatmap */}
      <GlassCard>
        <div style={{ fontSize: 13, color: COLORS.cyan, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>This Week's Performance</div>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          {weeklyData.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: COLORS.cyan, fontWeight: 700 }}>{d.score}%</span>
              <div style={{ width: "100%", background: COLORS.navyBorder, borderRadius: 4, overflow: "hidden", height: 80, display: "flex", alignItems: "flex-end" }}>
                <div style={{
                  width: "100%", height: `${(d.hours / 10) * 100}%`,
                  background: d.hours >= 8 ? `linear-gradient(0deg, ${COLORS.blue}, ${COLORS.cyan})` : d.hours >= 6 ? `linear-gradient(0deg, ${COLORS.blue}80, ${COLORS.blue})` : `${COLORS.blue}40`,
                  borderRadius: 4, transition: "height 1s ease",
                }} />
              </div>
              <span style={{ fontSize: 11, color: COLORS.slate }}>{d.day}</span>
              <span style={{ fontSize: 10, color: COLORS.gold }}>{d.hours}h</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

// ─── ROADMAP ──────────────────────────────────────────────────────────────────
function RoadmapView() {
  const [expanded, setExpanded] = useState({});
  const [statusOverride, setStatusOverride] = useState({});

  const toggle = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const renderTopics = (topics, path) => {
    return Object.entries(topics).map(([topic, chapters]) => {
      const key = `${path}/${topic}`;
      const isOpen = expanded[key];
      if (typeof chapters === "object" && !("status" in chapters)) {
        return (
          <div key={key} style={{ marginLeft: 16, marginTop: 4 }}>
            <div
              onClick={() => toggle(key)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6, cursor: "pointer", background: isOpen ? COLORS.navyLight : "transparent", color: COLORS.slateLight, fontSize: 13, fontWeight: 600, transition: "all 0.2s" }}
            >
              <span style={{ color: isOpen ? COLORS.blue : COLORS.slate, fontSize: 10, transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>▶</span>
              {topic}
            </div>
            {isOpen && (
              <div style={{ marginLeft: 12, borderLeft: `1px solid ${COLORS.navyBorder}`, paddingLeft: 8 }}>
                {renderTopics(chapters, key)}
              </div>
            )}
          </div>
        );
      } else if ("status" in chapters) {
        const status = statusOverride[key] || chapters.status;
        const cfg = STATUS_CONFIG[status];
        const statuses = Object.keys(STATUS_CONFIG);
        return (
          <div key={key} style={{ marginLeft: 16, marginTop: 3, display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, background: COLORS.navyCard }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: COLORS.slateLight, flex: 1 }}>{topic}</span>
            <span style={{ fontSize: 11, color: COLORS.slate }}>{chapters.questions}Q • {chapters.accuracy}%</span>
            <select
              value={status}
              onChange={e => setStatusOverride(prev => ({ ...prev, [key]: e.target.value }))}
              onClick={e => e.stopPropagation()}
              style={{ background: cfg.bg, color: cfg.dot, border: `1px solid ${cfg.dot}40`, borderRadius: 4, padding: "2px 6px", fontSize: 11, cursor: "pointer" }}
            >
              {statuses.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
            </select>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
        {Object.entries(STATUS_CONFIG).map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", background: v.bg, borderRadius: 20, border: `1px solid ${v.dot}40` }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: v.dot }} />
            <span style={{ fontSize: 11, color: v.dot }}>{v.label}</span>
          </div>
        ))}
      </div>
      {Object.entries(roadmapData).map(([exam, sections]) => (
        <GlassCard key={exam}>
          <div style={{ fontSize: 14, color: COLORS.white, fontWeight: 800, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{exam}</span>
          </div>
          {Object.entries(sections).map(([section, topics]) => {
            const key = `${exam}/${section}`;
            const isOpen = expanded[key];
            return (
              <div key={key} style={{ marginBottom: 8 }}>
                <div
                  onClick={() => toggle(key)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, cursor: "pointer", background: isOpen ? `${COLORS.blue}15` : COLORS.navyLight, border: `1px solid ${isOpen ? COLORS.blue + "40" : COLORS.navyBorder}`, transition: "all 0.2s" }}
                >
                  <span style={{ color: isOpen ? COLORS.blue : COLORS.slate, fontSize: 12, transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>▶</span>
                  <span style={{ fontSize: 14, color: COLORS.white, fontWeight: 700 }}>{section}</span>
                  <span style={{ marginLeft: "auto", fontSize: 11, color: COLORS.slate }}>{Object.keys(topics).length} subjects</span>
                </div>
                {isOpen && (
                  <div style={{ marginTop: 4 }}>
                    {renderTopics(topics, key)}
                  </div>
                )}
              </div>
            );
          })}
        </GlassCard>
      ))}
    </div>
  );
}

// ─── MOCK ARENA ──────────────────────────────────────────────────────────────
function MockArena() {
  const [activeQ, setActiveQ] = useState(0);
  const [selected, setSelected] = useState({});
  const [revealed, setRevealed] = useState({});

  const q = mockQuestions[activeQ];
  const sel = selected[activeQ];
  const rev = revealed[activeQ];

  const handleSelect = (idx) => {
    if (rev) return;
    setSelected(prev => ({ ...prev, [activeQ]: idx }));
  };

  const handleReveal = () => {
    if (sel === undefined) return;
    setRevealed(prev => ({ ...prev, [activeQ]: true }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Upcoming Mocks */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { name: "Mega Mock #12", date: "June 8, 9:00 AM", registered: 48200, prize: "₹50,000", difficulty: "Hard", color: COLORS.crimson },
          { name: "National Weekly GT", date: "June 7, 7:00 AM", registered: 32100, prize: "₹20,000", difficulty: "Medium", color: COLORS.gold },
          { name: "Sectional: Polity", date: "June 6, 3:00 PM", registered: 15400, prize: "₹5,000", difficulty: "Medium", color: COLORS.blue },
        ].map((mock, i) => (
          <GlassCard key={i} onClick={() => {}}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ fontSize: 14, color: COLORS.white, fontWeight: 700 }}>{mock.name}</div>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: mock.color + "20", color: mock.color, fontWeight: 700 }}>{mock.difficulty}</span>
            </div>
            <div style={{ fontSize: 12, color: COLORS.slate, marginBottom: 8 }}>🕐 {mock.date}</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: COLORS.slate }}>👥 {(mock.registered / 1000).toFixed(1)}K</span>
              <span style={{ fontSize: 13, color: COLORS.gold, fontWeight: 700 }}>{mock.prize}</span>
            </div>
            <button style={{ width: "100%", marginTop: 10, padding: "7px", borderRadius: 6, background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`, border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              Register Now
            </button>
          </GlassCard>
        ))}
      </div>

      {/* Quiz Engine */}
      <GlassCard>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: COLORS.cyan, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Practice Quiz</div>
          <div style={{ display: "flex", gap: 8 }}>
            {mockQuestions.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveQ(i)}
                style={{
                  width: 28, height: 28, borderRadius: 6, border: `1px solid ${activeQ === i ? COLORS.blue : COLORS.navyBorder}`,
                  background: revealed[i] ? (selected[i] === mockQuestions[i].correct ? `${COLORS.emerald}20` : `${COLORS.crimson}20`) : activeQ === i ? `${COLORS.blue}20` : COLORS.navyCard,
                  color: activeQ === i ? COLORS.blue : COLORS.slate, fontSize: 12, fontWeight: 700, cursor: "pointer",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 10, background: `${COLORS.purple}20`, color: COLORS.purple, fontWeight: 600 }}>{q.subject}</span>
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 10, background: `${q.difficulty === "Hard" ? COLORS.crimson : q.difficulty === "Medium" ? COLORS.gold : COLORS.emerald}20`, color: q.difficulty === "Hard" ? COLORS.crimson : q.difficulty === "Medium" ? COLORS.gold : COLORS.emerald, fontWeight: 600 }}>{q.difficulty}</span>
        </div>

        <p style={{ fontSize: 15, color: COLORS.white, fontWeight: 600, lineHeight: 1.6, marginBottom: 16 }}>{q.question}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {q.options.map((opt, i) => {
            let bg = COLORS.navyCard;
            let border = COLORS.navyBorder;
            let color = COLORS.slateLight;
            if (rev) {
              if (i === q.correct) { bg = `${COLORS.emerald}15`; border = COLORS.emerald; color = COLORS.emeraldLight; }
              else if (i === sel && sel !== q.correct) { bg = `${COLORS.crimson}15`; border = COLORS.crimson; color = COLORS.crimson; }
            } else if (sel === i) {
              bg = `${COLORS.blue}15`; border = COLORS.blue; color = COLORS.blueGlow;
            }
            return (
              <div
                key={i}
                onClick={() => handleSelect(i)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, border: `1px solid ${border}`, background: bg, cursor: rev ? "default" : "pointer", transition: "all 0.2s" }}
              >
                <span style={{ width: 20, height: 20, borderRadius: 4, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color, flexShrink: 0 }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={{ fontSize: 13, color }}>{opt}</span>
                {rev && i === q.correct && <span style={{ marginLeft: "auto", fontSize: 12, color: COLORS.emerald, fontWeight: 700 }}>✓ Correct</span>}
                {rev && i === sel && sel !== q.correct && <span style={{ marginLeft: "auto", fontSize: 12, color: COLORS.crimson, fontWeight: 700 }}>✗ Wrong</span>}
              </div>
            );
          })}
        </div>

        {!rev && (
          <button
            onClick={handleReveal}
            disabled={sel === undefined}
            style={{ marginTop: 12, padding: "9px 20px", borderRadius: 8, background: sel !== undefined ? `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})` : COLORS.navyBorder, border: "none", color: sel !== undefined ? "#fff" : COLORS.slate, fontSize: 13, fontWeight: 700, cursor: sel !== undefined ? "pointer" : "not-allowed" }}
          >
            {sel !== undefined ? "Submit & Reveal" : "Select an option first"}
          </button>
        )}

        {rev && (
          <div style={{ marginTop: 14, padding: "14px 16px", background: COLORS.navyLight, borderRadius: 8, border: `1px solid ${COLORS.navyBorder}` }}>
            <div style={{ fontSize: 13, color: COLORS.gold, fontWeight: 700, marginBottom: 8 }}>📚 Explanation</div>
            <p style={{ fontSize: 13, color: COLORS.slateLight, lineHeight: 1.7, margin: 0 }}>{q.explanation}</p>
          </div>
        )}
      </GlassCard>

      {/* AI Mistake Analyzer */}
      <GlassCard>
        <div style={{ fontSize: 13, color: COLORS.cyan, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>⚡ AI Mistake Analyzer</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: COLORS.slate, marginBottom: 8 }}>Top Areas To Fix</div>
            {[
              { topic: "Permutations & Combinations", error: "42%", type: "Conceptual" },
              { topic: "Modern History: 1857-1947", error: "35%", type: "Factual" },
              { topic: "Reading Comprehension", error: "28%", type: "Time" },
              { topic: "Environmental Treaties", error: "25%", type: "Memory" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: "8px 10px", background: COLORS.navyCard, borderRadius: 6 }}>
                <span style={{ fontSize: 11, color: COLORS.crimson, fontWeight: 700 }}{...{}}>#{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: COLORS.white }}>{item.topic}</div>
                  <div style={{ fontSize: 11, color: COLORS.slate }}>{item.type} error</div>
                </div>
                <span style={{ fontSize: 12, color: COLORS.crimson, fontWeight: 700 }}>{item.error} err</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 12, color: COLORS.slate, marginBottom: 8 }}>Question Pattern</div>
            {[
              { label: "Correct", value: 64, color: COLORS.emerald },
              { label: "Wrong", value: 22, color: COLORS.crimson },
              { label: "Guessed Right", value: 8, color: COLORS.gold },
              { label: "Left", value: 6, color: COLORS.slate },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 12, color: COLORS.slate }}>{item.label}</span>
                  <span style={{ fontSize: 12, color: item.color, fontWeight: 700 }}>{item.value}%</span>
                </div>
                <div style={{ height: 6, background: COLORS.navyBorder, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${item.value}%`, height: "100%", background: item.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

// ─── CURRENT AFFAIRS VAULT ────────────────────────────────────────────────────
function CAVault() {
  const [selectedArticle, setSelectedArticle] = useState(0);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const article = currentAffairs[selectedArticle];
  const card = flashcards[flashcardIndex];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Article selector */}
      <div style={{ display: "flex", gap: 8 }}>
        {currentAffairs.map((a, i) => (
          <GlassCard
            key={i}
            onClick={() => setSelectedArticle(i)}
            style={{ flex: 1, border: `1px solid ${selectedArticle === i ? COLORS.blue : COLORS.navyBorder}`, background: selectedArticle === i ? `linear-gradient(135deg, ${COLORS.blue}15, ${COLORS.cyan}08)` : undefined }}
          >
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
              {a.tags.map(t => <span key={t} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 10, background: `${COLORS.blue}20`, color: COLORS.blue }}>{t}</span>)}
            </div>
            <div style={{ fontSize: 13, color: COLORS.white, fontWeight: 600, lineHeight: 1.4 }}>{a.title}</div>
            <div style={{ fontSize: 11, color: COLORS.slate, marginTop: 4 }}>{a.date} • {a.source}</div>
          </GlassCard>
        ))}
      </div>

      {/* Editorial Decoder — split screen */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <GlassCard>
          <div style={{ fontSize: 13, color: COLORS.cyan, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Editorial Summary</div>
          <p style={{ fontSize: 13, color: COLORS.slateLight, lineHeight: 1.8 }}>{article.summary}</p>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: COLORS.gold, fontWeight: 700, marginBottom: 8 }}>🔑 Key Takeaways</div>
            {article.keyTakeaways.map((k, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <span style={{ color: COLORS.blue, flexShrink: 0 }}>→</span>
                <span style={{ fontSize: 12, color: COLORS.slateLight }}>{k}</span>
              </div>
            ))}
          </div>
        </GlassCard>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <GlassCard style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: COLORS.emerald, fontWeight: 700, marginBottom: 8 }}>📌 Prelims Facts</div>
            {article.prelimsFacts.map((f, i) => (
              <div key={i} style={{ fontSize: 12, color: COLORS.slateLight, marginBottom: 5, paddingLeft: 12, borderLeft: `2px solid ${COLORS.emerald}40` }}>{f}</div>
            ))}
          </GlassCard>
          <GlassCard style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: COLORS.purple, fontWeight: 700, marginBottom: 8 }}>✍ Mains Insight</div>
            <p style={{ fontSize: 12, color: COLORS.slateLight, lineHeight: 1.7, margin: 0 }}>{article.mainsInsights}</p>
          </GlassCard>
          <GlassCard>
            <div style={{ fontSize: 12, color: COLORS.gold, fontWeight: 700, marginBottom: 8 }}>❓ Expected Questions</div>
            {article.expectedQuestions.map((q, i) => (
              <div key={i} style={{ fontSize: 12, color: COLORS.slateLight, marginBottom: 6, padding: "6px 10px", background: COLORS.navyLight, borderRadius: 6 }}>{q}</div>
            ))}
          </GlassCard>
        </div>
      </div>

      {/* Flashcards */}
      <GlassCard>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: COLORS.cyan, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Smart Flashcards</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: COLORS.slate }}>{flashcardIndex + 1}/{flashcards.length}</span>
            <button onClick={() => { setFlashcardIndex(i => (i - 1 + flashcards.length) % flashcards.length); setFlipped(false); }} style={{ padding: "4px 10px", background: COLORS.navyCard, border: `1px solid ${COLORS.navyBorder}`, borderRadius: 6, color: COLORS.slate, cursor: "pointer" }}>←</button>
            <button onClick={() => { setFlashcardIndex(i => (i + 1) % flashcards.length); setFlipped(false); }} style={{ padding: "4px 10px", background: COLORS.navyCard, border: `1px solid ${COLORS.navyBorder}`, borderRadius: 6, color: COLORS.slate, cursor: "pointer" }}>→</button>
          </div>
        </div>
        <div
          onClick={() => setFlipped(f => !f)}
          style={{
            minHeight: 160, padding: 24, borderRadius: 10, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center",
            background: flipped ? `linear-gradient(135deg, ${COLORS.blue}20, ${COLORS.cyan}10)` : `linear-gradient(135deg, ${COLORS.navyLight}, ${COLORS.navyCard})`,
            border: `1px solid ${flipped ? COLORS.blue + "50" : COLORS.navyBorder}`,
            transition: "all 0.3s",
          }}
        >
          <span style={{ fontSize: 11, color: flipped ? COLORS.cyan : COLORS.gold, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
            {flipped ? "ANSWER" : "TERM"} • {card.category}
          </span>
          <div style={{ fontSize: flipped ? 13 : 20, color: COLORS.white, fontWeight: flipped ? 400 : 700, lineHeight: flipped ? 1.7 : 1.3 }}>
            {flipped ? card.back : card.front}
          </div>
          {!flipped && <span style={{ fontSize: 11, color: COLORS.slate, marginTop: 12 }}>Click to reveal →</span>}
        </div>
      </GlassCard>
    </div>
  );
}

// ─── AI MENTOR ───────────────────────────────────────────────────────────────
function AIMentor() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Welcome to your AI Mentor session. I'm here to help you with study planning, doubt solving, strategy, and motivation. What would you like to work on today?", time: "10:00 AM" },
    { role: "user", text: "I'm struggling with Economy, especially monetary policy topics. How should I approach them?", time: "10:02 AM" },
    { role: "assistant", text: "Great question! Here's your personalized Economy roadmap:\n\n**Phase 1 (Week 1-2):** Build fundamentals with NCERT Class 11-12 Economics. Focus on: Money & Banking, Inflation theories, and RBI functions.\n\n**Phase 2 (Week 3-4):** Deep-dive into monetary policy instruments — CRR, SLR, Repo Rate, Open Market Operations. Use RBI Annual Report for current data.\n\n**Phase 3 (Week 5):** PYQ analysis — UPSC asks 4-6 Economy questions in Prelims. Pattern: ~2 from monetary policy, ~1 from fiscal, ~2 from current topics.\n\nYour accuracy in Economy is 58% — target 72%+ before Prelims. I'll add 3 Economy revision sessions to your weekly planner.", time: "10:02 AM" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const suggestions = [
    "Create my study schedule for next week",
    "Explain basic structure doctrine simply",
    "What's my weakest topic right now?",
    "Give me a Mains answer framework for governance",
    "Predict my Prelims score based on current data",
  ];

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { role: "user", text, time: now }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "Based on your performance analytics, I've identified that this is a high-priority area. Your current metrics show strong potential — let me customize a focused plan for you. I'll generate a targeted 7-day sprint with daily goals, recommended resources, and checkpoint tests to measure your progress efficiently.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    }, 1800);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {[
          { label: "Study Plans Created", value: 12, icon: "📅", color: COLORS.blue },
          { label: "Doubts Resolved", value: 87, icon: "✅", color: COLORS.emerald },
          { label: "Sessions Today", value: 3, icon: "🤖", color: COLORS.purple },
        ].map((s, i) => (
          <GlassCard key={i}>
            <div style={{ fontSize: 22 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, marginTop: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: COLORS.slate, marginTop: 2 }}>{s.label}</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${COLORS.navyBorder}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
          <div>
            <div style={{ fontSize: 13, color: COLORS.white, fontWeight: 700 }}>C³ AI Mentor</div>
            <div style={{ fontSize: 11, color: COLORS.emerald }}>● Online • Personalized to your data</div>
          </div>
        </div>

        <div style={{ height: 320, overflowY: "auto", padding: "14px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", gap: 3 }}>
              <div style={{
                maxWidth: "80%", padding: "10px 14px", borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                background: msg.role === "user" ? `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan}80)` : COLORS.navyLight,
                border: `1px solid ${msg.role === "user" ? COLORS.blue + "50" : COLORS.navyBorder}`,
              }}>
                <p style={{ fontSize: 13, color: COLORS.white, margin: 0, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{msg.text}</p>
              </div>
              <span style={{ fontSize: 10, color: COLORS.slate }}>{msg.time}</span>
            </div>
          ))}
          {typing && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
              <div style={{ padding: "10px 14px", borderRadius: "12px 12px 12px 2px", background: COLORS.navyLight, border: `1px solid ${COLORS.navyBorder}` }}>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.blue, animation: "bounce 0.8s infinite", animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: "8px 12px", borderTop: `1px solid ${COLORS.navyBorder}`, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => sendMessage(s)} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 12, background: COLORS.navyCard, border: `1px solid ${COLORS.navyBorder}`, color: COLORS.slate, cursor: "pointer" }}>
              {s}
            </button>
          ))}
        </div>

        <div style={{ padding: "10px 14px", borderTop: `1px solid ${COLORS.navyBorder}`, display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask anything about your preparation..."
            style={{ flex: 1, background: COLORS.navyCard, border: `1px solid ${COLORS.navyBorder}`, borderRadius: 8, padding: "8px 12px", color: COLORS.white, fontSize: 13, outline: "none" }}
          />
          <button onClick={() => sendMessage(input)} style={{ padding: "8px 16px", background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`, border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Send
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

// ─── PERFORMANCE LAB ─────────────────────────────────────────────────────────
function PerformanceLab() {
  const [activeMetric, setActiveMetric] = useState("accuracy");

  const metrics = {
    accuracy: weeklyData.map(d => ({ ...d, val: d.score })),
    hours: weeklyData.map(d => ({ ...d, val: Math.round(d.hours * 10) })),
  };

  const maxVal = Math.max(...metrics[activeMetric].map(d => d.val));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {[
          { label: "Avg Accuracy", value: "74.2%", change: "+3.1%", color: COLORS.blue },
          { label: "Avg Daily Hours", value: "7.1h", change: "+0.8h", color: COLORS.cyan },
          { label: "Questions Solved", value: "4,892", change: "+124", color: COLORS.gold },
          { label: "Revision Coverage", value: "68%", change: "+5%", color: COLORS.emerald },
        ].map((m, i) => (
          <GlassCard key={i}>
            <div style={{ fontSize: 22, fontWeight: 800, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 12, color: COLORS.slateLight, marginTop: 2 }}>{m.label}</div>
            <div style={{ fontSize: 11, color: COLORS.emerald, marginTop: 4 }}>↑ {m.change} this week</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: COLORS.cyan, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Weekly Trends</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["accuracy", "hours"].map(m => (
              <button key={m} onClick={() => setActiveMetric(m)} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${activeMetric === m ? COLORS.blue : COLORS.navyBorder}`, background: activeMetric === m ? `${COLORS.blue}20` : COLORS.navyCard, color: activeMetric === m ? COLORS.blue : COLORS.slate, fontSize: 12, cursor: "pointer", textTransform: "capitalize" }}>
                {m}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 120 }}>
          {metrics[activeMetric].map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%" }}>
              <span style={{ fontSize: 11, color: COLORS.cyan, fontWeight: 700 }}>{d.val}{activeMetric === "accuracy" ? "%" : ""}</span>
              <div style={{ flex: 1, width: "100%", background: COLORS.navyBorder, borderRadius: 4, overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
                <div style={{ width: "100%", height: `${(d.val / maxVal) * 100}%`, background: `linear-gradient(0deg, ${COLORS.blue}, ${COLORS.cyan})`, borderRadius: 4, transition: "height 0.8s ease" }} />
              </div>
              <span style={{ fontSize: 11, color: COLORS.slate }}>{d.day}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <GlassCard>
          <div style={{ fontSize: 13, color: COLORS.cyan, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Subject Growth</div>
          {subjectData.map((s, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 12, color: COLORS.slateLight }}>{s.name}</span>
                <span style={{ fontSize: 12, color: s.color, fontWeight: 700 }}>{s.accuracy}%</span>
              </div>
              <div style={{ height: 4, background: COLORS.navyBorder, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${s.accuracy}%`, height: "100%", background: s.color, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </GlassCard>

        <GlassCard>
          <div style={{ fontSize: 13, color: COLORS.cyan, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Time Distribution</div>
          {[
            { label: "New Learning", pct: 35, color: COLORS.blue },
            { label: "Revision", pct: 28, color: COLORS.gold },
            { label: "Mock Tests", pct: 20, color: COLORS.orange },
            { label: "Current Affairs", pct: 12, color: COLORS.cyan },
            { label: "Discussion", pct: 5, color: COLORS.slate },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: COLORS.slateLight, flex: 1 }}>{item.label}</span>
              <div style={{ width: 80, height: 5, background: COLORS.navyBorder, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${item.pct}%`, height: "100%", background: item.color }} />
              </div>
              <span style={{ fontSize: 12, color: item.color, fontWeight: 700, width: 32 }}>{item.pct}%</span>
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  );
}

// ─── RANK PREDICTOR ──────────────────────────────────────────────────────────
function RankPredictor() {
  const [prelims, setPrelims] = useState(68);
  const [mains, setMains] = useState(58);

  const predictedRank = Math.max(100, Math.round(50000 - ((prelims + mains) / 2) * 480));
  const selectionProb = Math.min(98, Math.max(2, Math.round((prelims + mains) / 2 - 20)));
  const expectedScore = Math.round((prelims * 0.4 + mains * 0.6) * 2.5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <GlassCard>
        <div style={{ fontSize: 13, color: COLORS.cyan, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 18 }}>AI Rank Forecaster</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: COLORS.slateLight }}>Prelims Readiness</span>
                <span style={{ fontSize: 14, color: COLORS.blue, fontWeight: 700 }}>{prelims}%</span>
              </div>
              <input type="range" min="0" max="100" value={prelims} onChange={e => setPrelims(+e.target.value)} style={{ width: "100%", accentColor: COLORS.blue }} />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: COLORS.slateLight }}>Mains Readiness</span>
                <span style={{ fontSize: 14, color: COLORS.purple, fontWeight: 700 }}>{mains}%</span>
              </div>
              <input type="range" min="0" max="100" value={mains} onChange={e => setMains(+e.target.value)} style={{ width: "100%", accentColor: COLORS.purple }} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: "14px 18px", background: `linear-gradient(135deg, ${COLORS.gold}15, ${COLORS.orange}08)`, border: `1px solid ${COLORS.gold}40`, borderRadius: 10, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: COLORS.gold, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Predicted Rank</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: COLORS.gold, letterSpacing: "-1px" }}>{predictedRank.toLocaleString()}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div style={{ padding: "10px 12px", background: COLORS.navyCard, border: `1px solid ${COLORS.navyBorder}`, borderRadius: 8, textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.emerald }}>{selectionProb}%</div>
                <div style={{ fontSize: 11, color: COLORS.slate }}>Selection Prob.</div>
              </div>
              <div style={{ padding: "10px 12px", background: COLORS.navyCard, border: `1px solid ${COLORS.navyBorder}`, borderRadius: 8, textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.cyan }}>{expectedScore}</div>
                <div style={{ fontSize: 11, color: COLORS.slate }}>Expected Score</div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div style={{ fontSize: 13, color: COLORS.cyan, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Score Benchmark</div>
        {[
          { label: "IAS (Rank 1-100)", cutoff: 95, color: COLORS.gold },
          { label: "IPS (Rank 101-500)", cutoff: 88, color: COLORS.cyan },
          { label: "IFS (Rank 501-800)", cutoff: 82, color: COLORS.blue },
          { label: "Group A (Rank 801-1200)", cutoff: 75, color: COLORS.purple },
          { label: "Group B (Rank 1201+)", cutoff: 68, color: COLORS.slate },
        ].map((item, i) => {
          const current = Math.round((prelims + mains) / 2);
          const isAbove = current >= item.cutoff;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: isAbove ? COLORS.emerald : COLORS.crimson, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: COLORS.slateLight, flex: 1 }}>{item.label}</span>
              <div style={{ width: 100, height: 5, background: COLORS.navyBorder, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${item.cutoff}%`, height: "100%", background: item.color }} />
              </div>
              <span style={{ fontSize: 11, color: item.color, width: 32 }}>{item.cutoff}%</span>
              <span style={{ fontSize: 11, color: isAbove ? COLORS.emerald : COLORS.crimson, fontWeight: 700, width: 60 }}>{isAbove ? "✓ On track" : "✗ Below"}</span>
            </div>
          );
        })}
      </GlassCard>
    </div>
  );
}

// ─── FOCUS ROOM ───────────────────────────────────────────────────────────────
function FocusRoom() {
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState("focus"); // focus | break
  const [seconds, setSeconds] = useState(25 * 60);
  const [sessions, setSessions] = useState(4);
  const [sound, setSound] = useState("rain");
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setMode(m => m === "focus" ? "break" : "focus");
            setSessions(s => s + (mode === "focus" ? 0.5 : 0));
            return mode === "focus" ? 5 * 60 : 25 * 60;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const totalSecs = mode === "focus" ? 25 * 60 : 5 * 60;
  const progress = ((totalSecs - seconds) / totalSecs) * 100;
  const circumference = 2 * Math.PI * 110;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
      <div style={{ display: "flex", gap: 8 }}>
        {["focus", "short break", "long break"].map(m => (
          <button key={m} onClick={() => { setMode(m.includes("break") ? "break" : "focus"); setSeconds(m === "short break" ? 5 * 60 : m === "long break" ? 15 * 60 : 25 * 60); setRunning(false); }} style={{ padding: "7px 16px", borderRadius: 8, border: `1px solid ${mode === (m.includes("break") ? "break" : "focus") && m === (mode === "focus" ? "focus" : "short break") ? COLORS.cyan : COLORS.navyBorder}`, background: COLORS.navyCard, color: COLORS.slate, fontSize: 12, cursor: "pointer", textTransform: "capitalize" }}>
            {m}
          </button>
        ))}
      </div>

      <div style={{ position: "relative", width: 260, height: 260 }}>
        <svg width="260" height="260" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="130" cy="130" r="110" fill="none" stroke={COLORS.navyBorder} strokeWidth="8" />
          <circle cx="130" cy="130" r="110" fill="none" stroke={mode === "focus" ? COLORS.blue : COLORS.emerald} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={circumference - (progress / 100) * circumference} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <div style={{ fontSize: 11, color: mode === "focus" ? COLORS.blue : COLORS.emerald, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>{mode === "focus" ? "🧘 Focus" : "☕ Break"}</div>
          <div style={{ fontSize: 54, fontWeight: 900, color: COLORS.white, letterSpacing: "-2px", fontVariantNumeric: "tabular-nums" }}>{mins}:{secs}</div>
          <div style={{ fontSize: 12, color: COLORS.slate }}>Session {Math.floor(sessions) + 1}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={() => setRunning(r => !r)}
          style={{ padding: "12px 32px", borderRadius: 10, background: running ? `${COLORS.crimson}20` : `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`, border: `1px solid ${running ? COLORS.crimson : "transparent"}`, color: running ? COLORS.crimson : "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", minWidth: 120 }}
        >
          {running ? "⏸ Pause" : "▶ Start"}
        </button>
        <button onClick={() => { setRunning(false); setSeconds(mode === "focus" ? 25 * 60 : 5 * 60); }} style={{ padding: "12px 20px", borderRadius: 10, background: COLORS.navyCard, border: `1px solid ${COLORS.navyBorder}`, color: COLORS.slate, fontSize: 14, cursor: "pointer" }}>
          ↺ Reset
        </button>
      </div>

      <GlassCard style={{ width: "100%", maxWidth: 500 }}>
        <div style={{ fontSize: 13, color: COLORS.cyan, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Ambient Sounds</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {[
            { id: "rain", label: "Rain", icon: "🌧" },
            { id: "forest", label: "Forest", icon: "🌿" },
            { id: "ocean", label: "Ocean", icon: "🌊" },
            { id: "white", label: "White Noise", icon: "🔊" },
            { id: "cafe", label: "Café", icon: "☕" },
            { id: "fire", label: "Fireplace", icon: "🔥" },
            { id: "space", label: "Space", icon: "🌌" },
            { id: "off", label: "Silence", icon: "🔇" },
          ].map(s => (
            <button key={s.id} onClick={() => setSound(s.id)} style={{ padding: "10px 8px", borderRadius: 8, border: `1px solid ${sound === s.id ? COLORS.cyan : COLORS.navyBorder}`, background: sound === s.id ? `${COLORS.cyan}15` : COLORS.navyCard, color: COLORS.slateLight, fontSize: 11, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
      </GlassCard>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, width: "100%", maxWidth: 500 }}>
        {[
          { label: "Sessions Today", value: Math.floor(sessions), color: COLORS.blue },
          { label: "Focus Time", value: `${Math.floor(sessions) * 25}m`, color: COLORS.cyan },
          { label: "Productivity", value: "92%", color: COLORS.emerald },
        ].map((s, i) => (
          <GlassCard key={i} style={{ textAlign: "center", padding: "12px 8px" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: COLORS.slate, marginTop: 2 }}>{s.label}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

// ─── REVISION ENGINE ─────────────────────────────────────────────────────────
function RevisionEngine() {
  const [view, setView] = useState("queue");

  const revisionQueue = [
    { topic: "Basic Structure Doctrine", subject: "Polity", daysAgo: 7, strength: 72, priority: "High" },
    { topic: "Monetary Policy Tools", subject: "Economy", daysAgo: 5, strength: 55, priority: "Critical" },
    { topic: "Ramsar Convention Sites", subject: "Environment", daysAgo: 3, strength: 60, priority: "Medium" },
    { topic: "Vedic Period Economy", subject: "History", daysAgo: 14, strength: 45, priority: "Critical" },
    { topic: "Indian Ocean Geopolitics", subject: "Geography", daysAgo: 2, strength: 80, priority: "Low" },
    { topic: "DPSP Classification", subject: "Polity", daysAgo: 10, strength: 62, priority: "High" },
  ];

  const priorityColor = { Critical: COLORS.crimson, High: COLORS.orange, Medium: COLORS.gold, Low: COLORS.emerald };

  const calendarDays = Array.from({ length: 28 }, (_, i) => {
    const intensity = Math.random();
    return { day: i + 1, intensity, color: intensity > 0.7 ? COLORS.blue : intensity > 0.4 ? COLORS.blue + "80" : intensity > 0.1 ? COLORS.blue + "40" : COLORS.navyBorder };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {["queue", "calendar", "matrix"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{ padding: "7px 16px", borderRadius: 8, border: `1px solid ${view === v ? COLORS.blue : COLORS.navyBorder}`, background: view === v ? `${COLORS.blue}20` : COLORS.navyCard, color: view === v ? COLORS.blue : COLORS.slate, fontSize: 12, cursor: "pointer", textTransform: "capitalize" }}>
            {v === "queue" ? "📋 Queue" : v === "calendar" ? "📅 Calendar" : "📊 Matrix"}
          </button>
        ))}
      </div>

      {view === "queue" && (
        <GlassCard>
          <div style={{ fontSize: 13, color: COLORS.cyan, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Revision Queue — Spaced Repetition</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {revisionQueue.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: COLORS.navyCard, border: `1px solid ${COLORS.navyBorder}`, borderRadius: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: COLORS.white, fontWeight: 600 }}>{item.topic}</div>
                  <div style={{ fontSize: 11, color: COLORS.slate, marginTop: 2 }}>{item.subject} • Last revised {item.daysAgo}d ago</div>
                </div>
                <div style={{ width: 60 }}>
                  <div style={{ fontSize: 11, color: COLORS.slate, marginBottom: 2 }}>Strength</div>
                  <div style={{ height: 4, background: COLORS.navyBorder, borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${item.strength}%`, height: "100%", background: item.strength >= 70 ? COLORS.emerald : item.strength >= 50 ? COLORS.gold : COLORS.crimson }} />
                  </div>
                </div>
                <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 10, background: `${priorityColor[item.priority]}20`, color: priorityColor[item.priority], fontWeight: 700, flexShrink: 0 }}>{item.priority}</span>
                <button style={{ padding: "5px 12px", borderRadius: 6, background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`, border: "none", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                  Revise
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {view === "calendar" && (
        <GlassCard>
          <div style={{ fontSize: 13, color: COLORS.cyan, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Study Heatmap — June 2025</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
              <div key={d} style={{ fontSize: 11, color: COLORS.slate, textAlign: "center", marginBottom: 4 }}>{d}</div>
            ))}
            {calendarDays.map(d => (
              <div key={d.day} style={{ aspectRatio: "1", borderRadius: 4, background: d.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: d.intensity > 0.4 ? "#fff" : COLORS.slate, fontWeight: 600 }}>
                {d.day}
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {view === "matrix" && (
        <GlassCard>
          <div style={{ fontSize: 13, color: COLORS.cyan, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Priority Matrix</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Urgent + Important", items: ["Monetary Policy", "Vedic Period"], color: COLORS.crimson },
              { label: "Important, Not Urgent", items: ["Basic Structure", "DPSP Classification"], color: COLORS.orange },
              { label: "Urgent, Not Important", items: ["Ramsar Sites", "Indian Ocean"], color: COLORS.gold },
              { label: "Neither", items: ["Medieval Art", "Regional Festivals"], color: COLORS.slate },
            ].map((quad, i) => (
              <div key={i} style={{ padding: "12px 14px", background: `${quad.color}10`, border: `1px solid ${quad.color}30`, borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: quad.color, fontWeight: 700, marginBottom: 8 }}>{quad.label}</div>
                {quad.items.map((item, j) => (
                  <div key={j} style={{ fontSize: 12, color: COLORS.slateLight, marginBottom: 4, paddingLeft: 8, borderLeft: `2px solid ${quad.color}50` }}>{item}</div>
                ))}
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function C3Elite() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeView, setActiveView] = useState("command");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Restore session on mount
  useEffect(() => {
    loadSession().then(s => { setSession(s); setAuthLoading(false); });
  }, []);

  const handleLogin = (s) => setSession(s);

  const handleLogout = async () => {
    await clearSession();
    setSession(null);
    setShowAdmin(false);
  };

  const isOwner = session?.role === "owner";

  const views = {
    command: { label: "Command Center", component: <CommandCenter /> },
    roadmap: { label: "Roadmap", component: <RoadmapView /> },
    arena: { label: "Mock Arena", component: <MockArena /> },
    vault: { label: "CA Vault", component: <CAVault /> },
    mentor: { label: "AI Mentor", component: <AIMentor /> },
    revision: { label: "Revision Engine", component: <RevisionEngine /> },
    performance: { label: "Performance Lab", component: <PerformanceLab /> },
    rank: { label: "Rank Predictor", component: <RankPredictor /> },
    focus: { label: "Focus Room", component: <FocusRoom /> },
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.navy, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, margin: "0 auto 16px" }}>C³</div>
          <div style={{ fontSize: 14, color: COLORS.slate }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!session) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.navy, fontFamily: "'Segoe UI', system-ui, sans-serif", color: COLORS.white }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${COLORS.navySurface}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.navyBorder}; border-radius: 2px; }
        input[type=range] { -webkit-appearance: none; height: 5px; border-radius: 3px; background: ${COLORS.navyBorder}; outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: ${COLORS.blue}; cursor: pointer; }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        select { outline: none; }
        textarea { font-family: inherit; }
      `}</style>

      {/* Owner Admin Panel Overlay */}
      {showAdmin && isOwner && <AdminPanel onClose={() => setShowAdmin(false)} />}

      {/* Sidebar */}
      <div style={{
        width: sidebarCollapsed ? 56 : 210,
        flexShrink: 0,
        background: COLORS.navySurface,
        borderRight: `1px solid ${COLORS.navyBorder}`,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
        overflow: "hidden",
        position: "sticky",
        top: 0,
        height: "100vh",
      }}>
        {/* Logo */}
        <div style={{ padding: "18px 14px 14px", borderBottom: `1px solid ${COLORS.navyBorder}`, display: "flex", alignItems: "center", gap: 10, minHeight: 62 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, flexShrink: 0 }}>C³</div>
          {!sidebarCollapsed && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: COLORS.white, letterSpacing: "-0.3px" }}>C³ ELITE</div>
              <div style={{ fontSize: 9, color: COLORS.cyan, letterSpacing: 1, textTransform: "uppercase" }}>Command • Conquer • Cloud</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              title={sidebarCollapsed ? item.label : ""}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "9px 10px", borderRadius: 8, marginBottom: 2, border: "none",
                background: activeView === item.id ? `linear-gradient(135deg, ${COLORS.blue}30, ${COLORS.cyan}15)` : "transparent",
                color: activeView === item.id ? COLORS.blueGlow : COLORS.slate,
                fontSize: 13, fontWeight: activeView === item.id ? 700 : 400,
                cursor: "pointer", transition: "all 0.15s", textAlign: "left",
                borderLeft: activeView === item.id ? `3px solid ${COLORS.blue}` : "3px solid transparent",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              {!sidebarCollapsed && item.label}
            </button>
          ))}

          {/* Owner-only Admin button */}
          {isOwner && (
            <button
              onClick={() => setShowAdmin(true)}
              title={sidebarCollapsed ? "Admin Panel" : ""}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "9px 10px", borderRadius: 8, marginTop: 8, border: `1px solid ${COLORS.gold}40`,
                background: `linear-gradient(135deg, ${COLORS.gold}15, ${COLORS.orange}08)`,
                color: COLORS.gold, fontSize: 13, fontWeight: 700,
                cursor: "pointer", transition: "all 0.15s", textAlign: "left", whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>👑</span>
              {!sidebarCollapsed && "Admin Panel"}
            </button>
          )}
        </nav>

        {/* User + Collapse */}
        <div style={{ padding: "10px 8px", borderTop: `1px solid ${COLORS.navyBorder}`, display: "flex", flexDirection: "column", gap: 6 }}>
          {!sidebarCollapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: COLORS.navyCard, borderRadius: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: isOwner ? `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.orange})` : `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                {session.name?.[0] || "U"}
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ fontSize: 12, color: COLORS.white, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{session.name}</div>
                <div style={{ fontSize: 10, color: isOwner ? COLORS.gold : COLORS.slate }}>{isOwner ? "👑 Owner" : "Student"}</div>
              </div>
              <button onClick={handleLogout} title="Logout" style={{ background: "none", border: "none", color: COLORS.slate, cursor: "pointer", fontSize: 14, padding: 2 }}>⏻</button>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(s => !s)}
            style={{ width: "100%", padding: "7px", borderRadius: 6, border: `1px solid ${COLORS.navyBorder}`, background: COLORS.navyCard, color: COLORS.slate, fontSize: 12, cursor: "pointer" }}
          >
            {sidebarCollapsed ? "→" : "← Collapse"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <div style={{ padding: "12px 24px", borderBottom: `1px solid ${COLORS.navyBorder}`, background: COLORS.navySurface, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.white }}>{views[activeView]?.label}</div>
            <div style={{ fontSize: 12, color: COLORS.slate, marginTop: 1 }}>UPSC CSE 2026 • Day 47 of 365</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {isOwner && (
              <button
                onClick={() => setShowAdmin(true)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: `linear-gradient(135deg, ${COLORS.gold}20, ${COLORS.orange}10)`, border: `1px solid ${COLORS.gold}50`, borderRadius: 20, color: COLORS.gold, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
              >
                👑 Admin Panel
              </button>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: `${COLORS.emerald}15`, border: `1px solid ${COLORS.emerald}40`, borderRadius: 20 }}>
              <span style={{ fontSize: 12, color: COLORS.emerald }}>🔥 47 Day Streak</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: COLORS.navyCard, border: `1px solid ${COLORS.navyBorder}`, borderRadius: 20 }}>
              <span style={{ fontSize: 12, color: COLORS.gold }}>🏆 Rank 4,218</span>
            </div>
            <div
              onClick={handleLogout}
              title="Logout"
              style={{ width: 34, height: 34, borderRadius: "50%", background: isOwner ? `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.orange})` : `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
            >
              {session.name?.[0] || "U"}
            </div>
          </div>
        </div>

        {/* View Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {views[activeView]?.component}
        </div>
      </div>
    </div>
  );
}
