export type Language = 'EN' | 'RU' | 'UA' | 'PL' | 'ES'
export type LessonType = 'default' | 'quiz' | 'practice' | 'defaultOld'

export interface YouTubeProp {
  url: string
}

export interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

export interface LessonField {
  tmpId: number
  type: string
  value: any
}

export interface LessonQuestionOption {
  title: string
  correct: boolean
}

export interface LessonQuestion {
  title: string
  options: LessonQuestionOption[]
}

export interface Lesson {
  id?: string
  type?: LessonType
  title: string
  hours: number
  minutes: number
  language: Language
  link?: string
  image?: string
  questionLimit?: number
  description?: any
  en_id?: string
  fields?: LessonField[]
  questions?: LessonQuestion[]
}

export interface LessonData {
  title: string
  link?: string
  description?: any
  image?: any
  questions?: any
  fields?: any
}

export interface Module {
  title: string
  lessons: Lesson[]
}

export interface Tag {
  id: string
  icon_url: string
  name_of_tag?: string
  name_skill?: string
}

export interface Skill {
  icon_url: string
  name_skill: string
  id: string
}

export interface Course {
  id: string
  data: CourseData
  is_active: boolean
  created_at: string
  views: number
  language: Language
  en_id: string
}

export interface CourseData {
  title: string
  level: string
  date: string
  type: string
  description: any
  rating: number
  duration: number
  lector: string
  modules: Module[]
  price: number
  mediaValue: mediaDataValue
  priceDiscount?: number
  category: Tag[]
  status: boolean
  questionLimit: number
  richtext: any
}

export interface mediaDataValue {
  type: string
  content: File
}
