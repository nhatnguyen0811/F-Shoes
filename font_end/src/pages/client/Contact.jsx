import { Breadcrumbs, Container, Grid, Typography } from '@mui/material'
import React from 'react'
import './Contact.css'
import { Link } from 'react-router-dom'

export default function Contact() {
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 1.5, mb: 1.5, ml: 5 }}>
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

        <Typography color="text.primary"> Liên hệ</Typography>
      </Breadcrumbs>
      <div className="contact">
        <img
          src={require('../../assets/image/TinTuc/banner-contact.webp')}
          className="banner-contact"
          alt=""
        />
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              {' '}
              <h1 style={{ textAlign: 'center' }}>THÔNG TIN LIÊN HỆ</h1>
              <hr />
              <div className="information-contact">
                <div className="icon-contact">
                  <img src={require('../../assets/image/TinTuc/icons8-home-24.png')} alt="" />
                </div>
                <div>
                  <span className="title-contact">Trụ sở chính:</span>
                  <div>Trường Cao đẳng FPT Polytechnic</div>
                </div>
              </div>
              <div className="information-contact">
                <div className="icon-contact">
                  <img src={require('../../assets/image/TinTuc/icons8-phone-24.png')} alt="" />
                </div>
                <div>
                  <span className="title-contact">Điện thoại:</span>
                  <div>0123456789</div>
                </div>
              </div>
              <div className="information-contact">
                <div className="icon-contact">
                  <img src={require('../../assets/image/TinTuc/icons8-email-24.png')} alt="" />
                </div>
                <div>
                  <span className="title-contact">Email:</span>
                  <div>Fshoes131203@gmail.com</div>
                </div>
              </div>
              <div style={{ marginTop: '30px' }}>
                Website www.fshoes.com là website chuyên bán các dòng sản phẩm thời trang nam: Quần
                jean nam, quần tây, quần kaki, áo sơ mi, áo khoác, áo vest, áo thun, phụ kiện nam,
                giày dép nam...
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="img-shop-shoes">
                <img
                  src={require('../../assets/image/TinTuc/shop_fshoes_comtact.jpg')}
                  className="shop-fshoes"
                  alt=""
                />
                <div className="title-shop-fshoes">Shop giày F-Shoes</div>
              </div>
            </Grid>

            <Grid item xs={12}>
              <hr />
              <h3>BẢN ĐỒ ĐẾN CÁC SHOWROOM CỦA F-SHOES</h3>
              <div style={{ height: '650px', width: '100%' }}>
                <iframe
                  src="https://www.google.com/maps/d/embed?mid=12CPh6l7zrsdqyd2-X2I-Riv7zqHlDt0&ehbc=2E312F"
                  width="100%"
                  height="480"></iframe>
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  )
}
