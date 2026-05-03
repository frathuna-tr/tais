'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Firmalar() {
  const curRef = useRef<SVGSVGElement>(null)
  const mncRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const [searchQ, setSearchQ] = useState('')
  const [activeFilter, setActiveFilter] = useState('tumu')
  const [activeTab, setActiveTab] = useState(0)
  const [savedFirms, setSavedFirms] = useState<number[]>([])
  const [appliedFirms, setAppliedFirms] = useState<number[]>([])

  const firmalar = [
    { id:0, av:'TM', color:'#3b82f6', name:'Techno Medikal A.Ş.', sektor:'Sağlık Teknolojisi', sehir:'İstanbul', buyukluk:'Orta', rozet:true, uyum:97, ihtiyac:'Yapay Zeka & Görüntüleme', butce:'50K-100K TL', sure:'6 ay', aciklama:'Tıbbi görüntüleme alanında YZ destekli teşhis sistemi geliştirmek için deneyimli araştırmacı arıyoruz.', tags:['YZ','Tıbbi Görüntüleme','Python'], cat:'saglik' },
    { id:1, av:'AB', color:'#10b981', name:'AgroBot Teknoloji', sektor:'Tarım Teknolojisi', sehir:'Ankara', buyukluk:'Küçük', rozet:true, uyum:89, ihtiyac:'Makine Öğrenimi', butce:'20K-40K TL', sure:'3 ay', aciklama:'Tarla analizi için uydu görüntüsü işleme algoritmaları geliştirmek istiyoruz.', tags:['ML','Computer Vision','Python'], cat:'tarim' },
    { id:2, av:'DS', color:'#f59e0b', name:'DataSense Analytics', sektor:'Veri Analitiği', sehir:'İzmir', buyukluk:'Büyük', rozet:false, uyum:84, ihtiyac:'Veri Bilimi & NLP', butce:'80K-150K TL', sure:'12 ay', aciklama:'Müşteri davranış analizi için doğal dil işleme modeli geliştirmek istiyoruz.', tags:['NLP','Veri Bilimi','R'], cat:'teknoloji' },
    { id:3, av:'EG', color:'#ef4444', name:'EnerjiGrid A.Ş.', sektor:'Enerji', sehir:'Ankara', buyukluk:'Büyük', rozet:true, uyum:76, ihtiyac:'Optimizasyon & Simülasyon', butce:'100K+ TL', sure:'18 ay', aciklama:'Akıllı şebeke optimizasyonu için matematiksel model geliştirme projesi.', tags:['Optimizasyon','MATLAB','Fizik'], cat:'enerji' },
    { id:4, av:'BF', color:'#8b5cf6', name:'BioFarma Ar-Ge', sektor:'İlaç & Biyoteknoloji', sehir:'İstanbul', buyukluk:'Orta', rozet:true, uyum:91, ihtiyac:'Biyoinformatik', butce:'60K-120K TL', sure:'9 ay', aciklama:'İlaç keşif sürecini hızlandırmak için genomik veri analizi danışmanı arıyoruz.', tags:['Biyoinformatik','Genomik','Python'], cat:'saglik' },
    { id:5, av:'FR', color:'#06b6d4', name:'FinRisk Teknoloji', sektor:'Fintech', sehir:'İstanbul', buyukluk:'Orta', rozet:false, uyum:71, ihtiyac:'Risk Modellemesi', butce:'40K-80K TL', sure:'6 ay', aciklama:'Finansal risk değerlendirme modeli için akademik danışman arayışındayız.', tags:['Fintech','İstatistik','Risk'], cat:'finans' },
  ]

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

  const filtered = firmalar.filter(f => {
    const matchSearch = !searchQ || f.name.toLowerCase().includes(searchQ.toLowerCase()) || f.sektor.toLowerCase().includes(searchQ.toLowerCase()) || f.tags.some(t => t.toLowerCase().includes(searchQ.toLowerCase()))
    const matchFilter = activeFilter === 'tumu' || f.cat === activeFilter
    return matchSearch && matchFilter
  })

  const filters = [
    { key:'tumu', label:'Tümü' },
    { key:'saglik', label:'Sağlık' },
    { key:'teknoloji', label:'Teknoloji' },
    { key:'enerji', label:'Enerji' },
    { key:'tarim', label:'Tarım' },
    { key:'finans', label:'Finans' },
  ]

  const tabs = ['YZ Önerileri', 'Tüm Firmalar', 'Kaydettiklerim']

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; cursor:none!important; }
        body { font-family:'DM Sans',sans-serif; background:#f2f2f0; color:#0a0a0a; height:100vh; overflow:hidden; }
        .nav-item { display:flex; align-items:center; gap:10px; padding:9px 18px; font-size:13px; color:rgba(255,255,255,0.55); transition:all 0.2s; border-left:2px solid transparent; cursor:pointer; }
        .nav-item:hover { color:#fff; background:rgba(255,255,255,0.05); }
        .nav-item.active { color:#00c48c; border-left-color:#00c48c; background:rgba(0,196,140,0.08); font-weight:600; }
        .firma-card { background:#fff; border:1px solid rgba(0,0,0,0.07); padding:20px; transition:all 0.2s; cursor:pointer; }
        .firma-card:hover { border-color:rgba(0,196,140,0.3); box-shadow:0 4px 16px rgba(0,196,140,0.06); }
        .tag { font-size:10px; padding:3px 8px; background:rgba(0,0,0,0.05); color:rgba(0,0,0,0.5); font-weight:500; }
        .btn-primary { background:#00c48c; color:#0a0a0a; border:none; padding:9px 20px; font-size:12px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.2s; letter-spacing:0.3px; }
        .btn-primary:hover { background:#00a376; color:#fff; }
        .btn-primary.applied { background:rgba(0,196,140,0.1); color:#00c48c; border:1px solid rgba(0,196,140,0.2); }
        .btn-outline { background:transparent; color:rgba(0,0,0,0.5); border:1px solid rgba(0,0,0,0.1); padding:9px 14px; font-size:12px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.2s; }
        .btn-outline:hover { border-color:#0a0a0a; color:#0a0a0a; }
        .btn-outline.saved { background:rgba(0,196,140,0.08); color:#00c48c; border-color:rgba(0,196,140,0.3); }
        .filter-chip { padding:6px 14px; font-size:12px; font-weight:500; border:1.5px solid rgba(0,0,0,0.07); color:rgba(0,0,0,0.45); background:transparent; cursor:pointer; transition:all 0.2s; font-family:'DM Sans',sans-serif; }
        .filter-chip:hover { border-color:rgba(0,196,140,0.4); color:#00c48c; }
        .filter-chip.active { border-color:#00c48c; background:rgba(0,196,140,0.08); color:#00c48c; font-weight:600; }
        .tab-item { flex:1; padding:12px; font-size:13px; font-weight:500; color:rgba(0,0,0,0.4); text-align:center; border-bottom:2px solid transparent; cursor:pointer; transition:all 0.2s; }
        .tab-item:hover { color:#0a0a0a; }
        .tab-item.active { color:#0a0a0a; border-bottom-color:#00c48c; font-weight:600; }
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
                const isActive = '/firmalar' === item.href
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

          {/* TOPBAR */}
          <div style={{background:'#fff',borderBottom:'1px solid rgba(0,0,0,0.07)',padding:'0 28px',height:'52px',display:'flex',alignItems:'center',gap:'16px',flexShrink:0}}>
            <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'16px',fontWeight:700}}>Firmalar</div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',background:'#f2f2f0',border:'1px solid rgba(0,0,0,0.07)',padding:'8px 14px',flex:1,maxWidth:'360px'}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Firma, sektör veya uzmanlık ara..." style={{border:'none',outline:'none',background:'transparent',fontSize:'12px',fontFamily:'DM Sans,sans-serif',width:'100%',color:'#0a0a0a'}}/>
            </div>
            <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'6px'}}>
              <div style={{fontSize:'12px',color:'rgba(0,0,0,0.4)'}}>
                <strong style={{color:'#0a0a0a'}}>{filtered.length}</strong> firma bulundu
              </div>
            </div>
          </div>

          <div style={{flex:1,overflow:'hidden',display:'grid',gridTemplateColumns:'1fr 220px'}}>

            {/* İÇERİK */}
            <div style={{display:'flex',flexDirection:'column',overflow:'hidden'}}>

              {/* TABS + FİLTRE */}
              <div style={{background:'#fff',borderBottom:'1px solid rgba(0,0,0,0.07)',flexShrink:0}}>
                <div style={{display:'flex',borderBottom:'1px solid rgba(0,0,0,0.05)'}}>
                  {tabs.map((t,i) => (
                    <div key={i} className={`tab-item${activeTab===i?' active':''}`} onClick={() => setActiveTab(i)}>{t}</div>
                  ))}
                </div>
                <div style={{padding:'10px 20px',display:'flex',gap:'6px',flexWrap:'wrap'}}>
                  {filters.map(f => (
                    <button key={f.key} className={`filter-chip${activeFilter===f.key?' active':''}`} onClick={() => setActiveFilter(f.key)}>{f.label}</button>
                  ))}
                </div>
              </div>

              {/* FİRMA KARTLARI */}
              <div style={{flex:1,overflowY:'auto',padding:'16px 20px',display:'flex',flexDirection:'column',gap:'10px'}}>

                {activeTab === 0 && (
                  <div style={{padding:'10px 14px',background:'rgba(0,196,140,0.04)',border:'1px solid rgba(0,196,140,0.1)',marginBottom:'4px',display:'flex',alignItems:'center',gap:'8px'}}>
                    <span style={{fontSize:'10px',fontWeight:700,color:'#00c48c'}}>🤖 YZ Eşleştirme</span>
                    <span style={{fontSize:'11px',color:'rgba(0,0,0,0.5)'}}>Profilinize göre sıralandı — uzmanlık alanı, yayın geçmişi ve danışmanlık tercihleri dikkate alındı</span>
                  </div>
                )}

                {filtered
                  .filter(f => activeTab === 2 ? savedFirms.includes(f.id) : true)
                  .sort((a,b) => activeTab === 0 ? b.uyum - a.uyum : 0)
                  .map((f) => (
                  <div key={f.id} className="firma-card">
                    <div style={{display:'flex',alignItems:'flex-start',gap:'14px'}}>

                      {/* LOGO */}
                      <div style={{width:'48px',height:'48px',borderRadius:'4px',background:f.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',fontWeight:700,color:'#fff',fontFamily:"'Pixelify Sans',monospace",flexShrink:0}}>{f.av}</div>

                      {/* BİLGİ */}
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
                          <div style={{fontSize:'15px',fontWeight:700,color:'#0a0a0a'}}>{f.name}</div>
                          {f.rozet && (
                            <span style={{background:'linear-gradient(90deg,#f59e0b,#d97706)',color:'#fff',fontSize:'9px',padding:'3px 10px',fontWeight:800,display:'flex',alignItems:'center',gap:'4px',letterSpacing:'0.5px'}}>
                              ★ GÜVENLİ
                            </span>
                          )}
                        </div>
                        <div style={{fontSize:'12px',color:'rgba(0,0,0,0.45)',marginBottom:'6px'}}>
                          {f.sektor} · {f.sehir} · {f.buyukluk} ölçekli
                        </div>
                        <div style={{fontSize:'12px',color:'rgba(0,0,0,0.6)',lineHeight:1.5,marginBottom:'10px'}}>{f.aciklama}</div>
                        <div style={{display:'flex',gap:'5px',flexWrap:'wrap',marginBottom:'12px'}}>
                          {f.tags.map((t,i) => <span key={i} className="tag">{t}</span>)}
                        </div>
                        <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'12px'}}>
                          <span style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'12px',fontWeight:500,color:'#0a0a0a',background:'#f2f2f0',padding:'5px 10px',border:'1px solid rgba(0,0,0,0.07)'}}>
                            <span style={{color:'#f59e0b'}}>💰</span> {f.butce}
                          </span>
                          <span style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'12px',fontWeight:500,color:'#0a0a0a',background:'#f2f2f0',padding:'5px 10px',border:'1px solid rgba(0,0,0,0.07)'}}>
                            <span style={{color:'#3b82f6'}}>⏱</span> {f.sure}
                          </span>
                          <span style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'12px',fontWeight:500,color:'#0a0a0a',background:'#f2f2f0',padding:'5px 10px',border:'1px solid rgba(0,0,0,0.07)'}}>
                            <span style={{color:'#00c48c'}}>🎯</span> {f.ihtiyac}
                          </span>
                        </div>
                        <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                          <button className={`btn-primary${appliedFirms.includes(f.id)?' applied':''}`} onClick={() => setAppliedFirms(p=>[...p,f.id])}>
                            {appliedFirms.includes(f.id) ? '✓ Başvuruldu' : 'Başvur'}
                          </button>
                          <button className={`btn-outline${savedFirms.includes(f.id)?' saved':''}`} onClick={() => setSavedFirms(p => p.includes(f.id) ? p.filter(x=>x!==f.id) : [...p,f.id])}>
                            {savedFirms.includes(f.id) ? '✓ Kaydedildi' : '♡ Kaydet'}
                          </button>
                          <button className="btn-outline" onClick={() => router.push('/mesajlar')}>Mesaj Gönder</button>
                        </div>
                      </div>

                      {/* UYUM SKORU */}
                      {activeTab === 0 && (
                        <div style={{flexShrink:0,textAlign:'center',padding:'8px 16px',border:'1px solid rgba(0,0,0,0.07)',background:'#f2f2f0'}}>
                          <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'24px',fontWeight:700,color:f.uyum>=75?'#00c48c':f.uyum>=45?'#f59e0b':'#ef4444',lineHeight:1}}>%{f.uyum}</div>
                          <div style={{fontSize:'9px',color:'rgba(0,0,0,0.35)',letterSpacing:'0.5px',textTransform:'uppercase',marginTop:'3px'}}>Uyum</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {activeTab === 2 && savedFirms.length === 0 && (
                  <div style={{textAlign:'center',padding:'60px 20px',color:'rgba(0,0,0,0.3)'}}>
                    <div style={{fontSize:'32px',marginBottom:'12px'}}>♡</div>
                    <div style={{fontSize:'14px',fontWeight:500}}>Henüz kaydettiğiniz firma yok</div>
                    <div style={{fontSize:'12px',marginTop:'6px'}}>Firma kartlarındaki "Kaydet" butonunu kullanın</div>
                  </div>
                )}
              </div>
            </div>

            {/* SAĞ PANEL */}
            <div style={{borderLeft:'1px solid rgba(0,0,0,0.07)',background:'#fff',overflowY:'auto',padding:'16px'}}>
              <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'13px',fontWeight:700,marginBottom:'12px'}}>Özet</div>
              {[
                {n:firmalar.length,l:'Toplam Firma',c:'#0a0a0a'},
                {n:firmalar.filter(f=>f.rozet).length,l:'Güvenli Rozet',c:'#00c48c'},
                {n:appliedFirms.length,l:'Başvurulan',c:'#3b82f6'},
                {n:savedFirms.length,l:'Kaydedilen',c:'#f59e0b'},
              ].map((s,i) => (
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(0,0,0,0.05)'}}>
                  <div style={{fontSize:'12px',color:'rgba(0,0,0,0.5)'}}>{s.l}</div>
                  <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'18px',fontWeight:700,color:s.c}}>{s.n}</div>
                </div>
              ))}

              <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'13px',fontWeight:700,margin:'16px 0 10px'}}>Sektörler</div>
              {[
                {l:'Sağlık',n:2,c:'#10b981'},{l:'Teknoloji',n:1,c:'#3b82f6'},
                {l:'Enerji',n:1,c:'#ef4444'},{l:'Tarım',n:1,c:'#f59e0b'},{l:'Finans',n:1,c:'#06b6d4'},
              ].map((s,i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:'8px',padding:'6px 0'}}>
                  <div style={{width:'8px',height:'8px',borderRadius:'50%',background:s.c,flexShrink:0}}/>
                  <div style={{fontSize:'12px',color:'rgba(0,0,0,0.6)',flex:1}}>{s.l}</div>
                  <div style={{fontSize:'11px',color:'rgba(0,0,0,0.35)'}}>{s.n}</div>
                </div>
              ))}

              <div style={{marginTop:'16px',padding:'12px',background:'rgba(0,196,140,0.04)',border:'1px solid rgba(0,196,140,0.1)'}}>
                <div style={{fontSize:'11px',fontWeight:700,color:'#00c48c',marginBottom:'4px'}}>💡 İpucu</div>
                <div style={{fontSize:'11px',color:'rgba(0,0,0,0.5)',lineHeight:1.5}}>Güvenli rozeti olan firmalar NDA ve ödeme güvencesi sağlar.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
