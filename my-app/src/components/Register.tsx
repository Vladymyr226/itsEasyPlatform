import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'
import { setCookie } from 'cookies-next'
import Swal from 'sweetalert2'

const url = 'https://its-easy-platform-back-end.vercel.app/api/auth/register'

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
const theme = createTheme()

function cleanInputs() {
  const tmp = (document.getElementById('formSignIn') as HTMLFormElement).reset()
}

const Registration = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    userName: '',
    email: '',
    password: '',
  })

  function validateString(input: string) {
    const trimmedInput = input.trim()
    const pattern = /^[a-zA-Z0-9]{10,100}$/
    const isValidLength = trimmedInput.length >= 10 && trimmedInput.length <= 100
    const matchesPattern = pattern.test(trimmedInput)
    return isValidLength && matchesPattern
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      if (form.userName.trim().length < 3 || form.userName.trim().length >= 32) {
        Swal.fire('Username must be longer than 3 and shorter than 32 characters!', '', 'error')
        return
      }
      if (form.email.trim().length > 40) {
        Swal.fire('Email must be shorter than 40 characters!', '', 'error')
        return
      }
      if (!validateString(form.password)) {
        Swal.fire(
          'Password must be at least 10 characters long and contain only digits and letters!',
          '',
          'error'
        )
        return
      }

      const response = await axios.post(
        url + '?userName=' + form.userName + '&email=' + form.email + '&password=' + form.password,
        {}
      )
      const resultResponse = response.data
      if (resultResponse) {
        setCookie('jwt', resultResponse.token, { maxAge: 100 * 24 * 60 * 60 * 1000 })
        Swal.fire('You signed up successfully!', '', 'success')
        router.push('/admin')
      }
    } catch (error) {
      alert(error)
      Swal.fire('Sign up failure!', '', 'error')
      return
    }
  }

  return (
    <Box sx={{ background: 'none', width: '100%' }}>
      <Typography component='h1' variant='h5' sx={{ color: '#ffec3e' }}>
        Sign up
      </Typography>
      <Box component='form' id='formSignIn' onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin='normal'
          required
          fullWidth
          id='username'
          type='text'
          label='Username'
          name='username'
          autoComplete='login'
          autoFocus
          InputLabelProps={{
            sx: {
              color: '#ffec3e',
            },
          }}
          onChange={(e) => setForm({ ...form, userName: e.target.value })}
          sx={{ ...textFieldColors }}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='email'
          type='email'
          label='Email Address'
          name='email'
          autoComplete='email'
          autoFocus
          InputLabelProps={{
            sx: {
              color: '#ffec3e',
            },
          }}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          sx={{ ...textFieldColors }}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          name='password'
          label='Password'
          type='password'
          id='password'
          autoComplete='current-password'
          InputLabelProps={{
            sx: {
              color: '#ffec3e',
            },
          }}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          sx={{ ...textFieldColors }}
        />
        <Button
          type='submit'
          fullWidth
          variant='contained'
          sx={{
            mt: 2,
            mb: 2,
            background: '#ffec3e',
            color: '#0f0e16',
            fontWeight: 'bold',
            border: '2px solid #ffec3e',
            '&:hover': {
              backgroundColor: '#0f0e16',
              border: '2px solid #ffec3e',
              color: '#ffec3e',
              boxShadow: 'none',
            },
          }}
        >
          Sign Up
        </Button>
        <Link href={'./login'}>
          <Box
            sx={{
              color: '#ffec3e',
              textAlign: 'right',
              fontSize: '14px',
              '&:hover': {
                color: '#fff',
                cursor: 'pointer',
              },
            }}
          >
            Login now
          </Box>
        </Link>
      </Box>
    </Box>
  )
}

export default Registration
