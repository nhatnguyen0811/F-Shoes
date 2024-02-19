import React, { Fragment, useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import { Button, Container, Divider, Grid, Stack, Typography } from '@mui/material'
import './Home.css'
import clientProductApi from '../../api/client/clientProductApi'
import CartProductHome from '../../layout/client/CartProductHome'
import CartSellingProduct from '../../layout/client/CartSellingProduct'
import CartSaleProduct from '../../layout/client/CartSaleProduct'
import { getStompClient } from '../../services/socket'
import { IoMdGift } from 'react-icons/io'
import SockJS from 'sockjs-client'
import { socketUrl } from '../../services/url'
import { Stomp } from '@stomp/stompjs'

var stompClient = null
export default function Home() {
  const [products, setProducts] = useState([])
  const [sellingProducts, setSellingProducts] = useState([])
  const [saleProducts, setSaleProducts] = useState([])
  const videoRef = useRef(null)
  useEffect(() => {
    clientProductApi.getProductHome().then((result) => {
      const data = result.data.data
      setProducts(
        data.map((e) => {
          return {
            id: e.id,
            title: e.name,
            priceBefort: e.price,
            priceAfter: e.price,
            value: e.value,
            promotion: e.promotion,
            size: e.size,
            statusPromotion: e.statusPromotion,
            image: e.image.split(','),
            nameColor: e.nameColor,
            codeColor: e.codeColor,
            nameCate: e.nameCate,
            nameBrand: e.nameBrand,
            idProduct: e.idProduct,
            idColor: e.idColor,
            idMaterial: e.idMaterial,
            idSole: e.idSole,
            idCategory: e.idCategory,
            idBrand: e.idBrand,
          }
        }),
      )
    })
  }, [])

  useEffect(() => {
    const socket = new SockJS(socketUrl)
    stompClient = Stomp.over(socket)
    stompClient.debug = () => {}
    stompClient.connect({}, onConnect)

    return () => {
      stompClient.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products])

  function onConnect() {
    getStompClient().subscribe('/topic/realtime-san-pham-home', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        updateRealTimeProductHome(data)
      }
    })
  }

  function updateRealTimeProductHome(data) {
    const preProduct = [...products]
    const preSellingProduct = [...sellingProducts]
    const index = preProduct.findIndex((product) => product.id === data.id)
    const indexs = preSellingProduct.findIndex((product) => product.id === data.id)
    if (index !== -1) {
      preProduct[index] = {
        id: data.id,
        title: data.name,
        priceBefort: data.price,
        priceAfter: data.price,
        value: data.value,
        promotion: data.promotion,
        size: data.size,
        statusPromotion: data.statusPromotion,
        image: data.image.split(','),
        nameColor: data.nameColor,
        codeColor: data.codeColor,
        nameCate: data.nameCate,
        nameBrand: data.nameBrand,
        idProduct: data.idProduct,
        idColor: data.idColor,
        idMaterial: data.idMaterial,
        idSole: data.idSole,
        idCategory: data.idCategory,
        idBrand: data.idBrand,
      }
      setProducts(preProduct)
    }

    if (indexs !== -1) {
      preSellingProduct[indexs] = {
        id: data.id,
        title: data.name,
        priceBefort: data.price,
        priceAfter: data.price,
        value: data.value,
        amount: data.amount,
        nameColor: data.nameColor,
        codeColor: data.codeColor,
        nameCate: data.nameCate,
        nameBrand: data.nameBrand,
        size: data.size,
        promotion: data.promotion,
        statusPromotion: data.statusPromotion,
        image: data.image.split(','),
        idProduct: data.idProduct,
        idColor: data.idColor,
        idMaterial: data.idMaterial,
        idSole: data.idSole,
        idCategory: data.idCategory,
        idBrand: data.idBrand,
      }
      setSellingProducts(preSellingProduct)
    }
  }

  useEffect(() => {
    clientProductApi.getSellingProduct().then((result) => {
      const data = result.data.data
      setSellingProducts(
        data.map((e) => {
          return {
            id: e.id,
            title: e.name,
            priceBefort: e.price,
            priceAfter: e.price,
            value: e.value,
            amount: e.amount,
            promotion: e.promotion,
            nameBrand: e.nameBrand,
            nameCate: e.nameCate,
            nameColor: e.nameColor,
            codeColor: e.codeColor,
            size: e.size,
            statusPromotion: e.statusPromotion,
            image: e.image.split(','),
            idProduct: e.idProduct,
            idColor: e.idColor,
            idMaterial: e.idMaterial,
            idSole: e.idSole,
            idCategory: e.idCategory,
            idBrand: e.idBrand,
          }
        }),
      )
    })
  }, [])

  useEffect(() => {
    clientProductApi.getSaleProduct().then((result) => {
      const data = result.data.data
      setSaleProducts(
        data.map((e) => {
          return {
            id: e.id,
            title: e.name,
            priceBefort: e.price,
            priceAfter: e.price,
            value: e.value,
            amount: e.amount,
            timeRemainingInSeconds: e.timeRemainingInSeconds,
            promotion: e.promotion,
            nameBrand: e.nameBrand,
            nameCate: e.nameCate,
            nameColor: e.nameColor,
            codeColor: e.codeColor,
            size: e.size,
            statusPromotion: e.statusPromotion,
            image: e.image.split(','),
            idProduct: e.idProduct,
            idColor: e.idColor,
            idMaterial: e.idMaterial,
            idSole: e.idSole,
            idCategory: e.idCategory,
            idBrand: e.idBrand,
          }
        }),
      )
    })
  }, [])

  const handleVideoEnded = () => {
    videoRef.current.play()
  }
  return (
    <>
      <div className="home">
        <Fragment>
          <Box>
            <Grid item xs={12}>
                {/* <video
                  ref={videoRef}
                  autoPlay
                  muted
                  onEnded={handleVideoEnded}
                  style={{ width: '100%', height: '100%' }}
                  src="https://brand.assets.adidas.com/video/upload/if_w_gt_1920,w_1920/running_fw23_adizero_boston12_launch_hp_masthead_d_dcb43d7604.mp4"></video> */}
                <img
                  src={require('../../assets/image/TinTuc/image_baner_home.webp')}
                  alt=""
                  style={{ width: '100%' }}
                />
              </Grid>
          </Box>
          <Container maxWidth="xl">
            <Typography className="title-banner">RUN YOUR RUN</Typography>
            <Typography className="title-banner-child">
              Follow the feeling that keeps you running your best in the city
            </Typography>
            <div className="btn-div-product">
              <Button className="btn-product">Shop Apparel</Button>
              <Button className="btn-product">Shop Apparel</Button>
            </div>

            <Box>
              <Grid container spacing={12}>
                <Grid item xs={12}>
                  <img
                    src={require('../../assets/image/nike-just-do-it.jpg')}
                    alt=""
                    style={{ width: '100%' }}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className="new-product">
              {saleProducts.length > 0 && (
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                  <Typography className="name-sale">
                    <Divider sx={{ width: '100%', height: '2px', backgroundColor: 'orange' }} />{' '}
                    <IoMdGift /> Siêu Sale
                    <Divider
                      sx={{ width: '100%', height: '2px', backgroundColor: 'orange' }}
                    />{' '}
                  </Typography>
                </Stack>
              )}

              <CartSaleProduct
                endTime={saleProducts.timeRemainingInSeconds}
                products={saleProducts}
                colmd={6}
                collg={3}
              />
            </Box>

            <Typography className="text-just-in">Just In</Typography>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <img
                    className="img-hover"
                    src={require('../../assets/image/nike-just-do-it (1).jpg')}
                    alt=""
                    style={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <img
                    className="img-hover"
                    src={require('../../assets/image/nike-just-do-it (2).jpg')}
                    alt=""
                    style={{ width: '100%' }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Container>
          <div className="product-home" style={{ margin: '0px 20px' }}>
            <Box className="new-product">
              <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                <Typography className="name-sale">
                  <Divider sx={{ width: '100%', height: '2px', backgroundColor: 'orange' }} /> Hàng
                  mới về
                  <Divider sx={{ width: '100%', height: '2px', backgroundColor: 'orange' }} />{' '}
                </Typography>
              </Stack>
              <div className="cart-product-home" style={{ marginTop: '10px' }}>
                <CartProductHome products={products} colsm={6} colmd={4} collg={3} />
              </div>
            </Box>
            <Box sx={{ marginTop: '30px', marginBottom: '30px' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    onEnded={handleVideoEnded}
                    style={{ width: '100%', height: '100%' }}
                    src="https://brand.assets.adidas.com/video/upload/if_w_gt_1920,w_1920/fw23_rivalry_launch_hp_mh_d_2c98ca2cf4.mp4"></video>
                </Grid>
              </Grid>
            </Box>
            <Box className="new-product">
              <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                <Typography className="name-sale">
                  <Divider sx={{ width: '100%', height: '2px', backgroundColor: 'orange' }} /> Sản
                  phẩm bán chạy
                  <Divider sx={{ width: '100%', height: '2px', backgroundColor: 'orange' }} />{' '}
                </Typography>
              </Stack>
              <CartSellingProduct products={sellingProducts} colmd={6} collg={3} />
            </Box>
            <Container maxWidth="xl">
              <Box className="about-us">
                <Grid container spacing={12}>
                  <Grid item xs={6}>
                    <Typography className="text-about-us">VỀ CHÚNG TÔI</Typography>
                    <Typography>
                      {' '}
                      <span className="fShoes">F_Shoes</span> -{' '}
                      <span className="fshoes-shop"> Shop Giày F-Shoes</span>
                    </Typography>
                    <span>
                      Cung cấp hơn 500 đôi giày replica 1:1, sneaker nam, nữ của các thương hiệu như
                      Adidas, Nike, Jordan, Yeezy, Balenciaga, Gucci, MLB,… Hàng chuẩn, Like Auth,
                      Giày rep 1:1 với chất lượng tốt nhất, giá rẻ nhất thị trường hiện nay. Giao
                      hàng nhanh toàn quốc, chính sách đổi trả và chính sách bảo hành linh hoạt.
                      <br />
                      <br /> Nếu bạn không đủ tài chính để mua một đôi giày chính hãng hoặc gặp khó
                      khăn về việc đặt hàng và size giày, Tyhi Sneaker sẽ giúp bạn chọn một đôi giày
                      rep 1:1 hợp với đôi chân của bạn. Chúng tôi cung cấp các mẫu giày sneaker
                      replica chất lượng với chi tiết chuẩn hàng Auth. Chúng tôi đa dạng về mẫu mã
                      và luôn có sẵn hàng.
                      <br />
                      <br /> Hãy đến với Tyhi Sneaker -Shop Giày Replica để trải nghiệm sự khác biệt
                      về chất lượng và dịch vụ. Chúng tôi sẵn lòng phục vụ bạn và đem đến cho bạn
                      những đôi giày sneaker tuyệt vời mà bạn đang tìm kiếm.
                    </span>
                  </Grid>
                  <Grid item xs={6}>
                    <img
                      src={require('../../assets/image/banner.jpg')}
                      alt=""
                      style={{ width: '100%' }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Container>
          </div>
        </Fragment>
      </div>
    </>
  )
}
