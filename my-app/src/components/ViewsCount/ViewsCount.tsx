import s from './ViewsCount.module.css'

import eye from '../../assets/eye.svg'
import Image from 'next/image'
import { getLocale } from '@/utils/getLocale'

const ViewsCount = () => {
  const t = getLocale()
  return (
    <div className={s.viewsWrapper}>
      <Image className={s.icon} src={eye} alt='eye' />
      413 {t.views}
    </div>
  )
}

export default ViewsCount
