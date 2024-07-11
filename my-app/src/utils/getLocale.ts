import { en } from '@/locales/en'
import { ru } from '@/locales/ru'
import { ua } from '@/locales/ua'
import { useRouter as detailedRouter } from 'next/router'
export function getLocale() {
  const router = detailedRouter()
  switch (router.locale) {
    case 'ru':
      return ru
    case 'ua':
      return ua
    case 'en':
      return en
    default:
      return en
  }
}
