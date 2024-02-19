import {
  Box,
  Divider,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetCart, removeCart, setCart, updateCart } from '../../services/slices/cartSlice'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ReplyIcon from '@mui/icons-material/Reply'
import { Link, useNavigate } from 'react-router-dom'
import { setCheckout } from '../../services/slices/checkoutSlice'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'
import clientCartApi from '../../api/client/clientCartApi'
import { socketUrl } from '../../services/url'
import checkStartApi from '../../api/checkStartApi'
import { toast } from 'react-toastify'

const styleModalCart = {
  position: 'absolute',
  top: '45%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  height: '550px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
}

const formatPrice = (price) => {
  return price.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  })
}

var stompClient = null
export default function ModalAddProductToCart({ openModal, handleCloseModal, product }) {
  const dispatch = useDispatch()
  const amountProduct = useSelector(GetCart).length
  const productCart = useSelector(GetCart)
  const [promotionByProductDetail, setGromotionByProductDetail] = useState([])
  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    const discountAmount = (discountPercentage / 100) * originalPrice
    const discountedPrice = originalPrice - discountAmount
    return discountedPrice
  }
  const navigate = useNavigate()

  const onChangeSL = (cart, num) => {
    const soluong = cart.soLuong + num
    if (soluong <= 0) {
      dispatch(removeCart(cart.id))
    } else {
      dispatch(updateCart({ ...cart, soLuong: soluong }))
    }
  }
  const product1 = useSelector(GetCart)

  const productIds = product1.map((cart) => cart.id)

  const getPromotionProductDetails = (id) => {
    clientCartApi.getPromotionByProductDetail(id).then((response) => {
      setGromotionByProductDetail(response.data.data)
    })
  }

  useEffect(() => {
    if (amountProduct > 0) {
      getPromotionProductDetails(productIds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [productCart])

  const onConnect = () => {
    stompClient.subscribe('/topic/realtime-san-pham-modal-add-to-card', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        updateRealTimeProductAddToCart(data)
      }
    })
  }
  function calculateProductTotalPayment(cart, promotionByProductDetail) {
    const isDiscounted = promotionByProductDetail.some(
      (item) => item.idProductDetail === cart.id && item.value,
    )

    if (isDiscounted) {
      const discountedPrice = promotionByProductDetail
        .filter((item) => item.idProductDetail === cart.id && item.value)
        .map((item) => cart.soLuong * calculateDiscountedPrice(cart.gia, item.value))
        .reduce((total, price) => total + price, 0)

      return discountedPrice
    } else {
      return cart.soLuong * cart.gia
    }
  }

  function updateRealTimeProductAddToCart(data) {
    const preProduct = [...productCart]
    const index = preProduct.findIndex((product) => product.id === data.id)
    const sl = preProduct[index].soLuong
    if (index !== -1) {
      preProduct[index] = { ...data, gia: data.price, soLuong: sl, image: data.image.split(',') }
      dispatch(setCart(preProduct))
    }
  }
  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={styleModalCart}>
          <Typography sx={{ float: 'right', color: 'white' }} onClick={handleCloseModal}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '-30px',
                marginRight: '-40px',
                cursor: 'pointer',
              }}>
              X
            </div>
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Sản phẩm đã được thêm vào giỏ hàng
          </Typography>
          <Divider sx={{ height: '2px', backgroundColor: 'black', mt: 2 }} />

          <Typography
            sx={{
              fontSize: '20px',
              fontWeight: 700,
              mt: 1,
              color: '#333333',
              textTransform: 'uppercase',
            }}>
            Giỏ hàng của bạn ({amountProduct} sản phẩm)
          </Typography>
          <div style={{ maxHeight: '330px', overflow: 'auto' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead
                style={{ backgroundColor: '#333', color: 'white', position: 'sticky', top: 0 }}>
                <TableRow>
                  <TableCell style={{ color: 'white' }} align="center">
                    ẢNH SẢN PHẨM
                  </TableCell>
                  <TableCell style={{ color: 'white' }} align="center">
                    TÊN SẢN PHẨM
                  </TableCell>
                  <TableCell style={{ color: 'white' }} align="center">
                    ĐƠN GIÁ
                  </TableCell>
                  <TableCell style={{ color: 'white' }} align="center">
                    SỐ LƯỢNG
                  </TableCell>
                  <TableCell style={{ color: 'white' }} align="center">
                    THÀNH TIỀN
                  </TableCell>
                  <TableCell style={{ color: 'white' }} align="center">
                    XÓA
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productCart.map((cart) => (
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <img src={cart.image[0]} alt={cart.name} width={130} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 1000, width: '30%' }} align="center">
                      {cart.name}
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontFamily={'monospace'} fontWeight={'700'} color={'red'}>
                        {promotionByProductDetail.map((item, index) => {
                          const isDiscounted = item.idProductDetail === cart.id && item.value

                          return (
                            <div key={index}>
                              {isDiscounted ? (
                                <div>
                                  <div className="promotion-price">{`${formatPrice(
                                    cart.gia,
                                  )} `}</div>
                                  <div>
                                    <span style={{ color: 'red', fontWeight: 'bold' }}>
                                      {`${formatPrice(
                                        calculateDiscountedPrice(cart.gia, item.value),
                                      )} `}
                                    </span>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          )
                        })}

                        {!promotionByProductDetail.some(
                          (item) => item.idProductDetail === cart.id && item.value,
                        ) && (
                          <div style={{ color: 'red' }}>{`${formatPrice(
                            cart.soLuong * cart.gia,
                          )} `}</div>
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <div className="quantity-control">
                        <button onClick={() => onChangeSL(cart, -1)}>-</button>
                        <input
                          onChange={(e) => {
                            let newValue = e.target.value.replace(/\D/, '')
                            newValue = newValue !== '' ? Math.max(1, Number(newValue)) : 1
                            dispatch(updateCart({ ...cart, soLuong: newValue }))
                          }}
                          value={cart.soLuong}
                          min="1"
                        />
                        <button onClick={() => onChangeSL(cart, 1)}>+</button>
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      {promotionByProductDetail.map((item, index) => {
                        const isDiscounted = item.idProductDetail === cart.id && item.value

                        return (
                          <div key={index}>
                            {isDiscounted ? (
                              <div>
                                <div>
                                  <span style={{ color: 'red', fontWeight: 'bold' }}>
                                    {`${formatPrice(
                                      cart.soLuong * calculateDiscountedPrice(cart.gia, item.value),
                                    )} `}
                                  </span>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        )
                      })}

                      {!promotionByProductDetail.some(
                        (item) => item.idProductDetail === cart.id && item.value,
                      ) && (
                        <div style={{ color: 'red' }}>{`${formatPrice(
                          cart.soLuong * cart.gia,
                        )} `}</div>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <DeleteForeverIcon
                        onClick={() => {
                          const updatedProduct = productCart.filter((item) => item.id !== cart.id)
                          dispatch(setCart(updatedProduct))
                          if (updatedProduct.length === 0) {
                            handleCloseModal()
                          }
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={12}>
            <div>
              <Link to="/cart" style={{ textDecoration: 'none' }}>
                <ReplyIcon />
                <b>Đến giỏ hàng</b>
              </Link>
            </div>
            <div>
              <Typography sx={{ mt: 3, fontSize: '17px' }}>
                Tổng thanh toán:
                <span style={{ fontWeight: 1000, marginLeft: '20px', color: 'red' }}>
                  {formatPrice(
                    productCart.reduce(
                      (total, cart) =>
                        total + calculateProductTotalPayment(cart, promotionByProductDetail),
                      0,
                    ),
                  )}
                </span>
              </Typography>

              {/* <Link to="/checkout"> */}
              <div
                style={{
                  width: '300px',
                  height: '40px',
                  backgroundColor: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '15px',
                }}
                onClick={async () => {
                  if (productCart) {
                    let allProductsAvailable = true

                    for (const e of productCart) {
                      const check = (await checkStartApi.checkQuantiy(e.id, e.soLuong)).data

                      if (!check) {
                        allProductsAvailable = false
                        break
                      }
                    }

                    if (allProductsAvailable) {
                      dispatch(setCheckout(productCart))
                      navigate('/checkout')
                    } else {
                      toast.warning('Có sản phẩm đã hết hàng, vui lòng load lại trang!')
                    }
                  }
                }}>
                TIẾN HÀNH THANH TOÁN
              </div>
              {/* </Link> */}
            </div>
          </Stack>
        </Box>
      </Modal>
    </div>
  )
}
