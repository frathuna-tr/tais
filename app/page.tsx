'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function Home() {
  const netRef = useRef<HTMLCanvasElement>(null)
  const mnRef = useRef<HTMLCanvasElement>(null)
  const curRef = useRef<SVGSVGElement>(null)
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [sifre, setSifre] = useState('')
  const [loading, setLoading] = useState(false)
  const [hata, setHata] = useState('')
  const [typeText, setTypeText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [taisMode, setTaisMode] = useState(false)
  const [taisPhase, setTaisPhase] = useState(0) // 0=normal, 1=blink, 2=tais var, 3=ekosistem
  const [taisTypeText, setTaisTypeText] = useState('')
  const [taisCursor, setTaisCursor] = useState(true)
  const [ekoStep, setEkoStep] = useState(0)

  // PIXEL CURSOR
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

  // CURSOR BLINK
  useEffect(() => {
    const iv = setInterval(() => setShowCursor(p => !p), 500)
    return () => clearInterval(iv)
  }, [])

  // TAİS CURSOR BLINK
  useEffect(() => {
    const iv = setInterval(() => setTaisCursor(p => !p), 500)
    return () => clearInterval(iv)
  }, [])

  // TYPEWRITER
  useEffect(() => {
    const phrases = ['yalnız değil.', 'desteği var.', 'gücü var.']
    let pi = 0
    let stopped = false
    let t1: ReturnType<typeof setTimeout>

    const typePhrase = (text: string, i: number) => {
      if (stopped) return
      setTypeText(text.slice(0, i))
      if (i < text.length) {
        t1 = setTimeout(() => typePhrase(text, i + 1), 80)
      } else {
        t1 = setTimeout(() => erasePhrase(text, text.length), 1200)
      }
    }

    const erasePhrase = (text: string, i: number) => {
      if (stopped) return
      setTypeText(text.slice(0, i))
      if (i > 0) {
        t1 = setTimeout(() => erasePhrase(text, i - 1), 40)
      } else {
        pi = pi + 1
        if (pi < phrases.length) {
          t1 = setTimeout(() => typePhrase(phrases[pi], 0), 400)
        } else {
          // Hepsi bitti — imleç 3 kez yanıp sönsün, sonra tais var
          let blinkCount = 0
          setTaisMode(true)
          setTaisPhase(1) // blink fazı
          const blinkIv = setInterval(() => {
            blinkCount++
            if (blinkCount >= 6) { // 3 yanıp sönme = 6 adım
              clearInterval(blinkIv)
              setTaisPhase(2) // tais var
              // "tais var." harfleri tek tek yaz
              let ti = 0
              const txt = 'tais var.'
              const taisIv = setInterval(() => {
                ti++
                setTaisTypeText(txt.slice(0, ti))
                if (ti >= txt.length) clearInterval(taisIv)
              }, 90)
              t1 = setTimeout(() => {
                setTaisPhase(3)
                setEkoStep(0)
                // 2sn sonra yapay zeka destekli / akademik ekosistemi göster
                t1 = setTimeout(() => {
                  setEkoStep(1)
                }, 2000)
                // 4.5sn sonra başa dön
                t1 = setTimeout(() => {
                  setTaisMode(false)
                  setTaisPhase(0)
                  setEkoStep(0)
                  setTypeText('')
                  pi = 0
                  t1 = setTimeout(() => typePhrase(phrases[pi], 0), 600)
                }, 4500)
              }, 4000)
            }
          }, 300)
        }
      }
    }

    t1 = setTimeout(() => typePhrase(phrases[pi], 0), 1200)
    return () => { stopped = true; clearTimeout(t1) }
  }, [])

  // MİKRO NETWORK — LOGO
  useEffect(() => {
    const mn = mnRef.current
    if (!mn) return
    const mc = mn.getContext('2d')!
    const mp = [{x:3,y:3},{x:13,y:3},{x:23,y:3},{x:13,y:11},{x:13,y:22},{x:7,y:16},{x:19,y:16}]
    const mph = mp.map(() => mp.map(() => Math.random() * Math.PI * 2))
    let mt = 0, raf: number
    const drawMn = () => {
      mc.clearRect(0, 0, 26, 26)
      for (let i = 0; i < mp.length; i++) for (let j = i + 1; j < mp.length; j++) {
        const a = mp[i], b = mp[j], dx = a.x-b.x, dy = a.y-b.y, d = Math.sqrt(dx*dx+dy*dy)
        if (d < 22) {
          const fade = Math.max(0, Math.sin(mt * 0.9 + mph[i][j]))
          mc.beginPath(); mc.moveTo(a.x, a.y); mc.lineTo(b.x, b.y)
          mc.strokeStyle = `rgba(0,196,140,${fade*0.75*(1-d/22)})`; mc.lineWidth = 0.9; mc.stroke()
        }
      }
      mp.forEach((p, i) => {
        const pulse = Math.sin(mt * 1.5 + i * 0.7)
        const g = 0.5 + 0.5 * Math.sin(mt * 0.8 + i * 1.2)
        mc.beginPath(); mc.arc(p.x, p.y, 2 + pulse * 0.6, 0, Math.PI * 2)
        mc.fillStyle = `rgba(${Math.round(240*(1-g))},${Math.round(244*(1-g)+196*g)},${Math.round(255*(1-g)+140*g)},${0.65+0.3*pulse})`
        mc.fill()
      })
      mt += 0.022; raf = requestAnimationFrame(drawMn)
    }
    drawMn()
    return () => cancelAnimationFrame(raf)
  }, [])

  // ANA AĞ CANVAS — mouse çekme efekti, sadece sol
  useEffect(() => {
    const canvas = netRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let mouseX = window.innerWidth / 4
    let mouseY = window.innerHeight / 2
    const onMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY }
    window.addEventListener('mousemove', onMouseMove)
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const pts = Array.from({length: 45}, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - .5) * .45,
      vy: (Math.random() - .5) * .45,
      r: Math.random() * 3 + 2,
      ph: Math.random() * Math.PI * 2
    }))
    const lp = pts.map(() => pts.map(() => Math.random() * Math.PI * 2))
    let t = 0, raf: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const half = canvas.width / 2

      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        // Mouse çekme — sadece sol yarı
        if (p.x < half) {
          const dx = mouseX - p.x, dy = mouseY - p.y, d = Math.sqrt(dx*dx+dy*dy)
          if (d < 150) { p.x += dx * 0.006; p.y += dy * 0.006 }
        }
      })

      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j], dx = a.x-b.x, dy = a.y-b.y, d = Math.sqrt(dx*dx+dy*dy)
        if (d < 180) {
          const fade = Math.max(0, Math.sin(t * 0.7 + lp[i][j]))
          const isR = (a.x + b.x) / 2 > half
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(0,196,140,${fade*(1-d/180)*(isR?0:0.8)})`
          ctx.lineWidth = 1.4; ctx.stroke()
        }
      }

      // Mouse noktası ve hatları
      if (mouseX < half) {
        pts.forEach(p => {
          if (p.x < half) {
            const dx = mouseX-p.x, dy = mouseY-p.y, d = Math.sqrt(dx*dx+dy*dy)
            if (d < 100) {
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouseX, mouseY)
              ctx.strokeStyle = `rgba(0,196,140,${(1-d/100)*0.35})`; ctx.lineWidth=0.7; ctx.stroke()
            }
          }
        })
        ctx.beginPath(); ctx.arc(mouseX, mouseY, 4+Math.sin(t*2)*1.5, 0, Math.PI*2)
        ctx.fillStyle = 'rgba(0,196,140,0.5)'; ctx.fill()
      }

      pts.forEach(p => {
        const pulse = Math.sin(t * 1.3 + p.ph)
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r + pulse * 0.5, 0, Math.PI * 2)
        // Sağ taraf noktaları görünmez
        ctx.fillStyle = p.x > half
          ? `rgba(0,0,0,0)`
          : `rgba(240,244,255,${0.9+0.1*pulse})`
        ctx.fill()
      })

      t += 0.013; raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMouseMove) }
  }, [])

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; cursor: none !important; }
        body { overflow: hidden; }
        .fi { width:100%; background:#fff; border:1.5px solid rgba(0,0,0,0.1); padding:12px 14px; font-size:14px; color:#0a0a0a; font-family:'DM Sans',sans-serif; outline:none; transition:all 0.2s; box-shadow:0 1px 3px rgba(0,0,0,0.04); border-radius:2px; }
        .fi:focus { border-color:#00c48c; box-shadow:0 0 0 3px rgba(0,196,140,0.08); }
        .fi::placeholder { color:rgba(0,0,0,0.25); font-size:13px; }
        .fbtn { width:100%; background:#0a0a0a; color:#fff; border:none; padding:14px 24px; font-size:14px; font-weight:600; font-family:'DM Sans',sans-serif; display:flex; align-items:center; justify-content:space-between; cursor:pointer; transition:all 0.2s; border-radius:2px; letter-spacing:0.3px; }
        .fbtn:hover { background:#00c48c; color:#0a0a0a; }
        @keyframes taisIn { from { opacity:0; transform:scale(0.9) translateY(16px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes blinkCursor { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes shimmer { 0%{background-position:100% 0} 100%{background-position:-100% 0} }
        @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes metalShimmer { 0%{background-position:100% 0} 100%{background-position:-100% 0} }
        @media (max-width: 900px) {
          .layout { grid-template-columns: 1fr !important; }
          .bg-left { width: 100% !important; height: 50% !important; }
          .bg-right { width: 100% !important; height: 50% !important; top: 50% !important; }
          .banner { padding: 28px 32px !important; min-height: 50vh; }
          .panel { padding: 32px !important; clip-path: none !important; }
          .bname-el, .bdiv-el { display: none !important; }
        }
      `}</style>

      {/* PIXEL CURSOR */}
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
      </svg>

      {/* ARKA PLANLAR */}
      <div className="bg-left" style={{ position: 'fixed', top: 0, left: 0, width: '50%', height: '100%', background: '#0a0a0a', zIndex: 0 }}/>
      <div className="bg-right" style={{ position: 'fixed', top: 0, right: 0, width: '50%', height: '100%', background: 'linear-gradient(135deg,#fafaf8 0%,#f5f8f5 100%)', zIndex: 0 }}/>

      {/* ANA CANVAS */}
      <canvas ref={netRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}/>

      {/* LAYOUT */}
      <div className="layout" style={{ position: 'relative', zIndex: 2, height: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', fontFamily: "'DM Sans', sans-serif" }}>

        {/* SOL BANNER */}
        <div className="banner" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px 52px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <canvas ref={mnRef} width="26" height="26" style={{ flexShrink: 0, display: 'block' }}/>
            <span style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '22px', fontWeight: 700, background: 'linear-gradient(90deg,#00c48c,#fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', whiteSpace: 'nowrap' }}>tais.tr</span>
            <div className="bdiv-el" style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.15)', flexShrink: 0 }}/>
            <span className="bname-el" style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px', whiteSpace: 'nowrap' }}>TÜRKİYE AKADEMİK İŞBİRLİĞİ SİSTEMİ</span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {taisMode ? (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', width:'100%' }}>
                {taisPhase === 1 && (
                  // İmleç 3 kez yanıp söner
                  <span style={{ fontFamily:"'Pixelify Sans',monospace", fontSize:'clamp(32px,3.5vw,52px)', fontWeight:700, color:'#00c48c', letterSpacing:'-1px', lineHeight:1.15, animation:'blinkCursor 0.6s step-end 3' }}>
                    ▋
                  </span>
                )}
                {taisPhase === 2 && (
                  <div style={{ textAlign:'center' }}>
                    {taisTypeText.length < 9 ? (
                      <span style={{ fontFamily:"'Pixelify Sans',monospace", fontSize:'clamp(56px,6vw,88px)', fontWeight:700, letterSpacing:'-3px', lineHeight:1, display:'block', color:'#00c48c' }}>
                        {taisTypeText}<span style={{ opacity: taisCursor ? 1 : 0 }}>▋</span>
                      </span>
                    ) : (
                      <span style={{ fontFamily:"'Pixelify Sans',monospace", fontSize:'clamp(56px,6vw,88px)', fontWeight:700, letterSpacing:'-3px', lineHeight:1, display:'block', backgroundImage:'linear-gradient(90deg,#00c48c 0%,#00c48c 20%,#a8ffdf 40%,#ffffff 50%,#a8ffdf 60%,#00c48c 80%,#00c48c 100%)', backgroundSize:'250% 100%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'metalShimmer 1.6s ease 0.2s forwards' }}>
                        {taisTypeText}
                      </span>
                    )}
                  </div>
                )}
                {taisPhase === 3 && (
                  <div style={{ textAlign:'center' }}>
                    {ekoStep === 0 && (
                      <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(32px,3.8vw,56px)', fontWeight:300, color:'#fff', letterSpacing:'-1px', lineHeight:1.15, display:'block', animation:'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0s both' }}>
                          Dünyanın
                        </span>
                        <span style={{ fontFamily:"'Pixelify Sans',monospace", fontSize:'clamp(40px,4.8vw,68px)', fontWeight:700, color:'#00c48c', letterSpacing:'-2px', lineHeight:1.15, display:'block', animation:'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both' }}>
                          ilk ve tek
                        </span>
                      </div>
                    )}
                    {ekoStep === 1 && (
                      <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                        <span style={{ fontFamily:"'Pixelify Sans',monospace", fontSize:'clamp(36px,4.2vw,62px)', fontWeight:700, color:'#00c48c', letterSpacing:'-2px', lineHeight:1.15, display:'block', animation:'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0s both' }}>
                          yapay zeka destekli
                        </span>
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(32px,3.8vw,56px)', fontWeight:300, color:'#fff', letterSpacing:'-1px', lineHeight:1.15, display:'block', animation:'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both' }}>
                          akademik ekosistemi
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <h1 style={{ fontSize: 'clamp(32px,3.5vw,52px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-2px', color: '#f0f4ff', margin: 0 }}>
                Akademisyen üretirken<br/>
                <strong style={{ fontWeight: 500 }}>
                  <span style={{ fontFamily: "'Pixelify Sans', monospace", color: '#00c48c', fontSize: '1.1em', letterSpacing: '-1px', textShadow: '0 0 18px rgba(0,196,140,0.35)' }}>
                    {typeText}
                  </span>
                  <span style={{ fontFamily: "'Pixelify Sans', monospace", color: '#00c48c', fontSize: '1.1em', opacity: showCursor ? 1 : 0 }}>▋</span>
                </strong>
              </h1>
            )}
          </div>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            {[{n:'4.720',l:'Akademisyen'},{n:'1.340',l:'Proje'},{n:'892',l:'Eser'},{n:'428',l:'İş Birliği'},{n:'64',l:'Paydaş'},{n:'187',l:'Üniversite'}].map((s,i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '28px', fontWeight: 700, color: '#00c48c', letterSpacing: '-1px', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SAĞ PANEL */}
        <div className="panel" style={{
          display:'flex', flexDirection:'column', justifyContent:'center',
          padding:'0', color:'#0a0a0a', position:'relative', overflow:'hidden',
          clipPath:'polygon(0% 0%,100% 0%,100% 100%,0% 100%,0% 96.4%,4% 94.6%,0% 92.8%,4% 91%,0% 89.2%,4% 87.4%,0% 85.6%,4% 83.8%,0% 82%,4% 80.2%,0% 78.4%,4% 76.6%,0% 74.8%,4% 73%,0% 71.2%,4% 69.4%,0% 67.6%,4% 65.8%,0% 64%,4% 62.2%,0% 60.4%,4% 58.6%,0% 56.8%,4% 55%,0% 53.2%,4% 51.4%,0% 49.6%,4% 47.8%,0% 46%,4% 44.2%,0% 42.4%,4% 40.6%,0% 38.8%,4% 37%,0% 35.2%,4% 33.4%,0% 31.6%,4% 29.8%,0% 28%,4% 26.2%,0% 24.4%,4% 22.6%,0% 20.8%,4% 19%,0% 17.2%,4% 15.4%,0% 13.6%,4% 11.8%,0% 10%,4% 8.2%,0% 6.4%,4% 4.6%,0% 2.8%,4% 1%,0% 0%)'
        }}>
          {/* Sol yeşil glow */}
          <div style={{position:'absolute',top:0,left:0,width:'180px',height:'100%',background:'linear-gradient(90deg,rgba(0,196,140,0.07),transparent)',pointerEvents:'none',zIndex:0}}/>

          {/* Nokta grid desen */}
          <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0,opacity:0.4}} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.8" fill="rgba(0,196,140,0.18)"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)"/>
          </svg>

          {/* Watermark */}
          <div style={{position:'absolute',bottom:-30,right:-20,fontFamily:"'Pixelify Sans',monospace",fontSize:'220px',fontWeight:700,color:'rgba(0,196,140,0.04)',lineHeight:1,userSelect:'none',pointerEvents:'none',transform:'rotate(-8deg)',letterSpacing:'-10px',zIndex:0}}>
            tais
          </div>

          {/* İçerik */}
          <div style={{position:'relative',zIndex:1,display:'flex',flexDirection:'column',height:'100%',padding:'32px 52px 32px 64px'}}>

            {/* Üst — güvenli giriş */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'auto'}}>
              <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#00c48c'}}/>
                <span style={{fontSize:'11px',color:'rgba(0,0,0,0.35)',letterSpacing:'0.5px'}}>Güvenli Bağlantı</span>
              </div>
              <span style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'13px',color:'rgba(0,196,140,0.5)',letterSpacing:'1px'}}>tais.tr</span>
            </div>

            {/* Form kartı */}
            <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',maxWidth:'400px',width:'100%',margin:'0 auto'}}>

              {/* Başlık */}
              <div style={{marginBottom:'32px'}}>
                <h2 style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'26px',fontWeight:700,color:'#0a0a0a',letterSpacing:'-1px',marginBottom:'6px'}}>Hesabına giriş yap</h2>
                <p style={{fontSize:'13px',color:'rgba(0,0,0,0.4)',margin:0}}>Akademik ekosisteme hoş geldin.</p>
              </div>

              {/* Sekmeler */}
              <div style={{display:'flex',marginBottom:'28px',background:'rgba(0,0,0,0.04)',borderRadius:'4px',padding:'3px'}}>
                <div style={{flex:1,textAlign:'center',padding:'8px',fontSize:'13px',fontWeight:600,color:'#0a0a0a',background:'#fff',borderRadius:'2px',cursor:'pointer',boxShadow:'0 1px 4px rgba(0,0,0,0.08)'}}>
                  Giriş Yap
                </div>
                <div onClick={() => router.push('/kayit')} style={{flex:1,textAlign:'center',padding:'8px',fontSize:'13px',fontWeight:500,color:'rgba(0,0,0,0.4)',cursor:'pointer',transition:'all 0.2s'}}>
                  Kayıt Ol
                </div>
              </div>

              {/* Email */}
              <div style={{marginBottom:'14px',position:'relative'}}>
                <label style={{fontSize:'10px',fontWeight:600,color:'rgba(0,0,0,0.4)',letterSpacing:'1px',textTransform:'uppercase',display:'block',marginBottom:'7px'}}>
                  E-posta
                </label>
                <div style={{position:'relative'}}>
                  <svg style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input className="fi" type="email" placeholder="ad.soyad@universite.edu.tr" value={email} onChange={e=>setEmail(e.target.value)} style={{paddingLeft:'38px'}}/>
                </div>
              </div>

              {/* Şifre */}
              <div style={{marginBottom:'22px',position:'relative'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'7px'}}>
                  <label style={{fontSize:'10px',fontWeight:600,color:'rgba(0,0,0,0.4)',letterSpacing:'1px',textTransform:'uppercase'}}>Şifre</label>
                  <a href="#" style={{fontSize:'11px',color:'#00c48c',textDecoration:'none',fontWeight:500}}>Unuttum</a>
                </div>
                <div style={{position:'relative'}}>
                  <svg style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input className="fi" type="password" placeholder="••••••••" value={sifre} onChange={e=>setSifre(e.target.value)} style={{paddingLeft:'38px'}}/>
                </div>
              </div>

              {/* Giriş butonu */}
              <button className="fbtn" disabled={loading} onClick={async () => {
                setHata('')
                setLoading(true)
                const { error } = await supabase.auth.signInWithPassword({ email, password: sifre })
                setLoading(false)
                if (error) setHata('E-posta veya şifre hatalı.')
                else router.push('/dashboard')
              }}>
                <span>{loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}</span>
                {!loading && <span>→</span>}
              </button>

              {/* Hata */}
              {hata && <div style={{marginTop:'10px',padding:'10px 12px',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',fontSize:'12px',color:'#ef4444',borderRadius:'2px'}}>{hata}</div>}

              {/* Hesap yok */}
              <div style={{textAlign:'center',marginTop:'16px'}}>
                <span style={{fontSize:'12px',color:'rgba(0,0,0,0.35)'}}>Hesabın yok mu? </span>
                <a href="/kayit" style={{fontSize:'12px',color:'#00c48c',textDecoration:'none',fontWeight:600}}>Kayıt ol</a>
              </div>
            </div>

            {/* Alt — sosyal proof */}
            <div style={{marginTop:'auto',paddingTop:'20px',borderTop:'1px solid rgba(0,0,0,0.06)',display:'flex',gap:'20px',justifyContent:'center'}}>
              <div style={{fontSize:'12px',color:'rgba(0,0,0,0.35)',letterSpacing:'0.5px'}}>
                <span style={{color:'#00c48c',fontWeight:600}}>YZ Destekli</span> Akademik Ekosistem
              </div>
            </div>
          </div>
        </div>
      </div>

    
    </>
  )
}
