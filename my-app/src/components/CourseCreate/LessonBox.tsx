import { useState } from 'react'
import YouTube, { YouTubeProps } from 'react-youtube'
import SlateView from '@/components/SlateEditor/View'
import { Lesson, Module, YouTubeProp } from '@/utils/interfaces'

import {
  Box,
  Button,
  IconButton
} from '@mui/material'

import {
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
  Edit as EditIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material'

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

const LessonBox = ({
  module, moduleIndex,
  lesson, lessonIndex,
  dragLesson, draggedOverLesson,
  modules, setModules,
  idLessonEdit, setIdLessonEdit,
  storedLessons, setStoredLessons,
  setEditTrigger,
  setLessonForm,
  setModuleIndexCreate,
  setLessonType,
  setTabValue,
  setError,
}: {
  module: Module,
  moduleIndex: number,
  lesson: Lesson,
  lessonIndex: number,
  dragLesson: React.MutableRefObject<any>,
  draggedOverLesson: React.MutableRefObject<any>,

  modules: Module[],
  setModules: React.Dispatch<React.SetStateAction<Module[]>>,
  idLessonEdit: string | null,
  setIdLessonEdit: React.Dispatch<React.SetStateAction<string | null>>,
  storedLessons: Lesson[],
  setStoredLessons: React.Dispatch<React.SetStateAction<Lesson[]>>,

  setEditTrigger: React.Dispatch<React.SetStateAction<boolean>>,
  setLessonForm: React.Dispatch<React.SetStateAction<Lesson>>,
  setModuleIndexCreate: React.Dispatch<React.SetStateAction<number>>,
  setLessonType: React.Dispatch<React.SetStateAction<string>>,
  setTabValue: React.Dispatch<React.SetStateAction<number>>,
  setError: React.Dispatch<any>,
}) => {

  const [preview, setPreview] = useState('-1')

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
      modules.map((m: Module, ind: number) => {
        if (ind === moduleIndex) {
          return {
            title: m.title,
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
        return m
      }),
    )
  }

  return <div
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
        lessonIndex)
    }
    onDragEnd={(e) =>
      handleSort(module.lessons, moduleIndex)
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
      <Button>{lesson.language}</Button>
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
          setModuleIndexCreate(moduleIndex)
          setLessonType(lesson.type || '')
          setTabValue(2)
        }}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        onClick={async (e) => {
          setEditTrigger(true)
          setError({})
          setStoredLessons([
            ...storedLessons,
            lesson,
          ])
          setModules(modules.map((m: Module, i: number) => {
            if (i === moduleIndex) {
              return {
                title: m.title,
                lessons:
                  m.lessons.filter((l: Lesson) => {
                    if (l.id !== lesson.id) return l
                    setStoredLessons([ ...storedLessons, l ])
                  })
              }
            }
            return m
          }))
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
}

export default LessonBox
