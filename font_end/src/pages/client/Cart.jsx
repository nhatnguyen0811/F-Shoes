import React, { useEffect, useState } from 'react'
import {
  Button,
  Checkbox,
  Container,
  Divider,
  TableFooter,
  TextField,
  Typography,
} from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import PaidRoundedIcon from '@mui/icons-material/PaidRounded'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link, useNavigate } from 'react-router-dom'
import { OrderCartFotter } from '../../layout/client/cartpage/OrderCart'
import { NoBoder } from '../../styles/TableStyle'
import './Cart.css'
import { useDispatch, useSelector } from 'react-redux'
import { GetCart, removeCart, setCart, updateCart } from '../../services/slices/cartSlice'
import { GetCheckout, setCheckout } from '../../services/slices/checkoutSlice'

import clientProductApi from '../../api/client/clientProductApi'
import clientCartApi from '../../api/client/clientCartApi'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'
import { socketUrl } from '../../services/url'
import confirmSatus from '../../components/comfirmSwal'
import { toast } from 'react-toastify'
import ModalVoucher from './ModalVoucher'
import checkStartApi from '../../api/checkStartApi'

var stompClient = null
export default function Cart() {
  const [productSelect, setProductSelect] = useState([])
  const [promotionByProductDetail, setGromotionByProductDetail] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  // const dispatch = useDispatch()

  const onChangeSL = (cart, num) => {
    setGiamGiaCart('')
    setVoucherCart(null)
    const soluong = cart.soLuong + num

    const updatedProduct = {
      ...cart,
      soLuong: soluong,
    }

    const updatedAmount = productSelect.reduce(
      (total, item) =>
        total + (item.id === cart.id ? updatedProduct.soLuong : item.soLuong) * item.gia,
      0,
    )

    if (updatedAmount > 50000000) {
      toast.error('Tổng số tiền sản phẩm không được vượt quá 50tr VND')
      return
    }

    if (soluong <= 0) {
      const title = 'Bạn có muốn xóa sản phẩm ra khỏi giỏ hàng không?'
      const text = ''
      confirmSatus(title, text).then((result) => {
        if (result.isConfirmed) {
          dispatch(removeCart(cart))
          const preProductSelect = [...productSelect]
          const index = preProductSelect.findIndex((e) => e.id === cart.id)
          if (index !== -1) {
            preProductSelect.splice(index, 1)
            setProductSelect(preProductSelect)
          }
        }
      })
    } else {
      const updatedProduct = {
        ...cart,
        soLuong: soluong,
      }
      dispatch(updateCart(updatedProduct))

      const preProductSelect = [...productSelect]
      const index = preProductSelect.findIndex((e) => e.id === cart.id)
      if (index !== -1) {
        preProductSelect[index] = updatedProduct
        setProductSelect(preProductSelect)
      }
    }
  }

  const [giamGiaCart, setGiamGiaCart] = useState('')
  const [openModalVoucherCart, setOpenModalVoucherCart] = useState(false)
  const [voucherCart, setVoucherCart] = useState(null)
  const [voucherFilterCart, setVoucherFilterCart] = useState({
    idCustomer: null,
    condition: 0,
    page: 1,
    size: 5,
  })
  const handleFilterVoucherCart = () => {
    setVoucherFilterCart({
      ...voucherFilterCart,
      condition: productSelect.reduce((total, cart) => {
        const matchingPromotion = promotionByProductDetail.find(
          (item) => item.idProductDetail === cart.id,
        )

        const itemTotal =
          cart.soLuong *
          (matchingPromotion && matchingPromotion.id !== ''
            ? calculateDiscountedPrice(cart.gia, matchingPromotion.value)
            : cart.gia)

        return total + itemTotal
      }, 0),
    })
    setOpenModalVoucherCart(true)
  }

  const product = useSelector(GetCart)
  const amountProduct = useSelector(GetCart).length

  const productIds = product.map((cart) => cart.id)

  const onChangeCheck = (cart, checked) => {
    setGiamGiaCart('')
    setVoucherCart(null)
    const preProductSelect = [...productSelect]

    if (checked) {
      if (preProductSelect.length < 5) {
        const totalSelectedAmount = preProductSelect.reduce(
          (total, item) => total + item.soLuong * item.gia,
          0,
        )

        if (totalSelectedAmount + cart.soLuong * cart.gia <= 50000000) {
          preProductSelect.push(cart)
        } else {
          toast.error('Tổng số tiền sản phẩm được chọn cao nhất là 50tr VND')
          return
        }
      } else {
        toast.error('Chỉ được chọn cao nhất 5 sản phẩm')
        return
      }
    } else {
      const index = preProductSelect.findIndex((e) => e.id === cart.id)
      preProductSelect.splice(index, 1)
    }

    setProductSelect(preProductSelect)
  }
  const reloadTotalAndSelected = (updatedProductArray) => {
    setProductSelect(updatedProductArray)
  }

  const getPromotionProductDetails = (id) => {
    clientCartApi.getPromotionByProductDetail(id).then((response) => {
      setGromotionByProductDetail(response.data.data)
    })
  }

  const [listCheck, setListCheck] = useState([])

  useEffect(() => {
    if (amountProduct > 0) {
      getPromotionProductDetails(productIds)
    }
    check()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function check() {
    const list = []
    if (product) {
      for (const e of product) {
        const check = (await checkStartApi.checkQuantiy(e.id, e.soLuong)).data
        if (!check) {
          list.push(e.id)
        }
      }
      setListCheck(list)
    }
  }

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [sizes, setSizes] = useState([])
  function getListSize(cart) {
    let data
    clientProductApi.get({ id: cart.id }).then(
      (result) => {
        data = result.data.data[0]
        clientProductApi
          .getSizes({
            idProduct: data.idProduct,
            idColor: data.idColor,
            idCategory: data.idCategory,
            idBrand: data.idBrand,
            idSole: data.idSole,
            idMaterial: data.idMaterial,
          })
          .then(
            (result) => {
              setSizes(result.data.data)
            },
            () => {},
          )
      },
      () => {},
    )
  }
  function chageSize(id, cart) {
    setGiamGiaCart('')
    setVoucherCart(null)
    const size = sizes.find((s) => s.id === id)
    const carts = [...product]
    const index = product.findIndex((c) => c.id === cart)
    carts[index] = { ...carts[index], ...size }
    dispatch(setCart(carts))
    const preProductSelect = [...productSelect]
    const indexSelect = preProductSelect.findIndex((e) => e.id === cart)
    if (indexSelect !== -1) {
      preProductSelect.splice(indexSelect, 1)
      setProductSelect(preProductSelect)
    }
    const preIds = productIds.map((cid) => {
      if (cid === cart) {
        return id
      } else {
        return cid
      }
    })
    getPromotionProductDetails(preIds)
  }

  const checkAll = (checked) => {
    setGiamGiaCart('')
    setVoucherCart(null)
    const newProductSelect = checked ? [...product] : []
    const newTotalSelectedAmount = newProductSelect.reduce(
      (total, item) => total + item.soLuong * item.gia,
      0,
    )

    if (checked && newTotalSelectedAmount > 50000000) {
      toast.error('Tổng số tiền sản phẩm được chọn không được vượt quá 50tr VND')
      return
    }

    setSelectAll(checked)
    setProductSelect(newProductSelect)
  }
  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    const discountAmount = (discountPercentage / 100) * originalPrice
    const discountedPrice = originalPrice - discountAmount
    return discountedPrice
  }
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    })
  }

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
    stompClient.subscribe('/topic/realtime-san-pham-cart', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        updateRealTimeProductCart(data)
      }
    })
  }

  function updateRealTimeProductCart(data) {
    const preProduct = [...product]
    const index = preProduct.findIndex((p) => p.id === data.id)
    const sl = preProduct[index].soLuong
    if (index !== -1) {
      preProduct[index] = { ...data, gia: data.price, soLuong: sl, image: data.image.split(',') }
      dispatch(setCart(preProduct))
    }
  }

  const cartMoney =
    productSelect.reduce((total, cart) => {
      const matchingPromotion = promotionByProductDetail.find(
        (item) => item.idProductDetail === cart.id,
      )

      const itemTotal =
        cart.soLuong *
        (matchingPromotion && matchingPromotion.id !== ''
          ? calculateDiscountedPrice(cart.gia, matchingPromotion.value)
          : cart.gia)

      return total + itemTotal
    }, 0) - giamGiaCart

  useEffect(() => {
    check()
  }, [product])
  return (
    <div className="cart">
      <Container maxWidth="xl">
        <Grid2 container rowSpacing={1} columnSpacing={3}>
          <Grid2 lg={8} width={'100%'}>
            <TableContainer
              component={Paper}
              sx={{ mb: '10px', maxHeight: '1000px', overflow: 'auto' }}>
              <Typography sx={{ fontSize: '20px', fontWeight: 700, ml: 3, mb: 3, mt: 2 }}>
                Giỏ hàng của bạn
              </Typography>
              <Divider style={{ height: '1px', backgroundColor: 'black', marginBottom: '20px' }} />

              <Typography sx={{ fontSize: '17px', ml: 3, mb: 3, mt: 2 }}>
                Bạn đang có <span style={{ fontWeight: 700 }}>{amountProduct} sản phẩm</span> trong
                giỏ hàng
              </Typography>

              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead style={{ backgroundColor: '#F26B16', color: 'white' }}>
                  <TableRow>
                    <TableCell width="3%">
                      {' '}
                      <Checkbox
                        size="small"
                        disabled={listCheck.some((cartId) => listCheck.includes(cartId))}
                        checked={selectAll}
                        onClick={(e) => {
                          checkAll(e.target.checked)
                        }}
                      />
                    </TableCell>
                    <TableCell style={{ color: 'white' }} align="center">
                      ẢNH
                    </TableCell>
                    <TableCell style={{ color: 'white' }} align="center">
                      TÊN SẢN PHẨM
                    </TableCell>
                    <TableCell style={{ color: 'white' }} align="center">
                      SIZE
                    </TableCell>
                    <TableCell style={{ color: 'white' }} align="center">
                      ĐƠN GIÁ
                    </TableCell>
                    <TableCell style={{ color: 'white', width: '20%' }} align="center">
                      SỐ LƯỢNG
                    </TableCell>
                    <TableCell style={{ color: 'white' }} width="20%" align="center">
                      THÀNH TIỀN
                    </TableCell>
                  </TableRow>
                </TableHead>
                {amountProduct > 0 ? (
                  <TableBody>
                    {product.map((cart) => (
                      <TableRow
                        sx={{
                          backgroundColor: '#F9F9F9',
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}>
                        <TableCell
                          onClick={() => {
                            if (listCheck.includes(cart.id)) {
                              toast.warning('Số lượng sản phẩm trong cửa hàng không còn đủ!')
                            }
                          }}>
                          <Checkbox
                            disabled={listCheck.includes(cart.id)}
                            checked={productSelect.findIndex((e) => e.id === cart.id) >= 0}
                            size="small"
                            onClick={(e) => {
                              if (listCheck.includes(cart.id)) {
                                toast.warning('Số lượng sản phẩm trong cửa hàng không còn đủ!')
                              } else {
                                onChangeCheck(cart, e.target.checked)
                              }
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <div
                            style={{
                              position: 'relative',
                              display: 'inline-block',
                              cursor: 'pointer',
                            }}>
                            <img
                              src={cart.image[0]}
                              alt={cart.name}
                              width={70}
                              onClick={() => {
                                navigate('/product/' + cart.id)
                              }}
                            />
                            <div
                              className="delete-product-cart"
                              onClick={() => {
                                setGiamGiaCart('')
                                setVoucherCart(null)
                                const updatedProduct = product.filter((item) => item.id !== cart.id)
                                dispatch(setCart(updatedProduct))
                                reloadTotalAndSelected(updatedProduct)
                              }}>
                              xóa
                            </div>
                          </div>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 1000, width: '30%' }} align="center">
                          {cart.name}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 1000, width: '10%' }} align="center">
                          <b style={{ margin: 0 }}>
                            <select
                              onClick={() => {
                                setSizes([])
                                getListSize(cart)
                              }}
                              onChange={(e) => {
                                chageSize(e.target.value, cart.id)
                              }}
                              value={
                                parseFloat(cart.size) % 1 === 0
                                  ? parseFloat(cart.size).toFixed(0)
                                  : parseFloat(cart.size).toFixed(1)
                              }>
                              <option value={cart.id}>
                                {parseFloat(cart.size) % 1 === 0
                                  ? parseFloat(cart.size).toFixed(0)
                                  : parseFloat(cart.size).toFixed(1)}
                              </option>
                              {sizes &&
                                sizes
                                  .filter(
                                    (e) =>
                                      e.id !== cart.id &&
                                      product.filter((f) => f.id === e.id).length <= 0,
                                  )
                                  .map((size) => {
                                    return (
                                      <option value={size.id} key={`size${size.id}`}>
                                        {parseFloat(size.size) % 1 === 0
                                          ? parseFloat(size.size).toFixed(0)
                                          : parseFloat(size.size).toFixed(1)}
                                      </option>
                                    )
                                  })}
                            </select>
                          </b>
                        </TableCell>
                        <TableCell align="center">
                          {' '}
                          <Typography fontFamily={'monospace'} fontWeight={700} color={'red'}>
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
                            ) && <div>{`${formatPrice(cart.gia)} `}</div>}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <div className="quantity-control">
                            <button onClick={() => onChangeSL(cart, -1)}>-</button>
                            <input
                              onChange={(e) => {
                                let newValue = e.target.value.replace(/\D/, '')
                                newValue =
                                  newValue !== '' ? Math.max(1, Math.min(99, Number(newValue))) : 1
                                dispatch(updateCart({ ...cart, soLuong: newValue }))
                              }}
                              value={cart.soLuong}
                              min="1"
                            />
                            <button
                              disabled={listCheck.includes(cart.id)}
                              onClick={() => onChangeSL(cart, 1)}>
                              +
                            </button>
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
                                          cart.soLuong *
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
                            <div style={{ color: 'red', fontWeight: 'bold' }}>{`${formatPrice(
                              cart.soLuong * cart.gia,
                            )} `}</div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={7} align="center" style={{ width: '100%' }}>
                        <img
                          style={{ width: '600px' }}
                          src={require('../../assets/image/no-data.png')}
                          alt="No-data"
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
            <Button component={Link} to="/products" variant="outlined" color="cam">
              <ArrowBackIcon />
              <b>Tiếp tục mua hàng</b>
            </Button>
          </Grid2>
          <Grid2 lg={4} xs={12}>
            <Paper variant="outlined" sx={{ minHeight: '54vh', padding: 4 }}>
              <Typography
                variant="h6"
                sx={{ fontFamily: 'monospace', fontWeight: '900', mt: 4, mb: 4 }}>
                THÔNG TIN ĐƠN HÀNG
              </Typography>
              <Table>
                <TableFooter sx={NoBoder}>
                  <OrderCartFotter
                    label="Tổng tiền"
                    value={cartMoney.toLocaleString('it-IT', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  />
                </TableFooter>
              </Table>
              <Divider style={{ height: '1px', backgroundColor: 'black', marginBottom: '20px' }} />
              <Typography sx={{ fontSize: '14px' }}>
                .Phí vận chuyển sẽ được tính ở trang thanh toán.
              </Typography>
              {/* <Typography sx={{ fontSize: '14px', marginTop: '16px' }}>
                <TextField
                  sx={{ flex: 1, minWidth: '100px', width: '100%' }}
                  value={voucherCart === null ? 'Phiếu giảm giá' : voucherCart.name}
                  size="small"
                  className="input-voucher"
                  disabled
                  InputProps={{
                    endAdornment: (
                      <Button
                        variant="contained"
                        onClick={() => handleFilterVoucherCart()}
                        style={{ backgroundColor: 'black' }}>
                        <b>Chọn </b>
                      </Button>
                    ),
                  }}
                />
                <ModalVoucher
                  open={openModalVoucherCart}
                  setOpen={setOpenModalVoucherCart}
                  setVoucher={setVoucherCart}
                  arrData={productSelect}
                  setGiamGia={setGiamGiaCart}
                  voucherFilter={voucherFilterCart}
                />
              </Typography> */}
              <Typography sx={{ fontSize: '14px', marginBottom: '20px' }}>
                .Bạn cũng có thể nhập phiếu giảm giá ở trang thanh toán.
              </Typography>
              <Button
                onClick={async () => {
                  if (productSelect) {
                    let allProductsAvailable = true

                    for (const e of productSelect) {
                      const check = (await checkStartApi.checkQuantiy(e.id, e.soLuong)).data

                      if (!check) {
                        allProductsAvailable = false
                        break
                      }
                    }

                    if (allProductsAvailable) {
                      dispatch(setCheckout(productSelect))
                      navigate('/checkout')
                    } else {
                      toast.warning('Có sản phẩm đã hết hàng, vui lòng load lại trang!')
                    }
                  }
                }}
                size="sm"
                variant="contained"
                disabled={productSelect.length > 0 ? false : true}
                sx={{
                  minWidth: '100%',
                  backgroundColor: '#333',
                  ':hover': {
                    backgroundColor: '#000',
                  },
                }}>
                <PaidRoundedIcon />
                <b> Tiến hành thanh toán</b>
              </Button>
            </Paper>
          </Grid2>
        </Grid2>
      </Container>
    </div>
  )
}
