import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'
import { setCookie } from 'cookies-next'
import Swal from 'sweetalert2'
import { Box, Button, TextField, IconButton } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

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
const url = `${process.env.NEXT_BACK_HOST_API}/auth/login?`

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const response = await axios.post(url + 'email=' + email + '&password=' + password)
      const resultResponse = response.data
      if (resultResponse) {
        router.push('/admin')
        localStorage.setItem('UserID', resultResponse.user.id)
        setCookie('jwt', resultResponse.token, { maxAge: 100 * 24 * 60 * 60 * 1000 })
      }
    } catch (error) {
      Swal.fire('Login failure!', '', 'error')
    }
  }
  const [showPass, setShowPass] = useState(false)
  return (
    <Box sx={{ background: 'none', width: '100%' }}>
      <Typography component='h1' variant='h5' sx={{ color: '#ffec3e' }}>
        Sign in
      </Typography>
      <Box component='form' id='formSignIn' onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
          onChange={(e) => setEmail(e.target.value)}
          InputLabelProps={{
            sx: {
              color: '#ffec3e',
            },
          }}
          sx={{
            ...textFieldColors,
            '& input:-internal-autofill-selected': {
              color: '#123',
            },
          }}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          name='password'
          label='Password'
          type={showPass ? 'text' : 'password'}
          id='password'
          autoComplete='current-password'
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{
            sx: {
              color: '#ffec3e',
            },
          }}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={(e) => {
                  setShowPass(!showPass)
                }}
              >
                {showPass ? (
                  <VisibilityOffIcon sx={{ color: '#ffec3e' }} fontSize='medium' />
                ) : (
                  <VisibilityIcon sx={{ color: '#ffec3e' }} fontSize='medium' />
                )}
              </IconButton>
            ),
          }}
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
          Sign In
        </Button>
        <Link href={'./register'}>
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
            Register now
          </Box>
        </Link>
      </Box>
    </Box>
  )
}

export default Login
