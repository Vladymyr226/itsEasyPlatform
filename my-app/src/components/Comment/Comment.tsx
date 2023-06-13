import s from './Comment.module.css'

import manAvatar from '../../assets/manAvatar.png'
import girlAvatar from '../../assets/girlAvatar.png'
import fillStar from '../../assets/fillStar.svg'
import Image from 'next/image'

const Comment = ({ isGirl }: { isGirl?: boolean }) => {
  return (
    <div className={s.comment}>
      <div className={s.commentHead}>
        <Image className={s.avatar} src={isGirl ? girlAvatar : manAvatar} alt='avatar' />

        <div>
          <p>{isGirl ? 'Анастасия Правых' : 'Павел Кловский'}</p>
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
            <span>Месяц назад</span>
          </div>
        </div>
      </div>

      <p>
        Quasi quo sit suscipit tempora aperiam rerum placeat id. Voluptatem praesentium excepturi
        id. Repudiandae incidunt doloremque. Error est et ullam.
      </p>
    </div>
  )
}

export default Comment
