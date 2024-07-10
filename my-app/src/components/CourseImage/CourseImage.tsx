import s from './CourseImage.module.css'
import courseImage from '../../assets/courseImage.png'

import courseShadow from '../../assets/shadows/courseHoverShadow.png'
import PlayButton, { PauseButton } from '../PlayButton/PlayButton'
import Rating from '../Rating/Rating'
import ViewsCount from '../ViewsCount/ViewsCount'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { Box } from '@mui/material'

const CourseImage = ({ rating, mediaValue }: { rating: number; mediaValue: any }) => {
  const [play, setPlay] = useState(false)
  const videoRef = useRef(null)
  const blockRef = useRef(null)
  return (
    <div className={s.courseImageWrapper}>
      {typeof mediaValue?.content == 'string' && (
        <>
          {mediaValue.type == 'image' ? (
            <>
              <Box
                sx={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  background: '#000000',
                }}
              >
                <img ref={blockRef} className={s.courseImage} src={mediaValue.content} />
              </Box>

              {/* <Image className={s.courseImage} src={mediaValue.content} alt='course' /> */}
              <div className={s.courseStatsWrapper}>
                <div
                  style={{
                    position: 'absolute',
                    background: '#000',
                    borderRadius: '12px',
                    width: '100%',
                    height: '100%',
                    opacity: '0.3',
                  }}
                >
                  &nbsp;
                </div>
                <div style={{ padding: '10px', zIndex: 99 }}>
                  <Rating rating={rating} />
                  <ViewsCount />
                </div>
              </div>
              <Image className={s.shadow} src={courseShadow} alt='shadow' />
            </>
          ) : (
            <>
              <Box
                sx={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <video ref={videoRef} src={mediaValue.content} style={{ width: '100%' }} />
                {!play && <PlayButton onClickPlay={setPlay} videoRef={videoRef} />}
                {play && <PauseButton onClickPlay={setPlay} videoRef={videoRef} />}
                <div className={s.courseStatsWrapper}>
                  <div
                    style={{
                      position: 'absolute',
                      background: '#000',
                      borderRadius: '12px',
                      width: '100%',
                      height: '100%',
                      opacity: '0.3',
                    }}
                  >
                    &nbsp;
                  </div>
                  <div style={{ padding: '10px', zIndex: 99 }}>
                    <Rating isSmall={true} rating={rating} />
                    <ViewsCount />
                  </div>
                </div>
                <Image className={s.shadow} src={courseShadow} alt='shadow' />
              </Box>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default CourseImage
