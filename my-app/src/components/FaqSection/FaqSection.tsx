import s from './FaqSection.module.css'

import plusCircle from '../../assets/plus-circle.svg'
import minusCircle from '../../assets/minus-circle.svg'

import { useState } from 'react'
import Image from 'next/image'
import { getLocale } from '@/utils/getLocale'
import { Language } from '@/utils/interfaces'

const data: Record<Language, { question: string, answer: string }[]> = {
  EN: [
    {
      question: 'What is it-tutor.ai?',
      answer: `it-tutor.ai is an online platform offering a range of IT courses integrated with artificial intelligence
        (AI) to enhance the learning experience. Whether you’re new to tech or looking to advance your skills, our
        courses are designed to adapt to your learning style and pace.`,
    },
    {
      question: 'How does AI enhance my learning experience?',
      answer: `Our AI-powered system personalizes your learning journey by analyzing your progress, providing real-time
        feedback, suggesting additional resources, and adjusting course difficulty based on your performance. It’s like
        having a personal tutor guiding you through every step of the process.`,
    },
    {
      question: 'What kind of courses are offered on it-tutor.ai?',
      answer: `We offer a wide range of courses, from beginner to advanced levels, in topics such as programming (PHP,
        Vue.js, etc.), machine learning, cybersecurity, quality assurance, and more. Each course is tailored to help
        you gain practical skills in today’s most in-demand tech fields.`,
    },
    {
      question: 'Can I learn at my own pace?',
      answer: `Yes! Our platform is designed to be flexible. You can learn at your own pace, with AI guiding you
        through the content as you progress. You can revisit topics, practice more when needed, and move ahead as you
        master the material.`,
    },
    {
      question: 'Is it-tutor.ai suitable for beginners?',
      answer: `Absolutely! We offer courses specifically designed for beginners, making complex topics approachable and
        easy to understand. Our AI helps by providing explanations, exercises, and real-time assistance based on your
        needs.`,
    },
    {
      question: 'Do I need any prior IT knowledge to start?',
      answer: `No prior knowledge is required to get started on it-tutor.ai. Our beginner courses start from the
        fundamentals and gradually introduce more advanced concepts. You can learn at your own pace, with guidance
        provided throughout your journey.`,
    },
    {
      question: 'How much do the courses cost?',
      answer: `Our courses are competitively priced, with both one-time payment options and subscription plans
        available. We also offer free trial lessons so you can experience our platform before committing to a course.`,
    },
    {
      question: 'How do I get started?',
      answer: `Getting started is simple! Just create an account on our platform, explore our course catalog, and
        enroll in the course that fits your goals. Once enrolled, our AI will tailor the learning experience to help
        you succeed.`,
    },
    {
      question: 'Is there support available if I get stuck?',
      answer: `Yes! We offer multiple support channels, including community forums, direct messaging with instructors,
        and AI-driven tips. Our AI will also provide suggestions and resources if you encounter any difficulties
        during the course.`,
    },
    {
      question: 'Can I receive a certificate upon course completion?',
      answer: `Yes, upon completing a course on it-tutor.ai, you will receive a certificate of completion. This can
        help boost your resume and demonstrate your expertise to potential employers.`,
    },
    {
      question: 'Do you offer internships?',
      answer: `Yes! For our top-performing students, we offer the opportunity to participate in internships. This
        allows you to gain practical, hands-on experience in the field and apply the skills you’ve learned in
        real-world settings.`,
    },
  ],
  RU: [
    {
      question: 'Что такое it-tutor.ai?',
      answer: `it-tutor.ai — это онлайн-платформа, предлагающая различные курсы по ИТ с интеграцией искусственного
        интеллекта (ИИ), чтобы улучшить процесс обучения. Независимо от того, новичок ли вы в технологиях или хотите
        повысить свои навыки, наши курсы адаптированы к вашему стилю и темпу обучения.`,
    },
    {
      question: 'Как ИИ улучшает мой учебный процесс?',
      answer: `Наша система на основе ИИ персонализирует ваше обучение, анализируя ваш прогресс, предоставляя обратную
        связь в реальном времени, предлагая дополнительные ресурсы и адаптируя сложность курсов в зависимости от ваших
        результатов. Это как иметь личного наставника, который ведет вас на каждом шагу.`,
    },
    {
      question: 'Какие курсы предлагает it-tutor.ai?',
      answer: `Мы предлагаем широкий спектр курсов, от начального до продвинутого уровня, по таким темам, как
        программирование (PHP, Vue.js и др.), машинное обучение, кибербезопасность, обеспечение качества и многим
        другим. Каждый курс создан для того, чтобы вы могли приобрести практические навыки в самых востребованных на
        сегодняшний день ИТ-направлениях.`,
    },
    {
      question: 'Могу ли я учиться в своём темпе?',
      answer: `Да! Наша платформа создана для гибкого обучения. Вы можете учиться в своём темпе, а ИИ будет направлять
        вас через весь материал. Вы можете возвращаться к темам, когда это необходимо, больше практиковаться и
        переходить к следующему разделу по мере освоения материала.`,
    },
    {
      question: 'Подходит ли it-tutor.ai для начинающих?',
      answer: `Безусловно! Мы предлагаем курсы, специально разработанные для начинающих, делая сложные темы доступными
        и простыми для понимания. ИИ помогает, предоставляя объяснения, упражнения и помощь в реальном времени, в
        зависимости от ваших потребностей.`,
    },
    {
      question: 'Нужны ли мне знания в ИТ перед началом?',
      answer: `Нет, для начала обучения на it-tutor.ai не требуется никаких предварительных знаний. Наши начальные
        курсы начинаются с основ и постепенно вводят более сложные концепции. Вы можете учиться в удобном для вас темпе
        с постоянной поддержкой.`,
    },
    {
      question: 'Сколько стоят курсы?',
      answer: `Наши курсы имеют конкурентоспособные цены. Доступны варианты единовременной оплаты или подписки. Мы также
        предлагаем бесплатные пробные уроки, чтобы вы могли ознакомиться с нашей платформой перед тем, как оплатить
        курс.`,
    },
    {
      question: 'Как начать обучение?',
      answer: `Начать обучение очень просто! Создайте аккаунт на нашей платформе, изучите каталог курсов и запишитесь
        на тот курс, который соответствует вашим целям. После записи наш ИИ адаптирует учебный процесс под ваши нужды,
        чтобы помочь вам добиться успеха.`,
    },
    {
      question: 'Есть ли поддержка, если я застрял на каком-то этапе?',
      answer: `Да! У нас есть несколько каналов поддержки, включая форумы сообщества, возможность отправки сообщений
        инструкторам и советы на основе ИИ. Если у вас возникнут трудности во время прохождения курса, наш ИИ предложит
        рекомендации и ресурсы.`,
    },
    {
      question: 'Получаю ли я сертификат по окончании курса?',
      answer: `Да, после завершения курса на it-tutor.ai вы получите сертификат об окончании. Это может помочь улучшить
        ваше резюме и продемонстрировать ваши навыки потенциальным работодателям.`,
    },
    {
      question: 'Предоставляете ли вы стажировки?',
      answer: `Да! Для наших лучших студентов мы предлагаем возможность участия в стажировках. Это позволяет получить
        практический опыт в реальных условиях и применить навыки, полученные на курсах.`,
    },
  ],
  UA: [
    {
      question: 'Що таке it-tutor.ai?',
      answer: `it-tutor.ai — це онлайн-платформа, яка пропонує різноманітні ІТ-курси з інтеграцією штучного інтелекту
        (ШІ) для покращення процесу навчання. Незалежно від того, чи ви новачок у сфері технологій, чи хочете підвищити
        свої навички, наші курси адаптовані до вашого стилю та темпу навчання.`,
    },
    {
      question: 'Як ШІ покращує мій навчальний процес?',
      answer: `Наша система на основі ШІ персоналізує ваше навчання, аналізуючи ваш прогрес, надаючи зворотний зв'язок
        у реальному часі, пропонуючи додаткові ресурси та регулюючи складність курсів відповідно до ваших результатів.
        Це як мати особистого наставника, який веде вас на кожному кроці.`,
    },
    {
      question: 'Які курси пропонує it-tutor.ai?',
      answer: `Ми пропонуємо широкий вибір курсів — від початкового до просунутого рівня — з таких тем, як
        програмування (PHP, Vue.js та ін.), машинне навчання, кібербезпека, забезпечення якості тощо. Кожен курс
        створений для того, щоб ви могли набути практичних навичок у найбільш затребуваних ІТ-сферах сьогодення.`,
    },
    {
      question: 'Чи можу я навчатися у своєму темпі?',
      answer: `Так! Наша платформа створена для гнучкого навчання. Ви можете навчатися у власному темпі, а ШІ
        направлятиме вас через увесь матеріал. Ви можете повернутися до тем, коли це потрібно, більше практикуватися та
        просуватися вперед, коли освоїте матеріал.`,
    },
    {
      question: 'Чи підходить it-tutor.ai для початківців?',
      answer: `Безумовно! Ми пропонуємо курси, спеціально розроблені для початківців, роблячи складні теми доступними
        та зрозумілими. ШІ допомагає, надаючи пояснення, вправи та допомогу в реальному часі, залежно від ваших
        потреб.`,
    },
    {
      question: 'Чи потрібні мені знання в ІТ перед початком?',
      answer: `Ні, для початку навчання на it-tutor.ai не потрібні попередні знання. Наші початкові курси починаються з
        основ і поступово вводять складніші концепції. Ви можете навчатися у зручному для вас темпі з постійною
        підтримкою.`,
    },
    {
      question: 'Скільки коштують курси?',
      answer: `Наші курси мають конкурентоспроможні ціни. Доступні варіанти одноразової оплати або підписки. Ми також
        пропонуємо безкоштовні пробні уроки, щоб ви могли ознайомитися з нашою платформою перед тим, як придбати курс.`,
    },
    {
      question: 'Як розпочати навчання?',
      answer: `Розпочати навчання дуже просто! Створіть обліковий запис на нашій платформі, перегляньте каталог курсів
        та запишіться на курс, який відповідає вашим цілям. Після запису наш ШІ адаптує навчальний процес під ваші
        потреби, щоб допомогти вам досягти успіху.`,
    },
    {
      question: 'Чи є підтримка, якщо я застряг на якомусь етапі?',
      answer: `Так! У нас є кілька каналів підтримки, включаючи форуми спільноти, можливість надсилання повідомлень
        інструкторам та поради на основі ШІ. Якщо у вас виникнуть труднощі під час проходження курсу, наш ШІ запропонує
        рекомендації та ресурси.`,
    },
    {
      question: 'Чи отримаю я сертифікат після завершення курсу?',
      answer: `Так, після завершення курсу на it-tutor.ai ви отримаєте сертифікат про закінчення. Це допоможе покращити
        ваше резюме та продемонструвати ваші навички потенційним роботодавцям.`,
    },
    {
      question: 'Чи пропонуєте ви стажування?',
      answer: `Так! Для наших найкращих студентів ми пропонуємо можливість проходження стажувань. Це дозволяє набути
        практичного досвіду в реальних умовах та застосувати навички, отримані під час навчання.`,
    },
  ],
  PL: [],
  ES: [],
}

const FaqSection = ({ language }: { language: Language }) => {
  const [selected, setSelected] = useState<number | null>(null)

  const toggle = (i: number) => {
    if (selected === i) {
      return setSelected(null)
    }

    setSelected(i)
  }
  const t = getLocale()
  return (
    <div className={s.faqSection}>
      <h1 className={s.faqTitle}>{t.faq}</h1>
      <p className={s.faqSubTitle}>{t.faq2}</p>

      <div className={s.accordion}>
        {data[language].map((item, index, arr) => (
          <div key={index}>
            <div className={s.accordionItem}>
              <div onClick={() => toggle(index)} className={s.accordionTitle}>
                <p>{item.question}</p>
                {selected === index ? (
                  <Image src={minusCircle} alt='minus' />
                ) : (
                  <Image src={plusCircle} alt='plus' />
                )}
              </div>

              <div className={`${s.accordionContent} ${selected === index ? s.show : ''}`}>
                {item.answer}
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
