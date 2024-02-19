import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Drawer,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import MenuIcon from '@mui/icons-material/Menu'
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import './HeadingClient.css'
import { useDispatch, useSelector } from 'react-redux'
import { GetCart, setCart, setCartLogout } from '../../services/slices/cartSlice'
import { useEffect } from 'react'
import authenticationAPi from '../../api/authentication/authenticationAPi'
import { getCookie, removeCookie } from '../../services/cookie'
import confirmSatus from '../../components/comfirmSwal'
import { GetUser, removeUser } from '../../services/slices/userSlice'
import clientCartApi from '../../api/client/clientCartApi'
import { Logout } from '@mui/icons-material'
import SearchIcon from '@mui/icons-material/Search'
import { FiPhone } from 'react-icons/fi'
import { FiMapPin } from 'react-icons/fi'

export default function HeadingClient() {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [openMenuProfile, setOpenMenuProfile] = useState(false)
  const location = useLocation()
  const handleClick = (event) => {
    anchorEl === null ? setAnchorEl(event.currentTarget) : setAnchorEl(null)
    openMenuProfile === false ? setOpenMenuProfile(true) : setOpenMenuProfile(false)
  }
  const [activeIndex, setActiveIndex] = useState(-1) // Initialize with -1 (no active index)

  const handleLinkClick = (index) => {
    setOpenDrawer(false)
    setActiveIndex(index)
  }

  const user = useSelector(GetUser)

  useEffect(() => {
    // handleLinkClick(0)
    if (getCookie('ClientToken')) {
      authenticationAPi.getClient().then((response) => {
        if (response.data.success) {
          dispatch(setCart([]))
          clientCartApi.get().then(
            (result) => {
              if (result.data.success) {
                dispatch(
                  setCart(
                    result.data.data.map((cart) => {
                      return { ...cart, image: cart.image.split(',') }
                    }),
                  ),
                )
              }
            },
            () => {},
          )
        } else {
          removeCookie('ClientToken')
          dispatch(setCartLogout([]))
        }
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const amountProduct = useSelector(GetCart).length

  const BarSelect = () => {
    return (
      <>
        <Box mx={3} display={{ md: 'flex', xs: 'none' }} className="menu-title">
          <Typography
            onClick={() => {
              setOpenDrawer(false)
              handleLinkClick(0)
            }}
            component={Link}
            to="/"
            className={`link-with-underline ${location.pathname === '/home' ? 'active-link' : ''}`}
            sx={{
              fontFamily: 'monospace',
              fontSize: '17px',
              fontWeight: 600,
              textDecoration: 'none',
            }}>
            Trang chủ
          </Typography>
          <Typography
            onClick={() => {
              setOpenDrawer(false)
              handleLinkClick(1)
            }}
            className={`link-with-underline ${
              location.pathname === '/products' ? 'active-link' : ''
            }`}
            sx={{
              marginLeft: { md: 4 },
              fontFamily: 'monospace',
              fontSize: '17px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
            component={Link}
            to="/products">
            Sản phẩm
          </Typography>
          <Typography
            onClick={() => {
              setOpenDrawer(false)
              handleLinkClick(2)
            }}
            className={`link-with-underline ${
              location.pathname === '/about-us' ? 'active-link' : ''
            }`}
            sx={{
              marginLeft: { md: 4 },
              fontFamily: 'monospace',
              fontSize: '17px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
            component={Link}
            to="/about-us">
            Giới thiệu
          </Typography>
          <Typography
            onClick={() => {
              setOpenDrawer(false)
              handleLinkClick(3)
            }}
            className={`link-with-underline ${location.pathname === '/news' ? 'active-link' : ''}`}
            sx={{
              marginLeft: { md: 4 },
              fontFamily: 'monospace',
              fontSize: '17px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
            component={Link}
            to="/news">
            Tin tức
          </Typography>

          <Typography
            onClick={() => {
              setOpenDrawer(false)
              handleLinkClick(4)
            }}
            className={`link-with-underline ${
              location.pathname === '/contact' ? 'active-link' : ''
            }`}
            sx={{
              marginLeft: { md: 4 },
              fontFamily: 'monospace',
              fontSize: '17px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
            component={Link}
            to="/contact">
            Liên hệ
          </Typography>
          <Typography
            onClick={() => {
              setOpenDrawer(false)
              handleLinkClick(5)
            }}
            className={`link-with-underline ${
              location.pathname === '/tracking' ? 'active-link' : ''
            }`}
            sx={{
              color: 'black',
              marginLeft: { md: 4 },
              fontFamily: 'monospace',
              fontSize: '17px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
            component={Link}
            to="/tracking">
            Tra cứu
          </Typography>
        </Box>
        <Container
          maxWidth="xl"
          sx={{ backgroundColor: 'white', display: { md: 'none', xs: 'block' }, mt: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <IconButton
                sx={{
                  display: { md: 'none', xs: 'block' },
                  marginLeft: '-10px',
                  marginTop: '-5px',
                  height: '50px',
                  width: '50px',
                }}
                color="inherit">
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  width: '100%',
                  textAlign: 'center',
                }}>
                <Box
                  component="img"
                  sx={{
                    py: 0,
                    height: '50px',
                  }}
                  src={require('../../assets/image/TinTuc/logo_vip.jpg')}
                  alt="logo"
                />
              </Typography>
              <IconButton
                sx={{
                  display: { md: 'none', xs: 'block' },
                  marginRight: '-10px',
                  marginTop: '-15px',
                  height: '50px',
                  width: '50px',
                }}
                component={Link}
                to="/cart"
                color="inherit">
                <Badge badgeContent={amountProduct} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </div>
          </Stack>
        </Container>
      </>
    )
  }
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function handleAccount() {
    const title = 'Xác nhận đăng xuất tài khoản?'
    if (user) {
      confirmSatus(title, '').then((result) => {
        if (result.isConfirmed) {
          removeCookie('ClientToken')
          dispatch(setCartLogout([]))
          dispatch(removeUser())
        }
        navigate('/home')
      })
    } else {
      navigate('/home')
    }
  }

  return (
    <>
      <div
        style={{
          backgroundColor: '#F48A42',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          height: '30px',
        }}>
        <Typography
          sx={{
            fontSize: '15px',
            color: 'white',
            fontWeight: 700,
            animation: 'slideText 10s linear infinite alternate', // Added 'alternate'
          }}>
          Chào mừng bạn đến với shop giày thể thao F-SHOES
        </Typography>
        <style>
          {`
          @keyframes slideText {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}
        </style>
      </div>
      <Container
        maxWidth="xl"
        sx={{ backgroundColor: 'white', display: { md: 'block', xs: 'none' } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Box
            sx={{
              maxWidth: '30%',
              minWidth: '30%',
              fontSize: '30px',
              color: '#f2741f',
              display: { md: 'flex', xs: 'none' },
            }}>
            <FiPhone />
            <Typography sx={{ color: 'black', marginLeft: '5px', marginRight: '5px' }}>
              HOTLINE:1900 6750
            </Typography>{' '}
            <FiMapPin />
            <Link to="/contact" style={{ textDecoration: 'none' }}>
              <Typography
                sx={{
                  color: 'black',
                  marginLeft: '5px',
                  marginRight: '5px',
                  textDecoration: 'none',
                }}
                className="hethong">
                Hệ thống cửa hàng
              </Typography>
            </Link>
          </Box>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <IconButton
              sx={{
                display: { md: 'none', xs: 'block' },
                marginLeft: '-25px',
                marginTop: '-5px',
                height: '50px',
                width: '50px',
              }}
              color="inherit">
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                width: '100%',
                textAlign: 'center',
              }}>
              <Box
                component="img"
                sx={{
                  py: 0,
                  height: { md: '100px', xs: '60px' },
                }}
                src={require('../../assets/image/TinTuc/logo_vip.jpg')}
                alt="logo"
              />
            </Typography>
            <IconButton
              sx={{
                display: { md: 'none', xs: 'block' },
                marginRight: '-10px',
                marginTop: '-15px',
                height: '50px',
                width: '50px',
              }}
              component={Link}
              to="/cart"
              color="inherit">
              <Badge badgeContent={amountProduct} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </div>
          <Box
            sx={{
              maxWidth: '30%',
              minWidth: '30%',
              display: { md: 'flex', xs: 'none' },
              justifyContent: 'right',
            }}>
            <TextField
              size="small"
              fullWidth
              sx={{ borderRadius: '5px', height: '10px' }}
              placeholder="Tìm kiếm sản phẩm"
              className="search-product-home"
              InputProps={{
                endAdornment: <SearchIcon />,
              }}
            />
            <IconButton
              component={Link}
              to="/cart"
              color="inherit"
              sx={{ width: '50px', height: '50px', marginTop: '-5px', mx: 2 }}>
              <Badge badgeContent={amountProduct} color="error">
                <ShoppingCartIcon sx={{ width: '30px', height: '30px' }} />
              </Badge>
            </IconButton>
            <IconButton
              sx={{ width: '50px', height: '50px', marginTop: '-5px' }}
              onClick={(event) => handleClick(event)}
              color="inherit">
              <Avatar src={user && user.avatar} sx={{ width: 40, height: 40 }} />
              <Menu
                anchorEl={anchorEl}
                open={openMenuProfile}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      '& .MuiAvatar-root': {
                        width: 40,
                        height: 40,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 3,
                        right: 20,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                {user ? (
                  <>
                    <Link to={`/profile/user`} style={{ textDecoration: 'none', color: 'black' }}>
                      <MenuItem>
                        <Avatar src={user && user.avatar} sx={{ width: 40, height: 40 }} /> Tài
                        khoản của tôi
                      </MenuItem>
                    </Link>
                    <MenuItem style={{ color: 'black' }} onClick={() => handleAccount()}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Đăng xuất
                    </MenuItem>
                  </>
                ) : (
                  <Link to={`/login`} style={{ textDecoration: 'none', color: 'black' }}>
                    <MenuItem>
                      <Avatar /> Đăng nhập
                    </MenuItem>
                  </Link>
                )}
              </Menu>
            </IconButton>
          </Box>
        </Stack>
      </Container>
      <AppBar position="sticky" sx={{ height: '50px', backgroundColor: 'white', color: 'black' }}>
        <Box
          sx={{
            display: 'flex',
            height: '60px',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Box sx={{ flexGrow: 1 }}>
            <Box>
              <BarSelect />
            </Box>
          </Box>
        </Box>
      </AppBar>
    </>
  )
}
