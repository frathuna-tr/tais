'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const GOLD = '#d4a853'
const GOLD_LIGHT = '#f5d78e'

export default function SanatciProfil() {
  const curRef = useRef<SVGSVGElement>(null)
  const mncRef = useRef<HTMLCanvasElement>(null)
  const bannerRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const [eserTalebi, setEserTalebi] = useState(true)
  const [notifOpen, setNotifOpen] = useState(false)
  const [todayOpen, setTodayOpen] = useState(false)
  const [todayIdx, setTodayIdx] = useState(0)
  const [counts, setCounts] = useState({ c1:0,c2:0,c3:0,c4:0,c5:0,c6:0 })
  const [avatarUrl, setAvatarUrl] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')
  const [aktifTab, setAktifTab] = useState('eserler')
  const [lightbox, setLightbox] = useState<number|null>(null)

  const allData = [
    {color:GOLD,text:'İstanbul Modern — Sergi daveti',title:'İstanbul Modern 2025 sergi daveti geldi',sub:'Solo sergi · Ekim 2025 · Kabul Et →',time:'1 saat önce'},
    {color:'#60a5fa',text:'Leonardo — makale kabul',title:"Makaleniz Leonardo'da yayımlandı",sub:'Digital Art and Academic Knowledge · →',time:'3 saat önce'},
    {color:'#00c48c',text:'TÜBİTAK Sanatta Bilim başvurusu',title:'TÜBİTAK Sanatta Bilim çağrısı — %91 uyum',sub:'Son başvuru 21 gün · Başvur →',time:'Dün'},
    {color:GOLD_LIGHT,text:'Art Basel — seçim listesi',title:"Art Basel Hong Kong 2026 seçim listesine girdiniz",sub:'Grup sergisi · Başvur →',time:'2 gün önce'},
  ]

  const getSlice = (idx: number) => allData.slice(idx, idx+3).concat(idx+3>allData.length ? allData.slice(0, Math.max(0, idx+3-allData.length)) : [])

  const galeri = [
    {baslik:'Dijital Bedenler #1',tur:'Dijital',r1:'#1a1a2e',r2:'#16213e'},
    {baslik:'Akış Serisi III',tur:'Resim',r1:'#0f3460',r2:'#533483'},
    {baslik:'Simetri Çalışması',tur:'Heykel',r1:'#2d3436',r2:'#636e72'},
    {baslik:'Karanlık Vadi',tur:'Fotoğraf',r1:'#2c3e50',r2:'#3498db'},
    {baslik:'Işık Formları',tur:'Dijital',r1:'#6c5ce7',r2:'#a29bfe'},
    {baslik:'İsimsiz #7',tur:'Resim',r1:'#00b894',r2:'#00cec9'},
    {baslik:'Şehir Labirenti',tur:'Fotoğraf',r1:'#e17055',r2:'#d63031'},
    {baslik:'Sessizlik',tur:'Heykel',r1:'#fdcb6e',r2:'#e67e22'},
    {baslik:'Dijital Bedenler #2',tur:'Dijital',r1:'#fd79a8',r2:'#e84393'},
    {baslik:'Akış Serisi I',tur:'Resim',r1:'#55efc4',r2:'#00b894'},
    {baslik:'Kırık Ayna',tur:'Dijital',r1:'#b2bec3',r2:'#636e72'},
    {baslik:'Son Eser',tur:'Resim',r1:'#dfe6e9',r2:'#b2bec3'},
  ]

  const ikonStyle = { width:'22px', height:'22px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 as const, background:'rgba(255,255,255,0.07)', borderRadius:'2px', padding:'4px' }

  const navSections = [
    { label:'Ana Menü', items: [
      { label:'Dashboard', href:'/dashboard', icon:<svg viewBox="0 0 12 12" fill="#60a5fa" width="14" height="14"><rect x="1" y="1" width="4" height="4"/><rect x="7" y="1" width="4" height="4"/><rect x="1" y="7" width="4" height="4"/><rect x="7" y="7" width="4" height="4"/></svg> },
      { label:'Akademik Ağ', href:'/ag', badge:'YZ', icon:<svg viewBox="0 0 12 12" width="14" height="14"><circle cx="2" cy="6" r="1.5" fill="#06b6d4"/><circle cx="6" cy="2" r="1.5" fill="#06b6d4"/><circle cx="10" cy="6" r="1.5" fill="#06b6d4"/><circle cx="6" cy="10" r="1.5" fill="#06b6d4"/><line x1="2" y1="6" x2="6" y2="2" stroke="#06b6d4" strokeWidth="1"/><line x1="6" y1="2" x2="10" y2="6" stroke="#06b6d4" strokeWidth="1"/><line x1="2" y1="6" x2="6" y2="10" stroke="#06b6d4" strokeWidth="1"/><line x1="6" y1="10" x2="10" y2="6" stroke="#06b6d4" strokeWidth="1"/></svg> },
      { label:'Dergi Eşleştirme', href:'/dergi', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#34d399" width="14" height="14"><rect x="2" y="1" width="6" height="1"/><rect x="2" y="1" width="1" height="9"/><rect x="2" y="9" width="8" height="1"/><rect x="9" y="4" width="1" height="6"/><rect x="4" y="4" width="4" height="1"/><rect x="4" y="6" width="4" height="1"/></svg> },
      { label:'Makale Formatlama', href:'/format', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#f97316" width="14" height="14"><rect x="1" y="1" width="10" height="1"/><rect x="1" y="3" width="8" height="1"/><rect x="1" y="5" width="10" height="1"/><rect x="1" y="7" width="6" height="1"/></svg> },
      { label:'Preprint', href:'/preprint', icon:<svg viewBox="0 0 12 12" fill="#fb923c" width="14" height="14"><rect x="2" y="1" width="6" height="1"/><rect x="2" y="1" width="1" height="9"/><rect x="2" y="9" width="8" height="1"/><rect x="9" y="4" width="1" height="6"/><rect x="4" y="4" width="4" height="1"/><rect x="4" y="6" width="4" height="1"/></svg> },
      { label:'Projeler', href:'/projeler', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#3b82f6" width="14" height="14"><rect x="1" y="1" width="10" height="2"/><rect x="1" y="5" width="10" height="2"/><rect x="1" y="9" width="7" height="2"/></svg> },
      { label:'İş Birliği Alanı', href:'/isbirligi', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#00c48c" width="14" height="14"><rect x="0" y="5" width="3" height="2"/><rect x="3" y="4" width="2" height="1"/><rect x="3" y="7" width="2" height="1"/><rect x="5" y="3" width="2" height="6"/><rect x="7" y="4" width="2" height="1"/><rect x="7" y="7" width="2" height="1"/><rect x="9" y="5" width="3" height="2"/></svg> },
      { label:'CV', href:'/cv', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#fbbf24" width="14" height="14"><rect x="2" y="1" width="8" height="10"/><rect x="4" y="0" width="4" height="2"/><rect x="4" y="3" width="4" height="1"/><rect x="4" y="5" width="5" height="1"/></svg> },
      { label:'Yazı Asistanı', href:'/yazi', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#06b6d4" width="14" height="14"><rect x="1" y="1" width="7" height="1"/><rect x="1" y="3" width="5" height="1"/><rect x="1" y="5" width="6" height="1"/><rect x="1" y="7" width="4" height="1"/></svg> },
      { label:'İntihal Kontrolü', href:'/intihal', badge:'YZ', icon:<svg viewBox="0 0 12 12" width="14" height="14"><circle cx="5" cy="5" r="3.5" stroke="#38bdf8" strokeWidth="1" fill="none"/><line x1="7.5" y1="7.5" x2="11" y2="11" stroke="#38bdf8" strokeWidth="1.5"/></svg> },
      { label:'Mesajlar', href:'/mesajlar', badge:'5', badgeRed:true, icon:<svg viewBox="0 0 12 12" fill="rgba(255,255,255,0.45)" width="14" height="14"><rect x="1" y="2" width="10" height="7"/><rect x="1" y="9" width="2" height="2"/><rect x="2" y="8" width="8" height="1"/></svg> },
    ]},
    { label:'Paydaşlar', items: [
      { label:'Danışmanlık', href:'/danisman', icon:<svg viewBox="0 0 12 12" fill="#22d3ee" width="14" height="14"><rect x="1" y="4" width="10" height="7"/><rect x="4" y="2" width="4" height="2"/><rect x="5" y="6" width="2" height="3"/></svg> },
      { label:'Firmalar', href:'/firmalar', icon:<svg viewBox="0 0 12 12" fill="#f43f5e" width="14" height="14"><rect x="2" y="1" width="8" height="10"/><rect x="4" y="3" width="1" height="1"/><rect x="7" y="3" width="1" height="1"/><rect x="4" y="5" width="1" height="1"/><rect x="7" y="5" width="1" height="1"/><rect x="5" y="8" width="2" height="3"/></svg> },
    ]},
    { label:'Profil', items: [
      { label:'Profilim', href:'/sanatci', icon:<svg viewBox="0 0 12 12" fill="${GOLD}" width="14" height="14"><rect x="4" y="1" width="4" height="4"/><rect x="3" y="2" width="1" height="2"/><rect x="8" y="2" width="1" height="2"/><rect x="1" y="8" width="10" height="3"/><rect x="2" y="7" width="2" height="1"/><rect x="8" y="7" width="2" height="1"/></svg> },
    ]},
  ]

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
    const t = setTimeout(() => {
      countUp('c1',48,1800); countUp('c2',12,1400); countUp('c3',18,1200)
      countUp('c4',156,1600); countUp('c5',6,800); countUp('c6',3,700)
    }, 400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const iv = setInterval(() => setTodayIdx(p => (p+1)%allData.length), 4000)
    return () => clearInterval(iv)
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
        if (d<16) { const f=Math.max(0,Math.sin(mt*0.9+mph[i][j])); mc.beginPath(); mc.moveTo(a.x,a.y); mc.lineTo(b.x,b.y); mc.strokeStyle='rgba(212,168,83,'+f*0.7*(1-d/16)+')'; mc.lineWidth=0.9; mc.stroke() }
      }
      mnp.forEach((p,i) => {
        const pulse=Math.sin(mt*1.5+i*0.7)
        mc.beginPath(); mc.arc(p.x,p.y,1.8+pulse*0.5,0,Math.PI*2)
        mc.fillStyle='rgba(212,168,83,'+(0.7+0.3*pulse)+')'; mc.fill()
      })
      mt+=0.022; raf=requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const bc = bannerRef.current; if (!bc) return
    const bx = bc.getContext('2d')!
    const rb = () => { bc.width=bc.offsetWidth||800; bc.height=bc.offsetHeight||120 }
    rb(); window.addEventListener('resize', rb)
    const bp: {x:number,y:number,vx:number,vy:number,r:number,ph:number}[] = []
    for (let i=0;i<60;i++) bp.push({x:Math.random()*1200,y:Math.random()*120,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.8+0.5,ph:Math.random()*Math.PI*2})
    const blp = bp.map(() => bp.map(() => Math.random()*Math.PI*2))
    let bt=0, raf: number
    const drawB = () => {
      bx.clearRect(0,0,bc.width,bc.height)
      bp.forEach(p => { p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>bc.width) p.vx*=-1; if(p.y<0||p.y>bc.height) p.vy*=-1 })
      for (let i=0;i<bp.length;i++) for (let j=i+1;j<bp.length;j++) {
        const a=bp[i],b=bp[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy)
        if (d<80) { const f=Math.max(0,Math.sin(bt*0.7+blp[i][j])); bx.beginPath(); bx.moveTo(a.x,a.y); bx.lineTo(b.x,b.y); bx.strokeStyle='rgba(212,168,83,'+(f*(1-d/80)*0.35)+')'; bx.lineWidth=0.8; bx.stroke() }
      }
      bp.forEach(p => { const pulse=Math.sin(bt*1.3+p.ph); bx.beginPath(); bx.arc(p.x,p.y,p.r+pulse*.4,0,Math.PI*2); bx.fillStyle='rgba(212,168,83,'+(0.4+0.2*pulse)+')'; bx.fill() })
      bt+=0.013; raf=requestAnimationFrame(drawB)
    }
    drawB()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', rb) }
  }, [])

  const sliceData = getSlice(todayIdx)

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; cursor:none!important; }
        body { font-family:'DM Sans',sans-serif; background:#f2f2f0; color:#0a0a0a; height:100vh; overflow:hidden; }
        .nav-item { display:flex; align-items:center; gap:10px; padding:8px 18px; font-size:13px; color:rgba(255,255,255,0.5); transition:all 0.2s; border-left:2px solid transparent; cursor:pointer; }
        .nav-item:hover { color:#fff; background:rgba(255,255,255,0.04); }
        .nav-item.active { color:${GOLD}; border-left-color:${GOLD}; background:rgba(212,168,83,0.07); font-weight:600; }
        .panel { background:#fff; border:1px solid rgba(0,0,0,0.07); padding:16px 18px; }
        .panel-hd { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
        .panel-t { font-family:'Pixelify Sans',monospace; font-size:13px; font-weight:700; }
        .panel-a { font-size:11px; color:${GOLD}; font-weight:600; cursor:pointer; }
        .pub-item { padding:10px 0; border-bottom:1px solid rgba(0,0,0,0.04); }
        .pub-item:last-child { border-bottom:none; }
        .skill { font-size:10px; padding:4px 10px; border:1px solid rgba(212,168,83,0.25); color:rgba(0,0,0,0.55); background:#f2f2f0; transition:all 0.2s; cursor:pointer; }
        .skill:hover { border-color:${GOLD}; color:${GOLD}; }
        .tbtn { border:none; padding:8px 16px; font-size:12px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.2s; }
        .tbtn.dark { background:#0a0a0a; color:#fff; }
        .tbtn.dark:hover { background:${GOLD}; color:#0a0a0a; }
        .tbtn.outline { background:transparent; color:#0a0a0a; border:1px solid rgba(0,0,0,0.07); }
        .tbtn.outline:hover { border-color:${GOLD}; color:${GOLD}; }
        .nd-item { display:flex; align-items:flex-start; gap:8px; padding:10px 16px; border-bottom:1px solid rgba(0,0,0,0.04); cursor:pointer; }
        .nd-item:hover { background:#fdf9f0; }
        .nd-item.new { background:linear-gradient(90deg,rgba(212,168,83,0.12),transparent); }
        .bt-item { font-size:10px; color:rgba(255,255,255,0.75); display:flex; align-items:center; gap:4px; white-space:nowrap; padding:2px 6px; transition:all 0.2s; cursor:pointer; }
        .bt-item:hover { color:#fff; background:rgba(255,255,255,0.1); }
        .tp-item { display:flex; align-items:center; gap:12px; padding:10px 24px; border-bottom:1px solid rgba(255,255,255,0.05); cursor:pointer; transition:background 0.15s; }
        .tp-item:hover { background:rgba(255,255,255,0.05); }
        .tab-btn { padding:10px 18px; font-size:12px; font-family:'DM Sans',sans-serif; border:none; border-bottom:2px solid transparent; background:transparent; color:rgba(0,0,0,0.4); cursor:pointer; transition:all 0.2s; }
        .tab-btn:hover { color:#0a0a0a; }
        .galeri-item { aspect-ratio:1; position:relative; overflow:hidden; cursor:pointer; transition:transform 0.2s; }
        .galeri-item:hover { transform:scale(1.04); }
        .galeri-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,0.85),transparent); opacity:0; transition:opacity 0.25s; display:flex; flex-direction:column; justify-content:flex-end; padding:6px; }
        .galeri-item:hover .galeri-overlay { opacity:1; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <svg ref={curRef} style={{position:'fixed',top:0,left:0,zIndex:9999,pointerEvents:'none'}} width="20" height="20" viewBox="0 0 10 10">
        <rect x="0" y="0" width="2" height="2" fill={GOLD}/><rect x="0" y="2" width="2" height="2" fill={GOLD}/>
        <rect x="0" y="4" width="2" height="2" fill={GOLD}/><rect x="0" y="6" width="2" height="2" fill={GOLD}/>
        <rect x="0" y="8" width="2" height="2" fill={GOLD}/><rect x="2" y="2" width="2" height="2" fill={GOLD}/>
        <rect x="4" y="4" width="2" height="2" fill={GOLD}/><rect x="4" y="6" width="2" height="2" fill={GOLD}/>
        <rect x="6" y="6" width="2" height="2" fill={GOLD}/><rect x="6" y="8" width="2" height="2" fill={GOLD}/>
      </svg>

      <div style={{display:'grid',gridTemplateColumns:'220px 1fr',height:'100vh'}}>

        {/* SIDEBAR */}
        <aside style={{background:'linear-gradient(180deg,#0e0d0a 0%,#0a0d08 100%)',display:'flex',flexDirection:'column',height:'100vh',overflowY:'auto',borderRight:'1px solid rgba(212,168,83,0.2)'}}>
          <div style={{padding:'16px 20px 14px',borderBottom:'1px solid rgba(212,168,83,0.1)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'3px'}}>
              <canvas ref={mncRef} width="26" height="26" style={{flexShrink:0}}/>
              <span style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'21px',fontWeight:700,background:'linear-gradient(90deg,'+GOLD+',#fff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>tais.tr</span>
            </div>
            <div style={{fontSize:'9px',color:'rgba(255,255,255,0.2)',letterSpacing:'1px'}}>Akademik Ekosistem</div>
          </div>
          {navSections.map((section, si) => (
            <div key={si} style={{padding:'10px 0'}}>
              <div style={{fontSize:'9px',color:'rgba(212,168,83,0.5)',letterSpacing:'2px',textTransform:'uppercase',padding:'0 18px',marginBottom:'6px'}}>{section.label}</div>
              {section.items.map((item, i) => {
                const isActive = item.href === '/sanatci'
                return (
                  <div key={i} onClick={() => router.push(item.href)}
                    style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 18px',fontSize:'13px',color:isActive?GOLD:'rgba(255,255,255,0.55)',borderLeft:isActive?'2px solid '+GOLD:'2px solid transparent',background:isActive?'rgba(212,168,83,0.08)':'transparent',fontWeight:isActive?600:400,cursor:'pointer',transition:'all 0.2s'}}
                    onMouseEnter={e=>{if(!isActive){const el=e.currentTarget as HTMLElement;el.style.color='#fff';el.style.background='rgba(255,255,255,0.05)'}}}
                    onMouseLeave={e=>{if(!isActive){const el=e.currentTarget as HTMLElement;el.style.color='rgba(255,255,255,0.55)';el.style.background='transparent'}}}>
                    <span style={ikonStyle}>{item.icon}</span>
                    <span style={{flex:1}}>{item.label}</span>
                    {item.badge && <span style={{background:(item as any).badgeRed?'#ee5533':GOLD,color:(item as any).badgeRed?'#fff':'#0a0a0a',fontSize:'8px',fontWeight:800,padding:'2px 5px',borderRadius:(item as any).badgeRed?'8px':'0',fontFamily:"'Pixelify Sans',monospace"}}>{item.badge}</span>}
                  </div>
                )
              })}
            </div>
          ))}
          <div style={{marginTop:'auto',borderTop:'1px solid rgba(212,168,83,0.1)',padding:'14px 16px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <div style={{width:'34px',height:'34px',background:'linear-gradient(135deg,'+GOLD+',#8b6914)',borderRadius:'2px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,color:'#0a0a0a',fontFamily:"'Pixelify Sans',monospace",overflow:'hidden'}}>
                {avatarUrl ? <img src={avatarUrl} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : 'ZK'}
              </div>
              <div>
                <div style={{fontSize:'12px',color:'rgba(255,255,255,0.8)',fontWeight:500}}>Zeynep Kaya</div>
                <div style={{fontSize:'9px',color:GOLD,marginTop:'2px'}}>Görsel Sanatçı</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden'}}>

          {/* TOPBAR */}
          <div style={{background:'#fff',borderBottom:'1px solid rgba(0,0,0,0.07)',padding:'0 32px',height:'52px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
            <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'16px',fontWeight:700}}>Profilim</div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',position:'relative'}}>
              <button className="tbtn outline">Portfolyo İndir</button>
              <button className="tbtn dark">Düzenle</button>
              <div onClick={() => setNotifOpen(p => !p)} style={{width:'32px',height:'32px',background:'#f2f2f0',border:'1px solid rgba(0,0,0,0.07)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',position:'relative',borderRadius:'2px'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <span style={{position:'absolute',top:'-5px',right:'-5px',background:'#e53333',color:'#fff',fontSize:'9px',fontWeight:800,width:'16px',height:'16px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid #fff'}}>5</span>
              </div>
              {notifOpen && (
                <div style={{position:'absolute',top:'46px',right:0,width:'280px',background:'#fff',border:'1px solid rgba(0,0,0,0.07)',boxShadow:'0 8px 32px rgba(0,0,0,0.12)',zIndex:999,animation:'fadeIn 0.15s ease'}}>
                  <div style={{padding:'12px 16px',borderBottom:'1px solid rgba(0,0,0,0.07)',display:'flex',justifyContent:'space-between'}}>
                    <span style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'13px',fontWeight:700}}>Bildirimler</span>
                    <span style={{fontSize:'10px',color:GOLD,fontWeight:600}}>5 okunmamış</span>
                  </div>
                  {[
                    {text:'<strong>İstanbul Modern</strong> — Sergi daveti geldi',time:'1 saat önce',isNew:true},
                    {text:'<strong>Leonardo</strong> — makaleniz yayımlandı',time:'3 saat önce',isNew:true},
                    {text:'<strong>TÜBİTAK</strong> Sanatta Bilim — %91 uyum',time:'Dün',isNew:true},
                  ].map((n,i) => (
                    <div key={i} className={'nd-item'+(n.isNew?' new':'')}>
                      <div style={{width:'6px',height:'6px',borderRadius:'50%',background:n.isNew?GOLD:'rgba(0,0,0,0.15)',flexShrink:0,marginTop:'5px'}}/>
                      <div>
                        <div style={{fontSize:'11px',lineHeight:1.5}} dangerouslySetInnerHTML={{__html:n.text}}/>
                        <div style={{fontSize:'10px',color:'rgba(0,0,0,0.3)',marginTop:'2px'}}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{padding:'10px 16px',borderTop:'1px solid rgba(0,0,0,0.07)',fontSize:'11px',color:GOLD,fontWeight:600,cursor:'pointer'}}>Tümünü gör →</div>
                </div>
              )}
            </div>
          </div>

          <div style={{flex:1,overflowY:'auto',padding:'20px 28px',display:'flex',flexDirection:'column',gap:'14px'}}>

            {/* PROFİL KARTI */}
            <div style={{background:'#fff',border:'1px solid rgba(0,0,0,0.07)'}}>

              {/* BANNER */}
              <div onClick={() => setTodayOpen(p => !p)} style={{height:'120px',position:'relative',background:'linear-gradient(135deg,#1a1208,#2d1f0a)',overflow:'hidden',cursor:'pointer'}}>
                <canvas ref={bannerRef} style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:bannerUrl?0.15:1,transition:'opacity 0.3s'}}/>
                {bannerUrl && <div style={{position:'absolute',inset:0,backgroundImage:'url('+bannerUrl+')',backgroundSize:'cover',backgroundPosition:'center'}}/>}
                <div style={{position:'absolute',bottom:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,'+GOLD+',transparent)'}}/>
                <div style={{position:'absolute',bottom:0,left:0,right:0,height:'70px',background:'linear-gradient(to top,rgba(0,0,0,0.85),transparent)',pointerEvents:'none'}}/>
                <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'8px 24px',zIndex:2}}>
                  <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                    <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'10px',color:GOLD,fontWeight:700,letterSpacing:'1px',whiteSpace:'nowrap',flexShrink:0}}>◉ Bugün</div>
                    <div style={{display:'flex',gap:'10px',overflow:'hidden'}}>
                      {sliceData.map((d,i) => (
                        <div key={i} className="bt-item">
                          <span style={{width:'5px',height:'5px',borderRadius:'50%',background:d.color,flexShrink:0,display:'inline-block'}}/>
                          {d.text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <label onClick={e => e.stopPropagation()} style={{position:'absolute',top:'8px',right:'10px',zIndex:3,background:'rgba(0,0,0,0.5)',color:'rgba(255,255,255,0.8)',padding:'5px 10px',fontSize:'10px',cursor:'pointer',display:'flex',alignItems:'center',gap:'5px'}}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Kapak Fotoğrafı
                  <input type="file" accept="image/*" style={{display:'none'}} onChange={e => { const f=e.target.files?.[0]; if(f) setBannerUrl(URL.createObjectURL(f)) }}/>
                </label>
                {/* Alan Uyumu Badge */}
                <div style={{position:'absolute',top:'12px',left:'14px',zIndex:3,background:'rgba(0,0,0,0.55)',border:'1px solid rgba(212,168,83,0.5)',padding:'8px 16px',display:'flex',alignItems:'center',gap:'10px',backdropFilter:'blur(4px)'}}>
                  <span style={{fontSize:'11px',color:'rgba(255,255,255,0.7)'}}>Alan Uyumu</span>
                  <span style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'26px',fontWeight:700,color:GOLD,lineHeight:1}}>%87</span>
                </div>
              </div>

              {todayOpen && (
                <div style={{background:'rgba(0,0,0,0.92)',borderBottom:'2px solid rgba(212,168,83,0.2)'}}>
                  {sliceData.map((d,i) => (
                    <div key={i} className="tp-item">
                      <div style={{width:'7px',height:'7px',borderRadius:'50%',background:d.color,flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <div style={{fontSize:'12px',color:'#fff',fontWeight:500}}>{d.title}</div>
                        <div style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',marginTop:'1px'}}>{d.sub}</div>
                      </div>
                      <div style={{fontSize:'9px',color:'rgba(255,255,255,0.25)',whiteSpace:'nowrap',flexShrink:0}}>{d.time}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* PROFİL BODY — koyu altın arka plan */}
              <div style={{background:'linear-gradient(120deg,#2a1a00 0%,#5a3800 40%,#3d2800 100%)',padding:'20px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px',flexWrap:'wrap'}}>
                <div style={{display:'flex',alignItems:'center',gap:'16px',flex:1,minWidth:0}}>
                  <div style={{position:'relative',flexShrink:0}}>
                    <label style={{width:'72px',height:'72px',background:avatarUrl?'transparent':'linear-gradient(135deg,'+GOLD+',#8b6914)',borderRadius:'4px',border:'4px solid rgba(212,168,83,0.5)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Pixelify Sans',monospace",fontSize:'20px',fontWeight:700,color:'#fff',overflow:'hidden',cursor:'pointer',position:'relative',boxShadow:'0 4px 16px rgba(0,0,0,0.4)'}}>
                      {avatarUrl ? <img src={avatarUrl} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : 'ZK'}
                      <input type="file" accept="image/*" style={{display:'none'}} onChange={e => { const f=e.target.files?.[0]; if(f) setAvatarUrl(URL.createObjectURL(f)) }}/>
                    </label>
                    <div style={{position:'absolute',bottom:'2px',right:'2px',width:'11px',height:'11px',background:'#00c48c',borderRadius:'50%',border:'2px solid rgba(255,255,255,0.3)',zIndex:3}}/>
                  </div>
                  <div style={{minWidth:0}}>
                    <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'20px',fontWeight:700,color:'#fff',marginBottom:'3px',textShadow:'0 1px 6px rgba(0,0,0,0.4)'}}>Zeynep Kaya</div>
                    <div style={{fontSize:'12px',color:'rgba(255,255,255,0.65)',marginBottom:'8px'}}>Görsel Sanatçı · Dijital Sanat & Resim · İstanbul</div>
                    <div style={{display:'flex',gap:'5px',flexWrap:'wrap'}}>
                      {['Dijital Sanat','Resim','Fotoğraf','Enstalasyon','NFT'].map((t,i) => (
                        <span key={i} style={{fontSize:'10px',padding:'3px 8px',border:'1px solid rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.8)',background:'rgba(255,255,255,0.1)'}}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{display:'flex',gap:'8px',alignSelf:'flex-end',paddingBottom:'4px',flexShrink:0}}>
                  <button style={{background:'rgba(255,255,255,0.95)',color:'#0a0a0a',border:'none',padding:'9px 18px',fontSize:'12px',fontWeight:700,fontFamily:"'DM Sans',sans-serif",cursor:'pointer'}}>Mesaj Gönder</button>
                  <button style={{background:'rgba(212,168,83,0.15)',color:GOLD,border:'1px solid rgba(212,168,83,0.4)',padding:'9px 18px',fontSize:'12px',fontWeight:700,fontFamily:"'DM Sans',sans-serif",cursor:'pointer'}}>İş Birliği Teklif Et</button>
                </div>
              </div>
              {/* İSTATİSTİK BARI — siyah */}
              <div style={{background:'#0a0a0a',padding:'12px 24px',display:'flex',gap:0}}>
                {[
                  {n:counts.c1,l:'Eser',c:GOLD},
                  {n:counts.c2,l:'Sergi',c:'#fff'},
                  {n:counts.c3,l:'Yayın',c:'#60a5fa'},
                  {n:counts.c4,l:'Atıf',c:'#00c48c'},
                  {n:counts.c5,l:'Ödül',c:GOLD_LIGHT},
                  {n:counts.c6,l:'Proje',c:'#f97316'},
                ].map((s,i) => (
                  <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'0 20px',borderRight:i<5?'1px solid rgba(255,255,255,0.08)':'none'}}>
                    <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'18px',fontWeight:700,color:s.c,lineHeight:1}}>{s.n}</div>
                    <div style={{fontSize:'9px',color:'rgba(255,255,255,0.4)',letterSpacing:'1px',textTransform:'uppercase',marginTop:'2px',whiteSpace:'nowrap'}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SEKMELER */}
            <div style={{background:'#fff',border:'1px solid rgba(0,0,0,0.07)',display:'flex',flexShrink:0}}>
              {[
                {key:'eserler',label:'🖼 Eserler'},
                {key:'sergiler',label:'🏛 Sergiler & Ödüller'},
                {key:'yayinlar',label:'📄 Yayınlar'},
                {key:'ekosistem',label:'🤝 Ekosistem'},
              ].map(t => (
                <button key={t.key} className="tab-btn" onClick={() => setAktifTab(t.key)}
                  style={{fontWeight:aktifTab===t.key?700:500,color:aktifTab===t.key?'#0a0a0a':'rgba(0,0,0,0.4)',borderBottom:aktifTab===t.key?'2px solid '+GOLD:'2px solid transparent'}}>
                  {t.label}
                </button>
              ))}
              <div style={{marginLeft:'auto',padding:'0 16px',display:'flex',alignItems:'center',gap:'8px'}}>
                <span style={{fontSize:'11px',color:'rgba(0,0,0,0.4)',fontWeight:500}}>Eser Talebi:</span>
                <div onClick={() => setEserTalebi(p=>!p)} style={{display:'flex',alignItems:'center',gap:'6px',cursor:'pointer'}}>
                  <div style={{width:'36px',height:'20px',background:eserTalebi?GOLD:'rgba(0,0,0,0.12)',borderRadius:'10px',position:'relative',transition:'background 0.2s'}}>
                    <div style={{position:'absolute',top:'2px',left:eserTalebi?'18px':'2px',width:'16px',height:'16px',background:'#fff',borderRadius:'50%',transition:'left 0.2s',boxShadow:'0 1px 4px rgba(0,0,0,0.2)'}}/>
                  </div>
                  <span style={{fontSize:'11px',fontWeight:700,color:eserTalebi?GOLD:'rgba(0,0,0,0.3)'}}>{eserTalebi?'Açık':'Kapalı'}</span>
                </div>
              </div>
            </div>

            {/* ESERLER */}
            {aktifTab === 'eserler' && (
              <div style={{display:'flex',flexDirection:'column',gap:'14px',animation:'fadeIn 0.3s ease'}}>
                <div className="panel">
                  <div className="panel-hd">
                    <div className="panel-t">Portfolyo & Eserler</div>
                    <span style={{fontSize:'11px',color:GOLD,fontWeight:600}}>48 eser</span>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:'5px',marginBottom:'14px'}}>
                    {galeri.map((g,i) => (
                      <div key={i} className="galeri-item" onClick={() => setLightbox(i)}>
                        <div style={{width:'100%',height:'100%',background:'linear-gradient(135deg,'+g.r1+','+g.r2+')',position:'relative'}}>
                          <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 30% 30%,rgba(255,255,255,0.08),transparent 60%)'}}/>
                          <div style={{position:'absolute',top:'4px',left:'4px',fontSize:'7px',fontWeight:700,padding:'1px 4px',background:'rgba(212,168,83,0.2)',color:GOLD,fontFamily:"'Pixelify Sans',monospace"}}>{g.tur.toUpperCase()}</div>
                        </div>
                        <div className="galeri-overlay">
                          <div style={{fontSize:'8px',fontWeight:600,color:'#fff'}}>{g.baslik}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                    {['Dijital Sanat','Resim','Fotoğraf','Enstalasyon','NFT','Baskı Sanatı','Heykel','Seramik'].map((t,i) => (
                      <span key={i} className="skill">{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'14px'}}>
                  <div className="panel">
                    <div className="panel-hd"><div className="panel-t">Eser Talebi</div><span style={{fontSize:'9px',padding:'2px 8px',background:'rgba(212,168,83,0.1)',color:GOLD,fontWeight:700}}>{eserTalebi?'AÇIK':'KAPALI'}</span></div>
                    <div style={{fontSize:'12px',color:'rgba(0,0,0,0.5)',lineHeight:1.7,marginBottom:'10px'}}>Akademik projeler, sergi iş birlikleri ve eser talepleri için açığım.</div>
                    {[{l:'Min. Süre',v:'1 ay'},{l:'Tercih',v:'Dijital / Karma'},{l:'Müsaitlik',v:'Hf. 2 gün'}].map((b,i) => (
                      <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid rgba(0,0,0,0.05)'}}>
                        <span style={{fontSize:'11px',color:'rgba(0,0,0,0.4)'}}>{b.l}</span>
                        <span style={{fontSize:'11px',fontWeight:600}}>{b.v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="panel">
                    <div className="panel-hd"><div className="panel-t">Son Faaliyetler</div></div>
                    {[
                      {tip:'SERGİ',renk:'rgba(212,168,83,0.12)',rc:GOLD,baslik:'İstanbul Modern — Solo',sub:'Mar 2025'},
                      {tip:'ÖDÜL',renk:'rgba(229,51,51,0.1)',rc:'#e53333',baslik:'TÜBİTAK Sanatta Bilim',sub:'Oca 2025'},
                      {tip:'KONF',renk:'rgba(0,196,140,0.1)',rc:'#00c48c',baslik:'Art Basel Hong Kong',sub:'Kas 2024'},
                      {tip:'YAYIN',renk:'rgba(100,100,255,0.1)',rc:'#6464ff',baslik:'Leonardo · MIT Press',sub:'Eki 2024'},
                    ].map((f,i) => (
                      <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 0',borderBottom:i<3?'1px solid rgba(0,0,0,0.04)':'none'}}>
                        <div style={{width:'32px',height:'32px',background:f.renk,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'7px',fontWeight:700,color:f.rc,fontFamily:"'Pixelify Sans',monospace",flexShrink:0}}>{f.tip}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:'11px',fontWeight:500}}>{f.baslik}</div>
                          <div style={{fontSize:'10px',color:'rgba(0,0,0,0.35)',marginTop:'1px'}}>{f.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="panel">
                    <div className="panel-hd"><div className="panel-t">Ödüller</div></div>
                    {[
                      {medal:'🥇',name:'TÜBİTAK Sanatta Bilim',year:'2023'},
                      {medal:'🏆',name:'Avrupa Genç Sanatçı',year:'2022'},
                      {medal:'🥈',name:'İstanbul Bienali Seçkisi',year:'2022'},
                      {medal:'🎖',name:'MSGSÜ Yıl Birincisi',year:'2021'},
                      {medal:'🥉',name:'Dijital Sanat Yarışması',year:'2020'},
                    ].map((o,i) => (
                      <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',padding:'7px 0',borderBottom:i<4?'1px solid rgba(0,0,0,0.04)':'none'}}>
                        <div style={{fontSize:'18px',flexShrink:0}}>{o.medal}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:'11px',fontWeight:500}}>{o.name}</div>
                          <div style={{fontSize:'10px',color:'rgba(0,0,0,0.3)',marginTop:'1px'}}>{o.year}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SERGİLER & ÖDÜLLER */}
            {aktifTab === 'sergiler' && (
              <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'14px',animation:'fadeIn 0.3s ease'}}>
                <div className="panel">
                  <div className="panel-hd"><div className="panel-t">Sergi Geçmişi</div><div className="panel-a">Tümü →</div></div>
                  {[
                    {tip:'SERGİ',baslik:'İstanbul Modern — "Dijital Bedenler" Solo',sub:'14 eser · 3.200 ziyaretçi',tarih:'2024'},
                    {tip:'SERGİ',baslik:'Art Basel Hong Kong — Grup Sergisi',sub:'5 Türk sanatçı · Uluslararası',tarih:'2024'},
                    {tip:'ÖDÜL',baslik:'TÜBİTAK Sanatta Bilim Ödülü',sub:'Dijital sanat kategorisi · Birincilik',tarih:'2023'},
                    {tip:'SERGİ',baslik:'SALT Beyoğlu — Karma Sergi',sub:'12 sanatçı · 3 hafta · İstanbul',tarih:'2023'},
                    {tip:'ÖDÜL',baslik:'Avrupa Genç Sanatçı Ödülü',sub:'Dijital kategori · Jüri özel ödülü',tarih:'2022'},
                    {tip:'SERGİ',baslik:'Pera Müzesi — Genç Sanatçılar',sub:'Solo bölüm · 6 eser',tarih:'2022'},
                  ].map((s,i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 0',borderBottom:'1px solid rgba(0,0,0,0.05)'}}>
                      <div style={{padding:'2px 6px',fontSize:'8px',fontWeight:700,background:'rgba(212,168,83,0.12)',color:GOLD,flexShrink:0,fontFamily:"'Pixelify Sans',monospace"}}>{s.tip}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:'12px',fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.baslik}</div>
                        <div style={{fontSize:'10px',color:'rgba(0,0,0,0.4)',marginTop:'1px'}}>{s.sub}</div>
                      </div>
                      <div style={{fontSize:'10px',color:'rgba(0,0,0,0.3)',flexShrink:0}}>{s.tarih}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                  <div className="panel">
                    <div className="panel-hd"><div className="panel-t">Yaklaşan Etkinlikler</div></div>
                    {[
                      {tip:'SERGİ',baslik:'Biennial İstanbul 2025',sub:'Davet · Hazırlık aşamasında',renk:'#00c48c'},
                      {tip:'KONUŞMA',baslik:'Tasarım ve Sanat Zirvesi',sub:'Davetli konuşmacı · Mayıs 2025',renk:GOLD},
                      {tip:'ATÖLYE',baslik:'Dijital Sanat Masterclass',sub:'İTÜ · 2 günlük atölye',renk:'#60a5fa'},
                    ].map((e,i) => (
                      <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 0',borderBottom:i<2?'1px solid rgba(0,0,0,0.05)':'none'}}>
                        <div style={{width:'6px',height:'6px',borderRadius:'50%',background:e.renk,flexShrink:0}}/>
                        <div>
                          <div style={{fontSize:'12px',fontWeight:500}}>{e.baslik}</div>
                          <div style={{fontSize:'10px',color:'rgba(0,0,0,0.4)',marginTop:'1px'}}>{e.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="panel">
                    <div className="panel-hd"><div className="panel-t">Eğitim</div></div>
                    {[{deg:'Güzel Sanatlar Doktora',uni:'İTÜ',y:'2021–devam'},{deg:'Yüksek Lisans',uni:'MSGSÜ',y:'2018–2021'},{deg:'Lisans',uni:'MSGSÜ',y:'2014–2018'}].map((e,i) => (
                      <div key={i} style={{padding:'8px 0',borderBottom:i<2?'1px solid rgba(0,0,0,0.05)':'none'}}>
                        <div style={{fontSize:'12px',fontWeight:500}}>{e.deg}</div>
                        <div style={{fontSize:'10px',color:'rgba(0,0,0,0.4)',marginTop:'1px'}}>{e.uni} · {e.y}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* YAYINLAR */}
            {aktifTab === 'yayinlar' && (
              <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'14px',animation:'fadeIn 0.3s ease'}}>
                <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                  {[
                    {title:'Digital Art and Academic Knowledge Production: A New Paradigm',j:'Leonardo — MIT Press',y:'2024',c:31,q:'Q1',if:'3.2'},
                    {title:'Yapay Zeka ve Görsel Sanat: Yaratıcılık Sınırları Üzerine',j:'Sanat Dergisi — ULAKBİM',y:'2023',c:18,q:'—',if:'—'},
                    {title:'Algorithmic Aesthetics in Contemporary Turkish Art Practice',j:'Journal of Visual Arts Research',y:'2023',c:24,q:'Q2',if:'2.1'},
                    {title:'NFT ve Akademik Sanat: Ekonomik ve Etik Boyutlar',j:'İstanbul Üniversitesi Sanat Dergisi',y:'2022',c:12,q:'—',if:'—'},
                  ].map((p,i) => (
                    <div key={i} className="panel">
                      <div style={{fontSize:'12px',fontWeight:500,lineHeight:1.4,marginBottom:'6px'}}>{p.title}</div>
                      <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
                        <span style={{fontSize:'11px',color:GOLD,fontWeight:600}}>{p.j}</span>
                        <span style={{fontSize:'11px',color:'rgba(0,0,0,0.3)'}}>{p.y}</span>
                        <span style={{fontSize:'11px',color:'rgba(0,0,0,0.3)'}}>↗ {p.c} atıf</span>
                        {p.q !== '—' && <span style={{background:'rgba(0,196,140,0.1)',color:'#008a64',fontSize:'9px',padding:'2px 6px',fontWeight:700}}>{p.q}</span>}
                        {p.if !== '—' && <span style={{background:'rgba(74,158,255,0.1)',color:'#2563eb',fontSize:'9px',padding:'2px 6px',fontWeight:700}}>IF {p.if}</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                  <div className="panel">
                    <div className="panel-hd"><div className="panel-t">Preprint Arşivi</div></div>
                    {[
                      {title:'AI-Generated Art and Authorship: A Critical Review',hash:'SHA: c8d2e4f1',date:'Mar 2025',views:'642 görüntüleme'},
                    ].map((p,i) => (
                      <div key={i} style={{padding:'9px 0'}}>
                        <div style={{fontSize:'12px',fontWeight:500,marginBottom:'3px'}}>{p.title}</div>
                        <div style={{display:'flex',gap:'8px',fontSize:'10px',color:'rgba(0,0,0,0.3)'}}>
                          <span style={{color:GOLD,fontFamily:"'Pixelify Sans',monospace",fontSize:'9px'}}>{p.hash}</span>
                          <span>· {p.date}</span><span>· {p.views}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="panel">
                    <div className="panel-hd"><div className="panel-t">Akademik Ağ</div><div className="panel-a" onClick={() => router.push('/ag')}>Tümünü Gör →</div></div>
                    <div style={{fontSize:'10px',color:'rgba(0,0,0,0.3)',marginBottom:'10px'}}>8 bağlantı · 3 aktif iş birliği</div>
                    <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                      {[{av:'MD',c:'#3b82f6',n:'Prof. Mehmet'},{av:'SA',c:'#8b5cf6',n:'Doç. Selin'},{av:'AK',c:'#f97316',n:'Dr. Ali'},{av:'ZD',c:'#00c48c',n:'Dr. Zehra'}].map((p,i) => (
                        <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'3px',cursor:'pointer'}}>
                          <div style={{width:'34px',height:'34px',borderRadius:'50%',background:p.c,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700,color:'#fff',fontFamily:"'Pixelify Sans',monospace"}}>{p.av}</div>
                          <div style={{fontSize:'9px',color:'rgba(0,0,0,0.35)',textAlign:'center',maxWidth:'44px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.n}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* EKOSİSTEM */}
            {aktifTab === 'ekosistem' && (
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px',animation:'fadeIn 0.3s ease'}}>
                <div className="panel">
                  <div className="panel-hd"><div className="panel-t">Akademik İşbirlikleri</div><div className="panel-a">Tümü →</div></div>
                  {[
                    {av:'MD',color:'#3b82f6',name:'Prof. Mehmet Demir',uni:'ODTÜ · Dijital Medya',tur:'Ortak Yayın'},
                    {av:'SA',color:'#00c48c',name:'Doç. Selin Arslan',uni:'İTÜ · Tasarım',tur:'Proje'},
                    {av:'AK',color:'#f97316',name:'Dr. Ali Kaya',uni:'MSGSÜ · Güzel Sanatlar',tur:'Sergi Küratörü'},
                  ].map((k,i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 0',borderBottom:'1px solid rgba(0,0,0,0.05)'}}>
                      <div style={{width:'34px',height:'34px',borderRadius:'50%',background:k.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700,color:'#fff',fontFamily:"'Pixelify Sans',monospace",flexShrink:0}}>{k.av}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:'12px',fontWeight:500}}>{k.name}</div>
                        <div style={{fontSize:'10px',color:'rgba(0,0,0,0.4)'}}>{k.uni}</div>
                      </div>
                      <span style={{fontSize:'9px',padding:'2px 7px',background:'rgba(212,168,83,0.1)',color:GOLD,fontWeight:700}}>{k.tur}</span>
                    </div>
                  ))}
                </div>
                <div className="panel">
                  <div className="panel-hd"><div className="panel-t">YZ Uyum Analizi</div><div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'16px',fontWeight:700,color:GOLD}}>%87</div></div>
                  <div style={{fontSize:'12px',color:'rgba(0,0,0,0.5)',lineHeight:1.6,marginBottom:'12px'}}>
                    Dijital sanat ve akademik üretim kesişimindeki güçlü profiliniz, disiplinlerarası iş birliği için ideal.
                  </div>
                  {[
                    {l:'Dijital Sanat Uzmanlığı',v:95},
                    {l:'Akademik Yayın Geçmişi',v:78},
                    {l:'Uluslararası Deneyim',v:88},
                    {l:'Disiplinlerarası Çalışma',v:82},
                  ].map((r,i) => (
                    <div key={i} style={{marginBottom:'8px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'3px'}}>
                        <span style={{fontSize:'11px',color:'rgba(0,0,0,0.5)'}}>{r.l}</span>
                        <span style={{fontSize:'11px',fontWeight:700,color:GOLD}}>{r.v}%</span>
                      </div>
                      <div style={{height:'3px',background:'rgba(0,0,0,0.06)',borderRadius:'2px'}}>
                        <div style={{height:'100%',width:r.v+'%',background:GOLD,borderRadius:'2px'}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightbox !== null && (
        <div onClick={() => setLightbox(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:9000,display:'flex',alignItems:'center',justifyContent:'center',animation:'fadeIn 0.2s ease'}}>
          <div onClick={e => e.stopPropagation()} style={{position:'relative',maxWidth:'80vw',maxHeight:'80vh'}}>
            {/* Büyük görsel */}
            <div style={{width:'600px',height:'600px',maxWidth:'80vw',maxHeight:'80vh',background:'linear-gradient(135deg,'+galeri[lightbox].r1+','+galeri[lightbox].r2+')',position:'relative',borderRadius:'2px',overflow:'hidden',boxShadow:'0 32px 80px rgba(0,0,0,0.6)'}}>
              <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 30% 30%,rgba(255,255,255,0.1),transparent 60%)'}}/>
              {/* Tür etiketi */}
              <div style={{position:'absolute',top:'12px',left:'12px',fontSize:'11px',fontWeight:700,padding:'4px 10px',background:'rgba(212,168,83,0.2)',color:GOLD,fontFamily:"'Pixelify Sans',monospace",letterSpacing:'1px'}}>{galeri[lightbox].tur.toUpperCase()}</div>
              {/* Altın çizgi */}
              <div style={{position:'absolute',bottom:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,'+GOLD+',transparent)'}}/>
            </div>
            {/* Başlık */}
            <div style={{position:'absolute',bottom:'-48px',left:0,right:0,textAlign:'center'}}>
              <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'16px',fontWeight:700,color:'#fff',marginBottom:'4px'}}>{galeri[lightbox].baslik}</div>
              <div style={{fontSize:'12px',color:'rgba(255,255,255,0.4)'}}>{galeri[lightbox].tur} · 2024</div>
            </div>
            {/* Kapat */}
            <button onClick={() => setLightbox(null)} style={{position:'absolute',top:'-40px',right:0,background:'transparent',border:'none',color:'rgba(255,255,255,0.6)',fontSize:'24px',cursor:'pointer',padding:'4px 8px',lineHeight:1}}>✕</button>
            {/* Önceki / Sonraki */}
            {lightbox > 0 && (
              <button onClick={e => {e.stopPropagation(); setLightbox(lightbox-1)}} style={{position:'absolute',left:'-52px',top:'50%',transform:'translateY(-50%)',background:'rgba(255,255,255,0.1)',border:'none',color:'#fff',fontSize:'20px',cursor:'pointer',padding:'12px 16px',lineHeight:1}}>‹</button>
            )}
            {lightbox < galeri.length-1 && (
              <button onClick={e => {e.stopPropagation(); setLightbox(lightbox+1)}} style={{position:'absolute',right:'-52px',top:'50%',transform:'translateY(-50%)',background:'rgba(255,255,255,0.1)',border:'none',color:'#fff',fontSize:'20px',cursor:'pointer',padding:'12px 16px',lineHeight:1}}>›</button>
            )}
          </div>
          {/* Sayı */}
          <div style={{position:'absolute',bottom:'24px',left:'50%',transform:'translateX(-50%)',color:'rgba(255,255,255,0.3)',fontSize:'12px',fontFamily:"'Pixelify Sans',monospace"}}>{lightbox+1} / {galeri.length}</div>
        </div>
      )}
    </>
  )
}
