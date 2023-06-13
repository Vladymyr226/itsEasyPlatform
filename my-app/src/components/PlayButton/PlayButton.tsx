import s from './PlayButton.module.css'
import playButton from '../../assets/videoPlay.svg'
import playButtonHover from '../../assets/videoPlayButtonHover.svg'
import { useState } from 'react'
import Image from 'next/image'

const PlayButton = () => {
  const [isButtonHover, setIsButtonHover] = useState(false)

  return (
    <Image
      onMouseEnter={() => setIsButtonHover(true)}
      onMouseLeave={() => setIsButtonHover(false)}
      src={isButtonHover ? playButtonHover : playButton}
      alt='play'
      className={s.playButton}
    />
  )
}

export default PlayButton
