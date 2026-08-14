'use client'

import Link from 'next/link'
import { ArrowRight, Leaf, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCopy } from '@/components/locale-provider'

export function SiteHeader(){const [open,setOpen]=useState(false);const close=()=>setOpen(false);const t=useCopy();return <header className="site-header"><div className="site-header-inner"><Link href="/" className="brand" aria-label="sharetable home" onClick={close}><span className="brand-mark"><Leaf size={25} strokeWidth={2.3}/></span><span>share<span>table</span><b>.</b></span></Link><nav className={`main-nav ${open?'open':''}`} aria-label="Main navigation"><Link href="/" onClick={close}>{t.home}</Link><Link href="/about" onClick={close}>{t.about}</Link><Link href="/browse" onClick={close}>{t.browse}</Link><Link href="/post" onClick={close}>{t.post}</Link><Link href="/dashboard" className="mobile-login" onClick={close}>{t.myPosts}</Link></nav><div className="header-actions"><Link href="/dashboard" className="text-nav">{t.myPosts}</Link><Link href="/post" className="nav-cta">{t.share} <ArrowRight size={19}/></Link><button className="mobile-menu-button" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X size={22}/>:<Menu size={22}/>}</button></div></div></header>}
