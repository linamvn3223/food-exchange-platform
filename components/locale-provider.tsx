'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Locale = 'en' | 'ar'
type LocaleContextValue = { locale: Locale; setLocale: (locale: Locale) => void; isArabic: boolean }
const LocaleContext = createContext<LocaleContextValue>({ locale: 'en', setLocale: () => {}, isArabic: false })

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  useEffect(() => {
    const saved = window.localStorage.getItem('sharetable-locale') as Locale | null
    if (saved === 'ar' || saved === 'en') setLocaleState(saved)
  }, [])
  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.dataset.locale = locale
    window.localStorage.setItem('sharetable-locale', locale)
  }, [locale])
  return <LocaleContext.Provider value={{ locale, setLocale: setLocaleState, isArabic: locale === 'ar' }}>{children}</LocaleContext.Provider>
}

export function useLocale() { return useContext(LocaleContext) }

export const copy = {
  en: { home: 'Home', about: 'About', browse: 'Browse items', post: 'Post an item', share: 'Share food', login: 'Log in', signup: 'Sign up', back: 'Back to sharetable', settings: 'Account settings', language: 'Language', english: 'English', arabic: 'العربية' },
  ar: { home: 'الرئيسية', about: 'عن المنصة', browse: 'تصفح الطعام', post: 'أضف تبرعًا', share: 'شارك الطعام', login: 'تسجيل الدخول', signup: 'إنشاء حساب', back: 'العودة إلى شيرتابل', settings: 'إعدادات الحساب', language: 'اللغة', english: 'English', arabic: 'العربية' },
} as const

export function useCopy() {
  const { locale } = useLocale()
  return copy[locale]
}
