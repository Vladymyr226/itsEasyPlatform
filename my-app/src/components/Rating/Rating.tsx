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
      <p>Рейтинг курса</p>

      <div>
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
      </div>
      {rating}
    </div>
  )
}

export default Rating
