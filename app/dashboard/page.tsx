'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/hooks/useProfile'

const ikonStyle = { width:'22px', height:'22px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background:'rgba(255,255,255,0.07)', borderRadius:'2px', padding:'4px' } as const

const sidebarSections = [
  { label: 'Ana Menü', items: [
    { label:'Dashboard', href:'/dashboard', badge:'', icon:<svg viewBox="0 0 12 12" fill="#60a5fa" width="14" height="14"><rect x="1" y="1" width="4" height="4"/><rect x="7" y="1" width="4" height="4"/><rect x="1" y="7" width="4" height="4"/><rect x="7" y="7" width="4" height="4"/></svg>, active:true },
    { label:'Akademik Ağ', href:'/ag', badge:'YZ', icon:<svg viewBox="0 0 12 12" width="14" height="14"><circle cx="2" cy="6" r="1.5" fill="#06b6d4"/><circle cx="6" cy="2" r="1.5" fill="#06b6d4"/><circle cx="10" cy="6" r="1.5" fill="#06b6d4"/><circle cx="6" cy="10" r="1.5" fill="#06b6d4"/><line x1="2" y1="6" x2="6" y2="2" stroke="#06b6d4" strokeWidth="1"/><line x1="6" y1="2" x2="10" y2="6" stroke="#06b6d4" strokeWidth="1"/><line x1="2" y1="6" x2="6" y2="10" stroke="#06b6d4" strokeWidth="1"/><line x1="6" y1="10" x2="10" y2="6" stroke="#06b6d4" strokeWidth="1"/></svg> },
    { label:'Dergi Eşleştirme', href:'/dergi', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#34d399" width="14" height="14"><rect x="2" y="1" width="6" height="1"/><rect x="2" y="1" width="1" height="9"/><rect x="2" y="9" width="8" height="1"/><rect x="9" y="4" width="1" height="6"/><rect x="4" y="4" width="4" height="1"/><rect x="4" y="6" width="4" height="1"/></svg> },
    { label:'Preprint', href:'/preprint', badge:'', icon:<svg viewBox="0 0 12 12" fill="#fb923c" width="14" height="14"><rect x="2" y="1" width="6" height="1"/><rect x="2" y="1" width="1" height="9"/><rect x="2" y="9" width="8" height="1"/><rect x="9" y="4" width="1" height="6"/><rect x="4" y="4" width="4" height="1"/><rect x="4" y="6" width="4" height="1"/></svg> },
    { label:'Makale Formatlama', href:'/format', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#f97316" width="14" height="14"><rect x="1" y="1" width="10" height="1"/><rect x="1" y="3" width="8" height="1"/><rect x="1" y="5" width="10" height="1"/><rect x="1" y="7" width="6" height="1"/></svg> },
    { label:'Projeler', href:'/projeler', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#3b82f6" width="14" height="14"><rect x="1" y="1" width="10" height="2"/><rect x="1" y="5" width="10" height="2"/><rect x="1" y="9" width="7" height="2"/></svg> },
    { label:'İş Birliği Alanı', href:'/isbirligi', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#00c48c" width="14" height="14"><rect x="0" y="5" width="3" height="2"/><rect x="3" y="4" width="2" height="1"/><rect x="3" y="7" width="2" height="1"/><rect x="5" y="3" width="2" height="6"/><rect x="7" y="4" width="2" height="1"/><rect x="7" y="7" width="2" height="1"/><rect x="9" y="5" width="3" height="2"/></svg> },
    { label:'CV', href:'/cv', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#fbbf24" width="14" height="14"><rect x="2" y="1" width="8" height="10"/><rect x="4" y="0" width="4" height="2"/><rect x="4" y="3" width="4" height="1"/><rect x="4" y="5" width="5" height="1"/></svg> },
    { label:'Yazı Asistanı', href:'/yazi', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#06b6d4" width="14" height="14"><rect x="1" y="1" width="7" height="1"/><rect x="1" y="3" width="5" height="1"/><rect x="1" y="5" width="6" height="1"/><rect x="1" y="7" width="4" height="1"/></svg> },
    { label:'İntihal Kontrolü', href:'/intihal', badge:'YZ', icon:<svg viewBox="0 0 12 12" width="14" height="14"><circle cx="5" cy="5" r="3.5" stroke="#38bdf8" strokeWidth="1" fill="none"/><line x1="7.5" y1="7.5" x2="11" y2="11" stroke="#38bdf8" strokeWidth="1.5"/></svg> },
    { label:'Mesajlar', href:'/mesajlar', badge:'7', badgeRed:true, icon:<svg viewBox="0 0 12 12" fill="rgba(255,255,255,0.45)" width="14" height="14"><rect x="1" y="2" width="10" height="7"/><rect x="1" y="9" width="2" height="2"/><rect x="2" y="8" width="8" height="1"/></svg> },
  ]},
  { label: 'Paydaşlar', items: [
    { label:'Danışmanlık', href:'/danisman', badge:'', icon:<svg viewBox="0 0 12 12" fill="#22d3ee" width="14" height="14"><rect x="1" y="4" width="10" height="7"/><rect x="4" y="2" width="4" height="2"/><rect x="5" y="6" width="2" height="3"/></svg> },
    { label:'Firmalar', href:'/firmalar', badge:'', icon:<svg viewBox="0 0 12 12" fill="#f43f5e" width="14" height="14"><rect x="2" y="1" width="8" height="10"/><rect x="4" y="3" width="1" height="1"/><rect x="7" y="3" width="1" height="1"/><rect x="4" y="5" width="1" height="1"/><rect x="7" y="5" width="1" height="1"/><rect x="5" y="8" width="2" height="3"/></svg> },
  ]},
  { label: 'Profil', items: [
    { label:'Profilim', href:'/profil', badge:'', icon:<svg viewBox="0 0 12 12" fill="#94a3b8" width="14" height="14"><rect x="4" y="1" width="4" height="4"/><rect x="3" y="2" width="1" height="2"/><rect x="8" y="2" width="1" height="2"/><rect x="1" y="8" width="10" height="3"/><rect x="2" y="7" width="2" height="1"/><rect x="8" y="7" width="2" height="1"/></svg> },
  ]},
]

export default function Dashboard() {
  const { profil } = useProfile()
  const curRef = useRef<SVGSVGElement>(null)
  const mncRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const [agTab, setAgTab] = useState(0)
  const [counts, setCounts] = useState({ atif:0, yayin:0, hindex:0, proje:0 })
  const [today, setToday] = useState('')
  const [baglilar, setBaglilar] = useState<number[]>([])

  useEffect(() => {
    const d = new Date()
    setToday(d.toLocaleDateString('tr-TR', { weekday:'long', day:'numeric', month:'long' }))
  }, [])

  useEffect(() => {
    const move = (e: MouseEvent) => { if (curRef.current) { curRef.current.style.left=(e.clientX-2)+'px'; curRef.current.style.top=(e.clientY-2)+'px' } }
    document.addEventListener('mousemove', move)
    return () => document.removeEventListener('mousemove', move)
  }, [])

  useEffect(() => {
    const countUp = (key: keyof typeof counts, target: number, dur: number) => {
      const start = Date.now()
      const iv = setInterval(() => {
        const p = Math.min((Date.now()-start)/dur, 1)
        const e = 1-Math.pow(1-p, 3)
        setCounts(prev => ({...prev, [key]: Math.floor(e*target)}))
        if (p >= 1) { setCounts(prev => ({...prev, [key]: target})); clearInterval(iv) }
      }, 16)
    }
    setTimeout(() => {
      countUp('atif', 247, 1800)
      countUp('yayin', 18, 1400)
      countUp('hindex', 8, 1000)
      countUp('proje', 3, 700)
    }, 300)
  }, [])

  useEffect(() => {
    const mn = mncRef.current; if (!mn) return
    const mc = mn.getContext('2d')!
    const mnp = [{x:4,y:4},{x:13,y:3},{x:22,y:4},{x:13,y:13},{x:13,y:22},{x:7,y:18},{x:19,y:18}]
    const mph = mnp.map(() => mnp.map(() => Math.random()*Math.PI*2))
    let mt = 0, raf: number
    const draw = () => {
      mc.clearRect(0,0,26,26)
      for (let i=0;i<mnp.length;i++) for (let j=i+1;j<mnp.length;j++) {
        const a=mnp[i],b=mnp[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy)
        if (d<16) { const f=Math.max(0,Math.sin(mt*0.9+mph[i][j])); mc.beginPath(); mc.moveTo(a.x,a.y); mc.lineTo(b.x,b.y); mc.strokeStyle=`rgba(0,196,140,${f*0.7*(1-d/16)})`; mc.lineWidth=0.9; mc.stroke() }
      }
      mnp.forEach((p,i) => {
        const pulse=Math.sin(mt*1.5+i*0.7); const g=0.5+0.5*Math.sin(mt*0.8+i*1.2)
        mc.beginPath(); mc.arc(p.x,p.y,1.8+pulse*0.5,0,Math.PI*2)
        mc.fillStyle=`rgba(${Math.round(240*(1-g))},${Math.round(244*(1-g)+196*g)},${Math.round(255*(1-g)+140*g)},${0.7+0.3*pulse})`; mc.fill()
      })
      mt+=0.022; raf=requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  const avatarHarfleri = `${profil?.ad?.[0] ?? ''}${profil?.soyad?.[0] ?? ''}`
  const avatarUrl = (profil as any)?.avatar_url || ''

  const baglantilar = [
    {av:'MD',color:'#3b82f6',name:'Prof. Mehmet Demir',uni:'ODTÜ · Biyomedikal',online:true},
    {av:'SA',color:'#06b6d4',name:'Doç. Selin Arslan',uni:'Hacettepe · Tıp',online:false},
    {av:'KY',color:'#f59e0b',name:'Prof. Kemal Yıldız',uni:'İTÜ · YZ Lab',online:true},
    {av:'AK',color:'#10b981',name:'Dr. Ali Kaya',uni:'Boğaziçi · Bilgisayar',online:false},
  ]

  const oneriler = [
    {id:1,av:'OA',color:'#10b981',name:'Dr. Okan Aydın',uni:'ODTÜ · Biyoinformatik',uyum:91},
    {id:2,av:'ZK',color:'#f59e0b',name:'Prof. Zeynep Kara',uni:'Ege · Nöroloji',uyum:87},
    {id:3,av:'BK',color:'#06b6d4',name:'Doç. Baran Kurt',uni:'Bilkent · Robotik',uyum:83},
    {id:4,av:'EA',color:'#3b82f6',name:'Dr. Ece Arslan',uni:'Bilkent · ML',uyum:79},
  ]

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; cursor:none!important; }
        body { font-family:'DM Sans',sans-serif; background:#f2f2f0; color:#0a0a0a; height:100vh; overflow:hidden; }
        .nav-item { display:flex; align-items:center; gap:10px; padding:9px 18px; font-size:13px; color:rgba(255,255,255,0.55); transition:all 0.2s; border-left:2px solid transparent; cursor:pointer; }
        .nav-item:hover { color:#fff; background:rgba(255,255,255,0.05); }
        .nav-item.active { color:#00c48c; border-left-color:#00c48c; background:rgba(0,196,140,0.08); font-weight:600; }
        .panel { background:#fff; border:1px solid rgba(0,0,0,0.07); }
        .panel-hd { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border-bottom:1px solid rgba(0,0,0,0.06); }
        .panel-title { font-family:'Pixelify Sans',monospace; font-size:13px; font-weight:700; }
        .panel-link { font-size:11px; color:#00c48c; font-weight:600; cursor:pointer; }
        .panel-link:hover { text-decoration:underline; }
        .acil-item { display:flex; align-items:center; gap:12px; padding:11px 16px; border-bottom:1px solid rgba(0,0,0,0.04); cursor:pointer; transition:background 0.15s; }
        .acil-item:hover { background:#fafffe; }
        .hizli-btn { display:flex; align-items:center; gap:8px; padding:12px 14px; border:1px solid rgba(0,0,0,0.07); background:#fff; cursor:pointer; transition:all 0.2s; font-size:12px; font-weight:500; }
        .hizli-btn:hover { border-color:#00c48c; background:#fafffd; }
        .ag-tab { flex:1; padding:9px; font-size:11px; font-weight:600; font-family:'DM Sans',sans-serif; border:none; background:transparent; color:rgba(0,0,0,0.4); border-bottom:2px solid transparent; cursor:pointer; transition:all 0.2s; }
        .ag-tab.active { color:#0a0a0a; border-bottom-color:#00c48c; }
        .kisi-item { display:flex; align-items:center; gap:10px; padding:10px 16px; border-bottom:1px solid rgba(0,0,0,0.04); cursor:pointer; transition:background 0.15s; }
        .kisi-item:hover { background:#fafffe; }
        .kisi-item:last-child { border-bottom:none; }
        .fon-item { display:flex; align-items:center; gap:12px; padding:11px 16px; border-bottom:1px solid rgba(0,0,0,0.04); cursor:pointer; transition:background 0.15s; }
        .fon-item:hover { background:#fafffe; }
        .radar-bar { flex:1; height:4px; background:rgba(0,0,0,0.06); border-radius:2px; overflow:hidden; }
        .dergi-item { padding:11px 16px; border-bottom:1px solid rgba(0,0,0,0.04); cursor:pointer; transition:background 0.15s; }
        .dergi-item:hover { background:#fafffe; }
        .badge-g { background:rgba(0,196,140,0.1); color:#008a64; font-size:9px; padding:2px 7px; font-weight:600; }
        .badge-r { background:rgba(229,51,51,0.1); color:#c00; font-size:9px; padding:2px 7px; font-weight:600; }
        .notif-dot { width:7px; height:7px; border-radius:50%; background:#ee5533; border:2px solid #fff; position:absolute; top:-3px; right:-3px; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <svg ref={curRef} style={{position:'fixed',top:-20,left:-20,zIndex:9999,pointerEvents:'none',display:'block'}} width="20" height="20" viewBox="0 0 10 10">
        <rect x="0" y="0" width="2" height="2" fill="#00c48c"/><rect x="0" y="2" width="2" height="2" fill="#00c48c"/>
        <rect x="0" y="4" width="2" height="2" fill="#00c48c"/><rect x="0" y="6" width="2" height="2" fill="#00c48c"/>
        <rect x="0" y="8" width="2" height="2" fill="#00c48c"/><rect x="2" y="2" width="2" height="2" fill="#00c48c"/>
        <rect x="4" y="4" width="2" height="2" fill="#00c48c"/><rect x="4" y="6" width="2" height="2" fill="#00c48c"/>
        <rect x="6" y="6" width="2" height="2" fill="#00c48c"/><rect x="6" y="8" width="2" height="2" fill="#00c48c"/>
      </svg>

      <div style={{display:'grid',gridTemplateColumns:'220px 1fr',height:'100vh'}}>

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
                const isActive = !!(item as any).active
                return (
                  <div key={i} onClick={() => router.push(item.href)} style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 18px',fontSize:'13px',color:isActive?'#00c48c':'rgba(255,255,255,0.55)',borderLeft:`2px solid ${isActive?'#00c48c':'transparent'}`,background:isActive?'rgba(0,196,140,0.08)':'transparent',fontWeight:isActive?600:400,cursor:'pointer',transition:'all 0.2s'}}
                    onMouseEnter={e=>{if(!isActive){const el=e.currentTarget as HTMLElement;el.style.color='#fff';el.style.background='rgba(255,255,255,0.05)'}}}
                    onMouseLeave={e=>{if(!isActive){const el=e.currentTarget as HTMLElement;el.style.color='rgba(255,255,255,0.55)';el.style.background='transparent'}}}>
                    <span style={ikonStyle}>{item.icon}</span>
                    <span style={{flex:1}}>{item.label}</span>
                    {item.badge && <span style={{background:(item as any).badgeRed?'#ee5533':'#00c48c',color:(item as any).badgeRed?'#fff':'#0a0a0a',fontSize:'8px',fontWeight:800,padding:'2px 5px',borderRadius:(item as any).badgeRed?'8px':'0',fontFamily:"'Pixelify Sans',monospace"}}>{item.badge}</span>}
                  </div>
                )
              })}
            </div>
          ))}
          <div style={{marginTop:'auto',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'14px 16px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <div style={{width:'34px',height:'34px',background:'#00c48c',borderRadius:'2px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,color:'#0a0a0a',fontFamily:"'Pixelify Sans',monospace",overflow:'hidden'}}>
                {avatarUrl ? <img src={avatarUrl} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : avatarHarfleri}
              </div>
              <div>
                <div style={{fontSize:'12px',color:'rgba(255,255,255,0.8)',fontWeight:500}}>{profil?.ad} {profil?.soyad}</div>
                <div style={{fontSize:'9px',color:'rgba(255,255,255,0.3)',marginTop:'2px'}}>{profil?.unvan}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden'}}>

          {/* TOPBAR */}
          <div style={{background:'#fff',borderBottom:'1px solid rgba(0,0,0,0.07)',padding:'0 24px',height:'60px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
            <div>
              <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'17px',fontWeight:700,color:'#0a0a0a'}}>Hoş geldin, {profil?.ad} 👋</div>
              <div style={{fontSize:'11px',color:'rgba(0,0,0,0.3)',marginTop:'2px'}}>{today}</div>
            </div>

            <div style={{display:'flex',alignItems:'center',gap:'0'}}>
              {[
                {key:'atif',val:counts.atif,label:'Atıf',c:'#00c48c'},
                {key:'yayin',val:counts.yayin,label:'Yayın',c:'#0a0a0a'},
                {key:'hindex',val:counts.hindex,label:'H-index',c:'#f59e0b'},
                {key:'proje',val:counts.proje,label:'Proje',c:'#3b82f6'},
              ].map((s,i) => (
                <div key={s.key} style={{display:'flex',alignItems:'center'}}>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'0 18px',cursor:'pointer'}} onClick={() => router.push('/profil')}>
                    <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'22px',fontWeight:700,color:s.c,lineHeight:1}}>{s.val}</div>
                    <div style={{fontSize:'10px',color:'rgba(0,0,0,0.3)',textTransform:'uppercase',letterSpacing:'0.5px',marginTop:'2px'}}>{s.label}</div>
                  </div>
                  {i<3 && <div style={{width:'1px',height:'28px',background:'rgba(0,0,0,0.07)'}}/>}
                </div>
              ))}
            </div>

            <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
              <div onClick={() => router.push('/mesajlar')} style={{width:'36px',height:'36px',background:'#f2f2f0',border:'1px solid rgba(0,0,0,0.07)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',borderRadius:'2px',position:'relative',transition:'all 0.2s'}}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span className="notif-dot"/>
              </div>
              <div onClick={() => router.push('/profil')} style={{width:'36px',height:'36px',background:'#00c48c',borderRadius:'2px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,color:'#0a0a0a',fontFamily:"'Pixelify Sans',monospace",cursor:'pointer',overflow:'hidden'}}>
                {avatarUrl ? <img src={avatarUrl} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : avatarHarfleri}
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div style={{flex:1,overflowY:'auto',padding:'16px 24px'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px',marginBottom:'12px'}}>

              <div className="panel">
                <div className="panel-hd">
                  <div className="panel-title">⚠️ Acil Uyarılar</div>
                  <div className="panel-link" onClick={() => router.push('/dergi')}>Tümü →</div>
                </div>
                {[
                  {icon:'📄',text:'Nature Medicine son başvuru',sub:'18 gün kaldı · %94 uyum',c:'#ef4444',href:'/dergi'},
                  {icon:'💰',text:'TÜBİTAK 1001 son başvuru',sub:'28 gün kaldı · %92 uyum',c:'#f59e0b',href:'/projeler'},
                  {icon:'📄',text:'Journal Med. Systems',sub:'12 gün kaldı · %76 uyum',c:'#ef4444',href:'/dergi'},
                  {icon:'🏆',text:'AB Horizon çağrısı',sub:'45 gün kaldı · Yeni',c:'#3b82f6',href:'/projeler'},
                ].map((a,i) => (
                  <div key={i} className="acil-item" onClick={() => router.push(a.href)}>
                    <div style={{width:'7px',height:'7px',borderRadius:'50%',background:a.c,flexShrink:0}}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:'12px',fontWeight:500,color:'#0a0a0a'}}>{a.text}</div>
                      <div style={{fontSize:'10px',color:'rgba(0,0,0,0.4)',marginTop:'1px'}}>{a.sub}</div>
                    </div>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                ))}
              </div>

              <div className="panel">
                <div className="panel-hd">
                  <div className="panel-title">⚡ Hızlı Erişim</div>
                </div>
                <div style={{padding:'10px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                  {[
                    {label:'Preprint Yükle',icon:'📤',href:'/preprint?tab=yukle'},
                    {label:'CV Güncelle',icon:'📄',href:'/cv'},
                    {label:'Proje Oluştur',icon:'🚀',href:'/projeler'},
                    {label:'İş Birliği İlanı',icon:'🤝',href:'/isbirligi'},
                    {label:'Yazı Asistanı',icon:'✍️',href:'/yazi'},
                    {label:'İntihal Kontrol',icon:'🔍',href:'/intihal'},
                  ].map((q,i) => (
                    <div key={i} className="hizli-btn" onClick={() => router.push(q.href)}>
                      <span style={{fontSize:'16px'}}>{q.icon}</span>
                      <span style={{color:'#0a0a0a',fontSize:'11px'}}>{q.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-hd">
                  <div className="panel-title">📋 Son Aktivite</div>
                  <div className="panel-link" onClick={() => router.push('/profil')}>Tümü →</div>
                </div>
                {[
                  {c:'#00c48c',text:'Nature Medicine eşleştirmesi · %94 uyum',time:'2 saat önce',href:'/dergi'},
                  {c:'#f97316',text:'Preprint yüklendi · SHA-256 hash alındı',time:'Dün 14:32',href:'/preprint'},
                  {c:'#3b82f6',text:'Prof. Ali Demir iş birliği kabul etti',time:'2 gün önce',href:'/ag'},
                  {c:'rgba(0,0,0,0.2)',text:'CV güncellendi · 3 yeni yayın',time:'3 gün önce',href:'/cv'},
                ].map((a,i) => (
                  <div key={i} className="acil-item" onClick={() => router.push(a.href)}>
                    <div style={{width:'7px',height:'7px',borderRadius:'50%',background:a.c,flexShrink:0}}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:'11px',color:'#0a0a0a',lineHeight:1.4}}>{a.text}</div>
                      <div style={{fontSize:'10px',color:'rgba(0,0,0,0.35)',marginTop:'1px'}}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1.2fr 1fr 0.8fr',gap:'12px'}}>

              <div className="panel">
                <div className="panel-hd">
                  <div className="panel-title">🤝 Akademik Ağ</div>
                  <div className="panel-link" onClick={() => router.push(agTab===0?'/ag':'/akademisyenler')}>Tümünü Gör →</div>
                </div>
                <div style={{display:'flex',borderBottom:'1px solid rgba(0,0,0,0.06)'}}>
                  <button className={`ag-tab${agTab===0?' active':''}`} onClick={() => setAgTab(0)}>Bağlantılarım ({baglantilar.length})</button>
                  <button className={`ag-tab${agTab===1?' active':''}`} onClick={() => setAgTab(1)}>🤖 YZ Önerileri</button>
                </div>
                {agTab === 0 && baglantilar.map((k,i) => (
                  <div key={i} className="kisi-item">
                    <div style={{position:'relative',flexShrink:0}}>
                      <div style={{width:'34px',height:'34px',borderRadius:'50%',background:k.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700,color:'#fff',fontFamily:"'Pixelify Sans',monospace"}}>{k.av}</div>
                      {k.online && <div style={{position:'absolute',bottom:'1px',right:'1px',width:'8px',height:'8px',background:'#00c48c',borderRadius:'50%',border:'2px solid #fff'}}/>}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:'12px',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{k.name}</div>
                      <div style={{fontSize:'10px',color:'rgba(0,0,0,0.35)',marginTop:'1px'}}>{k.uni}</div>
                    </div>
                    <div onClick={() => router.push('/mesajlar')} style={{width:'26px',height:'26px',background:'#f2f2f0',border:'1px solid rgba(0,0,0,0.07)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',borderRadius:'2px',flexShrink:0}}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                  </div>
                ))}
                {agTab === 1 && oneriler.map((o,i) => (
                  <div key={i} className="kisi-item">
                    <div style={{width:'34px',height:'34px',borderRadius:'50%',background:o.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700,color:'#fff',fontFamily:"'Pixelify Sans',monospace",flexShrink:0}}>{o.av}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:'12px',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{o.name}</div>
                      <div style={{fontSize:'10px',color:'rgba(0,0,0,0.35)',marginTop:'1px'}}>{o.uni}</div>
                    </div>
                    <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'12px',fontWeight:700,color:o.uyum>=75?'#00c48c':o.uyum>=45?'#f59e0b':'#ef4444',flexShrink:0,marginRight:'6px'}}>%{o.uyum}</div>
                    <button onClick={() => setBaglilar(p => p.includes(o.id)?p:[...p,o.id])} style={{background:baglilar.includes(o.id)?'rgba(0,196,140,0.1)':'#0a0a0a',color:baglilar.includes(o.id)?'#00c48c':'#fff',border:baglilar.includes(o.id)?'1px solid rgba(0,196,140,0.2)':'none',padding:'4px 10px',fontSize:'10px',fontWeight:700,cursor:'pointer',fontFamily:'DM Sans,sans-serif',flexShrink:0,transition:'all 0.2s'}}>
                      {baglilar.includes(o.id)?'✓':'+ Bağlan'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="panel">
                <div className="panel-hd">
                  <div className="panel-title">🎯 Fon Fırsatları</div>
                  <div className="panel-link" onClick={() => router.push('/projeler')}>Tümü →</div>
                </div>
                {[
                  {ad:'TÜBİTAK 1001',sub:'Sağlık Bilimleri',deadline:'28 gün',uyum:92,c:'#00c48c'},
                  {ad:'TÜBİTAK 3501',sub:'Genç Araştırmacı',deadline:'45 gün',uyum:87,c:'#00c48c'},
                  {ad:'AB Horizon',sub:'Health & Life',deadline:'60 gün',uyum:79,c:'#3b82f6'},
                  {ad:'TÜBİTAK 1002',sub:'Hızlı Destek',deadline:'Açık',uyum:74,c:'#f59e0b'},
                ].map((f,i) => (
                  <div key={i} className="fon-item" onClick={() => router.push('/projeler')}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:'12px',fontWeight:600,color:'#0a0a0a'}}>{f.ad}</div>
                      <div style={{fontSize:'10px',color:'rgba(0,0,0,0.4)',marginTop:'1px'}}>{f.sub}</div>
                    </div>
                    <div style={{display:'flex',flex:1,alignItems:'center',gap:'8px'}}>
                      <div className="radar-bar"><div style={{height:'100%',width:`${f.uyum}%`,background:f.c,borderRadius:'2px'}}/></div>
                      <span style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'11px',fontWeight:700,color:f.c,flexShrink:0}}>%{f.uyum}</span>
                    </div>
                    <span style={{fontSize:'10px',fontWeight:600,color:f.deadline.includes('gün')&&parseInt(f.deadline)<30?'#ef4444':'rgba(0,0,0,0.4)',flexShrink:0,marginLeft:'8px'}}>{f.deadline}</span>
                  </div>
                ))}
              </div>

              <div className="panel">
                <div className="panel-hd">
                  <div className="panel-title">📰 Dergi Önerileri</div>
                  <div className="panel-link" onClick={() => router.push('/dergi')}>YZ →</div>
                </div>
                {[
                  {name:'Nature Medicine',uyum:'%94',if:'58.7',q:'Q1',deadline:'18 gün',acil:true},
                  {name:'Computers in Biology',uyum:'%89',if:'7.7',q:'Q1',deadline:'Açık',acil:false},
                  {name:'AI in Medicine',uyum:'%84',if:'7.0',q:'Q1',deadline:'45 gün',acil:false},
                  {name:'Türkiye Klinikleri',uyum:'%71',if:'—',q:'Q3',deadline:'ULAKBİM',acil:false},
                ].map((d,i) => (
                  <div key={i} className="dergi-item" onClick={() => router.push('/dergi')}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'3px'}}>
                      <div style={{fontSize:'12px',fontWeight:600,color:'#0a0a0a',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1,paddingRight:'8px'}}>{d.name}</div>
                      <span style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'13px',fontWeight:700,color:'#00c48c',flexShrink:0}}>{d.uyum}</span>
                    </div>
                    <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
                      <span className="badge-g">{d.q} · IF {d.if}</span>
                      <span className={d.acil?'badge-r':'badge-g'}>{d.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel" style={{marginTop:'12px',marginBottom:'4px'}}>
              <div className="panel-hd">
                <div className="panel-title">🎯 Alan Uyumlu Akademisyenler</div>
                <div className="panel-link" onClick={() => router.push('/akademisyenler')}>Tümünü Gör →</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0'}}>
                {[
                  {id:1,av:'OA',color:'#10b981',name:'Dr. Okan Aydın',uni:'ODTÜ · Biyoinformatik',uyum:91,tags:['ML','Python'],online:false},
                  {id:2,av:'ZK',color:'#f59e0b',name:'Prof. Zeynep Kara',uni:'Ege · Nöroloji',uyum:87,tags:['EEG','Sinyal'],online:true},
                  {id:3,av:'BK',color:'#06b6d4',name:'Doç. Baran Kurt',uni:'Bilkent · Robotik',uyum:83,tags:['CV','ROS'],online:true},
                  {id:4,av:'EA',color:'#3b82f6',name:'Dr. Ece Arslan',uni:'Bilkent · ML',uyum:79,tags:['Transfer','PyTorch'],online:false},
                ].map((a,i) => (
                  <div key={i} onClick={() => router.push('/akademisyenler')} style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px 16px',borderRight:i<3?'1px solid rgba(0,0,0,0.06)':'none',cursor:'pointer',transition:'background 0.15s'}}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#fafffd'}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='transparent'}>
                    <div style={{position:'relative',flexShrink:0}}>
                      <div style={{width:'42px',height:'42px',borderRadius:'50%',background:a.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:700,color:'#fff',fontFamily:"'Pixelify Sans',monospace"}}>{a.av}</div>
                      {a.online && <div style={{position:'absolute',bottom:'1px',right:'1px',width:'10px',height:'10px',background:'#00c48c',borderRadius:'50%',border:'2px solid #fff'}}/>}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:'13px',fontWeight:600,color:'#0a0a0a',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.name}</div>
                      <div style={{fontSize:'10px',color:'rgba(0,0,0,0.4)',marginTop:'1px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.uni}</div>
                      <div style={{display:'flex',gap:'4px',marginTop:'5px'}}>
                        {a.tags.map((t,j) => <span key={j} style={{fontSize:'9px',padding:'2px 6px',background:'rgba(0,0,0,0.05)',color:'rgba(0,0,0,0.4)'}}>{t}</span>)}
                      </div>
                    </div>
                    <div style={{flexShrink:0,textAlign:'center'}}>
                      <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'18px',fontWeight:700,color:a.uyum>=75?'#00c48c':a.uyum>=45?'#f59e0b':'#ef4444'}}>{a.uyum}%</div>
                      <div style={{fontSize:'9px',color:'rgba(0,0,0,0.3)',textTransform:'uppercase',letterSpacing:'0.3px'}}>uyum</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
