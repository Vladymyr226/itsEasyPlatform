'use client'
import '../../../app/globals.css'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import axios, { AxiosResponse } from 'axios'
import Swal from 'sweetalert2'

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
  YouTubeProp,
  TabPanelProps,
  Lesson,
  Module,
  Tag,
  Language,
  Course,
  Skill,
} from '@/utils/interfaces'

import { isEqual } from 'lodash-es'
import { deleteCookie } from 'cookies-next'
import Logo from '@/components/Logo/Logo'
import { LessonCreateDefault, LessonCreateQuiz, LessonCreatePractice } from '@/components/LessonCreate'
import { langNames, languages, uploadFileToS3 } from '@/utils'
import { CourseCreate, CourseStructure } from '@/components/CourseCreate'

const url = `${process.env.NEXT_BACK_HOST_API}/cabinet/course`
const urlLesson = `${process.env.NEXT_BACK_HOST_API}/cabinet/lesson`
const urlTag = `${process.env.NEXT_BACK_HOST_API}/cabinet/tag`
const urlSkill = `${process.env.NEXT_BACK_HOST_API}/cabinet/skill`

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const Create = () => {
  const router = useRouter()

  const [createLessonIndx, setCreateLessonIndx] = useState(-1)
  const [id, setId] = useState<string>()
  const [enId, setEnId] = useState<string>()
  const [idLessonEdit, setIdLessonEdit] = useState<string | null>(null)
  const [tabValue, setTabValue] = useState(0)
  const [language, setLanguage] = useState<Language>('EN')
  const [languageDisabled, setLanguageDisabled] = useState(false)
  const [level, setLevel] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [modules, setModules] = useState<Array<Module>>([])
  const [allModules, setAllModules] = useState<Array<Lesson>>([])
  const [storedModules, setStoredModules] = useState<Array<Lesson>>([])
  const [categorySelect, setCategorySelect] = useState<Array<Tag>>([])
  const [allCategorySelect, setAllCategorySelect] = useState<Array<Tag>>([])
  const [allSkillSelect, setAllSkillSelect] = useState<Array<Skill>>([])
  const [form, setForm] = useState<any>({
    title: '',
    questionLimit: null,
    date: new Date().toISOString().split('T')[0],
    duration: null,
    lector: '',
    price: null,
    priceDiscount: null,
  })
  const [lessonType, setLessonType] = useState('')
  const [fetchedMediaData, setFetchedMediaData] = useState<any>()
  const [rating, setRating] = useState(0.0)
  const [richValue, setRichValue] = useState<Array<any>>([
    {
      type: 'paragaph',
      children: [{ text: '' }],
    },
  ])
  const [lessonForm, setLessonForm] = useState<any>({
    title: '',
    link: '',
    image: '',
    hours: 0,
    minutes: 0,
  })
  const [editTrigger, setEditTrigger] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mediaValue, setMediaValue] = useState<{
    type: string
    content: File
  }>()
  const [error, setError] = useState<any>()

  const dragLesson = useRef<any>(0)
  const draggedOverLesson = useRef<any>(0)

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
    let allLessons = resultLesson.getLessons.map((lesson: any) => {
      return {
        id: lesson.id,
        type: lesson.type,
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
        setRichValue([
          {
            type: 'paragaph',
            children: [{ text: '' }],
          },
        ])  
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
              const found = allLessons.filter(
                (moduleElemFilter: Lesson) => moduleElemFilter.id == lessonId,
              )
              return found[0]
            }),
          }
        }),
      )

      resultData[0].data.modules.forEach((module: any) => {
        module.lessons.forEach((lessonId: string) => {
          allLessons = allLessons.filter((l: Lesson) => l.id != lessonId)
        })
      })

      setTabValue(2)
      setTimeout(() => {
        setTabValue(0)
      }, 1)

    } else {
      setId(undefined)
    }

    setStoredModules(allLessons)
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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setIdLessonEdit(null)
    setLessonForm({
      title: '',
      link: '',
      image: '',
      hours: 0,
      minutes: 0,
    })
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
    const url = 'https://api.openai.com/v1/chat/completions'
    const apiKey =
      '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'

    const content = {
      title: form.title,
      richValue,
      modules: modules.map(m => m.title)
    }
    
    try {
      const response: AxiosResponse<any, any> = await axios.post(
        url,
        {
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that translates text in JSON structures.'},
            { role: 'user', content: `
                Translate the text content in the following JSON structure to ${langNames[language]}
                without changing the JSON structure:   
                ${JSON.stringify(content)}`
            }
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.status === 200) {
        const result = JSON.parse(
          response.data.choices[0].message.content
            .replace('```json', '')
            .replace('```', '')
        )

        setForm({ ...form, title: result.title })
        setRichValue(result.richValue)
        setModules(modules.map((m, i) => ({ ...m, title: result.modules[i] })))

        Swal.fire({
          title: 'Course translated!',
          background: '#171622',
          color: '#ffec3e',
          confirmButtonColor: '#c58efe',
          icon: 'success',
        })
        setEditTrigger(true)

        setTabValue(2)
        setTimeout(() => {
          setTabValue(0)
        }, 1)  
      }

    } catch (error) {
      console.error('Ошибка при отправке запроса:', error)
    }
  }

  const handleTranslateLesson = async () => {
    Swal.fire({
      title: 'Lesson translated!',
      background: '#171622',
      color: '#ffec3e',
      confirmButtonColor: '#c58efe',
      icon: 'success',
    })
}

  const handleChangeLessonType = (event: SelectChangeEvent) => {
    setLessonType(event.target.value as string)
  }

  const handleSubmit = async (e: any) => {
    if (id && !editTrigger) {
      router.push('/admin')
      return
    }

    if (
      modules.filter((elem) => {
        if (countModuleNameMeet(elem.title) > 1) {
          return 'Error'
        }
      }).length > 0
    ) {
      Swal.fire({
        title: 'Each module must have a unique name!',
        background: '#171622',
        color: '#ffec3e',
        confirmButtonColor: '#c58efe',
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
        title: 'Validation failed!',
        background: '#171622',
        color: '#ffec3e',
        confirmButtonColor: '#c58efe',
        icon: 'error',
      })
      return
    }

    if (modules.filter((module) => module.title.trim() == '').length > 0) {
      setTabValue(1)
      Swal.fire({
        title: 'Module title is empty!',
        background: '#171622',
        color: '#ffec3e',
        confirmButtonColor: '#c58efe',
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
            title: 'Changed!',
            background: '#171622',
            color: '#ffec3e',
            confirmButtonColor: '#c58efe',
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
            title: 'Created!',
            background: '#171622',
            color: '#ffec3e',
            confirmButtonColor: '#c58efe',
            icon: 'success',
          })
          setEditTrigger(false)
          router.push('/admin/create/?_id=' + resultResponse.courseId)
          await getPageData()
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Something went wrong!',
        text: error + '',
        background: '#171622',
        color: '#ffec3e',
        confirmButtonColor: '#c58efe',
        icon: 'error',
      })
      return
    }
  }

  const showPushAction = (url: string) => {
    if (id ? editTrigger : isEdited()) {
      Swal.fire({
        title: 'Do you want to save changes?',
        background: '#171622',
        color: '#ffec3e',
        confirmButtonColor: '#c58efe',
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
      Swal.fire({
        title: `Do you want to translate lesson to ${langNames[language]}?`,
        background: '#171622',
        color: '#ffec3e',
        confirmButtonColor: '#c58efe',
        showCancelButton: true,
        confirmButtonText: 'Translate',
      }).then(async (result) => {
        if (result.isConfirmed) handleTranslateLesson()
      })
    else if (window.location.href.includes('_id='))    
      Swal.fire({
        title: `Do you want to translate course to ${langNames[language]}?`,
        background: '#171622',
        color: '#ffec3e',
        confirmButtonColor: '#c58efe',
        showCancelButton: true,
        confirmButtonText: 'Translate',
      }).then(async (result) => {
        if (result.isConfirmed) handleTranslate()
      })
    else
      Swal.fire({
        title: 'First you need to save the course',
        background: '#171622',
        color: '#ffec3e',
        confirmButtonColor: '#c58efe',
        icon: 'error',
      })
  }

  const compareRichTexts = (first: Array<any>, second: Array<any>) => {
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

  const countModuleNameMeet = (str: string) => {
    const result = modules.filter((module) => module.title.trim() == str.trim())

    return result.length
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
      !compareRichTexts(richValue, [
        {
          type: 'paragaph',
          children: [{ text: '' }],
        },
      ]) ||
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
                    onChange={handleChange}
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
                      allModules={allModules}
                      setAllModules={setAllModules}
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
                      allModules={allModules}
                      setAllModules={setAllModules}
                      idLessonEdit={idLessonEdit}
                      setIdLessonEdit={setIdLessonEdit}
                      createLessonIndx={createLessonIndx}
                      setCreateLessonIndx={setCreateLessonIndx}
                      storedModules={storedModules}
                      setStoredModules={setStoredModules}
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
                            onChange={handleChangeLessonType}
                          >
                            <MenuItem value={'default'}>Default</MenuItem>
                            <MenuItem value={'quiz'}>Quiz</MenuItem>
                            <MenuItem value={'practice'}>Practice</MenuItem>
                          </Select>
                        </Box>
                      )}
                      {lessonType == 'quiz' && (
                        <LessonCreateQuiz
                          startData={lessonForm}
                          setValue={setTabValue}
                          idLessonEdit={idLessonEdit}
                          setIdLessonEdit={setIdLessonEdit}
                          createLessonIndx={createLessonIndx}
                          setCreateLessonIndx={setCreateLessonIndx}
                          modules={modules}
                          setModules={setModules}
                          setEditTrigger={setEditTrigger}
                          setError={setError}
                          storedModules={storedModules}
                        />
                      )}
                      {lessonType == 'practice' && (
                        <LessonCreatePractice
                          startData={lessonForm}
                          setValue={setTabValue}
                          idLessonEdit={idLessonEdit}
                          setIdLessonEdit={setIdLessonEdit}
                          createLessonIndx={createLessonIndx}
                          setCreateLessonIndx={setCreateLessonIndx}
                          modules={modules}
                          setModules={setModules}
                          setEditTrigger={setEditTrigger}
                          setError={setError}
                          storedModules={storedModules}
                        />
                      )}
                      {lessonType == 'default' && (
                        <LessonCreateDefault
                          startData={lessonForm}
                          setTabValue={setTabValue}
                          idLessonEdit={idLessonEdit}
                          setIdLessonEdit={setIdLessonEdit}
                          createLessonIndx={createLessonIndx}
                          setCreateLessonIndx={setCreateLessonIndx}
                          modules={modules}
                          setModules={setModules}
                          setEditTrigger={setEditTrigger}
                          setError={setError}
                          storedModules={storedModules}
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
