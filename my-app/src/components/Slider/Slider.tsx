import React, { useState } from 'react'
import Slider, { Settings } from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import arrowLeft from '../../assets/prevSlideButton.svg'
import arrowLeftHover from '../../assets/prevSlideButtonHover.svg'
import s from './Slider.module.css'
import Image from 'next/image'

type SliderProps = {
  children: React.ReactNode
  outside?: boolean
}

export function SliderComponent({ children, outside }: SliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLeftButtonHover, setIsLeftButtonHover] = useState(false)
  const [isRightButtonHover, setIsRightButtonHover] = useState(false)

  // const width = window.innerWidth;
  // width >= 1200 ? false : true;

  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    pauseOnHover: false,
    adaptiveHeight: false,
    arrows: false,

    appendDots: (dots: React.ReactNode) => (
      <div
        style={{
          position: 'absolute',
          bottom: outside ? -60 : 20,
          display: 'flex',
          alignItems: 'center',

          gap: 28,
        }}
      >
        <ul className={s.dotsList}> {dots} </ul>
        <div className={s.buttonsWrapper}>
          <button
            className={s.arrowButton}
            onClick={() => {
              sliderRef.current?.slickPrev()
            }}
            onMouseEnter={() => setIsLeftButtonHover(true)}
            onMouseLeave={() => setIsLeftButtonHover(false)}
          >
            <Image src={isLeftButtonHover ? arrowLeftHover : arrowLeft} alt='prev' />
          </button>
          <button
            className={s.arrowReverseButton}
            onClick={() => {
              sliderRef.current?.slickNext()
            }}
            onMouseEnter={() => setIsRightButtonHover(true)}
            onMouseLeave={() => setIsRightButtonHover(false)}
          >
            <Image src={isRightButtonHover ? arrowLeftHover : arrowLeft} alt='next' />
          </button>
        </div>
      </div>
    ),
    customPaging: (i: number) => (
      <div
        style={{
          width: '30px',
          height: '4px',
          backgroundColor: i === currentSlide ? 'var(--main-color)' : '#2B2941',
          cursor: 'pointer',
        }}
      ></div>
    ),
    beforeChange: (current: number, next: number) => {
      setCurrentSlide(next)
    },
  }

  const sliderRef = React.useRef<Slider>(null)

  return (
    <Slider {...settings} ref={sliderRef}>
      {children}
    </Slider>
  )
}
