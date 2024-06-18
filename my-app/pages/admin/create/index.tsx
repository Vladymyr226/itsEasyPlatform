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
import Rating from '@/components/Rating/Rating'
import SkillsList from '@/components/SkillsList/SkillsList'
import ViewsCount from '@/components/ViewsCount/ViewsCount'
import Layout from '@/components/Layout/Layout'
import '../../../app/globals.css'
import { Box, Button, Typography } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'

import IconButton from '@mui/material/IconButton'
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

const textFieldColors = {
  '& label.Mui-focused': {
    color: '#ffec3e',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#ffec3e' },
    '&:hover fieldset': {
      borderColor: '#ffec3e',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ffec3e',
    },
  },
  color: '#fff',
  input: {
    color: '#fff',
    borderColor: '#fff',
  },
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
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
  const [value, setValue] = useState(0)
  const [imageUrl, setImageUrl] = useState('')

  const [language, setLanguage] = useState('')
  const [level, setLevel] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
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

  interface Lesson {
    name: string
    description: string
    duration: number
    fields: Array<any>
    teacher: string
  }

  const [modules, setModules] = useState<Array<Lesson>>([
    {
      name: 'module1',
      description: 'text',
      duration: 123,
      fields: [],
      teacher: 'string',
    },
    {
      name: 'module2',
      description: 'text',
      duration: 123,
      fields: [],
      teacher: 'string',
    },
  ])
  const [expanded, setExpanded] = useState<string | false>(false)

  const handleChangeExpanded =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  return (
    <Layout>
      <Box sx={{ minHeight: '80vh' }}>
        <Box
          sx={{
            paddingLeft: '2rem',
            paddingRight: '2rem',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              maxWidth: '900px',
              width: '100%',
              boxShadow: 2,
              borderRadius: '10px',

              border: '1px solid #ffec3e',
              borderTop: '4px solid #ffec3e',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label='basic tabs example'
                textColor={'primary'}
                sx={{
                  maxWidth: '100%',
                }}
                TabIndicatorProps={{
                  style: {
                    backgroundColor: '#ffec3e',
                  },
                }}
              >
                <Tab
                  value={0}
                  label='General'
                  sx={{
                    width: '33%',
                    color: '#ffec3e',
                    '&.Mui-selected': {
                      color: '#ffec3e',
                      fontWeight: 'bold',
                    },
                  }}
                />
                <Tab
                  value={1}
                  label='Structure'
                  sx={{
                    width: '34%',
                    color: '#ffec3e',
                    '&.Mui-selected': {
                      color: '#ffec3e',
                      fontWeight: 'bold',
                    },
                  }}
                />
                <Tab
                  value={2}
                  label='Create lesson'
                  sx={{
                    width: '33%',
                    color: '#ffec3e',
                    '&.Mui-selected': {
                      color: '#ffec3e',
                      fontWeight: 'bold',
                    },
                  }}
                />
              </Tabs>
              <CustomTabPanel value={value} index={0}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                      InputLabelProps={{
                        sx: {
                          color: '#ffec3e',
                        },
                      }}
                      sx={{ ...textFieldColors }}
                    />
                    <TextField
                      margin='normal'
                      required
                      fullWidth
                      id='description'
                      type='text'
                      label='Description'
                      name='description'
                      InputLabelProps={{
                        sx: {
                          color: '#ffec3e',
                        },
                      }}
                      sx={{ ...textFieldColors }}
                    />
                    <TextField
                      margin='normal'
                      required
                      fullWidth
                      id='richtext'
                      type='text'
                      label='Rich-text'
                      name='richtext'
                      InputLabelProps={{
                        sx: {
                          color: '#ffec3e',
                        },
                      }}
                      sx={{ ...textFieldColors }}
                    />
                    <Box>
                      {imageUrl && <Image src={imageUrl} fill alt={'Preview image'} />}
                      <TextField
                        margin='normal'
                        required
                        fullWidth
                        id='imagePreview'
                        type='text'
                        label='Image preview'
                        name='imagePreview'
                        InputLabelProps={{
                          sx: {
                            color: '#ffec3e',
                          },
                        }}
                        sx={{ ...textFieldColors }}
                      />
                    </Box>
                    {/* TODO Normal color */}
                    <Box sx={{ marginTop: 2 }}>
                      <InputLabel sx={{ color: '#ffec3e' }}>Language</InputLabel>
                      <Select
                        fullWidth
                        id='languageSelect'
                        value={language}
                        onChange={handleChangeLanguage}
                        sx={{
                          color: '#fff',
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                        }}
                      >
                        <MenuItem value={'RU'}>RU</MenuItem>
                        <MenuItem value={'UA'}>UA</MenuItem>
                        <MenuItem value={'EN'}>EN</MenuItem>
                      </Select>
                    </Box>
                    <Box sx={{ marginTop: 2 }}>
                      <InputLabel sx={{ color: '#ffec3e' }}>Level</InputLabel>
                      <Select
                        fullWidth
                        id='levelSelect'
                        value={level}
                        onChange={handleChangeLevel}
                        sx={{
                          color: '#fff',

                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                        }}
                      >
                        <MenuItem value={'Beginner'}>Beginner</MenuItem>
                        <MenuItem value={'Junior'}>Junior</MenuItem>
                        <MenuItem value={'Middle'}>Middle</MenuItem>
                        <MenuItem value={'Senior'}>Senior</MenuItem>
                      </Select>
                    </Box>
                    <Box sx={{ marginTop: 2 }}>
                      <InputLabel sx={{ color: '#ffec3e' }}>Type</InputLabel>
                      <Select
                        fullWidth
                        id='typeSelect'
                        value={type}
                        onChange={handleChangeType}
                        sx={{
                          color: '#fff',

                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                        }}
                      >
                        <MenuItem value={'self-education'}>Self education</MenuItem>
                        <MenuItem value={'with-lector'}>With lector</MenuItem>
                      </Select>
                    </Box>
                    <DateField
                      label={type === 'with-lector' ? 'Start date' : 'Creation date'}
                      fullWidth
                      InputLabelProps={{
                        sx: {
                          color: '#ffec3e',
                        },
                      }}
                      sx={{ ...textFieldColors, marginTop: 2 }}
                    />
                    <TextField
                      margin='normal'
                      required
                      fullWidth
                      id='lectures-amount'
                      type='number'
                      label='Lectures amount'
                      name='lectures-amount'
                      InputLabelProps={{
                        sx: {
                          color: '#ffec3e',
                        },
                      }}
                      InputProps={{
                        inputProps: { min: 1 },
                      }}
                      sx={{ ...textFieldColors, marginTop: 3 }}
                    />
                    <TextField
                      margin='normal'
                      required
                      fullWidth
                      id='practic-amount'
                      type='number'
                      label='Practic amount'
                      name='practic-amount'
                      InputLabelProps={{
                        sx: {
                          color: '#ffec3e',
                        },
                      }}
                      InputProps={{
                        inputProps: { min: 1 },
                      }}
                      sx={{ ...textFieldColors }}
                    />

                    <TextField
                      margin='normal'
                      required
                      fullWidth
                      id='price-course'
                      type='number'
                      label='Price for course'
                      name='price-course'
                      InputLabelProps={{
                        sx: {
                          color: '#ffec3e',
                        },
                      }}
                      InputProps={{
                        inputProps: { min: 1 },
                      }}
                      sx={{ ...textFieldColors }}
                    />

                    <TextField
                      margin='normal'
                      required
                      fullWidth
                      id='price-discount'
                      type='number'
                      label='Price for course with discount'
                      name='price-discount'
                      InputLabelProps={{
                        sx: {
                          color: '#ffec3e',
                        },
                      }}
                      InputProps={{
                        inputProps: { min: 1 },
                      }}
                      sx={{ ...textFieldColors }}
                    />
                    <Box sx={{ marginTop: 2 }}>
                      <InputLabel sx={{ color: '#ffec3e' }}>Status</InputLabel>
                      <Select
                        fullWidth
                        id='statusSelect'
                        value={status}
                        onChange={handleChangeStatus}
                        sx={{
                          color: '#fff',

                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                        }}
                      >
                        <MenuItem value={'active'}>Active</MenuItem>
                        <MenuItem value={'draft'}>Draft</MenuItem>
                      </Select>
                    </Box>
                  </Box>
                </LocalizationProvider>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <Box sx={{ display: 'flex', width: '100%' }}>
                  <Box sx={{ width: '30%', border: '2px solid #ffec3e', minHeight: '20rem' }}>
                    <Button
                      fullWidth
                      variant='contained'
                      sx={{
                        background: '#ffec3e',
                        color: '#0f0e16',
                        fontWeight: 'bold',
                        borderBottom: '2px solid #ffec3e',
                        borderRadius: '0px',
                        '&:hover': {
                          backgroundColor: '#0f0e16',
                          borderBottom: '2px solid #ffec3e',
                          color: '#ffec3e',
                        },
                      }}
                    >
                      Add Module
                    </Button>
                    {modules.map((element, i) => {
                      return (
                        <Box sx={{ color: '#ffec3e' }}>
                          <Accordion
                            expanded={expanded === 'panel' + i}
                            onChange={handleChangeExpanded('panel' + i)}
                            sx={{
                              borderBottom: '2px solid #ffec3e',
                              background: '#0f0e16',
                              color: '#ffec3e',
                              '& .MuiAccordionSummary-expandIconWrapper .MuiSvgIcon-root': {
                                color: '#ffec3e',
                              },
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              sx={{ minHeight: '58px' }}
                            >
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <Typography
                                  sx={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  Module {' ' + (i + 1)}
                                </Typography>
                              </div>
                            </AccordionSummary>

                            <AccordionDetails style={{ padding: '0' }}>
                              <ul>
                                <div style={{ display: 'flex' }}>
                                  <Box>123</Box>
                                </div>
                              </ul>

                              <br />
                            </AccordionDetails>
                          </Accordion>
                        </Box>
                      )
                    })}
                  </Box>
                  <Box sx={{ background: '#fff', width: '70%' }}>2</Box>
                </Box>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                Item Three
              </CustomTabPanel>
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  )
}

export default CourseCreate
