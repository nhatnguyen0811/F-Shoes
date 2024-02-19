import { Breadcrumbs, Container, Grid, Typography } from '@mui/material'
import React, { useRef } from 'react'
import './News.css'
import { Link } from 'react-router-dom'

export default function News() {
  const videoRef = useRef(null)

  const handleVideoEnded = () => {
    videoRef.current.play()
  }

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

        <Typography color="text.primary"> Tin tức</Typography>
      </Breadcrumbs>
      <div className="news">
        <div>
          <img
            src={require('../../assets/image/TinTuc/banner.jpg')}
            style={{ width: '100%' }}
            alt=""
          />
        </div>

        <Container maxWidth="xl">
          <div className="latest-news">
            {' '}
            <h1>LATEST NEWS</h1>
          </div>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <div>
                <img
                  src={require('../../assets/image/TinTuc/1.jpg')}
                  style={{ height: '100%', width: '100%' }}
                  alt=""
                />
                <span className="title-news">adidas Originals x Bad Bunny Release Response CL</span>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div>
                <img
                  src={require('../../assets/image/TinTuc/2.jpg')}
                  style={{ height: '100%', width: '100%' }}
                  alt=""
                />
                <span className="title-news">
                  adidas and KoRn Celebrate their Past, Present, and Future, with a Stunning New
                  Collaborative
                </span>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div>
                <img
                  src={require('../../assets/image/TinTuc/3.jpg')}
                  style={{ height: '100%', width: '100%' }}
                  alt=""
                />
                <span className="title-news">Overtime Elite Signs Multi-Year Deal with adidas</span>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div>
                <img
                  src={require('../../assets/image/TinTuc/4.jpg')}
                  style={{ height: '100%', width: '100%' }}
                  alt=""
                />
                <span className="title-news">
                  adidas and BAPE® Celebrate the Brand’s 30th Anniversary with a Golf Ready
                  Collection
                </span>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div>
                <img
                  src={require('../../assets/image/TinTuc/1.jpg')}
                  style={{ height: '100%', width: '100%' }}
                  alt=""
                />
                <span className="title-news">
                  adidas and Yohji Yamamoto Present the Avant-Garde Inspired Y-3 GENDO Sneaker
                </span>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div>
                <img
                  src={require('../../assets/image/TinTuc/3.jpg')}
                  style={{ height: '100%', width: '100%' }}
                  alt=""
                />
                <span className="title-news">
                  adidas Originals and Edison Chen Announce Global Partnership
                </span>
              </div>
            </Grid>
          </Grid>

          <div className="innovations-news">
            {' '}
            <h1>INNOVATIONS</h1>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <div style={{ height: '100%' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    onEnded={handleVideoEnded}
                    style={{ width: '100%', height: '100%' }}
                    src={require('../../assets/image/TinTuc/8.mp4')}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <div style={{ height: '100%' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    onEnded={handleVideoEnded}
                    style={{ width: '100%', height: '100%' }}
                    src={require('../../assets/image/TinTuc/9.mp4')}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <div style={{ height: '100%' }}>
                  <img
                    style={{ width: '100%', height: '100%' }}
                    src={require('../../assets/image/TinTuc/7.jpg')}
                    alt=""
                  />
                </div>
              </Grid>
            </Grid>
          </div>

          <div className="product-news">
            {' '}
            <h1>PRODUCT NEWS</h1>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <div style={{ height: '100%' }}>
                  <img
                    style={{ width: '100%', height: '100%' }}
                    src={require('../../assets/image/TinTuc/10.webp')}
                    alt=""
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <div style={{ height: '100%' }}>
                  <img
                    style={{ width: '100%', height: '100%' }}
                    src={require('../../assets/image/TinTuc/11.webp')}
                    alt=""
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <div style={{ height: '100%' }}>
                  <img
                    style={{ width: '100%', height: '100%' }}
                    src={require('../../assets/image/TinTuc/12.webp')}
                    alt=""
                  />
                </div>
              </Grid>
            </Grid>
          </div>
        </Container>
      </div>
    </>
  )
}
