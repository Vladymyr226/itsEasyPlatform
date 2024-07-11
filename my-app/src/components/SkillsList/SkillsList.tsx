import { getLocale } from '@/utils/getLocale'
import Button from '../Button/Button'
import s from './SkillsList.module.css'

const SkillsList = () => {
  const t = getLocale()
  return (
    <>
      <ul className={s.skillsList}>
        <li className={s.skillItem}>
          Lorem Ipsum не только успешно пережил без заметных изменений пять веков.
        </li>
        <li className={s.skillItem}>
          Lorem Ipsum не только успешно пережил без заметных изменений пять веков.
        </li>
        <li className={s.skillItem}>
          Lorem Ipsum не только успешно пережил без заметных изменений пять веков.
        </li>
        <li className={s.skillItem}>
          Lorem Ipsum не только успешно пережил без заметных изменений пять веков.
        </li>
        <li className={s.skillItem}>
          Lorem Ipsum не только успешно пережил без заметных изменений пять веков.
        </li>
        <li className={s.skillItem}>
          Lorem Ipsum не только успешно пережил без заметных изменений пять веков.
        </li>
      </ul>

      <div
        style={{
          marginTop: 35,
          textAlign: 'center',
        }}
      >
        <Button text={t.show_more} />
      </div>
    </>
  )
}

export default SkillsList
