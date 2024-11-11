'use client'
import Layout from '@/components/Layout/Layout'
import '../app/globals.css'
import s from './TermsAndConditions.module.css'
import JoinUs from '@/components/JoinUs'
import { getLocale } from '@/utils/getLocale'

const TermsAndConditions = () => {
  const t = getLocale()
  
  return (
    <Layout>
      <div className={s.wrapper}>
        <h1>{t.termsAndConditions}</h1>
        <section>
          <p>{t.tac_00}</p>
          <h2>{t.tac_01}</h2>
          <p>{t.tac_01_1}</p>
          <h2>{t.tac_02}</h2>
          <p>{t.tac_02_1}</p>

          <h2>{t.tac_03}</h2>
          <ul>
            <li><b>{t.tac_03_1}</b> {t.tac_03_2}</li>
            <li><b>{t.tac_03_3}</b> {t.tac_03_4}</li>
            <li><b>{t.tac_03_5}</b> {t.tac_03_6}</li>
          </ul>

          <h2>{t.tac_04}</h2>
          <ul>
            <li><b>{t.tac_04_1}</b> {t.tac_04_2}</li>
            <li><b>{t.tac_04_3}</b> {t.tac_04_4}</li>
          </ul>

          <h2>{t.tac_05}</h2>
          <ul>
            <li>{t.tac_05_1}</li>
            <li>{t.tac_05_2}</li>
            <li>{t.tac_05_3}</li>
          </ul>

          <h2>{t.tac_06}</h2>
          <p>{t.tac_06_1}</p>

          <h2>{t.tac_07}</h2>
          <ul>
            <li><b>{t.tac_07_1}</b> {t.tac_07_2}</li>
            <li><b>{t.tac_07_3}</b> {t.tac_07_4}</li>
          </ul>

          <h2>{t.tac_08}</h2>
          <p>{t.tac_08_1}</p>
          <h2>{t.tac_09}</h2>
          <p>{t.tac_09_1}</p>
          <h2>{t.tac_10}</h2>
          <p>{t.tac_10_1}</p>
          <h2>{t.tac_11}</h2>
          <p>{t.tac_11_1}</p>

          <hr></hr>
          <p><b>{t.tac_12}</b></p>
          <hr></hr>

        </section>

        <JoinUs></JoinUs>
      </div>
    </Layout>
  )
}

export default TermsAndConditions
