'use client'

import Link from 'next/link'
import { ArrowRight, Leaf, Menu, X, Globe2, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useCopy, useLocale } from '@/components/locale-provider'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { locale, setLocale } = useLocale()
  const t = useCopy()
  const toggleLocale = () => setLocale(locale === 'en' ? 'ar' : 'en')
  return <header className="site-header"><div className="site-header-inner"><Link href="/" className="brand" aria-label="sharetable home" onClick={() => setOpen(false)}><span className="brand-mark"><Leaf size={25} strokeWidth={2.3} /></span><span>share<span>table</span><b>.</b></span></Link><nav className={`main-nav ${open ? 'open' : ''}`} aria-label="Main navigation"><Link href="/" onClick={() => setOpen(false)}>{t.home}</Link><Link href="/about" onClick={() => setOpen(false)}>{t.about}</Link><Link href="/browse" onClick={() => setOpen(false)}>{t.browse}</Link><Link href="/post" onClick={() => setOpen(false)}>{t.post}</Link><Link href="/settings" className="mobile-login" onClick={() => setOpen(false)}>{t.settings}</Link><Link href="/sign-in" className="mobile-login" onClick={() => setOpen(false)}>{t.login}</Link></nav><div className="header-actions"><button className="locale-toggle" onClick={toggleLocale} aria-label={t.language}><Globe2 size={16} />{locale === 'en' ? 'العربية' : 'English'}</button><Link href="/post" className="nav-cta">{t.share} <ArrowRight size={19} /></Link><Link href="/settings" className="text-nav"><UserRound size={16} /> {t.settings}</Link><Link href="/sign-in" className="text-nav">{t.login}</Link><Link href="/sign-up" className="nav-cta compact">{t.signup} <ArrowRight size={18} /></Link><button className="mobile-menu-button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button></div></div></header>
}
