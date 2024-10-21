// 'use client'
// import s from './PromoSlider.module.css'
// import backgroundLines from '../../assets/backgroundLines.png'
// import mobileBackgroundLines from '../../assets/mobileBackgroundLines.png'
// import slideFirstImage from '../../assets/slideFirstImage.png'
// import slideFirstText1 from '../../assets/slideFirstText1.svg'
// import slideFirstText2 from '../../assets/slideFirstText2.svg'
//
// import Button from '../Button/Button'
// import { SliderComponent } from '../Slider/Slider'
// import Image from 'next/image'
// import { useEffect, useState } from 'react'
//
// const PromoSlider = () => {
//   const [width, setWidth] = useState(0)
//
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       setWidth(window.innerWidth)
//     }
//   }, [])
//
//   return (
//     <div className={s.promoSlider}>
//       <SliderComponent outside={width < 1280}>
//         {/*<div className={s.promoSlide}>*/}
//         {/*  <div className={s.promoInfo}>*/}
//         {/*    <h1*/}
//         {/*      style={{*/}
//         {/*        fontSize: `${width >= 1200 ? '78px' : '32px'}`,*/}
//         {/*        lineHeight: '93.6px',*/}
//         {/*      }}*/}
//         {/*    >*/}
//         {/*      Learning*/}
//         {/*      <Image*/}
//         {/*        src={slideFirstText1}*/}
//         {/*        alt="slideFirstText1"*/}
//         {/*        style={{ display: 'inline', width: '60px', height: '60px' }}*/}
//         {/*      />*/}
//         {/*      Information Technologies is easier with{'  '}*/}
//         {/*      <span>*/}
//         {/*        <Image*/}
//         {/*          src={slideFirstText2}*/}
//         {/*          alt="slideFirstText2"*/}
//         {/*          style={{ display: 'inline', width: '60px', height: '60px' }}*/}
//         {/*        />*/}
//         {/*      </span>{' '}*/}
//         {/*      AI Tutor*/}
//         {/*    </h1>*/}
//         {/*    <Button text="View Courses" />*/}
//         {/*  </div>*/}
//         {/*  <Image*/}
//         {/*    style={{*/}
//         {/*      width: `${width >= 1200 ? '45%' : '90%'}`,*/}
//         {/*      pointerEvents: 'none',*/}
//         {/*    }}*/}
//         {/*    src={slideFirstImage}*/}
//         {/*    alt="programmer"*/}
//         {/*  />*/}
//         {/*  <Image*/}
//         {/*    className={s.backgroundLines}*/}
//         {/*    src={width >= 1280 ? backgroundLines : mobileBackgroundLines}*/}
//         {/*    alt="lines"*/}
//         {/*  />*/}
//         {/*</div>*/}
//
//         {/*<div className={s.promoSlide}>*/}
//         {/*  <div className={s.promoInfo}>*/}
//         {/*    <h1 className={s.promoTitle}>*/}
//         {/*      <span className={s.accentuated}>IT</span>’s easy - войди в мир ИТ с легкостью!*/}
//         {/*    </h1>*/}
//         {/*    <p className={s.promoDesc}>*/}
//         {/*      Качественное образовантие для твоего успешного старта в этой индустрии.*/}
//         {/*    </p>*/}
//         {/*    <Button text='Тест на определения направления' />*/}
//         {/*  </div>*/}
//         {/*  <Image*/}
//         {/*    style={{*/}
//         {/*      width: `${width >= 1200 ? '55%' : '90%'}`,*/}
//         {/*      pointerEvents: 'none',*/}
//         {/*    }}*/}
//         {/*    src={advantages}*/}
//         {/*    alt='programmer'*/}
//         {/*  />*/}
//         {/*  <Image*/}
//         {/*    className={s.backgroundLines}*/}
//         {/*    src={width >= 1280 ? backgroundLines : mobileBackgroundLines}*/}
//         {/*    alt='lines'*/}
//         {/*  />*/}
//         {/*</div>*/}
//
//         {/*<div className={s.promoSlide}>*/}
//         {/*  <div className={s.promoInfo}>*/}
//         {/*    <h1 className={s.promoTitle}>*/}
//         {/*      <span className={s.accentuated}>Устал от плохих условий работы</span>*/}
//         {/*      <br />с бесперспективным будущим?*/}
//         {/*    </h1>*/}
//         {/*    <p className={s.promoDesc}>*/}
//         {/*      Попробуй себя в сфере информационных технологий. Мы поможем вам расширить свои знания*/}
//         {/*      и навыки и стать более конкурентоспособным на рынке труда.*/}
//         {/*    </p>*/}
//         {/*    <Button text='Смотреть курсы' />*/}
//         {/*  </div>*/}
//         {/*  <Image className={s.promoImage} src={ITpromo} alt='laptop' />*/}
//         {/*  <Image*/}
//         {/*    className={s.backgroundLines}*/}
//         {/*    src={width >= 1280 ? backgroundLines : mobileBackgroundLines}*/}
//         {/*    alt='lines'*/}
//         {/*  />*/}
//         {/*</div>*/}
//
//         {/*<div className={s.promoSlide}>*/}
//         {/*  <div className={s.promoInfo}>*/}
//         {/*    <h1 className={s.promoTitle}>*/}
//         {/*      <span className={s.accentuated}>Опытные наставники</span>*/}
//         {/*      <br />*/}
//         {/*      разных сфер и 100% <br /> гарантия <span className={s.accentuated}>стажировки</span>*/}
//         {/*    </h1>*/}
//         {/*    <p className={s.promoDesc}>*/}
//         {/*      Присоединяйся к нам, чтобы получить качественное образование от опытных профессионалов*/}
//         {/*      разных сфер.*/}
//         {/*      <br />*/}
//         {/*      <br />*/}
//         {/*      <span className={s.promoSubDesc}>*/}
//         {/*        *Лучшие студенты после стажеровки смогут стать частью нашей команды*/}
//         {/*      </span>*/}
//         {/*    </p>*/}
//         {/*    <Button text='Тест на определения направления' />*/}
//         {/*  </div>*/}
//
//         {/*  <Image*/}
//         {/*    className={s.promoImage}*/}
//         {/*    style={{ width: `${width >= 1200 ? '46%' : '90%'}` }}*/}
//         {/*    src={directionBg}*/}
//         {/*    alt='background'*/}
//         {/*  />*/}
//         {/*  <Image className={s.absolutePromoImage} src={directionImage} alt='tech skills' />*/}
//         {/*  <Image*/}
//         {/*    className={s.backgroundLines}*/}
//         {/*    src={width >= 1280 ? backgroundLines : mobileBackgroundLines}*/}
//         {/*    alt='lines'*/}
//         {/*  />*/}
//         {/*</div>*/}
//
//         {/*<div className={s.promoSlide}>*/}
//         {/*  <div className={s.promoInfo}>*/}
//         {/*    <h1 className={s.promoTitle}>*/}
//         {/*      Преимущества работы в<span className={s.accentuated}> IT</span>*/}
//         {/*    </h1>*/}
//         {/*    <ul className={s.promoAdvantagesList}>*/}
//         {/*      <li>Очень востребованная и перспективная сфера</li>*/}
//         {/*      <li>можно устроится с минимальным опытом</li>*/}
//         {/*      <li>Высокая ЗП</li>*/}
//         {/*      <li>Возможность работать удаленно из любой точки мира</li>*/}
//         {/*      <li>Комфортные условия труда со множеством плюшек</li>*/}
//         {/*      <li>Постоянное совершенствование и развитие</li>*/}
//         {/*      <li>Интересные проекты и люди</li>*/}
//         {/*    </ul>*/}
//         {/*    <Button text='Тест на определения направления' />*/}
//         {/*  </div>*/}
//         {/*  <Image className={s.laptopPromoImage} src={laptopImage} alt='laptop' />*/}
//         {/*  <Image className={s.promoLines} src={promoLines} alt='lines' />*/}
//         {/*  <Image*/}
//         {/*    className={s.backgroundLines}*/}
//         {/*    src={width >= 1280 ? backgroundLines : mobileBackgroundLines}*/}
//         {/*    alt='lines'*/}
//         {/*  />*/}
//         {/*</div>*/}
//
//         {/*<div className={s.promoSlide}>*/}
//         {/*  <div className={s.promoInfo}>*/}
//         {/*    <h1 className={s.promoTitle}>*/}
//         {/*      Многие думают, что*/}
//         {/*      <span className={s.accentuated}> Lorem Ipsum</span> - взятый с потолка набор слов*/}
//         {/*    </h1>*/}
//         {/*    <p className={s.promoDesc}>*/}
//         {/*      Но это не совсем так. Его корни уходят в один фрагмент классической латыни 45 года*/}
//         {/*      н.э., то есть более двух тысячелетий назад.*/}
//         {/*    </p>*/}
//         {/*    <Button text='Кнопка' />*/}
//         {/*  </div>*/}
//         {/*  <Image className={s.promoImage} src={loremIpsumPromo} alt='programmer' />*/}
//         {/*  <Image*/}
//         {/*    className={s.backgroundLines}*/}
//         {/*    src={width >= 1280 ? backgroundLines : mobileBackgroundLines}*/}
//         {/*    alt='lines'*/}
//         {/*  />*/}
//         {/*</div>*/}
//
//         {/*===================================================================*/}
//
//         <div className={s.promoSlide}>
//           <div className={s.promoInfo}>
//             <h1
//               style={{
//                 fontSize: `${width >= 1200 ? '2.4rem' : '1.2rem'}`,
//               }}
//             >
//               Unlock seamless learning experiances with AI- powered guidance
//             </h1>
//             <Button text="View Courses" />
//           </div>
//
//           <div className={s.promoImageBlockFirst}>
//             <Image
//               className={s.promoImage}
//               style={{
//                 width: `${width >= 1200 ? '100%' : '100%'}`
//               }}
//               src={slideFirstImage}
//               alt="programmer"
//             />
//             {/*  <Image*/}
//             {/*    className={s.promoImage}*/}
//             {/*    src={slideFirstImage}*/}
//             {/*    alt="programmer"*/}
//             {/*    // layout="fill" // Вказує, що зображення має заповнити батьківський блок*/}
//             {/*    // objectFit="cover" // Налаштовує зображення на обрізку, щоб покрити блок*/}
//             {/*  />*/}
//           </div>
//
//           <Image
//             className={s.backgroundLines}
//             src={width >= 1280 ? backgroundLines : mobileBackgroundLines}
//             alt="lines"
//           />
//         </div>
//
//       </SliderComponent>
//     </div>
//   )
// }
//
// export default PromoSlider


