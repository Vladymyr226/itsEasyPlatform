import s from './PopularArticles.module.css'

import popularArticleImage from '../../assets/popularArticle.png'
import Image from 'next/image'

const PopularArticles = () => {
  return (
    <div className={s.popularArticlesSection}>
      <h1 className={s.popularArticlesTitle}>
        Вас также могут <span className={s.accentuated}>заинтересовать</span>
      </h1>
      <ul className={s.popularArticlesList}>
        <li className={s.articleItem}>
          <div className={s.articleItemHeader}>
            <Image src={popularArticleImage} alt='programmer' />
          </div>
          <div className={s.aritcleItemFooter}>
            <p className={s.aritcleTitle}>
              Многие думают, что Lorem Ipsum - взятый с потолка набор слов
            </p>
            <p className={s.articleInfo}>
              Но это не совсем так. Его корни уходят в один фрагмент классической латыни 45 года
              н.э., то есть более двух тысячелетий назад.
            </p>
            <button className={s.articleButton}>Узнать больше</button>
          </div>
        </li>
        <li className={s.articleItem}>
          <div className={s.articleItemHeader}>
            <Image src={popularArticleImage} alt='programmer' />
          </div>
          <div className={s.aritcleItemFooter}>
            <p className={s.aritcleTitle}>
              Многие думают, что Lorem Ipsum - взятый с потолка набор слов
            </p>
            <p className={s.articleInfo}>
              Но это не совсем так. Его корни уходят в один фрагмент классической латыни 45 года
              н.э., то есть более двух тысячелетий назад.
            </p>
            <button className={s.articleButton}>Узнать больше</button>
          </div>
        </li>
        <li className={s.articleItem}>
          <div className={s.articleItemHeader}>
            <Image src={popularArticleImage} alt='programmer' />
          </div>
          <div className={s.aritcleItemFooter}>
            <p className={s.aritcleTitle}>
              Многие думают, что Lorem Ipsum - взятый с потолка набор слов
            </p>
            <p className={s.articleInfo}>
              Но это не совсем так. Его корни уходят в один фрагмент классической латыни 45 года
              н.э., то есть более двух тысячелетий назад.
            </p>
            <button className={s.articleButton}>Узнать больше</button>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default PopularArticles
