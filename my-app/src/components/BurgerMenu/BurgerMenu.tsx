import Logo from '../Logo/Logo'
import s from './BurgerMenu.module.css'
import { useEffect, useRef, useState } from 'react'
import cross from '../../assets/burgerCross.svg'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter as detailedRouter } from 'next/router'
import { getLocale } from '@/utils/getLocale'

const urlHost = `${
  process.env.NEXT_PUBLIC_DEV !== 'dev' ? 'https://cb-shchus.vercel.app/' : 'http://localhost:3000/'
}`

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  function getPageUrl() {
    const fullUrl =
      typeof window !== 'undefined' ? window.location.href.replace(urlHost, '').split('/') : '123'
    return fullUrl
  }
  const [targetSite, setTargetSite] = useState<string>()
  useEffect(() => {
    const pageUrl = getPageUrl()
    setTargetSite(pageUrl[0])
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }

    setIsOpen(isOpen)
  }, [isOpen])

  const t = getLocale()
  return (
    <>
      <button onClick={() => setIsOpen(true)} className={s.burgerButton}></button>

      {isOpen && (
        <div className={s.burgerMenu}>
          <div className={s.burgerHeader}>
            <Logo />
            <Image
              onClick={() => setIsOpen(false)}
              className={s.closeButton}
              src={cross}
              alt='cross'
            />
          </div>
          <div className={s.divide}></div>
          <div className={s.burgerBody}>
            <ul className={s.bodyList}>
              <Link href={'/'}>
                <li
                  className={targetSite == '' ? s.active : ''}
                  style={{ color: targetSite != '' ? '#c7c6c6' : '' }}
                >
                  {t.home}
                </li>
              </Link>
              <Link href={'/allCourses'}>
                <li
                  className={targetSite == 'allCourses' ? s.active : ''}
                  style={{ color: targetSite != 'allCourses' ? '#c7c6c6' : '' }}
                >
                  {t.courses}
                </li>
              </Link>
              <li>{t.about_us}</li>
              <li>{t.career}</li>
            </ul>
          </div>
          <div className={s.divide}></div>
        </div>
      )}
    </>
  )
}

export default BurgerMenu
