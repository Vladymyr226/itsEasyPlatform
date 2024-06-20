import s from './Rating.module.css'

import fillStar from '../../assets/fillStar.svg'
import almostFillStar from '../../assets/almostFillStar.svg'
import Image from 'next/image'
import RatingMui from '@mui/material/Rating'
const Rating = ({
  isSmall,
  isBig,
  rating,
}: {
  isSmall?: boolean
  isBig?: boolean
  rating: number
}) => {
  return (
    <div className={`${s.ratingWrapper} ${isSmall ? s.small : ''} ${isBig ? s.big : ''}`}>
      Рейтинг курса
      <ul className={s.starsList}>
        <RatingMui
          readOnly
          name='rating'
          value={rating}
          precision={0.1}
          sx={{
            marginLeft: 4,
            paddingTop: 1,
            paddingBottom: 1,
          }}
        />
      </ul>
      {rating}
    </div>
  )
}

export default Rating
