'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { universiteler } from '../../lib/universiteler'
import { fakulteBolumler } from '../../lib/bolumler'

type Tip = 'akademisyen' | 'ogrenci' | 'firma' | ''

const TIP_BILGI = {
  akademisyen: { icon:'🎓', label:'Akademisyen', aciklama:'Öğretim üyesi · Araştırmacı', renk:'#00c48c', bg:'rgba(0,196,140,0.08)', border:'rgba(0,196,140,0.3)' },
  ogrenci:     { icon:'📚', label:'Lisansüstü Öğrenci', aciklama:'Yüksek Lisans · Doktora', renk:'#3b82f6', bg:'rgba(59,130,246,0.08)', border:'rgba(59,130,246,0.3)' },
  firma:       { icon:'🏢', label:'Firma / Kurum', aciklama:'Özel Sektör · Kamu · STK', renk:'#f59e0b', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.3)' },
}

export default function Kayit() {
  const curRef = useRef<SVGSVGElement>(null)
  const mnRef = useRef<HTMLCanvasElement>(null)
  const netRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const [adim, setAdim] = useState(1)
  const [tip, setTip] = useState<Tip>('')
  const [loading, setLoading] = useState(false)
  const [hata, setHata] = useState('')
  const [uniArama, setUniArama] = useState('')
  const [uniAcik, setUniAcik] = useState(false)
  const [seciliFakulte, setSeciliFakulte] = useState('')

  const [form, setForm] = useState({
    ad:'', soyad:'', email:'', sifre:'', sifreTekrar:'',
    universite:'', sehir:'', bolum:'', unvan:'',
    tcKimlik:'', ogrenciNo:'', danismanAd:'',
    firmaAd:'', vergiNo:'', sektor:'',
  })
  const set = (k: string, v: string) => setForm(p => ({...p, [k]: v}))

  const filtreUni = universiteler.filter(u =>
    uniArama.length > 1 && u.ad.toLowerCase().includes(uniArama.toLowerCase())
  ).slice(0, 8)

  const secUni = (u: {ad:string; sehir:string}) => {
    set('universite', u.ad); set('sehir', u.sehir)
    setUniArama(u.ad); setUniAcik(false)
  }

  useEffect(() => {
    const move = (e: MouseEvent) => { if (curRef.current) { curRef.current.style.left=(e.clientX-2)+'px'; curRef.current.style.top=(e.clientY-2)+'px' } }
    document.addEventListener('mousemove', move)
    return () => document.removeEventListener('mousemove', move)
  }, [])

  // LOGO animasyonu
  useEffect(() => {
    const mn = mnRef.current; if (!mn) return
    const mc = mn.getContext('2d')!
    const mp = [{x:3,y:3},{x:13,y:3},{x:23,y:3},{x:13,y:11},{x:13,y:22},{x:7,y:16},{x:19,y:16}]
    const mph = mp.map(() => mp.map(() => Math.random()*Math.PI*2))
    let mt = 0, raf: number
    const draw = () => {
      mc.clearRect(0,0,26,26)
      for (let i=0;i<mp.length;i++) for (let j=i+1;j<mp.length;j++) {
        const a=mp[i],b=mp[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy)
        if (d<22) { const f=Math.max(0,Math.sin(mt*0.9+mph[i][j])); mc.beginPath(); mc.moveTo(a.x,a.y); mc.lineTo(b.x,b.y); mc.strokeStyle=`rgba(0,196,140,${f*0.75*(1-d/22)})`; mc.lineWidth=0.9; mc.stroke() }
      }
      mp.forEach((p,i) => {
        const pulse=Math.sin(mt*1.5+i*0.7); const g=0.5+0.5*Math.sin(mt*0.8+i*1.2)
        mc.beginPath(); mc.arc(p.x,p.y,2+pulse*0.6,0,Math.PI*2)
        mc.fillStyle=`rgba(${Math.round(240*(1-g))},${Math.round(244*(1-g)+196*g)},${Math.round(255*(1-g)+140*g)},${0.65+0.3*pulse})`; mc.fill()
      })
      mt+=0.022; raf=requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  // SOL AĞ animasyonu
  useEffect(() => {
    const canvas = netRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let mouseX = window.innerWidth/4, mouseY = window.innerHeight/2
    const onMM = (e: MouseEvent) => { mouseX=e.clientX; mouseY=e.clientY }
    window.addEventListener('mousemove', onMM)
    const resize = () => { canvas.width=window.innerWidth; canvas.height=window.innerHeight }
    resize(); window.addEventListener('resize', resize)
    const pts = Array.from({length:35}, () => ({
      x: Math.random()*window.innerWidth/2, y: Math.random()*window.innerHeight,
      vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4, r:Math.random()*2.5+1.5, ph:Math.random()*Math.PI*2
    }))
    const lp = pts.map(() => pts.map(() => Math.random()*Math.PI*2))
    let t=0, raf: number
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height)
      const half = canvas.width/2
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy
        if(p.x<0||p.x>half) p.vx*=-1
        if(p.y<0||p.y>canvas.height) p.vy*=-1
        if(mouseX<half){const dx=mouseX-p.x,dy=mouseY-p.y,d=Math.sqrt(dx*dx+dy*dy);if(d<140){p.x+=dx*0.006;p.y+=dy*0.006}}
      })
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const a=pts[i],b=pts[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy)
        if(d<160){const fade=Math.max(0,Math.sin(t*0.7+lp[i][j]));ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(0,196,140,${fade*(1-d/160)*0.7})`;ctx.lineWidth=1.2;ctx.stroke()}
      }
      if(mouseX<half){
        pts.forEach(p=>{const dx=mouseX-p.x,dy=mouseY-p.y,d=Math.sqrt(dx*dx+dy*dy);if(d<100){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(mouseX,mouseY);ctx.strokeStyle=`rgba(0,196,140,${(1-d/100)*0.35})`;ctx.lineWidth=0.7;ctx.stroke()}})
        ctx.beginPath();ctx.arc(mouseX,mouseY,4+Math.sin(t*2)*1.5,0,Math.PI*2);ctx.fillStyle='rgba(0,196,140,0.5)';ctx.fill()
      }
      pts.forEach(p=>{const pulse=Math.sin(t*1.3+p.ph);ctx.beginPath();ctx.arc(p.x,p.y,p.r+pulse*.4,0,Math.PI*2);ctx.fillStyle=`rgba(240,244,255,${0.9+0.1*pulse})`;ctx.fill()})
      t+=0.013; raf=requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize',resize); window.removeEventListener('mousemove',onMM) }
  }, [])

  const ileri = async () => {
    setHata('')
    if (adim===1 && !tip) return setHata('Hesap tipini seçin.')
    if (adim===2) {
      if (!form.ad||!form.soyad) return setHata('Ad ve soyad zorunlu.')
      if (!form.email) return setHata('E-posta zorunlu.')
      if (tip==='akademisyen' && !form.email.endsWith('.edu.tr')) return setHata('Akademisyen için .edu.tr e-posta zorunludur.')
    }
    if (adim===3) {
      if (tip==='akademisyen' && !form.universite) return setHata('Üniversite seçin.')
      if (tip==='akademisyen' && !form.unvan) return setHata('Unvan seçin.')
      if (tip==='ogrenci' && form.tcKimlik.length!==11) return setHata('TC Kimlik No 11 haneli olmalı.')
      if (tip==='ogrenci' && !form.ogrenciNo) return setHata('Öğrenci numarası zorunlu.')
      if (tip==='firma' && form.vergiNo.length<10) return setHata('Vergi numarası 10 haneli olmalı.')
      if (tip==='firma' && !form.firmaAd) return setHata('Firma adı zorunlu.')
    }
    if (adim===4) {
      if (form.sifre.length<8) return setHata('Şifre en az 8 karakter olmalı.')
      if (form.sifre!==form.sifreTekrar) return setHata('Şifreler eşleşmiyor.')
      setLoading(true)
      const { error } = await supabase.auth.signUp({
        email: form.email, password: form.sifre,
        options: { data: { ad:form.ad, soyad:form.soyad, tip, universite:form.universite, bolum:form.bolum, unvan:form.unvan, tcKimlik:form.tcKimlik, ogrenciNo:form.ogrenciNo, firmaAd:form.firmaAd, vergiNo:form.vergiNo, sektor:form.sektor } }
      })
      setLoading(false)
      if (error) return setHata(error.message.includes('already registered')?'Bu e-posta zaten kayıtlı.':'Hata: '+error.message)
      return setAdim(5)
    }
    setAdim(a=>a+1)
  }

  const inputS: React.CSSProperties = { width:'100%', border:'1.5px solid rgba(0,0,0,0.09)', padding:'11px 14px', fontSize:'13px', fontFamily:"'DM Sans',sans-serif", outline:'none', background:'rgba(255,255,255,0.85)', borderRadius:'2px', color:'#0a0a0a', transition:'all 0.2s' }
  const labelS: React.CSSProperties = { fontSize:'9px', fontWeight:700, color:'rgba(0,0,0,0.4)', letterSpacing:'1.5px', textTransform:'uppercase', display:'block', marginBottom:'6px' }
  const adimlar = ['Tip','Bilgiler','Detaylar','Şifre']
  const aktifRenk = tip ? TIP_BILGI[tip].renk : '#00c48c'

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; cursor:none!important; }
        body { overflow:hidden; font-family:'DM Sans',sans-serif; }
        input:focus, select:focus { border-color:${aktifRenk}!important; box-shadow:0 0 0 3px ${aktifRenk}18!important; outline:none; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @media (max-width:900px) { .split { grid-template-columns:1fr!important; } .sol { display:none!important; } }
      `}</style>

      <svg ref={curRef} style={{position:'fixed',top:0,left:0,zIndex:9999,pointerEvents:'none'}} width="20" height="20" viewBox="0 0 10 10">
        <rect x="0" y="0" width="2" height="2" fill="#00c48c"/><rect x="0" y="2" width="2" height="2" fill="#00c48c"/>
        <rect x="0" y="4" width="2" height="2" fill="#00c48c"/><rect x="0" y="6" width="2" height="2" fill="#00c48c"/>
        <rect x="0" y="8" width="2" height="2" fill="#00c48c"/><rect x="2" y="2" width="2" height="2" fill="#00c48c"/>
        <rect x="4" y="4" width="2" height="2" fill="#00c48c"/><rect x="4" y="6" width="2" height="2" fill="#00c48c"/>
        <rect x="6" y="6" width="2" height="2" fill="#00c48c"/><rect x="6" y="8" width="2" height="2" fill="#00c48c"/>
      </svg>

      <canvas ref={netRef} style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',zIndex:1,pointerEvents:'none'}}/>

      <div className="split" style={{position:'relative',zIndex:2,height:'100vh',display:'grid',gridTemplateColumns:'1fr 1fr'}}>

        {/* SOL */}
        <div className="sol" style={{background:'#0a0a0a',display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'40px 48px'}}>

          {/* Logo */}
          <div onClick={()=>router.push('/')} style={{display:'flex',alignItems:'center',gap:'10px',cursor:'pointer'}}>
            <canvas ref={mnRef} width="26" height="26"/>
            <span style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'22px',fontWeight:700,background:'linear-gradient(90deg,#00c48c,#fff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>tais.tr</span>
          </div>

          {/* Orta */}
          <div>
            <h1 style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'clamp(32px,3vw,48px)',fontWeight:300,lineHeight:1.2,letterSpacing:'-2px',color:'#f0f4ff',marginBottom:'16px'}}>
              Akademik<br/>
              <strong style={{fontWeight:700,color:'#00c48c'}}>ekosisteme<br/>katıl.</strong>
            </h1>
            <p style={{fontSize:'13px',color:'rgba(255,255,255,0.35)',lineHeight:1.7,maxWidth:'320px'}}>
              Türkiye'nin YZ destekli akademik platformunda yerinizi alın. Araştırın, iş birliği yapın, büyüyün.
            </p>

            {/* Tip seçiliyse göster */}
            {tip && (
              <div style={{marginTop:'24px',padding:'14px 16px',border:`1px solid ${TIP_BILGI[tip].border}`,background:TIP_BILGI[tip].bg.replace('0.08','0.05'),animation:'fadeUp 0.4s ease'}}>
                <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',marginBottom:'4px',letterSpacing:'1px',textTransform:'uppercase'}}>Seçilen Tip</div>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <span style={{fontSize:'20px'}}>{TIP_BILGI[tip].icon}</span>
                  <div>
                    <div style={{fontSize:'14px',fontWeight:600,color:TIP_BILGI[tip].renk}}>{TIP_BILGI[tip].label}</div>
                    <div style={{fontSize:'11px',color:'rgba(255,255,255,0.35)'}}>{TIP_BILGI[tip].aciklama}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Alt sayaçlar */}
          <div style={{display:'flex',gap:'24px'}}>
            {[{n:'4.720',l:'Akademisyen'},{n:'187',l:'Üniversite'},{n:'1.340',l:'Proje'}].map((s,i)=>(
              <div key={i}>
                <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'22px',fontWeight:700,color:'#00c48c',lineHeight:1}}>{s.n}</div>
                <div style={{fontSize:'9px',color:'rgba(255,255,255,0.3)',letterSpacing:'1px',textTransform:'uppercase',marginTop:'2px'}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SAĞ */}
        <div style={{
          background:'linear-gradient(135deg,#fafaf8,#f0f8f5)',
          display:'flex',flexDirection:'column',justifyContent:'center',
          padding:'32px 52px',overflowY:'auto',position:'relative',
          clipPath:'polygon(0% 0%,100% 0%,100% 100%,0% 100%,0% 96.4%,4% 94.6%,0% 92.8%,4% 91%,0% 89.2%,4% 87.4%,0% 85.6%,4% 83.8%,0% 82%,4% 80.2%,0% 78.4%,4% 76.6%,0% 74.8%,4% 73%,0% 71.2%,4% 69.4%,0% 67.6%,4% 65.8%,0% 64%,4% 62.2%,0% 60.4%,4% 58.6%,0% 56.8%,4% 55%,0% 53.2%,4% 51.4%,0% 49.6%,4% 47.8%,0% 46%,4% 44.2%,0% 42.4%,4% 40.6%,0% 38.8%,4% 37%,0% 35.2%,4% 33.4%,0% 31.6%,4% 29.8%,0% 28%,4% 26.2%,0% 24.4%,4% 22.6%,0% 20.8%,4% 19%,0% 17.2%,4% 15.4%,0% 13.6%,4% 11.8%,0% 10%,4% 8.2%,0% 6.4%,4% 4.6%,0% 2.8%,4% 1%,0% 0%)'
        }}>
          {/* Watermark */}
          <div style={{position:'absolute',bottom:-20,right:-10,fontFamily:"'Pixelify Sans',monospace",fontSize:'180px',fontWeight:700,color:'rgba(0,196,140,0.04)',lineHeight:1,userSelect:'none',pointerEvents:'none',transform:'rotate(-8deg)',letterSpacing:'-8px'}}>tais</div>

          {adim < 5 ? (
            <div style={{position:'relative',zIndex:1,maxWidth:'420px',width:'100%',margin:'0 auto'}}>

              {/* STEPPER */}
              <div style={{display:'flex',alignItems:'center',marginBottom:'28px'}}>
                {adimlar.map((a,i) => (
                  <div key={i} style={{display:'flex',alignItems:'center',flex:i<adimlar.length-1?1:'auto'}}>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'3px'}}>
                      <div style={{width:'28px',height:'28px',borderRadius:'50%',background:adim>i+1?aktifRenk:adim===i+1?'#0a0a0a':'rgba(0,0,0,0.08)',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.3s',flexShrink:0}}>
                        {adim>i+1
                          ? <svg viewBox="0 0 10 10" width="12" height="12"><polyline points="2 5 4.5 7.5 8 2.5" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                          : <span style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'11px',fontWeight:700,color:adim===i+1?aktifRenk:'rgba(0,0,0,0.3)'}}>{i+1}</span>
                        }
                      </div>
                      <span style={{fontSize:'8px',color:adim===i+1?'#0a0a0a':'rgba(0,0,0,0.3)',fontWeight:adim===i+1?700:400,letterSpacing:'0.3px',whiteSpace:'nowrap'}}>{a}</span>
                    </div>
                    {i<adimlar.length-1 && <div style={{flex:1,height:'2px',background:adim>i+1?aktifRenk:'rgba(0,0,0,0.07)',margin:'0 6px',marginBottom:'14px',transition:'background 0.3s'}}/>}
                  </div>
                ))}
              </div>

              {/* KART */}
              <div style={{background:'#fff',border:'1px solid rgba(0,0,0,0.07)',padding:'24px',boxShadow:'0 2px 16px rgba(0,0,0,0.04)',animation:'fadeUp 0.35s ease'}}>

                {/* ADIM 1 — TİP */}
                {adim===1 && (
                  <div>
                    <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'18px',fontWeight:700,color:'#0a0a0a',marginBottom:'4px'}}>Hesap Tipini Seç</div>
                    <div style={{fontSize:'12px',color:'rgba(0,0,0,0.4)',marginBottom:'18px'}}>Sana özel deneyim sunalım</div>
                    <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                      {(Object.entries(TIP_BILGI) as [Tip, typeof TIP_BILGI[keyof typeof TIP_BILGI]][]).map(([key, val]) => (
                        <div key={key} onClick={()=>setTip(key)}
                          style={{display:'flex',alignItems:'center',gap:'14px',padding:'14px 16px',border:`2px solid ${tip===key?val.renk:'rgba(0,0,0,0.07)'}`,background:tip===key?val.bg:'transparent',cursor:'pointer',transition:'all 0.2s',borderRadius:'2px'}}>
                          <div style={{width:'40px',height:'40px',borderRadius:'50%',background:tip===key?val.renk+'22':'rgba(0,0,0,0.05)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',flexShrink:0,transition:'all 0.2s'}}>
                            {val.icon}
                          </div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:'13px',fontWeight:700,color:tip===key?val.renk:'#0a0a0a',marginBottom:'2px',transition:'color 0.2s'}}>{val.label}</div>
                            <div style={{fontSize:'11px',color:'rgba(0,0,0,0.4)'}}>{val.aciklama}</div>
                          </div>
                          <div style={{width:'16px',height:'16px',borderRadius:'50%',border:`2px solid ${tip===key?val.renk:'rgba(0,0,0,0.15)'}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all 0.2s'}}>
                            {tip===key && <div style={{width:'8px',height:'8px',borderRadius:'50%',background:val.renk}}/>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ADIM 2 — KİŞİSEL */}
                {adim===2 && (
                  <div>
                    <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'18px',fontWeight:700,color:'#0a0a0a',marginBottom:'4px'}}>Kişisel Bilgiler</div>
                    <div style={{fontSize:'12px',color:'rgba(0,0,0,0.4)',marginBottom:'18px'}}>Gerçek adınızı girin</div>
                    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                        <div><label style={labelS}>Ad</label><input style={inputS} placeholder="Ayşe" value={form.ad} onChange={e=>set('ad',e.target.value)}/></div>
                        <div><label style={labelS}>Soyad</label><input style={inputS} placeholder="Yılmaz" value={form.soyad} onChange={e=>set('soyad',e.target.value)}/></div>
                      </div>
                      <div>
                        <label style={labelS}>E-posta {tip==='akademisyen' && <span style={{color:'#ef4444',textTransform:'none',letterSpacing:0,fontSize:'9px'}}> — .edu.tr zorunlu</span>}</label>
                        <input style={inputS} type="email"
                          placeholder={tip==='akademisyen'?'ad@universite.edu.tr':tip==='firma'?'kurumsal@firma.com':'eposta@ornek.com'}
                          value={form.email} onChange={e=>set('email',e.target.value)}/>
                      </div>
                    </div>
                  </div>
                )}

                {/* ADIM 3 — DETAYLAR */}
                {adim===3 && (
                  <div>
                    <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'18px',fontWeight:700,color:'#0a0a0a',marginBottom:'4px'}}>Kurumsal Bilgiler</div>
                    <div style={{fontSize:'12px',color:'rgba(0,0,0,0.4)',marginBottom:'18px'}}>
                      {tip==='ogrenci'?'Bilgileriniz güvenle saklanır.':'Kurumunuzu doğrulayın.'}
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>

                      {tip==='akademisyen' && <>
                        <div>
                          <label style={labelS}>Unvan</label>
                          <select style={{...inputS,background:'#fff'}} value={form.unvan} onChange={e=>set('unvan',e.target.value)}>
                            <option value="">Seçin</option>
                            <option>Prof. Dr.</option><option>Doç. Dr.</option><option>Dr. Öğr. Üyesi</option>
                            <option>Araştırma Görevlisi</option><option>Öğretim Görevlisi</option>
                          </select>
                        </div>
                        <div style={{position:'relative'}}>
                          <label style={labelS}>Üniversite</label>
                          <input style={inputS} placeholder="Üniversite ara..." value={uniArama}
                            onChange={e=>{setUniArama(e.target.value);setUniAcik(true)}}
                            onFocus={()=>setUniAcik(true)} onBlur={()=>setTimeout(()=>setUniAcik(false),200)}/>
                          {uniAcik && filtreUni.length>0 && (
                            <div style={{position:'absolute',top:'100%',left:0,right:0,background:'#fff',border:'1.5px solid rgba(0,196,140,0.3)',zIndex:100,maxHeight:'180px',overflowY:'auto',boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
                              {filtreUni.map((u,i)=>(
                                <div key={i} onMouseDown={()=>secUni(u)} style={{padding:'8px 14px',cursor:'pointer',fontSize:'12px',borderBottom:'1px solid rgba(0,0,0,0.04)',display:'flex',justifyContent:'space-between'}}
                                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#fafffd'}
                                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='transparent'}>
                                  <span>{u.ad}</span><span style={{color:'rgba(0,0,0,0.35)',fontSize:'11px'}}>{u.sehir}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {form.sehir && <div style={{fontSize:'11px',color:'#00c48c',marginTop:'-6px'}}>📍 {form.sehir}</div>}
                        <div>
                          <label style={labelS}>Fakülte</label>
                          <select style={{...inputS,background:'#fff'}} value={seciliFakulte} onChange={e=>{setSeciliFakulte(e.target.value);set('bolum','')}}>
                            <option value="">Fakülte seçin</option>
                            {fakulteBolumler.map((f,i)=><option key={i} value={f.fakulte}>{f.fakulte}</option>)}
                          </select>
                        </div>
                        {seciliFakulte && <div>
                          <label style={labelS}>Bölüm / Anabilim Dalı</label>
                          <select style={{...inputS,background:'#fff'}} value={form.bolum} onChange={e=>set('bolum',e.target.value)}>
                            <option value="">Bölüm seçin</option>
                            {fakulteBolumler.find(f=>f.fakulte===seciliFakulte)?.bolumler.map((b,i)=><option key={i} value={b}>{b}</option>)}
                          </select>
                        </div>}
                      </>}

                      {tip==='ogrenci' && <>
                        <div style={{padding:'9px 12px',background:'rgba(59,130,246,0.06)',border:'1px solid rgba(59,130,246,0.15)',fontSize:'11px',color:'rgba(0,0,0,0.5)',lineHeight:1.5}}>
                          🔒 TC Kimlik bilginiz şifrelenerek saklanır.
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                          <div><label style={labelS}>TC Kimlik No</label><input style={inputS} placeholder="12345678901" maxLength={11} value={form.tcKimlik} onChange={e=>set('tcKimlik',e.target.value.replace(/\D/g,''))}/></div>
                          <div><label style={labelS}>Öğrenci No</label><input style={inputS} placeholder="2021001234" value={form.ogrenciNo} onChange={e=>set('ogrenciNo',e.target.value)}/></div>
                        </div>
                        <div style={{position:'relative'}}>
                          <label style={labelS}>Üniversite</label>
                          <input style={inputS} placeholder="Üniversite ara..." value={uniArama}
                            onChange={e=>{setUniArama(e.target.value);setUniAcik(true)}}
                            onFocus={()=>setUniAcik(true)} onBlur={()=>setTimeout(()=>setUniAcik(false),200)}/>
                          {uniAcik && filtreUni.length>0 && (
                            <div style={{position:'absolute',top:'100%',left:0,right:0,background:'#fff',border:'1.5px solid rgba(59,130,246,0.3)',zIndex:100,maxHeight:'180px',overflowY:'auto',boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
                              {filtreUni.map((u,i)=>(
                                <div key={i} onMouseDown={()=>secUni(u)} style={{padding:'8px 14px',cursor:'pointer',fontSize:'12px',borderBottom:'1px solid rgba(0,0,0,0.04)',display:'flex',justifyContent:'space-between'}}>
                                  <span>{u.ad}</span><span style={{color:'rgba(0,0,0,0.35)',fontSize:'11px'}}>{u.sehir}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {form.sehir && <div style={{fontSize:'11px',color:'#3b82f6',marginTop:'-6px'}}>📍 {form.sehir}</div>}
                        <div>
                          <label style={labelS}>Program</label>
                          <select style={{...inputS,background:'#fff'}} value={form.bolum} onChange={e=>set('bolum',e.target.value)}>
                            <option value="">Seçin</option><option>Yüksek Lisans</option><option>Doktora</option>
                          </select>
                        </div>
                        <div><label style={labelS}>Danışman Adı (opsiyonel)</label><input style={inputS} placeholder="Prof. Dr. Ad Soyad" value={form.danismanAd} onChange={e=>set('danismanAd',e.target.value)}/></div>
                      </>}

                      {tip==='firma' && <>
                        <div><label style={labelS}>Firma Adı</label><input style={inputS} placeholder="Firma A.Ş." value={form.firmaAd} onChange={e=>set('firmaAd',e.target.value)}/></div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                          <div><label style={labelS}>Vergi Numarası</label><input style={inputS} placeholder="1234567890" maxLength={10} value={form.vergiNo} onChange={e=>set('vergiNo',e.target.value.replace(/\D/g,''))}/></div>
                          <div>
                            <label style={labelS}>Sektör</label>
                            <select style={{...inputS,background:'#fff'}} value={form.sektor} onChange={e=>set('sektor',e.target.value)}>
                              <option value="">Seçin</option>
                              <option>Sağlık Teknolojisi</option><option>Biyoteknoloji</option><option>Yazılım</option>
                              <option>Enerji</option><option>Tarım</option><option>Fintech</option><option>Diğer</option>
                            </select>
                          </div>
                        </div>
                      </>}
                    </div>
                  </div>
                )}

                {/* ADIM 4 — ŞİFRE */}
                {adim===4 && (
                  <div>
                    <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'18px',fontWeight:700,color:'#0a0a0a',marginBottom:'4px'}}>Şifre Oluştur</div>
                    <div style={{fontSize:'12px',color:'rgba(0,0,0,0.4)',marginBottom:'18px'}}>En az 8 karakter</div>
                    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                      <div><label style={labelS}>Şifre</label><input style={inputS} type="password" placeholder="En az 8 karakter" value={form.sifre} onChange={e=>set('sifre',e.target.value)}/></div>
                      <div><label style={labelS}>Şifre Tekrar</label><input style={inputS} type="password" placeholder="••••••••" value={form.sifreTekrar} onChange={e=>set('sifreTekrar',e.target.value)}/></div>
                      <div style={{display:'flex',gap:'4px'}}>
                        {[1,2,3,4].map(i=>(
                          <div key={i} style={{flex:1,height:'3px',borderRadius:'2px',transition:'background 0.3s',background:form.sifre.length>=i*2?i<=1?'#ef4444':i<=2?'#f59e0b':i<=3?'#3b82f6':aktifRenk:'rgba(0,0,0,0.07)'}}/>
                        ))}
                      </div>
                      <div style={{fontSize:'11px',color:'rgba(0,0,0,0.3)'}}>
                        Kayıt olarak <span style={{color:aktifRenk}}>Kullanım Koşulları</span>'nı kabul etmiş olursunuz.
                      </div>
                    </div>
                  </div>
                )}

                {/* HATA */}
                {hata && <div style={{marginTop:'12px',padding:'9px 14px',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',fontSize:'12px',color:'#ef4444'}}>⚠️ {hata}</div>}

                {/* BUTONLAR */}
                <div style={{display:'flex',gap:'8px',marginTop:'18px'}}>
                  {adim>1 && <button onClick={()=>{setAdim(a=>a-1);setHata('')}} style={{background:'rgba(0,0,0,0.05)',border:'none',padding:'11px 18px',fontSize:'12px',fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:'pointer',color:'rgba(0,0,0,0.5)',transition:'all 0.2s'}}>← Geri</button>}
                  <button onClick={ileri} disabled={loading} style={{flex:1,background:loading?'#ccc':aktifRenk,color:tip==='ogrenci'||tip==='firma'?'#fff':'#0a0a0a',border:'none',padding:'11px',fontSize:'13px',fontWeight:700,fontFamily:"'DM Sans',sans-serif",cursor:loading?'not-allowed':'pointer',transition:'all 0.2s'}}>
                    {loading?'Kaydediliyor...':adim===4?'Kayıt Ol →':'İleri →'}
                  </button>
                </div>
              </div>

              <div style={{textAlign:'center',marginTop:'14px',fontSize:'12px',color:'rgba(0,0,0,0.35)'}}>
                Zaten hesabın var mı? <span onClick={()=>router.push('/')} style={{color:aktifRenk,fontWeight:600,cursor:'pointer'}}>Giriş yap</span>
              </div>
            </div>
          ) : (
            /* ADIM 5 — BAŞARILI */
            <div style={{position:'relative',zIndex:1,textAlign:'center',maxWidth:'380px',margin:'0 auto',animation:'fadeUp 0.5s ease'}}>
              <div style={{fontSize:'56px',marginBottom:'16px'}}>📬</div>
              <h2 style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'22px',fontWeight:700,color:'#0a0a0a',marginBottom:'10px',letterSpacing:'-1px'}}>E-postanı doğrula</h2>
              <p style={{fontSize:'13px',color:'rgba(0,0,0,0.5)',lineHeight:1.7,marginBottom:'6px'}}>
                <strong style={{color:'#0a0a0a'}}>{form.email}</strong> adresine doğrulama bağlantısı gönderildi.
              </p>
              <p style={{fontSize:'12px',color:'rgba(0,0,0,0.35)',lineHeight:1.6,marginBottom:'24px'}}>
                Spam klasörünü de kontrol etmeyi unutma.
              </p>
              <button onClick={()=>router.push('/')} style={{background:aktifRenk,color:tip==='ogrenci'||tip==='firma'?'#fff':'#0a0a0a',border:'none',padding:'12px 28px',fontSize:'13px',fontWeight:700,fontFamily:"'DM Sans',sans-serif",cursor:'pointer'}}>
                Giriş Sayfasına Git →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
