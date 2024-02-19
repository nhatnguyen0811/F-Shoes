import {
  Breadcrumbs,
  Container,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import TimeLine from '../admin/hoadon/TimeLine'
import ClientAccountApi from '../../api/client/clientAccount'
import { formatCurrency } from '../../services/common/formatCurrency '
// import TimeLine from '../../admin/hoadon/TimeLine'

export default function TrackingDetail() {
  const { code } = useParams()
  const [billDetail, setBillDetail] = useState([])
  const [listOrderTimeLine, setListOrderTimeLine] = useState([])
  const [loadingTimeline, setLoadingTimeline] = useState(true)

  const getBillHistoryByIdBill = (code) => {
    setLoadingTimeline(true)
    ClientAccountApi.getBillHistoryByCode(code)
      .then((response) => {
        setListOrderTimeLine(response.data.data)
        setLoadingTimeline(false)
      })
      .catch((error) => {
        console.error('Lỗi khi gửi yêu cầu API get orderTimeline: ', error)
        setLoadingTimeline(false)
      })
  }

  const navigate = useNavigate()
  const getBillByIdBill = (code) => {
    ClientAccountApi.getBillDetailByCode(code).then(
      (response) => {
        if (response.data.success) {
          setBillDetail(response.data.data)
        } else {
          navigate('/not-found')
        }
      },
      () => {},
    )
  }

  useEffect(() => {
    getBillByIdBill(code)
    getBillHistoryByIdBill(code)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])
  const totalMoney = billDetail.reduce((total, item) => total + item.totalMoney, 0)
  const moneyReduce = billDetail.reduce((reduce, item) => reduce + item.moneyReduced, 0)
  const moneyAfter = billDetail.reduce((after, item) => after + item.moneyAfter, 0)
  const moneyShip = billDetail.reduce((ship, item) => ship + item.moneyShip, 0)
  return (
    <div>
      <Container maxWidth="lg">
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
            to="/tracking"
            sx={{
              color: 'black',
              textDecoration: 'none',
              fontWeight: '600 !important',
              fontSize: 'calc(0.9rem + 0.15vw) !important',
            }}>
            Tra cứu
          </Typography>

          <Typography color="text.primary"> {code}</Typography>
        </Breadcrumbs>
        <Paper elevation={3} className="time-line" sx={{ mt: 2, mb: 2, paddingLeft: 1 }}>
          <h3>Lịch sử đơn hàng</h3>
          {loadingTimeline ? <div>Loading...</div> : <TimeLine orderTimeLine={listOrderTimeLine} />}
        </Paper>

        <Paper style={{ marginBottom: '30px' }}>
          <Container maxWidth="xl">
            <Grid container spacing={2}>
              {billDetail.length > 0 && (
                <Grid item xs={4}>
                  <Typography variant="h5">ĐỊA CHỈ NHẬN HÀNG</Typography>
                  <Typography style={{ marginTop: '30px' }}>
                    {billDetail[0].nameCustomer}
                  </Typography>
                  <Typography style={{ marginTop: '10px', fontSize: '14px' }}>
                    {billDetail[0].phoneNumberCustomer}
                  </Typography>
                  <Typography style={{ fontSize: '14px' }}>{billDetail[0].address}</Typography>
                </Grid>
              )}
            </Grid>
          </Container>
        </Paper>

        <Paper style={{ marginBottom: '30px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TableContainer sx={{ maxHeight: 300, marginBottom: 5 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableBody>
                    {billDetail.map((row, index) => (
                      <TableRow key={row.id + index}>
                        <TableCell>
                          <img src={row.url} alt="" width={'100px'} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6" fontFamily={'monospace'} fontWeight={'bolder'}>
                            {row.productName + ' ' + row.material + ' ' + row.sole} "{row.color}"
                          </Typography>
                          <Typography>
                            Phân loại hàng: {row.category} - {row.size}
                          </Typography>
                          <Typography>X{row.quantity}</Typography>
                        </TableCell>
                        <TableCell align="center" style={{ fontWeight: 'bold', color: 'red' }}>
                          {row.price !== null ? formatCurrency(row.price * row.quantity) : 0}
                          <br />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Container maxWidth="lg">
                <Grid container spacing={2}>
                  <Grid item xs={9}>
                    <div style={{ float: 'right' }}>Tổng tiền hàng:</div>
                  </Grid>
                  <Grid item xs={3}>
                    <div style={{ float: 'right' }}>{formatCurrency(totalMoney)}</div>
                  </Grid>
                  <Divider />
                  <Grid item xs={9}>
                    <div style={{ float: 'right' }}>Phí vận chuyển:</div>
                  </Grid>
                  <Grid item xs={3}>
                    <div style={{ float: 'right' }}>{formatCurrency(moneyShip)}</div>
                  </Grid>
                  <Divider />
                  <Grid item xs={9}>
                    <div style={{ float: 'right' }}>Giảm giá:</div>
                  </Grid>
                  <Grid item xs={3}>
                    <div style={{ float: 'right' }}>{formatCurrency(moneyReduce)}</div>
                  </Grid>
                  <Divider />
                  <Grid item xs={9}>
                    <div style={{ float: 'right' }}>Thành tiền:</div>
                  </Grid>
                  <Grid item xs={3}>
                    <div
                      style={{ float: 'right', fontSize: '20px', color: 'red', fontWeight: 700 }}>
                      {formatCurrency(moneyAfter)}
                    </div>
                  </Grid>
                  <Divider />
                </Grid>
              </Container>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  )
}
