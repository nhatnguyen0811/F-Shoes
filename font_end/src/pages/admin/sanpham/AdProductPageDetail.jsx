import React, { Fragment, useEffect, useState } from 'react'
import { formatCurrency } from '../../../services/common/formatCurrency '
import './index.css'
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Slider,
  SliderThumb,
  Stack,
  Table,
  TableHead,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { TbEyeEdit } from 'react-icons/tb'
import sanPhamApi from '../../../api/admin/sanpham/sanPhamApi'
import Empty from '../../../components/Empty'
import colorApi from '../../../api/admin/sanpham/colorApi'
import materialApi from '../../../api/admin/sanpham/materialApi'
import categoryApi from '../../../api/admin/sanpham/categoryApi'
import bradApi from '../../../api/admin/sanpham/bradApi'
import sizeApi from '../../../api/admin/sanpham/sizeApi'
import soleApi from '../../../api/admin/sanpham/soleApi'
import { useParams } from 'react-router-dom'
import { MdEditSquare } from 'react-icons/md'

import PropTypes from 'prop-types'

import BreadcrumbsCustom from '../../../components/BreadcrumbsCustom'
import styled from '@emotion/styled'
import ModalAddProduct from './ModalAddProduct'
import { toast } from 'react-toastify'
import AdModalDetailProductDetail from './AdModalDetailProductDetail'
import confirmSatus from '../../../components/comfirmSwal'
import Carousel from 'react-material-ui-carousel'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'
import { socketUrl } from '../../../services/url'

import useDebounce from '../../../services/hook/useDebounce'

const listBreadcrumbs = [{ name: 'Sản phẩm', link: '/admin/product' }]

var stompClient = null
function AirbnbThumbComponent(props) {
  const { children, ...other } = props
  return <SliderThumb {...other}>{children}</SliderThumb>
}
const AirbnbSlider = styled(Slider)(() => ({
  color: '#fc7c27',
  height: 1,
  padding: '13px 0',
  '& .MuiSlider-thumb': {
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    border: '1px solid currentColor',
    '&:hover': {
      boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
    },
    '& .airbnb-bar': {
      height: 1,
      width: 1,
      backgroundColor: '#fc7c27',
      marginLeft: 1,
      marginRight: 1,
    },
    '& .MuiSlider-valueLabel': {
      lineHeight: 1.2,
      fontSize: 12,
      backgroundColor: '#fc7c27',
    },
  },
}))

