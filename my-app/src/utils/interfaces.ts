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
