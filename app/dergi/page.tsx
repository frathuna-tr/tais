'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Dergi {
  name: string
  score: number
  if: string
  q: string
  ulakbim: boolean
  open: boolean
  deadline: string
  urgency: string
  aciklama: string
}

interface Message {
  type: 'ai' | 'user' | 'results'
  text?: string
  dergiler?: Dergi[]
  giris?: string
  oneri?: string
}

export default function DergiEslestirme() {
  const curRef = useRef<SVGSVGElement>(null)
  const mncRef = useRef<HTMLCanvasElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const [messages, setMessages] = useState<Message[]>([
    { type: 'ai', text: 'Merhaba Dr. Yılmaz! 👋\n\nMakaleniz için en uygun dergileri bulmak için buradayım. Makale başlığınızı ve varsa özetinizi paylaşın — alan, impact factor, ULAKBİM durumu ve son başvuru tarihlerine göre size özel bir sıralama hazırlayayım.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

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
          const f = Math.max(0, Math.sin(mt * 0.9 + mph[i][j]))
          mc.beginPath(); mc.moveTo(a.x, a.y); mc.lineTo(b.x, b.y)
          mc.strokeStyle = `rgba(0,196,140,${f*0.7*(1-d/16)})`; mc.lineWidth = 0.9; mc.stroke()
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

  // Scroll to bottom
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, loading])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const text = input.trim()
    setInput('')
    setLoading(true)

    setMessages(prev => [...prev, { type: 'user', text }])
    setMessages(prev => [...prev, { type: 'ai', text: 'Makalenizi aldım. Şimdi dergi veritabanını tarıyorum — Scopus, WoS ve DergiPark dahil. Impact factor, alan uyumu ve son başvuru tarihlerini karşılaştırıyorum...' }])

    try {
      const res = await fetch('/api/dergi-eslestir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ makale: text }),
      })
      const data = await res.json()

      if (data.error) {
        setMessages(prev => [...prev, { type: 'ai', text: 'Bir hata oluştu: ' + data.error }])
      } else {
        setMessages(prev => [...prev, {
          type: 'results',
          giris: data.giris,
          dergiler: data.dergiler,
          oneri: data.oneri,
        }])
      }
    } catch {
      setMessages(prev => [...prev, { type: 'ai', text: 'Bağlantı hatası. Lütfen tekrar deneyin.' }])
    }
    setLoading(false)
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Akademik Ağ', href: '/ag', badge: 'YZ' },
    { label: 'Dergi Eşleştirme', href: '/dergi', badge: 'YZ', active: true },
    { label: 'Preprint', href: '/preprint' },
    { label: 'Projeler', href: '/projeler', badge: 'YZ' },
    { label: 'İş Birliği Alanı', href: '/isbirligi', badge: 'YZ' },
    { label: 'CV', href: '/cv', badge: 'YZ' },
    { label: 'Yazı Asistanı', href: '/yazi', badge: 'YZ' },
    { label: 'İntihal Kontrolü', href: '/intihal', badge: 'YZ' },
    { label: 'Mesajlar', href: '/mesajlar', badge: '7', badgeRed: true },
  ]


  const iconStyle = { width:'22px', height:'22px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background:'rgba(255,255,255,0.07)', borderRadius:'2px', padding:'4px' } as const

  const sidebarSections = [
    { label: 'Ana Menü', items: [
      { label:'Dashboard', href:'/dashboard', badge:'', icon:<svg viewBox="0 0 12 12" fill="#60a5fa" width="14" height="14"><rect x="1" y="1" width="4" height="4"/><rect x="7" y="1" width="4" height="4"/><rect x="1" y="7" width="4" height="4"/><rect x="7" y="7" width="4" height="4"/></svg> },
      { label:'Akademik Ağ', href:'/ag', badge:'YZ', icon:<svg viewBox="0 0 12 12" width="14" height="14"><circle cx="2" cy="6" r="1.5" fill="#06b6d4"/><circle cx="6" cy="2" r="1.5" fill="#06b6d4"/><circle cx="10" cy="6" r="1.5" fill="#06b6d4"/><circle cx="6" cy="10" r="1.5" fill="#06b6d4"/><line x1="2" y1="6" x2="6" y2="2" stroke="#06b6d4" strokeWidth="1"/><line x1="6" y1="2" x2="10" y2="6" stroke="#06b6d4" strokeWidth="1"/><line x1="2" y1="6" x2="6" y2="10" stroke="#06b6d4" strokeWidth="1"/><line x1="6" y1="10" x2="10" y2="6" stroke="#06b6d4" strokeWidth="1"/></svg> },
      { label:'Dergi Eşleştirme', href:'/dergi', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#34d399" width="14" height="14"><rect x="2" y="1" width="6" height="1"/><rect x="2" y="1" width="1" height="9"/><rect x="2" y="9" width="8" height="1"/><rect x="9" y="4" width="1" height="6"/><rect x="4" y="4" width="4" height="1"/><rect x="4" y="6" width="4" height="1"/></svg> },
      { label:'Preprint', href:'/preprint', badge:'', icon:<svg viewBox="0 0 12 12" fill="#fb923c" width="14" height="14"><rect x="2" y="1" width="6" height="1"/><rect x="2" y="1" width="1" height="9"/><rect x="2" y="9" width="8" height="1"/><rect x="9" y="4" width="1" height="6"/><rect x="4" y="4" width="4" height="1"/><rect x="4" y="6" width="4" height="1"/></svg> },
    { label:'Makale Formatlama', href:'/format', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#f97316" width="14" height="14"><rect x="1" y="1" width="10" height="1"/><rect x="1" y="3" width="8" height="1"/><rect x="1" y="5" width="10" height="1"/><rect x="1" y="7" width="6" height="1"/><rect x="8" y="6" width="3" height="3"/><rect x="9" y="5" width="1" height="1"/></svg> },
      { label:'Projeler', href:'/projeler', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#3b82f6" width="14" height="14"><rect x="1" y="1" width="10" height="2"/><rect x="1" y="5" width="10" height="2"/><rect x="1" y="9" width="7" height="2"/></svg> },
      { label:'İş Birliği Alanı', href:'/isbirligi', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#00c48c" width="14" height="14"><rect x="0" y="5" width="3" height="2"/><rect x="3" y="4" width="2" height="1"/><rect x="3" y="7" width="2" height="1"/><rect x="5" y="3" width="2" height="6"/><rect x="7" y="4" width="2" height="1"/><rect x="7" y="7" width="2" height="1"/><rect x="9" y="5" width="3" height="2"/></svg> },
      { label:'CV', href:'/cv', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#fbbf24" width="14" height="14"><rect x="2" y="1" width="8" height="10"/><rect x="4" y="0" width="4" height="2"/><rect x="4" y="3" width="4" height="1"/><rect x="4" y="5" width="5" height="1"/></svg> },
      { label:'Yazı Asistanı', href:'/yazi', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#06b6d4" width="14" height="14"><rect x="1" y="1" width="7" height="1"/><rect x="1" y="3" width="5" height="1"/><rect x="1" y="5" width="6" height="1"/><rect x="1" y="7" width="4" height="1"/><rect x="8" y="6" width="3" height="1"/><rect x="9" y="5" width="1" height="3"/></svg> },
      { label:'İntihal Kontrolü', href:'/intihal', badge:'YZ', icon:<svg viewBox="0 0 12 12" width="14" height="14"><circle cx="5" cy="5" r="3.5" stroke="#38bdf8" strokeWidth="1" fill="none"/><line x1="7.5" y1="7.5" x2="11" y2="11" stroke="#38bdf8" strokeWidth="1.5"/></svg> },
      { label:'Mesajlar', href:'/mesajlar', badge:'7', badgeRed:true, icon:<svg viewBox="0 0 12 12" fill="rgba(255,255,255,0.45)" width="14" height="14"><rect x="1" y="2" width="10" height="7"/><rect x="1" y="9" width="2" height="2"/><rect x="2" y="8" width="8" height="1"/></svg> },
    ]},
    { label: 'Paydaşlar', items: [
      { label:'Danışmanlık', href:'/danisman', badge:'', icon:<svg viewBox="0 0 12 12" fill="#22d3ee" width="14" height="14"><rect x="1" y="4" width="10" height="7"/><rect x="4" y="2" width="4" height="2"/><rect x="5" y="6" width="2" height="3"/></svg> },
      { label:'Firmalar', href:'/firmalar', badge:'', icon:<svg viewBox="0 0 12 12" fill="#f43f5e" width="14" height="14"><rect x="2" y="1" width="8" height="10"/><rect x="4" y="3" width="1" height="1"/><rect x="7" y="3" width="1" height="1"/><rect x="4" y="5" width="1" height="1"/><rect x="7" y="5" width="1" height="1"/><rect x="5" y="8" width="2" height="3"/></svg> },
    ]},
    { label: 'Profil', items: [
      { label:'Profilim', href:'/profil', badge:'', icon:<svg viewBox="0 0 12 12" fill="#94a3b8" width="14" height="14"><rect x="4" y="1" width="4" height="4"/><rect x="3" y="2" width="1" height="2"/><rect x="8" y="2" width="1" height="2"/><rect x="3" y="5" width="1" height="1"/><rect x="8" y="5" width="1" height="1"/><rect x="1" y="8" width="10" height="3"/><rect x="2" y="7" width="2" height="1"/><rect x="8" y="7" width="2" height="1"/></svg> },
    ]},
  ]

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; cursor: none !important; }
        :root { --g: #00c48c; --ink: #0a0a0a; --gray: #f2f2f0; --white: #fff; --border: rgba(0,0,0,0.08); }
        body { font-family: 'DM Sans', sans-serif; background: var(--gray); color: var(--ink); height: 100vh; overflow: hidden; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 11px 20px; font-size: 13px; color: rgba(255,255,255,0.55); transition: all 0.2s; border-left: 2px solid transparent; cursor: pointer; }
        .nav-item:hover { color: #fff; background: rgba(255,255,255,0.05); }
        .nav-item.active { color: var(--g); border-left-color: var(--g); background: rgba(0,196,140,0.08); font-weight: 600; }
        .msg-content { padding: 14px 18px; font-size: 13px; line-height: 1.7; font-weight: 300; }
        .msg-content a { color: var(--g); }
        .typing span { display: inline-block; width: 6px; height: 6px; background: rgba(0,0,0,0.2); border-radius: 50%; animation: dot 1.2s infinite; margin: 0 2px; }
        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dot { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        .result-card { background: #fff; border: 1px solid var(--border); display: grid; grid-template-columns: 64px 1fr auto; align-items: stretch; transition: all 0.2s; margin-bottom: 3px; }
        .result-card:hover { border-color: rgba(0,196,140,0.3); box-shadow: 0 2px 12px rgba(0,196,140,0.06); }
        .result-card:hover .btn-apply { background: var(--g); color: var(--ink); }
        .btn-apply { background: var(--ink); color: #fff; border: none; padding: 7px 14px; font-size: 10px; font-weight: 600; font-family: 'DM Sans', sans-serif; transition: all 0.2s; white-space: nowrap; width: 100%; cursor: pointer; }
        .badge { font-size: 9px; padding: 2px 7px; font-weight: 600; }
        .badge-g { background: rgba(0,196,140,0.1); color: #008a64; }
        .badge-b { background: rgba(74,158,255,0.1); color: #2563eb; }
        .badge-gray { background: rgba(0,0,0,0.05); color: rgba(0,0,0,0.4); }
        .input-box { flex: 1; border: 1.5px solid rgba(0,0,0,0.12); padding: 16px 20px; font-size: 15px; color: var(--ink); font-family: 'DM Sans', sans-serif; outline: none; resize: none; line-height: 1.6; max-height: 120px; overflow-y: auto; transition: border-color 0.2s; background: var(--gray); }
        .input-box:focus { border-color: var(--g); background: #fff; }
        .input-box::placeholder { color: rgba(0,0,0,0.25); font-style: italic; }
        .nd-item { display: flex; align-items: flex-start; gap: 10px; padding: 12px 20px; border-bottom: 1px solid rgba(0,0,0,0.04); cursor: pointer; transition: background 0.15s; }
        .nd-item:hover { background: #f8fffe; }
        .nd-item.new { background: linear-gradient(90deg, rgba(0,196,140,0.2) 0%, rgba(0,196,140,0.05) 50%, transparent 100%); }
        @keyframes msgIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cardIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
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

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', height: '100vh' }}>

        {/* SIDEBAR */}
        <aside style={{background:'linear-gradient(180deg,#0d1117 0%,#0a0f0c 100%)',display:'flex',flexDirection:'column',height:'100vh',overflowY:'auto',borderRight:'1px solid rgba(0,196,140,0.15)'}}>
          <div style={{padding:'16px 20px 14px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'3px'}}>
              <canvas ref={mncRef} width="26" height="26" style={{flexShrink:0}}/>
              <span style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'21px',fontWeight:700,background:'linear-gradient(90deg,#00c48c,#fff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>tais.tr</span>
            </div>
            <div style={{fontSize:'9px',color:'rgba(255,255,255,0.2)',letterSpacing:'1px'}}>Akademik Ekosistem</div>
          </div>
          {sidebarSections.map((section, si) => (
            <div key={si} style={{padding:'10px 0'}}>
              <div style={{fontSize:'9px',color:'rgba(0,196,140,0.5)',letterSpacing:'2px',textTransform:'uppercase',padding:'0 18px',marginBottom:'6px'}}>{section.label}</div>
              {section.items.map((item, i) => {
                const isActive = '/dergi' === item.href
                return (
                  <div key={i} onClick={() => router.push(item.href)} style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 18px',fontSize:'13px',color:isActive?'#00c48c':'rgba(255,255,255,0.55)',borderLeft:`2px solid ${isActive?'#00c48c':'transparent'}`,background:isActive?'rgba(0,196,140,0.08)':'transparent',fontWeight:isActive?600:400,cursor:'pointer',transition:'all 0.2s'}}
                    onMouseEnter={e=>{if(!isActive){const el=e.currentTarget as HTMLElement;el.style.color='#fff';el.style.background='rgba(255,255,255,0.05)'}}}
                    onMouseLeave={e=>{if(!isActive){const el=e.currentTarget as HTMLElement;el.style.color='rgba(255,255,255,0.55)';el.style.background='transparent'}}}>
                    <span style={iconStyle}>{item.icon}</span>
                    <span style={{flex:1}}>{item.label}</span>
                    {item.badge && <span style={{background:(item as any).badgeRed?'#ee5533':'#00c48c',color:(item as any).badgeRed?'#fff':'#0a0a0a',fontSize:'8px',fontWeight:800,padding:'2px 5px',borderRadius:(item as any).badgeRed?'8px':'0',fontFamily:"'Pixelify Sans',monospace"}}>{item.badge}</span>}
                  </div>
                )
              })}
            </div>
          ))}
          <div style={{marginTop:'auto',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'14px 16px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <div style={{width:'34px',height:'34px',background:'#00c48c',borderRadius:'2px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,color:'#0a0a0a',fontFamily:"'Pixelify Sans',monospace"}}>AY</div>
              <div>
                <div style={{fontSize:'12px',color:'rgba(255,255,255,0.8)',fontWeight:500}}>Dr. Ayşe Yılmaz</div>
                <div style={{fontSize:'9px',color:'rgba(255,255,255,0.3)',marginTop:'2px'}}>Doç. Dr. · İTÜ</div>
              </div>
            </div>
          </div>
        </aside>


        {/* CHAT ALANI */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f2f2f0' }}>

          {/* HEADER */}
          <div style={{ background: 'linear-gradient(90deg,#00c48c 0%,rgba(0,196,140,0.6) 60%,rgba(0,196,140,0.15) 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
            <div>
              <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '18px', fontWeight: 700, color: '#0a0a0a' }}>TAİS Dergi Asistanı</div>
              <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.45)', marginTop: '3px' }}>Makalenizi analiz edip en uygun dergileri bulur</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Pixelify Sans', monospace", fontSize: '11px', color: '#0a0a0a', fontWeight: 700 }}>
              <span style={{ width: '6px', height: '6px', background: '#0a0a0a', borderRadius: '50%', animation: 'dot 2s infinite' }}/>
              {loading ? 'Analiz Ediliyor...' : 'Aktif'}
            </div>
            <div style={{ position: 'relative' }}>
              <div onClick={() => setNotifOpen(p => !p)} style={{ width: '34px', height: '34px', background: 'rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', borderRadius: '2px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#e53', color: '#fff', fontSize: '9px', fontWeight: 800, width: '17px', height: '17px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #00c48c' }}>7</span>
              </div>
              {notifOpen && (
                <div style={{ position: 'absolute', top: '46px', right: 0, width: '300px', background: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 999, animation: 'fadeIn 0.15s ease' }}>
                  <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '13px', fontWeight: 700 }}>Bildirimler</span>
                    <span style={{ fontSize: '10px', color: '#00c48c', fontWeight: 600 }}>7 okunmamış</span>
                  </div>
                  {[
                    { text: '<strong>Nature Medicine</strong> — Son başvuru <span style="color:#e53;font-weight:600">18 gün</span> kaldı!', time: '2 saat önce', isNew: true },
                    { text: '<strong>TÜBİTAK 1001</strong> çağrısı — Alanınızla %89 uyumlu', time: '5 saat önce', isNew: true },
                    { text: '<strong>Prof. Ali Demir</strong> işbirliği talebini kabul etti', time: 'Dün', isNew: true },
                    { text: 'Preprint\'iniz <strong>892. görüntülenmeye</strong> ulaştı', time: '2 gün önce', isNew: false },
                    { text: '<strong>Hacettepe Üniversitesi</strong> profilinizi görüntüledi', time: '3 gün önce', isNew: false },
                  ].map((n, i) => (
                    <div key={i} className={`nd-item${n.isNew ? ' new' : ''}`}>
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: n.isNew ? '#00c48c' : 'rgba(0,0,0,0.15)', flexShrink: 0, marginTop: '5px' }}/>
                      <div>
                        <div style={{ fontSize: '12px', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: n.text }}/>
                        <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.3)', marginTop: '2px' }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: '10px 18px', borderTop: '1px solid rgba(0,0,0,0.07)', fontSize: '11px', color: '#00c48c', fontWeight: 600, cursor: 'pointer' }}>Tümünü gör →</div>
                </div>
              )}
            </div>
          </div>

          {/* MESAJLAR */}
          <div ref={messagesRef} style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px', backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0,196,140,0.03) 0%, transparent 50%)' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '12px', flexDirection: msg.type === 'user' ? 'row-reverse' : 'row', animation: 'msgIn 0.4s ease forwards' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '2px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, fontFamily: "'Pixelify Sans', monospace", background: msg.type === 'user' ? '#00c48c' : '#0a0a0a', color: msg.type === 'user' ? '#0a0a0a' : '#00c48c' }}>
                  {msg.type === 'user' ? 'AY' : 'YZ'}
                </div>
                <div style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.3)', marginBottom: '2px', textAlign: msg.type === 'user' ? 'right' : 'left' }}>
                    {msg.type === 'user' ? 'Dr. Ayşe Yılmaz' : 'TAİS Dergi Asistanı'}
                  </div>

                  {msg.type === 'results' ? (
                    <div>
                      <div style={{ padding: '14px 18px', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '0 12px 12px 12px', fontSize: '13px', lineHeight: 1.7, fontWeight: 300, marginBottom: '8px' }}>
                        {msg.giris}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxWidth: '600px' }}>
                        {msg.dergiler?.map((d, i) => (
                          <div key={i} className="result-card" style={{ animation: `cardIn 0.4s ease ${i * 100}ms both` }}>
                            <div style={{ background: '#f2f2f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '14px 0', borderRight: '1px solid rgba(0,0,0,0.04)' }}>
                              <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '16px', fontWeight: 700, color: d.score >= 85 ? '#00c48c' : '#0a0a0a', lineHeight: 1 }}>%{d.score}</div>
                              <div style={{ fontSize: '8px', color: 'rgba(0,0,0,0.25)', marginTop: '2px' }}>uyum</div>
                            </div>
                            <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '5px' }}>
                              <div style={{ fontSize: '13px', fontWeight: 500, color: '#0a0a0a' }}>{d.name}</div>
                              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                <span className={`badge ${d.q === 'Q1' ? 'badge-g' : d.q === 'Q2' ? 'badge-b' : 'badge-gray'}`}>{d.q} · IF {d.if}</span>
                                {d.ulakbim && <span className="badge badge-g">ULAKBİM</span>}
                                {d.open && <span className="badge badge-b">Açık Erişim</span>}
                              </div>
                              <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.4)', lineHeight: 1.4 }}>{d.aciklama}</div>
                            </div>
                            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: '6px', borderLeft: '1px solid rgba(0,0,0,0.04)', minWidth: '110px' }}>
                              <button className="btn-apply">Başvur →</button>
                              <div style={{ fontSize: '9px', color: d.urgency === 'urgent' ? '#c00' : 'rgba(0,0,0,0.28)', textAlign: 'right', fontWeight: d.urgency === 'urgent' ? 600 : 400 }}>
                                {d.urgency === 'urgent' && '● '}{d.deadline}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {msg.oneri && (
                        <div style={{ padding: '14px 18px', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '0 12px 12px 12px', fontSize: '13px', lineHeight: 1.7, fontWeight: 300, marginTop: '8px', maxWidth: '600px' }}>
                          💡 <span dangerouslySetInnerHTML={{ __html: msg.oneri.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}/>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="msg-content" style={{
                      background: msg.type === 'user' ? '#0a0a0a' : '#fff',
                      color: msg.type === 'user' ? '#fff' : '#0a0a0a',
                      border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: msg.type === 'user' ? '12px 0 12px 12px' : '0 12px 12px 12px',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {msg.text}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: '12px', animation: 'msgIn 0.4s ease forwards' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '2px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, fontFamily: "'Pixelify Sans', monospace", background: '#0a0a0a', color: '#00c48c' }}>YZ</div>
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.3)', marginBottom: '6px' }}>TAİS Dergi Asistanı</div>
                  <div style={{ padding: '14px 18px', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '0 12px 12px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="typing"><span/><span/><span/></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* INPUT */}
          <div style={{ background: '#fff', borderTop: '1px solid rgba(0,0,0,0.08)', padding: '20px 32px', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <textarea
                className="input-box"
                rows={1}
                placeholder="Makale başlığınızı ve özetinizi yazın..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                style={{ flexShrink: 1 }}
              />
              <button onClick={sendMessage} disabled={loading} style={{ width: '48px', height: '48px', background: loading ? '#ccc' : '#0a0a0a', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
              </button>
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.25)', marginTop: '8px' }}>Enter ile gönder · Shift+Enter satır atla</div>
          </div>
        </div>
      </div>
    </>
  )
}
