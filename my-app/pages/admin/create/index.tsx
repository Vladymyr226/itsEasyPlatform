'use client'
import '../../../app/globals.css'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import axios from 'axios'
import Swal, { SweetAlertOptions } from 'sweetalert2'
import { isEqual } from 'lodash-es'
import { deleteCookie } from 'cookies-next'
import Logo from '@/components/Logo/Logo'

import {
  Box,
  Button,
  CircularProgress,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tabs,
  Tab,
} from '@mui/material'

import {
  Lesson,
  Module,
  Tag,
  Language,
  Course,
  Skill,
  LessonField,
  LessonType,
} from '@/utils/interfaces'

import {
  LessonCreateDefault,
  LessonCreateQuiz,
  LessonCreatePractice,
  initialLesson
} from '@/components/LessonCreate'

import {
  langNames,
  languages,
  translateJson,
  uploadFileToS3
} from '@/utils'

import {
  CourseCreate,
  CourseStructure,
  CustomTabPanel,
  initialRichText
} from '@/components/CourseCreate'

const url = `${process.env.NEXT_BACK_HOST_API}/cabinet/course`
const urlLesson = `${process.env.NEXT_BACK_HOST_API}/cabinet/lesson`
const urlTag = `${process.env.NEXT_BACK_HOST_API}/cabinet/tag`
const urlSkill = `${process.env.NEXT_BACK_HOST_API}/cabinet/skill`

