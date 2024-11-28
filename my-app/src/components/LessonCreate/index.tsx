import { Lesson } from '@/utils/interfaces'

export {default as LessonCreateDefault} from './LessonCreateDefault'
export {default as LessonCreatePractice} from './LessonCreatePractice'
export {default as LessonCreateQuiz} from './LessonCreateQuiz'

export const initialLesson: Lesson = {
  title: '',
  hours: 0,
  minutes: 0,
  language: 'EN',
}
