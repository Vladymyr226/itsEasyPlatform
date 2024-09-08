'use client'
import skillsImage from '../../../src/assets/skillsImage.png'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Comments from '@/components/Comments/Comments'
import CourseControlls from '@/components/CourseControlls/CourseControlls'
import CourseLessonMaterials from '@/components/CourseMaterials/CourseLessonMaterials'
import CourseSidebar from '@/components/CourseSidebar/CourseSidebar'
import PlayButton from '@/components/PlayButton/PlayButton'
import { PauseButton } from '@/components/PlayButton/PlayButton'

import PopularCourses from '@/components/PopularCourses/PopularCourses'
import Rating from '@mui/material/Rating'
import SkillsList from '@/components/SkillsList/SkillsList'
import ViewsCount from '@/components/ViewsCount/ViewsCount'
import Layout from '@/components/Layout/Layout'
import '../../app/globals.css'
import SlateView from '@/components/SlateEditor/View'
import { Box, Button, TextField, IconButton } from '@mui/material'
import YouTube, { YouTubeProps } from 'react-youtube'

import { YouTubeProp } from '@/utils/interfaces'
import { useRouter } from 'next/navigation'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Checkbox,
} from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import axios from 'axios'
import Swal from 'sweetalert2'
import { getLocale } from '@/utils/getLocale'
import parse from 'html-react-parser'
import SendIcon from '@mui/icons-material/Send'
import s from './lesson.module.css'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import ConfettiButton from '@/components/ConfettiButton/ConfettiButton'
import courseShadow from '../../src/assets/shadows/courseHoverShadow.png'
import { styled } from '@mui/material/styles'

interface CourseData {
  title: string
  language: string
  level: string
  date: string
  type: string
  description: any
  rating: number
  duration: number
  lector: string
  modules: any
  price: number
  mediaValue: any
}
interface Course {
  id: string
  data: CourseData
  is_active: boolean
}
interface Module {
  title: string
  lessons: Array<Lesson>
}
const url = `${process.env.NEXT_BACK_HOST_API}/cabinet/course`
const urlLesson = `${process.env.NEXT_BACK_HOST_API}/cabinet/lesson`
const urlUser = `${process.env.NEXT_BACK_HOST_API}/auth/user`
const urlFeedback = `${process.env.NEXT_BACK_HOST_API}/cabinet/feedback`
const urlChat = `${process.env.NEXT_BACK_HOST_API}/cabinet/chat`

interface LessonData {
  title: string
  link?: string
  description?: any
  image?: any
  questions?: any
  fields?: any
}
interface Lesson {
  id: string
  data: LessonData
  type: string
}

// ;<Checkbox
//   defaultChecked={answerForm[indx][optionIndx]}
//   disabled={checkAnswers}
//   onChange={(e) => {
//     let tmpArr: any = answerForm
//     tmpArr[indx][optionIndx] = e.target.checked
//     setAnswerForm(tmpArr)
//   }}
//   inputProps={{ 'aria-label': 'controlled' }}
//   style={{}}
//   sx={{
//     backgroundColor: '#c7c6c6',
//     background:
//       checkAnswers && answerForm && (answerForm[indx][optionIndx] || option.correct)
//         ? answerForm[indx][optionIndx] == option.correct
//           ? '#008000'
//           : '#FF0000'
//         : null,
//     padding: 0.5,
//     marginTop: 0.5,
//     color: '#be89f5',
//     '&:hover': {
//       backgroundColor: '#171622',
//       borderRadius: 0,
//       padding: 0,
//       margin: 0.5,
//       marginTop: 1,
//     },
//     '&.Mui-checked': {
//       color: '#c7c6c6',
//     },
//   }}
// />

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: 3,
  marginTop: 3,
  width: 18,
  height: 18,
  backgroundColor: '#312e25',
  border: '2px solid #c58efe',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    border: '2px solid #ffec3e',
  },
}))

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#ffec3e',
  border: '2px solid #ffec3e',
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
    " fill='%23312e25' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z'/%3E%3C/svg%3E\")",
  '&::before': {
    display: 'block',
    content: '""',
  },
  // Меняем только цвет стрелки при наведении, если чекбокс нажат
  'input:checked:hover ~ &': {
    backgroundColor: '#c58efe',
  },
})
const BpTrueIcon = styled(BpIcon)({
  backgroundColor: '#008000',
  border: '2px solid #008000',
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
    " fill='%23312e25' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z'/%3E%3C/svg%3E\")",
  '&::before': {
    display: 'block',
    content: '""',
  },
  // Меняем только цвет стрелки при наведении, если чекбокс нажат
  'input:checked:hover ~ &': {
    backgroundColor: '#c58efe',
  },
})
const BpFalseIcon = styled(BpIcon)({
  backgroundColor: '#FF0000',
  border: '2px solid #FF0000',
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
    " fill='%23312e25' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z'/%3E%3C/svg%3E\")",
  '&::before': {
    display: 'block',
    content: '""',
  },
  // Меняем только цвет стрелки при наведении, если чекбокс нажат
  'input:checked:hover ~ &': {
    backgroundColor: '#c58efe',
  },
})

// Inspired by blueprintjs
function BpCheckbox(props: any) {
  return (
    <Checkbox
      sx={{
        '&:hover': { bgcolor: 'transparent' },
      }}
      disableRipple
      color='default'
      checkedIcon={
        props.correct == -1 ? (
          <BpCheckedIcon />
        ) : props.correct == 1 ? (
          <BpTrueIcon />
        ) : (
          <BpFalseIcon />
        )
      }
      icon={
        props.correct == -1 ? <BpIcon /> : props.correct == 1 ? <BpTrueIcon /> : <BpFalseIcon />
      }
      inputProps={{ 'aria-label': 'Checkbox demo' }}
      {...props}
    />
  )
}

