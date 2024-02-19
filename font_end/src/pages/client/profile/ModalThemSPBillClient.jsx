import '../../admin/hoadon/hoaDonStyle.css'
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
import { formatCurrency } from '../../../services/common/formatCurrency '
import { toast } from 'react-toastify'
import ClientAccountApi from '../../../api/client/clientAccount'
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
export default function ClientModalThemSP({ open, setOPen, idBill, load }) {
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
    ClientAccountApi.findAllBrand().then((response) => {
      setListBrand(response.data.data)
    })
    ClientAccountApi.findAllMaterial().then((response) => {
      setListMaterial(response.data.data)
    })
    ClientAccountApi.findAllColor().then((response) => {
      setListColor(response.data.data)
    })
    ClientAccountApi.findAllSole().then((response) => {
      setListSole(response.data.data)
    })
    ClientAccountApi.findAllCategory().then((response) => {
      setListCategory(response.data.data)
    })
    ClientAccountApi.findAllSize().then((response) => {
      setListSize(response.data.data)
    })
  }, [])

  const [, forceUpdate] = useState()
  useEffect(() => {
    fecthData(filter)
    forceUpdate({})
  }, [filter])

  const fecthData = (filter) => {
    ClientAccountApi.getAllProduct(filter).then((response) => {
      setListProduct(response.data.data)
    })
  }
  const getBillByIdBill = (id) => {
    ClientAccountApi.getBillDetailByIdBill(id).then((response) => {
      console.log('list detail')
      console.log(response.data.data)
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
  const confirmAddProductClient = (idBill, selectedProduct) => {
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
    console.log(billDetailReq)
    ClientAccountApi.saveBillDetail(billDetailReq)
      .then((response) => {
        getBillByIdBill(idBill)
        load(true)
        toast.success('Đã thêm sản phẩm', {
          position: toast.POSITION.TOP_RIGHT,
        })

        setIsProductDetailModalOpen(false)
      })
      .catch((error) => {
        toast.error('Đã xảy ra lỗi', {
          position: toast.POSITION.TOP_RIGHT,
        })
        console.error('Lỗi khi gửi yêu cầu APIsaveBillDetail: ', error)
      })
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
                          {cart.value ? ( // Kiểm tra xem sản phẩm có khuyến mãi không
                            <div>
                              <div className="promotion-price">{`${formatCurrency(
                                cart.price,
                              )}`}</div>{' '}
                              {/* Hiển thị giá gốc */}
                              <div>
                                <span style={{ color: 'red', fontWeight: 'bold' }}>
                                  {`${formatCurrency(
                                    calculateDiscountedPrice(cart.price, cart.value),
                                  )}`}
                                </span>{' '}
                                {/* Hiển thị giá sau khuyến mãi */}
                              </div>
                            </div>
                          ) : (
                            // Nếu không có khuyến mãi, chỉ hiển thị giá gốc
                            <span>{`${formatCurrency(cart.price)}`}</span>
                          )}
                        </p>
                      </TableCell>
                      <TableCell width={'15%'} align="center">
                        <Button
                          variant="outlined"
                          color="info"
                          size="small"
                          onClick={() => {
                            handleProductSelect(cart)
                            setAddAmount(1)
                          }}>
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
                        onClick={() => handleDecrementQuantity(selectedProduct)}>
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
                        onClick={() => handleIncrementQuantity(selectedProduct)}>
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
                  onClick={() => confirmAddProductClient(idBill, selectedProduct)}>
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
