'use client'

import courseImage from '../../src/assets/courseImage.png'
import skillsImage from '../../src/assets/skillsImage.png'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Comments from '@/components/Comments/Comments'
import CourseControlls from '@/components/CourseControlls/CourseControlls'
import CourseMaterials from '@/components/CourseMaterials/CourseMaterials'
import CourseSidebar from '@/components/CourseSidebar/CourseSidebar'
import PlayButton from '@/components/PlayButton/PlayButton'
import PopularCourses from '@/components/PopularCourses/PopularCourses'

import SkillsList from '@/components/SkillsList/SkillsList'
import ViewsCount from '@/components/ViewsCount/ViewsCount'
import Layout from '@/components/Layout/Layout'
import '../../../app/globals.css'
import { Box, Grid, Button, Typography } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'

import IconButton from '@mui/material/IconButton'
import PreviewIcon from '@mui/icons-material/Preview'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Link from 'next/link'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TextField from '@mui/material/TextField'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateField } from '@mui/x-date-pickers/DateField'
import { InputLabel } from '@mui/material'

import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import dayjs from 'dayjs'
import axios, { all } from 'axios'
import Rating from '@mui/material/Rating'
import { useRouter } from 'next/navigation'
import { useRouter as useRouterNext } from 'next/router'
import MyEditor from '@/components/SlateEditor/Editor'
import SlateView from '@/components/SlateEditor/View'
import { Slate, Editable, withReact } from 'slate-react'
import { title } from 'process'
import Video from '@/components/video/Video'

import Swal from 'sweetalert2'
import React from 'react'
import YouTube, { YouTubeProps } from 'react-youtube'
import Autocomplete from '@mui/material/Autocomplete'
import withReactContent from 'sweetalert2-react-content'
import { YouTubeProp, TabPanelProps, Lesson, Module, Tag } from '@/utils/interfaces'
import ArchiveIcon from '@mui/icons-material/Archive'
import * as AWS from 'aws-sdk'
import { isEqual } from 'lodash-es'
import { deleteCookie } from 'cookies-next'

function ExampleYouTube(props: YouTubeProp) {
  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo()
  }

  const opts: YouTubeProps['opts'] = {
    height: '390',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  }

  return <YouTube videoId={props.url} opts={opts} onReady={onPlayerReady} />
}

const url = `${process.env.NEXT_BACK_HOST_API}/cabinet/course`
const urlLesson = `${process.env.NEXT_BACK_HOST_API}/cabinet/lesson`
const urlTag = `${process.env.NEXT_BACK_HOST_API}/cabinet/tag`

