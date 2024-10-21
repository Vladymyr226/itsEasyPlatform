import Link from 'next/link'
import logoImage from '../../assets/logo.svg'

import s from './LogoFooter.module.css'
import Image from 'next/image'

const LogoFooter = () => {
  return (
    <Link href="/" className={s.logo}>
      <Image
        className={s.imgLogoFooter}
        src={logoImage}
        alt="logo"
      />
    </Link>
  )
}

export default LogoFooter
