import s from './PromoSlider.module.css'

import loremIpsumPromo from '../../assets/loremipsumPromo.png'
import ITpromo from '../../assets/ITpromo.png'
import directionBg from '../../assets/directionBg.png'
import directionImage from '../../assets/directionImage.png'
import advantages from '../../assets/advantages.jpeg'
import laptopImage from '../../assets/laptop.png'
import promoLines from '../../assets/promoLines.png'
import backgroundLines from '../../assets/backgroundLines.png'
import mobileBackgroundLines from '../../assets/mobileBackgroundLines.png'

import Button from '../Button/Button'
import { SliderComponent } from '../Slider/Slider'
import Image from 'next/image'

const PromoSlider = () => {
  const width = window.innerWidth

  return (
    <div className={s.promoSlider}>
      <SliderComponent outside={width < 1280}>
        <div className={s.promoSlide}>
          <div className={s.promoInfo}>
            <h1 className={s.promoTitle}>
              <span className={s.accentuated}>IT</span>’s easy - войди в мир ИТ с легкостью!
            </h1>
            <p className={s.promoDesc}>
              Качественное образовантие для твоего успешного старта в этой индустрии.
            </p>
            <Button text='Тест на определения направления' />
          </div>
          <Image
            style={{
              width: `${width >= 1200 ? '55%' : '90%'}`,
              pointerEvents: 'none',
            }}
            src={advantages}
            alt='programmer'
          />
          <Image
            className={s.backgroundLines}
            src={width >= 1280 ? backgroundLines : mobileBackgroundLines}
            alt='lines'
          />
        </div>

        <div className={s.promoSlide}>
          <div className={s.promoInfo}>
            <h1 className={s.promoTitle}>
              <span className={s.accentuated}>Устал от плохих условий работы</span>
              <br />с бесперспективным будущим?
            </h1>
            <p className={s.promoDesc}>
              Попробуй себя в сфере информационных технологий. Мы поможем вам расширить свои знания
              и навыки и стать более конкурентоспособным на рынке труда.
            </p>
            <Button text='Смотреть курсы' />
          </div>
          <Image className={s.promoImage} src={ITpromo} alt='laptop' />
          <Image
            className={s.backgroundLines}
            src={width >= 1280 ? backgroundLines : mobileBackgroundLines}
            alt='lines'
          />
        </div>

        <div className={s.promoSlide}>
          <div className={s.promoInfo}>
            <h1 className={s.promoTitle}>
              <span className={s.accentuated}>Опытные наставники</span>
              <br />
              разных сфер и 100% <br /> гарантия <span className={s.accentuated}>стажировки</span>
            </h1>
            <p className={s.promoDesc}>
              Присоединяйся к нам, чтобы получить качественное образование от опытных профессионалов
              разных сфер.
              <br />
              <br />
              <span className={s.promoSubDesc}>
                *Лучшие студенты после стажеровки смогут стать частью нашей команды
              </span>
            </p>
            <Button text='Тест на определения направления' />
          </div>

          <Image
            className={s.promoImage}
            style={{ width: `${width >= 1200 ? '46%' : '90%'}` }}
            src={directionBg}
            alt='background'
          />
          <Image className={s.absolutePromoImage} src={directionImage} alt='tech skills' />
          <Image
            className={s.backgroundLines}
            src={width >= 1280 ? backgroundLines : mobileBackgroundLines}
            alt='lines'
          />
        </div>

        <div className={s.promoSlide}>
          <div className={s.promoInfo}>
            <h1 className={s.promoTitle}>
              Преимущества работы в<span className={s.accentuated}> IT</span>
            </h1>
            <ul className={s.promoAdvantagesList}>
              <li>Очень востребованная и перспективная сфера</li>
              <li>можно устроится с минимальным опытом</li>
              <li>Высокая ЗП</li>
              <li>Возможность работать удаленно из любой точки мира</li>
              <li>Комфортные условия труда со множеством плюшек</li>
              <li>Постоянное совершенствование и развитие</li>
              <li>Интересные проекты и люди</li>
            </ul>
            <Button text='Тест на определения направления' />
          </div>
          <Image className={s.laptopPromoImage} src={laptopImage} alt='laptop' />
          <Image className={s.promoLines} src={promoLines} alt='lines' />
          <Image
            className={s.backgroundLines}
            src={width >= 1280 ? backgroundLines : mobileBackgroundLines}
            alt='lines'
          />
        </div>

        <div className={s.promoSlide}>
          <div className={s.promoInfo}>
            <h1 className={s.promoTitle}>
              Многие думают, что
              <span className={s.accentuated}> Lorem Ipsum</span> - взятый с потолка набор слов
            </h1>
            <p className={s.promoDesc}>
              Но это не совсем так. Его корни уходят в один фрагмент классической латыни 45 года
              н.э., то есть более двух тысячелетий назад.
            </p>
            <Button text='Кнопка' />
          </div>
          <Image className={s.promoImage} src={loremIpsumPromo} alt='programmer' />
          <Image
            className={s.backgroundLines}
            src={width >= 1280 ? backgroundLines : mobileBackgroundLines}
            alt='lines'
          />
        </div>
      </SliderComponent>
    </div>
  )
}

export default PromoSlider
