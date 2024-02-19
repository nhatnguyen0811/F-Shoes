import { AccountCircle } from '@mui/icons-material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Input,
  InputAdornment,
  InputLabel,
  Paper,
  Stack,
  Tab,
  Tabs,
  ThemeProvider,
  Typography,
} from '@mui/material'
import Google from '../../assets/image/google.svg'
import LockIcon from '@mui/icons-material/Lock'
import EmailIcon from '@mui/icons-material/Email'
import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ColorCustom } from '../../styles/ColorCustom'
import authenticationAPi from '../../api/authentication/authenticationAPi'
import { toast } from 'react-toastify'
import { getCookie, setCookie } from '../../services/cookie'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../../services/slices/userSlice'
import clientCartApi from '../../api/client/clientCartApi'
import { GetCart, setCart } from '../../services/slices/cartSlice'
import confirmSatus from '../../components/comfirmSwal'
import { setLoading } from '../../services/slices/loadingSlice'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

const InputForm = ({ label, Icon, id, isPass, defaultValue, chagneValue }) => {
  const [showPass, setShowPass] = useState(false)
  return (
    <FormControl variant="standard" sx={{ width: '100%', marginBottom: '25px' }}>
      <InputLabel htmlFor={id} sx={{ color: 'black' }}>
        {label}
      </InputLabel>
      <Input
        onChange={(e) => {
          chagneValue(e.target.value)
        }}
        defaultValue={defaultValue}
        sx={{ fontFamily: 'monospace' }}
        id={id}
        type={isPass && !showPass ? 'password' : 'text'}
        endAdornment={
          <InputAdornment position="end">
            {isPass && (
              <Button
                onClick={() => {
                  setShowPass(!showPass)
                }}
                sx={{ minHeight: 0, minWidth: 0, padding: 0 }}>
                {showPass ? (
                  <VisibilityOffIcon sx={{ color: 'black' }} />
                ) : (
                  <RemoveRedEyeIcon sx={{ color: 'black' }} />
                )}
              </Button>
            )}
          </InputAdornment>
        }
        startAdornment={
          <InputAdornment position="start">
            <Icon sx={{ color: 'black' }} />
          </InputAdornment>
        }
      />
    </FormControl>
  )
}

