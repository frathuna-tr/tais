'use client'

import { Suspense } from 'react'
import AkademikAgIcerik from './icerik'

export default function AkademikAgPage() {
  return (
    <Suspense fallback={
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontFamily:"'DM Sans',sans-serif",fontSize:'13px',color:'rgba(0,0,0,0.4)'}}>
        Yükleniyor...
      </div>
    }>
      <AkademikAgIcerik />
    </Suspense>
  )
}