const textFieldColors = {
  // '& label.Mui-focused': {
  //   color: '#ffec3e',
  // },
  // '& .MuiOutlinedInput-root': {
  //   '& fieldset': { borderColor: '#ffec3e' },
  //   '&:hover fieldset': {
  //     borderColor: '#ffec3e',
  //   },
  //   '&.Mui-focused fieldset': {
  //     borderColor: '#ffec3e',
  //   },
  // },
  // color: '#fff',
  // input: {
  //   color: '#fff',
  //   borderColor: '#fff',
  // },
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
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
  // States
  const [createLessonIndx, setCreateLessonIndx] = useState(-1)
  const [id, setId] = useState()
  const [idLessonEdit, setIdLessonEdit] = useState<string | null>(null)
  const [value, setValue] = useState(0)
  const [language, setLanguage] = useState('')
  const [level, setLevel] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [modules, setModules] = useState<Array<Module>>([])
  const [allModules, setAllModules] = useState<Array<Lesson>>([])
  const [storedModules, setStoredModules] = useState<Array<Lesson>>([])
  const [expanded, setExpanded] = useState<string | false>(false)
  const [reDropBlock, setReDropBlock] = useState(false)
  const [categorySelect, setCategorySelect] = useState<Array<Tag>>([])
  const [allCategorySelect, setAllCategorySelect] = useState<Array<Tag>>([])
  const [form, setForm] = useState<any>({
    title: '',
    date: '2024-01-01',
    duration: null,
    lector: '',
    price: null,
    priceDiscount: null,
  })
  const [fetchedData, setFetchedData] = useState<any>()
  const [fetchedMediaData, setFetchedMediaData] = useState<any>()
  const [rating, setRating] = useState(0.0)
  const [richValue, setRichValue] = useState<Array<any>>([
    {
      type: 'paragaph',
      children: [{ text: '' }],
    },
  ])
  const [richValueLesson, setRichValueLesson] = useState([
    {
      type: 'paragaph',
      children: [{ text: '' }],
    },
  ])
  const [lessonForm, setLessonForm] = useState({
    title: '',
    link: '',
  })
  const [preview, setPreview] = useState('-1')
  const [editTrigger, setEditTrigger] = useState(false)
  const [mediaValue, setMediaValue] = useState<{ type: string; content: File }>()
  const [error, setError] = useState<any>()
  // Handlers
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setIdLessonEdit(null)
    setLessonForm({
      title: '',
      link: '',
    })
    setRichValueLesson([
      {
        type: 'paragaph',
        children: [{ text: '' }],
      },
    ])
    setValue(newValue)
  }
  const handleChangeLanguage = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string)
    setEditTrigger(true)
    setError({})
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
  const handleChangeExpanded =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
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
      Swal.fire('Each module must have a unique name!', '', 'error')
      return
    }
    setError({
      title: form.title == '',
      duration: form.duration == null || form.duration == 0,
      lector: form.lector == '',
      price: form.price == null || form.price == 0 || form.price < 0,
      priceDiscount:
        form.priceDiscount == null || form.priceDiscount == 0 || form.priceDiscount < 0,
      language: language == '',
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
      form.priceDiscount == null ||
      form.priceDiscount == 0 ||
      form.priceDiscount < 0 ||
      language == '' ||
      level == '' ||
      type == '' ||
      status == ''
    ) {
      Swal.fire('Validation failed', '', 'error')
      return
    }

    if (modules.filter((module) => module.title.trim() == '').length > 0) {
      setValue(1)
      Swal.fire('Module title is empty', '', 'error')
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
      language: language,
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
          url + '?id=' + id + '&isActive=' + (status == 'active' ? true : false),
          json
        )
        const resultResponse = response.data
        if (resultResponse) {
          Swal.fire('Changed!', '', 'success')
          router.push('/admin')
        }
      } else {
        const response = await axios.post(
          url + '?isActive=' + (status == 'active' ? true : false),
          json
        )
        const resultResponse = response.data
        if (resultResponse) {
          Swal.fire('Created!', '', 'success')
          router.push('/admin')
        }
      }
    } catch (error) {
      Swal.fire('Something went wrong!', error + '', 'error')
      return
    }
  }

  // sweet alert functions
  function showPushAction(url: string) {
    if (id ? editTrigger : isEdited()) {
      Swal.fire({
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
  const showSwal = () => {
    withReactContent(Swal).fire({
      title: 'Create tag',
      input: 'text',
      preConfirm: async () => {
        if (!Swal.getInput()?.value.trim()) {
          Swal.showValidationMessage('<i class="fa fa-info-circle"></i> Tag name is required')
        } else {
          const val = Swal.getInput()?.value.trim() || ''
          const response = await axios.post(urlTag + '?title=' + val)
          const resultResponse = response.data
          if (resultResponse) {
            Swal.fire('Created!', '', 'success')
            setEditTrigger(true)
            setError({})
            setAllCategorySelect([
              ...allCategorySelect,
              { name_of_tag: val, id: resultResponse.tagId },
            ])
          }
        }
      },
    })
  }
  // fetching functions
  async function getPageData() {
    if (typeof window !== 'undefined') {
      const fullUrl = window.location.href

      const responseTag = await fetch(urlTag + 's', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const resultTag = await responseTag.json()
      setAllCategorySelect(
        resultTag.getTags.map((tag: any) => {
          return tag
        })
      )

      if (fullUrl.split('_id=')[1]) {
        const response = await fetch(url + 's?id=' + fullUrl.split('_id=')[1], {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const result = await response.json()
        const responseLesson = await fetch(urlLesson + 's', {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const resultLesson = await responseLesson.json()
        const resultData = result.getCourses.filter(
          (course: any) => course.id == fullUrl.split('_id=')[1]
        )

        let allLessons = resultLesson.getLessons.map((lesson: any) => {
          return {
            id: lesson.id,
            title: lesson.data.title,
            description: lesson.data.description,
            link: lesson.data.link,
          }
        })
        if (resultData[0].data.mediaValue) {
          setMediaValue({
            type: resultData[0].data.mediaValue.type,
            content: resultData[0].data.mediaValue.content,
          })
        }

        setCategorySelect(
          resultTag.getTags.filter((tag: any) => {
            if (resultData[0].data.category.indexOf(tag.id) != -1) {
              return tag
            }
          })
        )
        setFetchedData(resultData[0].data.description)
        setFetchedMediaData(resultData[0].data.mediaValue)
        setStatus(resultData[0].data.status ? 'active' : 'draft')
        setId(resultData[0].id)
        setLanguage(resultData[0].data.language)
        setLevel(resultData[0].data.level)
        setRichValue(resultData[0].data.description)
        setType(resultData[0].data.type)
        setRating(resultData[0].data.rating)
        setModules(
          resultData[0].data.modules.map((module: any) => {
            return {
              title: module.title,
              lessons: module.lessons.map((lessonId: string) => {
                const found = allLessons.filter(
                  (moduleElemFilter: Lesson) => moduleElemFilter.id == lessonId
                )
                return found[0]
              }),
            }
          })
        )
        resultData[0].data.modules.map((module: any) => {
          module.lessons.map((lessonId: string) => {
            allLessons = allLessons.filter(
              (moduleElemFilter: Lesson) => moduleElemFilter.id != lessonId
            )
          })
        })
        setStoredModules(allLessons)
        setForm({
          title: resultData[0].data.title,
          description: resultData[0].data.description,
          richtext: resultData[0].data.richtext,
          date: resultData[0].data.date,
          duration: resultData[0].data.duration,
          lector: resultData[0].data.lector,
          price: resultData[0].data.price,
          priceDiscount: resultData[0].data?.priceDiscount,
        })
        setValue(2)
        setTimeout(() => {
          setValue(0)
        }, 1)
      } else {
        setRichValue([
          {
            type: 'paragaph',
            children: [{ text: '' }],
          },
        ])
        const response = await fetch(urlLesson + 's', {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const result = await response.json()
        setStoredModules(
          result.getLessons.map((lesson: any) => {
            return {
              id: lesson.id,
              title: lesson.data.title,
              description: lesson.data.description,
              link: lesson.data.link,
            }
          })
        )
      }
    }
  }
  useEffect(() => {
    getPageData()
    function handleOnBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault()
      return (e.returnValue = '')
    }
    window.addEventListener('beforeunload', handleOnBeforeUnload, { capture: true })
    return () => {
      window.removeEventListener('beforeunload', handleOnBeforeUnload, { capture: true })
    }
  }, [])

  // AWS module
  if (
    !process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ||
    !process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ||
    !process.env.NEXT_PUBLIC_AWS_BUCKET_NAME
  ) {
    throw new Error(
      'Отсутствуют переменные окружения NEXT_PUBLIC_AWS_ACCESS_KEY_ID или NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY или NEXT_PUBLIC_AWS_BUCKET_NAME'
    )
  }

  AWS.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    region: 'eu-west-3',
  })

  const s3 = new AWS.S3()
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

  // comparing functions
  function compareIsLessonEdited(lessonId: string, moduleI: number) {
    const lessonToCompare = modules[moduleI].lessons.filter((less) => less.id == lessonId)
    return (
      lessonToCompare[0].title === lessonForm.title &&
      lessonToCompare[0].link === lessonForm.link &&
      compareRichTexts(richValueLesson, lessonToCompare[0].description)
    )
  }
  function compareRichTexts(first: Array<any>, second: Array<any>) {
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
  function countModuleNameMeet(str: string) {
    const result = modules.filter((module) => module.title.trim() == str.trim())

    return result.length
  }
  function isEdited() {
    return (
      form.title != '' ||
      form.date != '2024-01-01' ||
      form.duration != undefined ||
      form.lector != '' ||
      form.price != undefined ||
      form.priceDiscount != undefined ||
      modules.length != 0 ||
      language != '' ||
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

  const dragLesson = useRef<any>(0)
  const draggedOverLesson = useRef<any>(0)
  function handleSort(lessonsGet: any, i: number) {
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
      temp
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
                    : draggedOverLesson.current)
            ),
          }
        }
        return module
      })
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#fff', paddingTop: 8, paddingBottom: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'end', padding: 4 }}>
        <Link href={'/admin/login'}>
          <Button
            variant='contained'
            color='error'
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
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ marginRight: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
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
        </Box>
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              width: '100%',
              boxShadow: 2,
              borderRadius: '10px',

              border: '1px solid #000',
              borderTop: '4px solid #000',
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label='basic tabs example'
                sx={{}}
                TabIndicatorProps={{
                  style: {
                    backgroundColor: '#000',
                  },
                }}
              >
                <Tab
                  value={0}
                  label='General'
                  sx={{
                    minWidth: '50%',
                    width: '100%',
                    color: '#000',

                    '&.Mui-selected': {
                      color: '#000',
                      fontWeight: 'bold',
                    },
                  }}
                />
                <Tab
                  value={1}
                  label='Structure'
                  sx={{
                    minWidth: '50%',
                    width: '100%',
                    color: '#000',
                    '&.Mui-selected': {
                      color: '#000',
                      fontWeight: 'bold',
                    },
                  }}
                />
              </Tabs>
              <CustomTabPanel value={value} index={0}>
                <Box sx={{ color: '#fff' }}>
                  <TextField
                    autoComplete='off'
                    margin='normal'
                    required
                    fullWidth
                    id='title'
                    type='text'
                    label='Title'
                    name='title'
                    error={(error && error.title) ?? false}
                    autoFocus
                    onChange={(e) => {
                      setForm({ ...form, title: e.target.value })
                      setEditTrigger(true)
                      setError({})
                    }}
                    value={form.title}
                    sx={{ ...textFieldColors }}
                  />
                  <Box sx={{ color: '#000000' }}>
                    <MyEditor value={richValue} setValue={setRichValue} />
                  </Box>
                  <TextField
                    autoComplete='off'
                    margin='normal'
                    required
                    fullWidth
                    id='date'
                    type='date'
                    label='Date'
                    name='date'
                    onChange={(e) => {
                      setForm({ ...form, date: e.target.value })
                      setEditTrigger(true)
                      setError({})
                    }}
                    value={form.date || '2024-01-01'}
                    sx={{
                      ...textFieldColors,
                      marginTop: 3,
                    }}
                  />
                  <TextField
                    autoComplete='off'
                    margin='normal'
                    required
                    fullWidth
                    error={(error && error.duration) ?? false}
                    id='duration'
                    type='number'
                    label='Duration'
                    name='duration'
                    InputProps={{
                      inputProps: { min: 1 },
                    }}
                    onChange={(e) => {
                      setForm({ ...form, duration: Number(e.target.value) })
                      setEditTrigger(true)
                      setError({})
                    }}
                    value={form.duration || ''}
                    sx={{ ...textFieldColors, marginTop: 3 }}
                  />
                  <TextField
                    autoComplete='off'
                    margin='normal'
                    required
                    fullWidth
                    error={(error && error.price) ?? false}
                    id='price'
                    type='number'
                    label='Price'
                    name='price'
                    InputProps={{
                      inputProps: { min: 1 },
                    }}
                    onChange={(e) => {
                      setForm({ ...form, price: Number(e.target.value) })
                      setEditTrigger(true)
                      setError({})
                    }}
                    value={form.price || ''}
                    sx={{ ...textFieldColors }}
                  />
                  <TextField
                    autoComplete='off'
                    margin='normal'
                    required
                    fullWidth
                    error={(error && error.priceDiscount) ?? false}
                    id='priceDiscount'
                    type='number'
                    label='Price with discount'
                    name='priceDiscount'
                    InputProps={{
                      inputProps: { min: 1 },
                    }}
                    onChange={(e) => {
                      setForm({ ...form, priceDiscount: Number(e.target.value) })
                      setEditTrigger(true)
                      setError({})
                    }}
                    value={form.priceDiscount || ''}
                    sx={{ ...textFieldColors }}
                  />
                  <Box sx={{ marginTop: 2 }}>
                    <InputLabel>Language</InputLabel>
                    <Select
                      error={(error && error.language) ?? false}
                      fullWidth
                      id='languageSelect'
                      value={language}
                      onChange={handleChangeLanguage}
                    >
                      <MenuItem value={'RU'}>RU</MenuItem>
                      <MenuItem value={'UA'}>UA</MenuItem>
                      <MenuItem value={'EN'}>EN</MenuItem>
                    </Select>
                  </Box>
                  <Box sx={{ marginTop: 2 }}>
                    <InputLabel>Level</InputLabel>
                    <Select
                      error={(error && error.level) ?? false}
                      fullWidth
                      id='levelSelect'
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
                      id='typeSelect'
                      value={type}
                      onChange={handleChangeType}
                    >
                      <MenuItem value={'self-education'}>Self education</MenuItem>
                      <MenuItem value={'with-lector'}>With lector</MenuItem>
                    </Select>
                  </Box>
                  {type == 'with-lector' && (
                    <TextField
                      autoComplete='off'
                      margin='normal'
                      required
                      fullWidth
                      error={(error && error.lector) ?? false}
                      id='lector'
                      type='text'
                      label='Lector'
                      name='lector'
                      onChange={(e) => {
                        setForm({ ...form, lector: e.target.value })
                        setEditTrigger(true)
                        setError({})
                      }}
                      value={form.lector}
                      sx={{ ...textFieldColors }}
                    />
                  )}
                  <Box sx={{ marginTop: 2 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      error={(error && error.status) ?? false}
                      fullWidth
                      id='statusSelect'
                      value={status}
                      onChange={handleChangeStatus}
                    >
                      <MenuItem value={'active'}>Active</MenuItem>
                      <MenuItem value={'draft'}>Draft</MenuItem>
                    </Select>
                  </Box>
                  <Box sx={{ display: 'flex', marginTop: 1 }}>
                    <Box sx={{ marginTop: 1, fontWeight: 'bold', color: '#000' }}>Rating</Box>
                    <Rating
                      name='rating'
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
                    id='combo-box-demo'
                    value={categorySelect}
                    onChange={(event, value: any) => {
                      setCategorySelect(value)
                      setEditTrigger(true)
                      setError({})
                    }}
                    getOptionLabel={(option: any) => option.name_of_tag}
                    options={allCategorySelect}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label='Category' />}
                    renderOption={(props: object, option: any, state: object) => (
                      <div {...props} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>{option.name_of_tag}</div>
                        <IconButton
                          key={'deleteButton_' + option.id}
                          aria-label='delete'
                          onClick={async (e) => {
                            const deletingOption = option
                            const response = await axios.delete(urlTag + '?id=' + option.id)
                            const resultResponse = response.data
                            if (resultResponse) {
                              setAllCategorySelect(
                                allCategorySelect.filter(
                                  (category) => category.id !== deletingOption.id
                                )
                              )
                              setCategorySelect(
                                categorySelect.filter(
                                  (category) => category.id !== deletingOption.id
                                )
                              )
                              Swal.fire('Deleted!', '', 'success')
                            }
                          }}
                        >
                          <DeleteIcon key={'deleteIcon_'} color='primary' />
                        </IconButton>
                      </div>
                    )}
                  />
                  <Button onClick={showSwal}>Create Tag</Button>
                  {typeof mediaValue?.content == 'string' && (
                    <>
                      {mediaValue.type == 'image' ? (
                        <>
                          <img src={mediaValue?.content} />
                        </>
                      ) : (
                        <>
                          <video controls src={mediaValue?.content} style={{ width: '100%' }} />
                        </>
                      )}
                    </>
                  )}
                  <Box sx={{ display: 'flex' }}>
                    <Button
                      variant='contained'
                      component='label'
                      onClick={() => {
                        setEditTrigger(true)
                        setError({})
                        setMediaValue(undefined)
                      }}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Remove
                    </Button>

                    <Button fullWidth variant='contained' component='label' sx={{ mt: 1 }}>
                      <input
                        type='file'
                        accept='video/mp4, image/png, image/jpeg'
                        onChange={handlePreviewMediaChange}
                      />
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex' }}>
                    {isEdited() && (
                      <Button
                        variant='contained'
                        sx={{
                          marginTop: 2,
                          fontWeight: 'bold',
                          width: '12rem',
                          marginRight: 2,
                        }}
                        onClick={(e) => {
                          setForm({
                            title: '',
                            date: '2024-01-01',
                            duration: null,
                            lector: '',
                            price: null,
                            priceDiscount: null,
                          })
                          setLessonForm({
                            title: '',
                            link: '',
                          })
                          let selectedModulesArr: Array<Lesson> = []
                          modules.map((module: Module) => {
                            module.lessons.map((less: Lesson) => {
                              selectedModulesArr.push(less)
                            })
                          })
                          setAllModules([...allModules, ...selectedModulesArr])
                          setModules([])

                          setRichValue([
                            {
                              type: 'paragaph',
                              children: [{ text: '' }],
                            },
                          ])
                          setRichValueLesson([
                            {
                              type: 'paragaph',
                              children: [{ text: '' }],
                            },
                          ])
                          setLanguage('')
                          setLevel('')
                          setType('')
                          setStatus('')
                          setRating(0.0)
                          setCategorySelect([])
                          setValue(1)
                          setTimeout(() => {
                            setValue(0)
                          }, 10)
                        }}
                      >
                        Clear draft
                      </Button>
                    )}
                    <Button
                      variant='contained'
                      fullWidth
                      sx={{
                        marginTop: 2,
                        fontWeight: 'bold',
                      }}
                      onClick={(e) => setValue(1)}
                    >
                      Go to structure
                    </Button>
                  </Box>
                </Box>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {modules.map((element, i) => {
                      return (
                        <Box
                          key={'mainModuleContainer_' + i}
                          sx={{ boxShadow: 2, border: '1px solid' }}
                        >
                          <Accordion
                            expanded={expanded === 'panel' + i}
                            onChange={handleChangeExpanded('panel' + i)}
                            sx={{}}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              sx={{
                                borderBottom: expanded === 'panel' + i ? '2px solid' : '',
                              }}
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
                                  autoComplete='off'
                                  margin='normal'
                                  required
                                  error={countModuleNameMeet(element.title) > 1}
                                  id={'module' + i}
                                  type='text'
                                  label={'Module ' + (i + 1) + ' name'}
                                  name={'module' + i}
                                  autoFocus
                                  onChange={(e) => {
                                    setEditTrigger(true)
                                    setError({})
                                    setModules(
                                      modules.map((module, moduleIndex) => {
                                        if (i == moduleIndex) {
                                          return { ...module, title: e.target.value }
                                        } else {
                                          return module
                                        }
                                      })
                                    )
                                  }}
                                  value={element.title}
                                  sx={{ ...textFieldColors }}
                                />

                                <IconButton
                                  color='error'
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
                                      modules.filter((moduleElem, index) => {
                                        if (i !== index) {
                                          return moduleElem
                                        }
                                        setAllModules([...allModules, ...moduleElem.lessons])
                                        setExpanded('')
                                      })
                                    )
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </div>
                            </AccordionSummary>

                            <AccordionDetails style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'end', marginTop: 4 }}>
                                <Box sx={{ maxWidth: '40%', width: '100%' }}>
                                  <Autocomplete
                                    disablePortal
                                    id='combo-box-demo'
                                    getOptionLabel={(option: any) => option.title}
                                    options={storedModules}
                                    value={{ title: '' }}
                                    fullWidth
                                    renderInput={(params) => (
                                      <TextField {...params} label='Stored lessons' />
                                    )}
                                    onChange={(event, value: any) => {
                                      setEditTrigger(true)
                                      setError({})
                                      setModules(
                                        modules.map((modulesElem, index) => {
                                          if (
                                            index == i &&
                                            modulesElem.lessons.filter(
                                              (reDropElem) => reDropElem.id === value.id
                                            ).length === 0
                                          ) {
                                            console.log(
                                              storedModules.filter(
                                                (storedModule) => storedModule.id != value.id
                                              )
                                            )
                                            setStoredModules(
                                              storedModules.filter(
                                                (storedModule) => storedModule.id != value.id
                                              )
                                            )
                                            return {
                                              title: modulesElem.title,
                                              lessons: [
                                                ...modulesElem.lessons,
                                                {
                                                  id: value.id,
                                                  title: value.title,
                                                  description: value.description,
                                                  link: value.link,
                                                  fields: value.fields,
                                                },
                                              ],
                                            }
                                          }
                                          return modulesElem
                                        })
                                      )
                                    }}
                                    renderOption={(props: object, option: any, state: object) => (
                                      <div
                                        // {...props}
                                        style={{ display: 'flex', justifyContent: 'space-between' }}
                                      >
                                        <div {...props} style={{ width: '100%' }}>
                                          {option.title}
                                        </div>
                                        <IconButton
                                          key={'deleteButton_' + option.id}
                                          aria-label='delete'
                                          onClick={async (e) => {
                                            const response = await axios.delete(
                                              urlLesson + '?id=' + option.id
                                            )
                                            const resultResponse = response.data
                                            if (resultResponse) {
                                              setStoredModules(
                                                storedModules.filter(
                                                  (lesson) => lesson.id != option.id
                                                )
                                              )
                                            }
                                          }}
                                          sx={{}}
                                        >
                                          <DeleteIcon key={'deleteIcon_'} color='primary' />
                                        </IconButton>
                                      </div>
                                    )}
                                  />
                                </Box>
                              </Box>
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
                                    onDragStart={() => (dragLesson.current = lesson.id)}
                                    onDragEnter={() => (draggedOverLesson.current = index)}
                                    onDragEnd={(e) => handleSort(element.lessons, i)}
                                    onDragOver={(e) => e.preventDefault()}
                                  >
                                    <Box sx={{ fontWeight: 'bold' }}>{lesson.title ?? ''}</Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                      <IconButton
                                        onClick={(e) => {
                                          setPreview(
                                            lesson.id == preview ? '-1' : lesson.id ?? '-1'
                                          )
                                        }}
                                      >
                                        <PreviewIcon />
                                      </IconButton>
                                      <IconButton
                                        onClick={(e) => {
                                          setIdLessonEdit(
                                            idLessonEdit == lesson.id
                                              ? null
                                              : lesson.id
                                              ? lesson.id
                                              : null
                                          )
                                          setLessonForm({
                                            title: lesson.title,
                                            link: lesson.link,
                                          })
                                          setRichValueLesson(lesson.description)
                                          setCreateLessonIndx(i)
                                          setValue(2)
                                        }}
                                      >
                                        <EditIcon />
                                      </IconButton>
                                      <IconButton
                                        onClick={async (e) => {
                                          setEditTrigger(true)
                                          setError({})
                                          setStoredModules([...storedModules, lesson])
                                          setModules(
                                            modules.map((elem, index) => {
                                              if (i === index) {
                                                return {
                                                  title: elem.title,
                                                  lessons: elem.lessons.filter(
                                                    (lessonFilter, lessonIndex) => {
                                                      if (lessonFilter.id !== lesson.id) {
                                                        return lessonFilter
                                                      }
                                                      setStoredModules([
                                                        ...storedModules,
                                                        lessonFilter,
                                                      ])
                                                    }
                                                  ),
                                                }
                                              }
                                              return elem
                                            })
                                          )
                                        }}
                                      >
                                        <ArchiveIcon color='error' />
                                      </IconButton>
                                    </Box>
                                    {preview == lesson.id && idLessonEdit != lesson.id && (
                                      <>
                                        <Box
                                          sx={{
                                            paddingLeft: '16px',
                                            maxHeight: '10rem',
                                            overflow: 'auto',
                                            scrollbarWidth: 'none',
                                          }}
                                        >
                                          <SlateView value={lesson.description} />
                                        </Box>
                                        <Box
                                          sx={{
                                            overflow: 'auto',
                                            scrollbarWidth: 'none',
                                            marginTop: 2,
                                          }}
                                        >
                                          <ExampleYouTube url={lesson.link.split('?v=')[1]} />
                                        </Box>
                                      </>
                                    )}
                                  </div>
                                )
                              })}
                              <Box sx={{ display: 'flex', justifyContent: 'end', marginTop: 4 }}>
                                <Button
                                  variant='contained'
                                  onClick={() => {
                                    setCreateLessonIndx(createLessonIndx === i ? -1 : i)

                                    setRichValueLesson([
                                      {
                                        type: 'paragaph',
                                        children: [{ text: '' }],
                                      },
                                    ])
                                    setValue(2)
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
                    variant='contained'
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
              <CustomTabPanel value={value} index={2}>
                <Box
                  sx={{
                    color: '#fff',
                  }}
                >
                  <TextField
                    margin='normal'
                    required
                    fullWidth
                    id='lessonTitle'
                    type='title'
                    label='Title'
                    name='title'
                    autoFocus
                    autoComplete='off'
                    onChange={(e) => {
                      setLessonForm({ ...lessonForm, title: e.target.value })
                    }}
                    value={lessonForm.title}
                    sx={{ ...textFieldColors }}
                  />
                  <Box sx={{ color: '#000000' }}>
                    <MyEditor value={richValueLesson} setValue={setRichValueLesson} />
                  </Box>

                  <Box sx={{ width: '100%', marginTop: 2 }}>
                    <ExampleYouTube url={lessonForm.link.split('?v=')[1]} />
                  </Box>

                  <TextField
                    margin='normal'
                    required
                    fullWidth
                    id='lessonLink'
                    type='text'
                    label='Link'
                    name='link'
                    InputProps={{
                      inputProps: { min: 1 },
                    }}
                    autoComplete='off'
                    onChange={(e) => {
                      setLessonForm({ ...lessonForm, link: e.target.value })
                    }}
                    value={lessonForm.link}
                    sx={{ ...textFieldColors }}
                  />
                  <Button
                    variant='contained'
                    fullWidth
                    sx={{
                      marginTop: 2,
                      fontWeight: 'bold',
                    }}
                    onClick={async (e) => {
                      if (idLessonEdit && compareIsLessonEdited(idLessonEdit, createLessonIndx)) {
                        setValue(1)
                        return
                      }
                      try {
                        setEditTrigger(true)
                        setError({})
                        if (idLessonEdit) {
                          let found = false
                          storedModules.map((less) => {
                            if (less.title == lessonForm.title.trim()) found = true
                          })
                          modules.map((module) => {
                            module.lessons.map((less) => {
                              if (less.title == lessonForm.title.trim() && idLessonEdit != less.id)
                                found = true
                            })
                          })
                          if (!found) {
                            const response = await axios.put(urlLesson + '?id=' + idLessonEdit, {
                              title: lessonForm.title,
                              description: richValueLesson,
                              link: lessonForm.link,
                            })
                            const resultResponse = response.data
                            if (resultResponse) {
                              setModules(
                                modules.map((elem, index) => {
                                  if (createLessonIndx === index) {
                                    return {
                                      title: elem.title,
                                      lessons: elem.lessons.map((lessonFilter, lessonIndex) => {
                                        if (lessonFilter.id !== idLessonEdit) {
                                          return lessonFilter
                                        }
                                        return {
                                          ...lessonForm,
                                          description: richValueLesson,
                                          id: idLessonEdit,
                                        }
                                      }),
                                    }
                                  }
                                  return elem
                                })
                              )
                              setLessonForm({
                                title: '',
                                link: '',
                              })
                              setRichValueLesson([
                                {
                                  type: 'paragaph',
                                  children: [{ text: '' }],
                                },
                              ])
                              setIdLessonEdit(null)
                              setValue(1)
                            }
                          } else {
                            Swal.fire('Course name is already taken', '', 'error')
                          }
                        } else {
                          let found = false
                          storedModules.map((less) => {
                            if (less.title == lessonForm.title.trim()) found = true
                          })
                          modules.map((module) => {
                            module.lessons.map((less) => {
                              if (less.title == lessonForm.title.trim()) found = true
                            })
                          })
                          if (!found) {
                            const response = await axios.post(urlLesson, {
                              title: lessonForm.title,
                              description: richValueLesson,
                              link: lessonForm.link,
                            })
                            const resultResponse = response.data
                            if (resultResponse) {
                              setModules(
                                modules.map((modulesElem, index) => {
                                  if (
                                    index == createLessonIndx &&
                                    modulesElem.lessons.filter(
                                      (reDropElem) => reDropElem.id === resultResponse.lessonId
                                    ).length === 0
                                  ) {
                                    return {
                                      title: modulesElem.title,
                                      lessons: [
                                        ...modulesElem.lessons,
                                        {
                                          ...lessonForm,
                                          id: resultResponse.lessonId,
                                          description: richValueLesson,
                                        },
                                      ],
                                    }
                                  }
                                  return modulesElem
                                })
                              )
                              setLessonForm({
                                title: '',
                                link: '',
                              })
                            }
                            setCreateLessonIndx(-1)
                            setValue(1)
                          } else {
                            Swal.fire('Course name is already taken', '', 'error')
                          }
                        }
                      } catch (error) {
                        Swal.fire('Something went wrong!', error + '', 'error')
                        return
                      }
                    }}
                  >
                    {idLessonEdit
                      ? compareIsLessonEdited(idLessonEdit, createLessonIndx)
                        ? 'Cancel'
                        : 'Save'
                      : 'Create'}
                  </Button>
                </Box>
              </CustomTabPanel>
            </Box>
          </Box>
          <Button
            variant='contained'
            fullWidth
            sx={{
              marginTop: 2,
              fontWeight: 'bold',
            }}
            onClick={handleSubmit}
          >
            {id ? (editTrigger ? 'Save' : 'Cancel') : 'Add Course'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default CourseCreate
