import { Breadcrumbs, Container, Grid, Typography } from '@mui/material'
import React from 'react'
import './AboutUs.css'
import { Link } from 'react-router-dom'
export default function AboutUs() {
  return (
    <>
      <div className="about-us">
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

            <Typography color="text.primary"> Giới thiệu</Typography>
          </Breadcrumbs>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <h1>Giới thiệu F-Shoes</h1>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>
                Thương hiệu thời trang nam F-Shoes được thành lập từ tháng 3 năm 2010, là thương
                hiệu thời trang uy tín hàng đầu tại Việt Nam dành riêng cho phái mạnh.
              </span>
              <div style={{ marginTop: '30px' }}>
                <span style={{ fontWeight: 1000, marginTop: '30px' }}>SỨ MỆNH:</span>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>
                  Không ngừng sáng tạo và tỉ mỉ từ công đoạn sản xuất đến các khâu dịch vụ, nhằm
                  mang đến cho Quý Khách Hàng những trải nghiệm mua sắm đặc biệt nhất: sản phẩm chất
                  lượng - dịch vụ hoàn hảo - xu hướng thời trang mới mẻ và tinh tế. Thông qua các
                  sản phẩm thời trang, F-Shoes luôn mong muốn truyền tải đến bạn những thông điệp
                  tốt đẹp cùng với nguồn cảm hứng trẻ trung và tích cực.
                </div>
              </div>
              <div style={{ marginTop: '30px' }}>
                <span style={{ fontWeight: 1000, marginTop: '30px' }}>TẦM NHÌN:</span>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>
                  Với mục tiêu xây dựng và phát triển những giá trị bền vững, trong 10 năm tới,
                  F-Shoes sẽ trở thành thương hiệu dẫn đầu về thời trang phái mạnh trên thị trường
                  Việt Nam.
                </div>
              </div>
              <div style={{ marginTop: '30px' }}>
                <span style={{ fontWeight: 1000, marginTop: '30px' }}>
                  THÔNG ĐIỆP F-SHOES GỬI ĐẾN BẠN:
                </span>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '30px' }}>
                  F-Shoes muốn truyền cảm hứng tích cực đến các chàng trai: Việc mặc đẹp rất quan
                  trọng, nó thể hiện được cá tính, sự tự tin và cả một phần lối sống, cách suy nghĩ
                  của bản thân. Mặc thanh lịch, sống thanh lịch.
                </div>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 1000 }}>
                Chọn F-Shoes, bạn đang lựa chọn sự hoàn hảo cho điểm nhấn thời trang của chính mình!
              </span>
            </Grid>
            <Grid item xs={4}>
              <div className="img-shop-shoes-about-us">
                <img
                  src={require('../../assets/image/TinTuc/shop_fshoes_comtact.jpg')}
                  className="shop-fshoes-about-us"
                  alt=""
                />
                <div className="title-shop-fshoes-about-us">Shop giày F-Shoes</div>
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  )
}
