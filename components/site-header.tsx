'use client'

import Link from 'next/link'
import { ArrowRight, Leaf } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand" aria-label="sharetable home">
          <span className="brand-mark"><Leaf size={25} strokeWidth={2.3} /></span>
          <span>share<span>table</span><b>.</b></span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/" className="active">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/browse">Browse items</Link>
          <Link href="/post">Post an item</Link>
        </nav>
        <div className="header-actions">
          <Link href="/post" className="nav-cta">Share something <ArrowRight size={19} /></Link>
          <Link href="/sign-in" className="text-nav">Log in</Link>
          <Link href="/sign-up" className="nav-cta compact">Sign up <ArrowRight size={18} /></Link>
        </div>
      </div>
    </header>
  )
}
