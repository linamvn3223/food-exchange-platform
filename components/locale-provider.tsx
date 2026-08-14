'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Locale = 'en' | 'ar'
type LocaleContextValue = { locale: Locale; setLocale: (locale: Locale) => void; isArabic: boolean }
const LocaleContext = createContext<LocaleContextValue>({ locale: 'en', setLocale: () => {}, isArabic: false })

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const saved = window.localStorage.getItem('sharetable-locale') as Locale | null
    if (saved === 'ar' || saved === 'en') setLocaleState(saved)
    setReady(true)
  }, [])
  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.dataset.locale = locale
    if (ready) window.localStorage.setItem('sharetable-locale', locale)
  }, [locale, ready])
  const choose = (value: Locale) => setLocaleState(value)
  return <LocaleContext.Provider value={{ locale, setLocale: choose, isArabic: locale === 'ar' }}>
    {children}
    {ready && !window.localStorage.getItem('sharetable-locale') && <div className="language-gate" role="dialog" aria-modal="true"><div className="language-card"><span className="brand-mark">●</span><p className="section-kicker">WELCOME TO SHARETABLE</p><h1>Good food, shared freely.</h1><p>Choose your language to continue.</p><div className="language-options"><button onClick={() => choose('en')}>English <span>→</span></button><button onClick={() => choose('ar')} dir="rtl">العربية <span>←</span></button></div></div></div>}
  </LocaleContext.Provider>
}

export function useLocale() { return useContext(LocaleContext) }

export const copy = {
  en: { home: 'Home', about: 'About', browse: 'Browse items', post: 'Post an item', share: 'Share food', myPosts: 'My posts', settings: 'Account settings', back: 'Back to sharetable', language: 'Language', english: 'English', arabic: 'العربية', browseTitle: 'Find something good nearby.', browseIntro: 'Browse food shared by neighbors, local kitchens, and organizations in your community.', postTitle: 'Put it on the table.', postIntro: 'One post can make someone’s day — and keep perfectly good food out of the bin.', dashboardTitle: 'My posts, my impact.', dashboardIntro: 'Look up your activity with the same email or phone you used to post or claim food.', search: 'Search meals, bakeries, neighbors...', claim: 'Claim this item', postItem: 'Post an item', viewActivity: 'View my activity' },
  ar: { home: 'الرئيسية', about: 'عن المنصة', browse: 'تصفح الطعام', post: 'أضف طعامًا', share: 'شارك الطعام', myPosts: 'منشوراتي', settings: 'إعدادات الحساب', back: 'العودة إلى شيرتابل', language: 'اللغة', english: 'English', arabic: 'العربية', browseTitle: 'اعثر على طعام جيد بالقرب منك.', browseIntro: 'تصفح الطعام الذي يشاركه الجيران والمطابخ والمنظمات في مجتمعك.', postTitle: 'ضعه على المائدة.', postIntro: 'قد يجعل منشور واحد يوم شخص ما أفضل، ويحافظ على الطعام الجيد من الهدر.', dashboardTitle: 'منشوراتي، أثري.', dashboardIntro: 'اطلع على نشاطك باستخدام البريد أو الهاتف الذي استخدمته للنشر أو الحجز.', search: 'ابحث عن وجبات ومخابز وجيران...', claim: 'احجز هذا الطعام', postItem: 'أضف منشورًا', viewActivity: 'عرض نشاطي' },
} as const
export function useCopy() { const { locale } = useLocale(); return copy[locale] }
