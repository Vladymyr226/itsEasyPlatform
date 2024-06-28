import s from './PlayButton.module.css'
import playButton from '../../assets/videoPlay.svg'
import videoPause from '../../assets/videoPause.svg'
import playButtonHover from '../../assets/videoPlayButtonHover.svg'
import { useState } from 'react'
import Image from 'next/image'

const PlayButton = ({ onClickPlay, videoRef }: { onClickPlay: any; videoRef: any }) => {
  const [isButtonHover, setIsButtonHover] = useState(false)

  return (
    <Image
      onMouseEnter={() => setIsButtonHover(true)}
      onMouseLeave={() => setIsButtonHover(false)}
      src={isButtonHover ? playButtonHover : playButton}
      onClick={(e) => {
        onClickPlay(true)
        videoRef.current.play()
      }}
      alt='play'
      className={s.playButton}
    />
  )
}

export default PlayButton

export const PauseButton = ({ onClickPlay, videoRef }: { onClickPlay: any; videoRef: any }) => {
  const [isButtonHover, setIsButtonHover] = useState(false)

  return (
    <Image
      onMouseEnter={() => setIsButtonHover(true)}
      onMouseLeave={() => setIsButtonHover(false)}
      src={videoPause}
      style={{ opacity: isButtonHover ? 1 : 0.0 }}
      onClick={(e) => {
        onClickPlay(false)
        videoRef.current.pause()
      }}
      alt='play'
      className={s.playButton}
    />
  )
}
