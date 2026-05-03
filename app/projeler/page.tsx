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

interface Gorev { id:number; text:string; done:boolean }
interface Uye { av:string; color:string; name:string }
interface Proje {
  id:number; ad:string; tur:string; durum:string; renk:string;
  ilerleme:number; baslangic:string; bitis:string; butce:string;
  aciklama:string; gorevler:Gorev[]; uyeler:Uye[]
}

export default function Projeler() {
  const curRef = useRef<SVGSVGElement>(null)
  const mncRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const [aktifTab, setAktifTab] = useState('tumu')
  const [seciliProje, setSeciliProje] = useState<Proje|null>(null)
  const [yeniModal, setYeniModal] = useState(false)
  const [yeniGorev, setYeniGorev] = useState('')
  const [projeler, setProjeler] = useState<Proje[]>([
    { id:1, ad:'Kanser Erken Tespit Sistemi', tur:'TÜBİTAK 1001', durum:'Aktif', renk:'#00c48c', ilerleme:65,
      baslangic:'Mar 2024', bitis:'Mar 2026', butce:'850.000 TL',
      aciklama:'Derin öğrenme tabanlı pankreas kanseri erken tespiti için çok merkezli çalışma.',
      gorevler:[{id:1,text:'Veri toplama (500 hasta)',done:true},{id:2,text:'Model eğitimi v1',done:true},{id:3,text:'Klinik validasyon',done:false},{id:4,text:'Makale yazımı',done:false}],
      uyeler:[{av:'AY',color:'#00c48c',name:'Dr. Ayşe Yılmaz'},{av:'MD',color:'#3b82f6',name:'Prof. Mehmet Demir'},{av:'SA',color:'#06b6d4',name:'Doç. Selin Arslan'}] },
    { id:2, ad:'Federated Learning Altyapısı', tur:'İş Birliği', durum:'Aktif', renk:'#3b82f6', ilerleme:30,
      baslangic:'Oca 2025', bitis:'Ara 2025', butce:'Ortak Kaynak',
      aciklama:'Çok kurumlu gizlilik koruyucu makine öğrenimi altyapısı geliştirme projesi.',
      gorevler:[{id:1,text:'Altyapı tasarımı',done:true},{id:2,text:'Prototip implementasyon',done:false},{id:3,text:'Güvenlik testleri',done:false}],
      uyeler:[{av:'AY',color:'#00c48c',name:'Dr. Ayşe Yılmaz'},{av:'KY',color:'#f59e0b',name:'Prof. Kemal Yıldız'}] },
    { id:3, ad:'TAİS-Med Açık Veri Seti', tur:'Solo / Açık Kaynak', durum:'Tamamlandı', renk:'#f59e0b', ilerleme:90,
      baslangic:'Haz 2024', bitis:'Oca 2025', butce:'—',
      aciklama:'Tıbbi görüntüleme için açık kaynaklı Türkçe referans veri seti.',
      gorevler:[{id:1,text:'Veri toplama',done:true},{id:2,text:'Etiketleme',done:true},{id:3,text:'GitHub yayını',done:true},{id:4,text:'Makale',done:false}],
      uyeler:[{av:'AY',color:'#00c48c',name:'Dr. Ayşe Yılmaz'}] },
    { id:4, ad:'AB Horizon 2024 Başvurusu', tur:'AB Horizon', durum:'Beklemede', renk:'#06b6d4', ilerleme:15,
      baslangic:'Şub 2025', bitis:'Ara 2026', butce:'€ 450.000',
      aciklama:'Avrupa genelinde federe sağlık veri platformu oluşturma projesi.',
      gorevler:[{id:1,text:'Konsorsiyum kurulumu',done:true},{id:2,text:'Başvuru hazırlığı',done:false},{id:3,text:'Etik onaylar',done:false}],
      uyeler:[{av:'AY',color:'#00c48c',name:'Dr. Ayşe Yılmaz'},{av:'MD',color:'#3b82f6',name:'Prof. Mehmet Demir'},{av:'NŞ',color:'#ef4444',name:'Doç. Neslihan'}] },
  ])

  const durumRenk: Record<string,string> = { 'Aktif':'#00c48c', 'Tamamlandı':'#3b82f6', 'Beklemede':'#f59e0b', 'Duraklatıldı':'#ef4444' }

  const filtrelendi = projeler.filter(p => aktifTab === 'tumu' || p.durum === aktifTab)

  const gorevToggle = (projeId: number, gorevId: number) => {
    setProjeler(prev => prev.map(p => p.id === projeId
      ? {...p, gorevler: p.gorevler.map(g => g.id === gorevId ? {...g, done: !g.done} : g)}
      : p
    ))
    if (seciliProje?.id === projeId) {
      setSeciliProje(prev => prev ? {...prev, gorevler: prev.gorevler.map(g => g.id === gorevId ? {...g, done: !g.done} : g)} : null)
    }
  }

  const gorevEkle = (projeId: number) => {
    if (!yeniGorev.trim()) return
    const newG: Gorev = { id: Date.now(), text: yeniGorev, done: false }
    setProjeler(prev => prev.map(p => p.id === projeId ? {...p, gorevler: [...p.gorevler, newG]} : p))
    if (seciliProje?.id === projeId) setSeciliProje(prev => prev ? {...prev, gorevler: [...prev.gorevler, newG]} : null)
    setYeniGorev('')
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

  const tabs = [
    {key:'tumu',label:'Tümü',n:projeler.length},
    {key:'Aktif',label:'Aktif',n:projeler.filter(p=>p.durum==='Aktif').length},
    {key:'Tamamlandı',label:'Tamamlandı',n:projeler.filter(p=>p.durum==='Tamamlandı').length},
    {key:'Beklemede',label:'Beklemede',n:projeler.filter(p=>p.durum==='Beklemede').length},
  ]

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; cursor:none!important; }
        body { font-family:'DM Sans',sans-serif; background:#f2f2f0; color:#0a0a0a; height:100vh; overflow:hidden; }
        .nav-item { display:flex; align-items:center; gap:10px; padding:9px 18px; font-size:13px; color:rgba(255,255,255,0.55); transition:all 0.2s; border-left:2px solid transparent; cursor:pointer; }
        .nav-item:hover { color:#fff; background:rgba(255,255,255,0.05); }
        .nav-item.active { color:#00c48c; border-left-color:#00c48c; background:rgba(0,196,140,0.08); font-weight:600; }
        .proje-kart { background:#fff; border:1px solid rgba(0,0,0,0.07); padding:18px; cursor:pointer; transition:all 0.2s; }
        .proje-kart:hover { border-color:rgba(0,196,140,0.3); box-shadow:0 4px 16px rgba(0,0,0,0.06); transform:translateY(-1px); }
        .proje-kart.secili { border-color:#00c48c; box-shadow:0 0 0 2px rgba(0,196,140,0.15); }
        .tab-btn { padding:8px 16px; font-size:12px; font-weight:600; font-family:'DM Sans',sans-serif; border:none; background:transparent; color:rgba(0,0,0,0.4); border-bottom:2px solid transparent; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; gap:5px; }
        .tab-btn:hover { color:#0a0a0a; }
        .tab-btn.active { color:#0a0a0a; border-bottom-color:#00c48c; }
        .gorev-item { display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid rgba(0,0,0,0.05); cursor:pointer; transition:all 0.15s; }
        .gorev-item:hover { background:rgba(0,196,140,0.02); }
        .gorev-item:last-child { border-bottom:none; }
        .check-box { width:16px; height:16px; border:2px solid rgba(0,0,0,0.15); border-radius:2px; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
        .check-box.done { background:#00c48c; border-color:#00c48c; }
        .yeni-btn { background:#00c48c; color:#0a0a0a; border:none; padding:10px 20px; font-size:13px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; gap:6px; }
        .yeni-btn:hover { background:#00a87a; color:#fff; }
        .ilerleme-bar { height:6px; background:rgba(0,0,0,0.07); border-radius:3px; overflow:hidden; }
        .ilerleme-fill { height:100%; border-radius:3px; transition:width 0.6s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
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
                const isActive = '/projeler' === item.href
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
          <div style={{background:'#fff',borderBottom:'1px solid rgba(0,0,0,0.07)',padding:'0 28px',height:'52px',display:'flex',alignItems:'center',gap:'12px',flexShrink:0}}>
            <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'16px',fontWeight:700}}>Projeler</div>
            <div style={{display:'flex',gap:'0',marginLeft:'16px',borderBottom:'none'}}>
              {tabs.map(t => (
                <button key={t.key} className={`tab-btn${aktifTab===t.key?' active':''}`} onClick={() => setAktifTab(t.key)}>
                  {t.label}
                  <span style={{background:aktifTab===t.key?'#00c48c':'rgba(0,0,0,0.07)',color:aktifTab===t.key?'#0a0a0a':'rgba(0,0,0,0.4)',fontSize:'10px',fontWeight:700,padding:'1px 6px',borderRadius:'8px'}}>{t.n}</span>
                </button>
              ))}
            </div>
            <div style={{marginLeft:'auto'}}>
              <button className="yeni-btn" onClick={() => setYeniModal(true)}>
                + Yeni Proje
              </button>
            </div>
          </div>

          {/* İSTATİSTİKLER */}
          <div style={{background:'#fff',borderBottom:'1px solid rgba(0,0,0,0.07)',padding:'12px 28px',display:'flex',gap:'0',flexShrink:0}}>
            {[
              {n:projeler.length,l:'Toplam Proje',c:'#0a0a0a'},
              {n:projeler.filter(p=>p.durum==='Aktif').length,l:'Aktif',c:'#00c48c'},
              {n:projeler.reduce((s,p)=>s+p.gorevler.filter(g=>!g.done).length,0),l:'Açık Görev',c:'#f59e0b'},
              {n:projeler.filter(p=>p.durum==='Tamamlandı').length,l:'Tamamlandı',c:'#3b82f6'},
            ].map((s,i) => (
              <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'0 24px',borderRight:i<3?'1px solid rgba(0,0,0,0.07)':'none'}}>
                <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'20px',fontWeight:700,color:s.c,lineHeight:1}}>{s.n}</div>
                <div style={{fontSize:'10px',color:'rgba(0,0,0,0.35)',marginTop:'2px',textTransform:'uppercase',letterSpacing:'0.5px'}}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* İÇERİK */}
          <div style={{flex:1,overflow:'hidden',display:'grid',gridTemplateColumns:seciliProje?'1fr 380px':'1fr',transition:'grid-template-columns 0.3s'}}>

            {/* PROJE LİSTESİ */}
            <div style={{overflowY:'auto',padding:'20px 28px',display:'flex',flexDirection:'column',gap:'10px'}}>
              {filtrelendi.map(p => (
                <div key={p.id} className={`proje-kart${seciliProje?.id===p.id?' secili':''}`} onClick={() => setSeciliProje(seciliProje?.id===p.id?null:p)}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:'14px'}}>
                    {/* RENK ÇUBUK */}
                    <div style={{width:'4px',height:'60px',background:p.renk,borderRadius:'2px',flexShrink:0,marginTop:'2px'}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'6px'}}>
                        <div style={{fontSize:'15px',fontWeight:700,color:'#0a0a0a',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.ad}</div>
                        <span style={{background:durumRenk[p.durum]+'18',color:durumRenk[p.durum],fontSize:'10px',padding:'2px 10px',fontWeight:700,flexShrink:0}}>
                          {p.durum}
                        </span>
                      </div>
                      <div style={{fontSize:'12px',color:'rgba(0,0,0,0.4)',marginBottom:'10px'}}>
                        {p.tur} · {p.baslangic} — {p.bitis} · {p.butce}
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                        <div style={{flex:1}}>
                          <div className="ilerleme-bar">
                            <div className="ilerleme-fill" style={{width:`${p.ilerleme}%`,background:p.renk}}/>
                          </div>
                        </div>
                        <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'12px',fontWeight:700,color:p.renk,flexShrink:0}}>%{p.ilerleme}</div>
                        <div style={{display:'flex',gap:'4px'}}>
                          {p.uyeler.slice(0,3).map((u,i) => (
                            <div key={i} style={{width:'24px',height:'24px',borderRadius:'50%',background:u.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'8px',fontWeight:700,color:'#fff',fontFamily:"'Pixelify Sans',monospace",border:'2px solid #fff',marginLeft:i>0?'-8px':'0'}}>{u.av}</div>
                          ))}
                          {p.uyeler.length > 3 && <div style={{width:'24px',height:'24px',borderRadius:'50%',background:'rgba(0,0,0,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',fontWeight:700,color:'rgba(0,0,0,0.5)',border:'2px solid #fff',marginLeft:'-8px'}}>+{p.uyeler.length-3}</div>}
                        </div>
                        <div style={{fontSize:'11px',color:'rgba(0,0,0,0.3)'}}>
                          {p.gorevler.filter(g=>g.done).length}/{p.gorevler.length} görev
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filtrelendi.length === 0 && (
                <div style={{textAlign:'center',padding:'60px',color:'rgba(0,0,0,0.25)'}}>
                  <div style={{fontSize:'40px',marginBottom:'12px'}}>📋</div>
                  <div style={{fontSize:'14px',fontWeight:500}}>Bu kategoride proje yok</div>
                </div>
              )}
            </div>

            {/* PROJE DETAY */}
            {seciliProje && (
              <div style={{borderLeft:'1px solid rgba(0,0,0,0.07)',background:'#fff',overflowY:'auto',animation:'slideIn 0.3s ease'}}>
                {/* DETAY HEADER */}
                <div style={{padding:'16px 20px',borderBottom:'1px solid rgba(0,0,0,0.07)',background:`linear-gradient(90deg,${seciliProje.renk}15,transparent)`,position:'sticky',top:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'4px'}}>
                    <div style={{width:'10px',height:'10px',borderRadius:'50%',background:seciliProje.renk,flexShrink:0}}/>
                    <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'14px',fontWeight:700,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{seciliProje.ad}</div>
                    <button onClick={() => setSeciliProje(null)} style={{background:'none',border:'none',fontSize:'20px',color:'rgba(0,0,0,0.3)',cursor:'pointer',lineHeight:1,padding:'0 4px'}}>×</button>
                  </div>
                  <div style={{fontSize:'11px',color:'rgba(0,0,0,0.4)'}}>{seciliProje.tur}</div>
                </div>

                <div style={{padding:'16px 20px',display:'flex',flexDirection:'column',gap:'16px'}}>
                  {/* İLERLEME */}
                  <div>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
                      <span style={{fontSize:'11px',fontWeight:700,color:'rgba(0,0,0,0.4)',textTransform:'uppercase',letterSpacing:'0.5px'}}>İlerleme</span>
                      <span style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'14px',fontWeight:700,color:seciliProje.renk}}>%{seciliProje.ilerleme}</span>
                    </div>
                    <div className="ilerleme-bar" style={{height:'8px'}}>
                      <div className="ilerleme-fill" style={{width:`${seciliProje.ilerleme}%`,background:seciliProje.renk}}/>
                    </div>
                  </div>

                  {/* BİLGİLER */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                    {[
                      {l:'Durum',v:seciliProje.durum},{l:'Bütçe',v:seciliProje.butce},
                      {l:'Başlangıç',v:seciliProje.baslangic},{l:'Bitiş',v:seciliProje.bitis},
                    ].map((b,i) => (
                      <div key={i} style={{padding:'10px',background:'#f8fafc',border:'1px solid rgba(0,0,0,0.05)'}}>
                        <div style={{fontSize:'9px',color:'rgba(0,0,0,0.35)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'3px'}}>{b.l}</div>
                        <div style={{fontSize:'12px',fontWeight:600,color:'#0a0a0a'}}>{b.v}</div>
                      </div>
                    ))}
                  </div>

                  {/* AÇIKLAMA */}
                  <div>
                    <div style={{fontSize:'11px',fontWeight:700,color:'rgba(0,0,0,0.4)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'6px'}}>Açıklama</div>
                    <div style={{fontSize:'12px',color:'rgba(0,0,0,0.6)',lineHeight:1.6}}>{seciliProje.aciklama}</div>
                  </div>

                  {/* EKIP */}
                  <div>
                    <div style={{fontSize:'11px',fontWeight:700,color:'rgba(0,0,0,0.4)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'8px'}}>Ekip</div>
                    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                      {seciliProje.uyeler.map((u,i) => (
                        <div key={i} style={{display:'flex',alignItems:'center',gap:'8px'}}>
                          <div style={{width:'28px',height:'28px',borderRadius:'50%',background:u.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700,color:'#fff',fontFamily:"'Pixelify Sans',monospace",flexShrink:0}}>{u.av}</div>
                          <div style={{fontSize:'12px',color:'#0a0a0a',fontWeight:500}}>{u.name}</div>
                          {i===0 && <span style={{marginLeft:'auto',fontSize:'9px',background:'rgba(0,196,140,0.1)',color:'#00c48c',padding:'1px 6px',fontWeight:700}}>Siz</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* GÖREVLER */}
                  <div>
                    <div style={{fontSize:'11px',fontWeight:700,color:'rgba(0,0,0,0.4)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'8px'}}>
                      Görevler ({seciliProje.gorevler.filter(g=>g.done).length}/{seciliProje.gorevler.length})
                    </div>
                    <div>
                      {seciliProje.gorevler.map(g => (
                        <div key={g.id} className="gorev-item" onClick={() => gorevToggle(seciliProje.id, g.id)}>
                          <div className={`check-box${g.done?' done':''}`}>
                            {g.done && <svg viewBox="0 0 8 8" width="10" height="10"><polyline points="1 4 3.5 6.5 7 2" stroke="#0a0a0a" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
                          </div>
                          <span style={{fontSize:'12px',color:g.done?'rgba(0,0,0,0.35)':'#0a0a0a',textDecoration:g.done?'line-through':'none',flex:1}}>{g.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* GÖREV EKLE */}
                    <div style={{display:'flex',gap:'6px',marginTop:'10px'}}>
                      <input value={yeniGorev} onChange={e=>setYeniGorev(e.target.value)} onKeyDown={e=>e.key==='Enter'&&gorevEkle(seciliProje.id)} placeholder="Yeni görev ekle..." style={{flex:1,border:'1.5px solid rgba(0,0,0,0.07)',padding:'8px 10px',fontSize:'12px',fontFamily:'DM Sans,sans-serif',outline:'none',transition:'border 0.2s'}} onFocus={e=>(e.target as HTMLElement).style.borderColor='#00c48c'} onBlur={e=>(e.target as HTMLElement).style.borderColor='rgba(0,0,0,0.07)'}/>
                      <button onClick={() => gorevEkle(seciliProje.id)} style={{background:'#00c48c',color:'#0a0a0a',border:'none',padding:'8px 14px',fontWeight:700,fontSize:'13px',cursor:'pointer',fontFamily:'DM Sans,sans-serif'}}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* YENİ PROJE MODAL */}
      {yeniModal && (
        <div onClick={e=>e.target===e.currentTarget&&setYeniModal(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:9000,display:'flex',alignItems:'center',justifyContent:'center',animation:'fadeIn 0.2s ease'}}>
          <div style={{background:'#fff',width:'480px',maxHeight:'80vh',overflowY:'auto',animation:'fadeIn 0.2s ease'}}>
            <div style={{padding:'18px 20px',borderBottom:'1px solid rgba(0,0,0,0.07)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'15px',fontWeight:700}}>Yeni Proje</div>
              <button onClick={() => setYeniModal(false)} style={{background:'none',border:'none',fontSize:'20px',color:'rgba(0,0,0,0.3)',cursor:'pointer'}}>×</button>
            </div>
            <div style={{padding:'20px',display:'flex',flexDirection:'column',gap:'14px'}}>
              {[
                {l:'Proje Adı',p:'ör. Kanser Erken Tespit Sistemi',type:'text'},
                {l:'Bütçe',p:'ör. 500.000 TL',type:'text'},
                {l:'Başlangıç',p:'',type:'date'},
                {l:'Bitiş',p:'',type:'date'},
              ].map((f,i) => (
                <div key={i}>
                  <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.4)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'5px'}}>{f.l}</div>
                  <input type={f.type} placeholder={f.p} style={{width:'100%',border:'1.5px solid rgba(0,0,0,0.07)',padding:'9px 12px',fontSize:'13px',fontFamily:'DM Sans,sans-serif',outline:'none',background:'#fff'}}/>
                </div>
              ))}
              <div>
                <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.4)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'5px'}}>Tür</div>
                <select style={{width:'100%',border:'1.5px solid rgba(0,0,0,0.07)',padding:'9px 12px',fontSize:'13px',fontFamily:'DM Sans,sans-serif',outline:'none',background:'#fff'}}>
                  <option>TÜBİTAK 1001</option><option>TÜBİTAK 1002</option><option>TÜBİTAK 3501</option>
                  <option>AB Horizon</option><option>İş Birliği</option><option>Solo / Açık Kaynak</option>
                </select>
              </div>
              <div>
                <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.4)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'5px'}}>Açıklama</div>
                <textarea placeholder="Proje amacını kısaca açıklayın..." style={{width:'100%',border:'1.5px solid rgba(0,0,0,0.07)',padding:'9px 12px',fontSize:'13px',fontFamily:'DM Sans,sans-serif',outline:'none',resize:'none',minHeight:'80px',background:'#fff',lineHeight:1.6}}/>
              </div>
            </div>
            <div style={{padding:'14px 20px',borderTop:'1px solid rgba(0,0,0,0.07)',display:'flex',gap:'8px',justifyContent:'flex-end'}}>
              <button onClick={() => setYeniModal(false)} style={{background:'transparent',border:'1px solid rgba(0,0,0,0.1)',padding:'9px 20px',fontSize:'13px',fontWeight:600,fontFamily:'DM Sans,sans-serif',cursor:'pointer',color:'rgba(0,0,0,0.5)'}}>İptal</button>
              <button onClick={() => setYeniModal(false)} style={{background:'#00c48c',color:'#0a0a0a',border:'none',padding:'9px 24px',fontSize:'13px',fontWeight:700,fontFamily:'DM Sans,sans-serif',cursor:'pointer'}}>Oluştur</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
