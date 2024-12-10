'use client'
import s from './Comments.module.css'
import { SliderComponent } from '../Slider/Slider'
import Comment from '../Comment/Comment'
import { useEffect, useState } from 'react'
import { CommentData, Language } from '@/utils/interfaces'

const data: Record<Language, CommentData[]> = {
  EN: [
    { name: 'Anna K.', gender: 'female', position: 'Software Developer', period: 'Month ago', comment: `
      I was skeptical at first, but learning with AI on it-tutor.ai was a game-changer for me. Unlike traditional
      classroom settings where you follow a rigid schedule, the AI adapted to my pace. It helped me grasp complex
      concepts much faster, offering real-time feedback and additional resources when I needed them. I was able to
      complete my course in half the time it would have taken offline!`},

    { name: 'Dmytro L.', gender: 'male', position: 'Data Scientist', period: 'Month ago', comment: `
      In a traditional course, I often found myself either rushing through topics or waiting for others to catch up.
      But with it-tutor.ai, the AI personalized my learning experience to focus on the areas where I needed the most
      help. I felt like I had a tutor available 24/7, guiding me through the process. My progress skyrocketed, and I
      learned more in a few weeks than I did in months of offline courses!`},

    { name: 'Olha S.', gender: 'female', position: 'Front-End Developer', period: 'Month ago', comment: `
      The flexibility of it-tutor.ai made all the difference for me. I was able to learn at my own pace, and the AI
      would detect when I struggled and provided targeted exercises and explanations to reinforce my understanding. In
      an offline class, this kind of personalized attention just isn’t possible. I finished my course much faster than
      expected and felt more confident with the material.`},

    { name: 'Maxim T.', gender: 'male', position: 'Cybersecurity Specialist', period: 'Month ago', comment: `
      I've taken many offline courses before, but none compare to my experience with it-tutor.ai. The AI identifies
      where you excel and where you need improvement, helping you progress faster. I saved so much time by skipping
      over concepts I already understood and diving deeper into areas that required more attention. It’s like having a
      personal instructor always focused on your learning goals.`},
      
    { name: 'Natalia P.', gender: 'female', position: 'QA Engineer', period: 'Month ago', comment: `
      The AI in it-tutor.ai keeps you engaged and adjusts the learning path based on your needs. I’ve taken offline
      courses where I was often left confused after class, but here I felt constantly supported. The speed at which I
      was able to move forward was amazing—I completed the course in record time compared to traditional methods!`},
  ],
  RU: [
    { name: 'Анна К.', gender: 'female', position: 'Разработчик программного обеспечения', period: 'Месяц назад',
      comment: `Сначала я была настроена скептически, но обучение с ИИ на it-tutor.ai стало для меня настоящим
      прорывом. В отличие от традиционных занятий, где приходится следовать жёсткому графику, ИИ подстраивался под мой
      темп. Он помогал мне быстрее осваивать сложные концепции, предоставляя обратную связь и дополнительные материалы
      в нужные моменты. Я завершила курс вдвое быстрее, чем если бы училась оффлайн!`},

    { name: 'Дмитрий Л.', gender: 'male', position: 'Data Scientist', period: 'Месяц назад', comment: `
      На традиционных курсах я часто торопился или ждал, пока остальные догонят. Но на it-tutor.ai ИИ персонализировал
      моё обучение, уделяя больше внимания тем областям, где мне нужна была помощь. Это было как иметь наставника 24/7,
      который направлял меня в процессе обучения. Мой прогресс значительно ускорился, и я узнал больше за несколько
      недель, чем за месяцы оффлайн-курсов!`},

    { name: 'Ольга С.', gender: 'female', position: 'Front-End Разработчик', period: 'Месяц назад', comment: `
      Гибкость it-tutor.ai кардинально изменила мой подход к обучению. Я могла учиться в своём темпе, и ИИ сразу
      определял, где я испытываю трудности, предоставляя целевые упражнения и объяснения для улучшения понимания.
      На оффлайн-курсах такое индивидуальное внимание просто невозможно. Я завершила курс гораздо быстрее, чем ожидала,
      и чувствовала себя гораздо увереннее в материале.`},

    { name: 'Максим Т.', gender: 'male', position: 'Специалист по кибербезопасности', period: 'Месяц назад', comment: `
      Я прошел множество оффлайн-курсов, но ни один не сравнится с опытом на it-tutor.ai. ИИ определяет, в чём вы
      хороши, а где требуются улучшения, помогая быстрее продвигаться вперёд. Я сэкономил кучу времени, пропуская темы,
      которые уже знал, и углубляясь в те, которые требовали большего внимания. Это как иметь личного инструктора,
      который всегда сосредоточен на ваших учебных целях.`},

    { name: 'Наталья П.', gender: 'female', position: 'QA Инженер', period: 'Месяц назад', comment: `
      ИИ на it-tutor.ai помогает оставаться вовлечённым и корректирует путь обучения в зависимости от ваших нужд. Я
      проходила оффлайн-курсы, где часто оставалась в замешательстве после занятий, но здесь я чувствовала постоянную
      поддержку. Скорость моего продвижения была невероятной — я завершила курс в рекордные сроки по сравнению с
      традиционными методами!`},
  ],
  UA: [
    { name: 'Анна К.', gender: 'female', position: 'Розробник програмного забезпечення', period: 'Місяць тому',
      comment: `Спочатку я була скептично налаштована, але навчання з ШІ на it-tutor.ai стало справжнім проривом для
      мене. На відміну від традиційних занять, де потрібно дотримуватися жорсткого графіку, ШІ підлаштовувався під мій
      темп. Він допомагав мені швидше засвоювати складні концепції, надаючи зворотний зв’язок та додаткові матеріали,
      коли це було потрібно. Я завершила курс у двічі швидше, ніж якби навчалася офлайн!`},

    { name: 'Дмитро Л.', gender: 'male', position: 'Data Scientist', period: 'Місяць тому', comment: `
      На традиційних курсах я часто або поспішав, або чекав, поки інші наздоженуть. Але на it-tutor.ai ШІ
      персоналізував моє навчання, приділяючи більше уваги тим сферам, де мені була потрібна допомога. Це було як мати
      наставника 24/7, який спрямовував мене протягом усього процесу навчання. Мій прогрес зріс неймовірно швидко, і я
      дізнався більше за кілька тижнів, ніж за місяці офлайн-курсів!`},

    { name: 'Ольга С.', gender: 'female', position: 'Front-End Розробник', period: 'Місяць тому', comment: `
      Гнучкість it-tutor.ai кардинально змінила мій підхід до навчання. Я могла навчатися у своєму темпі, і ШІ відразу
      виявляв, де у мене виникають труднощі, надаючи цільові вправи та пояснення для кращого розуміння. На
      офлайн-курсах таку індивідуальну увагу просто неможливо отримати. Я завершила курс набагато швидше, ніж
      очікувала, і почувалася набагато впевненіше в матеріалі.`},

    { name: 'Максим Т.', gender: 'male', position: 'Спеціаліст з кібербезпеки', period: 'Місяць тому', comment: `
      Я проходив багато офлайн-курсів, але жоден з них не зрівняється з досвідом на it-tutor.ai. ШІ визначає, в чому ви
      сильні, а де потрібні покращення, допомагаючи швидше просуватися вперед. Я заощадив багато часу, пропускаючи
      теми, які вже знав, і глибше занурюючись у ті, що вимагали більше уваги. Це як мати особистого інструктора, який
      завжди зосереджений на ваших навчальних цілях.`},

    { name: 'Наталія П.', gender: 'female', position: 'QA Інженер', period: 'Місяць тому', comment: `
      ШІ на it-tutor.ai допомагає залишатися залученим та коригує шлях навчання відповідно до ваших потреб. Я проходила
      офлайн-курси, де часто залишалася розгубленою після занять, але тут я відчувала постійну підтримку. Швидкість
      мого просування була неймовірною — я завершила курс у рекордні терміни порівняно з традиційними методами!`},
  ],
  PL: [],
  ES: [],
}

const Slide = ({ comment, nextComment }: { comment: CommentData, nextComment?: CommentData }) => {
  return (
    <ul className={s.commentsSlide}>
       <Comment data={comment} />
       {nextComment && <Comment data={nextComment} />}
    </ul>
  )
}

const Comments = ({ language }: { language: Language }) => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
    }
  }, [])

  return (
    <div className={s.commentsSlider}>
      <SliderComponent outside={true}>
        {data[language].map((item: CommentData, index: number, arr: CommentData[]) =>
          <Slide
            key={index}
            comment={item}
            nextComment={width >= 1200 
              ? index === arr.length - 1
                ? arr[0]
                : arr[index + 1]
              : undefined}
          />
        )}
      </SliderComponent>
    </div>
  )
}

export default Comments
