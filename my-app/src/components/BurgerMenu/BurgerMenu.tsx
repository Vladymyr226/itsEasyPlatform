import Logo from '../Logo/Logo'
import s from './BurgerMenu.module.css'
import { useEffect, useState } from 'react'
import cross from '../../assets/burgerCross.svg'
import arrow from '../../assets/arrow.svg'
import Image from 'next/image'
import Link from 'next/link'
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
  console.log(targetSite)
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
                  style={{ color: targetSite != '' ? '#fff' : '' }}
                >
                  Главная
                </li>
              </Link>
              <Link href={'/allCourses'}>
                <li
                  className={targetSite == 'allCourses' ? s.active : ''}
                  style={{ color: targetSite != 'allCourses' ? '#fff' : '' }}
                >
                  Курсы
                </li>
              </Link>
              <li>Про нас</li>
              <li>Карьера</li>
            </ul>
          </div>
          <div className={s.divide}></div>
          <div className={s.burgerFooter}>
            <div className={s.footerLeft}>
              <p>Язык сайта</p>
              <Image src={arrow} alt='arrow' />
            </div>
            <p className={s.language}>RU</p>
          </div>
        </div>
      )}
    </>
  )
}

export default BurgerMenu
