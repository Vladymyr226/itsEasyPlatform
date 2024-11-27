import { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import { Box, Button, TextField, IconButton, Chip } from '@mui/material'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import DeleteIcon from '@mui/icons-material/Delete'
import MyEditor from '@/components/SlateEditor/Editor'
import YouTube, { YouTubeProps } from 'react-youtube'
import { Lesson, LessonField, YouTubeProp } from '@/utils/interfaces'
import { langNames, uploadFileToS3 } from '@/utils'
import { initialLesson } from '.'
import { initialRichText } from '../CourseCreate'

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

const LessonCreateDefault = ({
  lessonForm, setLessonForm,
  idLessonEdit, setIdLessonEdit,
  lessonFormCurrent, setLessonFormCurrent,
  lessonFields, setLessonFields,
  setTabValue,
  setEditTrigger,
  setError,
  handleSubmitLessonDefault,
}: {
  lessonForm: Lesson
  setLessonForm: React.Dispatch<React.SetStateAction<Lesson>>
  idLessonEdit: string | null
  setIdLessonEdit: React.Dispatch<React.SetStateAction<string | null>>
  lessonFormCurrent: Lesson
  setLessonFormCurrent: React.Dispatch<React.SetStateAction<Lesson>>
  lessonFields: LessonField[]
  setLessonFields: React.Dispatch<React.SetStateAction<LessonField[]>>

  setTabValue: React.Dispatch<React.SetStateAction<number>>
  setEditTrigger: React.Dispatch<React.SetStateAction<boolean>>
  setError: React.Dispatch<any>
  handleSubmitLessonDefault: (e: any) => Promise<void>
}) => {

  const [displayDrag, setDisplayDrag] = useState<any>(true)

  const dragLesson = useRef<any>(0)
  const draggedOverLesson = useRef<any>(0)

  useEffect(() => {
    setLessonFormCurrent(lessonForm)

    if (lessonForm && lessonForm.fields) {
      setLessonFields(
        lessonForm.fields.map((f: LessonField, i: number) => {
          return { ...f, tmpId: new Date().getTime() + i }
        })
      )
    }
  }, [lessonForm, setLessonFields, setLessonFormCurrent])

  function handleSort() {
    const lessonClone = [...lessonFields]
    let draggedIdx = -1
    const temp = lessonClone.filter((module, i) => {
      if (module.tmpId == dragLesson.current) {
        draggedIdx = i
        return module
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
    setLessonFields(
      lessonClone.filter(
        (less, i) =>
          less.tmpId != dragLesson.current ||
          i ==
            (draggedOverLesson.current > draggedIdx
              ? draggedOverLesson.current + 1
              : draggedOverLesson.current)
      )
    )
  }

  return (
    <Box>
      <Chip label={lessonFormCurrent.language && langNames[lessonFormCurrent.language]} />

      <Box sx={{ display: 'flex' }}>
        <TextField
          margin='normal'
          required
          fullWidth
          id='hours'
          type='number'
          label='Hours'
          name='hours'
          autoFocus
          autoComplete='off'
          onChange={(e) => {
            setLessonFormCurrent({ ...lessonFormCurrent, hours: parseInt(e.target.value) })
          }}
          value={lessonFormCurrent.hours}
        />

        <TextField
          margin='normal'
          required
          fullWidth
          id='minutes'
          type='number'
          label='Minutes'
          name='minutes'
          autoFocus
          autoComplete='off'
          onChange={(e) => {
            setLessonFormCurrent({ ...lessonFormCurrent, minutes: parseInt(e.target.value) })
          }}
          value={lessonFormCurrent.minutes}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
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
            setLessonFormCurrent({ ...lessonFormCurrent, title: e.target.value })
          }}
          value={lessonFormCurrent.title}
        />
      </Box>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {lessonFields.map((field: LessonField, index: number) => {
            return (
              <Box key={'mainModuleContainer_' + index} sx={{ boxShadow: 2, border: '1px solid' }}>
                <Accordion
                  defaultExpanded={true}
                  sx={{}}
                  draggable
                  onDragStart={() => ((dragLesson.current = field.tmpId), setDisplayDrag(false))}
                  onDragEnter={() => (draggedOverLesson.current = index)}
                  onDragEnd={(e) => {
                    handleSort()
                    setDisplayDrag(true)
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{}}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <DragIndicatorIcon sx={{ marginTop: 1, color: '#808080' }} />
                      <IconButton
                        color='error'
                        sx={{
                          width: '40px',
                          height: '40px',
                          marginRight: 4,
                        }}
                        onClick={(e) => {
                          setEditTrigger(true)
                          setError({})
                          setLessonFields(lessonFields.filter((f: LessonField, i: number) => i !== index))
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
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
                        {field.type == 'slate' && displayDrag && (
                          <Box>
                            <Box sx={{ color: '#000000' }}>
                              <MyEditor
                                value={field.value}
                                setValue={(data: any) => {
                                  setLessonFields(
                                    lessonFields.map((f: LessonField, i: number) => i === index ? { ...f, value: data } : f ))
                                }}
                              />
                            </Box>
                          </Box>
                        )}

                        {field.type == 'code' && displayDrag && (
                          <Box>
                            <TextField
                              margin='normal'
                              required
                              fullWidth
                              id='lessonTitle'
                              type='title'
                              label='Url'
                              name='title'
                              autoFocus
                              autoComplete='off'
                              onChange={e => setLessonFields(
                                lessonFields.map(
                                  (f: LessonField, i: number) => i === index ? { ...f, value: e.target.value } : f))
                              }
                              value={field.value}
                            />
                          </Box>
                        )}

                        {field.type == 'codeHtml' && displayDrag && (
                          <Box>
                            <TextField
                              margin='normal'
                              required
                              fullWidth
                              id='htmlTitle'
                              label='HTML'
                              multiline
                              name='title'
                              autoFocus
                              autoComplete='off'
                              onChange={e => setLessonFields(
                                lessonFields.map(
                                  (f: LessonField, i: number) => i === index ? { ...f, value: e.target.value } : f))
                              }
                              value={field.value}
                            />
                          </Box>
                        )}

                        {field.type == 'youTube' && displayDrag && (
                          <Box>
                            <Box sx={{ width: '100%', marginTop: 2 }}>
                              <ExampleYouTube url={field.value.split('?v=')[1]} />
                            </Box>
                            <TextField
                              margin='normal'
                              required
                              fullWidth
                              id='youTube'
                              label='url'
                              multiline
                              name='title'
                              autoFocus
                              autoComplete='off'
                              onChange={e => setLessonFields(
                                lessonFields.map(
                                  (f: LessonField, i: number) => i === index ? { ...f, value: e.target.value } : f))
                              }
                              value={field.value}
                            />
                          </Box>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'end', marginTop: 4 }}></Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )
          })}
        </Box>

        <Button
          variant='contained'
          onClick={(e) => {
            setLessonFields([
              ...lessonFields,
              {
                tmpId: new Date().getTime(),
                type: 'slate',
                value: initialRichText,
              },
            ])
          }}
          sx={{
            marginTop: 2,
            fontWeight: 'bold',
            borderRadius: '0px',
          }}
        >
          Add richtext
        </Button>

        <Button
          variant='contained'
          onClick={(e) => {
            setLessonFields([
              ...lessonFields,
              {
                tmpId: new Date().getTime(),
                type: 'code',
                value: [],
              },
            ])
          }}
          sx={{
            marginLeft: 2,
            marginTop: 2,
            fontWeight: 'bold',
            borderRadius: '0px',
          }}
        >
          Add Code (Link)
        </Button>

        <Button
          variant='contained'
          onClick={(e) => {
            setLessonFields([
              ...lessonFields,
              {
                tmpId: new Date().getTime(),
                type: 'codeHtml',
                value: [],
              },
            ])
          }}
          sx={{
            marginLeft: 2,
            marginTop: 2,
            fontWeight: 'bold',
            borderRadius: '0px',
          }}
        >
          Add Code (HTML)
        </Button>

        <Button
          variant='contained'
          onClick={(e) => {
            setLessonFields([
              ...lessonFields,
              {
                tmpId: new Date().getTime(),
                type: 'youTube',
                value: '',
              },
            ])
          }}
          sx={{
            marginLeft: 2,
            marginTop: 2,
            fontWeight: 'bold',
            borderRadius: '0px',
          }}
        >
          Add YouTube (Link)
        </Button>
      </Box>

      <Box sx={{ display: 'flex' }}>
        <Button
          variant='contained'
          component='label'
          onClick={() => {
            setLessonFormCurrent({ ...lessonFormCurrent, image: '' })
          }}
          sx={{ mt: 1, mr: 1 }}
        >
          Remove
        </Button>

        <Button fullWidth variant='contained' component='label' sx={{ mt: 1 }}>
          <input
            type='file'
            accept='image/png, image/jpeg'
            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
              if (event.target.files) {
                try {
                  setLessonFormCurrent({
                    ...lessonFormCurrent,
                    image: ((await uploadFileToS3(event.target.files[0])) as string) ?? '',
                  })
                } catch (error) {
                  Swal.fire({
                    title: 'Some error has occurred!',
                    text: '' + error,
                    background: '#171622',
                    color: '#ffec3e',
                    confirmButtonColor: '#c58efe',
                    icon: 'error',
                  })
                }
              }
            }}
          />
        </Button>
      </Box>

      <Box sx={{ display: 'flex' }}>
        <Button
          variant='contained'
          sx={{
            marginTop: 2,
            marginRight: 2,
            fontWeight: 'bold',
          }}
          onClick={async (e) => {
            setLessonFormCurrent(initialLesson)
            setLessonForm(initialLesson)
            setLessonFields([])
            setIdLessonEdit(null)
            setTabValue(1)
          }}
        >
          Return
        </Button>

        <Button
          variant='contained'
          fullWidth
          sx={{
            marginTop: 2,
            fontWeight: 'bold',
          }}
          onClick={handleSubmitLessonDefault}
        >
          {idLessonEdit ? 'Save' : 'Create'}
        </Button>
      </Box>
    </Box>
  )
}

export default LessonCreateDefault
