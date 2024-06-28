import s from './CourseImage.module.css'
import courseImage from '../../assets/courseImage.png'

import courseShadow from '../../assets/shadows/courseHoverShadow.png'
import PlayButton, { PauseButton } from '../PlayButton/PlayButton'
import Rating from '../Rating/Rating'
import ViewsCount from '../ViewsCount/ViewsCount'
import Image from 'next/image'
import { useRef, useState } from 'react'

const CourseImage = ({ rating, mediaValue }: { rating: number; mediaValue: any }) => {
  const [play, setPlay] = useState(false)
  const videoRef = useRef(null)
  return (
    <div className={s.courseImageWrapper}>
      {typeof mediaValue?.content == 'string' && (
        <>
          {mediaValue.type == 'image' ? (
            <>
              <img className={s.courseImage} src={mediaValue.content} />
              {/* <Image className={s.courseImage} src={mediaValue.content} alt='course' /> */}
              <div className={s.courseStatsWrapper}>
                <Rating rating={rating} />
                <ViewsCount />
              </div>
              <Image className={s.shadow} src={courseShadow} alt='shadow' />
            </>
          ) : (
            <>
              <video ref={videoRef} src={mediaValue.content} style={{ width: '100%' }} />
              {!play && <PlayButton onClickPlay={setPlay} videoRef={videoRef} />}
              {play && <PauseButton onClickPlay={setPlay} videoRef={videoRef} />}
              <div className={s.courseStatsWrapper}>
                <Rating rating={rating} />
                <ViewsCount />
              </div>
              <Image className={s.shadow} src={courseShadow} alt='shadow' />
            </>
          )}
        </>
      )}
    </div>
  )
}

export default CourseImage
