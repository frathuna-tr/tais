'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const curRef = useRef<SVGSVGElement>(null)
  const mncRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const [notifOpen, setNotifOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [counts, setCounts] = useState({ c1: 0, c2: 0, c3: 0, c4: 0 })
  const [addedCards, setAddedCards] = useState<number[]>([])
  const [today, setToday] = useState('')

  const searchData = {
    akademisyenler: [
      { av: 'MD', color: '#3b82f6', name: 'Prof. Mehmet Demir', sub: 'ODTÜ · Biyomedikal Müh.', tag: '%91 uyum', tagClass: 'badge-g' },
      { av: 'SA', color: '#8b5cf6', name: 'Doç. Selin Arslan', sub: 'Hacettepe · Tıp', tag: '%88 uyum', tagClass: 'badge-g' },
      { av: 'KY', color: '#0ea5e9', name: 'Prof. Kemal Yıldız', sub: 'İTÜ · YZ Lab', tag: '%96 uyum', tagClass: 'badge-g' },
      { av: 'AK', color: '#f97316', name: 'Dr. Ali Kaya', sub: 'Boğaziçi · Bilgisayar', tag: '%85 uyum', tagClass: 'badge-g' },
    ],
    dergiler: [
      { av: 'NM', color: '#0a0a0a', name: 'Nature Medicine', sub: 'IF: 58.7 · Q1', tag: '18 gün', tagClass: 'badge-r' },
      { av: 'CB', color: '#0a0a0a', name: 'Computers in Biology', sub: 'IF: 7.7 · Q1', tag: 'Açık', tagClass: 'badge-g' },
      { av: 'AI', color: '#0a0a0a', name: 'AI in Medicine', sub: 'IF: 7.0 · Q1', tag: '45 gün', tagClass: 'badge-g' },
    ],
  }

  const filteredSearch = {
    akademisyenler: searchQuery
      ? searchData.akademisyenler.filter(x => x.name.toLowerCase().includes(searchQuery.toLowerCase()) || x.sub.toLowerCase().includes(searchQuery.toLowerCase()))
      : searchData.akademisyenler.slice(0, 3),
    dergiler: searchQuery
      ? searchData.dergiler.filter(x => x.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : searchData.dergiler.slice(0, 2),
  }

  useEffect(() => {
    const d = new Date()
    setToday(d.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
  }, [])

  // CURSOR
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (curRef.current) {
        curRef.current.style.left = (e.clientX - 2) + 'px'
        curRef.current.style.top = (e.clientY - 2) + 'px'
      }
    }
    document.addEventListener('mousemove', move)
    return () => document.removeEventListener('mousemove', move)
  }, [])

  // COUNTUP
  useEffect(() => {
    const countUp = (key: keyof typeof counts, target: number, dur: number) => {
      const start = Date.now()
      const iv = setInterval(() => {
        const p = Math.min((Date.now() - start) / dur, 1)
        const e = 1 - Math.pow(1 - p, 3)
        setCounts(prev => ({ ...prev, [key]: Math.floor(e * target) }))
        if (p >= 1) { setCounts(prev => ({ ...prev, [key]: target })); clearInterval(iv) }
      }, 16)
    }
    const t = setTimeout(() => {
      countUp('c1', 247, 1800); countUp('c2', 18, 1400); countUp('c3', 5, 900); countUp('c4', 3, 700)
    }, 400)
    return () => clearTimeout(t)
  }, [])

  // MİKRO NETWORK
  useEffect(() => {
    const mn = mncRef.current
    if (!mn) return
    const mc = mn.getContext('2d')!
    const mnp = [{x:4,y:4},{x:13,y:3},{x:22,y:4},{x:13,y:13},{x:13,y:22},{x:7,y:18},{x:19,y:18}]
    const mph = mnp.map(() => mnp.map(() => Math.random() * Math.PI * 2))
    let mt = 0, raf: number
    const drawMn = () => {
      mc.clearRect(0, 0, 26, 26)
      for (let i = 0; i < mnp.length; i++) for (let j = i + 1; j < mnp.length; j++) {
        const a = mnp[i], b = mnp[j], dx = a.x-b.x, dy = a.y-b.y, d = Math.sqrt(dx*dx+dy*dy)
        if (d < 16) {
          const fade = Math.max(0, Math.sin(mt * 0.9 + mph[i][j]))
          mc.beginPath(); mc.moveTo(a.x, a.y); mc.lineTo(b.x, b.y)
          mc.strokeStyle = `rgba(0,196,140,${fade*0.7*(1-d/16)})`; mc.lineWidth = 0.9; mc.stroke()
        }
      }
      mnp.forEach((p, i) => {
        const pulse = Math.sin(mt * 1.5 + i * 0.7)
        const g = 0.5 + 0.5 * Math.sin(mt * 0.8 + i * 1.2)
        mc.beginPath(); mc.arc(p.x, p.y, 1.8 + pulse * 0.5, 0, Math.PI * 2)
        mc.fillStyle = `rgba(${Math.round(240*(1-g))},${Math.round(244*(1-g)+196*g)},${Math.round(255*(1-g)+140*g)},${0.7+0.3*pulse})`
        mc.fill()
      })
      mt += 0.022; raf = requestAnimationFrame(drawMn)
    }
    drawMn()
    return () => cancelAnimationFrame(raf)
  }, [])

  const navItems = [
    { label: 'Dashboard', color: '#60a5fa', active: true, badge: '', href: '/dashboard' },
    { label: 'Akademik Ağ', color: '#a78bfa', active: false, badge: 'YZ', href: '/ag' },
    { label: 'Dergi Eşleştirme', color: '#34d399', active: false, badge: 'YZ', href: '/dergi' },
    { label: 'Preprint', color: '#fb923c', active: false, badge: '', href: '/preprint' },
    { label: 'Projeler', color: '#f472b6', active: false, badge: 'YZ', href: '/projeler' },
    { label: 'İş Birliği Alanı', color: '#00c48c', active: false, badge: 'YZ', href: '/isbirligi' },
    { label: 'CV', color: '#fbbf24', active: false, badge: 'YZ', href: '/cv' },
    { label: 'Yazı Asistanı', color: '#e879f9', active: false, badge: 'YZ', href: '/yazi' },
    { label: 'İntihal Kontrolü', color: '#38bdf8', active: false, badge: 'YZ', href: '/intihal' },
    { label: 'Mesajlar', color: 'rgba(255,255,255,0.45)', active: false, badge: '7', badgeRed: true, href: '/mesajlar' },
  ]

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; cursor: none !important; }
        :root { --g: #00c48c; --ink: #0a0a0a; --gray: #f2f2f0; --white: #fff; --border: rgba(0,0,0,0.07); }
        body { font-family: 'DM Sans', sans-serif; background: var(--gray); color: var(--ink); height: 100vh; overflow: hidden; }
        .badge-g { background: rgba(0,196,140,0.1); color: #008a64; font-size: 9px; padding: 2px 7px; font-weight: 600; }
        .badge-r { background: rgba(229,51,51,0.1); color: #c00; font-size: 9px; padding: 2px 7px; font-weight: 600; }
        .nav-icon { width:22px; height:22px; display:flex; align-items:center; justify-content:center; flex-shrink:0; background:rgba(255,255,255,0.07); border-radius:2px; padding:4px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 8px 18px; font-size: 13px; color: rgba(255,255,255,0.5); transition: all 0.2s; border-left: 2px solid transparent; cursor: pointer; }
        .nav-item:hover { color: #fff; background: rgba(255,255,255,0.04); }
        .nav-item.active { color: var(--g); border-left-color: var(--g); background: rgba(0,196,140,0.07); font-weight: 600; }
        .panel { background: var(--white); border: 1px solid var(--border); padding: 14px 16px; }
        .panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .panel-title { font-family: 'Pixelify Sans', monospace; font-size: 14px; font-weight: 700; color: var(--ink); }
        .panel-action { font-size: 11px; color: var(--g); font-weight: 600; cursor: pointer; }
        .quick-btn { background: var(--gray); border: 1px solid var(--border); padding: 14px 16px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s; }
        .quick-btn:hover { border-color: var(--g); background: #fafffd; }
        .ag-msg { width: 26px; height: 26px; background: var(--gray); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; cursor: pointer; transition: all 0.2s; border-radius: 2px; }
        .ag-msg:hover { background: var(--g); border-color: var(--g); }
        .suggest-card { border: 1px solid var(--border); padding: 12px 10px; display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; transition: all 0.2s; cursor: pointer; }
        .suggest-card:hover { border-color: rgba(0,196,140,0.3); background: #fafffd; }
        .suggest-add { width: 100%; background: var(--ink); color: #fff; border: none; padding: 5px 0; font-size: 10px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s; margin-top: 2px; }
        .suggest-add:hover { background: var(--g); color: var(--ink); }
        .suggest-add.added { background: rgba(0,196,140,0.1); color: var(--g); border: 1px solid rgba(0,196,140,0.2); }
        .nd-item { display: flex; align-items: flex-start; gap: 10px; padding: 11px 18px; border-bottom: 1px solid rgba(0,0,0,0.04); cursor: pointer; transition: background 0.15s; }
        .nd-item:hover { background: #f8fffe; }
        .nd-item.nd-new { background: linear-gradient(90deg,rgba(0,196,140,0.2) 0%,rgba(0,196,140,0.04) 50%,transparent 100%); }
        .sr-item { display: flex; align-items: center; gap: 10px; padding: 8px 16px; cursor: pointer; transition: background 0.15s; }
        .sr-item:hover { background: #f8fffe; }
        .radar-bar { flex: 1; height: 3px; background: rgba(0,0,0,0.06); border-radius: 2px; overflow: hidden; }
        .radar-fill { height: 100%; background: var(--g); border-radius: 2px; }
        .notif-badge { position: absolute; top: -5px; right: -5px; background: #e53; color: #fff; font-size: 9px; font-weight: 800; width: 17px; height: 17px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; animation: bp 2s infinite; }
        @keyframes bp { 0%,100% { box-shadow: 0 0 0 0 rgba(229,51,51,0.4); } 60% { box-shadow: 0 0 0 5px rgba(229,51,51,0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 900px) {
          .sidebar { position: fixed; left: -220px; top: 0; z-index: 200; transition: left 0.3s ease; }
          .sidebar.open { left: 0; }
          .two-col, .three-col { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* CURSOR */}
      <svg ref={curRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }} width="20" height="20" viewBox="0 0 10 10">
        <rect x="0" y="0" width="2" height="2" fill="#00c48c"/>
        <rect x="0" y="2" width="2" height="2" fill="#00c48c"/>
        <rect x="0" y="4" width="2" height="2" fill="#00c48c"/>
        <rect x="0" y="6" width="2" height="2" fill="#00c48c"/>
        <rect x="0" y="8" width="2" height="2" fill="#00c48c"/>
        <rect x="2" y="2" width="2" height="2" fill="#00c48c"/>
        <rect x="4" y="4" width="2" height="2" fill="#00c48c"/>
        <rect x="4" y="6" width="2" height="2" fill="#00c48c"/>
        <rect x="6" y="6" width="2" height="2" fill="#00c48c"/>
        <rect x="6" y="8" width="2" height="2" fill="#00c48c"/>
        <rect x="8" y="10" width="2" height="2" fill="#00c48c"/>
      </svg>

      {/* OVERLAY */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 199 }}/>}

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', height: '100vh' }}>

        {/* SIDEBAR */}
        <aside className={`sidebar${sidebarOpen ? ' open' : ''}`} style={{ background: 'linear-gradient(180deg,#0d1117 0%,#0a0f0c 100%)', display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto', borderRight: '1px solid rgba(0,196,140,0.15)' }}>
          {/* LOGO */}
          <div style={{ padding: '16px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <canvas ref={mncRef} width="26" height="26" style={{ flexShrink: 0 }}/>
              <span style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '21px', fontWeight: 700, background: 'linear-gradient(90deg,#00c48c,#fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>tais.tr</span>
            </div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '1px', marginTop: '3px' }}>Akademik Ekosistem</div>
          </div>

          {/* NAV */}
          <div style={{ padding: '10px 0' }}>
            <div style={{ fontSize: '9px', color: 'rgba(0,196,140,0.5)', letterSpacing: '2px', textTransform: 'uppercase', padding: '0 20px', marginBottom: '6px' }}>Ana Menü</div>
            {navItems.map((item, i) => (
              <div key={i} className={`nav-item${item.active ? ' active' : ''}`} onClick={() => router.push(item.href)}>
                <span style={{ fontSize: '13px' }}>{item.label}</span>
                {item.badge && (
                  <span style={{ marginLeft: 'auto', background: item.badgeRed ? '#ee5533' : '#00c48c', color: item.badgeRed ? '#fff' : '#0a0a0a', fontSize: '8px', fontWeight: 800, padding: '2px 5px', borderRadius: item.badgeRed ? '8px' : '0', fontFamily: "'Pixelify Sans', monospace" }}>
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div style={{ padding: '10px 0' }}>
            <div style={{ fontSize: '9px', color: 'rgba(0,196,140,0.5)', letterSpacing: '2px', textTransform: 'uppercase', padding: '0 20px', marginBottom: '6px' }}>Paydaşlar</div>
            <div className="nav-item" onClick={() => router.push('/danisman')}><span className="nav-icon"><svg viewBox="0 0 12 12" fill="#22d3ee" width="14" height="14"><rect x="1" y="4" width="10" height="7"/><rect x="4" y="2" width="4" height="2"/><rect x="5" y="6" width="2" height="3"/></svg></span>Danışmanlık</div>
            <div className="nav-item" onClick={() => router.push('/firmalar')}><span className="nav-icon"><svg viewBox="0 0 12 12" fill="#f43f5e" width="14" height="14"><rect x="2" y="1" width="8" height="10"/><rect x="4" y="3" width="1" height="1"/><rect x="7" y="3" width="1" height="1"/><rect x="4" y="5" width="1" height="1"/><rect x="7" y="5" width="1" height="1"/><rect x="5" y="8" width="2" height="3"/></svg></span>Firmalar</div>
          </div>

          <div style={{ padding: '10px 0' }}>
            <div style={{ fontSize: '9px', color: 'rgba(0,196,140,0.5)', letterSpacing: '2px', textTransform: 'uppercase', padding: '0 20px', marginBottom: '6px' }}>Profil</div>
            <div className="nav-item" onClick={() => router.push('/profil')}><span className="nav-icon"><svg viewBox="0 0 12 12" fill="#94a3b8" width="14" height="14"><rect x="4" y="1" width="4" height="4"/><rect x="3" y="2" width="1" height="2"/><rect x="8" y="2" width="1" height="2"/><rect x="3" y="5" width="1" height="1"/><rect x="8" y="5" width="1" height="1"/><rect x="1" y="8" width="10" height="3"/><rect x="2" y="7" width="2" height="1"/><rect x="8" y="7" width="2" height="1"/></svg></span>Profilim</div>
          </div>

          {/* KULLANICI */}
          <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', background: '#00c48c', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#0a0a0a', fontFamily: "'Pixelify Sans', monospace", flexShrink: 0 }}>AY</div>
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Dr. Ayşe Yılmaz</div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>Doç. Dr. · İTÜ</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

          {/* TOPBAR */}
          <div style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)', padding: '0 28px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div>
              <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '18px', fontWeight: 700, color: '#0a0a0a', lineHeight: 1 }}>Hoş geldin, Dr. Yılmaz</div>
              <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.3)', marginTop: '3px' }}>{today}</div>
            </div>

            {/* SAYAÇLAR */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, flex: 1, justifyContent: 'center' }}>
              {[
                { key: 'c1', val: counts.c1, label: 'Atıf', green: true },
                { key: 'c2', val: counts.c2, label: 'Yayın', green: false },
                { key: 'c3', val: counts.c3, label: 'İş Birliği', green: false },
                { key: 'c4', val: counts.c4, label: 'TÜBİTAK', green: false },
              ].map((s, i) => (
                <div key={s.key} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 16px' }}>
                    <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '24px', fontWeight: 700, color: s.green ? '#00c48c' : '#0a0a0a', lineHeight: 1 }}>{s.val.toLocaleString('tr-TR')}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.3)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '3px' }}>{s.label}</div>
                  </div>
                  {i < 3 && <div style={{ width: '1px', height: '24px', background: 'rgba(0,0,0,0.07)' }}/>}
                </div>
              ))}
            </div>

            {/* ARAMA + BİLDİRİM */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f2f2f0', border: '1px solid rgba(0,0,0,0.07)', padding: '8px 14px', minWidth: '180px' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input
                    type="text"
                    placeholder="Akademisyen, dergi, proje ara..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchOpen(true)}
                    onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                    style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '12px', color: '#0a0a0a', fontFamily: 'DM Sans, sans-serif', width: '200px' }}
                  />
                </div>
                {searchOpen && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, width: '320px', background: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 999, animation: 'fadeIn 0.15s ease' }}>
                    {filteredSearch.akademisyenler.length > 0 && (
                      <div style={{ padding: '8px 0' }}>
                        <div style={{ fontSize: '9px', color: 'rgba(0,0,0,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '4px 16px 6px' }}>Akademisyenler</div>
                        {filteredSearch.akademisyenler.map((x, i) => (
                          <div key={i} className="sr-item">
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: x.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff', fontFamily: "'Pixelify Sans', monospace", flexShrink: 0 }}>{x.av}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '12px', fontWeight: 500, color: '#0a0a0a' }}>{x.name}</div>
                              <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.35)', marginTop: '1px' }}>{x.sub}</div>
                            </div>
                            <span className={x.tagClass}>{x.tag}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {filteredSearch.dergiler.length > 0 && (
                      <div style={{ padding: '8px 0', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                        <div style={{ fontSize: '9px', color: 'rgba(0,0,0,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '4px 16px 6px' }}>Dergiler</div>
                        {filteredSearch.dergiler.map((x, i) => (
                          <div key={i} className="sr-item">
                            <div style={{ width: '28px', height: '28px', borderRadius: '2px', background: x.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff', fontFamily: "'Pixelify Sans', monospace", flexShrink: 0 }}>{x.av}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '12px', fontWeight: 500, color: '#0a0a0a' }}>{x.name}</div>
                              <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.35)', marginTop: '1px' }}>{x.sub}</div>
                            </div>
                            <span className={x.tagClass}>{x.tag}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div onClick={() => setNotifOpen(p => !p)} style={{ width: '34px', height: '34px', background: '#f2f2f0', border: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', transition: 'all 0.2s', borderRadius: '2px' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <span className="notif-badge">7</span>
              </div>

              {notifOpen && (
                <div style={{ position: 'absolute', top: '46px', right: 0, width: '300px', background: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 1000, animation: 'fadeIn 0.15s ease' }}>
                  <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '13px', fontWeight: 700, color: '#0a0a0a' }}>Bildirimler</div>
                    <span style={{ fontSize: '10px', color: '#00c48c', fontWeight: 600 }}>7 okunmamış</span>
                  </div>
                  {[
                    { text: '<strong>Nature Medicine</strong> — Son başvuru <span style="color:#e53;font-weight:600">18 gün</span> kaldı!', time: '2 saat önce', isNew: true },
                    { text: '<strong>TÜBİTAK 1001</strong> çağrısı — Alanınızla %92 uyumlu', time: '5 saat önce', isNew: true },
                    { text: '<strong>Prof. Ali Demir</strong> işbirliği talebini kabul etti', time: 'Dün', isNew: true },
                    { text: 'Preprint\'iniz <strong>892. görüntülenmeye</strong> ulaştı', time: '2 gün önce', isNew: false },
                    { text: '<strong>Hacettepe Üniversitesi</strong> profilinizi görüntüledi', time: '3 gün önce', isNew: false },
                  ].map((n, i) => (
                    <div key={i} className={`nd-item${n.isNew ? ' nd-new' : ''}`}>
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: n.isNew ? '#00c48c' : 'rgba(0,0,0,0.15)', flexShrink: 0, marginTop: '5px' }}/>
                      <div>
                        <div style={{ fontSize: '12px', color: '#0a0a0a', lineHeight: 1.5, fontWeight: 300 }} dangerouslySetInnerHTML={{ __html: n.text }}/>
                        <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.3)', marginTop: '2px' }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: '10px 18px', borderTop: '1px solid rgba(0,0,0,0.07)', fontSize: '11px', color: '#00c48c', fontWeight: 600, cursor: 'pointer' }}>Tümünü gör →</div>
                </div>
              )}
            </div>
          </div>

          {/* CONTENT */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="three-col" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>

              {/* SOL SÜTUN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {/* SON AKTİVİTE */}
                <div className="panel">
                  <div className="panel-header"><div className="panel-title">Son Aktivite</div><div className="panel-action">Tümü →</div></div>
                  {[
                    { color: '#00c48c', text: '<strong>Nature Medicine</strong> eşleştirmesi tamamlandı — %94 uyum', time: '2 saat önce' },
                    { color: '#f97316', text: 'Preprint <strong>"Derin Öğrenme ile Kanser Tespiti"</strong> yüklendi · SHA-256 hash alındı', time: 'Dün 14:32' },
                    { color: '#60a5fa', text: '<strong>Prof. Ali Demir</strong> işbirliği talebini kabul etti', time: '2 gün önce' },
                    { color: 'rgba(0,0,0,0.2)', text: 'CV güncellendi — <strong>3 yeni yayın</strong> eklendi', time: '3 gün önce' },
                  ].map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px 0', borderBottom: i < 3 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.color, flexShrink: 0, marginTop: '5px' }}/>
                      <div>
                        <div style={{ fontSize: '12px', color: '#0a0a0a', lineHeight: 1.5, fontWeight: 300 }} dangerouslySetInnerHTML={{ __html: a.text }}/>
                        <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.3)', marginTop: '2px' }}>{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AKADEMİK AĞIM */}
                <div className="panel">
                  <div className="panel-header"><div className="panel-title">Akademik Ağım</div><div className="panel-action">Tümünü Gör →</div></div>
                  {[
                    { av: 'MD', color: '#3b82f6', name: 'Prof. Mehmet Demir', uni: 'ODTÜ · Biyomedikal Müh.', score: '%91 uyum', pub: '4 ortak yayın', online: true },
                    { av: 'SA', color: '#8b5cf6', name: 'Doç. Selin Arslan', uni: 'Hacettepe · Tıp Fakültesi', score: '%88 uyum', pub: '2 ortak yayın', online: true },
                    { av: 'AK', color: '#f97316', name: 'Dr. Ali Kaya', uni: 'Boğaziçi · Bilgisayar Müh.', score: '%85 uyum', pub: '1 ortak yayın', online: false },
                    { av: 'FC', color: '#ec4899', name: 'Dr. Fatma Çelik', uni: 'Ege · Hematoloji', score: '%79 uyum', pub: '3 ortak yayın', online: false },
                  ].map((ag, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < 3 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: ag.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff', fontFamily: "'Pixelify Sans', monospace", position: 'relative', flexShrink: 0 }}>
                        {ag.av}
                        <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '8px', height: '8px', borderRadius: '50%', border: '2px solid #fff', background: ag.online ? '#00c48c' : 'rgba(0,0,0,0.2)' }}/>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: 500, color: '#0a0a0a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ag.name}</div>
                        <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.35)', marginTop: '1px' }}>{ag.uni}</div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '3px' }}>
                          <span style={{ fontSize: '10px', color: '#00c48c', fontWeight: 600, fontFamily: "'Pixelify Sans', monospace" }}>{ag.score}</span>
                          <span style={{ fontSize: '10px', color: 'rgba(0,0,0,0.3)' }}>· {ag.pub}</span>
                        </div>
                      </div>
                      <div className="ag-msg">
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="rgba(0,0,0,0.35)"><path d="M1 1h10v8H1z" opacity="0.6"/><rect x="3" y="3" width="6" height="1" fill="#fff"/><rect x="3" y="5" width="4" height="1" fill="#fff"/></svg>
                      </div>
                    </div>
                  ))}
                </div>

                {/* DERGİ ÖNERİLERİ */}
                <div className="panel">
                  <div className="panel-header"><div className="panel-title">Dergi Önerileri</div><div className="panel-action">Tümünü Gör →</div></div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
                    {[
                      { score: '%94', name: 'Nature Medicine', tag: '18 gün', tagClass: 'badge-r' },
                      { score: '%89', name: 'Computers in Biology', tag: 'Açık', tagClass: 'badge-g' },
                      { score: '%84', name: 'AI in Medicine', tag: '45 gün', tagClass: 'badge-g' },
                      { score: '%71', name: 'Türkiye Klinikleri', tag: 'ULAKBİM', tagClass: 'badge-g' },
                    ].map((d, i) => (
                      <div key={i} style={{ border: '1px solid rgba(0,0,0,0.07)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '4px', transition: 'all 0.2s', cursor: 'pointer' }}>
                        <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '16px', fontWeight: 700, color: '#00c48c' }}>{d.score}</div>
                        <div style={{ fontSize: '11px', fontWeight: 500, color: '#0a0a0a', lineHeight: 1.3 }}>{d.name}</div>
                        <span className={d.tagClass}>{d.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SAĞ SÜTUN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {/* HIZLI ERİŞİM */}
                <div className="panel">
                  <div className="panel-header"><div className="panel-title">Hızlı Erişim</div></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { label: 'Preprint Yükle', color: '#00c48c' },
                      { label: 'CV Güncelle', color: '#f97316' },
                      { label: 'Proje Oluştur', color: '#60a5fa' },
                      { label: 'Toplantı Ayarla', color: '#22d3ee' },
                    ].map((q, i) => (
                      <div key={i} className="quick-btn">
                        <div style={{ width: '8px', height: '8px', background: q.color, flexShrink: 0 }}/>
                        <span style={{ fontSize: '12px', fontWeight: 500, color: '#0a0a0a' }}>{q.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ALAN UYUMLU AKADEMİSYENLER */}
                <div className="panel">
                  <div className="panel-header"><div className="panel-title">Alan Uyumlu Akademisyenler</div><div className="panel-action">Tümünü Gör →</div></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { av: 'KY', color: '#0ea5e9', name: 'Prof. Kemal Yıldız', uni: 'İTÜ · YZ Lab', score: '%96', online: true },
                      { av: 'NŞ', color: '#d946ef', name: 'Doç. Neslihan Şahin', uni: 'Hacettepe · Onkoloji', score: '%93', online: false },
                      { av: 'OA', color: '#f59e0b', name: 'Dr. Okan Aydın', uni: 'ODTÜ · Biyoinf.', score: '%89', online: false },
                      { av: 'ZK', color: '#10b981', name: 'Dr. Zeynep Kara', uni: 'Ege · Nöroloji', score: '%85', online: true },
                    ].map((s, i) => (
                      <div key={i} className="suggest-card">
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff', fontFamily: "'Pixelify Sans', monospace", position: 'relative', flexShrink: 0 }}>
                          {s.av}
                          {s.online && <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '8px', height: '8px', borderRadius: '50%', border: '2px solid #fff', background: '#00c48c' }}/>}
                        </div>
                        <div style={{ width: '100%' }}>
                          <div style={{ fontSize: '11px', fontWeight: 600, color: '#0a0a0a', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                          <div style={{ fontSize: '9px', color: 'rgba(0,0,0,0.3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '1px' }}>{s.uni}</div>
                        </div>
                        <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '11px', fontWeight: 700, color: '#00c48c' }}>{s.score}</div>
                        <button className={`suggest-add${addedCards.includes(i) ? ' added' : ''}`} onClick={() => setAddedCards(p => [...p, i])}>
                          {addedCards.includes(i) ? '✓' : '+ Bağlan'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TÜBİTAK RADAR */}
                <div className="panel">
                  <div className="panel-header"><div className="panel-title">TÜBİTAK Radar</div><div className="panel-action">YZ →</div></div>
                  {[
                    { title: '1001 — Sağlık Bilimleri', deadline: '28 gün', match: '%92', fill: 92 },
                    { title: '3501 — Genç Araştırmacı', deadline: '45 gün', match: '%87', fill: 87 },
                    { title: '1002 — Hızlı Destek', deadline: 'Açık', match: '%74', fill: 74 },
                  ].map((r, i) => (
                    <div key={i} style={{ padding: '12px 0', borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.04)' : 'none', cursor: 'pointer' }}>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: '#0a0a0a', marginBottom: '4px' }}>{r.title}</div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', color: '#e53', fontWeight: 600 }}>{r.deadline}</span>
                        <div className="radar-bar"><div className="radar-fill" style={{ width: `${r.fill}%` }}/></div>
                        <span style={{ fontSize: '10px', color: '#00c48c', fontWeight: 600 }}>{r.match}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
