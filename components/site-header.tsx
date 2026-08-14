'use client'

import Link from 'next/link'
import { ArrowRight, Leaf, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand" aria-label="sharetable home" onClick={() => setOpen(false)}>
          <span className="brand-mark"><Leaf size={25} strokeWidth={2.3} /></span>
          <span>share<span>table</span><b>.</b></span>
        </Link>
        <nav className={`main-nav ${open ? 'open' : ''}`} aria-label="Main navigation">
          <Link href="/" className="active" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/about" onClick={() => setOpen(false)}>About</Link>
          <Link href="/browse" onClick={() => setOpen(false)}>Browse</Link>
          <Link href="/post" onClick={() => setOpen(false)}>Post</Link>
          <Link href="/sign-in" className="mobile-login" onClick={() => setOpen(false)}>Log in</Link>
          <Link href="/sign-up" className="mobile-signup" onClick={() => setOpen(false)}>Sign up <ArrowRight size={17} /></Link>
        </nav>
        <div className="header-actions">
          <Link href="/post" className="nav-cta">Share food <ArrowRight size={19} /></Link>
          <Link href="/sign-in" className="text-nav">Log in</Link>
          <Link href="/sign-up" className="nav-cta compact">Sign up <ArrowRight size={18} /></Link>
          <button className="mobile-menu-button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
    </header>
  )
}
