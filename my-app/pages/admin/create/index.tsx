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
              maxWidth: '600px',
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
                    <Select
                      fullWidth
                      labelId='languageSelect'
                      id='languageSelect'
                      value={language}
                      label='Language'
                      onChange={handleChangeLanguage}
                      sx={{
                        marginTop: 2,
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
                    <Select
                      fullWidth
                      labelId='levelSelect'
                      id='levelSelect'
                      value={level}
                      label='Level'
                      onChange={handleChangeLevel}
                      sx={{
                        marginTop: 2,
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
                    <Select
                      fullWidth
                      labelId='typeSelect'
                      id='typeSelect'
                      value={type}
                      label='Type'
                      onChange={handleChangeType}
                      sx={{
                        marginTop: 2,
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
                    <Select
                      fullWidth
                      labelId='Status'
                      id='statusSelect'
                      value={type}
                      label='Type'
                      onChange={handleChangeType}
                      sx={{
                        marginTop: 2,
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
                </LocalizationProvider>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                Item Two
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
