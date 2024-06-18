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

const url = `${
  process.env.NEXT_PUBLIC_DEV !== 'dev'
    ? process.env.NEXT_PUBLIC_HEROKU_URL
    : process.env.NEXT_PUBLIC_LOCALHOST
}/api/auth/login?`

const Registration = () => {
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
          id='login'
          type='text'
          label='Login'
          name='login'
          autoComplete='login'
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