const Create = () => {
  const router = useRouter()

  const [id, setId] = useState<string>()
  const [enId, setEnId] = useState<string>()
  const [language, setLanguage] = useState<Language>('EN')
  const [languageDisabled, setLanguageDisabled] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [level, setLevel] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [categorySelect, setCategorySelect] = useState<Tag[]>([])
  const [allCategorySelect, setAllCategorySelect] = useState<Tag[]>([])
  const [allSkillSelect, setAllSkillSelect] = useState<Skill[]>([])
  const [fetchedMediaData, setFetchedMediaData] = useState<any>()
  const [rating, setRating] = useState(0.0)
  const [editTrigger, setEditTrigger] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<any>()
  const [mediaValue, setMediaValue] = useState<{ type: string, content: File }>()
  const [richValue, setRichValue] = useState<any[]>(initialRichText)

  const [form, setForm] = useState<any>({
    title: '',
    questionLimit: null,
    date: new Date().toISOString().split('T')[0],
    duration: null,
    lector: '',
    price: null,
    priceDiscount: null,
  })

  const [moduleIndexCreate, setModuleIndexCreate] = useState(-1)
  const [modules, setModules] = useState<Module[]>([])
  const [allLessons, setAllLessons] = useState<Lesson[]>([])
  const [storedLessons, setStoredLessons] = useState<Lesson[]>([])
  const [lessonType, setLessonType] = useState<LessonType>('default')
  const [idLessonEdit, setIdLessonEdit] = useState<string | null>(null)
  const [lessonForm, setLessonForm] = useState<Lesson>(initialLesson)
  const [lessonFormCurrent, setLessonFormCurrent] = useState<Lesson>(initialLesson)
  const [lessonFields, setLessonFields] = useState<LessonField[]>([])

  const dragLesson = useRef<any>(0)
  const draggedOverLesson = useRef<any>(0)

  const swalOptions: SweetAlertOptions = {
    background: '#171622',
    color: '#ffec3e',
    confirmButtonColor: '#c58efe',
  }

  const getPageData = useCallback(async (lang?: Language, enIdParam?: string): Promise<string | undefined> => {
    if (typeof window === 'undefined') return

    const responseTag = await fetch(urlTag + 's', {
      headers: { 'Content-Type': 'application/json' },
    })
    const resultTag = await responseTag.json()
    setAllCategorySelect(
      resultTag.getTags.map((tag: any) => tag)
    )

    const responseSkill = await fetch(urlSkill + 's', {
      headers: { 'Content-Type': 'application/json' },
    })
    const resultSkill = await responseSkill.json()
    setAllSkillSelect(
      resultSkill.getSkills.map((skill: any) => skill)
    )

    const responseLesson = await fetch(urlLesson + 's', {
      headers: { 'Content-Type': 'application/json' },
    })
    const resultLesson = await responseLesson.json()
    let lessons: Lesson[] = resultLesson.getLessons.map((lesson: any) => {
      return {
        id: lesson.id,
        type: lesson.type,
        language: lesson.language,
        en_id: lesson.en_id,
        ...lesson.data,
      }
    })

    const response = await fetch(url + 's?id=0', {
      headers: { 'Content-Type': 'application/json' },
    })
    const result = await response.json()

    let resultData: Course[] = []
    let newIdParam

    if (lang && enIdParam) {
      resultData = result.getCourses.filter(
        (course: Course) => course.language === lang && course.en_id == enIdParam
      )

    } else {
      const idParam = window.location.href.split('_id=')[1]
      resultData = result.getCourses.filter(
        (course: Course) => course.id == idParam
      )

      if (!resultData.length) {
        setLanguageDisabled(true)
        setRichValue(initialRichText)  
      }
    }

    if (resultData.length) {
      newIdParam = resultData[0].id

      if (resultData[0].data.mediaValue) {
        setMediaValue({
          type: resultData[0].data.mediaValue.type,
          content: resultData[0].data.mediaValue.content,
        })
      }

      setFetchedMediaData(resultData[0].data.mediaValue)
      setStatus(resultData[0].data.status ? 'active' : 'draft')
      setId(newIdParam)
      setEnId(resultData[0].en_id)
      setLanguage(resultData[0].language)
      setLanguageDisabled(false)
      setLevel(resultData[0].data.level)
      setRichValue(resultData[0].data.description)
      setType(resultData[0].data.type)
      setRating(resultData[0].data.rating)

      setForm({
        questionLimit: resultData[0].data.questionLimit,
        title: resultData[0].data.title,
        description: resultData[0].data.description,
        richtext: resultData[0].data.richtext,
        date: resultData[0].data.date,
        duration: resultData[0].data.duration,
        lector: resultData[0].data.lector,
        price: resultData[0].data.price,
        priceDiscount: resultData[0].data?.priceDiscount,
      })

      setCategorySelect(
        resultTag.getTags.filter((tag: any) => {
          if (resultData[0].data.category.indexOf(tag.id) != -1) {
            return tag
          }
        }),
      )

      setModules(
        resultData[0].data.modules.map((module: any) => {
          return {
            title: module.title,
            lessons: module.lessons.map((lessonId: string) => {
              const found = lessons.filter(
                (moduleElemFilter: Lesson) => moduleElemFilter.id == lessonId,
              )
              return found[0]
            }),
          }
        }),
      )

      resultData[0].data.modules.forEach((module: any) => {
        module.lessons.forEach((lessonId: string) => {
          lessons = lessons.filter((l: Lesson) => l.id != lessonId)
        })
      })

      setTabValue(2)
      setTimeout(() => setTabValue(0), 1)

    } else {
      setId(undefined)
    }

    setStoredLessons(lessons)
    setIsLoaded(true)
    return newIdParam
  }, [])

  useEffect(() => {
    getPageData()
    function handleOnBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault()
      return (e.returnValue = '')
    }
    window.addEventListener('beforeunload', handleOnBeforeUnload, {
      capture: true,
    })
    return () => {
      window.removeEventListener('beforeunload', handleOnBeforeUnload, {
        capture: true,
      })
    }
  }, [getPageData])

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setIdLessonEdit(null)
    setLessonForm(initialLesson)
    setTabValue(newValue)
  }

  const handleChangeLanguage = async (event: SelectChangeEvent) => {
    const idParam = await getPageData(event.target.value as Language, enId)
    router.push('/admin/create/' + (idParam ? '?_id=' + idParam : ''), { shallow: true })
    setLanguage(event.target.value as Language)
    setEditTrigger(true)
    setError({})
  }

  const handleTranslate = async () => {
    const content = {
      title: form.title,
      richValue,
      modules: modules.map(m => m.title)
    }
    
    const result = await translateJson(content, language)

    if (result) {
      setForm({ ...form, title: result.title })
      setRichValue(result.richValue as any[])
      setModules(modules.map((m, i) => ({ ...m, title: (result.modules as any[])[i] })))

      Swal.fire({
        ...swalOptions,
        title: 'Course translated!',
        icon: 'success',
      })
      setEditTrigger(true)

      setTabValue(2)
      setTimeout(() => setTabValue(0), 1)  
    }
  }

  const handleTranslateLesson = async () => {
    let lesson: any = storedLessons.find((l: Lesson) =>
      l.en_id === lessonFormCurrent.en_id && l.language === language)
    
    if (lesson) {
      setIdLessonEdit(lesson.id)
    } else {
      setIdLessonEdit(null)
    
      const content = {
        title: lessonFormCurrent.title,
        fields: lessonFields.map((f: LessonField) => ({ value: f.type === 'slate' ? f.value : null }))
      }
      
      lesson = await translateJson(content, language)
    }

    if (lesson) {
      const fields = lessonFields
        .map((f: LessonField, i: number) => ({ ...f, value: (lesson.fields as any[])[i].value ?? f.value }))

      setLessonForm({ ...lessonForm, title: lesson.title as string, language, fields })
      setLessonFormCurrent({ ...lessonFormCurrent, title: lesson.title as string, language, fields })
      setLessonFields(fields)
      setTabValue(0)
      setTimeout(() => setTabValue(2), 1)
    }

    Swal.fire({
      ...swalOptions,
      title: 'Lesson translated!',
      icon: 'success',
    })
  }

  const handleSubmit = async (e: any) => {
    if (id && !editTrigger) {
      router.push('/admin')
      return
    }

    if (
      modules.filter((elem) => {
        if (modules.filter((m: Module) => m.title.trim() === elem.title.trim()).length > 1) {
          return 'Error'
        }
      }).length > 0
    ) {
      Swal.fire({
        ...swalOptions,
        title: 'Each module must have a unique name!',
        icon: 'error',
      })
      return
    }

    setError({
      title: form.title == '',
      duration: form.duration == null || form.duration == 0,
      lector: form.lector == '',
      price: form.price == null || form.price == 0 || form.price < 0,
      priceDiscount:
        form.priceDiscount == null ||
        form.priceDiscount == 0 ||
        form.priceDiscount < 0,
      language: language === undefined,
      level: level == '',
      type: type == '',
      status: status == '',
    })

    if (
      form.title == '' ||
      form.duration == null ||
      form.duration == 0 ||
      (type == '' && form.lector == '') ||
      form.price == null ||
      form.price == 0 ||
      form.price < 0 ||
      language == undefined ||
      level == '' ||
      type == '' ||
      status == '' ||
      form.questionLimit == null ||
      form.questionLimit < -1
    ) {
      Swal.fire({
        ...swalOptions,
        title: 'Validation failed!',
        icon: 'error',
      })
      return
    }

    if (modules.filter((module) => module.title.trim() == '').length > 0) {
      setTabValue(1)
      Swal.fire({
        ...swalOptions,
        title: 'Module title is empty!',
        icon: 'error',
      })
      return
    }

    const json = {
      ...form,
      mediaValue: {
        type: mediaValue?.type,
        content:
          typeof mediaValue?.content === 'string'
            ? mediaValue?.content
            : mediaValue?.content
              ? await uploadFileToS3(mediaValue.content)
              : null,
      },
      description: richValue,
      level: level,
      type: type,
      modules: modules.map((module) => {
        return {
          title: module.title,
          lessons: module.lessons.map((lesson) => {
            return lesson.id
          }),
        }
      }),
      status: status == 'active' ? true : false,
      rating: rating,
      category: categorySelect.map((tag) => {
        return tag.id
      }),
    }

    try {
      if (id) {
        const response = await axios.put(
          url +
            '?id=' +
            id +
            '&isActive=' +
            (status == 'active' ? true : false) +
            '&language=' + language +
            '&en_id=' + enId,
          json,
        )
        const resultResponse = response.data
        if (resultResponse) {
          setEditTrigger(false)
          Swal.fire({
            ...swalOptions,
            title: 'Changed!',
            icon: 'success',
          })
        }
      } else {
        const response = await axios.post(
          url +
            '?isActive=' + (status == 'active' ? true : false) +
            '&language=' + language +
            (enId ? '&en_id=' + enId : ''),
          json,
        )
        const resultResponse = response.data

        if (resultResponse) {
          Swal.fire({
            ...swalOptions,
            title: 'Created!',
            icon: 'success',
          })
          setEditTrigger(false)
          router.push('/admin/create/?_id=' + resultResponse.courseId)
          await getPageData()
        }
      }
    } catch (error) {
      Swal.fire({
        ...swalOptions,
        title: 'Something went wrong!',
        text: error + '',
        icon: 'error',
      })
      return
    }
  }

  const handleSubmitLessonDefault = async (e: any) => { 
    if (!lessonFormCurrent.title.trim()) {
      Swal.fire({
        ...swalOptions,
        title: 'Lesson title can not be empty!',
        icon: 'error',
      })
      return
    }

    try {
      setEditTrigger(true)
      setError({})

      if (idLessonEdit) {
        const found = storedLessons.some((l: Lesson) => l.title === lessonFormCurrent.title.trim()) ||
          modules.some((m: Module) =>
            m.lessons.some((l: Lesson) =>
              l.title.trim() === lessonFormCurrent.title.trim() && idLessonEdit !== l.id))

        if (!found || (lessonForm.title == lessonFormCurrent.title)) {
          const response = await axios.put(urlLesson + '?id=' + idLessonEdit, {
            title: lessonFormCurrent.title,
            image: lessonFormCurrent.image,
            hours: lessonFormCurrent.hours,
            minutes: lessonFormCurrent.minutes,
            fields: lessonFields,
          })
          const resultResponse = response.data
          if (resultResponse) {
            setModules(
              modules.map((m: Module, i: number) => {
                if (moduleIndexCreate === i) {
                  return {
                    title: m.title,
                    lessons: m.lessons.map((l: any) => {
                      if (l.en_id === lessonFormCurrent.en_id) return {
                        ...lessonFormCurrent,
                        id: idLessonEdit,
                        fields: lessonFields.map((f: LessonField) => {
                          return { type: f.type, value: f.value }
                        }),
                        type: 'default',
                      }
                      else return l
                    })
                  }
                }
                return m
              })
            )
            setLessonFormCurrent(initialLesson)
            setLessonForm(initialLesson)
            setLessonFields([])
            setIdLessonEdit(null)
            setTabValue(1)
          }

        } else {
          Swal.fire({
            ...swalOptions,
            title: 'Lesson name is already taken!',
            icon: 'error',
          })
        }

      } else {
        const found = storedLessons.some((l: Lesson) => l.title === lessonFormCurrent.title.trim()) ||
          modules.some((m: Module) =>
            m.lessons.some((l: Lesson) =>
              l.title.trim() === lessonFormCurrent.title.trim()))

        if (!found) {
          let urlLessonFull = `${urlLesson}?type=default&language=${lessonFormCurrent.language}`
          if (lessonFormCurrent.en_id) urlLessonFull += `&en_id=${lessonFormCurrent.en_id}`

          const response = await axios.post(urlLessonFull, {
            title: lessonFormCurrent.title,
            image: lessonFormCurrent.image,
            hours: lessonFormCurrent.hours,
            minutes: lessonFormCurrent.minutes,
            fields: lessonFields.map((f: LessonField) => ({ type: f.type, value: f.value })),
          })

          const resultResponse = response.data
          if (resultResponse) {
            setModules(
              modules.map((module: any, index: any) => {
                if (
                  index == moduleIndexCreate &&
                  module.lessons.filter(
                    (lesson: any) => lesson.id === resultResponse.lessonId
                  ).length === 0
                ) {
                  return {
                    title: module.title,
                    lessons: [
                      ...module.lessons.filter((lesson: any) => lesson.id !== lessonFormCurrent.en_id),
                      {
                        ...lessonFormCurrent,
                        id: resultResponse.lessonId,
                        fields: lessonFields.map((f: LessonField) => ({ type: f.type, value: f.value })),
                        type: 'default',
                        en_id: lessonFormCurrent.en_id || resultResponse.lessonId,
                      },
                    ],
                  }
                } else return module
              })
            )

            setLessonFormCurrent(initialLesson)
            setLessonForm(initialLesson)
            setLessonFields([])
            setModuleIndexCreate(-1)
            setTabValue(1)
          }

        } else {
          Swal.fire({
            ...swalOptions,
            title: 'Lesson name is already taken!',
            icon: 'error',
          })
        }
      }

    } catch (error) {
      Swal.fire({
        ...swalOptions,
        title: 'Something went wrong!',
        text: error + '',
        icon: 'error',
      })
      return
    }
  }

  const showPushAction = (url: string) => {
    if (id ? editTrigger : isEdited()) {
      Swal.fire({
        ...swalOptions,
        title: 'Do you want to save changes?',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: 'Save',
        denyButtonText: 'Leave and Discard Changes',
      }).then(async (result) => {
        if (result.isConfirmed) {
          handleSubmit('')
        }
        if (result.isDenied) {
          localStorage.removeItem('CourseCreateForm')
          router.push(url)
        }
      })
    } else {
      router.push(url)
    }
  }

  const showSwalTranslate = () => {
    if (tabValue === 2)
      if (lessonFormCurrent.language === language)
        Swal.fire({
          ...swalOptions,
          title: 'The course and lesson have the same language',
          icon: 'error',
        })
        
      else
        Swal.fire({
          ...swalOptions,
          title: `Do you want to translate lesson to ${langNames[language]}?`,
          showCancelButton: true,
          confirmButtonText: 'Translate',
        }).then(async result => result.isConfirmed && handleTranslateLesson())
  
    else if (tabValue === 1)    
      Swal.fire({
        ...swalOptions,
        title: 'All lessons translation does not work',
        icon: 'error',
      })
    
    else
      Swal.fire({
        ...swalOptions,
        title: `Do you want to translate course to ${langNames[language]}?`,
        showCancelButton: true,
        confirmButtonText: 'Translate',
      }).then(async result => result.isConfirmed && handleTranslate())
  }

  const compareRichTexts = (first: any[], second: any[]) => {
    let result = first.length == second.length
    if (result) {
      first.map((elem, i) => {
        if (!isEqual(elem, second[i])) {
          result = false
        }
      })
    }
    return result
  }

  const isEdited = () => {
    return (
      form.title != '' ||
      form.date != new Date().toISOString().split('T')[0] ||
      form.duration != undefined ||
      form.lector != '' ||
      form.price != undefined ||
      form.priceDiscount != undefined ||
      form.questionLimit != null ||
      modules.length != 0 ||
      language !== undefined ||
      level != '' ||
      type != '' ||
      status != '' ||
      rating != 0.0 ||
      !compareRichTexts(richValue, initialRichText) ||
      !isEqual(mediaValue, fetchedMediaData)
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#fff', paddingBottom: 8 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'between',
          padding: 4,
          background: '#000',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Logo />
        </Box>

        <Link href={'/admin/login'}>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              deleteCookie('jwt')
            }}
          >
            Logout
          </Button>
        </Link>
      </Box>
      <Box
        sx={{
          paddingLeft: '2rem',
          paddingRight: '2rem',
          marginTop: '2rem',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box
          sx={{
            marginRight: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box
            sx={{
              fontWeight: 'bold',
              paddingLeft: 2,
              paddingRight: 2,
              color: '#000',
              borderLeft: '2px solid #000',
              fontSize: 20,
              cursor: 'pointer',
            }}
            onClick={(e) => {
              showPushAction('/admin')
            }}
          >
            Courses
          </Box>

          <Box
            sx={{
              fontWeight: 'bold',
              paddingLeft: 2,
              paddingRight: 2,
              color: '#000',
              fontSize: 20,
              cursor: 'pointer',
            }}
            onClick={(e) => {
              showPushAction('/admin/users')
            }}
          >
            Users
          </Box>
          <Box
            sx={{
              fontWeight: 'bold',
              paddingLeft: 2,
              paddingRight: 2,
              color: '#000',
              fontSize: 20,
              cursor: 'pointer',
            }}
            onClick={(e) => {
              showPushAction('/admin/feedback')
            }}
          >
            Feedback
          </Box>
          <Box
            sx={{
              fontWeight: 'bold',
              paddingLeft: 2,
              paddingRight: 2,
              color: '#000',
              fontSize: 20,
              cursor: 'pointer',
            }}
            onClick={(e) => {
              showPushAction('/admin/payments')
            }}
          >
            Payments
          </Box>
        </Box>

        <Box sx={{ width: '100%', marginTop: 4 }}>
          {isLoaded ? (
            <>
              <Box
                sx={{
                  width: '100%',
                  boxShadow: 2,
                  borderRadius: '10px',

                  border: '1px solid #000',
                  borderTop: '4px solid #000',
                }}
              >
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    width: '100%',
                  }}
                >
                  <Box sx={{ margin: 2 }}>
                    <InputLabel>Language</InputLabel>
                    <Select
                      inputProps={{ disabled: languageDisabled }}
                      error={(error && error.language) ?? false}
                      fullWidth
                      id="languageSelect"
                      value={language}
                      onChange={handleChangeLanguage}
                    >
                      {languages.map((l: Language) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                    </Select>
                    <Button onClick={e => showSwalTranslate()}>Translate</Button>
                  </Box>
                  <Tabs
                    value={tabValue}
                    onChange={handleChangeTab}
                    aria-label="basic tabs example"
                    variant="fullWidth"
                    TabIndicatorProps={{
                      style: {
                        backgroundColor: '#000',
                      },
                    }}
                  >
                    <Tab
                      value={0}
                      label="General"
                      sx={{
                        color: '#000',
                        '&.Mui-selected': {
                          color: '#000',
                          fontWeight: 'bold',
                        },
                      }}
                    />
                    <Tab
                      value={1}
                      label="Structure"
                      sx={{
                        color: '#000',
                        '&.Mui-selected': {
                          color: '#000',
                          fontWeight: 'bold',
                        },
                      }}
                    />
                    <Tab
                      value={2}
                      sx={{
                        display: 'none',
                      }}
                    />
                  </Tabs>
                  <CustomTabPanel value={tabValue} index={0}>
                    <CourseCreate
                      error={error}
                      setError={setError}
                      id={id}
                      form={form}
                      setForm={setForm}
                      editTrigger={editTrigger}
                      setEditTrigger={setEditTrigger}
                      richValue={richValue}
                      setRichValue={setRichValue}
                      level={level}
                      setLevel={setLevel}
                      type={type}
                      setType={setType}
                      status={status}
                      setStatus={setStatus}
                      rating={rating}
                      setRating={setRating}
                      mediaValue={mediaValue}
                      setMediaValue={setMediaValue}
                      categorySelect={categorySelect}
                      setCategorySelect={setCategorySelect}
                      allCategorySelect={allCategorySelect}
                      setAllCategorySelect={setAllCategorySelect}
                      allSkillSelect={allSkillSelect}
                      setAllSkillSelect={setAllSkillSelect}
                      modules={modules}
                      setModules={setModules}
                      allLessons={allLessons}
                      setAllLessons={setAllLessons}
                      setLanguage={setLanguage}
                      setTabValue={setTabValue}
                      setLessonForm={setLessonForm}
                      isEdited={isEdited}
                      handleSubmit={handleSubmit}
                    />
                  </CustomTabPanel>
                  <CustomTabPanel value={tabValue} index={1}>
                    <CourseStructure
                      dragLesson={dragLesson}
                      draggedOverLesson={draggedOverLesson}
                      modules={modules}
                      setModules={setModules}
                      allLessons={allLessons}
                      setAllLessons={setAllLessons}
                      idLessonEdit={idLessonEdit}
                      setIdLessonEdit={setIdLessonEdit}
                      moduleIndexCreate={moduleIndexCreate}
                      setModuleIndexCreate={setModuleIndexCreate}
                      storedLessons={storedLessons}
                      setStoredLessons={setStoredLessons}
                      setEditTrigger={setEditTrigger}
                      setError={setError}
                      setLessonForm={setLessonForm}
                      setLessonType={setLessonType}
                      setTabValue={setTabValue}
                    />
                  </CustomTabPanel>
                  <CustomTabPanel value={tabValue} index={2}>
                    <Box
                      sx={{
                        color: '#fff',
                      }}
                    >
                      {!idLessonEdit && (
                        <Box sx={{ marginTop: 2 }}>
                          <InputLabel>Lesson type</InputLabel>
                          <Select
                            fullWidth
                            id="lessonTypeSelect"
                            value={lessonType}
                            onChange={(event: SelectChangeEvent) => setLessonType(event.target.value as LessonType)}
                          >
                            <MenuItem value={'default'}>Default</MenuItem>
                            <MenuItem value={'quiz'}>Quiz</MenuItem>
                            <MenuItem value={'practice'}>Practice</MenuItem>
                          </Select>
                        </Box>
                      )}
                      {lessonType === 'default' && (
                        <LessonCreateDefault
                          lessonForm={lessonForm}
                          setLessonForm={setLessonForm}
                          idLessonEdit={idLessonEdit}
                          setIdLessonEdit={setIdLessonEdit}
                          lessonFormCurrent={lessonFormCurrent}
                          setLessonFormCurrent={setLessonFormCurrent}
                          lessonFields={lessonFields}
                          setLessonFields={setLessonFields}
                          setTabValue={setTabValue}
                          setEditTrigger={setEditTrigger}
                          setError={setError}
                          handleSubmitLessonDefault={handleSubmitLessonDefault}
                        />
                      )}
                      {lessonType === 'quiz' && (
                        <LessonCreateQuiz
                          lessonForm={lessonForm}
                          setValue={setTabValue}
                          idLessonEdit={idLessonEdit}
                          setIdLessonEdit={setIdLessonEdit}
                          moduleIndexCreate={moduleIndexCreate}
                          setModuleIndexCreate={setModuleIndexCreate}
                          modules={modules}
                          setModules={setModules}
                          setEditTrigger={setEditTrigger}
                          setError={setError}
                          storedLessons={storedLessons}
                        />
                      )}
                      {lessonType === 'practice' && (
                        <LessonCreatePractice
                          lessonForm={lessonForm}
                          setValue={setTabValue}
                          idLessonEdit={idLessonEdit}
                          setIdLessonEdit={setIdLessonEdit}
                          moduleIndexCreate={moduleIndexCreate}
                          setModuleIndexCreate={setModuleIndexCreate}
                          modules={modules}
                          setModules={setModules}
                          setEditTrigger={setEditTrigger}
                          setError={setError}
                          storedLessons={storedLessons}
                        />
                      )}
                    </Box>
                  </CustomTabPanel>
                </Box>
              </Box>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  marginTop: 2,
                  fontWeight: 'bold',
                }}
                onClick={handleSubmit}
              >
                {id ? (editTrigger ? 'Save' : 'Cancel') : 'Add Course'}
              </Button>
            </>
          ) : (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: 20,
                  marginBottom: 70,
                }}
              >
                <CircularProgress sx={{ color: '#000' }} />
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default Create
