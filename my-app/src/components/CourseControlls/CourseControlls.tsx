'use client'
import s from './CourseControlls.module.css'
import heart from '../../assets/heart.svg'
import emptyHeart from '../../assets/greyHeart.svg'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import axios from 'axios'

const urlUser = `${process.env.NEXT_BACK_HOST_API}/auth/user`


const CourseControlls = ({courseId, isFavoriteStart, userData}:{courseId:string,isFavoriteStart:boolean, userData:any}) => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
    }
  }, [])

  const [isFavorite, setIsFavorite] = useState(isFavoriteStart)
  const [isFavoriteHover, setIsFavoriteHover] = useState(false)


  const changeFavoriteState=async ()=>{
    setIsFavorite((prev) => !prev)
    if(userData && userData.id){
    const response = await axios.put(urlUser + '?id=' + userData.id, {
      purchasedCoursesId: [...userData.purchased_courses_id],
      favouriteCoursesId: userData.favourite_courses_id.indexOf(courseId) == -1 ? [
        ...userData.favourite_courses_id,
        courseId,
      ]:[
        userData.favourite_courses_id.filter((arrElem:string)=>arrElem!=courseId)
      ],
      comletedLessonsId: [...userData.comleted_lessons_id],
    })

    const resultResponse = response.data
  }
  }

  return (
    <div className={s.iconsWrapper}>
      <Image
        onMouseEnter={() => width >= 1200 && setIsFavoriteHover(true)}
        onMouseLeave={() => width >= 1200 && setIsFavoriteHover(false)}
        onClick={() => changeFavoriteState()}
        src={isFavorite || isFavoriteHover ? heart : emptyHeart}
        alt='heart'
      />
    </div>
  )
}

export default CourseControlls
