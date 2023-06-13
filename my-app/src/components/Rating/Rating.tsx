import s from './Rating.module.css'

import fillStar from '../../assets/fillStar.svg'
import almostFillStar from '../../assets/almostFillStar.svg'
import Image from 'next/image'

const Rating = ({ isSmall, isBig }: { isSmall?: boolean; isBig?: boolean }) => {
  return (
    <div className={`${s.ratingWrapper} ${isSmall ? s.small : ''} ${isBig ? s.big : ''}`}>
      Рейтинг курса
      <ul className={s.starsList}>
        <li>
          <Image src={fillStar} alt='star' />
        </li>
        <li>
          <Image src={fillStar} alt='star' />
        </li>
        <li>
          <Image src={fillStar} alt='star' />
        </li>
        <li>
          <Image src={fillStar} alt='star' />
        </li>
        <li>
          <Image src={almostFillStar} alt='star' />
        </li>
      </ul>
      4,7
    </div>
  )
}

export default Rating
