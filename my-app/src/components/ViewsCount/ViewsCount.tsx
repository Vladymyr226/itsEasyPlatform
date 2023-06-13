import s from './ViewsCount.module.css'

import eye from '../../assets/eye.svg'
import Image from 'next/image'

const ViewsCount = () => {
  return (
    <div className={s.viewsWrapper}>
      <Image className={s.icon} src={eye} alt='eye' />
      413 просмотров
    </div>
  )
}

export default ViewsCount
