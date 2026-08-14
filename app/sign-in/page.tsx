'use client'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Leaf, ArrowLeft } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter(); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false)
  async function submit(e: FormEvent) { e.preventDefault(); if (e.nativeEvent instanceof SubmitEvent === false) return; setLoading(true); setError(''); const result = await authClient.signIn.email({ email, password }); if (result.error) setError(result.error.message || 'Unable to sign in'); else { router.push('/'); router.refresh() }; setLoading(false) }
  return <main className="auth-page"><a href="/" className="auth-back"><ArrowLeft size={16}/> Back to sharetable</a><div className="auth-card"><div className="auth-brand"><span className="logo-mark"><Leaf size={22}/></span><strong>share<span>table</span></strong></div><span className="section-kicker">Welcome back</span><h1>Good to see you.</h1><p>Sign in to share food and keep your community moving.</p><form onSubmit={submit}><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>{error && <div className="auth-error">{error}</div>}<button className="button button-dark" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button></form><span className="auth-switch">New to sharetable? <a href="/sign-up">Create an account</a></span></div></main>
}
