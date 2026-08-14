'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Globe2, Leaf, LogOut, Save, UserRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { useCopy, useLocale } from '@/components/locale-provider'

export default function SettingsPage() {
  const router = useRouter(); const t = useCopy(); const { locale, setLocale } = useLocale()
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [saved, setSaved] = useState(false); const [error, setError] = useState(''); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false)
  useEffect(() => { fetch('/api/profile').then(async response => { if (!response.ok) throw new Error('Please sign in first.'); return response.json() }).then(profile => { setName(profile.name ?? ''); setEmail(profile.email ?? ''); if (profile.language === 'ar') setLocale('ar') }).catch(() => router.replace('/sign-in')).finally(() => setLoading(false)) }, [router, setLocale])
  async function submit(event: FormEvent) { event.preventDefault(); setSaving(true); setError(''); setSaved(false); const response = await fetch('/api/profile', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ name, language:locale }) }); const result = await response.json(); if (!response.ok) setError(result.error || 'Unable to save changes.'); else { setName(result.name); setSaved(true) }; setSaving(false) }
  async function logout() { await authClient.signOut(); router.push('/'); router.refresh() }
  if (loading) return <main className="auth-page"><p>Loading account…</p></main>
  return <main><div className="settings-page"><Link href="/" className="auth-back"><ArrowLeft size={16} /> {t.back}</Link><div className="settings-card"><div className="auth-brand"><span className="logo-mark"><Leaf size={22} /></span><strong>share<span>table</span></strong></div><span className="section-kicker">{t.settings}</span><h1>Your account.</h1><p>Keep your profile and language preferences up to date.</p><form className="settings-form" onSubmit={submit}><label><UserRound size={15} /> Display name<input value={name} onChange={event => setName(event.target.value)} required /></label><label>Email<input value={email} disabled /></label><label><Globe2 size={15} /> {t.language}<select value={locale} onChange={event => setLocale(event.target.value as 'en' | 'ar')}><option value="en">English</option><option value="ar">العربية</option></select></label>{error && <p className="form-error" role="alert">{error}</p>}{saved && <p className="form-success"><Check size={15} /> Changes saved.</p>}<button className="button button-dark" disabled={saving}><Save size={16} /> {saving ? 'Saving…' : 'Save changes'}</button></form><button className="logout-button" onClick={logout}><LogOut size={16} /> Log out</button></div></div></main>
}
