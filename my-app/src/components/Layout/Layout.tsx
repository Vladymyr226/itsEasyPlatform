'use client'
import Logo from '../../components/Logo/Logo'

import logoTwitter from '../../assets/logo-twitter.svg'
import logoInstagram from '../../assets/logo-instagram.svg'
import logoFb from '../../assets/logo-fb.svg'

import s from './Layout.module.css'
import LanguageSwitcher from '../../components/LanguageSwitcher/LanguageSwitcher'
import Usermenu from '../../components/Usermenu/Usermenu'
import BurgerMenu from '../../components/BurgerMenu/BurgerMenu'
import { ReactNode, useEffect, useState } from 'react'
import Image from 'next/image'
import Container from '../Container/Container'
import Link from 'next/link'
import { getLocale } from '@/utils/getLocale'
import LogoFooter from '@/components/LogoFooter/LogoFooter'
import Head from 'next/head'

type LayoutProps = {
  children: ReactNode
}
const urlHost = `${
  process.env.NEXT_PUBLIC_DEV !== 'dev' ? 'https://cb-shchus.vercel.app/' : 'http://localhost:3000/'
}`
const Layout = ({ children }: LayoutProps) => {
  const [width, setWidth] = useState(0)

  function getPageUrl() {
    const fullUrl =
      typeof window !== 'undefined' ? window.location.href.replace(urlHost, '').split('/') : '123'
    return fullUrl
  }
  const [targetSite, setTargetSite] = useState<string>()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
    }
    const pageUrl = getPageUrl()
    setTargetSite(pageUrl[0])
  }, [])
  const t = getLocale()
  return (
    <Container>
      <Head>
        <meta name="google-site-verification" content="vrQhC2ShJ1bmPDrs6dGRtyiIl-NSykZJUsTJg0HwYzY" />
        <meta name="yandex-verification" content="b4494b28ec149832" />
      </Head>
      {/* блок контент чтобы прижать футер к низу странички */}
      <div className={s.content}>
        <header className={s.header}>
          <Logo />

          <div className={s.headerRightSide}>
            {width >= 1200 ? (
              <>
                <div className={s.headerNavigation}>
                  <Link href={'/'}>
                    <div
                      className={
                        targetSite == '' ? s.headerActiveNavigationLink : s.headerNavigationLink
                      }
                    >
                      {t.home}
                    </div>
                  </Link>
                  <Link href={'/allCourses'}>
                    <div
                      className={
                        targetSite == 'allCourses'
                          ? s.headerActiveNavigationLink
                          : s.headerNavigationLink
                      }
                    >
                      {t.courses}
                    </div>
                  </Link>
                  <Link href="aboutUs">
                    <div className={s.headerNavigationLink}>{t.about_us}</div>
                  </Link>
                </div>

                <div className={s.headerControlls}>
                  <LanguageSwitcher />
                  <Usermenu />
                </div>
              </>
            ) : (
              <>
                <LanguageSwitcher />
                <Usermenu />
                <BurgerMenu />
              </>
            )}
          </div>
        </header>

        <main>{children}</main>
      </div>

      <footer className={s.footer}>
        <div className={s.upperFooter}>
          <LogoFooter />

          <div
            className={s.footerInfo}
            style={{
              minWidth: '80%',
            }}
          >
            <div className={s.footerInfoCard}>
              <p className={s.footerInfoTitle}>{t.activities}</p>
              <div className={s.listWrapper}>
                <ul className={s.footerInfoList}>
                  <li className={s.footerInfoItem}>{t.programming}</li>
                  <li className={s.footerInfoItem}>{t.design}</li>
                  <li className={s.footerInfoItem}>{t.analytics}</li>
                  <li className={s.footerInfoItem}>{t.marketing}</li>
                </ul>
                <ul className={s.footerInfoList}>
                  <li className={s.footerInfoItem}>{t.project_management}</li>
                  <li className={s.footerInfoItem}>{t.all_courses}</li>
                </ul>
              </div>
            </div>

            <div className={s.footerInfoCard}>
              <p className={s.footerInfoTitle}>{t.support}</p>
              <ul className={s.footerInfoList}>
                <li className={s.footerInfoItem}>{t.contact}</li>
                <li className={s.footerInfoItem}>{t.get_help}</li>
              </ul>
            </div>

            <div className={s.footerInfoCard}>
              <p className={s.footerInfoTitle}>{t.company}</p>

              {width >= 1200 ? (
                <ul className={s.footerInfoList}>
                  <li className={s.footerInfoItem}>{t.about_us}</li>
                  <li className={s.footerInfoItem}>{t.job}</li>
                  <li className={s.footerInfoItem}>{t.career}</li>
                  <li className={s.footerInfoItem}>{t.for_partners}</li>
                </ul>
              ) : (
                <div className={s.listWrapper}>
                  <ul className={s.footerInfoList}>
                    <li className={s.footerInfoItem}>{t.about_us}</li>
                    <li className={s.footerInfoItem}>{t.job}</li>
                  </ul>
                  <ul className={s.footerInfoList}>
                    <li className={s.footerInfoItem}>{t.career}</li>
                    <li className={s.footerInfoItem}>{t.for_partners}</li>
                  </ul>
                </div>
              )}
            </div>

            <div className={s.footerContacts}>
              <div>
                <h3 className={s.footerPhone}>8 (800( 123-45-67</h3>
                <p className={s.footerEmail}>itseasy@gmail.com</p>
              </div>

              <ul className={s.footerSocialList}>
                <li className={s.footrSocialItem}>
                  <Image src={logoTwitter} alt='twitter' />
                </li>
                <li className={s.footrSocialItem}>
                  <Image src={logoFb} alt='facebook' />
                </li>
                <li className={s.footrSocialItem}>
                  <Image src={logoInstagram} alt='instagram' />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={s.bottomFooter}>© Copyright 2022, All Rights Reserved by IT’sEasy</div>
      </footer>
    </Container>
  )
}

export default Layout
