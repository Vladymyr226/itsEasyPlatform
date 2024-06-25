'use client'

import courseImage from '../../src/assets/courseImage.png'
import skillsImage from '../../src/assets/skillsImage.png'
import { useEffect, useState } from 'react'
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

interface YouTubeProp {
  url: string
}
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

const url = 'https://its-easy-platform-back-end.vercel.app/api/cabinet/course'
const urlLesson = 'https://its-easy-platform-back-end.vercel.app/api/cabinet/lesson'
const urlTag = 'https://its-easy-platform-back-end.vercel.app/api/cabinet/tag'

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

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}
interface Lesson {
  id?: string
  title: string
  description: any
  link: string
}
interface Module {
  title: string
  lessons: Array<Lesson>
}
interface Tag {
  name_of_tag: string
  id: string
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
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
    }
  }, [])

  //  bg-dark shadow-lg p-5 rounded-lg border-t-4 border-yellow w-full max-w-[30rem]')
  //   dropModal
  const [id, setId] = useState()
  const [idLessonEdit, setIdLessonEdit] = useState<string | null>(null)
  const [value, setValue] = useState(0)
  const [imageUrl, setImageUrl] = useState('')

  const [language, setLanguage] = useState('')
  const [level, setLevel] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')

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
  }
  const handleChangeLevel = (event: SelectChangeEvent) => {
    setLevel(event.target.value as string)
  }
  const handleChangeType = (event: SelectChangeEvent) => {
    setType(event.target.value as string)
  }
  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string)
  }

  const [modules, setModules] = useState<Array<Module>>([])
  const [allModules, setAllModules] = useState<Array<Lesson>>([])
  const [storedModules, setStoredModules] = useState<Array<Lesson>>([])
  const [expanded, setExpanded] = useState<string | false>(false)
  const [expandedStored, setExpandedStored] = useState<string | false>(false)
  const [reDropBlock, setReDropBlock] = useState(false)
  const [categorySelect, setCategorySelect] = useState<Array<Tag>>([])
  const [allCategorySelect, setAllCategorySelect] = useState<Array<Tag>>([])
  const [form, setForm] = useState<any>({
    title: '',
    date: '2024-01-01',
    duration: null,
    lector: '',
    price: null,
  })

  const [rating, setRating] = useState(0.0)
  const [richValue, setRichValue] = useState<Array<any>>()
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

  const handleChangeExpanded =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  const handleChangeExpandedStored =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedStored(isExpanded ? panel : false)
    }

  const handleOnDragOver = (e: any) => {
    e.preventDefault()
    setReDropBlock(false)
  }
  const handleOnDropDel = (e: any) => {
    const delField = JSON.parse(e.dataTransfer.getData('ID'))

    if (!delField.stored) {
      console.log(delField)
      setModules(
        modules.map((elem, index) => {
          if (delField.moduleI === index) {
            return {
              title: elem.title,
              lessons: elem.lessons.filter((lesson, lessonIndex) => {
                if (lessonIndex !== delField._i) {
                  return lesson
                }
                setAllModules([...allModules, lesson])
              }),
            }
          }
          return elem
        })
      )
    } else {
      setStoredModules(
        storedModules.filter((elem, index) => {
          if (delField._i !== index) {
            return elem
          }
          setAllModules([...allModules, elem])
        })
      )
    }
  }
  const handleOnDrop = (e: any, i: number) => {
    if (!reDropBlock) {
      if (!JSON.parse(e.dataTransfer.getData('ID')).stored) {
        setModules(
          modules.map((modulesElem, index) => {
            if (
              index == i &&
              modulesElem.lessons.filter(
                (reDropElem) => reDropElem.id === JSON.parse(e.dataTransfer.getData('ID')).id
              ).length === 0
            ) {
              setAllModules(
                allModules.filter(
                  (allModulesElem, modulesIndex) =>
                    modulesIndex != JSON.parse(e.dataTransfer.getData('ID'))._i
                )
              )
              return {
                title: modulesElem.title,
                lessons: [
                  ...modulesElem.lessons,
                  {
                    id: JSON.parse(e.dataTransfer.getData('ID')).id,
                    title: JSON.parse(e.dataTransfer.getData('ID')).title,
                    description: JSON.parse(e.dataTransfer.getData('ID')).description,
                    link: JSON.parse(e.dataTransfer.getData('ID')).link,
                    fields: JSON.parse(e.dataTransfer.getData('ID')).fields,
                  },
                ],
              }
            }
            return modulesElem
          })
        )
      } else {
        setModules(
          modules.map((modulesElem, index) => {
            if (index == i) {
              setStoredModules(
                storedModules.filter(
                  (allModulesElem, modulesIndex) =>
                    modulesIndex != JSON.parse(e.dataTransfer.getData('ID'))._i
                )
              )
              return {
                title: modulesElem.title,
                lessons: [
                  ...modulesElem.lessons,
                  {
                    id: JSON.parse(e.dataTransfer.getData('ID')).id,
                    title: JSON.parse(e.dataTransfer.getData('ID')).title,
                    description: JSON.parse(e.dataTransfer.getData('ID')).description,
                    link: JSON.parse(e.dataTransfer.getData('ID')).link,
                    fields: JSON.parse(e.dataTransfer.getData('ID')).fields,
                  },
                ],
              }
            }
            return modulesElem
          })
        )
      }
    }

    setReDropBlock(false)
  }
  const router = useRouter()
  const handleSubmit = async (e: any) => {
    // await uploadFileToS3(videoFile)
    const json = {
      ...form,
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
        const response = await axios.put(url + '?id=' + id, json)
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
      alert(error)
      console.error(error)
      return
    }
  }
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

        setCategorySelect(
          resultTag.getTags.filter((tag: any) => {
            if (resultData[0].data.category.indexOf(tag.id) != -1) {
              return tag
            }
          })
        )
        setStatus(resultData[0].data.status ? 'active' : 'draft')
        setId(resultData[0].id)
        setLanguage(resultData[0].data.language)
        setLevel(resultData[0].data.level)
        setRichValue(resultData[0].data.description)
        setType(resultData[0].data.type)
        setRating(resultData[0].data.rating)
        console.log(resultData[0])
        console.log(
          resultData[0].data.modules.map((module: any) => {
            console.log(module)
            return module
            // {
            //   title: module.title,
            //   lessons: module.lessons.map((lessonId: string) => {
            //     const found = allLessons.filter(
            //       (moduleElemFilter: Lesson) => moduleElemFilter.id == lessonId
            //     )
            //     return found[0]
            //   }),
            // }
          })
        )
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
        })
      } else {
        const draftedData = localStorage.getItem('CourseCreateForm')
        if (draftedData) {
          const parsedData = JSON.parse(draftedData)
          console.log(parsedData)
          setForm(parsedData.form)
          setRichValue(parsedData.description)
          setModules(parsedData.modules)
          setLanguage(parsedData.language)
          setLevel(parsedData.level)
          setType(parsedData.type)
          setStatus(parsedData.status)
          setRating(parsedData.rating)
          setCategorySelect(parsedData.categorySelect)
          const response = await fetch(urlLesson + 's', {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const result = await response.json()
          let allLessons = result.getLessons.map((lesson: any) => {
            return {
              id: lesson.id,
              title: lesson.data.title,
              description: lesson.data.description,
              link: lesson.data.link,
            }
          })

          parsedData.modules.map((module: any) => {
            module.lessons.map((lesson: Lesson) => {
              allLessons = allLessons.filter(
                (moduleElemFilter: Lesson) => moduleElemFilter.id != lesson.id
              )
            })
          })
          setStoredModules(allLessons)
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
  }
  function showDeleteAlert() {
    Swal.fire({
      title: 'Do you want to delete the course?',

      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#d8342c',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.delete(url + '?id=' + id)
        const resultResponse = response.data
        if (resultResponse) {
          Swal.fire('Deleted!', '', 'success')
          router.push('/admin')
        }
      }
    })
  }
  function showPushAction(url: string) {
    if (isEdited()) {
      Swal.fire({
        title: 'Do you want to save draft?',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: 'Save draft and leave',
        denyButtonText: 'Leave and delete',
      }).then(async (result) => {
        if (result.isConfirmed) {
          draftData()
          router.push(url)
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

  const [inputValue, setInputValue] = useState('')
  const showSwal = () => {
    withReactContent(Swal).fire({
      title: 'Create tag',
      input: 'text',
      inputValue,
      preConfirm: async () => {
        if (!Swal.getInput()?.value) {
          Swal.showValidationMessage('<i class="fa fa-info-circle"></i> Tag name is required')
        } else {
          const val = Swal.getInput()?.value || ''
          const response = await axios.post(urlTag + '?title=' + val)
          const resultResponse = response.data
          if (resultResponse) {
            Swal.fire('Created!', '', 'success')
            setAllCategorySelect([
              ...allCategorySelect,
              { name_of_tag: val, id: resultResponse.tagId },
            ])
          }
        }
      },
    })
  }
  const draftData = () => {
    localStorage.setItem(
      'CourseCreateForm',
      JSON.stringify({
        form: form,
        description: richValue,
        modules: modules,
        language: language,
        level: level,
        type: type,
        status: status,
        rating: rating,
        categorySelect: categorySelect,
      })
    )
  }

  function isEdited() {
    return (
      form.title != '' ||
      form.date != '2024-01-01' ||
      form.duration != undefined ||
      form.lector != '' ||
      form.price != undefined ||
      modules.length != 0 ||
      language != '' ||
      level != '' ||
      type != '' ||
      status != '' ||
      rating != 0.0
    )
  }
  useEffect(() => {
    getPageData()
    function handleOnBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault()
      return (e.returnValue = '')
    }
    // const handleBrowseAway = () => {
    //   if (!true) return
    //   if (window.confirm('You will lose the data')) return
    //   routerNext.events.emit('routeChangeError')
    //   throw 'routeChange aborted.'
    // }
    window.addEventListener('beforeunload', handleOnBeforeUnload, { capture: true })
    // routerNext.events.on('routeChangeStart', handleBrowseAway)
    return () => {
      window.removeEventListener('beforeunload', handleOnBeforeUnload, { capture: true })
      // routerNext.events.off('routeChangeStart', handleBrowseAway)
    }
  }, [])

  const [mediaValue, setMediaValue] = useState<{ type: string; content: File }>()
  const handlePreviewMediaChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setMediaValue({
        type: event.target.files[0].type.split('/')[0],
        content: event.target.files[0],
      })
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#fff', paddingTop: 8, paddingBottom: 8 }}>
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
                  minWidth: '33%',
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
                  minWidth: '34%',
                  width: '100%',
                  color: '#000',
                  '&.Mui-selected': {
                    color: '#000',
                    fontWeight: 'bold',
                  },
                }}
              />
              <Tab
                value={2}
                label={idLessonEdit ? 'Edit lesson' : 'Create lesson'}
                sx={{
                  minWidth: '33%',
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
                  margin='normal'
                  required
                  fullWidth
                  id='title'
                  type='text'
                  label='Title'
                  name='title'
                  autoFocus
                  onChange={(e) => {
                    setForm({ ...form, title: e.target.value })
                  }}
                  value={form.title}
                  sx={{ ...textFieldColors }}
                />
                <Box sx={{ color: '#000000' }}>
                  <MyEditor value={richValue} setValue={setRichValue} />
                </Box>

                <TextField
                  margin='normal'
                  required
                  fullWidth
                  id='lector'
                  type='text'
                  label='Lector'
                  name='lector'
                  onChange={(e) => {
                    setForm({ ...form, lector: e.target.value })
                  }}
                  value={form.lector}
                  sx={{ ...textFieldColors }}
                />
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  id='date'
                  type='date'
                  label='Date'
                  name='date'
                  onChange={(e) => {
                    setForm({ ...form, date: e.target.value })
                  }}
                  value={form.date || '2024-01-01'}
                  sx={{
                    ...textFieldColors,
                    marginTop: 3,
                  }}
                />

                <TextField
                  margin='normal'
                  required
                  fullWidth
                  id='duration'
                  type='number'
                  label='Duration'
                  name='duration'
                  InputProps={{
                    inputProps: { min: 1 },
                  }}
                  onChange={(e) => {
                    setForm({ ...form, duration: Number(e.target.value) })
                  }}
                  value={form.duration || ''}
                  sx={{ ...textFieldColors, marginTop: 3 }}
                />
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  id='price'
                  type='number'
                  label='Price'
                  name='price'
                  InputProps={{
                    inputProps: { min: 1 },
                  }}
                  onChange={(e) => {
                    setForm({ ...form, price: Number(e.target.value) })
                  }}
                  value={form.price || ''}
                  sx={{ ...textFieldColors }}
                />

                <Box sx={{ marginTop: 2 }}>
                  <InputLabel>Language</InputLabel>
                  <Select
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
                  <Select fullWidth id='levelSelect' value={level} onChange={handleChangeLevel}>
                    <MenuItem value={'Beginner'}>Beginner</MenuItem>
                    <MenuItem value={'Junior'}>Junior</MenuItem>
                    <MenuItem value={'Middle'}>Middle</MenuItem>
                    <MenuItem value={'Senior'}>Senior</MenuItem>
                  </Select>
                </Box>
                <Box sx={{ marginTop: 2 }}>
                  <InputLabel>Type</InputLabel>
                  <Select fullWidth id='typeSelect' value={type} onChange={handleChangeType}>
                    <MenuItem value={'self-education'}>Self education</MenuItem>
                    <MenuItem value={'with-lector'}>With lector</MenuItem>
                  </Select>
                </Box>
                <Box sx={{ marginTop: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select fullWidth id='statusSelect' value={status} onChange={handleChangeStatus}>
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
                    }}
                    value={rating || 0}
                    sx={{
                      marginLeft: 4,
                      paddingTop: 1,
                      paddingBottom: 1,
                    }}
                  />
                </Box>
                <Button onClick={showSwal}>Create Tag</Button>
                <Autocomplete
                  disablePortal
                  multiple
                  id='combo-box-demo'
                  value={categorySelect}
                  onChange={(event, value: any) => setCategorySelect(value)}
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
                              categorySelect.filter((category) => category.id !== deletingOption.id)
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
                <Button fullWidth variant='contained' component='label' sx={{ mt: 1 }}>
                  <input
                    type='file'
                    accept='video/mp4 image/png, image/jpeg'
                    onChange={handlePreviewMediaChange}
                  />
                </Button>

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
                        localStorage.removeItem('CourseCreateForm')
                        setForm({
                          title: '',
                          date: '2024-01-01',
                          duration: null,
                          lector: '',
                          price: null,
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
                    onClick={handleSubmit}
                  >
                    {id ? 'Edit Course' : 'Add Course'}
                  </Button>
                </Box>

                {id && (
                  <Button
                    variant='contained'
                    fullWidth
                    color='error'
                    sx={{
                      marginTop: 2,
                      fontWeight: 'bold',
                    }}
                    onClick={showDeleteAlert}
                  >
                    Delete
                  </Button>
                )}
              </Box>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Box sx={{ display: 'flex', width: '100%' }}>
                <Box sx={{ width: '30%', boxShadow: 2, minHeight: '20rem' }}>
                  <Button
                    fullWidth
                    variant='contained'
                    onClick={(e) => {
                      setModules([...modules, { title: '', lessons: [] }])
                    }}
                    sx={{
                      fontWeight: 'bold',
                      borderRadius: '0px',
                    }}
                  >
                    Add Module
                  </Button>

                  {modules.map((element, i) => {
                    return (
                      <Box
                        onDragOver={handleOnDragOver}
                        onDrop={(e) => handleOnDrop(e, i)}
                        key={'mainModuleContainer_' + i}
                        sx={{}}
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
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <TextField
                                margin='normal'
                                required
                                fullWidth
                                id={'module' + i}
                                type='text'
                                label='Module'
                                name={'module' + i}
                                autoFocus
                                onChange={(e) => {
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
                              {/* <Typography
                                  sx={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  Module {' ' + (i + 1)}
                                </Typography> */}
                            </div>
                          </AccordionSummary>

                          <AccordionDetails style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                            {element.lessons.map((lesson, index) => {
                              console.log()
                              return (
                                <Box
                                  key={'mainModuleContainer_' + i}
                                  sx={{
                                    color: '#0f0e16',
                                    width: '100%',
                                    background: '#cccccc',
                                    marginTop: 2,
                                    padding: '16px',
                                    boxShadow: 2,
                                  }}
                                  onDragStart={(e) => {
                                    setReDropBlock(true)
                                    e.dataTransfer.setData(
                                      'ID',
                                      JSON.stringify({
                                        ...element,
                                        _i: index,
                                        moduleI: i,
                                      })
                                    )
                                  }}
                                  draggable
                                >
                                  <Box sx={{ fontWeight: 'bold' }}>{lesson.title ?? ''}</Box>
                                  <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                    <IconButton
                                      onClick={(e) => {
                                        setPreview(lesson.id == preview ? '-1' : lesson.id ?? '-1')
                                      }}
                                    >
                                      <PreviewIcon />
                                    </IconButton>
                                    <IconButton
                                      onClick={(e) => {
                                        setIdLessonEdit(lesson.id ?? '-1')
                                        setLessonForm({
                                          title: lesson.title,
                                          link: lesson.link,
                                        })
                                        setRichValueLesson(lesson.description)
                                        setValue(2)
                                      }}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton
                                      onClick={async (e) => {
                                        const response = await axios.delete(
                                          urlLesson + '?id=' + lesson.id
                                        )
                                        const resultResponse = response.data
                                        if (resultResponse) {
                                          setAllModules(
                                            allModules.filter((lesson) => lesson.id != lesson.id)
                                          )
                                        }
                                      }}
                                    >
                                      <DeleteIcon color='error' />
                                    </IconButton>
                                  </Box>
                                  {preview == lesson.id && (
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
                                </Box>
                                // <div
                                //   key={'lessonElement_' + i + '_' + index}
                                //   style={{
                                //     display: 'flex',
                                //     marginTop: '8px',
                                //     background: '#cccccc',
                                //   }}
                                // >
                                //   <Box
                                //     key={'mainModuleContainer_' + i}
                                //     sx={{
                                //       width: '15rem',
                                //       height: '10rem',
                                //       padding: '16px',
                                //     }}
                                //     onDragStart={(e) => {
                                //       setReDropBlock(true)
                                //       e.dataTransfer.setData(
                                //         'ID',
                                //         JSON.stringify({
                                //           ...lesson,
                                //           _i: index,
                                //           moduleI: i,
                                //         })
                                //       )
                                //     }}
                                //     draggable
                                //   >
                                //     <Box sx={{ fontWeight: 'bold' }}>{lesson.title}</Box>
                                //     <Box
                                //       sx={{
                                //         paddingLeft: '16px',
                                //         maxHeight: '50px',
                                //         overflow: 'auto',
                                //       }}
                                //     >
                                //       <SlateView value={lesson.description} />
                                //     </Box>
                                //     <Box
                                //       sx={{
                                //         overflow: 'auto',
                                //         scrollbarWidth: 'none',
                                //         marginTop: 2,
                                //       }}
                                //     >
                                //       {lesson.link}
                                //     </Box>
                                //   </Box>
                                // </div>
                              )
                            })}
                            <Button
                              fullWidth
                              variant='contained'
                              color='error'
                              sx={{ marginTop: 2 }}
                              onClick={(e) => {
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
                              Delete
                            </Button>
                          </AccordionDetails>
                        </Accordion>
                      </Box>
                    )
                  })}
                </Box>
                <Box
                  onDragOver={handleOnDragOver}
                  onDrop={handleOnDropDel}
                  sx={{
                    width: '70%',
                    gap: 2,
                    justifyContent: 'center',
                    paddingLeft: 2,
                    paddingRight: 2,
                    maxHeight: '30rem',
                    overflow: 'auto',
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Accordion
                      expanded={expandedStored === 'panelStored'}
                      onChange={handleChangeExpandedStored('panelStored')}
                      sx={{}}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          boxShadow: 2,
                        }}
                      >
                        Stored lessons
                      </AccordionSummary>

                      <AccordionDetails
                        style={{
                          paddingLeft: '8px',
                          paddingRight: '8px',
                          paddingBottom: '8px',
                        }}
                      >
                        <Box sx={{ maxHeight: '10rem', overflowY: 'auto' }}>
                          {storedModules.map((element, i) => {
                            return (
                              <Grid
                                item
                                key={'mainModuleContainer_' + i}
                                sx={{
                                  color: '#0f0e16',
                                  width: '100%',
                                  background: '#cccccc',
                                  padding: '16px',
                                  marginBottom: 1,
                                }}
                                onDragStart={(e) => {
                                  setReDropBlock(true)
                                  e.dataTransfer.setData(
                                    'ID',
                                    JSON.stringify({
                                      ...element,
                                      _i: i,
                                      stored: true,
                                    })
                                  )
                                }}
                                draggable
                              >
                                <Box sx={{ fontWeight: 'bold' }}>{element.title}</Box>
                              </Grid>
                            )
                          })}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                  {allModules.map((element, i) => {
                    return (
                      <Box
                        key={'mainModuleContainer_' + i}
                        sx={{
                          color: '#0f0e16',
                          width: '100%',
                          background: '#cccccc',
                          marginTop: 2,
                          padding: '16px',
                          boxShadow: 2,
                        }}
                        onDragStart={(e) => {
                          setReDropBlock(true)
                          e.dataTransfer.setData(
                            'ID',
                            JSON.stringify({
                              ...element,
                              _i: i,
                            })
                          )
                        }}
                        draggable
                      >
                        <Box sx={{ fontWeight: 'bold' }}>{element.title}</Box>

                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                          <IconButton
                            onClick={(e) => {
                              setPreview(element.id == preview ? '-1' : element.id ?? '-1')
                            }}
                          >
                            <PreviewIcon />
                          </IconButton>
                          <IconButton
                            onClick={(e) => {
                              setIdLessonEdit(element.id ?? '-1')
                              setLessonForm({
                                title: element.title,
                                link: element.link,
                              })
                              setRichValueLesson(element.description)
                              setValue(2)
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={async (e) => {
                              const response = await axios.delete(urlLesson + '?id=' + element.id)
                              const resultResponse = response.data
                              if (resultResponse) {
                                setAllModules(
                                  allModules.filter((lesson) => lesson.id != element.id)
                                )
                              }
                            }}
                          >
                            <DeleteIcon color='error' />
                          </IconButton>
                        </Box>
                        {preview == element.id && (
                          <>
                            <Box
                              sx={{
                                paddingLeft: '16px',
                                maxHeight: '10rem',
                                overflow: 'auto',
                                scrollbarWidth: 'none',
                              }}
                            >
                              <SlateView value={element.description} />
                            </Box>
                            <Box sx={{ overflow: 'auto', scrollbarWidth: 'none', marginTop: 2 }}>
                              <ExampleYouTube url={element.link.split('?v=')[1]} />
                            </Box>
                          </>
                        )}
                      </Box>
                    )
                  })}
                </Box>
              </Box>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <Box sx={{ color: '#fff' }}>
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  id='lessonTitle'
                  type='title'
                  label='Title'
                  name='title'
                  autoFocus
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
                    try {
                      if (idLessonEdit) {
                        const response = await axios.put(urlLesson + '?id=' + idLessonEdit, {
                          title: lessonForm.title,
                          description: richValueLesson,
                          link: lessonForm.link,
                        })
                        const resultResponse = response.data
                        if (resultResponse) {
                          setAllModules(
                            allModules.map((module: Lesson) => {
                              if (module.id == idLessonEdit) {
                                console.log({
                                  id: idLessonEdit,
                                  title: lessonForm.title,
                                  description: richValueLesson,
                                  link: lessonForm.link,
                                })
                                return {
                                  id: idLessonEdit,
                                  title: lessonForm.title,
                                  description: richValueLesson,
                                  link: lessonForm.link,
                                }
                              }
                              return module
                            })
                          )
                          setLessonForm({
                            title: '',
                            link: '',
                          })
                          setValue(1)
                        }
                      } else {
                        const response = await axios.post(urlLesson, {
                          title: lessonForm.title,
                          description: richValueLesson,
                          link: lessonForm.link,
                        })
                        const resultResponse = response.data
                        if (resultResponse) {
                          console.log(resultResponse)
                          setAllModules([
                            ...allModules,
                            {
                              ...lessonForm,
                              description: richValueLesson,
                              id: resultResponse.lessonId,
                            },
                          ])
                          setLessonForm({
                            title: '',
                            link: '',
                          })
                          setValue(1)
                        }
                      }
                    } catch (error) {
                      alert(error)
                      console.error(error)
                      return
                    }
                  }}
                >
                  {idLessonEdit ? 'Edit' : 'Create'}
                </Button>
              </Box>
            </CustomTabPanel>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default CourseCreate
