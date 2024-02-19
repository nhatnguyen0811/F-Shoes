import { Box, Container, Divider, Grid, Typography } from '@mui/material'
import React from 'react'
import './HeadingClient.css'
import { Link } from 'react-router-dom'

export default function FooterClient() {
  return (
    <Box
      className="footer"
      sx={{
        boxShadow: '0px -4px 5px -2px rgba(0,0,0,0.14), 0px 0px',
        width: '100%',
        // backgroundColor: 'white',
        color: 'white',
        mt: 2,
      }}>
      <div style={{ textAlign: 'center', paddingTop: '30px' }}>
        <img
          src={require('../../assets/image/TinTuc/logo_Footer.png')}
          alt=""
          style={{ width: '400px' }}
        />
      </div>
      <Typography style={{ textAlign: 'center', padding: '0px 50px' }}>
        F-Shoes website bán giày thể thao sneaker, bắt đầu với đam mê của nhóm ChinSu trường FPT
        Polytechnic. Hôm nay, chúng tôi tự hào là đại lý uy tín cung cấp giày thể thao chính hãng.
        Đa dạng sản phẩm, chất lượng và sự chuyên nghiệp đã tạo nên một cộng đồng hài lòng. Cảm ơn
        bạn đã đồng hành, và hứa hẹn tiếp tục phục vụ tốt nhất! 👟🌟 #FShoesAnniversary
      </Typography>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '20px',
        }}>
        <Divider sx={{ height: '2px', backgroundColor: 'white', width: '40%', mr: 2 }} />
        <img
          src={require('../../assets/image/TinTuc/zalo.webp')}
          alt=""
          width={40}
          style={{ marginRight: '10px' }}
        />
        <img
          src={require('../../assets/image/TinTuc/facebook.webp')}
          alt=""
          width={40}
          style={{ marginRight: '10px' }}
        />
        <img
          src={require('../../assets/image/TinTuc/google.webp')}
          alt=""
          width={40}
          style={{ marginRight: '10px' }}
        />
        <img
          src={require('../../assets/image/TinTuc/youtobe.webp')}
          alt=""
          width={40}
          style={{ marginRight: '10px' }}
        />
        <Divider sx={{ height: '2px', backgroundColor: 'white', width: '40%' }} />
      </div>
      <Container maxWidth="lg" sx={{ pb: '25px' }}>
        <Grid container direction="column" className="gird-footer" alignItems="center" mb={2}>
          <Grid container spacing={12}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography className="footerTitle">&hearts; Giới thiệu</Typography>
              <Typography className="text-footer">
                <span className="title-footer">&#10173; F-Shoes:</span> nơi trao tặng các sản phẩm
                giày thời trang trẻ trung, phong cách, bắt trend cho giới trẻ.
              </Typography>
              <Typography className="text-footer">
                <span className="title-footer">&#10173; Địa chỉ:</span> Số 22 ngõ 132 đường cầu
                diễn, Phường Minh Khai, Bắc Từ Liêm, hà nội{' '}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography className="footerTitle">&hearts; Các chính sách</Typography>
              <Link to="/return-policy-client" style={{ textDecoration: 'none' }}>
                <Typography className="text-footer">
                  &#8227; Chính sách đổi trả của F-Shoes
                </Typography>
              </Link>
              <Typography className="text-footer">
                &#8227; Chính sách bảo hành của F-Shoes
              </Typography>
              <Typography className="text-footer">
                &#8227; Chính sách hoàn tiền của F-Shoes
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography className="footerTitle">&hearts; Hỗ trợ khách hàng</Typography>
              <Typography className="text-footer" component={Link} to="/about-us">
                &#8902; Giới thiệu
              </Typography>
              <br />
              <Typography className="text-footer" component={Link} to="/contact">
                &#8902; Liên hệ
              </Typography>
              <Typography className="text-footer">&#8902; Tác giả</Typography>
              <Typography className="text-footer">
                &#8902; Mua hàng:<span className="phoneNumber"> 07987654321</span>{' '}
              </Typography>
              <Typography className="footerTitle">&hearts; Hình thức thanh toán</Typography>
              <img
                className="img-contact"
                src={require('../../assets/image/TinTuc/payment_1.webp')}
                alt=""
              />
              <img
                className="img-contact"
                src={require('../../assets/image/TinTuc/payment_2.webp')}
                alt=""
              />
              <img
                className="img-contact"
                src={require('../../assets/image/TinTuc/payment_3.webp')}
                alt=""
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography className="footerTitle">&hearts; Liên hệ với chúng tôi</Typography>

              <Typography>
                {' '}
                <span className="title-footer">&#9743; Hotline:</span>{' '}
                <span className=".text-footer"> 0123456789</span>
              </Typography>
              <Typography>
                {' '}
                <span className="title-footer">&#9993; Email:</span>{' '}
                <span className="phoneNumber"> Fshoes131203@gmail.com</span>
              </Typography>
              <Typography className="footerTitle">&hearts; Liên kết sàn</Typography>
              <img
                className="img-contact"
                src={require('../../assets/image/TinTuc/shopee.webp')}
                alt=""
              />
              <img
                className="img-contact"
                src={require('../../assets/image/TinTuc/lazada.webp')}
                alt=""
              />
              <img
                className="img-contact"
                src={require('../../assets/image/TinTuc/sendo.webp')}
                alt=""
              />
              <img
                className="img-contact"
                src={require('../../assets/image/TinTuc/tiki.webp')}
                alt=""
              />
            </Grid>
          </Grid>
        </Grid>
        <Typography className="text-footer" variant="body2" align="center" mt={2}>
          &copy; {new Date().getFullYear()} DATN ChinSu FPT Polytechnic
        </Typography>
      </Container>
    </Box>
  )
}
