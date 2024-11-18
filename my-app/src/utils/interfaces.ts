export type Language = 'EN' | 'RU' | 'UA' | 'PL' | 'ES'

export interface YouTubeProp {
  url: string
}

export interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

export interface Lesson {
  id?: string
  image?: string
  questionLimit?: number
  type: string
  title: string
  description: any
  link: string
  language: Language
  en_id: string
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
  lessons: Array<Lesson>
}

export interface Tag {
  icon_url: string
  name_of_tag: string
  id: string
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
