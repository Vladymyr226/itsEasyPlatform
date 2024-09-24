import Image from 'next/image'
import arrow from '../../assets/arrow.svg'

import s from './LanguageSwitcher.module.css'
import { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { useRouter as detailedRouter } from 'next/router'
const LanguageSwitcher = () => {
  const [isLanguageShown, setIsLanguageShown] = useState(false)
  const [isLanguageShownForDropModal, setIsLanguageShownForDropModal] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const routerLocale = detailedRouter()
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }

    setIsModalOpen(isModalOpen)
  }, [isModalOpen])
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        if (!isLanguageShownForDropModal) {
          setTimeout(() => {
            setIsLanguageShown(false)
          }, 200)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setIsLanguageShown])

  return (
    <div className={s.languageSwitcher}>
      <div
        onClick={() => {
          if (!isLanguageShown) {
            setIsLanguageShown(true)
            setIsLanguageShownForDropModal(true)
          } else {
            setIsLanguageShown(false)
            setIsLanguageShownForDropModal(false)
          }
        }}
        style={{ display: 'flex', gap: '4px' }}
      >
        {routerLocale.locale == 'ru' && (
          <Box
            sx={{
              padding: '10px',
              cursor: 'pointer',
              '&:hover': {
                background: '#28263a',
              },
              display: 'flex',
            }}
          >
            <div style={{ height: '20px', width: '20px' }}>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 6' width='35' height='20'>
                <rect fill='#c7c6c6' width='9' height='3' />
                <rect fill='#d52b1e' y='3' width='9' height='3' />
                <rect fill='#0039a6' y='2' width='9' height='2' />
              </svg>
            </div>
            <div style={{ marginLeft: '20px' }}>RU</div>
            <Image src={arrow} style={{ marginLeft: '5px', marginRight: '10px' }} alt='arrow' />
          </Box>
        )}
        {routerLocale.locale == 'ua' && (
          <Box
            sx={{
              padding: '10px',
              cursor: 'pointer',
              '&:hover': {
                background: '#28263a',
              },
              display: 'flex',
            }}
          >
            <div style={{ height: '20px', width: '20px', position: 'relative' }}>
              <svg xmlns='http://www.w3.org/2000/svg' width='35' height='20'>
                <rect width='1200' height='10' fill='#0057B7' />
                <rect width='1200' height='10' y='10' fill='#FFD700' />
              </svg>
            </div>
            <div style={{ marginLeft: '20px' }}>UA</div>
            <Image src={arrow} style={{ marginLeft: '5px', marginRight: '10px' }} alt='arrow' />
          </Box>
        )}
        {routerLocale.locale == 'en' && (
          <Box
            sx={{
              padding: '10px',
              cursor: 'pointer',
              '&:hover': {
                background: '#28263a',
              },
              display: 'flex',
            }}
          >
            <div style={{ height: '20px', width: '20px', position: 'relative' }}>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 30' width='35' height='20'>
                <clipPath id='t'>
                  <path d='M25,15h25v15zv15h-25zh-25v-15zv-15h25z' />
                </clipPath>
                <path d='M0,0v30h50v-30z' fill='#012169' />
                <path d='M0,0 50,30M50,0 0,30' stroke='#c7c6c6' stroke-width='6' />
                <path
                  d='M0,0 50,30M50,0 0,30'
                  clip-path='url(#t)'
                  stroke='#C8102E'
                  stroke-width='4'
                />
                <path
                  d='M-1 11h22v-12h8v12h22v8h-22v12h-8v-12h-22z'
                  fill='#C8102E'
                  stroke='#c7c6c6'
                  stroke-width='2'
                />
              </svg>
            </div>
            <div style={{ marginLeft: '20px' }}>EN</div>
            <Image src={arrow} style={{ marginLeft: '5px', marginRight: '10px' }} alt='arrow' />
          </Box>
        )}
      </div>
      {isLanguageShown && (
        <div
          ref={divRef}
          style={{
            marginTop: '130px',
            width: 'fit-content',
            background: '#171622',
            position: 'absolute',
            zIndex: 4,
            border: '1px solid #28263a',
          }}
        >
          {routerLocale.locale != 'ru' && (
            <Box
              sx={{
                padding: '10px',
                paddingRight: '22px',
                cursor: 'pointer',
                '&:hover': {
                  background: '#28263a',
                },
                display: 'flex',
              }}
              onClick={(e) => {
                const path = routerLocale.asPath
                setIsLanguageShown(false)
                routerLocale.push(path, path, { locale: 'ru' })
              }}
            >
              <div style={{ height: '20px', width: '20px' }}>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 6' width='35' height='20'>
                  <rect fill='#c7c6c6' width='9' height='3' />
                  <rect fill='#d52b1e' y='3' width='9' height='3' />
                  <rect fill='#0039a6' y='2' width='9' height='2' />
                </svg>
              </div>
              <div style={{ marginLeft: '20px' }}>RU</div>
            </Box>
          )}
          {routerLocale.locale != 'ua' && (
            <Box
              sx={{
                padding: '10px',
                paddingRight: '22px',
                cursor: 'pointer',
                '&:hover': {
                  background: '#28263a',
                },
                display: 'flex',
                width: '100%',
              }}
              onClick={(e) => {
                const path = routerLocale.asPath
                setIsLanguageShown(false)
                routerLocale.push(path, path, { locale: 'ua' })
              }}
            >
              <div style={{ height: '20px', width: '20px', position: 'relative' }}>
                <svg xmlns='http://www.w3.org/2000/svg' width='35' height='20'>
                  <rect width='1200' height='10' fill='#0057B7' />
                  <rect width='1200' height='10' y='10' fill='#FFD700' />
                </svg>
              </div>
              <div style={{ marginLeft: '20px' }}>UA</div>
            </Box>
          )}
          {routerLocale.locale != 'en' && (
            <Box
              sx={{
                padding: '10px',
                paddingRight: '22px',
                cursor: 'pointer',
                '&:hover': {
                  background: '#28263a',
                },
                display: 'flex',
                width: '100%',
              }}
              onClick={(e) => {
                const path = routerLocale.asPath
                setIsLanguageShown(false)
                routerLocale.push(path, path, { locale: 'en' })
              }}
            >
              <div style={{ height: '20px', width: '20px', position: 'relative' }}>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 30' width='35' height='20'>
                  <clipPath id='t'>
                    <path d='M25,15h25v15zv15h-25zh-25v-15zv-15h25z' />
                  </clipPath>
                  <path d='M0,0v30h50v-30z' fill='#012169' />
                  <path d='M0,0 50,30M50,0 0,30' stroke='#c7c6c6' stroke-width='6' />
                  <path
                    d='M0,0 50,30M50,0 0,30'
                    clip-path='url(#t)'
                    stroke='#C8102E'
                    stroke-width='4'
                  />
                  <path
                    d='M-1 11h22v-12h8v12h22v8h-22v12h-8v-12h-22z'
                    fill='#C8102E'
                    stroke='#c7c6c6'
                    stroke-width='2'
                  />
                </svg>
              </div>
              <div style={{ marginLeft: '20px' }}>EN</div>
            </Box>
          )}
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher
