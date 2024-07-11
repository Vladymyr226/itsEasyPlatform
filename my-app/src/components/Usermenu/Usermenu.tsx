import s from './Usermenu.module.css'
import DropModal from '../../components/DropModal/DropModal'
import { useEffect, useState } from 'react'
import study from '../../assets/study.svg'
import heart from '../../assets/emptyHeart.svg'
import teacher from '../../assets/teacher.svg'
import logout from '../../assets/logout.svg'
import RequestModal from '../../components/RequestModal/RequestModal'
import Image from 'next/image'
import { deleteCookie } from 'cookies-next'
import Swal from 'sweetalert2'
import Link from 'next/link'
import { getLocale } from '@/utils/getLocale'

const Usermenu = () => {
  const [isUsermenuShown, setIsUsermenuShown] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }

    setIsModalOpen(isModalOpen)
  }, [isModalOpen])
  const t = getLocale()
  return (
    <div className={s.userAvatarWrapper}>
      <div onClick={() => setIsUsermenuShown(true)} className={s.userAvatar}>
        AB
      </div>

      {isUsermenuShown && (
        <DropModal isUsermenu={true} setIsDropModalShown={setIsUsermenuShown}>
          <Link href={'/personal-cabinet/my-courses'}>
            <div className={s.usermenuItem}>
              <Image src={study} alt='study' />
              <p>{t.my_education}</p>
            </div>
          </Link>
          <div className={s.usermenuItem}>
            <Image src={heart} alt='heart' />
            <p>{t.my_favorites}</p>
          </div>
          <div
            onClick={() => {
              setIsModalOpen(true)
              setIsUsermenuShown(false)
            }}
            className={s.usermenuItem}
          >
            <Image src={teacher} alt='teacher' />
            <p>{t.become_a_lector}</p>
          </div>
          <div
            className={s.usermenuItem}
            onClick={(e) => {
              deleteCookie('jwt')
              localStorage.removeItem('UserID')
              Swal.fire('You logged out successfully', '', 'success')
            }}
          >
            <Image src={logout} alt='logout' />
            <p>{t.logout}</p>
          </div>
        </DropModal>
      )}

      {isModalOpen && <RequestModal setIsModalOpen={setIsModalOpen} />}
    </div>
  )
}

export default Usermenu
