import Image from 'next/image'
import arrow from '../../assets/arrow.svg'

import s from './LanguageSwitcher.module.css'
const LanguageSwitcher = () => {
  return (
    <div className={s.languageSwitcher}>
      RU <Image src={arrow} alt='arrow' />
    </div>
  )
}

export default LanguageSwitcher
