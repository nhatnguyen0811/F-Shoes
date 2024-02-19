import React, { useEffect, useState } from 'react'
import BreadcrumbsCustom from '../../../components/BreadcrumbsCustom'
import { useNavigate, useParams } from 'react-router-dom'
import returnApi from '../../../api/admin/return/returnApi'
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { MdAssignmentReturned } from 'react-icons/md'
import './index.css'
import { RemoveCircle } from '@mui/icons-material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import PersonIcon from '@mui/icons-material/Person'
import BusinessIcon from '@mui/icons-material/Business'
import Carousel from 'react-material-ui-carousel'
import { toast } from 'react-toastify'
import confirmSatus from '../../../components/comfirmSwal'
import { GrSelect } from 'react-icons/gr'

const listBreadcrumbs = [{ name: 'Trả hàng', link: '/admin/return-order' }]
export default function ReturnOrderBill() {
  const param = useParams()
  const navigate = useNavigate()
  const [bill, setBill] = useState({})
  const [billDetail, setBillDetail] = useState([])
  const [traKhach, setTraKhach] = useState(0)

  useEffect(() => {
    returnApi.getBillId(param.id).then(
      (res) => {
        if (res.data.success) {
          setBill(res.data.data)
        } else {
          toast.warning('Hóa đơn không tồn tại, hoặc không đủ điều kiện!')
          navigate(-1)
        }
      },
      () => {},
    )
    returnApi.getBillDetail(param.id).then(
      (res) => {
        if (res.data.success) {
          setBillDetail([...res.data.data.map((e) => ({ ...e, quantityReturn: 0 }))])
        } else {
          navigate(-1)
        }
      },
      () => {},
    )
  }, [])

  function changeNote(value, product) {
    const preBillDetail = [...billDetail]
    const index = preBillDetail.findIndex((item) => item.id === product.id)
    if (index !== -1) {
      preBillDetail[index] = {
        ...product,
        note: value,
      }
      setBillDetail(preBillDetail)
    }
  }
  function changeSL(value, product) {
    const preBillDetail = [...billDetail]
    const index = preBillDetail.findIndex((item) => item.id === product.id)

    let quantityReturn = parseInt(value)
    if (isNaN(quantityReturn) || quantityReturn < 0) {
      quantityReturn = 0
    }

    quantityReturn = Math.min(quantityReturn, product.quantity)

    if (index !== -1) {
      preBillDetail[index] = {
        ...product,
        quantityReturn,
      }
      setBillDetail(preBillDetail)
      setTraKhach(
        preBillDetail.reduce((total, e) => {
          return total + e.quantityReturn * e.price
        }, 0),
      )
    }
  }

  function traHang() {
    const detail = billDetail
      .filter((bd) => bd.quantityReturn > 0)
      .map((bd) => ({
        name: bd.name,
        quantity: bd.quantityReturn,
        price: bd.price,
        idBillDetail: bd.id,
        note: bd.note,
      }))

    const returnBill = {
      idBill: bill.id,
      returnMoney:
        billDetail.reduce((total, e) => {
          return total + e.quantityReturn * e.price
        }, 0) <=
        bill.moneyAfter - bill.moneyShip
          ? billDetail.reduce((total, e) => {
              return total + e.quantityReturn * e.price
            }, 0)
          : bill.moneyAfter - bill.moneyShip,
      moneyPayment: traKhach,
      listDetail: detail,
    }
    if (returnBill.listDetail && returnBill.listDetail.length <= 0) {
      toast.warning('Vui lòng chọn sản phẩm cần trả!')
    } else {
      const title = 'Xác nhận hoàn trả sản phẩm?'
      confirmSatus(title, '').then((result) => {
        if (result.isConfirmed) {
          returnApi.accept(returnBill).then(
            (res) => {
              if (res.data.success) {
                toast.success('Trả hàng thành công!')
                navigate('/admin/return-order')
              } else {
                navigate(-1)
              }
            },
            () => {},
          )
        }
      })
    }
  }

  return (
    <div className="tra-hang">
      <BreadcrumbsCustom nameHere={bill?.code} listLink={listBreadcrumbs} />
      <Grid container spacing={2} mt={2}>
        <Grid xs={12} style={{ paddingTop: 0 }}>
          <Paper className="paper-return" sx={{ mb: 2, p: 1, marginLeft: '14px' }}>
            <h4 style={{ margin: '0' }}>
              <GrSelect fontSize={20} style={{ marginBottom: '-6px' }} />
              &nbsp; Chọn sản phẩm cần trả
            </h4>
            <hr style={{ marginBottom: '0px' }} />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ padding: 0 }} width={'5%'}>
                    <Checkbox
                      onChange={(e) => {
                        setBillDetail((prevBillDetail) => {
                          const newBillDetail = [...prevBillDetail]

                          if (e.target.checked) {
                            newBillDetail.forEach((item) => {
                              item.quantityReturn = item.quantity
                            })
                          } else {
                            newBillDetail.forEach((item) => {
                              item.quantityReturn = 0
                            })
                          }

                          return newBillDetail
                        })
                      }}
                      checked={billDetail.reduce((check, e) => {
                        if (e.quantity !== e.quantityReturn) {
                          check = false
                        }
                        return check
                      }, true)}
                    />
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ padding: 0 }}
                    width={'55%'}
                    style={{ fontWeight: 'bold' }}>
                    Sản phẩm
                  </TableCell>
                  <TableCell
                    sx={{ padding: 0 }}
                    width={'20%'}
                    style={{ fontWeight: 'bold' }}
                    align="center">
                    Số lượng
                  </TableCell>
                  <TableCell
                    sx={{ padding: 0 }}
                    width={'20%'}
                    style={{ fontWeight: 'bold' }}
                    align="center">
                    Đơn giá
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
            <Box
              sx={{
                '::-webkit-scrollbar': {
                  width: '0px',
                },
              }}
              style={{ overflow: 'auto', height: '24vh' }}>
              <Table>
                {billDetail.map((product) => (
                  <TableBody>
                    <TableCell sx={{ padding: 0 }} width={'5%'}>
                      <Checkbox
                        checked={product.quantity === product.quantityReturn}
                        onChange={(e) => {
                          if (e.target.checked) {
                            changeSL(product.quantity, product)
                          } else {
                            changeSL(0, product)
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ padding: '5px' }} width={'55%'}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          float: 'left',
                        }}>
                        <Carousel
                          indicators={false}
                          sx={{ minWidth: '60px', height: '60px' }}
                          navButtonsAlwaysInvisible>
                          {product.image.split(',').map((item, i) => (
                            <img
                              alt="anh-san-pham"
                              width={'60px'}
                              height={'60px'}
                              key={'anh' + i}
                              src={item}
                            />
                          ))}
                        </Carousel>
                        <div style={{ display: 'inline-block', paddingLeft: '10px' }}>
                          {product.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ padding: '5px' }} width={'20%'} align="center">
                      <IconButton
                        size="small"
                        onClick={() => {
                          changeSL(product.quantityReturn - 1, product)
                        }}>
                        <RemoveCircle sx={{ color: '#BDC3C7' }} />
                      </IconButton>
                      <TextField
                        className="input-soluong-return"
                        sx={{ width: '60px' }}
                        size="small"
                        onChange={(e) => {
                          changeSL(e.target.value, product)
                        }}
                        value={product.quantityReturn}
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">/ {product.quantity}</InputAdornment>
                          ),
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          changeSL(product.quantityReturn + 1, product)
                        }}>
                        <AddCircleIcon sx={{ color: '#BDC3C7' }} />
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ padding: '5px' }} width={'20%'} align="center">
                      <TextField
                        className="input-soluong-return"
                        sx={{ width: '90px' }}
                        size="small"
                        disabled
                        value={product.price.toLocaleString('en-US')}
                        variant="standard"
                      />
                    </TableCell>
                  </TableBody>
                ))}
              </Table>
            </Box>
          </Paper>
          <Grid container spacing={2} mt={2}>
            <Grid xs={8} style={{ paddingTop: 0 }}>
              <Paper
                className="paper-return"
                sx={{ mb: 2, p: 1, marginLeft: '30px', height: '50vh' }}>
                <h4 style={{ margin: '0' }}>
                  <MdAssignmentReturned fontSize={20} style={{ marginBottom: '-6px' }} />
                  &nbsp; Danh sách sản phẩm trả
                </h4>
                <hr style={{ marginBottom: '0px' }} />
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{ padding: '10px' }}
                        align="center"
                        style={{ fontWeight: 'bold' }}
                        width={'25%'}>
                        Sản phẩm
                      </TableCell>
                      <TableCell
                        sx={{ padding: '10px' }}
                        align="center"
                        style={{ fontWeight: 'bold' }}
                        width={'15%'}>
                        Số lượng
                      </TableCell>
                      <TableCell
                        sx={{ padding: 0 }}
                        align="center"
                        style={{ fontWeight: 'bold' }}
                        width={'15%'}>
                        Đơn giá
                      </TableCell>
                      <TableCell
                        sx={{ padding: '10px' }}
                        align="center"
                        style={{ fontWeight: 'bold' }}
                        width={'15%'}>
                        Tổng
                      </TableCell>
                      <TableCell
                        sx={{ padding: '10px' }}
                        align="center"
                        style={{ fontWeight: 'bold' }}
                        width={'20%'}>
                        Ghi chú
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
                <Box
                  sx={{
                    '::-webkit-scrollbar': {
                      width: '0px',
                    },
                  }}
                  style={{ overflow: 'auto', minHeight: '30vh' }}>
                  <Table>
                    {billDetail.filter((e) => e.quantityReturn > 0).length > 0 ? (
                      billDetail
                        .filter((e) => e.quantityReturn > 0)
                        .map((product) => (
                          <TableBody>
                            <TableCell sx={{ padding: '5px' }} align="center" width={'25%'}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Carousel
                                  indicators={false}
                                  sx={{ minWidth: '60px', height: '60px' }}
                                  navButtonsAlwaysInvisible>
                                  {product.image.split(',').map((item, i) => (
                                    <img
                                      alt="anh-san-pham"
                                      width={'60px'}
                                      height={'60px'}
                                      key={'anh' + i}
                                      src={item}
                                    />
                                  ))}
                                </Carousel>
                                <div style={{ display: 'inline-block', paddingLeft: '10px' }}>
                                  {product.name}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell sx={{ padding: '5px' }} align="center" width={'15%'}>
                              <Chip label={product.quantityReturn} sx={{ fontWeight: 'bold' }} />
                            </TableCell>
                            <TableCell sx={{ padding: '5px' }} align="center" width={'15%'}>
                              <TextField
                                className="input-soluong-return"
                                sx={{ width: '90px' }}
                                size="small"
                                disabled
                                value={product.price.toLocaleString('en-US')}
                                variant="standard"
                              />
                            </TableCell>
                            <TableCell sx={{ padding: '5px' }} width={'15%'} align="center">
                              <b style={{ color: 'red' }}>
                                {(product.price * product.quantityReturn).toLocaleString('en-US')}
                              </b>
                            </TableCell>
                            <TableCell sx={{ padding: '5px' }} width={'20%'} align="center">
                              <TextField
                                value={product?.note}
                                onChange={(e) => {
                                  changeNote(e.target.value, product)
                                }}
                                disabled={product.quantityReturn <= 0}
                                color="cam"
                                placeholder="Ghi chú"
                                multiline
                                rows={2}
                                sx={{ marginRight: '10px' }}
                              />
                            </TableCell>
                          </TableBody>
                        ))
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          textAlign: 'center',
                          justifyContent: 'center',
                        }}>
                        <img
                          width={'400px'}
                          src={require('../../../assets/image/no-data.png')}
                          alt="No-data"
                        />
                      </div>
                    )}
                  </Table>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={4} style={{ paddingTop: 0 }}>
              <Paper
                sx={{
                  p: 2,
                  height: '50vh',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                <Typography variant="h6" textAlign={'center'} color={'#229954'} fontWeight={'600'}>
                  Thông tin hoàn trả
                </Typography>
                <div
                  style={{
                    alignItems: 'center',
                    backgroundColor: '#EBEBEB',
                    padding: '10px',
                    borderRadius: '10px',
                  }}>
                  <div>
                    <PersonIcon style={{ marginRight: '5px', marginBottom: '-5px' }} />
                    <span>
                      <b>Khách hàng: </b>
                      {bill?.customer?.fullName ? bill?.customer?.fullName : 'Khách lẻ'}
                    </span>
                  </div>
                  <div style={{ marginTop: '5px' }}>
                    <PersonIcon style={{ marginRight: '5px', marginBottom: '-5px' }} />
                    <span>
                      <b>Người nhận: </b>
                      {bill?.fullName ? bill?.fullName : 'Khách lẻ'}
                    </span>
                  </div>
                  <div style={{ marginTop: '5px' }}>
                    <BusinessIcon style={{ marginRight: '5px', marginBottom: '-5px' }} />
                    <span>
                      <b>Địa chỉ: </b>
                      {bill?.address ? bill?.address : 'Tại cửa hàng'}
                    </span>
                  </div>
                </div>
                <Grid container>
                  <Grid xs={6}>Tổng tiền </Grid>
                  <Grid xs={6} sx={{ textAlign: 'right' }}>
                    <b style={{ color: 'red' }}>
                      {billDetail
                        .reduce((total, e) => {
                          return total + e.quantityReturn * e.price
                        }, 0)
                        .toLocaleString('it-IT', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                    </b>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid xs={6}>Giảm giá </Grid>
                  <Grid xs={6} sx={{ textAlign: 'right' }}>
                    <b style={{ color: 'red' }}>
                      {bill.moneyReduced
                        ? bill.moneyReduced.toLocaleString('it-IT', {
                            style: 'currency',
                            currency: 'VND',
                          })
                        : '0 VND'}
                    </b>
                  </Grid>
                </Grid>
                {bill?.percentMoney && bill?.percentMoney !== 0 && (
                  <Grid container>
                    <Grid xs={6}>Giảm giá cửa hàng</Grid>
                    <Grid xs={6} sx={{ textAlign: 'right' }}>
                      <b style={{ color: 'red' }}>{bill.percentMoney + '%'}</b>
                    </Grid>
                  </Grid>
                )}
                <Grid container>
                  <Grid xs={6}>Số tiền hoàn trả </Grid>
                  <Grid xs={6} sx={{ textAlign: 'right' }}>
                    <b style={{ color: 'red' }}>
                      {(billDetail.reduce((total, e) => {
                        return total + e.quantityReturn * e.price
                      }, 0) <=
                      bill.moneyAfter - bill.moneyShip
                        ? billDetail.reduce((total, e) => {
                            return total + e.quantityReturn * e.price
                          }, 0)
                        : bill.moneyAfter - bill.moneyShip
                      ).toLocaleString('it-IT', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </b>
                  </Grid>
                </Grid>
                <Button onClick={traHang} color="cam" variant="contained" fullWidth>
                  TRẢ HÀNG
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}