const RegisterPanel = ({ setValue }) => {
  const [user, setUser] = useState({
    email: '',
    password: '',
    name: '',
    repass: '',
  })
  const [errors, setErrors] = useState({})

  const navigate = useNavigate()
  function validate(fieldName, value) {
    let newErrors = { ...errors }

    // Kiểm tra email
    if (fieldName === 'email') {
      newErrors.email = null
      if (!value || !value.trim()) {
        newErrors.email = 'Vui lòng nhập địa chỉ email.'
      } else if (!/\S+@\S+\.\S+/.test(value.trim())) {
        newErrors.email = 'Địa chỉ email không hợp lệ.'
      }
    }

    // Kiểm tra mật khẩu
    if (fieldName === 'password') {
      newErrors.password = null
      if (!value || !value.trim()) {
        newErrors.password = 'Vui lòng nhập mật khẩu.'
      } else if (value.trim().length < 6) {
        newErrors.password = 'Mật khẩu phải chứa ít nhất 6 ký tự.'
      }
    }

    // Kiểm tra tên
    if (fieldName === 'name') {
      newErrors.name = null
      if (!value || !value.trim()) {
        newErrors.name = 'Vui lòng nhập tên.'
      }
    }

    // Kiểm tra mật khẩu nhập lại
    if (fieldName === 'repass') {
      newErrors.repass = null
      if (!value || !value.trim()) {
        newErrors.repass = 'Vui lòng nhập lại mật khẩu.'
      } else if (value.trim() !== user.password.trim()) {
        newErrors.repass = 'Mật khẩu nhập lại không khớp.'
      }
    }

    setErrors(newErrors)

    // Trả về true nếu không có lỗi, ngược lại false
    return Object.keys(newErrors).length === 0
  }
  function validateAll() {
    let newErrors = {}

    // Kiểm tra email
    if (!user.email || !user.email.trim()) {
      newErrors.email = 'Vui lòng nhập địa chỉ email.'
    } else if (!/\S+@\S+\.\S+/.test(user.email.trim())) {
      newErrors.email = 'Địa chỉ email không hợp lệ.'
    }

    // Kiểm tra mật khẩu
    if (!user.password || !user.password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu.'
    } else if (user.password.trim().length < 6) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất 6 ký tự.'
    }

    // Kiểm tra tên
    if (!user.name || !user.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên.'
    }

    // Kiểm tra mật khẩu nhập lại
    if (!user.repass || !user.repass.trim()) {
      newErrors.repass = 'Vui lòng nhập lại mật khẩu.'
    } else if (user.repass.trim() !== user.password.trim()) {
      newErrors.repass = 'Mật khẩu nhập lại không khớp.'
    }

    setErrors(newErrors)

    // Trả về true nếu không có lỗi, ngược lại false
    return Object.keys(newErrors).length === 0
  }

  function handleInputChange(fieldName, value) {
    setUser((prevUser) => ({ ...prevUser, [fieldName]: value }))
    validate(fieldName, value)
  }
  const dispatch = useDispatch()
  async function submit() {
    let isValid = validateAll()

    try {
      const response = await authenticationAPi.checkMail(user.email)

      if (response.data.success) {
        isValid = false
        setErrors({ email: 'Địa chỉ email đã tồn tại trong hệ thống.' })
      }

      if (isValid) {
        const title = 'Xác nhận đăng ký tài khoản'
        const result = await confirmSatus(title, '')

        if (result.isConfirmed) {
          dispatch(setLoading(true))
          authenticationAPi.register(user.email, user.password, user.name).then(
            (response) => {
              if (response.data.success) {
                toast.success('Đăng ký thành công!')
                setValue(0)
              }
            },
            () => {},
          )
        }
      }
    } catch (error) {
      console.error('Error while checking email:', error)
    }
    dispatch(setLoading(false))
  }

  return (
    <Box>
      <InputForm
        chagneValue={(e) => handleInputChange('name', e)}
        label="Họ và tên *"
        Icon={AccountCircle}
        id="reg-input-user"
      />
      {errors.name && (
        <div style={{ color: 'red', fontSize: '13px', marginTop: '-20px', paddingBottom: '20px' }}>
          {errors.name}
        </div>
      )}
      <InputForm
        chagneValue={(e) => handleInputChange('email', e)}
        label="Địa chỉ email *"
        Icon={EmailIcon}
        id="reg-input-email"
        type="email"
      />
      {errors.email && (
        <div style={{ color: 'red', fontSize: '13px', marginTop: '-20px', paddingBottom: '20px' }}>
          {errors.email}
        </div>
      )}
      <InputForm
        chagneValue={(e) => handleInputChange('password', e)}
        label="Mật khẩu *"
        Icon={LockIcon}
        id="reg-input-pass"
        isPass={true}
      />
      {errors.password && (
        <div style={{ color: 'red', fontSize: '13px', marginTop: '-20px', paddingBottom: '20px' }}>
          {errors.password}
        </div>
      )}
      <InputForm
        chagneValue={(e) => handleInputChange('repass', e)}
        isPass={true}
        label="Nhập lại mật khẩu *"
        Icon={LockIcon}
        id="reg-input-repass"
      />
      {errors.repass && (
        <div style={{ color: 'red', fontSize: '13px', marginTop: '-20px', paddingBottom: '20px' }}>
          {errors.repass}
        </div>
      )}

      <ThemeProvider theme={ColorCustom}>
        <Button
          onClick={submit}
          type="submit"
          variant="contained"
          color="neutral"
          sx={{ marginRight: '15px' }}>
          Đăng ký
        </Button>
      </ThemeProvider>
    </Box>
  )
}

