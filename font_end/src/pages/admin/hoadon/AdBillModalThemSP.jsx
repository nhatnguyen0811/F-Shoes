import '../hoadon/hoaDonStyle.css'
import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import {
  Box,
  Container,
  MenuItem,
  Modal,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import bradApi from '../../../api/admin/sanpham/bradApi'
import materialApi from '../../../api/admin/sanpham/materialApi'
import colorApi from '../../../api/admin/sanpham/colorApi'
import categoryApi from '../../../api/admin/sanpham/categoryApi'
import soleApi from '../../../api/admin/sanpham/soleApi'
import sizeApi from '../../../api/admin/sanpham/sizeApi'
import sellApi from '../../../api/admin/sell/SellApi'
import { formatCurrency } from '../../../services/common/formatCurrency '
import hoaDonChiTietApi from '../../../api/admin/hoadon/hoaDonChiTiet'
import { toast } from 'react-toastify'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'
import { socketUrl } from '../../../services/url'
import confirmSatus from '../../../components/comfirmSwal'
import checkStartApi from '../../../api/checkStartApi'
const styleAdBillModalThemSP = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90vw', md: '80vw' },
  bgcolor: 'white',
  borderRadius: 1.5,
  boxShadow: 24,
}
const styleAdBillModalThemSPDetail = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '40vw', md: '28vw' },
  bgcolor: 'white',
  borderRadius: 1.5,
  boxShadow: 24,
}

