import Link from 'next/link'
import logoImage from '../../assets/logo.svg'

import s from './Logo.module.css'
import Image from 'next/image'

const Logo = () => {
  return (
    <Link href="/" className={s.logo}>
      <Image
        className={s.imgLogo}
        src={logoImage}
        alt="logo"
      />
    </Link>
  )
}

export default Logo
