import Swal from 'sweetalert2'
import axios from 'axios'

import { removeLessonIds } from '@/utils/removeAllLessonId'
import { Lesson, Module } from '@/utils/interfaces'
import LessonBox from './LessonBox'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  IconButton,
  TextField
} from '@mui/material'

import {
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'

const urlLesson = `${process.env.NEXT_BACK_HOST_API}/cabinet/lesson`

const CourseStructure = ({
  dragLesson,
  draggedOverLesson,
  modules, setModules,
  allLessons, setAllLessons,
  idLessonEdit, setIdLessonEdit,
  moduleIndexCreate, setModuleIndexCreate,
  storedLessons, setStoredLessons,
  setEditTrigger,
  setError,
  setLessonForm,
  setLessonType,
  setTabValue,
}: {
  dragLesson: React.MutableRefObject<any>,
  draggedOverLesson: React.MutableRefObject<any>,

  modules: Module[],
  setModules: React.Dispatch<React.SetStateAction<Module[]>>,
  allLessons: Lesson[],
  setAllLessons: React.Dispatch<React.SetStateAction<Lesson[]>>,
  idLessonEdit: string | null,
  setIdLessonEdit: React.Dispatch<React.SetStateAction<string | null>>,
  moduleIndexCreate: number,
  setModuleIndexCreate: React.Dispatch<React.SetStateAction<number>>,
  storedLessons: Lesson[],
  setStoredLessons: React.Dispatch<React.SetStateAction<Lesson[]>>,

  setEditTrigger: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<any>,
  setLessonForm: React.Dispatch<React.SetStateAction<Lesson>>,
  setLessonType: React.Dispatch<React.SetStateAction<string>>,
  setTabValue: React.Dispatch<React.SetStateAction<number>>,
}) => {

  const handleChangeStoredLessons = (value: any, i: number) => {
    setEditTrigger(true)
    setError({})
    if (value) {
      setModules(
        modules.map(
          (module: Module, index: number) => {
            if (
              index == i &&
              module.lessons.filter(
                (reDropElem) =>
                  reDropElem.id ===
                  value.id,
              ).length === 0
            ) {
              setStoredLessons(storedLessons.filter(l => l.id != value.id))
              return {
                title: module.title,
                lessons: [
                  ...module.lessons,
                  {
                    ...value,
                  },
                ],
              }
            }
            return module
          },
        ),
      )
    }
  }

  const renderOptionStoredLessons = (props: object, option: any, state: object) => (
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
                setStoredLessons(storedLessons.filter(l => l.id != option.id))
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
  )

  return <Box sx={{ width: '100%' }}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      {modules.map((module: Module, moduleIndex: number) => {
        return (
          <Box
            key={'mainModuleContainer_' + moduleIndex}
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
                    error={modules.filter((m: Module) => m.title.trim() === module.title.trim()).length > 1}
                    id={'module' + moduleIndex}
                    type="text"
                    label={'Module ' + (moduleIndex + 1) + ' name'}
                    name={'module' + moduleIndex}
                    autoFocus
                    onChange={(e) => {
                      setEditTrigger(true)
                      setError({})
                      setModules(
                        modules.map((m: Module, i: number) => {
                          if (moduleIndex === i) return { ...m, title: e.target.value }
                          else return m
                        }),
                      )
                    }}
                    value={module.title}
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
                          (m: Module, i: number) => {
                            if (moduleIndex !== i) {
                              return m
                            }
                            setAllLessons([
                              ...allLessons,
                              ...m.lessons,
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
                    {module.lessons.map((lesson: Lesson, lessonIndex: number) =>
                      <LessonBox
                        key={'mainLessonContainer_' + lessonIndex}
                        module={module}
                        moduleIndex={moduleIndex}
                        lesson={lesson}
                        lessonIndex={lessonIndex}
                        dragLesson={dragLesson}
                        draggedOverLesson={draggedOverLesson}
                        modules={modules}
                        setModules={setModules}
                        idLessonEdit={idLessonEdit}
                        setIdLessonEdit={setIdLessonEdit}
                        storedLessons={storedLessons}
                        setStoredLessons={setStoredLessons}
                        setEditTrigger={setEditTrigger}
                        setLessonForm={setLessonForm}
                        setModuleIndexCreate={setModuleIndexCreate}
                        setLessonType={setLessonType}
                        setTabValue={setTabValue}
                        setError={setError}
                      />
                    )}
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
                      options={storedLessons}
                      value={{ title: '' }}
                      fullWidth
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Stored lessons"
                        />
                      )}
                      onChange={(e: any, value: any) => handleChangeStoredLessons(value, moduleIndex)}
                      renderOption={renderOptionStoredLessons}
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
                      setModuleIndexCreate(moduleIndexCreate === moduleIndex ? -1 : moduleIndex)
                      setLessonForm({
                        title: '',
                        link: '',
                        image: '',
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
      onClick={e => setModules([...modules, { title: '', lessons: [] }])}
      sx={{
        marginTop: 2,
        fontWeight: 'bold',
        borderRadius: '0px',
      }}
    >
      Add Module
    </Button>
  </Box>
}

export default CourseStructure
