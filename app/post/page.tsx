'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight, Camera, Check, Leaf } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { BackHome } from '@/components/back-home'

export default function PostPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      const response = await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form.entries())) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to publish this item.')
      setSent(true)
      event.currentTarget.reset()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to publish this item right now.')
    } finally {
      setLoading(false)
    }
  }

  return <main><SiteHeader /><section className="inner-hero post-hero"><BackHome /><div className="inner-kicker">SHARE THE EXTRA</div><h1>Put it on<br /><em>the table.</em></h1><p>One post can make someone&apos;s day — and keep perfectly good food out of the bin.</p></section><section className="post-form-section"><div className="post-form-intro"><Leaf size={28} /><h2>Tell us what you have.</h2><p>Keep it simple. A clear description helps the right neighbor find you.</p></div>{sent ? <div className="success-panel" role="status"><span><Check size={25} /></span><h2>Your item is ready to share.</h2><p>Thanks for helping keep good food in the community.</p><button className="sample-button" onClick={() => setSent(false)}>Post another item <ArrowRight size={17} /></button></div> : <form className="share-form" onSubmit={submit}><label>What are you sharing?<input name="title" required placeholder="e.g. Fresh garden vegetables" /></label><div className="form-row"><label>Category<select name="category" defaultValue="" required><option value="" disabled>Select a category</option><option>Fresh produce</option><option>Pantry staples</option><option>Prepared meals</option><option>Bakery & bread</option></select></label><label>Quantity<input name="quantity" required placeholder="e.g. 3 boxes" /></label></div><label>Pickup location<input name="provider" required placeholder="Neighborhood or landmark" /></label><label>Best before<input name="expiryAt" type="datetime-local" required /></label><label>Description<textarea name="description" required rows={4} placeholder="Anything neighbors should know?" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="sample-button" type="submit" disabled={loading}>{loading ? 'Publishing…' : 'Post this item'} {!loading && <ArrowRight size={17} />}</button><p className="form-note"><Camera size={15} /> You can add photos after posting.</p></form>}</section></main>
}