AirbnbThumbComponent.propTypes = {
  children: PropTypes.node,
}
export default function AdProductPageDetail() {
  const { id } = useParams()

  const [product, setProduct] = useState({})
  const [listUpdate, setListUpdate] = useState([])
  const [listColor, setListColor] = useState([])
  const [listMaterial, setListMaterial] = useState([])
  const [listSize, setListSize] = useState([])
  const [listSole, setListSole] = useState([])
  const [listCategory, setListCategory] = useState([])
  const [listBrand, setListBrand] = useState([])
  const [priceMax, setPriceMax] = useState(999999999)
  const [listProductDetail, setListProductDetail] = useState([])
  const [total, setTotal] = useState([])
  const [filter, setFilter] = useState({
    product: id,
    name: null,
    color: null,
    material: null,
    sizeFilter: null,
    sole: null,
    category: null,
    brand: null,
    status: null,
    priceMin: 0,
    size: 5,
    page: 1,
  })
  const [openEditProduct, setOpenEditProduct] = useState(false)

  const [nameProduct, setNameProduct] = useState('')

  const [listErr, setListErr] = useState([])

  useEffect(() => {
    categoryApi.findAll().then((response) => {
      setListCategory(response.data.data)
    })
    bradApi.findAll().then((response) => {
      setListBrand(response.data.data)
    })
    colorApi.findAll().then((response) => {
      setListColor(response.data.data)
    })
    materialApi.findAll().then((response) => {
      setListMaterial(response.data.data)
    })
    sizeApi.findAll().then((response) => {
      setListSize(response.data.data)
    })
    soleApi.findAll().then((response) => {
      setListSole(response.data.data)
    })
  }, [id])

  function fetchDataProduct(id) {
    sanPhamApi.getNameProduct(id).then((result) => {
      setProduct(result.data.data)
      setPriceMax(result.data.data.price)
    })
  }

  useEffect(() => {
    setListUpdate([])
    fetchData(filter, priceMax)
  }, [filter, priceMax])

  const [inputValue, setInputValue] = useState('')
  const debouncedValue = useDebounce(inputValue, 1000)

  useEffect(() => {
    setFilter({ ...filter, name: inputValue })
  }, [debouncedValue])

  function fetchData(filter, priceMax) {
    fetchDataProduct(id)
    sanPhamApi.getProductDetail({ ...filter, priceMax: priceMax }).then((response) => {
      setListProductDetail(response.data.data.data)
      setTotal(response.data.data.totalPages)
      if (filter.page > response.data.data.totalPages)
        if (response.data.data.totalPages > 0) {
          setFilter({ ...filter, page: response.data.data.totalPages })
        }
    })
  }

  const [open, setOpen] = useState(false)
  const [productDetail, setProductDetail] = useState({})

  const handleClickOpen = (idProductDetail, listImage) => {
    sanPhamApi
      .updateProductDetail(idProductDetail)
      .then((result) => {
        if (result.data.success) {
          setProductDetail({ ...result.data.data, image: listImage })
          setOpen(true)
        }
      })
      .catch((error) => {
        toast.error('Lỗi hệ thống, Vui lòng thử lại')
        console.error(error)
      })
  }
  const handleDelete = (id) => {
    const title = 'Bạn có muốn chuyển trạng thái không'
    const text = ''
    confirmSatus(title, text).then((result) => {
      if (result.isConfirmed) {
        sanPhamApi.changeStatus(id).then(() => {
          fetchData(filter, priceMax)
          toast.success('Chuyển trạng thái thành công', {
            position: toast.POSITION.TOP_RIGHT,
          })
        })
      }
    })
  }

  function validate(listUpdate) {
    let errors = []

    listUpdate.forEach((product) => {
      if (isNaN(product.price) || product.price <= 0 || product.price >= 100000000) {
        errors.push({
          id: product.id,
          message: 'Giá sản phẩm phải là một số dương và nhỏ hơn 100 triệu',
        })
        return false
      }
      if (isNaN(product.amount) || product.amount <= 0 || product.amount >= 1000) {
        errors.push({
          id: product.id,
          message: 'Số lượng sản phẩm phải là một số dương và nhỏ hơn 1000',
        })
        return false
      }
      if (isNaN(product.weight) || product.weight <= 0 || product.weight >= 10000) {
        errors.push({
          id: product.id,
          message: 'Trọng lượng sản phẩm phải là một số dương và nhỏ hơn 10000',
        })
        return false
      }
    })
    setListErr(errors)
    return errors.length === 0
  }

  function updateListProduct() {
    const requests = listUpdate.map((prd) => {
      return { id: prd.id, weight: prd.weight, amount: prd.amount, price: prd.price }
    })
    const title = 'Xác nhận cập nhập sản phẩm?'
    const text = ''
    confirmSatus(title, text).then((result) => {
      if (result.isConfirmed && validate(listUpdate)) {
        sanPhamApi
          .updateList(requests)
          .then()
          .finally(() => {
            toast.success('Cập nhập thành công')
            setListUpdate([])
            fetchData(filter, priceMax)
            fetchDataProduct(id)
          })
      }
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
  }, [listProductDetail])

  const onConnect = () => {
    stompClient.subscribe('/topic/realtime-san-pham-detail-admin-by-bill-comfirm', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        updateRealTimeProductDetail(data)
      }
    })
    stompClient.subscribe(
      '/topic/realtime-san-pham-detail-admin-by-add-in-bill-detail',
      (message) => {
        if (message.body) {
          const data = JSON.parse(message.body)
          updateRealTimeProductDetail(data)
        }
      },
    )
    stompClient.subscribe(
      '/topic/realtime-san-pham-detail-admin-increase-by-bill-detail',
      (message) => {
        if (message.body) {
          const data = JSON.parse(message.body)
          updateRealTimeProductDetail(data)
        }
      },
    )
    stompClient.subscribe(
      '/topic/realtime-san-pham-detail-admin-decrease-by-bill-detail',
      (message) => {
        if (message.body) {
          const data = JSON.parse(message.body)
          updateRealTimeProductDetail(data)
        }
      },
    )
    stompClient.subscribe('/topic/realtime-san-pham-detail-cancel-bill-admin', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        updateRealTimeProductDetail(data)
      }
    })
  }

  function updateRealTimeProductDetail(data) {
    const preProduct = [...listProductDetail]
    const index = preProduct.findIndex((product) => product.id === data.id)
    if (index !== -1) {
      preProduct[index] = data
      setListProductDetail(preProduct)
    }
  }

  return (
    <div className="san-pham">
      <ModalAddProduct
        dataProduct={product}
        setProduct={setProduct}
        nameProduct={nameProduct}
        setNameProduct={setNameProduct}
        title={'Cập nhập sản phẩm'}
        setOpen={setOpenEditProduct}
        open={openEditProduct}
      />
      <Stack direction="row">
        <BreadcrumbsCustom nameHere={product.name} listLink={listBreadcrumbs} />
        <Tooltip title="Chỉnh sửa">
          <IconButton
            color="warning"
            sx={{ mt: '-6px' }}
            onClick={() => {
              setOpenEditProduct(true)
            }}>
            <MdEditSquare style={{ fontSize: '18px' }} />
          </IconButton>
        </Tooltip>
      </Stack>
      <Paper sx={{ p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ paddingRight: '50px' }}>
          <TextField
            onChange={(e) => {
              setInputValue(e.target.value)
            }}
            sx={{ width: '50%' }}
            className="search-field"
            size="small"
            color="cam"
            placeholder="Nhập mã sản phẩm để tìm..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="cam" />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ width: '250px' }}>
            <b>0 VND</b>
            <b style={{ float: 'right' }}>{`${parseInt(product.price).toLocaleString('it-IT', {
              style: 'currency',
              currency: 'VND',
            })}`}</b>
            <AirbnbSlider
              onChangeCommitted={(_, value) => {
                setFilter({ ...filter, priceMin: value[0] })
                setPriceMax(value[1])
              }}
              min={0}
              max={product.price}
              valueLabelDisplay="auto"
              slots={{ thumb: AirbnbThumbComponent }}
              defaultValue={[filter.priceMin, priceMax]}
              valueLabelFormat={(value) =>
                `${value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}`
              }
            />
          </Box>
        </Stack>
        <Stack my={2} direction="row" justifyContent="center" alignItems="flex-start" spacing={3}>
          {/* Stack trên 1 */}
          <Stack direction="row" spacing={3} alignItems="center">
            <div className="filter">
              <b>Danh mục:</b>
              <Select
                displayEmpty
                size="small"
                value={filter.category}
                onChange={(e) => {
                  setFilter({ ...filter, category: e.target.value })
                }}>
                <MenuItem value={null}>Tất cả</MenuItem>
                {listCategory?.map((item) => (
                  <MenuItem key={item?.id} value={item?.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </Stack>

          {/* Stack trên 2 */}
          <Stack direction="row" spacing={3} alignItems="center">
            <div className="filter">
              <b>Thương hiệu:</b>
              <Select
                displayEmpty
                size="small"
                value={filter.brand}
                onChange={(e) => {
                  setFilter({ ...filter, brand: e.target.value })
                }}>
                <MenuItem value={null}>Tất cả</MenuItem>
                {listBrand?.map((item) => (
                  <MenuItem key={item?.id} value={item?.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </Stack>

          {/* Stack trên 3 */}
          <Stack direction="row" spacing={3} alignItems="center">
            <div className="filter">
              <b>Màu sắc:</b>
              <Select
                displayEmpty
                size="small"
                value={filter.color}
                onChange={(e) => {
                  setFilter({ ...filter, color: e.target.value })
                }}>
                <MenuItem value={null}>Tất cả</MenuItem>
                {listColor?.map((item) => (
                  <MenuItem key={item?.id} value={item?.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </Stack>

          {/* Stack trên 4 */}
          <Stack direction="row" spacing={3} alignItems="center">
            <div className="filter">
              <b style={{ marginLeft: '15px' }}>Chất liệu:</b>
              <Select
                displayEmpty
                size="small"
                value={filter.material}
                onChange={(e) => {
                  setFilter({ ...filter, material: e.target.value })
                }}>
                <MenuItem value={null}>Tất cả</MenuItem>
                {listMaterial?.map((item) => (
                  <MenuItem key={item?.id} value={item?.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </Stack>
        </Stack>

        {/* Stack dưới 1 */}
        <Stack my={2} direction="row" justifyContent="center" alignItems="flex-start" spacing={3}>
          <div className="filter">
            <b>Kích cỡ:</b>
            <Select
              displayEmpty
              size="small"
              value={filter.sizeFilter}
              onChange={(e) => {
                setFilter({ ...filter, sizeFilter: e.target.value })
              }}>
              <MenuItem value={null}>Tất cả</MenuItem>
              {listSize?.map((item) => (
                <MenuItem key={item?.id} value={item?.id}>
                  {item.size}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="filter">
            <b>Đế giày:</b>
            <Select
              displayEmpty
              size="small"
              value={filter.sole}
              onChange={(e) => {
                setFilter({ ...filter, sole: e.target.value })
              }}>
              <MenuItem value={null}>Tất cả</MenuItem>
              {listSole?.map((item) => (
                <MenuItem key={item?.id} value={item?.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="filter">
            <b style={{ marginLeft: '15px' }}>Trạng thái:</b>
            <Select
              displayEmpty
              size="small"
              value={filter.status}
              onChange={(e) => {
                setFilter({ ...filter, status: e.target.value })
              }}>
              <MenuItem value={null}>Tất cả</MenuItem>
              {[
                { id: 0, name: 'Đang bán' },
                { id: 1, name: 'Ngừng bán' },
              ].map((item) => (
                <MenuItem key={item?.id} value={item?.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </div>
        </Stack>
      </Paper>
      <Paper sx={{ py: 2, mt: 2 }}>
        <Typography mb={1} textAlign={'center'} fontWeight={'600'} variant="h6" color={'GrayText'}>
          Danh sách sản phẩm
          {listUpdate.length > 0 && (
            <Button
              onClick={() => {
                updateListProduct()
              }}
              style={{ float: 'right' }}
              color="cam"
              variant="outlined">
              Cập nhập tất cả
            </Button>
          )}
        </Typography>
        {listProductDetail.length > 0 ? (
          <Fragment>
            <Table className="tableCss">
              <TableHead>
                <TableRow>
                  <TableCell align="center" width={'3%'}>
                    <input
                      onClick={() => {
                        if (listProductDetail.length === listUpdate.length) {
                          setListUpdate([])
                        } else {
                          setListUpdate([...listProductDetail])
                        }
                      }}
                      type="checkbox"
                      checked={listProductDetail.length === listUpdate.length}
                    />
                  </TableCell>
                  <TableCell align="center">Ảnh</TableCell>
                  <TableCell>Mã</TableCell>
                  <TableCell>Thương hiệu</TableCell>
                  <TableCell>Danh mục</TableCell>
                  <TableCell>Đế giày</TableCell>
                  <TableCell>Chất liệu</TableCell>
                  <TableCell>Màu sắc</TableCell>
                  <TableCell width={'5%'}>Size</TableCell>
                  <TableCell align="center">Cân nặng</TableCell>
                  <TableCell align="center">Số lượng</TableCell>
                  <TableCell align="center" width={'10%'}>
                    Đơn giá
                  </TableCell>
                  <TableCell width={'10%'}>Trạng thái</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listProductDetail.map((product) => {
                  return (
                    <>
                      <TableRow
                        style={{
                          backgroundColor: listUpdate.some((item) => item.id === product.id)
                            ? 'lightblue'
                            : 'white',
                        }}
                        key={product.id}>
                        <TableCell align="center">
                          <input
                            type="checkbox"
                            checked={listUpdate.some((item) => item.id === product.id)}
                            onClick={(e) => {
                              e.stopPropagation()
                              const isChecked = e.target.checked
                              setListUpdate((prevList) => {
                                if (isChecked) {
                                  return [...prevList, product]
                                } else {
                                  return prevList.filter((item) => item.id !== product.id)
                                }
                              })
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Carousel
                            indicators={false}
                            sx={{ width: '100%', height: '100%' }}
                            navButtonsAlwaysInvisible>
                            {product.image.split(',').map((item, i) => (
                              <img
                                width={'50px'}
                                height={'50px'}
                                key={'anh' + i}
                                src={item}
                                alt="anh"
                              />
                            ))}
                          </Carousel>
                        </TableCell>
                        <TableCell sx={{ maxWidth: '0px' }}>{product?.code}</TableCell>
                        <TableCell>{product?.brand}</TableCell>
                        <TableCell>{product?.category}</TableCell>
                        <TableCell>{product?.sole}</TableCell>
                        <TableCell>{product?.colorName}</TableCell>
                        <TableCell>{product?.material}</TableCell>
                        <TableCell>{product?.size}</TableCell>
                        {listUpdate.some((item) => item.id === product.id) ? (
                          <>
                            <TableCell>
                              <TextField
                                value={listUpdate.find((item) => item.id === product.id).weight}
                                onChange={(e) => {
                                  const updatedList = listUpdate.map((item) => {
                                    if (item.id === product.id) {
                                      return { ...item, weight: e.target.value }
                                    }
                                    return item
                                  })
                                  validate(updatedList)
                                  setListUpdate(updatedList)
                                }}
                                InputProps={{
                                  style: { paddingRight: '4px' },
                                  endAdornment: 'g',
                                }}
                                inputProps={{ min: 1 }}
                                size="small"
                                sx={{
                                  '& input': {
                                    p: 0,
                                    textAlign: 'center',
                                    fontSize: '14px',
                                  },
                                  '& fieldset': {
                                    fontSize: '14px',
                                  },
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={listUpdate.find((item) => item.id === product.id).amount}
                                onChange={(e) => {
                                  const updatedList = listUpdate.map((item) => {
                                    if (item.id === product.id) {
                                      return { ...item, amount: e.target.value }
                                    }
                                    return item
                                  })
                                  setListUpdate(updatedList)
                                  validate(updatedList)
                                }}
                                inputProps={{ min: 1 }}
                                size="small"
                                sx={{
                                  '& input': {
                                    p: 0,
                                    textAlign: 'center',
                                    fontSize: '14px',
                                  },
                                  '& fieldset': {
                                    fontSize: '14px',
                                  },
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={listUpdate.find((item) => item.id === product.id).price}
                                inputProps={{ min: 1 }}
                                size="small"
                                InputProps={{
                                  style: { paddingRight: '4px' },
                                  endAdornment: '₫',
                                }}
                                onChange={(e) => {
                                  const updatedList = listUpdate.map((item) => {
                                    if (item.id === product.id) {
                                      return { ...item, price: e.target.value }
                                    }
                                    return item
                                  })
                                  setListUpdate(updatedList)
                                  validate(updatedList)
                                }}
                                sx={{
                                  '& input': {
                                    p: 0,
                                    textAlign: 'center',
                                    fontSize: '14px',
                                  },
                                  '& fieldset': {
                                    fontSize: '14px',
                                  },
                                }}
                              />
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell align="center">{product.weight}g</TableCell>
                            <TableCell align="center">{product.amount}</TableCell>
                            <TableCell align="center">{formatCurrency(product.price)}</TableCell>
                          </>
                        )}
                        <TableCell>
                          {product.deletedProduct === 0 ? (
                            <Chip
                              onClick={() => handleDelete(product.id)}
                              className={
                                product.deleted === 0 ? 'chip-hoat-dong' : 'chip-khong-hoat-dong'
                              }
                              label={product.deleted === 0 ? 'Đang bán' : 'Ngừng bán'}
                              size="small"
                            />
                          ) : (
                            <Chip label={'Ngừng bán'} size="small" color="default" />
                          )}
                        </TableCell>
                        <Tooltip title="Chỉnh sửa">
                          <TableCell align="center">
                            <TbEyeEdit
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                if (!listUpdate.some((item) => item.id === product.id)) {
                                  handleClickOpen(product.id, product.image.split(','))
                                }
                              }}
                              fontSize={'25px'}
                              color={
                                listUpdate.some((item) => item.id === product.id)
                                  ? 'gray'
                                  : '#FC7C27'
                              }
                            />
                          </TableCell>
                        </Tooltip>
                      </TableRow>
                      {listErr.find((err) => err.id === product.id) && (
                        <TableRow style={{ backgroundColor: 'white' }}>
                          <TableCell colSpan={7}>
                            <span style={{ color: 'red' }}>
                              {listErr.find((err) => err.id === product.id).message}
                            </span>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )
                })}
              </TableBody>
            </Table>
            <Stack
              mt={2}
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={0}>
              <Typography component="span" variant={'body2'} mt={0.5}>
                <Typography sx={{ display: { xs: 'none', md: 'inline-block' }, marginLeft: '5px' }}>
                  Xem
                </Typography>
                <Select
                  onChange={(e) => {
                    setFilter({ ...filter, size: e.target.value })
                  }}
                  sx={{ height: '25px', mx: 0.5 }}
                  size="small"
                  value={filter.size}>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                </Select>
                <Typography sx={{ display: { xs: 'none', md: 'inline-block' } }}>
                  sản phẩm
                </Typography>
              </Typography>
              <Pagination
                variant="outlined"
                color="cam"
                count={total}
                page={filter.page}
                onChange={(e, value) => {
                  e.preventDefault()
                  if (filter.page !== value) {
                    setFilter({ ...filter, page: value })
                  }
                }}
              />
            </Stack>
          </Fragment>
        ) : (
          <Empty />
        )}
      </Paper>
      {open && (
        <AdModalDetailProductDetail
          productDetail={productDetail}
          open={open}
          setOpen={setOpen}
          fetchData={fetchData}
          filter={filter}
          priceMax={priceMax}
          idProduct={id}
        />
      )}
    </div>
  )
}
