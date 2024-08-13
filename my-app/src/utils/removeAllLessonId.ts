import axios from 'axios'

const url = `${process.env.NEXT_BACK_HOST_API}/cabinet/course`
export async function removeLessonIds(lessonId: number) {
  if (typeof window !== 'undefined') {
    const response = await fetch(url + 's', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const result = await response.json()
    const courses = result.getCourses

    const coursesFound = courses.filter((course: any) =>
      course.data.modules.some((module: any) => module.lessons.includes(lessonId))
    )
    const editedCourses = coursesFound.map((course: any) => {
      const updatedModules = course.data.modules.map((module: any) => {
        const updatedLessons = module.lessons.filter((id: any) => id !== lessonId)
        return { ...module, lessons: updatedLessons }
      })

      return {
        ...course,
        data: {
          ...course.data,
          modules: updatedModules,
        },
      }
    })
    editedCourses.map(async (course: any) => {
      const response = await axios.put(
        url + '?id=' + course.id + '&isActive=' + course.is_active,
        course.data
      )
      const resultResponse = response.data
    })
  }
}
