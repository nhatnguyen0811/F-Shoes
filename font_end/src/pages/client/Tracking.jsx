import { Breadcrumbs, Button, Container, Grid, Paper, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ClientAccountApi from '../../api/client/clientAccount'
import { toast } from 'react-toastify'

export default function Tracking() {
  const [getCodeBill, setGetCodeBill] = useState('')

  const navigate = useNavigate()
  const getBillByIdBill = (code) => {
    ClientAccountApi.getBillDetailByCode(code).then(
      (response) => {
        if (response.data.data.length > 0) {
          navigate('/tracking/' + code)
        } else {
          toast.warning('Đơn hàng không tồn tại')
        }
      },
      () => {},
    )
  }

  return (
    <>
      <Container maxWidth="xl">
        <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 1.5, mb: 1.5 }}>
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

          <Typography color="text.primary"> Tin tức</Typography>
        </Breadcrumbs>
        <Grid container spacing={2}>
          <Grid item xs={6} sx={{ mt: 2 }}>
            <img
              src={require('../../assets/image/TinTuc/bannerTracking.webp')}
              alt=""
              style={{ width: '1450px', height: '600px' }}
            />
          </Grid>
          <Grid item xs={6}>
            {' '}
            <div
              style={{
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '30%',
                marginTop: '95px',
              }}>
              <div
                style={{
                  width: '420px',
                  height: '320px',
                  backgroundColor: '#FF9933',
                  borderTopRightRadius: '10px',
                  borderTopLeftRadius: '10px',
                }}>
                <img
                  src={require('../../assets/image/TinTuc/tracking.png')}
                  alt=""
                  style={{ width: '200px', height: '100px', marginTop: '10px' }}
                />
                <Typography style={{ color: 'white', fontSize: '30px', fontWeight: 700 }}>
                  KIỂM TRA ĐƠN HÀNG
                </Typography>
                <Typography style={{ color: 'white', fontSize: '16px' }}>
                  Vui lòng nhập thông tin sau để kiểm tra nhanh đơn hàng. Nếu không có mã đơn hàng
                  xin vui lòng liên hệ hỗ trợ qua email
                </Typography>
              </div>

              <Paper style={{ width: '420px' }}>
                <div
                  style={{
                    textAlign: 'center',
                    width: '420px',
                    border: '3px solid white',
                  }}>
                  <TextField
                    id="outlined-basic"
                    placeholder="Nhập mã đơn hàng"
                    variant="outlined"
                    onChange={(e) => setGetCodeBill(e.target.value)}
                    style={{ width: '400px', marginTop: '10px' }}
                  />
                  <div>
                    <Button
                      variant="contained"
                      style={{
                        width: '400px',
                        backgroundColor: '#FF6600',
                        marginTop: '10px',
                        marginBottom: '10px',
                      }}
                      onClick={() => getBillByIdBill(getCodeBill)}>
                      Tra cứu
                    </Button>
                  </div>
                </div>
              </Paper>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