var stompClient = null
export default function AdBillModalThemSP({ open, setOPen, idBill, load, setCheckPreBill }) {
  const [listBrand, setListBrand] = useState([])
  const [listMaterial, setListMaterial] = useState([])
  const [listColor, setListColor] = useState([])
  const [listSole, setListSole] = useState([])
  const [listCategory, setListCategory] = useState([])
  const [listSize, setListSize] = useState([])
  const [listProduct, setListProduct] = useState([])
  const [filter, setFilter] = useState({
    brand: null,
    material: null,
    color: null,
    sole: null,
    category: null,
    size: null,
    nameProductDetail: '',
  })

  const [addAmount, setAddAmount] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState(null) // Thông tin sản phẩm được chọn
  const [isProductDetailModalOpen, setIsProductDetailModalOpen] = useState(false) // Trạng thái hiển thị modal

  useEffect(() => {
    bradApi.findAll().then((response) => {
      setListBrand(response.data.data)
    })
    materialApi.findAll().then((response) => {
      setListMaterial(response.data.data)
    })
    colorApi.findAll().then((response) => {
      setListColor(response.data.data)
    })
    soleApi.findAll().then((response) => {
      setListSole(response.data.data)
    })
    categoryApi.findAll().then((response) => {
      setListCategory(response.data.data)
    })
    sizeApi.findAll().then((response) => {
      setListSize(response.data.data)
    })
  }, [])

  const [, forceUpdate] = useState()
  useEffect(() => {
    fecthData(filter)
    forceUpdate({})
  }, [filter])

  const fecthData = (filter) => {
    sellApi.getAllProduct(filter).then((response) => {
      setListProduct(response.data.data)
    })
  }

  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    // originalPrice là giá gốc của sản phẩm, discountPercentage là phần trăm giảm giá
    const discountAmount = (discountPercentage / 100) * originalPrice
    const discountedPrice = originalPrice - discountAmount
    return discountedPrice
  }
  const handleProductSelect = (product) => {
    setSelectedProduct(product)
    setIsProductDetailModalOpen(true)
  }

  const handleIncrementQuantity = (selectedProduct) => {
    if (addAmount < selectedProduct.amount) {
      setAddAmount(addAmount + 1)
    }
  }
  const handleDecrementQuantity = (selectedProduct) => {
    if (addAmount > 0) {
      setAddAmount(addAmount - 1)
    }
  }
  const handleTextFieldQuantityChange = (selectedProduct, newValue) => {
    if (newValue > selectedProduct.amount) {
      setAddAmount(selectedProduct.amount)
    } else if (newValue < selectedProduct.amount) {
      setAddAmount(newValue)
    } else {
      setAddAmount(1)
    }
  }
  const saveBillDetail = async (idBill, selectedProduct) => {
    try {
      const res = await checkStartApi.checkQuantiy(selectedProduct.id, addAmount)
      if (res.status === 200) {
        if (res.data) {
          var price = 0
          if (selectedProduct.value != null) {
            price = (
              selectedProduct.price -
              (selectedProduct.price * selectedProduct.value) / 100
            ).toFixed(0)
          } else {
            price = selectedProduct.price
          }
          const billDetailReq = {
            productDetailId: selectedProduct.productDetailId,
            idBill: idBill,
            quantity: addAmount,
            price: price,
            status: 0,
          }
          if (billDetailReq.quantity > 5) {
            toast.error('Vượt quá số lượng cho phép', {
              position: toast.POSITION.TOP_CENTER,
            })
            return
          } else if (billDetailReq.quantity <= 0) {
            toast.error('Vui lòng kiểm tra lại số lượng', {
              position: toast.POSITION.TOP_CENTER,
            })
            return
          } else {
            hoaDonChiTietApi
              .saveBillDetail(billDetailReq)
              .then((response) => {
                toast.success('Đã thêm sản phẩm', {
                  position: toast.POSITION.TOP_RIGHT,
                })
                load(true)
                setIsProductDetailModalOpen(false)
              })
              .catch((error) => {
                toast.error('Đã xảy ra lỗi', {
                  position: toast.POSITION.TOP_RIGHT,
                })
                console.error('Lỗi khi gửi yêu cầu APIsaveBillDetail: ', error)
              })
            return
          }
        } else {
          toast.error('Số lượng sản phẩm không đủ, vui lòng kiểm tra lại')
        }
      }
    } catch (error) {
      toast.error('Có lỗi vui lòng kiểm tra lại')
    }
  }
  const confirmAddProduct = (idBill, selectedProduct) => {
    var price = 0
    if (selectedProduct.value != null) {
      price = (
        selectedProduct.price -
        (selectedProduct.price * selectedProduct.value) / 100
      ).toFixed(0)
    } else {
      price = selectedProduct.price
    }
    const billDetailReq = {
      productDetailId: selectedProduct.productDetailId,
      idBill: idBill,
      quantity: addAmount,
      price: price,
      status: 0,
    }
    hoaDonChiTietApi
      .getByIdBillAndIdPrdAndPrice(idBill, selectedProduct.id, billDetailReq.price)
      .then((response) => {
        if (response.data.data === null) {
          hoaDonChiTietApi.getByIdBillAndIdPrd(idBill, selectedProduct.id).then((response) => {
            if (response.data.data.length > 0) {
              confirmSatus(
                'Đơn giá sản phẩm đã thay đổi',
                'Chắc chắn xác nhận với đơn giá mới?',
              ).then((result) => {
                if (result.isConfirmed) {
                  saveBillDetail(idBill, selectedProduct)
                  setCheckPreBill(true)
                }
              })
            } else {
              saveBillDetail(idBill, selectedProduct)
              setCheckPreBill(true)
            }
          })
        } else {
          const billDetailExsit = response.data.data
          if (billDetailExsit.quantity + billDetailReq.quantity > 5) {
            toast.error('Vượt quá số lượng cho phép', {
              position: toast.POSITION.TOP_CENTER,
            })
            return
          } else {
            saveBillDetail(idBill, selectedProduct)
            setCheckPreBill(true)
          }
        }
      })
      .catch((error) => {
        toast.error('Đã xảy ra lỗi', {
          position: toast.POSITION.TOP_RIGHT,
        })
        console.error('Lỗi khi gửi yêu cầu APIsaveBillDetail: ', error)
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
  }, [listProduct])

  const onConnect = () => {
    stompClient.subscribe('/topic/realtime-san-pham-modal-add-admin', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        updateRealTimeProductDetail(data)
      }
    })
    // stompClient.subscribe(
    //   '/topic/realtime-san-pham-detail-modal-add-admin-by-add-in-bill-detail',
    //   (message) => {
    //     if (message.body) {
    //       const data = JSON.parse(message.body)
    //       updateRealTimeProductDetail(data)
    //     }
    //   },
    // )
    // stompClient.subscribe(
    //   '/topic/realtime-san-pham-detail-modal-add-admin-decrease-by-bill-detail',
    //   (message) => {
    //     if (message.body) {
    //       const data = JSON.parse(message.body)
    //       updateRealTimeProductDetail(data)
    //     }
    //   },
    // )
    // stompClient.subscribe(
    //   '/topic/realtime-san-pham-detail-modal-add-admin-increase-by-bill-detail',
    //   (message) => {
    //     if (message.body) {
    //       const data = JSON.parse(message.body)
    //       updateRealTimeProductDetail(data)
    //     }
    //   },
    // )
  }

  function updateRealTimeProductDetail(data) {
    const preProduct = [...listProduct]
    const index = preProduct.findIndex((p) => p.id === data.id)
    if (index !== -1) {
      preProduct[index] = data
      setListProduct(preProduct)
    }
  }
  return (
    <div>
      <Modal
        open={open}
        onClose={() => {
          setOPen(false)
        }}>
        <Box sx={styleAdBillModalThemSP}>
          <Toolbar>
            <Box
              sx={{
                color: 'black',
                flexGrow: 1,
              }}>
              <Typography variant="h6" component="div">
                Tìm kiếm sản phẩm
              </Typography>
            </Box>
            <IconButton
              onClick={() => {
                setOPen(false)
              }}
              aria-label="close"
              color="error"
              style={{
                boxShadow: '1px 2px 3px 1px rgba(0,0,0,.05)',
              }}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <Container>
            <Box>
              <TextField
                sx={{
                  width: '50%',
                  '.MuiInputBase-input': { py: '7.5px' },
                }}
                size="small"
                variant="outlined"
                placeholder="Tên sản phẩm"
                onChange={(e) => {
                  setFilter({ ...filter, nameProductDetail: e.target.value })
                }}
              />
              <Button sx={{ ml: 2 }} color="cam" variant="outlined">
                Tìm kiếm
              </Button>
            </Box>
            <Box>
              <b>Danh mục:</b>
              <Select
                displayEmpty
                sx={{
                  '.MuiSelect-select': {
                    pl: 1,
                    color: 'orange',
                    fontWeight: 'bold',
                  },
                  '.MuiOutlinedInput-notchedOutline': {
                    border: 'none!important',
                  },
                }}
                value={filter.category}
                onChange={(e) => {
                  setFilter({ ...filter, category: e.target.value })
                }}>
                <MenuItem value={null}>Tất cả</MenuItem>
                {listCategory?.map((item) => (
                  <MenuItem value={item?.id} key={item?.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <b>Màu sắc:</b>
              <Select
                displayEmpty
                sx={{
                  '.MuiSelect-select': {
                    pl: 1,
                    color: 'orange',
                    fontWeight: 'bold',
                  },
                  '.MuiOutlinedInput-notchedOutline': {
                    border: 'none!important',
                  },
                }}
                value={filter.color}
                onChange={(e) => {
                  setFilter({ ...filter, color: e.target.value })
                }}>
                <MenuItem value={null}>Tất cả</MenuItem>
                {listColor?.map((item) => (
                  <MenuItem value={item?.id} key={item?.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <b>Chất liệu:</b>
              <Select
                displayEmpty
                sx={{
                  '.MuiSelect-select': {
                    pl: 1,
                    color: 'orange',
                    fontWeight: 'bold',
                  },
                  '.MuiOutlinedInput-notchedOutline': {
                    border: 'none!important',
                  },
                }}
                value={filter.material}
                onChange={(e) => {
                  setFilter({ ...filter, material: e.target.value })
                }}>
                <MenuItem value={null}>Tất cả</MenuItem>
                {listMaterial?.map((item) => (
                  <MenuItem value={item?.id} key={item?.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>

              <b>Kích cỡ:</b>
              <Select
                displayEmpty
                sx={{
                  '.MuiSelect-select': {
                    pl: 1,
                    color: 'orange',
                    fontWeight: 'bold',
                  },
                  '.MuiOutlinedInput-notchedOutline': {
                    border: 'none!important',
                  },
                }}
                value={filter.size}
                onChange={(e) => {
                  setFilter({ ...filter, size: e.target.value })
                }}>
                <MenuItem value={null}>Tất cả</MenuItem>
                {listSize?.map((item) => (
                  <MenuItem value={item?.id} key={item?.id}>
                    {item.size}
                  </MenuItem>
                ))}
              </Select>

              <b>Đế giầy:</b>
              <Select
                displayEmpty
                sx={{
                  '.MuiSelect-select': {
                    pl: 1,
                    color: 'orange',
                    fontWeight: 'bold',
                  },
                  '.MuiOutlinedInput-notchedOutline': {
                    border: 'none!important',
                  },
                }}
                value={filter.sole}
                onChange={(e) => {
                  setFilter({ ...filter, sole: e.target.value })
                }}>
                <MenuItem value={null}>Tất cả</MenuItem>
                {listSole?.map((item) => (
                  <MenuItem value={item?.id} key={item?.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>

              <b>Thương hiệu:</b>
              <Select
                displayEmpty
                sx={{
                  '.MuiSelect-select': {
                    pl: 1,
                    color: 'orange',
                    fontWeight: 'bold',
                  },
                  '.MuiOutlinedInput-notchedOutline': {
                    border: 'none!important',
                  },
                }}
                value={filter.brand}
                onChange={(e) => {
                  setFilter({ ...filter, brand: e.target.value })
                }}>
                <MenuItem value={null}>Tất cả</MenuItem>
                {listBrand?.map((item) => (
                  <MenuItem value={item?.id} key={item?.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box
              sx={{
                maxHeight: '440px',
                overflow: 'auto',
              }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width={'10%'} align="center" sx={{ fontWeight: 'bold' }}>
                      Ảnh
                    </TableCell>
                    <TableCell width={'10%'} align="center" sx={{ fontWeight: 'bold' }}>
                      Tên
                    </TableCell>
                    <TableCell width={'10%'} align="center" sx={{ fontWeight: 'bold' }}>
                      Mã
                    </TableCell>
                    {/* <TableCell width={'10%'} align="center" sx={{ fontWeight: 'bold' }}>
                  Số lượng
                </TableCell> */}
                    <TableCell width={'10%'} align="center" sx={{ fontWeight: 'bold' }}>
                      Danh mục
                    </TableCell>
                    <TableCell width={'10%'} align="center" sx={{ fontWeight: 'bold' }}>
                      Thương hiệu
                    </TableCell>
                    <TableCell width={'10%'} align="center" sx={{ fontWeight: 'bold' }}>
                      Màu sắc
                    </TableCell>
                    <TableCell width={'10%'} align="center" sx={{ fontWeight: 'bold' }}>
                      Chất liệu
                    </TableCell>
                    <TableCell width={'10%'} align="center" sx={{ fontWeight: 'bold' }}>
                      size
                    </TableCell>
                    <TableCell width={'15%'} align="center" sx={{ fontWeight: 'bold' }}>
                      Giá
                    </TableCell>
                    <TableCell width={'15%'} align="center" sx={{ fontWeight: 'bold' }}>
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listProduct.map((cart, index) => (
                    <TableRow key={cart.productDetailId}>
                      <TableCell width={'15%'} align="center">
                        <div style={{ position: 'relative' }}>
                          <img width={'100%'} alt="error" src={cart.url} />
                          {cart.value && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '0',
                                right: '0',
                                backgroundColor:
                                  cart.value >= 1 && cart.value <= 50
                                    ? '#66CC00'
                                    : cart.value >= 51 && cart.value <= 80
                                      ? '#FF9900'
                                      : '#FF0000',
                                color: 'white',
                                padding: '6px 5px',
                                borderRadius: '0 0 0 10px',
                              }}
                              className="discount">
                              {cart.value}% OFF
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell align="center">{cart.name}</TableCell>
                      <TableCell align="center">{cart.code}</TableCell>
                      {/* <TableCell align="center">{cart.amount}</TableCell> */}
                      <TableCell align="center">{cart.category}</TableCell>
                      <TableCell align="center">{cart.brand}</TableCell>
                      <TableCell align="center">{cart.color}</TableCell>
                      <TableCell align="center">{cart.material}</TableCell>
                      <TableCell align="center">{cart.size}</TableCell>

                      <TableCell
                        align="center"
                        sx={{
                          color: 'red',
                          fontWeight: 'bold',
                        }}>
                        <p style={{ color: 'red', margin: '5px 0' }}>
                          {/* <b>{cart.price}.000&#8363;</b> */}
                          {cart.value !== null ? ( // Kiểm tra xem sản phẩm có khuyến mãi không
                            <div>
                              <div className="promotion-price">{`${formatCurrency(
                                cart.price,
                              )}`}</div>
                              {/* Hiển thị giá gốc */}
                              <div>
                                <span style={{ color: 'red', fontWeight: 'bold' }}>
                                  {`${formatCurrency(
                                    calculateDiscountedPrice(cart.price, cart.value),
                                  )}`}
                                </span>
                                {/* Hiển thị giá sau khuyến mãi */}
                              </div>
                            </div>
                          ) : (
                            // Nếu không có khuyến mãi, chỉ hiển thị giá gốc
                            <span style={{ color: 'red', fontWeight: 'bold' }}>
                              {formatCurrency(cart.price)}
                            </span>
                          )}
                        </p>
                      </TableCell>
                      <TableCell width={'15%'} align="center">
                        {/* <Button
                          onClick={
                            // () => onSubmitAddCartDetail(cart.productDetailId)
                            () => {
                              setIsShowProductDetail(true)
                              hanldeAmountProduct(cart.productDetailId)
                              setSelectedProduct(cart)
                            }
                          }
                          variant="outlined"
                          color="info"
                          size="small">
                          Chọn
                        </Button> */}
                        <Button
                          variant="outlined"
                          color="info"
                          size="small"
                          onClick={() => handleProductSelect(cart)}>
                          Chọn
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Container>
        </Box>
      </Modal>
      <Modal open={isProductDetailModalOpen} onClose={() => setIsProductDetailModalOpen(false)}>
        <Box sx={styleAdBillModalThemSPDetail}>
          <Toolbar>
            <Box sx={{ color: 'black', flexGrow: 1 }}>
              <Typography variant="h6" component="div">
                {selectedProduct ? selectedProduct.name : ''}
              </Typography>
            </Box>
            <IconButton
              onClick={() => setIsProductDetailModalOpen(false)}
              aria-label="close"
              color="error"
              style={{ boxShadow: '1px 2px 3px 1px rgba(0,0,0,.05)' }}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <Container>
            {selectedProduct && (
              <div>
                <p>{`Tên sản phẩm:  ${selectedProduct.category} - ${selectedProduct.name} - ${selectedProduct.material} - ${selectedProduct.color} `}</p>
                <Box py={1} display="flex" justifyContent="space-between">
                  <Stack>
                    <Typography
                      sx={{ float: 'left', marginBottom: '5px' }}
                      color={'red'}
                      mr={2}
                      fontWeight={'bold'}>
                      Số lượng: {selectedProduct.amount}
                    </Typography>
                  </Stack>
                  <Stack sx={{ marginLeft: '5px' }}>
                    <Box
                      width={'65px'}
                      display="flex"
                      alignItems="center"
                      sx={{ border: '1px solid gray', borderRadius: '20px' }}
                      p={'3px'}>
                      <IconButton
                        sx={{ p: 0 }}
                        size="small"
                        onClick={() => handleDecrementQuantity(selectedProduct)}
                        disabled={addAmount - 1 === 0}>
                        <RemoveIcon fontSize="1px" />
                      </IconButton>

                      <TextField
                        value={addAmount}
                        inputProps={{ min: 1 }}
                        size="small"
                        sx={{
                          width: '30px ',
                          '& input': { p: 0, textAlign: 'center' },
                          '& fieldset': {
                            border: 'none',
                          },
                        }}
                        onChange={(e) =>
                          handleTextFieldQuantityChange(selectedProduct, e.target.value)
                        }
                        // onFocus={(e) => handleTextFieldQuanityFocus(e, selectedProduct)}
                      />

                      <IconButton
                        sx={{ p: 0 }}
                        size="small"
                        onClick={() => handleIncrementQuantity(selectedProduct)}
                        disabled={addAmount + 1 > 5}>
                        <AddIcon fontSize="1px" />
                      </IconButton>
                    </Box>
                  </Stack>
                </Box>
              </div>
            )}
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
              spacing={2}
              sx={{ marginTop: 3, marginBottom: 3 }}>
              <Box>
                <Button
                  variant="outlined"
                  color="cam"
                  onClick={() => confirmAddProduct(idBill, selectedProduct)}>
                  <b>Xác nhận</b>
                </Button>
              </Box>
            </Stack>
          </Container>
        </Box>
      </Modal>
    </div>
  )
}
