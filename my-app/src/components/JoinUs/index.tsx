import { getLocale } from '@/utils/getLocale'
import s from './JoinUs.module.css'
import Link from 'next/link'

const JoinUs = () => {
  const t = getLocale()
  
  return (
    <div className={s.hero}>
      <p>{t.joinUs1}<br/>{t.joinUs2}<br/>{t.joinUs3}<br/>{t.joinUs4}</p>
      <Link href="/termsAndConditions">{t.joinUsButton}</Link>
    </div>
  )
}

export default JoinUs
