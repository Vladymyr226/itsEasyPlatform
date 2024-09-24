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
}
export interface CourseData {
  title: string
  language: string
  level: string
  date: string
  type: string
  description: any
  rating: number
  duration: number
  lector: string
  modules: any
  price: number
  mediaValue: mediaDataValue
  priceDiscount?: number
}
export interface mediaDataValue {
  type: string
  content: string
}
