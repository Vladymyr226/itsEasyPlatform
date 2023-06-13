import CourseDescription from '../CourseDescription/CourseDescription'
import CourseImage from '../CourseImage/CourseImage'

import s from './CourseCard.module.css'

const CourseCard = ({ toLeft = false }: { toLeft?: boolean }) => {
  const width = window.innerWidth

  return (
    <div className={`${s.courseCard} ${toLeft ? s.reverse : ''}`}>
      <CourseDescription />

      {width >= 1200 && <CourseImage />}
    </div>
  )
}

export default CourseCard
