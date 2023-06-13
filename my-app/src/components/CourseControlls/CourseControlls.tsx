'use client'
import s from './CourseControlls.module.css'
import heart from '../../assets/heart.svg'
import emptyHeart from '../../assets/greyHeart.svg'
import shareHover from '../../assets/shareHover.svg'
import share from '../../assets/share.svg'
import insta from '../../assets/instaWhite.svg'
import facebook from '../../assets/facebookWhite.svg'
import twiter from '../../assets/twiterWhite.svg'
import link from '../../assets/linkWhite.svg'
import message from '../../assets/messageWhite.svg'
import { useEffect, useState } from 'react'
import DropModal from '../DropModal/DropModal'
import Image from 'next/image'

const CourseControlls = () => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
    }
  }, [])

  const [isFavorite, setIsFavorite] = useState(false)
  const [isFavoriteHover, setIsFavoriteHover] = useState(false)
  const [isShareHover, setIsShareHover] = useState(false)
  const [isShareModalShown, setIsShareModalShown] = useState(false)

  return (
    <div className={s.iconsWrapper}>
      <Image
        onMouseEnter={() => width >= 1200 && setIsFavoriteHover(true)}
        onMouseLeave={() => width >= 1200 && setIsFavoriteHover(false)}
        onClick={() => setIsFavorite((prev) => !prev)}
        src={isFavorite || isFavoriteHover ? heart : emptyHeart}
        alt='heart'
      />
      <Image
        onMouseEnter={() => width >= 1200 && setIsShareHover(true)}
        onMouseLeave={() => width >= 1200 && setIsShareHover(false)}
        onClick={() => setIsShareModalShown((prev) => !prev)}
        src={isShareHover ? shareHover : share}
        alt='share'
      />

      {isShareModalShown && (
        <DropModal indents={{ top: 40, right: -10 }} setIsDropModalShown={setIsShareModalShown}>
          <div className={s.shareModalItem}>
            <Image src={insta} alt='insta' />
            <p>Поделится в Instagram</p>
          </div>
          <div className={s.shareModalItem}>
            <Image src={facebook} alt='facebook' />
            <p>Поделится в Facebook</p>
          </div>
          <div className={s.shareModalItem}>
            <Image src={twiter} alt='twiter' />
            <p>Поделится в Twiter</p>
          </div>
          <div className={s.shareModalItem}>
            <Image src={message} alt='message' />
            <p>Поделится по электронной почте</p>
          </div>
          <div className={s.shareModalItem}>
            <Image src={link} alt='link' />
            <p>Копировать ссылку</p>
          </div>
        </DropModal>
      )}
    </div>
  )
}

export default CourseControlls