const LoginPanel = () => {
  const [user, setUser] = useState({
    email: 'nguyenthithuyduong948@gmail.com',
    password: 'thuyduongxih',
  })
  const [error, SetError] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const submit = (e) => {
    e.preventDefault()
    return authenticationAPi.login(user.email, user.password).then(
      (response) => {
        if (response.data.success) {
          setCookie('ClientToken', response.data.data, 7)
          toast.success('Đăng nhập thành công!')
          SetError(null)
          authenticationAPi.getClient().then((response) => {
            dispatch(addUser(response.data.data))
          })
          fetchCart()
          navigate(-1)
        } else {
          toast.error('Đăng nhập thất bại!')
          SetError('Tài khoản hoặc mật khẩu không chính xác')
        }
      },
      (err) => {
        toast.error('Lỗi hệ thống vui lòng thử lại!')
      },
    )
  }

  const cartLocal = useSelector(GetCart)

  function fetchCart() {
    if (getCookie('ClientToken')) {
      clientCartApi.get().then(
        (result) => {
          if (result.data.success) {
            const cartDB = result.data.data.map((cart) => {
              return { ...cart, image: cart.image.split(',') }
            })

            const newCart = cartLocal.map((cart) => ({ ...cart })) // Tạo bản sao của cartLocal

            cartDB.forEach((cartDBItem) => {
              const existingCartItem = newCart.find(
                (cartLocalItem) => cartLocalItem.id === cartDBItem.id,
              )

              if (existingCartItem) {
                existingCartItem.soLuong += cartDBItem.soLuong
              } else {
                newCart.push(cartDBItem)
              }
            })

            dispatch(setCart(newCart))
          }
        },
        () => {},
      )
    }
  }
  function loginGoogle(data) {
    authenticationAPi.loginGoogle(data.email, data.name, data.picture).then(
      (response) => {
        if (response.data.success) {
          setCookie('ClientToken', response.data.data, 7)
          toast.success('Đăng nhập thành công!')
          SetError(null)
          authenticationAPi.getClient().then((response) => {
            dispatch(addUser(response.data.data))
          })
          fetchCart()
          navigate(-1)
        } else {
          toast.error('Đăng nhập thất bại!')
        }
      },
      () => {},
    )
  }
  return (
    <Box>
      <InputForm
        chagneValue={(e) => {
          setUser({ ...user, email: e })
        }}
        label="Địa chỉ email của bạn *"
        Icon={AccountCircle}
        id="login-input-user"
        defaultValue={user.email}
      />
      <InputForm
        chagneValue={(e) => {
          setUser({ ...user, password: e })
        }}
        defaultValue={user.password}
        label="Mật khẩu *"
        Icon={LockIcon}
        id="login-input-password"
        isPass={true}
      />
      {error && <Typography color={'red'}>{error}</Typography>}
      <Box my={1}>
        <ThemeProvider theme={ColorCustom}>
          <Stack direction="row" spacing={2}>
            <Button
              onClick={submit}
              type="submit"
              variant="contained"
              color="neutral"
              sx={{ marginRight: '15px' }}>
              Đăng nhập
            </Button>
            <GoogleOAuthProvider clientId="520968091112-fcbec2sb49beti8ugc2rmqngkdobq4j7.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  var decoded = jwtDecode(credentialResponse.credential)
                  loginGoogle(decoded)
                }}
                onError={() => {
                  toast.error('Đăng nhập google không thành công!')
                }}
              />
            </GoogleOAuthProvider>
          </Stack>
        </ThemeProvider>
      </Box>
      <Typography variant="a" component={Link} to={'/forgot-password'}>
        Quên mật khẩu?
      </Typography>
    </Box>
  )
}

export default function Login() {
  const [value, setValue] = React.useState(0)

  const token = getCookie('ClientToken')
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  return token ? (
    <Navigate to={'/home'} />
  ) : (
    <Container maxWidth={'sm'} sx={{ my: 6 }}>
      <Paper elevation={3} sx={{ padding: '20px', my: 10 }}>
        <Tabs
          sx={{ mb: 3 }}
          value={value}
          onChange={handleChange}
          aria-label="disabled tabs example">
          <Tab
            label="Đăng nhập"
            sx={{
              fontWeight: '800',
              textTransform: 'none',
              fontFamily: 'monospace',
              fontSize: '20px',
              color: 'black',
            }}
          />
          <Tab
            label="Đăng ký"
            sx={{
              fontWeight: '800',
              textTransform: 'none',
              fontFamily: 'monospace',
              fontSize: '20px',
              color: 'black',
            }}
          />
        </Tabs>
        {value === 0 ? <LoginPanel /> : <RegisterPanel setValue={setValue} />}
      </Paper>
    </Container>
  )
}
