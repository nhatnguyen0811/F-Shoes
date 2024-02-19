import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import authenticationAPi from '../api/authentication/authenticationAPi'
import { addUserAdmin, removeUserAdmin } from '../services/slices/userAdminSlice'
import { getCookie, removeCookie } from '../services/cookie'
import { Navigate, useNavigate } from 'react-router-dom'

export default function AutGuard({ children }) {
  const [loading, setLoading] = useState(false)
  const [check, setCheck] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const token = getCookie('AdminToken')
    checkRole(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children])

  async function checkRole(token) {
    try {
      const response = await authenticationAPi.getAdmin(token)
      if (response.data.success && response.data.data.role !== 2) {
        dispatch(addUserAdmin(response.data.data))
        setCheck(true)
        setLoading(true)
      } else {
        removeCookie('AdminToken')
        dispatch(removeUserAdmin())
        navigate('/admin/login')
      }
      setLoading(true)
    } catch (error) {
      console.error(error)
      removeCookie('AdminToken')
      dispatch(removeUserAdmin())
      navigate('/admin/login')
    }
  }

  if (!loading) {
    return <></>
  } else {
    if (check) {
      return children
    } else {
      return <Navigate to={'/not-authorization'} />
    }
  }
}
