import { useEffect, useState } from 'react'
import clientCheckoutApi from '../../api/client/clientCheckoutApi'
import { Link, useNavigate } from 'react-router-dom'
import { Container } from '@mui/system'
import { Button, Paper, Stack, Typography } from '@mui/material'
import { makeStyles } from '@material-ui/core/styles'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { removeCart } from '../../services/slices/cartSlice'
import { setLoading } from '../../services/slices/loadingSlice'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
    marginTop: '50px',
  },
  successIcon: {
    color: theme.palette.success.main, // Assuming you have a success color in your theme
    fontSize: '5rem',
    marginBottom: '20px',
  },
  orderDetails: {
    marginBottom: '20px',
  },
  continueShoppingButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '1.2rem',
    backgroundColor: 'orange',
  },
}))

export default function Payment() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  useEffect(() => {
    checkPayment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function checkPayment() {
    setLoading(true)
    try {
      const requestData = {}
      for (const [key, value] of new URLSearchParams(window.location.search)) {
        requestData[key] = value
      }
      const response = await clientCheckoutApi.payment(requestData)
      if (response.status === 200) {
        if (response.data.success) {
          if (response.data.data.length > 0) {
            response.data.data.forEach((e) => {
              dispatch(removeCart(e))
            })
            toast.success('Đặt hàng thành công')
          }
          setData(response.data.data)
        }
      }
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  const classes = useStyles()

  return (
    !loading && (
      <>
        {data ? (
          data.length > 0 ? (
            <Container maxWidth="sm" className={classes.container}>
              <Paper
                elevation={3}
                sx={{
                  height: '600px',
                }}>
                <div style={{ backgroundColor: '#E7E8EA' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}>
                    <div
                      style={{
                        position: 'absolute',
                        width: '110px',
                        height: '110px',
                        overflow: 'hidden',
                        borderRadius: '50%',
                        backgroundColor: '#EFEFEF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '-30px',
                      }}>
                      {' '}
                      <img
                        src={require('../../assets/image/TinTuc/Icon-VNPAY-QR.webp')}
                        alt=""
                        width="90%"
                        height="90%"
                      />
                    </div>
                  </div>
                  <Typography
                    sx={{
                      marginTop: '50px',

                      fontWeight: 1000,
                      paddingTop: '40px',
                      fontSize: '20px',
                    }}>
                    VN PAY
                  </Typography>

                  <Stack
                    direction="row"
                    justifyContent="space-around"
                    alignItems="start"
                    spacing={2}>
                    <Typography sx={{ fontWeight: 700 }}>Giá trị đơn hàng</Typography>
                    <Typography sx={{ fontWeight: 700, color: 'red' }}>20.000.000 VNĐ</Typography>
                  </Stack>
                </div>
                <div style={{ backgroundColor: '#F5F5F7' }}>
                  <img
                    src={require('../../assets/image/TinTuc/icon_sucess_2-removebg-preview.png')}
                    alt=""
                    width={120}
                    style={{ marginTop: '50px', marginBottom: '10px' }}
                  />
                  <Typography variant="h5" gutterBottom>
                    Đặt hàng thành công!
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Mã đơn hàng:{' '}
                    <Link
                      to={`/tracking/${new URLSearchParams(window.location.search).get(
                        'vnp_TxnRef',
                      )}`}>
                      {new URLSearchParams(window.location.search).get('vnp_TxnRef')}
                    </Link>
                  </Typography>
                  <Typography variant="body1" paragraph p={3}>
                    Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi. Đơn hàng của bạn đang được xử
                    lý.
                  </Typography>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/products"
                    sx={{ backgroundColor: 'orange', fontSize: '15px', mb: 3.5, mt: 1.5 }}>
                    Tiếp tục mua sắm
                  </Button>
                </div>
              </Paper>
            </Container>
          ) : (
            <Container maxWidth="sm" className={classes.container}>
              <Paper
                elevation={3}
                sx={{
                  height: '600px',
                }}>
                <div style={{ backgroundColor: '#E7E8EA' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}>
                    <div
                      style={{
                        position: 'absolute',
                        width: '110px',
                        height: '110px',
                        overflow: 'hidden',
                        borderRadius: '50%',
                        backgroundColor: '#EFEFEF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '-30px',
                      }}>
                      {' '}
                      <img
                        src={require('../../assets/image/TinTuc/Icon-VNPAY-QR.webp')}
                        alt=""
                        width="90%"
                        height="90%"
                      />
                    </div>
                  </div>
                  <Typography
                    sx={{
                      marginTop: '50px',

                      fontWeight: 1000,
                      paddingTop: '40px',
                      fontSize: '20px',
                    }}>
                    VN PAY
                  </Typography>

                  <Stack
                    direction="row"
                    justifyContent="space-around"
                    alignItems="start"
                    spacing={2}>
                    <Typography sx={{ fontWeight: 700 }}>Giá trị đơn hàng</Typography>
                    <Typography sx={{ fontWeight: 700, color: 'red' }}>20.000.000 VNĐ</Typography>
                  </Stack>
                </div>
                <div style={{ backgroundColor: '#F5F5F7' }}>
                  <img
                    src={require('../../assets/image/TinTuc/icon_sucess_2-removebg-preview.png')}
                    alt=""
                    width={120}
                    style={{ marginTop: '50px', marginBottom: '10px' }}
                  />
                  <Typography variant="h5" gutterBottom>
                    Đơn hàng đã được thanh toán!
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Mã đơn hàng:{' '}
                    <Link
                      to={`/tracking/${new URLSearchParams(window.location.search).get(
                        'vnp_TxnRef',
                      )}`}>
                      {new URLSearchParams(window.location.search).get('vnp_TxnRef')}
                    </Link>
                  </Typography>
                  <Typography variant="body1" paragraph p={3}>
                    Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi. Đơn hàng của bạn đang được xử
                    lý.
                  </Typography>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/products"
                    sx={{ backgroundColor: 'orange', fontSize: '15px', mb: 3.5, mt: 1.5 }}>
                    Tiếp tục mua sắm
                  </Button>
                </div>
              </Paper>
            </Container>
          )
        ) : (
          <Container maxWidth="sm" className={classes.container}>
            <Paper
              elevation={3}
              sx={{
                height: '550px',
              }}>
              <div style={{ backgroundColor: '#E7E8EA' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}>
                  <div
                    style={{
                      position: 'absolute',
                      width: '110px',
                      height: '110px',
                      overflow: 'hidden',
                      borderRadius: '50%',
                      backgroundColor: '#EFEFEF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '-30px',
                    }}>
                    {' '}
                    <img
                      src={require('../../assets/image/TinTuc/Icon-VNPAY-QR.webp')}
                      alt=""
                      width="90%"
                      height="90%"
                    />
                  </div>
                </div>
                <Typography
                  sx={{
                    marginTop: '50px',

                    fontWeight: 1000,
                    paddingTop: '40px',
                    fontSize: '20px',
                  }}>
                  VN PAY
                </Typography>

                <Stack direction="row" justifyContent="space-around" alignItems="start" spacing={2}>
                  <Typography sx={{ fontWeight: 700 }}>Giá trị đơn hàng</Typography>
                  <Typography sx={{ fontWeight: 700, color: 'red' }}>20.000.000 VNĐ</Typography>
                </Stack>
              </div>
              <div style={{ backgroundColor: '#F5F5F7' }}>
                <img
                  src={require('../../assets/image/TinTuc/error_icon.png')}
                  alt=""
                  width={120}
                  style={{ marginTop: '50px', marginBottom: '10px' }}
                />
                <Typography variant="h5" gutterBottom>
                  Đặt hàng thất bại!
                </Typography>
                <Typography variant="body1" paragraph p={2} sx={{ fontWeight: 700 }}>
                  Thanh toán không thành công
                </Typography>
                <Typography>Vui lòng thử lại</Typography>
                <Button
                  variant="contained"
                  component={Link}
                  to="/products"
                  sx={{ backgroundColor: 'orange', fontSize: '15px', mb: 4, mt: 3 }}>
                  Tiếp tục mua sắm
                </Button>
              </div>
            </Paper>
          </Container>
        )}
      </>
    )
  )
}
