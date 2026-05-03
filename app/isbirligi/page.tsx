'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

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

export default function Isbirligi() {
  const curRef = useRef<SVGSVGElement>(null)
  const mncRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const [aktifTab, setAktifTab] = useState('ilanlar')
  const [searchQ, setSearchQ] = useState('')
  const [aktifFilter, setAktifFilter] = useState('tumu')
  const [basvurulanlar, setBasvurulanlar] = useState<number[]>([])
  const [kaydedilenler, setKaydedilenler] = useState<number[]>([])
  const [yeniModal, setYeniModal] = useState(false)

  const ilanlar = [
    { id:1, baslik:'Yapay Zeka Destekli Kanser Tespiti', kurum:'Hacettepe Üniversitesi', kisi:'Prof. Dr. Ali Demir', alan:'Biyomedikal · Derin Öğrenme', tur:'Araştırma', sure:'12 ay', butce:'250.000 TL', uyum:96, tarih:'2 gün önce', tags:['YZ','PyTorch','Medikal'], cat:'arastirma' },
    { id:2, baslik:'NLP Tabanlı Türkçe Sağlık Veri Analizi', kurum:'İTÜ', kisi:'Doç. Dr. Selin Kara', alan:'NLP · Veri Bilimi', tur:'Araştırma', sure:'6 ay', butce:'120.000 TL', uyum:89, tarih:'5 gün önce', tags:['NLP','Python','Sağlık'], cat:'arastirma' },
    { id:3, baslik:'Enerji Optimizasyon Modeli Geliştirme', kurum:'ODTÜ', kisi:'Prof. Dr. Kemal Yıldız', alan:'Enerji · Optimizasyon', tur:'Endüstri', sure:'9 ay', butce:'180.000 TL', uyum:74, tarih:'1 hafta önce', tags:['MATLAB','Optimizasyon','Enerji'], cat:'endustri' },
    { id:4, baslik:'Federated Learning Protokolü Geliştirme', kurum:'Boğaziçi Üniversitesi', kisi:'Dr. Can Arslan', alan:'YZ · Gizlilik', tur:'Araştırma', sure:'18 ay', butce:'400.000 TL', uyum:92, tarih:'3 gün önce', tags:['Federated Learning','Python','Güvenlik'], cat:'arastirma' },
    { id:5, baslik:'Tarım Teknolojisi Veri Analizi Platformu', kurum:'AgroTech A.Ş.', kisi:'Dr. Mehmet Çelik', alan:'Tarım · ML', tur:'Endüstri', sure:'4 ay', butce:'80.000 TL', uyum:61, tarih:'2 hafta önce', tags:['ML','Python','IoT'], cat:'endustri' },
    { id:6, baslik:'Robotik Cerrahi Asistan Sistemi', kurum:'Acıbadem Üniversitesi', kisi:'Prof. Dr. Zeynep Doğan', alan:'Robotik · Cerrahi', tur:'Araştırma', sure:'24 ay', butce:'1.200.000 TL', uyum:83, tarih:'4 gün önce', tags:['Robotik','Computer Vision','ROS'], cat:'arastirma' },
  ]

  const filtered = ilanlar.filter(i => {
    const matchSearch = !searchQ || i.baslik.toLowerCase().includes(searchQ.toLowerCase()) || i.alan.toLowerCase().includes(searchQ.toLowerCase()) || i.tags.some(t => t.toLowerCase().includes(searchQ.toLowerCase()))
    const matchFilter = aktifFilter === 'tumu' || i.cat === aktifFilter
    return matchSearch && matchFilter
  })

  const skorRenk = (s: number) => s >= 75 ? '#00c48c' : s >= 45 ? '#f59e0b' : '#ef4444'

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
        .tab-btn.active { color:#0a0a0a; border-bottom-color:#00c48c; font-weight:600; }
        .ilan-kart { background:#fff; border:1px solid rgba(0,0,0,0.07); padding:20px; transition:all 0.2s; }
        .ilan-kart:hover { border-color:rgba(0,196,140,0.3); box-shadow:0 3px 16px rgba(0,0,0,0.06); }
        .filter-chip { padding:6px 14px; font-size:12px; font-weight:500; border:1.5px solid rgba(0,0,0,0.07); color:rgba(0,0,0,0.45); background:transparent; cursor:pointer; transition:all 0.2s; font-family:'DM Sans',sans-serif; }
        .filter-chip:hover { border-color:rgba(0,196,140,0.4); color:#00c48c; }
        .filter-chip.active { border-color:#00c48c; background:rgba(0,196,140,0.08); color:#00c48c; font-weight:600; }
        .tag { font-size:10px; padding:3px 8px; background:rgba(0,0,0,0.05); color:rgba(0,0,0,0.5); }
        .btn-g { background:#00c48c; color:#0a0a0a; border:none; padding:8px 18px; font-size:12px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.2s; }
        .btn-g:hover { background:#00a87a; color:#fff; }
        .btn-g.applied { background:rgba(0,196,140,0.1); color:#00c48c; border:1px solid rgba(0,196,140,0.2); }
        .btn-o { background:transparent; color:rgba(0,0,0,0.5); border:1px solid rgba(0,0,0,0.1); padding:8px 14px; font-size:12px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.2s; }
        .btn-o:hover { border-color:#0a0a0a; color:#0a0a0a; }
        .btn-o.saved { color:#00c48c; border-color:rgba(0,196,140,0.3); background:rgba(0,196,140,0.05); }
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
                const isActive = '/isbirligi' === item.href
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
          <div style={{background:'linear-gradient(90deg,#00c48c 0%,#00c48c88 50%,#00c48c15 100%)',padding:'14px 28px',display:'flex',alignItems:'center',gap:'16px',flexShrink:0,borderBottom:'1px solid rgba(0,0,0,0.07)'}}>
            <div>
              <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'18px',fontWeight:700,color:'#0a0a0a'}}>🤝 İş Birliği Alanı</div>
              <div style={{fontSize:'11px',color:'rgba(0,0,0,0.5)',marginTop:'3px'}}>İş birliği ilanlarını keşfedin ve başvurun</div>
            </div>
            <div style={{marginLeft:'auto',display:'flex',gap:'8px'}}>
              <button className="btn-g" onClick={() => setYeniModal(true)}>+ İlan Ver</button>
            </div>
          </div>

          {/* İSTATİSTİKLER */}
          <div style={{background:'#fff',borderBottom:'1px solid rgba(0,0,0,0.07)',padding:'12px 28px',display:'flex',gap:'0',flexShrink:0}}>
            {[
              {n:ilanlar.length,l:'Aktif İlan',c:'#00c48c'},
              {n:basvurulanlar.length,l:'Başvurulan',c:'#3b82f6'},
              {n:kaydedilenler.length,l:'Kaydedilen',c:'#f59e0b'},
              {n:ilanlar.filter(i=>i.uyum>=75).length,l:'Yüksek Uyum',c:'#06b6d4'},
            ].map((s,i) => (
              <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'0 24px',borderRight:i<3?'1px solid rgba(0,0,0,0.07)':'none'}}>
                <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'20px',fontWeight:700,color:s.c,lineHeight:1}}>{s.n}</div>
                <div style={{fontSize:'10px',color:'rgba(0,0,0,0.35)',marginTop:'2px',textTransform:'uppercase',letterSpacing:'0.5px'}}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* TABS + ARAMA */}
          <div style={{background:'#fff',borderBottom:'1px solid rgba(0,0,0,0.07)',flexShrink:0}}>
            <div style={{display:'flex',borderBottom:'1px solid rgba(0,0,0,0.05)',padding:'0 28px'}}>
              {[
                {key:'ilanlar',label:'İlanlar'},
                {key:'basvurularim',label:'Başvurularım'},
                {key:'ilanlarim',label:'İlanlarım'},
              ].map(t => (
                <button key={t.key} className={`tab-btn${aktifTab===t.key?' active':''}`} onClick={() => setAktifTab(t.key)}>{t.label}</button>
              ))}
            </div>
            <div style={{padding:'10px 28px',display:'flex',gap:'8px',alignItems:'center'}}>
              <div style={{display:'flex',alignItems:'center',gap:'8px',background:'#f2f2f0',border:'1px solid rgba(0,0,0,0.07)',padding:'8px 14px',flex:1,maxWidth:'360px'}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="İlan, alan veya uzmanlık ara..." style={{border:'none',outline:'none',background:'transparent',fontSize:'12px',fontFamily:'DM Sans,sans-serif',width:'100%',color:'#0a0a0a'}}/>
              </div>
              {['tumu','arastirma','endustri'].map((f,i) => (
                <button key={f} className={`filter-chip${aktifFilter===f?' active':''}`} onClick={() => setAktifFilter(f)}>
                  {['Tümü','Araştırma','Endüstri'][i]}
                </button>
              ))}
              <div style={{marginLeft:'auto',fontSize:'12px',color:'rgba(0,0,0,0.4)'}}>
                <strong style={{color:'#0a0a0a'}}>{filtered.length}</strong> ilan
              </div>
            </div>
          </div>

          {/* İÇERİK */}
          <div style={{flex:1,overflowY:'auto',padding:'16px 28px'}}>

            {/* İLANLAR */}
            {aktifTab === 'ilanlar' && (
              <div style={{display:'flex',flexDirection:'column',gap:'10px',animation:'fadeIn 0.3s ease'}}>
                {filtered.sort((a,b) => b.uyum - a.uyum).map(ilan => (
                  <div key={ilan.id} className="ilan-kart">
                    <div style={{display:'flex',alignItems:'flex-start',gap:'16px'}}>

                      {/* SOL */}
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px',flexWrap:'wrap'}}>
                          <div style={{fontSize:'15px',fontWeight:700,color:'#0a0a0a'}}>{ilan.baslik}</div>
                          <span style={{background:ilan.tur==='Araştırma'?'rgba(59,130,246,0.1)':'rgba(251,146,60,0.1)',color:ilan.tur==='Araştırma'?'#3b82f6':'#fb923c',fontSize:'10px',padding:'2px 8px',fontWeight:700}}>{ilan.tur}</span>
                        </div>
                        <div style={{fontSize:'12px',color:'rgba(0,0,0,0.45)',marginBottom:'4px'}}>
                          🏛 {ilan.kurum} · 👤 {ilan.kisi}
                        </div>
                        <div style={{fontSize:'12px',color:'rgba(0,0,0,0.5)',marginBottom:'10px'}}>
                          📌 {ilan.alan}
                        </div>
                        <div style={{display:'flex',gap:'8px',marginBottom:'10px',flexWrap:'wrap'}}>
                          <span style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'12px',fontWeight:500,color:'#0a0a0a',background:'#f2f2f0',padding:'4px 10px',border:'1px solid rgba(0,0,0,0.07)'}}>💰 {ilan.butce}</span>
                          <span style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'12px',fontWeight:500,color:'#0a0a0a',background:'#f2f2f0',padding:'4px 10px',border:'1px solid rgba(0,0,0,0.07)'}}>⏱ {ilan.sure}</span>
                          <span style={{fontSize:'11px',color:'rgba(0,0,0,0.3)',display:'flex',alignItems:'center'}}>🕐 {ilan.tarih}</span>
                        </div>
                        <div style={{display:'flex',gap:'5px',flexWrap:'wrap',marginBottom:'12px'}}>
                          {ilan.tags.map((t,i) => <span key={i} className="tag">{t}</span>)}
                        </div>
                        <div style={{display:'flex',gap:'6px'}}>
                          <button className={`btn-g${basvurulanlar.includes(ilan.id)?' applied':''}`} onClick={() => setBasvurulanlar(p => p.includes(ilan.id)?p:[ ...p,ilan.id])}>
                            {basvurulanlar.includes(ilan.id) ? '✓ Başvuruldu' : 'Başvur'}
                          </button>
                          <button className={`btn-o${kaydedilenler.includes(ilan.id)?' saved':''}`} onClick={() => setKaydedilenler(p => p.includes(ilan.id)?p.filter(x=>x!==ilan.id):[...p,ilan.id])}>
                            {kaydedilenler.includes(ilan.id) ? '✓ Kaydedildi' : '♡ Kaydet'}
                          </button>
                          <button className="btn-o" onClick={() => router.push('/mesajlar')}>Mesaj</button>
                        </div>
                      </div>

                      {/* UYUM SKORU */}
                      <div style={{flexShrink:0,textAlign:'center',padding:'14px 18px',background:'#f2f2f0',border:'1px solid rgba(0,0,0,0.07)',minWidth:'90px'}}>
                        <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'26px',fontWeight:700,color:skorRenk(ilan.uyum),lineHeight:1}}>%{ilan.uyum}</div>
                        <div style={{fontSize:'9px',color:'rgba(0,0,0,0.35)',marginTop:'3px',textTransform:'uppercase',letterSpacing:'0.5px'}}>Uyum</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* BAŞVURULARIM */}
            {aktifTab === 'basvurularim' && (
              <div style={{animation:'fadeIn 0.3s ease'}}>
                {basvurulanlar.length === 0 ? (
                  <div style={{textAlign:'center',padding:'60px',color:'rgba(0,0,0,0.25)'}}>
                    <div style={{fontSize:'40px',marginBottom:'12px'}}>📋</div>
                    <div style={{fontSize:'14px',fontWeight:500}}>Henüz başvurulan ilan yok</div>
                    <div style={{fontSize:'12px',marginTop:'6px'}}>İlanlara başvurduğunuzda burada görünür</div>
                  </div>
                ) : (
                  <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                    {ilanlar.filter(i => basvurulanlar.includes(i.id)).map(ilan => (
                      <div key={ilan.id} className="ilan-kart" style={{borderLeft:'3px solid #00c48c'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                          <div>
                            <div style={{fontSize:'14px',fontWeight:700,marginBottom:'4px'}}>{ilan.baslik}</div>
                            <div style={{fontSize:'12px',color:'rgba(0,0,0,0.45)'}}>{ilan.kurum} · {ilan.sure} · {ilan.butce}</div>
                          </div>
                          <span style={{background:'rgba(0,196,140,0.1)',color:'#00c48c',fontSize:'11px',padding:'4px 12px',fontWeight:700}}>Başvuruldu</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* İLANLARIM */}
            {aktifTab === 'ilanlarim' && (
              <div style={{animation:'fadeIn 0.3s ease',textAlign:'center',padding:'60px'}}>
                <div style={{fontSize:'40px',marginBottom:'12px'}}>📢</div>
                <div style={{fontSize:'14px',fontWeight:500,color:'rgba(0,0,0,0.4)',marginBottom:'16px'}}>Henüz ilan vermediniz</div>
                <button className="btn-g" onClick={() => setYeniModal(true)}>+ İlk İlanı Ver</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* YENİ İLAN MODAL */}
      {yeniModal && (
        <div onClick={e => e.target===e.currentTarget&&setYeniModal(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:9000,display:'flex',alignItems:'center',justifyContent:'center',animation:'fadeIn 0.2s ease'}}>
          <div style={{background:'#fff',width:'500px',maxHeight:'85vh',overflowY:'auto'}}>
            <div style={{padding:'18px 20px',borderBottom:'1px solid rgba(0,0,0,0.07)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'15px',fontWeight:700}}>Yeni İş Birliği İlanı</div>
              <button onClick={() => setYeniModal(false)} style={{background:'none',border:'none',fontSize:'20px',color:'rgba(0,0,0,0.3)',cursor:'pointer'}}>×</button>
            </div>
            <div style={{padding:'20px',display:'flex',flexDirection:'column',gap:'14px'}}>
              {[
                {l:'İlan Başlığı',p:'ör. YZ Destekli Görüntü Analizi Projesi'},
                {l:'Alan / Uzmanlık',p:'ör. Derin Öğrenme · Bilgisayarlı Görü'},
                {l:'Bütçe',p:'ör. 200.000 TL'},
                {l:'Süre',p:'ör. 12 ay'},
              ].map((f,i) => (
                <div key={i}>
                  <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.4)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'5px'}}>{f.l}</div>
                  <input placeholder={f.p} style={{width:'100%',border:'1.5px solid rgba(0,0,0,0.07)',padding:'9px 12px',fontSize:'13px',fontFamily:'DM Sans,sans-serif',outline:'none',background:'#fff'}}/>
                </div>
              ))}
              <div>
                <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.4)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'5px'}}>Açıklama</div>
                <textarea placeholder="Projeyi ve aradığınız profili açıklayın..." style={{width:'100%',border:'1.5px solid rgba(0,0,0,0.07)',padding:'9px 12px',fontSize:'13px',fontFamily:'DM Sans,sans-serif',outline:'none',resize:'none',minHeight:'80px',lineHeight:1.6}}/>
              </div>
            </div>
            <div style={{padding:'14px 20px',borderTop:'1px solid rgba(0,0,0,0.07)',display:'flex',gap:'8px',justifyContent:'flex-end'}}>
              <button onClick={() => setYeniModal(false)} style={{background:'transparent',border:'1px solid rgba(0,0,0,0.1)',padding:'9px 20px',fontSize:'13px',fontWeight:600,fontFamily:'DM Sans,sans-serif',cursor:'pointer',color:'rgba(0,0,0,0.5)'}}>İptal</button>
              <button onClick={() => setYeniModal(false)} style={{background:'#00c48c',color:'#0a0a0a',border:'none',padding:'9px 24px',fontSize:'13px',fontWeight:700,fontFamily:'DM Sans,sans-serif',cursor:'pointer'}}>Yayınla</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
