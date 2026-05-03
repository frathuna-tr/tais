'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Profil() {
  const curRef = useRef<SVGSVGElement>(null)
  const mncRef = useRef<HTMLCanvasElement>(null)
  const bannerRef = useRef<HTMLCanvasElement>(null)
  const sparkRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const [consultActive, setConsultActive] = useState(true)
  const [notifOpen, setNotifOpen] = useState(false)
  const [todayOpen, setTodayOpen] = useState(false)
  const [todayIdx, setTodayIdx] = useState(0)
  const [counts, setCounts] = useState({ c1:0,c2:0,c3:0,c4:0,c5:0,c6:0 })
  const [avatarUrl, setAvatarUrl] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')

  const allData = [
    {color:'#00c48c',text:'Nature Medicine — 18 gün kaldı',title:'Nature Medicine başvuru hatırlatması',sub:'Son başvuru 18 gün · %94 uyum · Başvur →',time:'2 saat önce'},
    {color:'#f97316',text:'Preprint 892 görüntüleme',title:"Preprint'iniz 892. görüntülenmeye ulaştı",sub:'Multimodal Foundation Models · Yayına gönder →',time:'5 saat önce'},
    {color:'#60a5fa',text:'Ali Demir işbirliği ✓',title:'Prof. Ali Demir işbirliği talebini kabul etti',sub:'ODTÜ · Biyomedikal · Proje Oluştur →',time:'Dün'},
    {color:'#facc15',text:'TÜBİTAK 1001 çağrısı',title:'TÜBİTAK 1001 — Alanınızla %92 uyumlu',sub:'Son başvuru 28 gün · Başvur →',time:'3 saat önce'},
    {color:'#e53333',text:'Journal Med. Systems — 12 gün!',title:'Journal of Medical Systems son tarih yaklaşıyor',sub:'Son başvuru 12 gün · %76 uyum · Başvur →',time:'1 saat önce'},
    {color:'#00c48c',text:'CV otomatik güncellendi',title:"CV'niz güncellendi — 1 yeni yayın eklendi",sub:'Federated Learning makalesi eklendi →',time:'Bugün'},
  ]

  const getSlice = (idx: number) => allData.slice(idx, idx+3).concat(idx+3>allData.length ? allData.slice(0, Math.max(0, idx+3-allData.length)) : [])

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
      countUp('c1',47,1800); countUp('c2',7,1400); countUp('c3',3,800)
      countUp('c4',4,900); countUp('c5',8,1600); countUp('c6',3,700)
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
    const drawMn = () => {
      mc.clearRect(0,0,26,26)
      for (let i=0;i<mnp.length;i++) for (let j=i+1;j<mnp.length;j++) {
        const a=mnp[i],b=mnp[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy)
        if (d<16) { const f=Math.max(0,Math.sin(mt*0.9+mph[i][j])); mc.beginPath(); mc.moveTo(a.x,a.y); mc.lineTo(b.x,b.y); mc.strokeStyle='rgba(0,196,140,'+f*0.7*(1-d/16)+')'; mc.lineWidth=0.9; mc.stroke() }
      }
      mnp.forEach((p,i) => {
        const pulse=Math.sin(mt*1.5+i*0.7); const g=0.5+0.5*Math.sin(mt*0.8+i*1.2)
        mc.beginPath(); mc.arc(p.x,p.y,1.8+pulse*0.5,0,Math.PI*2)
        mc.fillStyle='rgba('+Math.round(240*(1-g))+','+Math.round(244*(1-g)+196*g)+','+Math.round(255*(1-g)+140*g)+','+(0.7+0.3*pulse)+')'
        mc.fill()
      })
      mt+=0.022; raf=requestAnimationFrame(drawMn)
    }
    drawMn()
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const bc = bannerRef.current; if (!bc) return
    const bx = bc.getContext('2d')!
    const rb = () => { bc.width=bc.offsetWidth||800; bc.height=bc.offsetHeight||120 }
    rb(); window.addEventListener('resize', rb)
    const bp: {x:number,y:number,vx:number,vy:number,r:number,ph:number}[] = []
    for (let i=0;i<35;i++) bp.push({x:Math.random()*1200,y:Math.random()*120,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.5+0.8,ph:Math.random()*Math.PI*2})
    const blp = bp.map(() => bp.map(() => Math.random()*Math.PI*2))
    let bt=0, raf: number
    const drawB = () => {
      bx.clearRect(0,0,bc.width,bc.height)
      bp.forEach(p => { p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>bc.width) p.vx*=-1; if(p.y<0||p.y>bc.height) p.vy*=-1 })
      for (let i=0;i<bp.length;i++) for (let j=i+1;j<bp.length;j++) {
        const a=bp[i],b=bp[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy)
        if (d<90) { const f=Math.max(0,Math.sin(bt*0.7+blp[i][j])); bx.beginPath(); bx.moveTo(a.x,a.y); bx.lineTo(b.x,b.y); bx.strokeStyle='rgba(0,196,140,'+(f*(1-d/90)*0.45)+')'; bx.lineWidth=0.8; bx.stroke() }
      }
      bp.forEach(p => { const pulse=Math.sin(bt*1.3+p.ph); bx.beginPath(); bx.arc(p.x,p.y,p.r+pulse*.4,0,Math.PI*2); bx.fillStyle='rgba(0,196,140,'+(0.35+0.15*pulse)+')'; bx.fill() })
      bt+=0.013; raf=requestAnimationFrame(drawB)
    }
    drawB()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', rb) }
  }, [])

  useEffect(() => {
    const sc = sparkRef.current; if (!sc) return
    sc.width = sc.offsetWidth || 400
    const sx = sc.getContext('2d')!
    const data = [2,3,4,5,3,6,8,7,9,6,10,47]
    const max = Math.max(...data)
    const W = sc.width, H = 48
    const step = W/(data.length-1)
    const grad = sx.createLinearGradient(0,0,0,H)
    grad.addColorStop(0,'rgba(0,196,140,0.3)'); grad.addColorStop(1,'rgba(0,196,140,0)')
    sx.beginPath(); sx.moveTo(0,H-(data[0]/max)*H*0.85-4)
    data.forEach((v,i) => { if(i>0) sx.lineTo(i*step,H-(v/max)*H*0.85-4) })
    sx.lineTo(W,H); sx.lineTo(0,H); sx.closePath(); sx.fillStyle=grad; sx.fill()
    sx.beginPath(); sx.moveTo(0,H-(data[0]/max)*H*0.85-4)
    data.forEach((v,i) => { if(i>0) sx.lineTo(i*step,H-(v/max)*H*0.85-4) })
    sx.strokeStyle='#00c48c'; sx.lineWidth=2; sx.stroke()
    data.forEach((v,i) => { sx.beginPath(); sx.arc(i*step,H-(v/max)*H*0.85-4,3,0,Math.PI*2); sx.fillStyle='#fff'; sx.fill(); sx.strokeStyle='#00c48c'; sx.lineWidth=2; sx.stroke() })
  }, [])

  const sliceData = getSlice(todayIdx)

  const iS = { width:'22px', height:'22px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 as const, background:'rgba(255,255,255,0.07)', borderRadius:'2px', padding:'4px' }

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
      { label:'Mesajlar', href:'/mesajlar', badge:'7', badgeRed:true, icon:<svg viewBox="0 0 12 12" fill="rgba(255,255,255,0.45)" width="14" height="14"><rect x="1" y="2" width="10" height="7"/><rect x="1" y="9" width="2" height="2"/><rect x="2" y="8" width="8" height="1"/></svg> },
    ]},
    { label:'Paydaşlar', items: [
      { label:'Danışmanlık', href:'/danisman', icon:<svg viewBox="0 0 12 12" fill="#22d3ee" width="14" height="14"><rect x="1" y="4" width="10" height="7"/><rect x="4" y="2" width="4" height="2"/><rect x="5" y="6" width="2" height="3"/></svg> },
      { label:'Firmalar', href:'/firmalar', icon:<svg viewBox="0 0 12 12" fill="#f43f5e" width="14" height="14"><rect x="2" y="1" width="8" height="10"/><rect x="4" y="3" width="1" height="1"/><rect x="7" y="3" width="1" height="1"/><rect x="4" y="5" width="1" height="1"/><rect x="7" y="5" width="1" height="1"/><rect x="5" y="8" width="2" height="3"/></svg> },
    ]},
    { label:'Profil', items: [
      { label:'Profilim', href:'/profil', icon:<svg viewBox="0 0 12 12" fill="#94a3b8" width="14" height="14"><rect x="4" y="1" width="4" height="4"/><rect x="3" y="2" width="1" height="2"/><rect x="8" y="2" width="1" height="2"/><rect x="1" y="8" width="10" height="3"/><rect x="2" y="7" width="2" height="1"/><rect x="8" y="7" width="2" height="1"/></svg> },
    ]},
  ]

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; cursor:none!important; }
        :root { --g:#00c48c; --ink:#0a0a0a; --gray:#f2f2f0; --white:#fff; --border:rgba(0,0,0,0.07); }
        body { font-family:'DM Sans',sans-serif; background:var(--gray); color:var(--ink); height:100vh; overflow:hidden; }
        .nav-item { display:flex; align-items:center; gap:10px; padding:8px 18px; font-size:13px; color:rgba(255,255,255,0.5); transition:all 0.2s; border-left:2px solid transparent; cursor:pointer; }
        .nav-item:hover { color:#fff; background:rgba(255,255,255,0.04); }
        .nav-item.active { color:var(--g); border-left-color:var(--g); background:rgba(0,196,140,0.07); font-weight:600; }
        .panel { background:var(--white); border:1px solid var(--border); padding:16px 18px; }
        .panel-hd { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
        .panel-t { font-family:'Pixelify Sans',monospace; font-size:13px; font-weight:700; }
        .panel-a { font-size:11px; color:var(--g); font-weight:600; cursor:pointer; }
        .pub-item { padding:10px 0; border-bottom:1px solid rgba(0,0,0,0.04); }
        .pub-item:last-child { border-bottom:none; }
        .skill { font-size:10px; padding:4px 10px; border:1px solid var(--border); color:rgba(0,0,0,0.55); background:var(--gray); transition:all 0.2s; cursor:pointer; }
        .skill:hover { border-color:var(--g); color:var(--g); }
        .tbtn { border:none; padding:8px 16px; font-size:12px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.2s; }
        .tbtn.dark { background:var(--ink); color:#fff; }
        .tbtn.dark:hover { background:var(--g); color:var(--ink); }
        .tbtn.outline { background:transparent; color:var(--ink); border:1px solid var(--border); }
        .tbtn.outline:hover { border-color:var(--g); color:var(--g); }
        .nd-item { display:flex; align-items:flex-start; gap:8px; padding:10px 16px; border-bottom:1px solid rgba(0,0,0,0.04); cursor:pointer; }
        .nd-item:hover { background:#f8fffe; }
        .nd-item.new { background:linear-gradient(90deg,rgba(0,196,140,0.15),transparent); }
        .bt-item { font-size:10px; color:rgba(255,255,255,0.75); display:flex; align-items:center; gap:4px; white-space:nowrap; padding:2px 6px; transition:all 0.2s; cursor:pointer; }
        .bt-item:hover { color:#fff; background:rgba(255,255,255,0.1); }
        .tp-item { display:flex; align-items:center; gap:12px; padding:10px 24px; border-bottom:1px solid rgba(255,255,255,0.05); cursor:pointer; transition:background 0.15s; }
        .tp-item:hover { background:rgba(255,255,255,0.05); }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <svg ref={curRef} style={{position:'fixed',top:0,left:0,zIndex:9999,pointerEvents:'none'}} width="20" height="20" viewBox="0 0 10 10">
        <rect x="0" y="0" width="2" height="2" fill="#00c48c"/><rect x="0" y="2" width="2" height="2" fill="#00c48c"/>
        <rect x="0" y="4" width="2" height="2" fill="#00c48c"/><rect x="0" y="6" width="2" height="2" fill="#00c48c"/>
        <rect x="0" y="8" width="2" height="2" fill="#00c48c"/><rect x="2" y="2" width="2" height="2" fill="#00c48c"/>
        <rect x="4" y="4" width="2" height="2" fill="#00c48c"/><rect x="4" y="6" width="2" height="2" fill="#00c48c"/>
        <rect x="6" y="6" width="2" height="2" fill="#00c48c"/><rect x="6" y="8" width="2" height="2" fill="#00c48c"/>
      </svg>

      <div style={{display:'grid',gridTemplateColumns:'220px 1fr',height:'100vh'}}>

        <aside style={{background:'linear-gradient(180deg,#0d1117 0%,#0a0f0c 100%)',display:'flex',flexDirection:'column',height:'100vh',overflowY:'auto',borderRight:'1px solid rgba(0,196,140,0.15)'}}>
          <div style={{padding:'16px 20px 14px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'3px'}}>
              <canvas ref={mncRef} width="26" height="26" style={{flexShrink:0}}/>
              <span style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'21px',fontWeight:700,background:'linear-gradient(90deg,#00c48c,#fff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>tais.tr</span>
            </div>
            <div style={{fontSize:'9px',color:'rgba(255,255,255,0.2)',letterSpacing:'1px'}}>Akademik Ekosistem</div>
          </div>
          {navSections.map((section, si) => (
            <div key={si} style={{padding:'10px 0'}}>
              <div style={{fontSize:'9px',color:'rgba(0,196,140,0.5)',letterSpacing:'2px',textTransform:'uppercase',padding:'0 18px',marginBottom:'6px'}}>{section.label}</div>
              {section.items.map((item, i) => {
                const isActive = item.href === '/profil'
                return (
                  <div key={i} onClick={() => router.push(item.href)}
                    style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 18px',fontSize:'13px',color:isActive?'#00c48c':'rgba(255,255,255,0.55)',borderLeft:isActive?'2px solid #00c48c':'2px solid transparent',background:isActive?'rgba(0,196,140,0.08)':'transparent',fontWeight:isActive?600:400,cursor:'pointer',transition:'all 0.2s'}}
                    onMouseEnter={e=>{if(!isActive){const el=e.currentTarget as HTMLElement;el.style.color='#fff';el.style.background='rgba(255,255,255,0.05)'}}}
                    onMouseLeave={e=>{if(!isActive){const el=e.currentTarget as HTMLElement;el.style.color='rgba(255,255,255,0.55)';el.style.background='transparent'}}}>
                    <span style={iS}>{item.icon}</span>
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
                {avatarUrl ? <img src={avatarUrl} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : 'AY'}
              </div>
              <div>
                <div style={{fontSize:'12px',color:'rgba(255,255,255,0.8)',fontWeight:500}}>Dr. Ayşe Yılmaz</div>
                <div style={{fontSize:'9px',color:'rgba(255,255,255,0.3)',marginTop:'2px'}}>Doç. Dr. · İTÜ</div>
              </div>
            </div>
          </div>
        </aside>

        <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden'}}>

          <div style={{background:'#fff',borderBottom:'1px solid rgba(0,0,0,0.07)',padding:'0 32px',height:'52px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
            <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'16px',fontWeight:700}}>Profilim</div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',position:'relative'}}>
              <button className="tbtn outline">CV İndir</button>
              <button className="tbtn dark" onClick={() => router.push('/profil/duzenle')}>Düzenle</button>
              <div onClick={() => setNotifOpen(p => !p)} style={{width:'32px',height:'32px',background:'#f2f2f0',border:'1px solid rgba(0,0,0,0.07)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',position:'relative',borderRadius:'2px'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <span style={{position:'absolute',top:'-5px',right:'-5px',background:'#e53333',color:'#fff',fontSize:'9px',fontWeight:800,width:'16px',height:'16px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid #fff'}}>7</span>
              </div>
              {notifOpen && (
                <div style={{position:'absolute',top:'46px',right:0,width:'280px',background:'#fff',border:'1px solid rgba(0,0,0,0.07)',boxShadow:'0 8px 32px rgba(0,0,0,0.12)',zIndex:999,animation:'fadeIn 0.15s ease'}}>
                  <div style={{padding:'12px 16px',borderBottom:'1px solid rgba(0,0,0,0.07)',display:'flex',justifyContent:'space-between'}}>
                    <span style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'13px',fontWeight:700}}>Bildirimler</span>
                    <span style={{fontSize:'10px',color:'#00c48c',fontWeight:600}}>7 okunmamış</span>
                  </div>
                  {[
                    {text:'<strong>Nature Medicine</strong> — <span style="color:#e53;font-weight:600">18 gün</span> kaldı!',time:'2 saat önce',isNew:true},
                    {text:'<strong>TÜBİTAK 1001</strong> — %92 uyumlu çağrı',time:'5 saat önce',isNew:true},
                    {text:'<strong>Prof. Ali Demir</strong> işbirliği kabul etti',time:'Dün',isNew:true},
                    {text:'Preprint <strong>892. görüntülenmeye</strong> ulaştı',time:'2 gün önce',isNew:false},
                  ].map((n,i) => (
                    <div key={i} className={'nd-item'+(n.isNew?' new':'')}>
                      <div style={{width:'6px',height:'6px',borderRadius:'50%',background:n.isNew?'#00c48c':'rgba(0,0,0,0.15)',flexShrink:0,marginTop:'5px'}}/>
                      <div>
                        <div style={{fontSize:'11px',lineHeight:1.5}} dangerouslySetInnerHTML={{__html:n.text}}/>
                        <div style={{fontSize:'10px',color:'rgba(0,0,0,0.3)',marginTop:'2px'}}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{padding:'10px 16px',borderTop:'1px solid rgba(0,0,0,0.07)',fontSize:'11px',color:'#00c48c',fontWeight:600,cursor:'pointer'}}>Tümünü gör →</div>
                </div>
              )}
            </div>
          </div>

          <div style={{flex:1,overflowY:'auto',padding:'20px 28px',display:'flex',flexDirection:'column',gap:'14px'}}>

            <div style={{background:'#fff',border:'1px solid rgba(0,0,0,0.07)'}}>
              <div onClick={() => setTodayOpen(p => !p)} style={{height:'120px',position:'relative',background:'#0a0a0a',overflow:'hidden',cursor:'pointer'}}>
                <canvas ref={bannerRef} style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:bannerUrl?0.15:1,transition:'opacity 0.3s'}}/>
                {bannerUrl && <div style={{position:'absolute',inset:0,backgroundImage:'url('+bannerUrl+')',backgroundSize:'cover',backgroundPosition:'center'}}/>}
                <div style={{position:'absolute',bottom:0,left:0,right:0,height:'70px',background:'linear-gradient(to top,rgba(0,0,0,0.85),transparent)',pointerEvents:'none'}}/>
                <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'8px 24px',zIndex:2}}>
                  <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                    <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'10px',color:'#00c48c',fontWeight:700,letterSpacing:'1px',whiteSpace:'nowrap',flexShrink:0}}>◉ Bugün</div>
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
              </div>

              {todayOpen && (
                <div style={{background:'rgba(0,0,0,0.92)',borderBottom:'2px solid rgba(0,196,140,0.2)'}}>
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

              <div style={{padding:'0 24px 20px',display:'flex',alignItems:'flex-end',gap:'16px'}}>
                <div style={{position:'relative',flexShrink:0,marginTop:'-38px',zIndex:2}}>
                  <label style={{width:'72px',height:'72px',background:avatarUrl?'transparent':'#00c48c',borderRadius:'4px',border:'4px solid #fff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Pixelify Sans',monospace",fontSize:'20px',fontWeight:700,color:'#0a0a0a',overflow:'hidden',cursor:'pointer',position:'relative'}}>
                    {avatarUrl ? <img src={avatarUrl} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : 'AY'}
                    <input type="file" accept="image/*" style={{display:'none'}} onChange={e => { const f=e.target.files?.[0]; if(f) setAvatarUrl(URL.createObjectURL(f)) }}/>
                  </label>
                  <div style={{position:'absolute',bottom:'2px',right:'2px',width:'11px',height:'11px',background:'#00c48c',borderRadius:'50%',border:'2px solid #fff',zIndex:3}}/>
                </div>
                <div style={{flex:1,paddingTop:'8px',minWidth:0}}>
                  <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'18px',fontWeight:700,color:'#0a0a0a',marginBottom:'3px'}}>Dr. Ayşe Yılmaz</div>
                  <div style={{fontSize:'12px',color:'rgba(0,0,0,0.45)',marginBottom:'2px'}}>Doçent Doktor · Biyomedikal Mühendislik</div>
                  <div style={{fontSize:'12px',color:'#00c48c',fontWeight:600,marginBottom:'8px'}}>İstanbul Teknik Üniversitesi</div>
                  <div style={{display:'flex',gap:'5px',flexWrap:'wrap'}}>
                    {['Yapay Zeka','Derin Öğrenme','Kanser Tespiti','Biyoinformatik','TÜBİTAK'].map((t,i) => (
                      <span key={i} style={{fontSize:'10px',padding:'3px 8px',border:'1px solid rgba(0,0,0,0.07)',color:'rgba(0,0,0,0.5)',background:'#f2f2f0'}}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{display:'flex',marginLeft:'auto',paddingLeft:'20px',borderLeft:'1px solid rgba(0,0,0,0.07)',flexShrink:0,alignSelf:'flex-end',paddingBottom:'4px'}}>
                  {[{n:counts.c1,l:'Atıf',c:'#00c48c'},{n:counts.c2,l:'Yayın',c:'#0a0a0a'},{n:counts.c3,l:'Preprint',c:'#0a0a0a'},{n:counts.c4,l:'İş Birliği',c:'#0a0a0a'},{n:counts.c5,l:'H-index',c:'#f97316'},{n:counts.c6,l:'Proje',c:'#60a5fa'}].map((s,i) => (
                    <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'0 18px',borderRight:i<5?'1px solid rgba(0,0,0,0.07)':'none'}}>
                      <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'20px',fontWeight:700,color:s.c,lineHeight:1}}>{s.n}</div>
                      <div style={{fontSize:'9px',color:'rgba(0,0,0,0.3)',letterSpacing:'1px',textTransform:'uppercase',marginTop:'2px',whiteSpace:'nowrap'}}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'14px'}}>
              <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                <div className="panel">
                  <div className="panel-hd">
                    <div className="panel-t">Atıf Trendi</div>
                    <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'12px',fontWeight:700,color:'rgba(0,0,0,0.3)'}}>2025</div>
                  </div>
                  <canvas ref={sparkRef} height={52} style={{width:'100%',display:'block'}}/>
                  <div style={{display:'flex',justifyContent:'space-between',marginTop:'4px'}}>
                    {['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'].map(m => (
                      <span key={m} style={{fontSize:'9px',color:'rgba(0,0,0,0.2)'}}>{m}</span>
                    ))}
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-hd"><div className="panel-t">Yayınlar</div><div className="panel-a">Tümünü Gör →</div></div>
                  {[
                    {title:'Deep Learning-Based Early Detection of Pancreatic Cancer Using Multi-Modal Imaging Data',j:'Nature Medicine',y:'2024',c:'47 atıf',q:'Q1',if:'IF: 58.7'},
                    {title:'Transformer-Based Architecture for Medical Image Segmentation in Clinical Settings',j:'AI in Medicine',y:'2024',c:'31 atıf',q:'Q1',if:'IF: 7.0'},
                    {title:'Federated Learning Framework for Privacy-Preserving Healthcare Analytics',j:'Computers in Biology',y:'2023',c:'89 atıf',q:'Q1',if:'IF: 7.7'},
                  ].map((p,i) => (
                    <div key={i} className="pub-item">
                      <div style={{fontSize:'12px',fontWeight:500,lineHeight:1.4,marginBottom:'4px'}}>{p.title}</div>
                      <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
                        <span style={{fontSize:'11px',color:'#00c48c',fontWeight:600}}>{p.j}</span>
                        <span style={{fontSize:'11px',color:'rgba(0,0,0,0.3)'}}>{p.y}</span>
                        <span style={{fontSize:'11px',color:'rgba(0,0,0,0.3)'}}>↗ {p.c}</span>
                        <span style={{background:'rgba(0,196,140,0.1)',color:'#008a64',fontSize:'9px',padding:'2px 6px',fontWeight:700}}>{p.q}</span>
                        <span style={{background:'rgba(74,158,255,0.1)',color:'#2563eb',fontSize:'9px',padding:'2px 6px',fontWeight:700}}>{p.if}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
                  <div className="panel" style={{margin:0}}>
                    <div className="panel-hd"><div className="panel-t">Preprint Arşivi</div></div>
                    {[
                      {title:'Multimodal Foundation Models for Rare Disease Diagnosis',hash:'SHA: a3f9c2d1',date:'Mar 2025',views:'892 görüntüleme'},
                      {title:'Açık Kaynak Tıbbi Görüntüleme Veri Seti: TAİS-Med-2025',hash:'SHA: b7e4a9f2',date:'Oca 2025',views:'1.240 görüntüleme'},
                    ].map((p,i) => (
                      <div key={i} style={{padding:'9px 0',borderBottom:'1px solid rgba(0,0,0,0.04)'}}>
                        <div style={{fontSize:'12px',fontWeight:500,marginBottom:'3px'}}>{p.title}</div>
                        <div style={{display:'flex',gap:'8px',fontSize:'10px',color:'rgba(0,0,0,0.3)'}}>
                          <span style={{color:'#00c48c',fontFamily:"'Pixelify Sans',monospace",fontSize:'9px'}}>{p.hash}</span>
                          <span>· {p.date}</span><span>· {p.views}</span>
                        </div>
                      </div>
                    ))}
                    <div onClick={() => router.push('/preprint?tab=yukle')} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',marginTop:'12px',background:'#0a0a0a',color:'#fff',padding:'8px',fontSize:'11px',fontWeight:600,cursor:'pointer'}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      Preprint Yükle
                    </div>
                  </div>
                  <div className="panel" style={{margin:0}}>
                    <div className="panel-hd"><div className="panel-t">Aktif Projeler</div><div className="panel-a">Tümünü Gör →</div></div>
                    <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                      {[
                        {name:'Kanser Erken Tespit',sub:'TÜBİTAK · 3 üye',pct:'%65',color:'#00c48c',bg:'rgba(0,196,140,0.1)',tc:'#008a64'},
                        {name:'Federated Learning',sub:'İş Birliği · 2 üye',pct:'%30',color:'#60a5fa',bg:'rgba(74,158,255,0.1)',tc:'#2563eb'},
                        {name:'TAİS-Med Veri Seti',sub:'Solo · Açık Kaynak',pct:'%90',color:'#f97316',bg:'rgba(249,115,22,0.1)',tc:'#c2410c'},
                      ].map((p,i) => (
                        <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 0',borderBottom:i<2?'1px solid rgba(0,0,0,0.04)':'none'}}>
                          <div style={{width:'6px',height:'6px',borderRadius:'50%',background:p.color,flexShrink:0}}/>
                          <div style={{flex:1}}>
                            <div style={{fontSize:'12px',fontWeight:500}}>{p.name}</div>
                            <div style={{fontSize:'10px',color:'rgba(0,0,0,0.35)',marginTop:'1px'}}>{p.sub}</div>
                          </div>
                          <div style={{fontSize:'10px',background:p.bg,color:p.tc,padding:'2px 8px',fontWeight:600}}>{p.pct}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                <div className="panel">
                  <div className="panel-hd"><div className="panel-t">Akademik Ağ</div><div className="panel-a" onClick={() => router.push('/ag')}>Tümünü Gör →</div></div>
                  <div style={{fontSize:'10px',color:'rgba(0,0,0,0.3)',marginBottom:'10px'}}>5 bağlantı · 3 aktif iş birliği</div>
                  <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                    {[{av:'MD',c:'#3b82f6',n:'Prof. Mehmet'},{av:'SA',c:'#8b5cf6',n:'Doç. Selin'},{av:'KY',c:'#0ea5e9',n:'Prof. Kemal'},{av:'AK',c:'#f97316',n:'Dr. Ali'},{av:'ZK',c:'#10b981',n:'Dr. Zeynep'}].map((p,i) => (
                      <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'3px',cursor:'pointer'}}>
                        <div style={{width:'34px',height:'34px',borderRadius:'50%',background:p.c,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700,color:'#fff',fontFamily:"'Pixelify Sans',monospace"}}>{p.av}</div>
                        <div style={{fontSize:'9px',color:'rgba(0,0,0,0.35)',textAlign:'center',maxWidth:'44px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.n}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-hd"><div className="panel-t">Eğitim</div></div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px'}}>
                    {[{deg:'Doktora',uni:'İTÜ',y:'2018–2023'},{deg:'Yüksek Lisans',uni:'ODTÜ',y:'2016–2018'},{deg:'Lisans',uni:'Hacettepe',y:'2012–2016'}].map((e,i) => (
                      <div key={i} style={{border:'1px solid rgba(0,0,0,0.07)',padding:'10px',textAlign:'center'}}>
                        <div style={{fontSize:'11px',fontWeight:600,color:'#0a0a0a',lineHeight:1.3}}>{e.deg}</div>
                        <div style={{fontSize:'10px',color:'rgba(0,0,0,0.4)',marginTop:'2px'}}>{e.uni}</div>
                        <div style={{fontSize:'9px',color:'rgba(0,0,0,0.25)',marginTop:'2px'}}>{e.y}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-hd">
                    <div className="panel-t">Danışmanlık</div>
                    <div onClick={() => setConsultActive(p => !p)} style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer'}}>
                      <div style={{width:'36px',height:'20px',background:consultActive?'#00c48c':'rgba(0,0,0,0.15)',borderRadius:'10px',position:'relative',transition:'background 0.2s'}}>
                        <div style={{position:'absolute',top:'2px',left:consultActive?'18px':'2px',width:'16px',height:'16px',background:'#fff',borderRadius:'50%',transition:'left 0.2s',boxShadow:'0 1px 4px rgba(0,0,0,0.2)'}}/>
                      </div>
                      <span style={{fontSize:'11px',fontWeight:600,color:consultActive?'#00c48c':'rgba(0,0,0,0.3)'}}>{consultActive?'Aktif':'Kapalı'}</span>
                    </div>
                  </div>
                  {consultActive ? (
                    <div>
                      <div style={{fontSize:'12px',color:'rgba(0,0,0,0.5)',lineHeight:1.7,marginBottom:'10px'}}>Şirketler danışmanlık talebi gönderebilir. Profilinizde <span style={{color:'#00c48c',fontWeight:600}}>Danışman</span> rozeti görünür.</div>
                      <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                        {['YZ & Makine Öğrenimi','Tıbbi Görüntüleme','Veri Analizi'].map((t,i) => (
                          <span key={i} style={{fontSize:'10px',padding:'3px 9px',background:'rgba(0,196,140,0.1)',color:'#008a64',fontWeight:600}}>{t}</span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{fontSize:'12px',color:'rgba(0,0,0,0.35)'}}>Danışmanlık kapalı — şirketler talep gönderemiyor.</div>
                  )}
                </div>
                <div className="panel">
                  <div className="panel-hd"><div className="panel-t">Uzmanlık Alanları</div></div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'5px'}}>
                    {['Derin Öğrenme','Tıbbi Görüntüleme','PyTorch','Federated Learning','NLP','Computer Vision','Python','CUDA','Biyoinformatik','TÜBİTAK 1001'].map((s,i) => (
                      <span key={i} className="skill">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
