import s from './CourseImage.module.css'
import courseImage from '../../assets/courseImage.png'

import courseShadow from '../../assets/shadows/courseHoverShadow.png'
import PlayButton from '../PlayButton/PlayButton'
import Rating from '../Rating/Rating'
import ViewsCount from '../ViewsCount/ViewsCount'
import Image from 'next/image'

const CourseImage = () => {
  return (
    <div className={s.courseImageWrapper}>
      <Image className={s.courseImage} src={courseImage} alt='course' />

      <PlayButton />
      <div className={s.courseStatsWrapper}>
        <Rating />
        <ViewsCount />
      </div>

      <Image className={s.shadow} src={courseShadow} alt='shadow' />
    </div>
  )
}

export default CourseImage
