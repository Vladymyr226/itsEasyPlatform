'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import '../../../app/globals.css'
import { Box, Button, CircularProgress } from '@mui/material'

import IconButton from '@mui/material/IconButton'
import PreviewIcon from '@mui/icons-material/Preview'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Link from 'next/link'
import Image from 'next/image'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TextField from '@mui/material/TextField'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import { InputLabel } from '@mui/material'

import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import axios, { AxiosResponse } from 'axios'
import Rating from '@mui/material/Rating'
import { useRouter } from 'next/navigation'
import MyEditor from '@/components/SlateEditor/Editor'
import SlateView from '@/components/SlateEditor/View'

import Swal from 'sweetalert2'
import React from 'react'
import YouTube, { YouTubeProps } from 'react-youtube'
import Autocomplete from '@mui/material/Autocomplete'
import {
  YouTubeProp,
  TabPanelProps,
  Lesson,
  Module,
  Tag,
  Skill,
  Language,
  Course,
} from '@/utils/interfaces'
import * as AWS from 'aws-sdk'
import { isEqual } from 'lodash-es'
import { deleteCookie } from 'cookies-next'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import Logo from '@/components/Logo/Logo'
import { removeLessonIds } from '@/utils/removeAllLessonId'
import LessonCreateQuiz from '@/components/LessonCreate/LessonCreateQuiz'
import LessonCreatePractice from '@/components/LessonCreate/LessonCreatePractice'
import LessonCreateDefault from '@/components/LessonCreate/LessonCreateDefault'
import { langNames, languages } from '@/utils'

const url = `${process.env.NEXT_BACK_HOST_API}/cabinet/course`
const urlLesson = `${process.env.NEXT_BACK_HOST_API}/cabinet/lesson`
const urlTag = `${process.env.NEXT_BACK_HOST_API}/cabinet/tag`
const urlSkill = `${process.env.NEXT_BACK_HOST_API}/cabinet/skill`

const ExampleYouTube = (props: YouTubeProp) => {
  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    event.target.pauseVideo()
  }

  const opts: YouTubeProps['opts'] = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  }

  return <YouTube videoId={props.url} opts={opts} onReady={onPlayerReady} />
}

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

