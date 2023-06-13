'use client'
import s from './Comments.module.css'
import { SliderComponent } from '../Slider/Slider'
import Comment from '../Comment/Comment'
import { useEffect, useState } from 'react'

const Slide = ({ isSingle }: { isSingle?: boolean }) => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
    }
  }, [])

  return (
    <ul className={s.commentsSlide}>
      {isSingle ? (
        <Comment isGirl={true} />
      ) : (
        <>
          <Comment /> <Comment isGirl={true} />
        </>
      )}
    </ul>
  )
}

const Comments = () => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
    }
  }, [])

  return (
    <div className={s.commentsSlider}>
      <SliderComponent outside={true}>
        <Slide isSingle={width < 1200} />
        <Slide isSingle={width < 1200} />
        <Slide isSingle={width < 1200} />
        <Slide isSingle={width < 1200} />
      </SliderComponent>
    </div>
  )
}

export default Comments
