import s from './FaqSection.module.css'

import plusCircle from '../../assets/plus-circle.svg'
import minusCircle from '../../assets/minus-circle.svg'

import { useState } from 'react'
import Image from 'next/image'

const data = [
  {
    question: 'Доступна ли бесплатная пробная версия?',
    anwer:
      'Да, вы можете попробовать нас бесплатно в течение 1 дня. Если вы хотите, мы предоставим вам бесплатный персонализированный 30-минутный вводный звонок, чтобы помочь вам начать работу как можно скорее.',
  },
  {
    question: 'Могу ли я изменить свой план позже?',
    anwer:
      'Да, вы можете попробовать нас бесплатно в течение 1 дня. Если вы хотите, мы предоставим вам бесплатный персонализированный 30-минутный вводный звонок, чтобы помочь вам начать работу как можно скорее.',
  },
  {
    question: 'Каковы ваши правила отмены?',
    anwer:
      'Да, вы можете попробовать нас бесплатно в течение 1 дня. Если вы хотите, мы предоставим вам бесплатный персонализированный 30-минутный вводный звонок, чтобы помочь вам начать работу как можно скорее.',
  },
  {
    question: 'Можно ли добавить в счет-фактуру другую информацию?',
    anwer:
      'Да, вы можете попробовать нас бесплатно в течение 1 дня. Если вы хотите, мы предоставим вам бесплатный персонализированный 30-минутный вводный звонок, чтобы помочь вам начать работу как можно скорее.',
  },
  {
    question: 'Будет ли доступ к курсу после его прохождения?',
    anwer:
      'Да, вы можете попробовать нас бесплатно в течение 1 дня. Если вы хотите, мы предоставим вам бесплатный персонализированный 30-минутный вводный звонок, чтобы помочь вам начать работу как можно скорее.',
  },
  {
    question: 'Как изменить адрес электронной почты моей учетной записи?',
    anwer:
      'Да, вы можете попробовать нас бесплатно в течение 1 дня. Если вы хотите, мы предоставим вам бесплатный персонализированный 30-минутный вводный звонок, чтобы помочь вам начать работу как можно скорее.',
  },
]

const FaqSection = () => {
  const [selected, setSelected] = useState<number | null>(null)

  const toggle = (i: number) => {
    if (selected === i) {
      return setSelected(null)
    }

    setSelected(i)
  }

  return (
    <div className={s.faqSection}>
      <h1 className={s.faqTitle}>
        Часто задаваемые <span className={s.accentuated}>вопросы</span>
      </h1>
      <p className={s.faqSubTitle}>Все, что вам нужно знать о продукте и выставлении счетов.</p>

      <div className={s.accordion}>
        {data.map((item, index, arr) => (
          <div key={index}>
            <div className={s.accordoinItem}>
              <div onClick={() => toggle(index)} className={s.accordionTitle}>
                <p>{item.question}</p>
                {selected === index ? (
                  <Image src={minusCircle} alt='minus' />
                ) : (
                  <Image src={plusCircle} alt='plus' />
                )}
              </div>

              <div className={`${s.accordionContent} ${selected === index ? s.show : ''}`}>
                {item.anwer}
              </div>
            </div>

            {index !== arr.length - 1 && <div className={s.divide}></div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FaqSection
