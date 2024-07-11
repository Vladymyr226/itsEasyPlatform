import Logo from '../Logo/Logo'
import s from './BurgerMenu.module.css'
import { useEffect, useRef, useState } from 'react'
import cross from '../../assets/burgerCross.svg'
import arrow from '../../assets/arrow.svg'
import Image from 'next/image'
import Link from 'next/link'
import { Box } from '@mui/material'
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

  const [isLanguageShown, setIsLanguageShown] = useState(false)
  const routerLocale = detailedRouter()
  const divRef = useRef<HTMLDivElement>(null)
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
                  style={{ color: targetSite != '' ? '#fff' : '' }}
                >
                  {t.home}
                </li>
              </Link>
              <Link href={'/allCourses'}>
                <li
                  className={targetSite == 'allCourses' ? s.active : ''}
                  style={{ color: targetSite != 'allCourses' ? '#fff' : '' }}
                >
                  {t.courses}
                </li>
              </Link>
              <li>{t.about_us}</li>
              <li>{t.career}</li>
            </ul>
          </div>
          <div className={s.divide}></div>
          <div className={s.burgerFooter} onClick={() => setIsLanguageShown(!isLanguageShown)}>
            <div className={s.footerLeft}>
              <p>{t.language}</p>
              <Image src={arrow} alt='arrow' />
            </div>
            {routerLocale.locale == 'ru' && <p className={s.language}>RU</p>}
            {routerLocale.locale == 'ua' && <p className={s.language}>UA</p>}
            {routerLocale.locale == 'en' && <p className={s.language}>EN</p>}
            {isLanguageShown && (
              <div
                ref={divRef}
                style={{
                  marginTop: '170px',
                  width: 'calc(100% - 40px)',
                  color: '#fff',
                  background: '#171622',
                  position: 'absolute',
                  zIndex: 4,
                  border: '1px solid #28263a',
                }}
              >
                <Box
                  sx={{
                    padding: '10px',
                    cursor: 'pointer',
                    '&:hover': {
                      background: '#28263a',
                    },
                    display: 'flex',
                  }}
                  onClick={(e) => {
                    const path = routerLocale.asPath
                    routerLocale.push(path, path, { locale: 'ru' })
                  }}
                >
                  <div style={{ height: '20px', width: '20px' }}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 9 6'
                      width='35'
                      height='20'
                    >
                      <rect fill='#fff' width='9' height='3' />
                      <rect fill='#d52b1e' y='3' width='9' height='3' />
                      <rect fill='#0039a6' y='2' width='9' height='2' />
                    </svg>
                  </div>
                  <div style={{ marginLeft: '20px' }}>RU</div>
                </Box>
                <Box
                  sx={{
                    padding: '10px',
                    cursor: 'pointer',
                    '&:hover': {
                      background: '#28263a',
                    },
                    display: 'flex',
                  }}
                  onClick={(e) => {
                    const path = routerLocale.asPath
                    routerLocale.push(path, path, { locale: 'ua' })
                  }}
                >
                  <div style={{ height: '20px', width: '20px', position: 'relative' }}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='35' height='20'>
                      <rect width='1200' height='10' fill='#0057B7' />
                      <rect width='1200' height='10' y='10' fill='#FFD700' />
                    </svg>
                  </div>
                  <div style={{ marginLeft: '20px' }}>UA</div>
                </Box>
                <Box
                  sx={{
                    padding: '10px',
                    cursor: 'pointer',
                    '&:hover': {
                      background: '#28263a',
                    },
                    display: 'flex',
                  }}
                  onClick={(e) => {
                    const path = routerLocale.asPath
                    routerLocale.push(path, path, { locale: 'en' })
                  }}
                >
                  <div style={{ height: '20px', width: '20px', position: 'relative' }}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 50 30'
                      width='35'
                      height='20'
                    >
                      <clipPath id='t'>
                        <path d='M25,15h25v15zv15h-25zh-25v-15zv-15h25z' />
                      </clipPath>
                      <path d='M0,0v30h50v-30z' fill='#012169' />
                      <path d='M0,0 50,30M50,0 0,30' stroke='#fff' stroke-width='6' />
                      <path
                        d='M0,0 50,30M50,0 0,30'
                        clip-path='url(#t)'
                        stroke='#C8102E'
                        stroke-width='4'
                      />
                      <path
                        d='M-1 11h22v-12h8v12h22v8h-22v12h-8v-12h-22z'
                        fill='#C8102E'
                        stroke='#FFF'
                        stroke-width='2'
                      />
                    </svg>
                  </div>
                  <div style={{ marginLeft: '20px' }}>EN</div>
                </Box>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default BurgerMenu
