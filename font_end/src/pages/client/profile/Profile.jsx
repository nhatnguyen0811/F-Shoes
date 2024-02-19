import {
  Box,
  Breadcrumbs,
  Container,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  Typography,
} from '@mui/material'
import React, { useEffect } from 'react'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import StarBorder from '@mui/icons-material/StarBorder'
import { RiBillLine } from 'react-icons/ri'
import { LiaMoneyCheckAltSolid } from 'react-icons/lia'
import { FiUsers } from 'react-icons/fi'
import EditIcon from '@mui/icons-material/Edit'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { GetUser } from '../../../services/slices/userSlice'
import BadgeIcon from '@mui/icons-material/Badge'
import KeyIcon from '@mui/icons-material/Key'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import './Order.css'

export default function Profile({ children }) {
  const [open, setOpen] = React.useState(true)

  const handleClick = () => {
    setOpen(!open)
  }
  const location = useLocation()
  const userLogin = useSelector(GetUser)
  const navigate = useNavigate()
  useEffect(() => {
    if (!userLogin && location.pathname.startsWith('/profile')) {
      navigate('/login')
    }
  }, [userLogin, location.pathname])
  return (
    <div className="profile">
      <Container maxWidth="xl">
        <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 3, mb: 3 }}>
          <Typography
            color="inherit"
            component={Link}
            to="/home"
            sx={{
              color: 'black',
              textDecoration: 'none',
              fontWeight: '600 !important',
              fontSize: 'calc(0.9rem + 0.15vw) !important',
            }}>
            Trang chủ
          </Typography>

          <Typography color="text.primary"> Tài khoản của tôi</Typography>
        </Breadcrumbs>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <List
              sx={{
                width: '100%',
                maxWidth: 300,
                height: '95%',
                bgcolor: 'background.paper',
                mt: 2,
              }}
              component="nav"
              aria-labelledby="nested-list-subheader">
              <div style={{ display: 'flex', alignContent: 'center' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'black',
                    overflow: 'hidden',
                    marginBottom: '30px',
                    marginLeft: '10px',
                  }}>
                  <img src={userLogin?.avatar} alt="" style={{ width: '100%', height: '100%' }} />
                </div>

                <Typography style={{ marginLeft: '5px', marginTop: '5px', fontWeight: 700 }}>
                  {userLogin?.name}
                  <Typography>
                    {' '}
                    <EditIcon fontSize="small" /> Sửa hồ sơ
                  </Typography>
                </Typography>
              </div>
              <Divider />
              {/* ------------------------------------- === ------------------------------------- */}
              <ListItemButton onClick={handleClick}>
                <ListItemIcon sx={{ minWidth: '40px', color: 'black' }}>
                  <Box component={FiUsers} sx={{ fontSize: '25px' }} />
                </ListItemIcon>
                <ListItemText primary="Tài khoản của tôi" />
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton component={Link} to="/profile/user" sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <BadgeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Hồ sơ" />
                  </ListItemButton>
                  <ListItemButton component={Link} to="/profile/address" sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <LocationOnIcon />
                    </ListItemIcon>
                    <ListItemText primary="Địa chỉ" />
                  </ListItemButton>
                </List>
              </Collapse>

              {/* ------------------------------------- === ------------------------------------- */}
              <ListItemButton component={Link} to="/profile/order">
                <ListItemIcon sx={{ minWidth: '40px', color: 'black' }}>
                  <Box component={RiBillLine} sx={{ fontSize: '24px' }} />
                </ListItemIcon>
                <ListItemText primary="Đơn mua" />
              </ListItemButton>
              {/* ------------------------------------- === ------------------------------------- */}
              <ListItemButton component={Link} to="/profile/my-voucher">
                <ListItemIcon sx={{ minWidth: '40px', color: 'black' }}>
                  <Box component={LiaMoneyCheckAltSolid} sx={{ fontSize: '24px' }} />
                </ListItemIcon>
                <ListItemText primary="Phiếu giảm giá" />
              </ListItemButton>
              {/* ------------------------------------- === ------------------------------------- */}
              <ListItemButton component={Link} to="/profile/change-password">
                <ListItemIcon sx={{ minWidth: '40px', color: 'black' }}>
                  <Box component={KeyIcon} sx={{ fontSize: '24px' }} />
                </ListItemIcon>
                <ListItemText primary="Đổi mật khẩu" />
              </ListItemButton>
            </List>
          </Grid>

          <Grid item xs={9}>
            {children}
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}
