import Link from 'next/link'
import logoImage from '../../assets/logo.svg'

import s from './Logo.module.css'
import Image from 'next/image'

const Logo = () => {
  return (
    <Link href="/" className={s.logo}>
      <Image
        src={logoImage}
        alt="logo"
        priority={true}
      />
    </Link>
  )
}

export default Logo
