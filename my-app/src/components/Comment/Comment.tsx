import s from './Comment.module.css'

import manAvatar from '../../assets/manAvatar.png'
import girlAvatar from '../../assets/girlAvatar.png'
import fillStar from '../../assets/fillStar.svg'
import Image from 'next/image'
import { CommentData } from '@/utils/interfaces'

const Comment = ({ data }: { data: CommentData }) => {
  return (
    <div className={s.comment}>
      <div className={s.commentHead}>
        <Image className={s.avatar} src={data.gender === 'female' ? girlAvatar : manAvatar} alt='avatar' />

        <div>
          <p>{data.name}, {data.position}</p>
          <div className={s.userRate}>
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
                <Image src={fillStar} alt='star' />
              </li>
            </ul>
            <span>{data.period}</span>
          </div>
        </div>
      </div>

      <p>{data.comment}</p>
    </div>
  )
}

export default Comment
