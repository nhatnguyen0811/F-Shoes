import { Box, Button, Checkbox, TableHead, TableRow } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TextField,
} from '@mui/material'
import './returnModal.css'
import { RemoveCircle } from '@mui/icons-material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { FaMoneyBillWave } from 'react-icons/fa'
import Carousel from 'react-material-ui-carousel'
import { toast } from 'react-toastify'
import confirmSatus from '../../../components/comfirmSwal'
import clientReturnApi from '../../../api/client/clientReturnApi'
import { GrSelect } from 'react-icons/gr'

export default function ModalReturn({ id, setTab, setOpen }) {
  const navigate = useNavigate()
  const [bill, setBill] = useState({})
  const [billDetail, setBillDetail] = useState([])
  const [phi, setPhi] = useState(0)
  const [traKhach, setTraKhach] = useState(0)
  const [typePay, setTypePay] = useState(0)
  const [codePay, setCodePay] = useState(null)

  useEffect(() => {
    clientReturnApi.getBillId(id).then(
      (res) => {
        if (res.data.success) {
          setBill(res.data.data)
        } else {
          navigate(-1)
        }
      },
      () => {},
    )
    clientReturnApi.getBillDetail(id).then(
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
        }, 0) *
          (1 - phi / 100),
      )
    }
  }

  function guiYeuCau() {
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
        }, 0) *
        (1 - phi / 100),
      moneyPayment: traKhach,
      type: typePay,
      codePayment: codePay,
      fee: phi,
      listDetail: detail,
    }
    const title = 'Xác nhận gửi yêu cầu hoàn trả sản phẩm?'
    confirmSatus(title, '').then((result) => {
      if (result.isConfirmed) {
        clientReturnApi.request(returnBill).then(
          (res) => {
            if (res.data.success) {
              toast.success('Gửi yêu cầu trả hàng thành công!')
              setOpen(false)
              setTab('traHang')
            } else {
              toast.error('Gửi yêu cầu trả hàng thất bại!')
            }
          },
          () => {},
        )
      }
    })
  }

  return (
    <Box sx={{ m: 2 }}>
      <div className="tra-hang">
        <Grid container spacing={2} mt={2}>
          <Grid
            sx={{
              '::-webkit-scrollbar': {
                width: '0px',
              },
            }}
            item
            xs={12}
            style={{ overflow: 'auto', height: '500px', paddingTop: 0 }}>
            <Paper className="paper-return" sx={{ mb: 2, p: 1 }}>
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
                      width={'30%'}
                      style={{ fontWeight: 'bold' }}>
                      Sản phẩm
                    </TableCell>
                    <TableCell
                      sx={{ padding: 0 }}
                      width={'15%'}
                      style={{ fontWeight: 'bold' }}
                      align="center">
                      Số lượng
                    </TableCell>
                    <TableCell
                      sx={{ padding: 0 }}
                      width={'15%'}
                      style={{ fontWeight: 'bold' }}
                      align="center">
                      Đơn giá
                    </TableCell>
                    <TableCell
                      sx={{ padding: 0 }}
                      width={'10%'}
                      style={{ fontWeight: 'bold' }}
                      align="center">
                      Tổng
                    </TableCell>
                    <TableCell
                      sx={{ padding: 0 }}
                      width={'25%'}
                      style={{ fontWeight: 'bold' }}
                      align="center">
                      Ghi chú
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
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
                    <TableCell width={'30%'}>
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
                    <TableCell width={'15%'} align="center">
                      <IconButton
                        size="small"
                        onClick={() => {
                          changeSL(product.quantityReturn - 1, product)
                        }}>
                        <RemoveCircle sx={{ color: '#BDC3C7' }} />
                      </IconButton>
                      <TextField
                        className="input-soluong-return"
                        sx={{ width: '70px' }}
                        size="small"
                        onChange={(e) => {
                          changeSL(e.target.value, product)
                        }}
                        value={product.quantityReturn}
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment sx={{ paddingRight: '10px' }} position="end">
                              / {product.quantity}{' '}
                            </InputAdornment>
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
                    <TableCell width={'15%'} align="center">
                      <TextField
                        fullWidth
                        className="input-soluong-return"
                        size="small"
                        disabled
                        value={product.price.toLocaleString('it-IT', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell width={'10%'} align="center">
                      <b style={{ color: 'red' }}>
                        {(product.price * product.quantityReturn).toLocaleString('it-IT', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </b>
                    </TableCell>
                    <TableCell width={'25%'} align="center">
                      <TextField
                        fullWidth
                        value={product?.note}
                        onChange={(e) => {
                          changeNote(e.target.value, product)
                        }}
                        disabled={product.quantityReturn <= 0}
                        color="cam"
                        placeholder="Ghi chú"
                        multiline
                        rows={2}
                      />
                    </TableCell>
                  </TableBody>
                ))}
              </Table>
            </Paper>
          </Grid>
          <Grid item xs={12} style={{ paddingTop: 0 }}>
            <Paper
              sx={{
                backgroundColor: '#EBEBEB',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: '10px',
              }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <FaMoneyBillWave style={{ marginRight: '5px' }} />
                <b style={{ marginRight: '10px' }}>Tổng tiền hoàn trả</b>
                <Chip
                  style={{ color: 'white', fontWeight: 'bold', backgroundColor: 'red' }}
                  label={billDetail
                    .reduce((total, e) => {
                      return total + e.quantityReturn * e.price
                    }, 0)
                    .toLocaleString('it-IT', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  size="small"
                />
              </div>
              <Button onClick={guiYeuCau} color="success" variant="contained" size="small">
                Xác nhận trả hàng
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Box>
  )
}
