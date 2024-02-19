import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import AdminMenu from './AdminMenu'
import {
  Avatar,
  Badge,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material'
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai'
import { IoMdNotificationsOutline } from 'react-icons/io'
import ThemeAdmin from '../services/theme/ThemeAdmin'
import '../assets/styles/admin.css'
import { removeCookie } from '../services/cookie'
import { Link, useNavigate } from 'react-router-dom'
import { Logout } from '@mui/icons-material'
import confirmSatus from '../components/comfirmSwal'
import KeyIcon from '@mui/icons-material/Key'
import { useDispatch, useSelector } from 'react-redux'
import { GetUserAdmin } from '../services/slices/userAdminSlice'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'
import { socketUrl } from '../services/url'
import dayjs from 'dayjs'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import { GetApp, setApp } from '../services/slices/appSlice'
import notificationApi from '../api/admin/notification/notificationApi'

var stompClient = null
export default function AppBarAdmin({ children }) {
  const [notification, setNotification] = useState([])
  const [drawerWidth, setDrawerWidth] = useState('17vw')

  const navigate = useNavigate()
  const user = useSelector(GetUserAdmin)
  const app = useSelector(GetApp)

  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const [openMenuProfile, setOpenMenuProfile] = useState(false)

  function handleDisconnectAction() {
    if (app && app.length > 0) {
      const mess = { idOrder: null }
      app.forEach((e) => {
        stompClient.send(`/topic/app-online/${e.idApp}`, {}, JSON.stringify(mess))
      })
      dispatch(setApp([]))
    }
  }

  async function fetchNotification() {
    try {
      const response = await notificationApi.getAll()
      if (response.status === 200 && response.data.success) {
        setNotification(response.data.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchNotification()
    stompClient = Stomp.over(() => new SockJS(socketUrl))
    stompClient.connect({}, onConnect)
    stompClient.onclose = () => {
      handleDisconnectAction()
    }
    return () => {
      stompClient.disconnect()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  window.addEventListener('beforeunload', function (event) {
    handleDisconnectAction()
  })

  // Xử lý sự kiện mất mạng (offline)
  window.addEventListener('offline', () => {
    handleDisconnectAction()
  })

  async function getNotification(data) {
    try {
      const response = await notificationApi.save(data)
      if (response.status === 200) {
        fetchNotification()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const NotificationButton = () => {
    const [anchorEl, setAnchorEl] = useState(null)

    const handleButtonClick = (event) => {
      setAnchorEl(event.currentTarget)
    }
    const navigate = useNavigate()

    const handleClose = () => {
      setAnchorEl(null)
    }

    //viet api update status notify
    const xemThongBao = async (notification) => {
      try {
        const response = await notificationApi.read(notification.id)
        if (response.status === 200) {
          fetchNotification()
          setAnchorEl(null)
          navigate('/admin/bill-detail/' + notification.idRedirect)
        }
      } catch (error) {
        console.error(error)
      }
    }

    return (
      <div>
        <Tooltip title="Thông báo">
          <IconButton size="small" sx={{ m: 1.5, color: 'black' }} onClick={handleButtonClick}>
            <Badge
              invisible={notification.filter((e) => e.status === 'HOAT_DONG').length <= 0}
              color="error"
              badgeContent={notification.filter((e) => e.status === 'HOAT_DONG').length}>
              <Box component={IoMdNotificationsOutline} sx={{ fontSize: '25px' }} />
            </Badge>
          </IconButton>
        </Tooltip>

        {notification.length > 0 && (
          <Menu
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: 'auto',
                  filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.32))',
                  mt: 0.5,
                  backgroundColor: 'white',
                  '&::-webkit-scrollbar': {
                    width: '0px',
                  },
                },
              },
            }}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
            {notification
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((notification, index) => (
                <>
                  <MenuItem
                    key={index}
                    onClick={() => {
                      xemThongBao(notification, index)
                    }}
                    sx={{
                      margin: '3px',
                      borderRadius: '5px',
                      backgroundColor: 'white',
                    }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        maxWidth: '300px',
                        width: '300px',
                        height: '70px',
                      }}>
                      <Grid container spacing={2}>
                        <Grid item xs={3}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              width: '70px',
                              height: '70px',
                              borderRadius: '50%',
                            }}>
                            <img
                              src={
                                notification.image
                                  ? notification.image
                                  : 'https://res.cloudinary.com/dioxktgsm/image/upload/v1701498532/zl87yxsvlm2luo5rjnyl.png'
                              }
                              alt=""
                              width="60px"
                              height="60px"
                              style={{
                                borderRadius: '50%',
                              }}
                            />
                          </div>{' '}
                        </Grid>
                        <Grid item xs={8}>
                          <div
                            style={{
                              flexDirection: 'column',
                              wordWrap: 'break-word',
                              marginLeft: '5px',
                            }}>
                            {notification.status === 'HOAT_DONG' ? (
                              <span>
                                <b>{notification.title}</b>
                                <p style={{ margin: 0 }}>{notification.content} </p>
                              </span>
                            ) : (
                              <span style={{ color: 'gray' }}>
                                <b>{notification.title}</b>
                                <p style={{ margin: 0 }}>{notification.content} </p>
                              </span>
                            )}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                              }}>
                              {notification.status === 'HOAT_DONG' ? (
                                <AccessTimeFilledIcon
                                  sx={{
                                    width: '17px',
                                    color: '#FC7C27',
                                    marginRight: '5px',
                                  }}
                                />
                              ) : (
                                <AccessTimeFilledIcon
                                  sx={{
                                    width: '17px',
                                    color: 'gray',
                                    marginRight: '5px',
                                  }}
                                />
                              )}
                              {notification.status === 'HOAT_DONG' ? (
                                <span style={{ color: '#FC7C27' }}>
                                  {dayjs(notification.createdAt).fromNow()}
                                </span>
                              ) : (
                                <span style={{ color: 'gray' }}>
                                  {dayjs(notification.createdAt).fromNow()}
                                </span>
                              )}
                            </div>
                          </div>
                        </Grid>
                        <Grid item xs={1}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              width: '15px',
                              height: '70px',
                            }}>
                            {notification.status === 'HOAT_DONG' ? (
                              <div
                                style={{
                                  height: '15px',
                                  width: '15px',
                                  backgroundColor: '#FC7C27',
                                  borderRadius: '50%',
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  height: '15px',
                                  width: '15px',
                                  backgroundColor: 'gray',
                                  borderRadius: '50%',
                                }}
                              />
                            )}
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </MenuItem>
                  {index < notification.length && <hr style={{ padding: 0, margin: 0 }} />}
                </>
              ))}
          </Menu>
        )}
      </div>
    )
  }

  const handleClick = (event) => {
    anchorEl === null ? setAnchorEl(event.currentTarget) : setAnchorEl(null)
    openMenuProfile === false ? setOpenMenuProfile(true) : setOpenMenuProfile(false)
  }

  function handleAccount() {
    const title = 'Xác nhận đăng xuất tài khoản?'
    if (user) {
      confirmSatus(title, '').then((result) => {
        if (result.isConfirmed) {
          removeCookie('AdminToken')
          navigate('/admin/login')
        }
      })
    } else {
      navigate('/login')
    }
  }

  const onConnect = () => {
    stompClient.subscribe('/topic/thong-bao', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        console.log(data)
        setAnchorEl(true)
        getNotification(data)
      }
    })

    stompClient.subscribe(`/topic/web-online/${user.id}`, (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        if (data.idApp) {
          const mess = { idOrder: data.idBill }
          if (data.isConnect) {
            dispatch(setApp([...app, { idBill: data.idBill, idApp: data.idApp }]))
            stompClient.send(`/topic/app-online/${data.idApp}`, {}, JSON.stringify(mess))
          } else {
            dispatch(setApp([...app.filter((e) => e.idApp !== data.idApp)]))
          }
        }
      }
    })
  }

  return (
    <Box
      sx={{ display: 'flex', backgroundColor: '#F0F2F5', minHeight: '100vh', maxWidth: '100vw' }}>
      <ThemeAdmin>
        <AppBar
          position="fixed"
          sx={{
            pl: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            boxShadow:
              '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);',
            backdropFilter: 'blur(8px)',
          }}>
          <Toolbar sx={{ paddingLeft: '0px !important' }}>
            <Box width={drawerWidth} sx={{ transition: 'width 0.3s ease-in-out' }}></Box>
            <IconButton
              onClick={() => {
                setDrawerWidth(drawerWidth === '4vw' ? '17vw' : '4vw')
              }}
              sx={{
                color: 'black',
                transform: `rotate(${true ? 0 : 180}deg)`,
              }}>
              <Box
                component={drawerWidth === '17vw' ? AiOutlineMenuFold : AiOutlineMenuUnfold}
                sx={{ fontSize: '25px' }}
              />
            </IconButton>
            <Box flexGrow={1} />
            <NotificationButton />
            <IconButton onClick={(event) => handleClick(event)} size="small">
              <Avatar src={user && user.avatar} sx={{ width: 35, height: 35 }} />
              <Menu
                anchorEl={anchorEl}
                open={openMenuProfile}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
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
                    <Link
                      to={`/admin/infomation/${user.id}`}
                      style={{ textDecoration: 'none', color: 'black' }}>
                      <MenuItem>
                        <Avatar /> Tài khoản của tôi
                      </MenuItem>
                    </Link>
                    <Link
                      to={`/admin/change-password`}
                      style={{ textDecoration: 'none', color: 'black' }}>
                      <MenuItem>
                        <KeyIcon fontSize="small" sx={{ color: 'rgba(0, 0, 0, 0.54)', mr: 2 }} />{' '}
                        Đổi mật khẩu
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
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          sx={{
            border: 'none',
            width: drawerWidth,
            flexShrink: 0,
            transition: 'width 0.3s ease-in-out', // Add a transition property
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              transition: 'width 0.3s ease-in-out', // Apply the transition to the paper as well
            },
          }}>
          <Box width={'100%'} textAlign={'center'} pb={0}>
            <Box
              component={'img'}
              sx={{
                py: 2,
                transition: 'width 0.3s',
                width: drawerWidth === '4vw' ? '100%' : '55%',
              }}
              src={require('../assets/image/logoweb.png')}
              alt="logo"
            />
          </Box>
          <Box
            sx={{
              pb: 3,
              overflow: 'auto',
              '::-webkit-scrollbar': {
                width: '1px',
              },
              '::-webkit-scrollbar-thumb': {
                background: 'rgba(76,78,100,0.4)',
              },
            }}>
            <AdminMenu small={drawerWidth === '17vw'} />
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, maxWidth: drawerWidth === '4vw' ? '96vw' : '83vw' }}>
          <Toolbar />
          {children}
        </Box>
      </ThemeAdmin>
    </Box>
  )
}
