import { ReactNode } from 'react'
import s from './Container.module.css'

const Container = ({ children }: { children: ReactNode }) => {
  return <div className={s.container}>{children}</div>
}

export default Container
