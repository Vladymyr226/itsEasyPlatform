import { useState } from 'react'
import moon from '../../assets/dark.svg'
import sun from '../../assets/sun.svg'
import s from './ThemeSwitcher.module.css'
import Image from 'next/image'

const ThemeSwitcher = () => {
  const [isDark, setIsDark] = useState(false)

  return (
    <Image
      onClick={() => setIsDark((prev) => !prev)}
      src={isDark ? sun : moon}
      alt='dark theme'
      className={s.themeSwitcher}
    />
  )
}

export default ThemeSwitcher
