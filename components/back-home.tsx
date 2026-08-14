import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function BackHome() {
  return <Link className="back-home" href="/"><ArrowLeft size={16} /> Back to home</Link>
}
