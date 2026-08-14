'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { ArrowLeft, Leaf } from 'lucide-react'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [type, setType] = useState('Individual')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await authClient.signUp.email({ name: name.trim(), email: email.trim(), password })
      if (result.error) throw new Error(result.error.message || 'Unable to create your account.')
      router.push('/dashboard')
      router.refresh()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create your account right now.')
    } finally {
      setLoading(false)
    }
  }

  return <main className="auth-page"><Link href="/" className="auth-back"><ArrowLeft size={16} /> Back to sharetable</Link><div className="auth-card"><div className="auth-brand"><span className="logo-mark"><Leaf size={22} /></span><strong>share<span>table</span></strong></div><span className="section-kicker">Join the table</span><h1>Share more good.</h1><p>Create your account and make an impact close to home.</p><form onSubmit={submit}><label>Your name<input autoComplete="name" value={name} onChange={event => setName(event.target.value)} required /></label><label>Email<input type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required /></label><label>Password<input type="password" autoComplete="new-password" minLength={8} value={password} onChange={event => setPassword(event.target.value)} required /></label><label>I&apos;m joining as<select value={type} onChange={event => setType(event.target.value)}><option>Individual</option><option>Restaurant</option><option>Organization</option></select></label>{error && <div className="auth-error" role="alert">{error}</div>}<button className="button button-dark" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button></form><span className="auth-switch">Already a member? <Link href="/sign-in">Sign in</Link></span></div></main>
}
