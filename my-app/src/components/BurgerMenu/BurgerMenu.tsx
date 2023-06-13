import Logo from '../Logo/Logo'
import s from './BurgerMenu.module.css'
import { useEffect, useState } from 'react'
import cross from '../../assets/burgerCross.svg'
import arrow from '../../assets/arrow.svg'
import Image from 'next/image'

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }

    setIsOpen(isOpen)
  }, [isOpen])

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
              <li className={s.active}>Главная</li>
              <li>Онлайн курсы</li>
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
