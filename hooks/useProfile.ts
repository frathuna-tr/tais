import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type Profil = {
  id: string
  ad: string
  soyad: string
  tip: 'akademisyen' | 'ogrenci' | 'firma' | 'sanatci'
  email: string
  universite: string
  bolum: string
  unvan: string
  tc_kimlik: string
  ogrenci_no: string
  firma_ad: string
  vergi_no: string
  sektor: string
  bio?: string
  sehir?: string
  telefon?: string
  web?: string
  fakulte?: string
  tez_konusu?: string
  danisman?: string
  ilgi_alanlari?: string
  uzmanlik?: string
  orcid?: string
  scholar?: string
  calisan_sayisi?: string
  kurulus_yili?: string
  arg_alanlari?: string
}

export function useProfile() {
  const [profil, setProfil] = useState<Profil | null>(null)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState<string | null>(null)

  useEffect(() => {
    const profilGetir = async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) {
        setHata(error.message)
      } else {
        setProfil(data)
      }
      setYukleniyor(false)
    }

    // Mevcut oturumu kontrol et
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        profilGetir(user.id)
      } else {
        setYukleniyor(false)
      }
    })

    // Oturum değişimlerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        profilGetir(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        setProfil(null)
        setYukleniyor(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const guncelle = async (guncelVeri: Partial<Profil>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { basarili: false, hata: 'Oturum açılmamış' }

    const { error } = await supabase
      .from('profiles')
      .update(guncelVeri)
      .eq('id', user.id)

    if (error) return { basarili: false, hata: error.message }
    setProfil(prev => prev ? { ...prev, ...guncelVeri } : prev)
    return { basarili: true, hata: null }
  }

  return { profil, yukleniyor, hata, guncelle }
}
