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

type LayoutProps = {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
    }
  }, [])

  return (
    <Container>
      {/* блок контент чтобы прижать футер к низу странички */}
      <div className={s.content}>
        <header className={s.header}>
          <Logo />

          <div className={s.headerRightSide}>
            {width >= 1200 ? (
              <>
                <div className={s.headerNavigation}>
                  <div className={s.headerActiveNavigationLink}>Главная</div>
                  <div className={s.headerNavigationLink}>Онлайн курсы</div>
                  <div className={s.headerNavigationLink}>Про нас</div>
                  <div className={s.headerNavigationLink}>Карьера</div>
                </div>

                <div className={s.headerControlls}>
                  <LanguageSwitcher />
                  <Usermenu />
                </div>
              </>
            ) : (
              <>
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
          <Logo />

          <div className={s.footerInfo}>
            <div className={s.footerInfoCard}>
              <p className={s.footerInfoTitle}>Направления</p>
              <div className={s.listWrapper}>
                <ul className={s.footerInfoList}>
                  <li className={s.footerInfoItem}>Программирование</li>
                  <li className={s.footerInfoItem}>Дизайн</li>
                  <li className={s.footerInfoItem}>Аналитика</li>
                  <li className={s.footerInfoItem}>Маркетинг</li>
                </ul>
                <ul className={s.footerInfoList}>
                  <li className={s.footerInfoItem}>Управление</li>
                  <li className={s.footerInfoItem}>Английский язык</li>
                  <li className={s.footerInfoItem}>Все курсы</li>
                </ul>
              </div>
            </div>

            <div className={s.footerInfoCard}>
              <p className={s.footerInfoTitle}>Служба поддержки</p>
              <ul className={s.footerInfoList}>
                <li className={s.footerInfoItem}>Связаться с отделом продаж</li>
                <li className={s.footerInfoItem}>Получить помощь</li>
              </ul>
            </div>

            <div className={s.footerInfoCard}>
              <p className={s.footerInfoTitle}>Компания</p>

              {width >= 1200 ? (
                <ul className={s.footerInfoList}>
                  <li className={s.footerInfoItem}>Про нас</li>
                  <li className={s.footerInfoItem}>Работа</li>
                  <li className={s.footerInfoItem}>Карьера</li>
                  <li className={s.footerInfoItem}>Партнёрам</li>
                </ul>
              ) : (
                <div className={s.listWrapper}>
                  <ul className={s.footerInfoList}>
                    <li className={s.footerInfoItem}>Про нас</li>
                    <li className={s.footerInfoItem}>Работа</li>
                  </ul>
                  <ul className={s.footerInfoList}>
                    <li className={s.footerInfoItem}>Карьера</li>
                    <li className={s.footerInfoItem}>Партнёрам</li>
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
