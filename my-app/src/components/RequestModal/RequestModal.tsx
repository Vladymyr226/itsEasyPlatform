import s from './RequestModal.module.css'

import cross from '../../assets/cross.svg'
import crossHover from '../../assets/crossHover.svg'
import shadow from '../../assets/shadows/courseHoverShadow.png'
import { useEffect, useState } from 'react'
import Image from 'next/image'

const RequestModal = ({ setIsModalOpen }: { setIsModalOpen: (isOpen: boolean) => void }) => {
  const [isCrossHover, setIsCrossHover] = useState(false)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const onEscClose = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        setIsModalOpen(false)
      }
    }

    window.addEventListener('keydown', onEscClose)
    return () => {
      window.removeEventListener('keydown', onEscClose)
    }
  }, [setIsModalOpen])

  return (
    <div
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        if (event.target === event.currentTarget) {
          setIsModalOpen(false)
        }
      }}
      className={s.backdrop}
    >
      <div className={s.requestModal}>
        <p className={s.modalTitle}>
          <span className={s.accentuated}>Backend</span> разработчик
        </p>
        <form className={s.requestForm} autoComplete='off'>
          <label className={s.label}>
            Имя Фамилия
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${s.input} ${name ? s.filledInput : ''}`}
              type='text'
            />
          </label>
          <label className={s.label}>
            Номер телефона
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`${s.input} ${phone ? s.filledInput : ''}`}
              type='tel'
            />
          </label>
          <label className={s.label}>
            Адрес электронной почты
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${s.input} ${email ? s.filledInput : ''}`}
              type='email'
            />
          </label>
          <button disabled={!name || !phone || !email} className={s.submitButton} type='submit'>
            Отправить заявку
          </button>
        </form>

        <Image
          onMouseEnter={() => {
            setIsCrossHover(true)
          }}
          onMouseLeave={() => {
            setIsCrossHover(false)
          }}
          onClick={() => {
            setIsModalOpen(false)
            setIsCrossHover(false)
          }}
          className={s.modalClose}
          src={isCrossHover ? crossHover : cross}
          alt='cross'
        />
      </div>
      <Image className={s.shadow} src={shadow} alt='shadow' />
    </div>
  )
}

export default RequestModal