// Custom styled components for radio buttons
const BpIconRadio = styled('span')(({ theme }) => ({
  borderRadius: '50%', // Make it round for radio
  marginTop: 3,
  width: 18,
  height: 18,
  backgroundColor: '#312e25',
  border: '2px solid #c58efe',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    border: '2px solid #ffec3e',
  },
}))
const BpIconRadioTrue = styled('span')(({ theme }) => ({
  borderRadius: '50%', // Make it round for radio
  marginTop: 3,
  width: 18,
  height: 18,
  backgroundColor: '#008000',
  border: '2px solid #008000',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    border: '2px solid #008000',
  },
}))
const BpIconRadioFalse = styled('span')(({ theme }) => ({
  borderRadius: '50%', // Make it round for radio
  marginTop: 3,
  width: 18,
  height: 18,
  backgroundColor: '#FF0000',
  border: '2px solid #FF0000',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    border: '2px solid #FF0000',
  },
}))

const BpCheckedIconRadio = styled(BpIcon)({
  borderRadius: '50%', // Make it round for radio
  backgroundColor: '#ffec3e',
  border: '2px solid #ffec3e',
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ccircle" +
    " fill='%23312e25' cx='8' cy='8' r='5'/%3E%3C/svg%3E\")", // Changed path to circle for radio
  '&::before': {
    display: 'block',
    content: '""',
  },
  'input:checked:hover ~ &': {
    backgroundColor: '#ffec3e',
  },
})
const BpCheckedIconRadioTrue = styled(BpIcon)({
  borderRadius: '50%', // Make it round for radio
  backgroundColor: '#008000',
  border: '2px solid #008000',
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ccircle" +
    " fill='%23312e25' cx='8' cy='8' r='5'/%3E%3C/svg%3E\")", // Changed path to circle for radio
  '&::before': {
    display: 'block',
    content: '""',
  },
  'input:checked:hover ~ &': {
    backgroundColor: '#008000',
  },
})
const BpCheckedIconRadioFalse = styled(BpIcon)({
  borderRadius: '50%', // Make it round for radio
  backgroundColor: '#FF0000',
  border: '2px solid #FF0000',
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ccircle" +
    " fill='%23312e25' cx='8' cy='8' r='5'/%3E%3C/svg%3E\")", // Changed path to circle for radio
  '&::before': {
    display: 'block',
    content: '""',
  },
  'input:checked:hover ~ &': {
    backgroundColor: '#FF0000',
  },
})

// Custom Radio component
function BpRadioButton(props: any) {
  return (
    <Box
      className={s.optionWrapper}
      sx={{
        position: 'relative',
        zIndex: 1,
        // answerForm[indx][optionIndx]
      }}
    >
      <Radio
        sx={{
          '&:hover': { bgcolor: 'transparent' },
        }}
        disableRipple
        color='default'
        checkedIcon={
          props.correct == -1 ? (
            <BpCheckedIconRadio />
          ) : props.correct == 1 ? (
            <BpCheckedIconRadioTrue />
          ) : (
            <BpCheckedIconRadioFalse />
          )
        }
        icon={
          props.correct == -1 ? (
            <BpIconRadio />
          ) : props.correct == 1 ? (
            <BpIconRadioTrue />
          ) : (
            <BpIconRadioFalse />
          )
        }
        inputProps={{ 'aria-label': 'Radio demo' }}
        {...props}
      />
      <Image
        className={s.shadow}
        src={courseShadow}
        alt='shadow'
        style={props.correct == -1 ? (props.dispayChecked ? { opacity: 1 } : {}) : {}}
      />
    </Box>
  )
}

const LessonDetails = () => {
  const [width, setWidth] = useState(0)
  const [data, setData] = useState<Lesson>()
  const [moduleLessons, setModuleLessons] = useState<Array<string>>()
  const [modules, setModules] = useState<Array<Module>>()

  const [id, setId] = useState<number>()
  const videoRef = useRef(null)
  const [userData, setUserData] = useState<any>()
  const [selectedCourse, setSelectedCourse] = useState<any>()

  const [chatDataId, setChatDataId] = useState<any>()
  const [chatData, setChatData] = useState<any>()
  const [userId, setUserId] = useState<any>()
  const [lessonContext, setLessonContext] = useState<any>()
  const [questionLimit, setQuestionLimit] = useState<number>()
  async function getPageData() {
    if (typeof window !== 'undefined') {
      setSelectedCourse(localStorage.getItem('SelectedCourse'))
      const fullUrl = window.location.href
      const userId = localStorage.getItem('UserID')
      setUserId(userId)
      const responseUser = await fetch(urlUser + '/' + userId, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const resultUser = await responseUser.json()

      setUserData(resultUser)
      if (fullUrl.split('id=')[1]) {
        setId(Number(fullUrl.split('id=')[1]))
        getPageData2(Number(fullUrl.split('id=')[1]), resultUser.id)
        const response = await fetch(urlLesson + '/' + fullUrl.split('id=')[1], {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const result = await response.json()
        if (result.type === 'quiz') {
          setAnswerForm(
            result.data.questions.map((question: any) => {
              return question.options.map((option: any) => {
                return false
              })
            })
          )
          if (
            resultUser?.comleted_lessons_id &&
            resultUser?.comleted_lessons_id.indexOf(id) == -1
          ) {
            setCompleteButtonState('ready')
          }
        }
        if (result.type == 'default') {
          const slateFields = result.data.fields.filter((field: any) => field.type == 'slate')
          const value = slateFields
            .map((field: any) => {
              return field.value
                .map((line: any) => {
                  return line.children
                    .map((finalLine: any) => {
                      return finalLine.text
                    })
                    .toString()
                })
                .toString()
            })
            .toString()
          setLessonContext(value)
        }
        if (result.type == 'practice') {
          const slateFields = result.data.fields.filter((field: any) => field.type == 'slate')
          const value = slateFields
            .map((field: any) => {
              return field.value
                .map((line: any) => {
                  return line.children
                    .map((finalLine: any) => {
                      return finalLine.text
                    })
                    .toString()
                })
                .toString()
            })
            .toString()
          setLessonContext(value)
        }

        setData(result)
        if (localStorage.getItem('SelectedCourse') && localStorage.getItem('SelectedModuleIndex')) {
          const responseCourse = await fetch(url + '/' + localStorage.getItem('SelectedCourse'), {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const resultCourse = await responseCourse.json()
          setQuestionLimit(resultCourse.data.questionLimit)
          setModuleLessons(
            resultCourse.data.modules[Number(localStorage.getItem('SelectedModuleIndex'))].lessons
          )
          const modules = await Promise.all(
            resultCourse.data.modules.map(async (module: any) => {
              const lessons = await Promise.all(
                module.lessons.map(async (lessonId: string) => {
                  const responseLesson = await fetch(urlLesson + '/' + lessonId, {
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  })
                  const resultLesson = await responseLesson.json()
                  return { id: resultLesson.id, data: resultLesson.data, type: resultLesson.type }
                })
              )

              return {
                title: module.title,
                lessons: lessons,
              }
            })
          )
          setModules(modules)
        }
      } else {
      }
    }
  }
  const containerRef = useRef<any>()
  async function getPageData2(id2: any, userID2: any) {
    if (userID2) {
      const response = await fetch(urlChat + 's/', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      const chats = result.getChats.filter(
        (chat: any) => chat.lesson_id == id2 && chat.user_id == userID2
      )
      if (chats.length > 0) {
        setChatData(chats[0])
        setChatDataId(chats[0].id)
        setTimeout(() => {
          if (containerRef.current) {
            const lastItem = containerRef.current.lastElementChild
            if (lastItem) {
              lastItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            }
          }
        }, 1000)
      } else {
        const responsePost = await axios.post(urlChat + '?lessonId=' + id2 + '&userId=' + userID2, {
          messages: [],
        })
        const resultResponse2 = responsePost.data
        if (resultResponse2) {
          setChatData({
            id: resultResponse2.chatId,
            lesson_id: id2,
            user_id: userID2,
            data: { messages: [] },
          })
          setChatDataId(resultResponse2.chatId)
        }
      }
    }
  }
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
      getPageData()
      setCompleteButtonState('ready')
    }
  }, [])
  useEffect(() => {
    if (id && modules) {
      if (gptField.current) {
        gptField.current.value = ''
      }

      setCompleteButtonState('ready')
      setCheckAnswers(false)
      getPageData()
      getPageData2(id, userData.id)
    }
  }, [id])

  const imgRef = useRef(null)
  const opts: YouTubeProps['opts'] = {
    height: '390',
    width: '100%',
    playerVars: {
      controls: 0,
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  }
  function ExampleYouTube(props: YouTubeProp) {
    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
      // access to player in all event handlers via event.target
    }

    const opts: YouTubeProps['opts'] = {
      height: '500',
      width: '100%',
      playerVars: {
        rel: 0,
        iv_load_policy: 0,
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
      },
    }

    return <YouTube videoId={props.url} opts={opts} onReady={onPlayerReady} />
  }
  function getLessonIndx() {
    return moduleLessons?.indexOf(data ? data.id : '-1') ?? -1
  }
  const router = useRouter()
  const [completedLessonTrigger, setCompletedLessonTrigger] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [answerForm, setAnswerForm] = useState<any>()
  const [checkAnswers, setCheckAnswers] = useState(false)
  const [resetAnswersBtn, setResetAnswersBtn] = useState(false)
  const [clearCheckBoxes, setClearCheckBoxes] = useState(false)
  const [completeButtonState, setCompleteButtonState] = useState('loading')

  const t = getLocale()

  const [dataGpt, setDataGpt] = useState(false)

  const handleGPT = async () => {
    const url = 'https://api.openai.com/v1/chat/completions'
    const apiKey =
      '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' // Replace with your actual API key

    try {
      const response = await axios.post(
        url,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are an assistant for a web application that offers IT courses and should provide brief and accurate answers only to questions on IT topics' +
                  (lessonContext
                    ? '. Here is the context of the lesson (' + lessonContext + ')'
                    : '') +
                  '. The answer should be given in the language in which the question is written. Here is the message: ' +
                  gptField.current.value ?? '',
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      // Обновляем состояние dataGpt с полученными данными из ответа

      const responseChat = await axios.put(
        urlChat + '?lessonId=' + id + '&userId=' + userData.id + '&chatId=' + chatDataId,
        {
          messages: chatData.data.messages
            ? [
                ...chatData.data.messages,
                { value: gptField.current.value ?? '', from: 'user', time: new Date() },
                { value: response.data.choices[0].message.content, from: 'chat', time: new Date() },
              ]
            : [
                { value: gptField.current.value ?? '', from: 'user', time: new Date() },
                { value: response.data.choices[0].message.content, from: 'chat', time: new Date() },
              ],
        }
      )
      if (response.status == 200) {
        setChatData({
          ...chatData,
          data: {
            messages: [
              ...chatData.data.messages,
              { value: gptField.current.value ?? '', from: 'user', time: new Date() },
              { value: response.data.choices[0].message.content, from: 'chat', time: new Date() },
            ],
          },
        })
        setTimeout(() => {
          if (containerRef.current) {
            const lastItem = containerRef.current.lastElementChild
            if (lastItem) {
              lastItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            }
          }
        }, 1)
      }
      gptField.current.value = ''
      setDataGpt(false)
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error)
    }
  }

  const gptField = useRef<any>()
  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',

          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: '50px', md: null },
        }}
      >
        <Box
          sx={{
            width: '100%',
            minHeight: { xs: null, md: '140vb' },
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
          }}
        >
          {data ? (
            <Box
              sx={{
                minHeight: { xs: null, md: '140vb' },
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {data.type == 'default' && (
                <Box sx={{ width: '100%' }}>
                  {data.data.image ? (
                    <>
                      <img src={data.data.image}></img>
                      <br />
                    </>
                  ) : (
                    <></>
                  )}
                </Box>
              )}
              {data.type != 'quiz' && (
                <h1 style={{ textAlign: 'left', color: '#ffec3e', marginBottom: '20px' }}>
                  <b>{data && data.data.title}</b>
                </h1>
              )}
              <Box>
                {/* {data.type == 'default' && (
                <Box sx={{ overflowY: 'auto', scrollbarWidth: 'none' }}>
                  <Box
                    sx={{ width: '100%', height: 'max-content', color: '#c7c6c6', padding: '15px' }}
                  >
                    <SlateView value={data && data.data.description} />
                  </Box>
                </Box>
              )} */}
                {data.type == 'default' && (
                  <Box>
                    {data.data.fields &&
                      data.data.fields.map((field: any, indx: number) => {
                        return (
                          <Box key={'Field' + indx}>
                            {field.type == 'slate' && (
                              <Box
                                sx={{
                                  width: '100%',
                                  height: 'max-content',
                                  color: '#c7c6c6',
                                  padding: '15px',
                                }}
                              >
                                <SlateView
                                  value={
                                    field
                                      ? field.value
                                      : [
                                          {
                                            type: 'paragaph',
                                            children: [{ text: '' }],
                                          },
                                        ]
                                  }
                                />
                              </Box>
                            )}
                            {field.type == 'code' && (
                              // <Box
                              //   sx={{
                              //     width: '100%',
                              //     height: '900px',
                              //     color: '#c7c6c6',
                              //     padding: '15px',
                              //   }}
                              // >

                              // </Box>
                              <Box
                                sx={{
                                  width: '100%',
                                  color: '#c7c6c6',
                                  padding: '15px',
                                }}
                              >
                                <iframe
                                  src={field ? field.value : 'https://codesandbox.io/'}
                                  style={{
                                    width: '100%',
                                    height: '900px',
                                    border: '0',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                  }}
                                  title='React'
                                  allowFullScreen
                                  allow='accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking'
                                  sandbox='allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts'
                                ></iframe>
                              </Box>
                            )}
                            {field.type == 'codeHtml' && (
                              <Box
                                sx={{
                                  width: '100%',
                                  height: 'max-content',
                                  color: '#c7c6c6',
                                  padding: '15px',
                                }}
                              >
                                {parse(field ? field.value : '<div></div>')}
                              </Box>
                            )}
                            {field.type == 'youTube' && (
                              <Box
                                sx={{
                                  width: '100%',
                                  height: 'max-content',
                                  color: '#c7c6c6',
                                  padding: '15px',
                                }}
                              >
                                <ExampleYouTube url={field.value.split('?v=')[1]} />
                              </Box>
                            )}
                          </Box>
                        )
                      })}
                  </Box>
                )}
                {data.type == 'quiz' && (
                  <Box
                    sx={{
                      background: '#2c223b',
                      color: '#c7c6c6',
                      borderRadius: '20px',
                      padding: '20px',
                    }}
                  >
                    <h1 style={{ textAlign: 'left', marginTop: '10px' }}>
                      <b>{data && data.data.title}</b>
                    </h1>
                    {data.data.questions.map((question: any, indx: number) => {
                      return (
                        <Box key={'Question_' + indx}>
                          <h2 style={{ textAlign: 'left', color: '#c7c6c6', marginBottom: '20px' }}>
                            <b>{indx + 1 + '. ' + question.title}</b>
                          </h2>
                          {question.options.filter((option: any) => option.correct).length > 1 ? (
                            question.options.map((option: any, optionIndx: number) => {
                              return (
                                <Box
                                  key={'QuestionOption_' + indx}
                                  sx={{ display: 'flex', color: '#c7c6c6', marginTop: 1 }}
                                >
                                  {!clearCheckBoxes && (
                                    <Box
                                      className={s.optionWrapper}
                                      sx={{
                                        position: 'relative',
                                        zIndex: 1,
                                        // answerForm[indx][optionIndx]
                                      }}
                                    >
                                      <BpCheckbox
                                        defaultChecked={answerForm[indx][optionIndx]}
                                        disabled={checkAnswers}
                                        onChange={(e: any) => {
                                          let tmpArr: any = answerForm
                                          tmpArr[indx][optionIndx] = e.target.checked
                                          setAnswerForm(tmpArr)
                                          setRefreshTrigger(!refreshTrigger)
                                        }}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                        correct={
                                          checkAnswers &&
                                          answerForm &&
                                          (answerForm[indx][optionIndx] || option.correct)
                                            ? answerForm[indx][optionIndx] == option.correct
                                              ? 1
                                              : 0
                                            : -1
                                        }
                                      />
                                      <Image
                                        className={s.shadow}
                                        src={courseShadow}
                                        alt='shadow'
                                        style={
                                          checkAnswers &&
                                          answerForm &&
                                          (answerForm[indx][optionIndx] || option.correct)
                                            ? {}
                                            : answerForm[indx][optionIndx]
                                            ? { opacity: 1 }
                                            : {}
                                        }
                                      />
                                    </Box>
                                  )}
                                  <b style={{ marginTop: '10px', marginLeft: '10px' }}>
                                    {option.title}
                                  </b>
                                </Box>
                              )
                            })
                          ) : (
                            <Box
                              key={'QuestionOption_' + indx}
                              sx={{
                                display: 'flex',
                                color: '#c7c6c6',
                                marginTop: 1,
                                paddingLeft: 1.5,
                              }}
                            >
                              {!clearCheckBoxes && (
                                <RadioGroup
                                  aria-labelledby='demo-radio-buttons-group-label'
                                  name='radio-buttons-group'
                                >
                                  {question.options.map((option: any, optionIndx: number) => {
                                    return (
                                      <>
                                        <FormControlLabel
                                          key={'QuestionOption_' + indx + '_' + option.title}
                                          value={option.title}
                                          sx={{
                                            color: '#c7c6c6',
                                            '& .MuiFormControlLabel-label.Mui-disabled': {
                                              color: '#c7c6c6 !important',
                                            },
                                          }}
                                          control={
                                            <BpRadioButton
                                              onClick={(e: any) => {
                                                let tmpArr: any = answerForm
                                                tmpArr[indx] = tmpArr[indx].map(() => {
                                                  return false
                                                })

                                                tmpArr[indx][optionIndx] = true
                                                setAnswerForm(tmpArr)
                                                setRefreshTrigger(!refreshTrigger)
                                              }}
                                              dispayChecked={answerForm[indx][optionIndx]}
                                              correct={
                                                checkAnswers &&
                                                answerForm &&
                                                (answerForm[indx][optionIndx] || option.correct)
                                                  ? answerForm[indx][optionIndx] == option.correct
                                                    ? 1
                                                    : 0
                                                  : -1
                                              }
                                            />

                                            //   sx={{
                                            //     background:
                                            //       checkAnswers &&
                                            //       answerForm &&
                                            //       (answerForm[indx][optionIndx] || option.correct)
                                            //         ? answerForm[indx][optionIndx] == option.correct
                                            //           ? '#008000'
                                            //           : '#FF0000'
                                            //         : null,
                                            //     color: '#c7c6c6',
                                            //     '&.Mui-disabled': { color: '#c7c6c6' },
                                            //     '&.Mui-checked': { color: '#c7c6c6' },
                                            //   }}
                                            // />
                                          }
                                          label={option.title}
                                        />
                                      </>
                                    )
                                  })}
                                </RadioGroup>
                              )}
                            </Box>
                          )}
                        </Box>
                      )
                    })}
                  </Box>
                )}
                {data.type == 'practice' && (
                  <Box>
                    {data.data.fields &&
                      data.data.fields.map((field: any, indx: number) => {
                        return (
                          <Box key={'Field' + indx}>
                            {field.type == 'slate' && (
                              <Box
                                sx={{
                                  width: '100%',
                                  height: 'max-content',
                                  color: '#c7c6c6',
                                  padding: '15px',
                                }}
                              >
                                <SlateView
                                  value={
                                    field
                                      ? field.value
                                      : [
                                          {
                                            type: 'paragaph',
                                            children: [{ text: '' }],
                                          },
                                        ]
                                  }
                                />
                              </Box>
                            )}
                            {field.type == 'code' && (
                              <Box
                                sx={{
                                  width: '100%',
                                  height: 'max-content',
                                  color: '#c7c6c6',
                                  padding: '15px',
                                }}
                              >
                                <iframe
                                  src={field ? field.value : 'https://codesandbox.io/'}
                                  style={{
                                    width: '100%',
                                    height: '90vh',
                                    border: '0',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                  }}
                                  title='React'
                                  allowFullScreen
                                  allow='accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking'
                                  sandbox='allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts'
                                ></iframe>
                              </Box>
                            )}
                            {field.type == 'codeHtml' && (
                              <Box
                                sx={{
                                  width: '100%',
                                  height: 'max-content',
                                  color: '#c7c6c6',
                                  padding: '15px',
                                }}
                              >
                                {parse(field ? field.value : '<div></div>')}
                              </Box>
                            )}
                          </Box>
                        )
                      })}
                  </Box>
                )}
              </Box>
              {/* Botom buttons */}
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-around',
                  gap: 1,
                  marginTop: 2,
                }}
              >
                {(getLessonIndx() > 0 ||
                  Number(
                    typeof window !== 'undefined' ? localStorage.getItem('SelectedModuleIndex') : 0
                  ) > 0) && (
                  <Button
                    variant='text'
                    onClick={(e) => {
                      const getLessIndx = getLessonIndx()
                      if (getLessIndx > 0) {
                        if (moduleLessons) {
                          router.replace('/lesson?id=' + moduleLessons[getLessonIndx() - 1])
                          setId(Number(moduleLessons[getLessonIndx() - 1]))
                        }
                      } else {
                        if (Number(localStorage.getItem('SelectedModuleIndex')) > 0) {
                          const currentIndex = Number(localStorage.getItem('SelectedModuleIndex'))
                          localStorage.setItem('SelectedModuleIndex', '' + (currentIndex - 1))
                          setCompletedLessonTrigger(!completedLessonTrigger)
                          const lessIndex = Number(
                            modules
                              ? modules[currentIndex - 1].lessons[
                                  modules[currentIndex - 1].lessons.length - 1
                                ].id
                              : 0
                          )
                          router.replace('/lesson?id=' + lessIndex)
                          setId(lessIndex)
                        }
                      }
                    }}
                    startIcon={<ArrowBackIosIcon />}
                    sx={{ color: '#c7c6c6' }}
                  >
                    {t.previous}
                  </Button>
                )}
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  {userData &&
                    userData?.purchased_courses_id &&
                    userData?.purchased_courses_id.indexOf(Number(selectedCourse)) != -1 &&
                    userData?.comleted_lessons_id &&
                    userData?.comleted_lessons_id.indexOf(id) != -1 &&
                    data.type == 'quiz' && (
                      <Box>
                        <ConfettiButton
                          completeButtonState={'complete'}
                          onClickFunction={async () => {}}
                        />
                      </Box>
                    )}
                  {userData &&
                    userData?.purchased_courses_id &&
                    userData?.purchased_courses_id.indexOf(Number(selectedCourse)) != -1 &&
                    userData?.comleted_lessons_id &&
                    userData?.comleted_lessons_id.indexOf(id) == -1 && (
                      <>
                        {!resetAnswersBtn && (
                          <Box>
                            <ConfettiButton
                              completeButtonState={completeButtonState}
                              onClickFunction={async () => {
                                if (data.type == 'default' || data.type == 'practice') {
                                  const response = await axios.put(urlUser + '?id=' + userData.id, {
                                    purchasedCoursesId: [...userData.purchased_courses_id],
                                    favouriteCoursesId: [...userData.favourite_courses_id],
                                    comletedLessonsId: [...userData.comleted_lessons_id, id],
                                  })
                                  const resultResponse = response.data
                                  const userId = localStorage.getItem('UserID')
                                  const responseUser = await fetch(urlUser + '/' + userId, {
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                  })
                                  const resultUser = await responseUser.json()
                                  setCompleteButtonState('complete')
                                  setTimeout(() => {
                                    setCompletedLessonTrigger(!completedLessonTrigger)
                                    setUserData(resultUser)
                                    if (
                                      resultResponse &&
                                      moduleLessons &&
                                      getLessonIndx() >= 0 &&
                                      getLessonIndx() < moduleLessons?.length - 1
                                    ) {
                                      setUserData({
                                        ...userData,
                                        comleted_lessons_id: [...userData.comleted_lessons_id, id],
                                      })
                                      if (moduleLessons) {
                                        router.replace(
                                          '/lesson?id=' + moduleLessons[getLessonIndx() + 1]
                                        )
                                        setId(Number(moduleLessons[getLessonIndx() + 1]))
                                      }
                                    } else {
                                      if (
                                        resultResponse &&
                                        Number(localStorage.getItem('SelectedModuleIndex')) <
                                          (modules?.length ?? 0) - 1
                                      ) {
                                        const currentIndex = Number(
                                          localStorage.getItem('SelectedModuleIndex')
                                        )
                                        localStorage.setItem(
                                          'SelectedModuleIndex',
                                          '' + (currentIndex + 1)
                                        )
                                        setCompletedLessonTrigger(!completedLessonTrigger)
                                        const lessIndex = Number(
                                          modules ? modules[currentIndex + 1].lessons[0].id : 0
                                        )
                                        router.replace('/lesson?id=' + lessIndex)
                                        setId(lessIndex)
                                      }
                                    }
                                    setCompleteButtonState('ready')
                                  }, 2500)
                                }
                                if (data.type == 'quiz') {
                                  let result = true
                                  data.data.questions.map((question: any, indx: number) => {
                                    question.options.map((option: any, optionIndx: number) => {
                                      if (option.correct != answerForm[indx][optionIndx]) {
                                        result = false
                                      }
                                    })
                                  })
                                  if (result) {
                                    const response = await axios.put(
                                      urlUser + '?id=' + userData.id,
                                      {
                                        purchasedCoursesId: [...userData.purchased_courses_id],
                                        favouriteCoursesId: [...userData.favourite_courses_id],
                                        comletedLessonsId: [...userData.comleted_lessons_id, id],
                                      }
                                    )
                                    const resultResponse = response.data
                                    const userId = localStorage.getItem('UserID')
                                    const responseUser = await fetch(urlUser + '/' + userId, {
                                      headers: {
                                        'Content-Type': 'application/json',
                                      },
                                    })
                                    const resultUser = await responseUser.json()
                                    setCompleteButtonState('complete')

                                    setTimeout(() => {
                                      setCompletedLessonTrigger(!completedLessonTrigger)
                                      setUserData(resultUser)

                                      setCheckAnswers(true)
                                      Swal.fire({
                                        title: 'Great job!',
                                        background: '#171622',
                                        color: '#ffec3e',
                                        confirmButtonColor: '#c58efe',
                                      })

                                      // setCompleteButtonState('ready')
                                    }, 2500)
                                  } else {
                                    setTimeout(() => {
                                      setCheckAnswers(true)
                                      setResetAnswersBtn(true)
                                      setCompleteButtonState('ready')
                                    }, 2500)
                                  }
                                }
                              }}
                            />
                          </Box>
                        )}
                        {resetAnswersBtn && (
                          <Button
                            variant='contained'
                            sx={{ maxWidth: '200px', width: '50%', marginLeft: 2 }}
                            onClick={(e) => {
                              setAnswerForm(
                                answerForm.map((ansForm: any) => {
                                  return ansForm.map((opt: any) => {
                                    return false
                                  })
                                })
                              )
                              setClearCheckBoxes(true)
                              setTimeout(() => setClearCheckBoxes(false), 1)
                              setCheckAnswers(false)
                              setResetAnswersBtn(false)
                            }}
                          >
                            Reset quiz
                          </Button>
                        )}
                        {}
                      </>
                    )}
                </Box>

                {((moduleLessons &&
                  getLessonIndx() >= 0 &&
                  getLessonIndx() < moduleLessons?.length - 1) ||
                  Number(
                    typeof window !== 'undefined' ? localStorage.getItem('SelectedModuleIndex') : 0
                  ) <
                    (modules?.length ?? 0) - 1) && (
                  <Button
                    variant='text'
                    onClick={(e) => {
                      if (
                        moduleLessons &&
                        getLessonIndx() >= 0 &&
                        getLessonIndx() < moduleLessons?.length - 1
                      ) {
                        if (moduleLessons) {
                          router.replace('/lesson?id=' + moduleLessons[getLessonIndx() + 1])

                          setId(Number(moduleLessons[getLessonIndx() + 1]))
                        }
                      } else {
                        if (
                          Number(localStorage.getItem('SelectedModuleIndex')) <
                          (modules?.length ?? 0) - 1
                        ) {
                          const currentIndex = Number(localStorage.getItem('SelectedModuleIndex'))
                          localStorage.setItem('SelectedModuleIndex', '' + (currentIndex + 1))
                          setCompletedLessonTrigger(!completedLessonTrigger)
                          const lessIndex = Number(
                            modules ? modules[currentIndex + 1].lessons[0].id : 0
                          )
                          router.replace('/lesson?id=' + lessIndex)
                          setId(lessIndex)
                        }
                      }
                    }}
                    endIcon={<ArrowForwardIosIcon />}
                    sx={{ color: '#c7c6c6' }}
                  >
                    {t.next}
                  </Button>
                )}
              </Box>
              {questionLimit != -1 &&
                selectedCourse &&
                userData &&
                userId &&
                userData?.purchased_courses_id &&
                userData?.purchased_courses_id.indexOf(Number(selectedCourse)) != -1 && (
                  <Box
                    sx={{
                      marginTop: 2,
                      borderRadius: 2,
                      background: '#201c2d',
                      color: '#c7c6c6',
                      padding: 2,
                      paddingRight: 0,
                      display: 'flex',
                      justifyContent: 'space-around',
                    }}
                  >
                    {chatData ? (
                      <Box sx={{ width: '100%' }}>
                        <h2 style={{ color: '#ffec3e' }}>{t.askGpt}</h2>
                        <Box
                          ref={containerRef}
                          sx={{
                            overflowY: 'auto',
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#8b8b92 transparent',
                            maxHeight: '20rem',
                            paddingRight: 2,
                          }}
                        >
                          {chatData.data.messages &&
                            chatData.data.messages.map((message: any, i: number) => {
                              return (
                                <Box
                                  key={'message_' + i}
                                  sx={{
                                    display: 'flex',
                                    justifyContent: message.from == 'user' ? 'end' : 'start',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      maxWidth: '70%',
                                      background: '#2a2439',
                                      marginTop: 0.5,
                                      marginBottom: 0.5,
                                      whiteSpace: 'pre-wrap',
                                      padding: 1.5,
                                      borderRadius: 2,
                                    }}
                                  >
                                    {message.value}
                                  </Box>
                                </Box>
                              )
                            })}
                          {dataGpt && (
                            <div className={s.bouncing_loader} style={{ marginTop: '20px' }}>
                              <div></div>
                              <div></div>
                              <div></div>
                            </div>
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
                          <TextField
                            inputRef={gptField}
                            autoComplete={'off'}
                            id='standard-name'
                            fullWidth
                            placeholder={t.gptPlaceholder}
                            multiline
                            inputProps={{ style: { fontSize: 18 } }}
                            sx={{
                              width: '100%',
                              background: '#171622',
                              '& .MuiInputBase-root': {
                                color: '#8b8b92',
                              },
                              '& .MuiInputLabel-root': {
                                color: '#8b8b92',
                              },
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#28263a',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#28263a',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#28263a',
                                },
                              },
                            }}
                          />
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                            }}
                          >
                            <IconButton
                              disabled={
                                questionLimit && questionLimit != 0
                                  ? chatData.data.messages.filter(
                                      (message: any) => message.from == 'chat'
                                    ).length >= questionLimit
                                  : false
                              }
                              sx={{ background: '#2a2439' }}
                              onClick={async (e: any) => {
                                if (gptField.current.value.trim() != '') {
                                  // const response = await axios.put(
                                  //   urlChat +
                                  //     '?lessonId=' +
                                  //     id +
                                  //     '&userId=' +
                                  //     userData.id +
                                  //     '&chatId=' +
                                  //     chatDataId,
                                  //   {
                                  //     messages: chatData.data.messages
                                  //       ? [
                                  //           ...chatData.data.messages,
                                  //           { value: message, from: 'user', time: new Date() },
                                  //         ]
                                  //       : [{ value: message, from: 'user', time: new Date() }],
                                  //   }
                                  // )
                                  // if (response.status == 200) {
                                  setChatData({
                                    ...chatData,
                                    data: {
                                      messages: [
                                        ...chatData.data.messages,
                                        {
                                          value: gptField.current.value ?? '',
                                          from: 'user',
                                          time: new Date(),
                                        },
                                      ],
                                    },
                                  })
                                  setDataGpt(true)
                                  setTimeout(() => {
                                    const lastItem = containerRef.current.lastElementChild
                                    if (lastItem) {
                                      lastItem.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'nearest',
                                      })
                                    }
                                  }, 1)
                                  setTimeout(() => {
                                    handleGPT()
                                  }, 1000)
                                  // }
                                }
                              }}
                            >
                              <SendIcon sx={{ color: '#c7c6c6' }} />
                            </IconButton>
                          </Box>
                        </Box>
                        {questionLimit != null && questionLimit != 0 ? (
                          <Box sx={{ color: '#c7c6c6', marginTop: '5px', marginLeft: '10px' }}>
                            {data &&
                              questionLimit -
                                chatData.data.messages.filter(
                                  (message: any) => message.from == 'chat'
                                ).length +
                                ' ' +
                                t.requestsLeft}
                          </Box>
                        ) : (
                          <></>
                        )}
                      </Box>
                    ) : selectedCourse ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress sx={{ color: '#c7c6c6' }} />
                      </Box>
                    ) : (
                      <></>
                    )}
                  </Box>
                )}
            </Box>
          ) : (
            <Box
              sx={{ display: 'flex', justifyContent: 'center', marginTop: 40, marginBottom: 70 }}
            >
              <CircularProgress sx={{ color: '#ffec3e' }} />
            </Box>
          )}
        </Box>

        <Box
          sx={{
            height: { xs: null, md: '140vb' },
            paddingLeft: 1,
            overflowY: 'scroll',
            scrollbarWidth: 'none',
            width: { xs: '100%', md: '500px' },
          }}
        >
          <Box>
            {modules ? (
              <CourseLessonMaterials
                setId={setId}
                modules={modules}
                selectedLesson={id ?? -1}
                completedLessonTrigger={completedLessonTrigger}
              />
            ) : selectedCourse ? (
              <Box
                sx={{ display: 'flex', justifyContent: 'center', marginTop: 10, marginBottom: 10 }}
              >
                <CircularProgress sx={{ color: '#c7c6c6' }} />
              </Box>
            ) : (
              <></>
            )}
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'inline' } }}>
            <Box>
              {selectedCourse &&
                userData &&
                userData?.purchased_courses_id &&
                userData?.purchased_courses_id.indexOf(Number(selectedCourse)) != -1 && (
                  <Box
                    sx={{
                      marginTop: 2,
                      borderRadius: 2,
                      background: 'rgba(197, 142, 254, 0.1)',
                      color: '#c7c6c6',
                      padding: 2,
                      display: 'flex',
                      justifyContent: 'space-around',
                    }}
                  >
                    <h3>{t.your_rating}</h3>
                    <Rating
                      disabled={
                        !(
                          selectedCourse &&
                          userData &&
                          userData?.purchased_courses_id &&
                          userData?.purchased_courses_id.indexOf(Number(selectedCourse)) != -1
                        )
                      }
                      onChange={async (event, newValue) => {
                        if (newValue) {
                          if (newValue < 5) {
                            if (
                              selectedCourse &&
                              userData &&
                              userData?.purchased_courses_id &&
                              userData?.purchased_courses_id.indexOf(Number(selectedCourse)) != -1
                            ) {
                              const { value: text } = await Swal.fire({
                                background: '#171622',
                                color: '#ffec3e',
                                confirmButtonColor: '#c58efe',

                                input: 'textarea',
                                title: t.feedbackTitle,
                                inputPlaceholder: t.typeMessage,
                                inputAttributes: {
                                  'aria-label': t.typeMessage,
                                },
                                showCancelButton: true,
                                confirmButtonText: t.submit,
                                cancelButtonText: t.skip,
                              })
                              const response = await axios.post(
                                urlFeedback +
                                  '?userId=' +
                                  userData.id +
                                  '&rating=' +
                                  newValue +
                                  '&lessonId=' +
                                  id +
                                  '&feedbackName=' +
                                  text
                              )
                              Swal.fire({
                                title: t.thanks,
                                background: '#171622',
                                color: '#ffec3e',
                                confirmButtonColor: '#c58efe',
                              })
                            }
                          } else {
                            Swal.fire({
                              title: t.thanks,
                              background: '#171622',
                              color: '#ffec3e',
                              confirmButtonColor: '#c58efe',
                            })
                          }
                        }
                      }}
                      emptyIcon={<StarBorderIcon fontSize='inherit' sx={{ color: '#45454e' }} />}
                      sx={{
                        fontSize: 22,
                        '& .MuiRating-iconFilled': {
                          color: '#ffec3e', // Color of selected stars
                        },
                      }}
                    />
                  </Box>
                )}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: { xs: 'inline', md: 'none' } }}>
        <Box>
          {selectedCourse &&
            userData &&
            userData?.purchased_courses_id &&
            userData?.purchased_courses_id.indexOf(Number(selectedCourse)) != -1 && (
              <Box
                sx={{
                  marginTop: 2,
                  borderRadius: 2,
                  background: 'rgba(197, 142, 254, 0.1)',
                  color: '#c7c6c6',
                  padding: 2,
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
              >
                <h3>{t.your_rating}</h3>
                <Rating
                  disabled={
                    !(
                      selectedCourse &&
                      userData &&
                      userData?.purchased_courses_id &&
                      userData?.purchased_courses_id.indexOf(Number(selectedCourse)) != -1
                    )
                  }
                  onChange={async (event, newValue) => {
                    if (newValue) {
                      if (newValue < 5) {
                        if (
                          selectedCourse &&
                          userData &&
                          userData?.purchased_courses_id &&
                          userData?.purchased_courses_id.indexOf(Number(selectedCourse)) != -1
                        ) {
                          const { value: text } = await Swal.fire({
                            background: '#171622',
                            color: '#ffec3e',
                            confirmButtonColor: '#c58efe',

                            input: 'textarea',
                            title: t.feedbackTitle,
                            inputPlaceholder: t.typeMessage,
                            inputAttributes: {
                              'aria-label': t.typeMessage,
                            },
                            showCancelButton: true,
                            confirmButtonText: t.submit,
                            cancelButtonText: t.skip,
                          })
                          const response = await axios.post(
                            urlFeedback +
                              '?userId=' +
                              userData.id +
                              '&rating=' +
                              newValue +
                              '&lessonId=' +
                              id +
                              '&feedbackName=' +
                              text
                          )
                          Swal.fire({
                            title: t.thanks,
                            background: '#171622',
                            color: '#ffec3e',
                            confirmButtonColor: '#c58efe',
                          })
                        }
                      } else {
                        Swal.fire({
                          title: t.thanks,
                          background: '#171622',
                          color: '#ffec3e',
                          confirmButtonColor: '#c58efe',
                        })
                      }
                    }
                  }}
                  emptyIcon={<StarBorderIcon fontSize='inherit' sx={{ color: '#45454e' }} />}
                  sx={{
                    fontSize: 22,
                    '& .MuiRating-iconFilled': {
                      color: '#ffec3e', // Color of selected stars
                    },
                  }}
                />
              </Box>
            )}
        </Box>
      </Box>
    </Layout>
  )
}

export default LessonDetails
