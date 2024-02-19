import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Breadcrumbs,
  Button,
  Container,
  IconButton,
  Modal,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import React, { useState } from 'react'
import { ColorCustom } from '../../styles/ColorCustom'
import CartProduct from '../../layout/client/CartProduct'
import LabelTitle from '../../layout/client/LabelTitle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useEffect } from 'react'
import clientProductApi from '../../api/client/clientProductApi'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addCart } from '../../services/slices/cartSlice'
import ReactImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import './DetailProduct.css'
import { setCheckout } from '../../services/slices/checkoutSlice'
import StraightenIcon from '@mui/icons-material/Straighten'
import { toast } from 'react-toastify'
import ModalAddProductToCart from './ModalAddProductToCart'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'
import { formatCurrency } from '../../services/common/formatCurrency '
import { socketUrl } from '../../services/url'
import { isColorDark } from '../../services/common/isColorDark'
import { FaCheck } from 'react-icons/fa'
import CartProductCungLoai from '../../layout/client/CartProductCungLoai'
import BreadcrumbsCustom from '../../components/BreadcrumbsCustom'

const listBreadcrumbs = [{ name: 'Trang chủ', link: '/home' }]
const listBreadcrumbs2 = [{ name: 'Sản phẩm', link: '/products' }]

var stompClient = null
export default function DetailProduct() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [soLuong, setSoluong] = useState(1)
  const [product, setProduct] = useState({ image: [], price: '' })
  const [products, setProducts] = useState([])
  const [sizes, setSizes] = useState([])
  const [colors, setColors] = useState([])
  const [showMaxQuantityError, setShowMaxQuantityError] = useState(false)
  const { id } = useParams()

  const [openModalCart, setOpenModalCart] = React.useState(false)
  const handleOpenModalCart = () => setOpenModalCart(true)
  const handleCloseModalCart = () => setOpenModalCart(false)

  useEffect(() => {
    const socket = new SockJS(socketUrl)
    stompClient = Stomp.over(socket)
    stompClient.debug = () => {}
    stompClient.connect({}, onConnect)

    return () => {
      stompClient.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product])

  const onConnect = () => {
    stompClient.subscribe('/topic/realtime-san-pham-detail', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        updateRealTimeProductDetail(data)
      }
    })
    stompClient.subscribe('/topic/realtime-san-pham-detail-by-status-bill-2', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        updateRealTimeProductDetail(data)
      }
    })
    stompClient.subscribe('/topic/realtime-san-pham-detail-increase-by-bill-detail', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        updateRealTimeProductDetail(data)
      }
    })
    stompClient.subscribe('/topic/realtime-san-pham-detail-decrease-by-bill-detail', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        updateRealTimeProductDetail(data)
      }
    })
    stompClient.subscribe('/topic/realtime-san-pham-detail-by-add-in-bill-detail', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        updateRealTimeProductDetail(data)
      }
    })
    stompClient.subscribe('/topic/realtime-san-pham-detail-cancel-bill', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        updateRealTimeProductDetail(data)
      }
    })
    stompClient.subscribe(
      '/topic/realtime-san-pham-detail-by-admin-delete-in-bill-detail',
      (message) => {
        if (message.body) {
          const data = JSON.parse(message.body)
          updateRealTimeProductDetail(data)
        }
      },
    )
    stompClient.subscribe('/topic/realtime-san-pham-detail-by-admin-corfim-bill', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        updateRealTimeProductDetail(data)
      }
    })
    stompClient.subscribe(
      '/topic/realtime-san-pham-detail-by-roll-back-bill-status-comfirm',
      (message) => {
        if (message.body) {
          const data = JSON.parse(message.body)
          updateRealTimeProductDetail(data)
        }
      },
    )
    stompClient.subscribe(
      '/topic/realtime-san-pham-detail-by-roll-back-bill-status-cancel',
      (message) => {
        if (message.body) {
          const data = JSON.parse(message.body)
          updateRealTimeProductDetail(data)
        }
      },
    )
  }

  function updateRealTimeProductDetail(data) {
    const preProduct = product
    const index = preProduct.id === data.id ? 0 : -1
    if (index !== -1) {
      setProduct({ ...data, image: data.image.split(',') })
    }
  }

  useEffect(() => {
    if (product) {
      clientProductApi
        .getSizes({
          idProduct: product.idProduct,
          idColor: product.idColor,
          idCategory: product.idCategory,
          idBrand: product.idBrand,
          idSole: product.idSole,
          idMaterial: product.idMaterial,
        })
        .then(
          (result) => {
            setSizes(result.data.data)
          },
          (e) => {
            console.error(e)
          },
        )
    }

    clientProductApi
      .getCungLoai({
        category: product.idCategory,
        brand: product.idBrand,
        product: product.idProduct,
        color: product.idColor,
        sole: product.idSole,
        material: product.idMaterial,
      })
      .then((result) => {
        const data = result.data.data
        setProducts(
          data.map((e) => {
            return {
              ...e,
              image: e.image.split(','),
            }
          }),
        )
      })
  }, [product])

  useEffect(() => {
    let data
    clientProductApi.getById(id).then(
      (result) => {
        if (result.data.success) {
          data = result.data.data
          clientProductApi
            .getColors({
              idProduct: data.idProduct,
              idCategory: data.idCategory,
              idBrand: data.idBrand,
              idSole: data.idSole,
              idMaterial: data.idMaterial,
              idSize: data.idSize,
            })
            .then(
              (result) => {
                if (result.data.success) {
                  setColors(result.data.data)
                }
              },
              (e) => {
                console.error(e)
              },
            )
          setProduct({
            ...data,
            image: data.image.split(','),
          })
        }
      },
      (e) => {
        console.error(e)
      },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    const discountAmount = (discountPercentage / 100) * originalPrice
    const discountedPrice = originalPrice - discountAmount
    return discountedPrice
  }

  const dispatch = useDispatch()
  const addProductToCart = () => {
    if (
      isNaN(parseInt(soLuong.toString().trim())) ||
      soLuong <= 0 ||
      soLuong > parseInt(product.amount)
    ) {
      toast.warning('Số lượng không hợp lệ')
    } else {
      const newItem = {
        id: id,
        name: product.name,
        gia: product.price,
        weight: product.weight,
        image: product.image,
        soLuong: parseInt(soLuong.toString().trim()),
        size: product.size,
      }
      dispatch(addCart(newItem))
      handleOpenModalCart()
    }
  }
  const handleQuantityChange = (e) => {
    const inputValue = e.target.value
    const numericValue = inputValue.replace(/[^0-9]/g, '')

    if (numericValue === '') {
      // Nếu giá trị là chuỗi rỗng, xóa hết (đặt giá trị là '')
      setSoluong('')
      setShowMaxQuantityError(false)
    } else {
      const parsedValue = parseInt(numericValue)
      if (!isNaN(parsedValue) && parsedValue > 0) {
        const limitedQuantity = Math.min(parsedValue, parseInt(product.amount))
        setSoluong(limitedQuantity)
        setShowMaxQuantityError(limitedQuantity !== parsedValue)
      } else {
        // Nếu giá trị không hợp lệ, giữ nguyên giá trị hiện tại
        setShowMaxQuantityError(false)
      }
    }
  }

  const handleBlur = () => {
    // Khi ô nhập mất focus và giá trị rỗng, đặt thành 1
    if (soLuong === '') {
      setSoluong(1)
      setShowMaxQuantityError(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && soLuong === '') {
      setSoluong(1)
      setShowMaxQuantityError(false)
    }
  }
  const checkOut = () => {
    if (
      isNaN(parseInt(soLuong.toString().trim())) ||
      soLuong <= 0 ||
      soLuong > parseInt(product.amount)
    ) {
      toast.warning('Số lượng không hợp lệ')
    } else {
      const newItem = {
        id: id,
        name: product.name,
        gia: product.price,
        weight: product.weight,
        image: product.image,
        soLuong: parseInt(soLuong.toString().trim()),
        size: product.size,
      }
      dispatch(setCheckout([newItem]))
      navigate('/checkout')
    }
  }

  function convert(images) {
    return images.map((image) => {
      return {
        original: image,
        thumbnail: image,
      }
    })
  }
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
  }

  return (
    <div className="detail-product">
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
          <Typography
            color="inherit"
            component={Link}
            to="/products"
            sx={{
              color: 'black',
              textDecoration: 'none',
              fontWeight: '600 !important',
              fontSize: 'calc(0.9rem + 0.15vw) !important',
            }}>
            Sản phẩm
          </Typography>
          <Typography color="text.primary"> {product.name}</Typography>
        </Breadcrumbs>
        <Grid2 container rowSpacing={1} columnSpacing={3}>
          <Grid2 md={6} textAlign={'center'} width={'100%'}>
            <ReactImageGallery
              showBullets={false}
              showPlayButton={false}
              showNav={false}
              autoPlay={true}
              items={convert(product.image)}
            />
          </Grid2>
          <Grid2 md={6} width={'100%'}>
            <Box borderBottom={'1px dotted gray'} py={2}>
              <Typography variant="h4" fontFamily={'monospace'} fontWeight={'bolder'}>
                {product.name}
              </Typography>
              <div style={{ marginTop: '5px', marginBottom: '10px' }}>
                <b>Loại giày: </b>
                {product.nameCate}
                &nbsp;&nbsp;&nbsp;&nbsp;
                <b>Thương hiệu: </b>
                {product.nameBrand}
              </div>
              <Typography variant="h5" fontFamily={'monospace'} fontWeight={'900'} color={'red'}>
                <span>
                  {' '}
                  {product.value ? (
                    <div style={{ display: 'flex' }}>
                      <div className="promotion-price">{formatCurrency(product.price)}</div>{' '}
                      <div>
                        <span style={{ color: 'red', fontWeight: 'bold' }}>
                          {formatCurrency(calculateDiscountedPrice(product.price, product.value))}
                        </span>{' '}
                      </div>
                    </div>
                  ) : (
                    <span>{formatCurrency(product.price)}</span>
                  )}
                </span>
              </Typography>
            </Box>
            <Box borderBottom={'1px dotted gray'} py={2} mb={2}>
              <Box py={2}>
                <Typography
                  fontWeight={'bold'}
                  gutterBottom
                  style={{
                    float: 'left',
                    marginLeft: '10px',
                    marginTop: '10px',
                    lineHeight: '30px',
                  }}>
                  Màu sắc:
                </Typography>
                {colors.map((e, index) => {
                  return (
                    <Button
                      component={Link}
                      to={`/product/${e.id}`}
                      key={'size' + index}
                      variant="outlined"
                      style={{
                        marginLeft: '10px',
                        marginTop: '10px',
                        height: '30px',
                        minWidth: '30px',
                        maxWidth: '30px',
                        padding: '2px',
                        ...(e.idColor === product?.idColor
                          ? { border: '2px solid black' }
                          : { backgroundColor: e.codeColor }),
                        borderRadius: '50%',
                      }}>
                      <div
                        style={{
                          backgroundColor: e.codeColor,
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          textAlign: 'center',
                        }}>
                        {e.idColor === product?.idColor && (
                          <FaCheck
                            style={{
                              height: '100%',
                              color: isColorDark(e.codeColor) ? 'white' : 'black',
                            }}
                            fontSize={'15px'}
                          />
                        )}
                      </div>
                    </Button>
                  )
                })}
              </Box>
              <Box py={2}>
                <Typography
                  fontWeight={'bold'}
                  gutterBottom
                  style={{
                    float: 'left',
                    marginLeft: '10px',
                    marginTop: '10px',
                    lineHeight: '30px',
                  }}>
                  Kích cỡ:
                </Typography>
                {sizes.map((e, index) => {
                  return (
                    <Button
                      component={Link}
                      to={`/product/${e.id}`}
                      key={'size' + index}
                      variant="outlined"
                      style={{
                        marginLeft: '10px',
                        marginTop: '10px',
                        height: '30px',
                        width: '35px',
                        color: id === e.id ? 'white' : 'black',
                        backgroundColor: id === e.id ? 'black' : 'white',
                        padding: '2px 0px 2px 0px',
                        border: '1px solid gray',
                      }}>
                      {parseInt(e.size)}
                    </Button>
                  )
                })}
                <Button
                  onClick={handleOpen}
                  variant="outlined"
                  style={{
                    marginLeft: '10px',
                    marginBottom: '-10px',
                    color: 'black',
                    backgroundColor: 'white',
                    padding: '2px 2px 2px 2px',
                    border: '1px solid gray',
                  }}>
                  <StraightenIcon />
                  &nbsp; Bảng size
                </Button>
              </Box>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={style}>
                  <img src={require('../../assets/image/chonsize.jpg')} alt="chọn-size" />
                </Box>
              </Modal>
              <Box py={2}>
                <Typography
                  sx={{ float: 'left', mt: '3px' }}
                  color={'red'}
                  mr={2}
                  fontWeight={'bold'}
                  variant="button"
                  gutterBottom>
                  Số lượng: {product.amount}
                </Typography>
                <Box
                  width={'65px'}
                  display="flex"
                  alignItems="center"
                  sx={{
                    border: '1px solid gray',
                    borderRadius: '20px',
                  }}
                  p={'3px'}>
                  <IconButton
                    onClick={() => {
                      setSoluong((prevQuantity) => Math.max(prevQuantity - 1, 1))
                    }}
                    sx={{ p: 0 }}
                    size="small">
                    <RemoveIcon fontSize="1px" />
                  </IconButton>
                  <TextField
                    onChange={handleQuantityChange}
                    onBlur={handleBlur}
                    onKeyPress={handleKeyPress}
                    value={soLuong}
                    inputProps={{ min: 1 }}
                    size="small"
                    sx={{
                      width: '30px ',
                      '& input': { p: 0, textAlign: 'center' },
                      '& fieldset': {
                        border: 'none',
                      },
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      setSoluong(parseInt(soLuong) + 1)
                    }}
                    size="small"
                    sx={{ p: 0 }}>
                    <AddIcon fontSize="1px" />
                  </IconButton>
                </Box>
              </Box>
              {showMaxQuantityError && (
                <Typography sx={{ float: 'left', ml: '2px', color: 'red', fontSize: '12px' }}>
                  Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này
                </Typography>
              )}
            </Box>
            <ThemeProvider theme={ColorCustom}>
              <Button
                onClick={addProductToCart}
                type="submit"
                variant="contained"
                color="neutral"
                sx={{ marginRight: '15px' }}>
                Thêm vào giỏ hàng
              </Button>
              <Button
                onClick={checkOut}
                type="submit"
                variant="contained"
                color="red"
                sx={{ marginRight: '15px' }}>
                Mua ngay
              </Button>
            </ThemeProvider>
            <Accordion TransitionProps={{ unmountOnExit: true }} sx={{ boxShadow: 'none', mt: 3 }}>
              <AccordionSummary
                sx={{ padding: '0px 5px' }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header">
                <Typography color={'gray'}>Mô tả sản phẩm</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: '0px 5px 5px 5px' }}>
                <Typography>{product.description}</Typography>
              </AccordionDetails>
            </Accordion>
          </Grid2>
        </Grid2>
        <Box sx={{ width: '100%' }} mt={5}>
          <LabelTitle text="Sản phẩm cùng loại" />
          <CartProductCungLoai products={products} colsm={6} colmd={4} collg={3} />
        </Box>
        <div>
          {openModalCart && (
            <ModalAddProductToCart
              openModal={openModalCart}
              handleCloseModal={handleCloseModalCart}
              product={product}
            />
          )}
        </div>
      </Container>
    </div>
  )
}
