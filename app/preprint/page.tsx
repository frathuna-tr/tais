'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const ikonStyle = { width:'22px', height:'22px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background:'rgba(255,255,255,0.07)', borderRadius:'2px', padding:'4px' } as const

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

interface Preprint {
  id: number
  baslik: string
  alan: string
  tarih: string
  versiyon: string
  hash: string
  goruntulenme: number
  indirme: number
  atif: number
  durum: 'Yayında' | 'Revizyon' | 'Geri Çekildi'
}

export default function Preprint() {
  const curRef = useRef<SVGSVGElement>(null)
  const mncRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const searchParams = useSearchParams()
  const [aktifTab, setAktifTab] = useState(() => searchParams.get('tab') || 'arkasivm')
  const [acikHash, setAcikHash] = useState<number|null>(null)
  const [dosyaAdi, setDosyaAdi] = useState('')
  const [yukleniyor, setYukleniyor] = useState(false)
  const [yuklendi, setYuklendi] = useState(false)

  const preprintler: Preprint[] = [
    { id:1, baslik:'Multimodal Federated Learning for Distributed Hospital Networks', alan:'Tıbbi Görüntüleme · YZ', tarih:'Şub 2025', versiyon:'v2', hash:'c8f2a1e4d7b3a9f2e5c1d8b4a6f3e2d9', goruntulenme:892, indirme:234, atif:12, durum:'Yayında' },
    { id:2, baslik:'Benchmark Dataset for Medical Image Segmentation Tasks', alan:'Veri Seti · Biyomedikal', tarih:'Oca 2025', versiyon:'v1', hash:'a4d9e2b7f1c3a8d5b2e9f4c6a1d3e7b2', goruntulenme:1240, indirme:567, atif:28, durum:'Yayında' },
  ]

  const durumRenk: Record<string,string> = { 'Yayında':'#00c48c', 'Revizyon':'#f59e0b', 'Geri Çekildi':'#ef4444' }

  const yukle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setDosyaAdi(f.name)
    setYukleniyor(true)
    setTimeout(() => { setYukleniyor(false); setYuklendi(true) }, 2000)
  }

  useEffect(() => {
    const move = (e: MouseEvent) => { if (curRef.current) { curRef.current.style.left=(e.clientX-2)+'px'; curRef.current.style.top=(e.clientY-2)+'px' } }
    document.addEventListener('mousemove', move)
    return () => document.removeEventListener('mousemove', move)
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

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; cursor:none!important; }
        body { font-family:'DM Sans',sans-serif; background:#f2f2f0; color:#0a0a0a; height:100vh; overflow:hidden; }
        .nav-item { display:flex; align-items:center; gap:10px; padding:9px 18px; font-size:13px; color:rgba(255,255,255,0.55); transition:all 0.2s; border-left:2px solid transparent; cursor:pointer; }
        .nav-item:hover { color:#fff; background:rgba(255,255,255,0.05); }
        .nav-item.active { color:#00c48c; border-left-color:#00c48c; background:rgba(0,196,140,0.08); font-weight:600; }
        .tab-btn { padding:10px 20px; font-size:13px; font-weight:500; font-family:'DM Sans',sans-serif; border:none; background:transparent; color:rgba(0,0,0,0.4); border-bottom:2px solid transparent; cursor:pointer; transition:all 0.2s; }
        .tab-btn:hover { color:#0a0a0a; }
        .tab-btn.active { color:#0a0a0a; border-bottom-color:#fb923c; font-weight:600; }
        .pp-kart { background:#fff; border:1px solid rgba(0,0,0,0.07); padding:20px; transition:all 0.2s; }
        .pp-kart:hover { border-color:rgba(251,146,60,0.3); box-shadow:0 2px 12px rgba(0,0,0,0.05); }
        .stat-chip { display:flex; align-items:center; gap:5px; font-size:11px; color:rgba(0,0,0,0.45); }
        .btn-p { background:#fb923c; color:#fff; border:none; padding:8px 18px; font-size:12px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.2s; }
        .btn-p:hover { background:#ea7c28; }
        .btn-o { background:transparent; color:rgba(0,0,0,0.5); border:1px solid rgba(0,0,0,0.1); padding:8px 14px; font-size:12px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.2s; }
        .btn-o:hover { border-color:#0a0a0a; color:#0a0a0a; }
        .upload-zone { border:2px dashed rgba(251,146,60,0.4); padding:32px; text-align:center; cursor:pointer; transition:all 0.2s; }
        .upload-zone:hover { border-color:#fb923c; background:rgba(251,146,60,0.03); }
        .hash-box { background:#0a0a0a; padding:14px 16px; margin-top:8px; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      <svg ref={curRef} style={{position:'fixed',top:0,left:0,zIndex:9999,pointerEvents:'none'}} width="20" height="20" viewBox="0 0 10 10">
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
                const isActive = '/preprint' === item.href
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
              <div style={{width:'34px',height:'34px',background:'#00c48c',borderRadius:'2px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,color:'#0a0a0a',fontFamily:"'Pixelify Sans',monospace"}}>AY</div>
              <div>
                <div style={{fontSize:'12px',color:'rgba(255,255,255,0.8)',fontWeight:500}}>Dr. Ayşe Yılmaz</div>
                <div style={{fontSize:'9px',color:'rgba(255,255,255,0.3)',marginTop:'2px'}}>Doç. Dr. · İTÜ</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden'}}>

          {/* HEADER */}
          <div style={{background:'linear-gradient(90deg,#fb923c 0%,#fb923c88 50%,#fb923c15 100%)',padding:'14px 28px',display:'flex',alignItems:'center',gap:'16px',flexShrink:0,borderBottom:'1px solid rgba(0,0,0,0.07)'}}>
            <div>
              <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'18px',fontWeight:700,color:'#0a0a0a'}}>📄 Preprint Arşivi</div>
              <div style={{fontSize:'11px',color:'rgba(0,0,0,0.5)',marginTop:'3px'}}>Makalelerinizi yayınlayın, SHA-256 hash ile güvence altına alın</div>
            </div>
            <div style={{marginLeft:'auto',display:'flex',gap:'8px'}}>
              <button className="btn-p" onClick={() => setAktifTab('yukle')}>+ Yeni Preprint</button>
            </div>
          </div>

          {/* İSTATİSTİKLER */}
          <div style={{background:'#fff',borderBottom:'1px solid rgba(0,0,0,0.07)',padding:'12px 28px',display:'flex',gap:'0',flexShrink:0}}>
            {[
              {n:preprintler.length,l:'Preprint',c:'#fb923c'},
              {n:preprintler.reduce((s,p)=>s+p.goruntulenme,0).toLocaleString('tr-TR'),l:'Görüntülenme',c:'#3b82f6'},
              {n:preprintler.reduce((s,p)=>s+p.indirme,0),l:'İndirme',c:'#00c48c'},
              {n:preprintler.reduce((s,p)=>s+p.atif,0),l:'Atıf',c:'#f59e0b'},
            ].map((s,i) => (
              <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'0 24px',borderRight:i<3?'1px solid rgba(0,0,0,0.07)':'none'}}>
                <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'20px',fontWeight:700,color:s.c,lineHeight:1}}>{s.n}</div>
                <div style={{fontSize:'10px',color:'rgba(0,0,0,0.35)',marginTop:'2px',textTransform:'uppercase',letterSpacing:'0.5px'}}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div style={{background:'#fff',borderBottom:'1px solid rgba(0,0,0,0.07)',display:'flex',flexShrink:0}}>
            <button className={`tab-btn${aktifTab==='arkasivm'?' active':''}`} onClick={() => setAktifTab('arkasivm')}>Arşivim</button>
            <button className={`tab-btn${aktifTab==='yukle'?' active':''}`} onClick={() => setAktifTab('yukle')}>Preprint Yükle</button>
          </div>

          {/* İÇERİK */}
          <div style={{flex:1,overflowY:'auto',padding:'20px 28px'}}>

            {/* ARŞİV */}
            {aktifTab === 'arkasivm' && (
              <div style={{display:'flex',flexDirection:'column',gap:'12px',animation:'fadeIn 0.3s ease'}}>
                {preprintler.map(pp => (
                  <div key={pp.id} className="pp-kart">
                    <div style={{display:'flex',alignItems:'flex-start',gap:'16px'}}>
                      <div style={{width:'48px',height:'48px',background:'rgba(251,146,60,0.1)',border:'1px solid rgba(251,146,60,0.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,borderRadius:'2px'}}>
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fb923c" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px',flexWrap:'wrap'}}>
                          <div style={{fontSize:'14px',fontWeight:700,color:'#0a0a0a'}}>{pp.baslik}</div>
                          <span style={{background:durumRenk[pp.durum]+'18',color:durumRenk[pp.durum],fontSize:'10px',padding:'2px 8px',fontWeight:700,flexShrink:0}}>{pp.durum}</span>
                          <span style={{background:'rgba(251,146,60,0.1)',color:'#fb923c',fontSize:'10px',padding:'2px 8px',fontWeight:700,fontFamily:"'Pixelify Sans',monospace",flexShrink:0}}>{pp.versiyon}</span>
                        </div>
                        <div style={{fontSize:'12px',color:'rgba(0,0,0,0.4)',marginBottom:'10px'}}>{pp.alan} · {pp.tarih}</div>

                        {/* HASH */}
                        <div style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'#f2f2f0',border:'1px solid rgba(0,0,0,0.07)',padding:'5px 12px',marginBottom:'10px',cursor:'pointer'}}
                          onClick={() => setAcikHash(acikHash===pp.id?null:pp.id)}>
                          <svg viewBox="0 0 12 12" width="10" height="10" fill="#00c48c"><rect x="1" y="1" width="10" height="10" rx="1"/><rect x="3" y="3" width="6" height="1"/><rect x="3" y="5" width="6" height="1"/><rect x="3" y="7" width="4" height="1"/></svg>
                          <span style={{fontSize:'9px',color:'rgba(0,0,0,0.4)',textTransform:'uppercase',letterSpacing:'0.5px'}}>SHA-256</span>
                          <span style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'11px',color:'#00c48c'}}>{pp.hash.slice(0,8)}...{pp.hash.slice(-4)}</span>
                          <span style={{fontSize:'10px',color:'rgba(0,0,0,0.3)'}}>{acikHash===pp.id?'▲':'▼'}</span>
                        </div>

                        {acikHash === pp.id && (
                          <div className="hash-box" style={{marginBottom:'10px',animation:'fadeIn 0.2s ease'}}>
                            <div style={{fontSize:'9px',color:'rgba(255,255,255,0.4)',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'8px'}}>Kriptografik Hash Değerleri</div>
                            {[
                              {type:'SHA-256',val:pp.hash},
                              {type:'MD5',val:'f3a9c2d1e8b4a6f5c2d9e7b3a1f4c8d5'},
                            ].map((h,i) => (
                              <div key={i} style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}}>
                                <span style={{fontSize:'9px',fontWeight:700,color:'rgba(255,255,255,0.4)',width:'50px',flexShrink:0,fontFamily:"'Pixelify Sans',monospace"}}>{h.type}</span>
                                <span style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'10px',color:'#00c48c',flex:1,wordBreak:'break-all'}}>{h.val}</span>
                                <button onClick={() => navigator.clipboard.writeText(h.val)} style={{background:'rgba(255,255,255,0.08)',border:'none',color:'rgba(255,255,255,0.5)',fontSize:'10px',fontWeight:600,padding:'3px 8px',cursor:'pointer',fontFamily:'DM Sans,sans-serif',transition:'all 0.2s',flexShrink:0}}>Kopyala</button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* İSTATİSTİKLER */}
                        <div style={{display:'flex',gap:'16px',marginBottom:'12px'}}>
                          <div className="stat-chip">👁 {pp.goruntulenme.toLocaleString('tr-TR')} görüntülenme</div>
                          <div className="stat-chip">⬇ {pp.indirme} indirme</div>
                          <div className="stat-chip">↗ {pp.atif} atıf</div>
                        </div>

                        <div style={{display:'flex',gap:'6px'}}>
                          <button className="btn-p" style={{fontSize:'11px',padding:'6px 14px'}}>Yeni Versiyon</button>
                          <button className="btn-o" style={{fontSize:'11px',padding:'6px 12px'}}>PDF İndir</button>
                          <button className="btn-o" onClick={() => router.push('/dergi')} style={{fontSize:'11px',padding:'6px 12px'}}>Dergiye Gönder →</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* YÜKLEME */}
            {aktifTab === 'yukle' && (
              <div style={{maxWidth:'600px',display:'flex',flexDirection:'column',gap:'16px',animation:'fadeIn 0.3s ease'}}>
                <div style={{padding:'14px 16px',background:'rgba(251,146,60,0.05)',border:'1px solid rgba(251,146,60,0.2)'}}>
                  <div style={{fontSize:'12px',color:'rgba(0,0,0,0.6)',lineHeight:1.6}}>
                    📋 Preprint yüklediğinizde makaleye otomatik <strong>SHA-256 hash</strong> atanır. Bu hash, makalenizin tamlığını ve önceliğini kriptografik olarak kanıtlar.
                  </div>
                </div>

                {/* DOSYA */}
                <div>
                  <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.4)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'8px'}}>Makale Dosyası</div>
                  <label className="upload-zone">
                    {yukleniyor ? (
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'10px'}}>
                        <span style={{width:'28px',height:'28px',border:'3px solid rgba(251,146,60,0.2)',borderTop:'3px solid #fb923c',borderRadius:'50%',display:'inline-block',animation:'spin 0.8s linear infinite'}}/>
                        <div style={{fontSize:'12px',color:'rgba(0,0,0,0.5)'}}>Hash hesaplanıyor...</div>
                      </div>
                    ) : yuklendi ? (
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'8px'}}>
                        <div style={{fontSize:'32px'}}>✅</div>
                        <div style={{fontSize:'13px',fontWeight:600,color:'#00c48c'}}>{dosyaAdi}</div>
                        <div style={{fontSize:'10px',color:'rgba(0,0,0,0.35)'}}>SHA-256 hash oluşturuldu</div>
                      </div>
                    ) : (
                      <>
                        <div style={{fontSize:'32px',marginBottom:'8px'}}>📄</div>
                        <div style={{fontSize:'13px',fontWeight:600,color:'#0a0a0a',marginBottom:'4px'}}>{dosyaAdi||'PDF dosyasını sürükle veya seç'}</div>
                        <div style={{fontSize:'11px',color:'rgba(0,0,0,0.35)'}}>Maksimum 50 MB</div>
                      </>
                    )}
                    <input type="file" accept=".pdf" style={{display:'none'}} onChange={yukle}/>
                  </label>
                </div>

                {/* FORM */}
                {[
                  {l:'Başlık',p:'Makalenizin tam başlığını girin'},
                  {l:'Yazarlar',p:'Ad Soyad, Ad Soyad (virgülle ayırın)'},
                  {l:'Kurum',p:'Bağlı olduğunuz kurum'},
                ].map((f,i) => (
                  <div key={i}>
                    <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.4)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'6px'}}>{f.l}</div>
                    <input placeholder={f.p} style={{width:'100%',border:'1.5px solid rgba(0,0,0,0.07)',padding:'10px 12px',fontSize:'13px',fontFamily:'DM Sans,sans-serif',outline:'none',background:'#fff',transition:'border 0.2s'}} onFocus={e=>(e.target as HTMLElement).style.borderColor='#fb923c'} onBlur={e=>(e.target as HTMLElement).style.borderColor='rgba(0,0,0,0.07)'}/>
                  </div>
                ))}

                <div>
                  <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.4)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'6px'}}>Özet</div>
                  <textarea placeholder="Makale özetini girin..." style={{width:'100%',border:'1.5px solid rgba(0,0,0,0.07)',padding:'10px 12px',fontSize:'13px',fontFamily:'DM Sans,sans-serif',outline:'none',background:'#fff',resize:'none',minHeight:'100px',lineHeight:1.6,transition:'border 0.2s'}} onFocus={e=>(e.target as HTMLElement).style.borderColor='#fb923c'} onBlur={e=>(e.target as HTMLElement).style.borderColor='rgba(0,0,0,0.07)'}/>
                </div>

                <div style={{display:'flex',gap:'8px'}}>
                  <button className="btn-p" style={{flex:1,padding:'12px'}}>📤 Yayınla & Hash Al</button>
                  <button className="btn-o" onClick={() => setAktifTab('arkasivm')}>İptal</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
