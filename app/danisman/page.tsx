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

export default function Danisman() {
  const curRef = useRef<SVGSVGElement>(null)
  const mncRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()
  const [aktifTab, setAktifTab] = useState('teklifler')
  const [consultActive, setConsultActive] = useState(true)

  const teklifler = [
    { id:1, av:'TM', color:'#3b82f6', firm:'Techno Medikal A.Ş.', konu:'YZ Destekli Görüntüleme Sistemi', butce:'120.000 TL', sure:'6 ay', durum:'Aktif', tarih:'15 Mar 2025', puan:4.9 },
    { id:2, av:'BF', color:'#06b6d4', firm:'BioFarma Ar-Ge', konu:'Genomik Veri Analizi Danışmanlığı', butce:'80.000 TL', sure:'4 ay', durum:'Aktif', tarih:'2 Nis 2025', puan:5.0 },
    { id:3, av:'DS', color:'#f59e0b', firm:'DataSense Analytics', konu:'NLP Model Geliştirme', butce:'60.000 TL', sure:'3 ay', durum:'Beklemede', tarih:'20 Nis 2025', puan:0 },
    { id:4, av:'EG', color:'#ef4444', firm:'EnerjiGrid A.Ş.', konu:'Optimizasyon Algoritmaları', butce:'200.000 TL', sure:'12 ay', durum:'Reddedildi', tarih:'5 Mar 2025', puan:0 },
    { id:5, av:'FR', color:'#22d3ee', firm:'FinRisk Teknoloji', konu:'Risk Modellemesi Danışmanlığı', butce:'45.000 TL', sure:'2 ay', durum:'Tamamlandı', tarih:'Jan 2025', puan:4.8 },
  ]

  const eslesmeler = [
    { av:'AB', color:'#10b981', firm:'AgroBot Teknoloji', sektor:'Tarım Teknolojisi', konu:'CV algoritması geliştirme', uyum:94, butce:'40K TL', sure:'3 ay', tags:['Computer Vision','Python','ML'] },
    { av:'SM', color:'#3b82f6', firm:'SağlıkMed Yazılım', sektor:'Sağlık Teknolojisi', konu:'Tıbbi görüntüleme YZ', uyum:91, butce:'90K TL', sure:'6 ay', tags:['YZ','Görüntüleme','Deep Learning'] },
    { av:'NT', color:'#f59e0b', firm:'NöroTech Lab', sektor:'Nörobilim', konu:'EEG sinyal analizi', uyum:87, butce:'55K TL', sure:'4 ay', tags:['Sinyal İşleme','Python','Nörobilim'] },
  ]

  const durumRenk: Record<string,string> = {
    'Aktif':'#00c48c', 'Beklemede':'#f59e0b', 'Reddedildi':'#ef4444', 'Tamamlandı':'#3b82f6'
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
        .tab-btn.active { color:#0a0a0a; border-bottom-color:#00c48c; font-weight:600; }
        .kart { background:#fff; border:1px solid rgba(0,0,0,0.07); padding:18px 20px; transition:all 0.2s; }
        .kart:hover { border-color:rgba(0,196,140,0.25); box-shadow:0 2px 12px rgba(0,0,0,0.05); }
        .btn-g { background:#00c48c; color:#0a0a0a; border:none; padding:8px 18px; font-size:12px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.2s; }
        .btn-g:hover { background:#00a87a; color:#fff; }
        .btn-o { background:transparent; color:rgba(0,0,0,0.5); border:1px solid rgba(0,0,0,0.1); padding:8px 14px; font-size:12px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.2s; }
        .btn-o:hover { border-color:#0a0a0a; color:#0a0a0a; }
        .tag { font-size:10px; padding:3px 8px; background:rgba(0,0,0,0.05); color:rgba(0,0,0,0.5); }
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
                const isActive = '/danisman' === item.href
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
          <div style={{background:'linear-gradient(90deg,#22d3ee 0%,#22d3ee88 50%,#22d3ee15 100%)',padding:'14px 28px',display:'flex',alignItems:'center',gap:'20px',flexShrink:0,borderBottom:'1px solid rgba(0,0,0,0.07)'}}>
            <div>
              <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'18px',fontWeight:700,color:'#0a0a0a'}}>Danışmanlık</div>
              <div style={{fontSize:'11px',color:'rgba(0,0,0,0.5)',marginTop:'3px'}}>Firma teklifleri ve YZ eşleştirme</div>
            </div>
            {/* TOGGLE */}
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginLeft:'auto'}}>
              <span style={{fontSize:'12px',fontWeight:600,color:'rgba(0,0,0,0.6)'}}>Danışmanlık Durumu:</span>
              <div onClick={() => setConsultActive(p=>!p)} style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer'}}>
                <div style={{width:'40px',height:'22px',background:consultActive?'#00c48c':'rgba(0,0,0,0.15)',borderRadius:'11px',position:'relative',transition:'background 0.2s'}}>
                  <div style={{position:'absolute',top:'3px',left:consultActive?'20px':'3px',width:'16px',height:'16px',background:'#fff',borderRadius:'50%',transition:'left 0.2s',boxShadow:'0 1px 4px rgba(0,0,0,0.2)'}}/>
                </div>
                <span style={{fontSize:'12px',fontWeight:700,color:consultActive?'#00c48c':'rgba(0,0,0,0.35)'}}>{consultActive?'Aktif':'Kapalı'}</span>
              </div>
            </div>
          </div>

          {/* İSTATİSTİKLER */}
          <div style={{background:'#fff',borderBottom:'1px solid rgba(0,0,0,0.07)',padding:'12px 28px',display:'flex',gap:'0',flexShrink:0}}>
            {[
              {n:'5',l:'Toplam Teklif',c:'#06b6d4'},
              {n:'2',l:'Aktif Proje',c:'#00c48c'},
              {n:'640K',l:'Toplam TL',c:'#f59e0b'},
              {n:'4.9',l:'Ortalama Puan',c:'#3b82f6'},
              {n:'3',l:'YZ Eşleşme',c:'#22d3ee'},
            ].map((s,i) => (
              <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'0 24px',borderRight:i<4?'1px solid rgba(0,0,0,0.07)':'none'}}>
                <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'20px',fontWeight:700,color:s.c,lineHeight:1}}>{s.n}</div>
                <div style={{fontSize:'10px',color:'rgba(0,0,0,0.35)',marginTop:'2px',textTransform:'uppercase',letterSpacing:'0.5px'}}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div style={{background:'#fff',borderBottom:'1px solid rgba(0,0,0,0.07)',display:'flex',flexShrink:0}}>
            <button className={`tab-btn${aktifTab==='teklifler'?' active':''}`} onClick={()=>setAktifTab('teklifler')}>
              Gelen Teklifler <span style={{background:'rgba(0,0,0,0.06)',fontSize:'10px',padding:'1px 6px',borderRadius:'8px',marginLeft:'4px'}}>5</span>
            </button>
            <button className={`tab-btn${aktifTab==='eslesmeler'?' active':''}`} onClick={()=>setAktifTab('eslesmeler')}>
              🤖 YZ Eşleştirme <span style={{background:'rgba(0,196,140,0.1)',color:'#00c48c',fontSize:'10px',padding:'1px 6px',borderRadius:'8px',marginLeft:'4px'}}>3</span>
            </button>
            <button className={`tab-btn${aktifTab==='profil'?' active':''}`} onClick={()=>setAktifTab('profil')}>
              Danışman Profilim
            </button>
          </div>

          {/* İÇERİK */}
          <div style={{flex:1,overflowY:'auto',padding:'20px 28px'}}>

            {/* TEKLİFLER */}
            {aktifTab === 'teklifler' && (
              <div style={{display:'flex',flexDirection:'column',gap:'10px',animation:'fadeIn 0.3s ease'}}>
                {teklifler.map(t => (
                  <div key={t.id} className="kart">
                    <div style={{display:'flex',alignItems:'flex-start',gap:'14px'}}>
                      <div style={{width:'44px',height:'44px',borderRadius:'4px',background:t.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:700,color:'#fff',fontFamily:"'Pixelify Sans',monospace",flexShrink:0}}>{t.av}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'4px'}}>
                          <div style={{fontSize:'14px',fontWeight:700,color:'#0a0a0a'}}>{t.firm}</div>
                          <span style={{background:durumRenk[t.durum]+'18',color:durumRenk[t.durum],fontSize:'10px',padding:'2px 10px',fontWeight:700}}>{t.durum}</span>
                          {t.puan > 0 && <span style={{fontSize:'11px',color:'#f59e0b',fontWeight:600}}>★ {t.puan}</span>}
                        </div>
                        <div style={{fontSize:'13px',color:'rgba(0,0,0,0.6)',marginBottom:'8px'}}>{t.konu}</div>
                        <div style={{display:'flex',gap:'16px',fontSize:'11px',color:'rgba(0,0,0,0.4)'}}>
                          <span>💰 {t.butce}</span>
                          <span>⏱ {t.sure}</span>
                          <span>📅 {t.tarih}</span>
                        </div>
                      </div>
                      {(t.durum === 'Beklemede') && (
                        <div style={{display:'flex',gap:'6px',flexShrink:0}}>
                          <button className="btn-g">Kabul Et</button>
                          <button className="btn-o">Reddet</button>
                        </div>
                      )}
                      {(t.durum === 'Aktif') && (
                        <div style={{flexShrink:0}}>
                          <button className="btn-o" onClick={() => router.push('/mesajlar')}>Mesaj Gönder</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* YZ EŞLEŞTİRME */}
            {aktifTab === 'eslesmeler' && (
              <div style={{animation:'fadeIn 0.3s ease'}}>
                <div style={{padding:'10px 14px',background:'rgba(0,196,140,0.04)',border:'1px solid rgba(0,196,140,0.1)',marginBottom:'14px',display:'flex',alignItems:'center',gap:'8px'}}>
                  <span style={{fontSize:'10px',fontWeight:700,color:'#00c48c'}}>🤖 YZ Eşleştirme</span>
                  <span style={{fontSize:'11px',color:'rgba(0,0,0,0.5)'}}>Uzmanlık alanlarınıza göre sıralandı</span>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                  {eslesmeler.map((e,i) => (
                    <div key={i} className="kart">
                      <div style={{display:'flex',alignItems:'flex-start',gap:'14px'}}>
                        <div style={{width:'44px',height:'44px',borderRadius:'4px',background:e.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:700,color:'#fff',fontFamily:"'Pixelify Sans',monospace",flexShrink:0}}>{e.av}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:'14px',fontWeight:700,color:'#0a0a0a',marginBottom:'2px'}}>{e.firm}</div>
                          <div style={{fontSize:'12px',color:'rgba(0,0,0,0.4)',marginBottom:'6px'}}>{e.sektor}</div>
                          <div style={{fontSize:'13px',color:'rgba(0,0,0,0.6)',marginBottom:'8px'}}>{e.konu}</div>
                          <div style={{display:'flex',gap:'8px',marginBottom:'8px'}}>
                            <span style={{fontSize:'12px',fontWeight:500,color:'#0a0a0a',background:'#f2f2f0',padding:'4px 10px',border:'1px solid rgba(0,0,0,0.07)'}}>💰 {e.butce}</span>
                            <span style={{fontSize:'12px',fontWeight:500,color:'#0a0a0a',background:'#f2f2f0',padding:'4px 10px',border:'1px solid rgba(0,0,0,0.07)'}}>⏱ {e.sure}</span>
                          </div>
                          <div style={{display:'flex',gap:'5px',flexWrap:'wrap'}}>
                            {e.tags.map((t,j) => <span key={j} className="tag">{t}</span>)}
                          </div>
                        </div>
                        <div style={{flexShrink:0,textAlign:'center',padding:'12px 16px',background:'#f2f2f0',border:'1px solid rgba(0,0,0,0.07)'}}>
                          <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'22px',fontWeight:700,color:e.uyum>=75?'#00c48c':e.uyum>=45?'#f59e0b':'#ef4444',lineHeight:1}}>%{e.uyum}</div>
                          <div style={{fontSize:'9px',color:'rgba(0,0,0,0.35)',marginTop:'2px',textTransform:'uppercase'}}>Uyum</div>
                          <button className="btn-g" style={{marginTop:'8px',width:'100%',padding:'6px'}}>Başvur</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DANIŞMAN PROFİLİ */}
            {aktifTab === 'profil' && (
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px',animation:'fadeIn 0.3s ease'}}>
                {/* GENEL BİLGİLER */}
                <div className="kart">
                  <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'13px',fontWeight:700,marginBottom:'14px'}}>Danışman Profilim</div>
                  <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                    {[
                      {l:'Saat Ücreti',v:'2.500 TL / saat'},
                      {l:'Günlük Ücret',v:'15.000 TL / gün'},
                      {l:'Min. Proje Süresi',v:'1 ay'},
                      {l:'Müsaitlik',v:'Haftada 2 gün'},
                    ].map((b,i) => (
                      <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(0,0,0,0.05)'}}>
                        <span style={{fontSize:'12px',color:'rgba(0,0,0,0.45)'}}>{b.l}</span>
                        <span style={{fontSize:'12px',fontWeight:600,color:'#0a0a0a'}}>{b.v}</span>
                      </div>
                    ))}
                  </div>
                  <button className="btn-g" style={{width:'100%',marginTop:'14px',padding:'10px'}}>Düzenle</button>
                </div>

                {/* UZMANLIK ALANLARI */}
                <div className="kart">
                  <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'13px',fontWeight:700,marginBottom:'14px'}}>Uzmanlık Alanları</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'14px'}}>
                    {['Yapay Zeka','Derin Öğrenme','Tıbbi Görüntüleme','Federated Learning','Python','PyTorch','Biyoinformatik','NLP'].map((t,i) => (
                      <span key={i} style={{fontSize:'11px',padding:'5px 10px',border:'1.5px solid rgba(0,196,140,0.3)',color:'#00c48c',background:'rgba(0,196,140,0.06)',fontWeight:500}}>{t}</span>
                    ))}
                  </div>
                  <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'13px',fontWeight:700,marginBottom:'10px',borderTop:'1px solid rgba(0,0,0,0.07)',paddingTop:'12px'}}>Değerlendirmeler</div>
                  {[
                    {firm:'Techno Medikal',puan:4.9,yorum:'Olağanüstü teknik bilgi ve iletişim.'},
                    {firm:'FinRisk Teknoloji',puan:4.8,yorum:'Projeyi zamanında ve kaliteli teslim etti.'},
                  ].map((y,i) => (
                    <div key={i} style={{padding:'10px 0',borderBottom:i===0?'1px solid rgba(0,0,0,0.05)':'none'}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'3px'}}>
                        <span style={{fontSize:'12px',fontWeight:600}}>{y.firm}</span>
                        <span style={{fontSize:'12px',color:'#f59e0b',fontWeight:700}}>★ {y.puan}</span>
                      </div>
                      <div style={{fontSize:'11px',color:'rgba(0,0,0,0.45)'}}>{y.yorum}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
