import Button from "../Button/Button";
import s from "./SkillsList.module.css";

const SkillsList = () => {
  return (
    <>
      <ul className={s.skillsList}>
        <li className={s.skillItem}>
          Lorem Ipsum не только успешно пережил без заметных изменений пять
          веков.
        </li>
        <li className={s.skillItem}>
          Lorem Ipsum не только успешно пережил без заметных изменений пять
          веков.
        </li>
        <li className={s.skillItem}>
          Lorem Ipsum не только успешно пережил без заметных изменений пять
          веков.
        </li>
        <li className={s.skillItem}>
          Lorem Ipsum не только успешно пережил без заметных изменений пять
          веков.
        </li>
        <li className={s.skillItem}>
          Lorem Ipsum не только успешно пережил без заметных изменений пять
          веков.
        </li>
        <li className={s.skillItem}>
          Lorem Ipsum не только успешно пережил без заметных изменений пять
          веков.
        </li>
      </ul>

      <div
        style={{
          marginTop: 35,
          textAlign: "center",
        }}
      >
        <Button text="Показать больше" />
      </div>
    </>
  );
};

export default SkillsList;
