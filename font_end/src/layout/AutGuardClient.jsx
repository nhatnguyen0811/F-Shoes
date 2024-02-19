import { useEffect, useState } from 'react'
import { getCookie, removeCookie } from '../services/cookie'
import authenticationAPi from '../api/authentication/authenticationAPi'
import { useDispatch } from 'react-redux'
import { addUser, removeUser } from '../services/slices/userSlice'
import ThemeAdmin from '../services/theme/ThemeAdmin'
import { Box } from '@mui/material'
import { setCartLogout } from '../services/slices/cartSlice'

export default function AutGuardClient({ children }) {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const token = getCookie('ClientToken')

  useEffect(() => {
    if (token) {
      authenticationAPi
        .getClient(token)
        .then(
          (response) => {
            if (response.data.success && response.data.data.role === 2) {
              dispatch(addUser(response.data.data))
            } else {
              removeCookie('ClientToken')
              dispatch(setCartLogout([]))
              dispatch(removeUser())
            }
          },
          () => {
            removeCookie('ClientToken')
            dispatch(setCartLogout([]))
            dispatch(removeUser())
          },
        )
        .finally(() => {
          setLoading(true)
        })
    } else setLoading(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ThemeAdmin>
      <Box sx={{ backgroundColor: 'rgba(249, 249, 246, 0.985)' }}>{loading && children}</Box>
    </ThemeAdmin>
  )
}
