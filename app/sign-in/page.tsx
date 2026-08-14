'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { Leaf, ArrowLeft } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await authClient.signIn.email({ email: email.trim(), password })
      if (result.error) throw new Error(result.error.message || 'Unable to sign in. Check your email and password.')
      router.push('/dashboard')
      router.refresh()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to sign in right now.')
    } finally {
      setLoading(false)
    }
  }

  return <main className="auth-page"><Link href="/" className="auth-back"><ArrowLeft size={16} /> Back to sharetable</Link><div className="auth-card"><div className="auth-brand"><span className="logo-mark"><Leaf size={22} /></span><strong>share<span>table</span></strong></div><span className="section-kicker">Welcome back</span><h1>Good to see you.</h1><p>Sign in to share food and keep your community moving.</p><form onSubmit={submit}><label>Email<input type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required /></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /></label>{error && <div className="auth-error" role="alert">{error}</div>}<button className="button button-dark" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button></form><span className="auth-switch">New to sharetable? <Link href="/sign-up">Create an account</Link></span></div></main>
}