'use client'
import s from './PromoSlider.module.css'
import slideFirstImage from '../../assets/slideFirstImage.png'
import backgroundLines from '../../assets/backgroundLines.png'
import mobileBackgroundLines from '../../assets/mobileBackgroundLines.png'
import iconCarousel3 from '../../assets/iconCarousel3.png'
import carouselImage3 from '../../assets/carouselImage3.png'
import carouselImage4 from '../../assets/carouselImage4.png'
import iconCarousel4f from '../../assets/iconCarousel4f.png'
import rectangleForCarousel from '../../assets/rectangleForCarousel.png'
import carouselImage2 from '../../assets/carouselImage2.png'
import starForCarouselBottom from '../../assets/starForCarouselBottom.png'
import starForCarousel2Top from '../../assets/starForCarousel2Top.png'

import Button from '../Button/Button'
import { SliderComponent } from '../Slider/Slider'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const PromoSlider = () => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
    }
  }, [])

  return (
    <div className={s.promoSlider}>
      <SliderComponent outside={width < 1280}>
        <div className={s.promoSlide}>
          <div className={s.promoInfo}>
            <h1>
              Say goodbye to traditional learning struggles. With AI Tutor,
              gaining new knowledge is now a streamlined, personalized,
              and engaging experience for everyone.
            </h1>
            <Button text="View Courses" />
          </div>

          <div className={s.promoImageBlockFirst}>
            <Image
              className={s.promoImage}
              src={slideFirstImage}
              alt="programmer"
            />
          </div>
          <Image
            className={s.backgroundLines}
            src={width >= 1280 ? backgroundLines : mobileBackgroundLines}
            alt="lines"
          />
        </div>
        <div className={s.promoSlide2}>
          <div className={s.promoInfo}>
            <h1>
              Learning complex topics has never been this easy. AI Tutor
              simplifies the process, providing personalized guidance
              every step of the way
            </h1>
            <Button text="View Courses" />
          </div>

          <Image
            className={s.promoCarouselStarTop}
            src={starForCarousel2Top}
            alt="icon"
          />
          <Image
            className={s.promoCarouselStarBottom}
            src={starForCarouselBottom}
            alt="icon"
          />

          <div className={s.promoImageBlockFirst}>
            <Image
              className={s.promoImage}
              src={carouselImage2}
              alt="programmer"
            />
          </div>
          <Image
            className={s.backgroundLines}
            src={width >= 1280 ? backgroundLines : mobileBackgroundLines}
            alt="lines"
          />
        </div>
        <div className={s.promoSlide3}>
          <div className={s.promoInfo}>
            <h1>Plenty of hands-on practice and real world</h1>
            <div className={s.promoTitleWithImg}>
              <Image
                src={iconCarousel3}
                alt="icon"
                width={40}
                height={40}
              />
              <p
                style={{
                  fontSize: `${width >= 1200 ? '2.7rem' : '1.6rem'}`,
                }}
              >
                task implementation
              </p>
            </div>

            <p
              style={{
                fontSize: `${width >= 1200 ? '1.1rem' : '1rem'}`,
              }}
            >
              With pre-configured development environment, ready to use right out of the box!
            </p>
            <Button text="View Courses" />
          </div>

          <div className={s.promoImageBlockFirst}>
            <Image
              className={s.promoImage}
              src={carouselImage3}
              alt="programmer"
            />
          </div>
          <Image
            className={s.backgroundLines}
            src={width >= 1280 ? backgroundLines : mobileBackgroundLines}
            alt="lines"
          />
        </div>
        <div className={s.promoSlide}>
          <div className={s.promoInfo}>
            <h1>
              Unlock a world where learning is no longer a challenge.
              Thanks to AI Tutor, you can seamlessly gain knowledge and
              skills faster and more efficiently than ever before
            </h1>
            <Button text="View Courses" />
          </div>

          <Image
            className={s.promoCarouselIcon4f}
            src={iconCarousel4f}
            alt="icon"
          />
          <Image
            className={s.rectangleForCarousel4}
            src={rectangleForCarousel}
            alt="icon"
          />

          <div className={s.promoImageBlockFirst}>
            <Image
              className={s.promoImage}
              src={carouselImage4}
              alt="programmer"
            />
          </div>
          <Image
            className={s.backgroundLines}
            src={width >= 1280 ? backgroundLines : mobileBackgroundLines}
            alt="lines"
          />
        </div>
      </SliderComponent>
    </div>
  )
}

export default PromoSlider
