import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
const url = 'https://its-easy-platform-back-end.vercel.app/api/auth/login?'

const options = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials
        try {
          const response = await axios.get(url + 'email=' + email + '&password=' + password)
          return { id: '1' }
          return response.data
          const resultResponse = response.data
          console.log(resultResponse)
          const user = null
          if (!user) {
            return null
          }
          const passwordMatch = await bcrypt.compare(password, user.password)
          if (!passwordMatch) {
            return null
          }
          return user
        } catch (error) {}
      },
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/admin/login',
  },
}

const handler = NextAuth(options)

export { handler as GET, handler as POST }