const CourseCreate = () => {
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
  const [skillsSelect, setSkillsSelect] = useState<Array<Skill>>([])
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
  const [preview, setPreview] = useState('-1')
  const [editTrigger, setEditTrigger] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mediaValue, setMediaValue] = useState<{
    type: string
    content: File
  }>()
  const [error, setError] = useState<any>()

  const dragLesson = useRef<any>(0)
  const draggedOverLesson = useRef<any>(0)

  if (
    !process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ||
    !process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ||
    !process.env.NEXT_PUBLIC_AWS_BUCKET_NAME
  ) {
    throw new Error('Отсутствуют переменные окружения NEXT_PUBLIC_AWS_ACCESS_KEY_ID или NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY'
      + ' или NEXT_PUBLIC_AWS_BUCKET_NAME')
  }

  AWS.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    region: 'eu-west-3',
  })
  const s3 = new AWS.S3()

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
          title: 'Translated!',
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

  const handleChangeLevel = (event: SelectChangeEvent) => {
    setEditTrigger(true)
    setError({})
    setLevel(event.target.value as string)
  }

  const handleChangeType = (event: SelectChangeEvent) => {
    setEditTrigger(true)
    setError({})
    setType(event.target.value as string)
  }

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setEditTrigger(true)
    setError({})
    setStatus(event.target.value as string)
  }

  const handleChangeLessonType = (event: SelectChangeEvent) => {
    setLessonType(event.target.value as string)
  }

  const handlePreviewMediaChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setEditTrigger(true)
      setError({})
      setMediaValue({
        type: event.target.files[0].type.split('/')[0],
        content: event.target.files[0],
      })
    }
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
    Swal.fire({
      title: `Do you want to translate course to ${langNames[language]}?`,
      background: '#171622',
      color: '#ffec3e',
      confirmButtonColor: '#c58efe',
      showCancelButton: true,
      confirmButtonText: 'Translate',
      denyButtonText: 'Leave and Discard Changes',
    }).then(async (result) => {
      if (result.isConfirmed) handleTranslate()
    })
  }

  const showSwalSkill = () => {
    Swal.fire({
      title: 'Create Skill',
      html: `
          <input type="text" id="textInput" class="swal2-input" placeholder="Enter title">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const textInput = (
          Swal.getPopup()?.querySelector('#textInput') as HTMLInputElement
        ).value

        if (!textInput || textInput.trim() == '') {
          Swal.showValidationMessage(`Please enter text`)
        }

        return { textInput: textInput }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.post(
          urlSkill + '?title=' + result.value.textInput + '&iconUrl=' + '',
        )
        const resultResponse = response.data
        if (resultResponse) {
          Swal.fire('Created!', '', 'success')
          setEditTrigger(true)
          setError({})
          setAllSkillSelect([
            ...allSkillSelect,
            {
              name_skill: result.value.textInput,
              id: resultResponse.skillId,
              icon_url: '',
            },
          ])
        }
      }
    })
  }

  const showSwalTag = () => {
    Swal.fire({
      title: 'Create tag',
      html: `
          <input type="text" id="textInput" class="swal2-input" placeholder="Enter title">
          <input type="file" id="fileInput" class="swal2-file">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const textInput = (
          Swal.getPopup()?.querySelector('#textInput') as HTMLInputElement
        ).value
        const fileInput = (
          Swal.getPopup()?.querySelector('#fileInput') as HTMLInputElement
        ).files

        if (!textInput || textInput.trim() == '') {
          Swal.showValidationMessage(`Please enter text`)
        }

        return { textInput: textInput, fileInput: fileInput }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const selectedFileURL =
          result.value.fileInput.length > 0
            ? await uploadFileToS3(result.value.fileInput[0])
            : ''

        const response = await axios.post(
          urlTag +
            '?title=' +
            result.value.textInput +
            '&iconUrl=' +
            selectedFileURL,
        )
        const resultResponse = response.data
        if (resultResponse) {
          Swal.fire('Created!', '', 'success')
          setEditTrigger(true)
          setError({})

          setAllCategorySelect([
            ...allCategorySelect,
            {
              name_of_tag: result.value.textInput,
              id: resultResponse.tagId,
              icon_url: selectedFileURL as string,
            },
          ])
        }
      }
    })
  }

  const uploadFileToS3 = async (file: File) => {
    const uploadParams = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME ?? '',
      Key: `${file.name}`,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read',
    }
    return new Promise((resolve, reject) => {
      s3.upload(uploadParams, (err: any, data: any) => {
        if (err) {
          console.error('Ошибка загрузки файла:', err)

          reject(`Ошибка загрузки файла: ${err}`)
        } else {
          console.log('Файл успешно загружен:', data.Location)
          resolve(data.Location)
        }
      })
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

  const handleSort = (lessonsGet: any, i: number) => {
    const lessonClone = [...lessonsGet]
    let draggedIdx = -1
    const temp = lessonClone.filter((less, i) => {
      if (less.id == dragLesson.current) {
        draggedIdx = i
        return less
      }
    })[0]
    lessonClone.splice(
      draggedOverLesson.current > draggedIdx
        ? draggedOverLesson.current + 1
        : draggedOverLesson.current,
      0,
      temp,
    )
    setEditTrigger(true)
    setModules(
      modules.map((module: any, moduleIndex) => {
        if (moduleIndex == i) {
          return {
            title: module.title,
            lessons: lessonClone.filter(
              (less, i) =>
                less.id != dragLesson.current ||
                i ==
                  (draggedOverLesson.current > draggedIdx
                    ? draggedOverLesson.current + 1
                    : draggedOverLesson.current),
            ),
          }
        }
        return module
      }),
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
                    <Box sx={{ color: '#fff' }}>
                      <TextField
                        autoComplete="off"
                        margin="normal"
                        required
                        fullWidth
                        id="title"
                        type="text"
                        label="Title"
                        name="title"
                        error={(error && error.title) ?? false}
                        autoFocus
                        onChange={(e) => {
                          setForm({ ...form, title: e.target.value })
                          setEditTrigger(true)
                          setError({})
                        }}
                        value={form.title}
                      />
                      <Box sx={{ color: '#000000' }}>
                        <MyEditor value={richValue} setValue={setRichValue} />
                      </Box>
                      <TextField
                        autoComplete="off"
                        margin="normal"
                        required
                        fullWidth
                        error={(error && error.duration) ?? false}
                        id="duration"
                        type="number"
                        label="Duration"
                        name="duration"
                        InputProps={{
                          inputProps: { min: 1 },
                        }}
                        onChange={(e) => {
                          setForm({ ...form, duration: Number(e.target.value) })
                          setEditTrigger(true)
                          setError({})
                        }}
                        value={form.duration || ''}
                        sx={{ marginTop: 3 }}
                      />
                      <TextField
                        autoComplete="off"
                        margin="normal"
                        required
                        fullWidth
                        error={(error && error.price) ?? false}
                        id="price"
                        type="number"
                        label="Price"
                        name="price"
                        InputProps={{
                          inputProps: { min: 1 },
                        }}
                        onChange={(e) => {
                          setForm({ ...form, price: Number(e.target.value) })
                          setEditTrigger(true)
                          setError({})
                        }}
                        value={form.price || ''}
                      />
                      <TextField
                        autoComplete="off"
                        margin="normal"
                        fullWidth
                        id="priceDiscount"
                        type="number"
                        label="Price with discount"
                        name="priceDiscount"
                        InputProps={{
                          inputProps: { min: 1 },
                        }}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            priceDiscount: Number(e.target.value),
                          })
                          setEditTrigger(true)
                        }}
                        value={form.priceDiscount || ''}
                      />
                      <Box sx={{ marginTop: 2 }}>
                        <InputLabel>Level</InputLabel>
                        <Select
                          error={(error && error.level) ?? false}
                          fullWidth
                          id="levelSelect"
                          value={level}
                          onChange={handleChangeLevel}
                        >
                          <MenuItem value={'Beginner'}>Beginner</MenuItem>
                          <MenuItem value={'Junior'}>Junior</MenuItem>
                          <MenuItem value={'Middle'}>Middle</MenuItem>
                          <MenuItem value={'Senior'}>Senior</MenuItem>
                        </Select>
                      </Box>
                      <Box sx={{ marginTop: 2 }}>
                        <InputLabel>Type</InputLabel>
                        <Select
                          error={(error && error.type) ?? false}
                          fullWidth
                          id="typeSelect"
                          value={type}
                          onChange={handleChangeType}
                        >
                          <MenuItem value={'self-education'}>
                            Self education
                          </MenuItem>
                          <MenuItem value={'with-lector'}>With lector</MenuItem>
                        </Select>
                      </Box>
                      {type == 'with-lector' && (
                        <TextField
                          autoComplete="off"
                          margin="normal"
                          required
                          fullWidth
                          error={(error && error.lector) ?? false}
                          id="lector"
                          type="text"
                          label="Lector"
                          name="lector"
                          onChange={(e) => {
                            setForm({ ...form, lector: e.target.value })
                            setEditTrigger(true)
                            setError({})
                          }}
                          value={form.lector}
                        />
                      )}
                      {type == 'with-lector' && (
                        <TextField
                          autoComplete="off"
                          margin="normal"
                          required
                          fullWidth
                          id="date"
                          type="date"
                          label="Date"
                          name="date"
                          onChange={(e) => {
                            setForm({ ...form, date: e.target.value })
                            setEditTrigger(true)
                            setError({})
                          }}
                          value={
                            form.date || new Date().toISOString().split('T')[0]
                          }
                          sx={{
                            marginTop: 3,
                          }}
                        />
                      )}
                      <Box sx={{ marginTop: 2 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          error={(error && error.status) ?? false}
                          fullWidth
                          id="statusSelect"
                          value={status}
                          onChange={handleChangeStatus}
                        >
                          <MenuItem value={'active'}>Active</MenuItem>
                          <MenuItem value={'draft'}>Draft</MenuItem>
                        </Select>
                      </Box>
                      <Box sx={{ display: 'flex', marginTop: 1 }}>
                        <Box
                          sx={{
                            marginTop: 1,
                            fontWeight: 'bold',
                            color: '#000',
                          }}
                        >
                          Rating
                        </Box>
                        <Rating
                          name="rating"
                          precision={0.1}
                          onChange={(event, newValue) => {
                            setRating(newValue ?? 5.0)
                            setEditTrigger(true)
                            setError({})
                          }}
                          value={rating || 0}
                          sx={{
                            marginLeft: 4,
                            paddingTop: 1,
                            paddingBottom: 1,
                          }}
                        />
                      </Box>
                      <Autocomplete
                        disablePortal
                        multiple
                        id="combo-box-demo"
                        value={categorySelect}
                        onChange={(event, value: any) => {
                          setCategorySelect(value)
                          setEditTrigger(true)
                          setError({})
                        }}
                        getOptionLabel={(option: any) => option.name_of_tag}
                        options={allCategorySelect}
                        fullWidth
                        renderInput={(params) => (
                          <TextField {...params} label="Category" />
                        )}
                        renderOption={(
                          props: object,
                          option: any,
                          state: object,
                        ) => (
                          <div
                            {...props}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            {option.icon_url && (
                              <Image
                                src={option.icon_url}
                                alt={'tagIcon_' + option.id}
                                style={{ width: 20, height: 20 }}
                                width={20}
                                height={20}
                              ></Image>
                            )}
                            <div
                              style={{
                                textAlign: 'left',
                                width: '100%',
                                paddingLeft: '10px',
                              }}
                            >
                              {option.name_of_tag}
                            </div>
                            <IconButton
                              key={'deleteButton_' + option.id}
                              aria-label="delete"
                              onClick={async (e) => {
                                const deletingOption = option
                                const response = await axios.delete(
                                  urlTag + '?id=' + option.id,
                                )
                                const resultResponse = response.data
                                if (resultResponse) {
                                  setAllCategorySelect(
                                    allCategorySelect.filter(
                                      (category) =>
                                        category.id !== deletingOption.id,
                                    ),
                                  )
                                  setCategorySelect(
                                    categorySelect.filter(
                                      (category) =>
                                        category.id !== deletingOption.id,
                                    ),
                                  )
                                  Swal.fire({
                                    title: 'Deleted!',
                                    background: '#171622',
                                    color: '#ffec3e',
                                    confirmButtonColor: '#c58efe',
                                    icon: 'success',
                                  })
                                }
                              }}
                            >
                              <DeleteIcon key={'deleteIcon_'} color="primary" />
                            </IconButton>
                          </div>
                        )}
                      />
                      <Button onClick={showSwalTag}>Create Tag</Button>

                      <Autocomplete
                        disablePortal
                        multiple
                        id="skills"
                        value={skillsSelect}
                        onChange={(event, value: any) => {
                          setSkillsSelect(value)
                          setEditTrigger(true)
                          setError({})
                        }}
                        getOptionLabel={(option: any) => option.name_skill}
                        options={allSkillSelect}
                        fullWidth
                        renderInput={(params) => (
                          <TextField {...params} label="Skill" />
                        )}
                        renderOption={(
                          props: object,
                          option: any,
                          state: object,
                        ) => (
                          <div
                            {...props}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div>{option.name_skill}</div>
                            <IconButton
                              key={'deleteButtonSkill_' + option.id}
                              aria-label="delete"
                              onClick={async (e) => {
                                const deletingOption = option
                                const response = await axios.delete(
                                  urlSkill + '?id=' + option.id,
                                )
                                const resultResponse = response.data
                                if (resultResponse) {
                                  setAllSkillSelect(
                                    allSkillSelect.filter(
                                      (skill) => skill.id !== deletingOption.id,
                                    ),
                                  )
                                  setSkillsSelect(
                                    skillsSelect.filter(
                                      (skill) => skill.id !== deletingOption.id,
                                    ),
                                  )
                                  Swal.fire({
                                    title: 'Deleted!',
                                    background: '#171622',
                                    color: '#ffec3e',
                                    confirmButtonColor: '#c58efe',
                                    icon: 'success',
                                  })
                                }
                              }}
                            >
                              <DeleteIcon
                                key={'deleteIconSkill_'}
                                color="primary"
                              />
                            </IconButton>
                          </div>
                        )}
                      />
                      <Button onClick={showSwalSkill}>Create skill</Button>
                      <TextField
                        fullWidth
                        required
                        autoComplete="off"
                        margin="normal"
                        id="QuestionLimit"
                        type="number"
                        label="Question Limit"
                        name="questionLimit"
                        InputProps={{
                          inputProps: { min: -1 },
                        }}
                        onChange={(e) => {
                          setEditTrigger(true)
                          setForm({
                            ...form,
                            questionLimit: Number(e.target.value),
                          })
                        }}
                        value={form.questionLimit ? form.questionLimit : null}
                      />
                      {typeof mediaValue?.content == 'string' && (
                        <>
                          {mediaValue.type == 'image' ? (
                            <>
                              <Image src={mediaValue?.content} alt="" width={1200} height={675} />
                            </>
                          ) : (
                            <>
                              <video
                                controls
                                src={mediaValue?.content}
                                style={{ width: '100%' }}
                              />
                            </>
                          )}
                        </>
                      )}
                      <Box sx={{ display: 'flex' }}>
                        <Button
                          variant="contained"
                          component="label"
                          onClick={() => {
                            setEditTrigger(true)
                            setError({})
                            setMediaValue(undefined)
                          }}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Remove
                        </Button>

                        <Button
                          fullWidth
                          variant="contained"
                          component="label"
                          sx={{ mt: 1 }}
                        >
                          <input
                            type="file"
                            accept="video/mp4, image/png, image/jpeg"
                            onChange={handlePreviewMediaChange}
                          />
                        </Button>
                      </Box>
                      <Box sx={{ display: 'flex' }}>
                        {isEdited() && (
                          <Button
                            variant="contained"
                            sx={{
                              marginTop: 2,
                              fontWeight: 'bold',
                              width: '12rem',
                              marginRight: 2,
                            }}
                            onClick={(e) => {
                              setForm({
                                title: '',
                                questionLimit: null,
                                date: new Date().toISOString().split('T')[0],
                                duration: null,
                                lector: '',
                                price: null,
                                priceDiscount: null,
                              })
                              setLessonForm({
                                title: '',
                                link: '',
                                image: '',
                                hours: 0,
                                minutes: 0,
                              })
                              let selectedModulesArr: Array<Lesson> = []
                              modules.map((module: Module) => {
                                module.lessons.map((less: Lesson) => {
                                  selectedModulesArr.push(less)
                                })
                              })
                              setAllModules([
                                ...allModules,
                                ...selectedModulesArr,
                              ])
                              setModules([])

                              setRichValue([
                                {
                                  type: 'paragaph',
                                  children: [{ text: '' }],
                                },
                              ])
                              setLanguage('EN')
                              setLevel('')
                              setType('')
                              setStatus('')
                              setRating(0.0)
                              setCategorySelect([])
                              setTabValue(1)
                              setTimeout(() => {
                                setTabValue(0)
                              }, 10)
                            }}
                          >
                            Clear draft
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{
                            marginTop: 2,
                            fontWeight: 'bold',
                          }}
                          onClick={(e) => {
                            if (!id && editTrigger) {
                              handleSubmit('')
                            }
                            setTabValue(1)
                          }}
                        >
                          Go to structure
                        </Button>
                      </Box>
                    </Box>
                  </CustomTabPanel>
                  <CustomTabPanel value={tabValue} index={1}>
                    <Box sx={{ width: '100%' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                        }}
                      >
                        {modules.map((element, i) => {
                          return (
                            <Box
                              key={'mainModuleContainer_' + i}
                              sx={{ boxShadow: 2, border: '1px solid' }}
                            >
                              <Accordion defaultExpanded={true} sx={{}}>
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  sx={{}}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      width: '100%',
                                      gap: '10px',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <TextField
                                      autoComplete="off"
                                      margin="normal"
                                      fullWidth
                                      required
                                      error={
                                        countModuleNameMeet(element.title) > 1
                                      }
                                      id={'module' + i}
                                      type="text"
                                      label={'Module ' + (i + 1) + ' name'}
                                      name={'module' + i}
                                      autoFocus
                                      onChange={(e) => {
                                        setEditTrigger(true)
                                        setError({})
                                        setModules(
                                          modules.map((module, moduleIndex) => {
                                            if (i == moduleIndex) {
                                              return {
                                                ...module,
                                                title: e.target.value,
                                              }
                                            } else {
                                              return module
                                            }
                                          }),
                                        )
                                      }}
                                      value={element.title}
                                    />

                                    <IconButton
                                      color="error"
                                      sx={{
                                        marginTop: 3,
                                        width: '40px',
                                        height: '40px',
                                        marginRight: 4,
                                      }}
                                      onClick={(e) => {
                                        setEditTrigger(true)
                                        setError({})
                                        setModules(
                                          modules.filter(
                                            (moduleElem, index) => {
                                              if (i !== index) {
                                                return moduleElem
                                              }
                                              setAllModules([
                                                ...allModules,
                                                ...moduleElem.lessons,
                                              ])
                                            },
                                          ),
                                        )
                                      }}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </div>
                                </AccordionSummary>

                                <AccordionDetails
                                  style={{
                                    paddingLeft: '8px',
                                    paddingRight: '8px',
                                    borderTop: '2px solid',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: '100%',
                                      display: 'flex',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <Box sx={{ width: '100%' }}>
                                      {element.lessons.map((lesson, index) => {
                                        return (
                                          <div
                                            key={'mainModuleContainer_' + i}
                                            style={{
                                              color: '#0f0e16',
                                              width: '100%',
                                              background: '#cccccc',
                                              marginTop: '16px',
                                              padding: '16px',
                                              boxShadow:
                                                '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)',
                                            }}
                                            draggable
                                            onDragStart={() =>
                                              (dragLesson.current = lesson.id)
                                            }
                                            onDragEnter={() =>
                                              (draggedOverLesson.current =
                                                index)
                                            }
                                            onDragEnd={(e) =>
                                              handleSort(element.lessons, i)
                                            }
                                            onDragOver={(e) =>
                                              e.preventDefault()
                                            }
                                          >
                                            <Box
                                              sx={{ display: 'flex', gap: 1 }}
                                            >
                                              <DragIndicatorIcon />
                                              <Box sx={{ fontWeight: 'bold' }}>
                                                {lesson.title ?? ''}
                                              </Box>
                                            </Box>

                                            <Box
                                              sx={{
                                                display: 'flex',
                                                justifyContent: 'end',
                                              }}
                                            >
                                              {lesson.type == 'defaultOld' && (
                                                <IconButton
                                                  onClick={(e) => {
                                                    setPreview(
                                                      lesson.id == preview
                                                        ? '-1'
                                                        : (lesson.id ?? '-1'),
                                                    )
                                                  }}
                                                >
                                                  <PreviewIcon />
                                                </IconButton>
                                              )}
                                              <IconButton
                                                onClick={(e) => {
                                                  setIdLessonEdit(
                                                    idLessonEdit == lesson.id
                                                      ? null
                                                      : lesson.id
                                                        ? lesson.id
                                                        : null,
                                                  )
                                                  setLessonForm(lesson)
                                                  setCreateLessonIndx(i)
                                                  setLessonType(lesson.type)
                                                  setTabValue(2)
                                                }}
                                              >
                                                <EditIcon />
                                              </IconButton>
                                              <IconButton
                                                onClick={async (e) => {
                                                  setEditTrigger(true)
                                                  setError({})
                                                  setStoredModules([
                                                    ...storedModules,
                                                    lesson,
                                                  ])
                                                  setModules(
                                                    modules.map(
                                                      (elem, index) => {
                                                        if (i === index) {
                                                          return {
                                                            title: elem.title,
                                                            lessons:
                                                              elem.lessons.filter(
                                                                (
                                                                  lessonFilter,
                                                                  lessonIndex,
                                                                ) => {
                                                                  if (
                                                                    lessonFilter.id !==
                                                                    lesson.id
                                                                  ) {
                                                                    return lessonFilter
                                                                  }
                                                                  setStoredModules(
                                                                    [
                                                                      ...storedModules,
                                                                      lessonFilter,
                                                                    ],
                                                                  )
                                                                },
                                                              ),
                                                          }
                                                        }
                                                        return elem
                                                      },
                                                    ),
                                                  )
                                                }}
                                              >
                                                <DeleteIcon color="error" />
                                              </IconButton>
                                            </Box>
                                            {preview == lesson.id &&
                                              idLessonEdit != lesson.id && (
                                                <>
                                                  <Box
                                                    sx={{
                                                      paddingLeft: '16px',
                                                      maxHeight: '10rem',
                                                      overflow: 'auto',
                                                      scrollbarWidth: 'none',
                                                    }}
                                                  >
                                                    <SlateView
                                                      value={lesson.description}
                                                    />
                                                  </Box>
                                                  <Box
                                                    sx={{
                                                      overflow: 'auto',
                                                      scrollbarWidth: 'none',
                                                      marginTop: 2,
                                                    }}
                                                  >
                                                    <ExampleYouTube
                                                      url={
                                                        lesson.link.split(
                                                          '?v=',
                                                        )[1]
                                                      }
                                                    />
                                                  </Box>
                                                </>
                                              )}
                                          </div>
                                        )
                                      })}
                                    </Box>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'end',
                                      marginTop: 4,
                                    }}
                                  >
                                    <Box
                                      sx={{ maxWidth: '100%', width: '100%' }}
                                    >
                                      <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        getOptionLabel={(option: any) =>
                                          option.title
                                        }
                                        options={storedModules}
                                        value={{ title: '' }}
                                        fullWidth
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            label="Stored lessons"
                                          />
                                        )}
                                        onChange={(event, value: any) => {
                                          setEditTrigger(true)
                                          setError({})
                                          if (value) {
                                            setModules(
                                              modules.map(
                                                (modulesElem, index) => {
                                                  if (
                                                    index == i &&
                                                    modulesElem.lessons.filter(
                                                      (reDropElem) =>
                                                        reDropElem.id ===
                                                        value.id,
                                                    ).length === 0
                                                  ) {
                                                    setStoredModules(
                                                      storedModules.filter(
                                                        (storedModule) =>
                                                          storedModule.id !=
                                                          value.id,
                                                      ),
                                                    )
                                                    return {
                                                      title: modulesElem.title,
                                                      lessons: [
                                                        ...modulesElem.lessons,
                                                        {
                                                          ...value,
                                                        },
                                                      ],
                                                    }
                                                  }
                                                  return modulesElem
                                                },
                                              ),
                                            )
                                          }
                                        }}
                                        renderOption={(
                                          props: object,
                                          option: any,
                                          state: object,
                                        ) => (
                                          <div
                                            // {...props}
                                            style={{
                                              display: 'flex',
                                              justifyContent: 'space-between',
                                            }}
                                          >
                                            <div
                                              {...props}
                                              style={{ width: '100%' }}
                                            >
                                              {option.title}
                                            </div>
                                            <IconButton
                                              key={'deleteButton_' + option.id}
                                              aria-label="delete"
                                              onClick={async (e) => {
                                                Swal.fire({
                                                  title:
                                                    'Do you want to delete the lesson?',
                                                  background: '#171622',
                                                  color: '#ffec3e',
                                                  confirmButtonColor: '#ff2052',
                                                  showCancelButton: true,
                                                  confirmButtonText: 'Delete',
                                                }).then(async (result) => {
                                                  if (result.isConfirmed) {
                                                    removeLessonIds(option.id)
                                                    const response =
                                                      await axios.delete(
                                                        urlLesson +
                                                          '?id=' +
                                                          option.id,
                                                      )
                                                    const resultResponse =
                                                      response.data
                                                    if (resultResponse) {
                                                      setStoredModules(
                                                        storedModules.filter(
                                                          (lesson) =>
                                                            lesson.id !=
                                                            option.id,
                                                        ),
                                                      )
                                                    }
                                                  }
                                                })
                                              }}
                                              sx={{}}
                                            >
                                              <DeleteIcon
                                                key={'deleteIcon_'}
                                                color="primary"
                                              />
                                            </IconButton>
                                          </div>
                                        )}
                                      />
                                    </Box>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'end',
                                      marginTop: 4,
                                    }}
                                  >
                                    <Button
                                      variant="contained"
                                      onClick={() => {
                                        setCreateLessonIndx(
                                          createLessonIndx === i ? -1 : i,
                                        )
                                        setLessonForm({
                                          title: '',
                                          image: null,
                                          hours: 0,
                                          minutes: 0,
                                        })
                                        setTabValue(2)
                                      }}
                                    >
                                      Create lesson
                                    </Button>
                                  </Box>
                                </AccordionDetails>
                              </Accordion>
                            </Box>
                          )
                        })}
                      </Box>
                      <Button
                        variant="contained"
                        onClick={(e) => {
                          setModules([...modules, { title: '', lessons: [] }])
                        }}
                        sx={{
                          marginTop: 2,
                          fontWeight: 'bold',
                          borderRadius: '0px',
                        }}
                      >
                        Add Module
                      </Button>
                    </Box>
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

export default CourseCreate
