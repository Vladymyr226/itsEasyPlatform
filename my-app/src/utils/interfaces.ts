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
  title: string
  description: any
  link: string
}
export interface Module {
  title: string
  lessons: Array<Lesson>
}
export interface Tag {
  name_of_tag: string
  id: string
}
