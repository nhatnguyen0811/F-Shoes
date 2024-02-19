import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import './Order.css'
import ClientAccountApi from '../../../api/client/clientAccount'
import { getStatus } from '../../../services/constants/statusHoaDon'
import dayjs from 'dayjs'
import { getStatusStyle } from '../../admin/hoadon/getStatusStyle'
import { getStatusProfile } from '../../../services/constants/statusHoaDonProfile'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'
import { socketUrl } from '../../../services/url'
import useDebounce from '../../../services/hook/useDebounce'
import { toast } from 'react-toastify'

var stompClient = null
export default function Order() {
  const [getBillTable, setGetBillTable] = useState([])
  const [valueTabHD, setValueTabHD] = React.useState('all')
  const listSttHD = [0, 1, 2, 3, 7]
  const [filter, setFilter] = useState({
    status: '',
    code: null,
  })

  const handleChangeTab = (event, newValue) => {
    setValueTabHD(newValue)
    const updatedFilter = { ...filter, status: newValue === 'all' ? '' : newValue }
    setFilter(updatedFilter)
  }

  const fetchAllBillTable = (filter) => {
    ClientAccountApi.getAllBillTable(filter).then((response) => {
      setGetBillTable(response.data.data)
    })
  }

  useEffect(() => {
    fetchAllBillTable(filter)
  }, [filter])

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    })
  }
  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      currencyDisplay: 'code',
    })
    return formatter.format(value)
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
  }, [getBillTable])

  const onConnect = () => {
    stompClient.subscribe('/topic/real-time-huy-don-bill-my-profile', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        updateRealTimeBillMyProdile(data)
      }
    })
    stompClient.subscribe('/topic/real-time-xac-nhan-bill-my-profile', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        updateRealTimeBillMyProdile(data)
      }
    })
    stompClient.subscribe('/topic/real-time-update-status-bill-my-profile', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        updateRealTimeBillMyProdile(data)
      }
    })
  }

  function updateRealTimeBillMyProdile(data) {
    const preBill = [...getBillTable]
    const index = preBill.findIndex((bill) => bill.id === data.id)
    if (index !== -1) {
      preBill[index] = data
      setGetBillTable(preBill)
    }
  }
  const validateSearchInput = (value) => {
    const specialCharsRegex = /[!@#\$%\^&*\(\),.?":{}|<>[\]]/
    return !specialCharsRegex.test(value)
  }

  const [inputValue, setInputValue] = useState('')
  const debouncedValue = useDebounce(inputValue, 1000)

  useEffect(() => {
    setFilter({ ...filter, code: inputValue })
  }, [debouncedValue])
  return (
    <>
      <div className="order">
        <Box
          sx={{
            mt: 2,
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: '#EEE5DE',
            borderRadius: '8px',
          }}>
          <Tabs value={valueTabHD} onChange={handleChangeTab} className="tabSttHD">
            <Tab label={'Tất cả'} key={'tabSttHd all'} value={'all'}></Tab>
            {listSttHD.map((row, i) => (
              <Tab label={getStatusProfile(row)} key={'tabSttHd' + i} value={row}></Tab>
            ))}
          </Tabs>
        </Box>
        <TextField
          sx={{
            width: '100%',
            marginTop: '20px',
            border: 'none',
            backgroundColor: 'white',
            marginBottom: '20px',
            borderRadius: '10px',
          }}
          placeholder="Tìm kiếm theo mã hóa đơn"
          size="small"
          // onChange={(e) => {
          //   setFilter({ ...filter, code: e.target.value })
          // }}
          onChange={(e) => {
            const valueNhap = e.target.value
            if (validateSearchInput(valueNhap)) {
              setInputValue(valueNhap)
            } else {
              setInputValue('')
              toast.warning('Tìm kiếm không được có kí tự đặc biệt')
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="cam" />
              </InputAdornment>
            ),
          }}
        />

        <div style={{ maxHeight: '500px', overflow: 'auto' }}>
          {getBillTable.map((item, index) => (
            <React.Fragment key={index}>
              <Grid container spacing={2} style={{ marginTop: '5px', paddingBottom: '20px' }}>
                <Grid item xs={12}>
                  <Paper elevation={3}>
                    <div
                      style={{
                        height: '250px',
                        backgroundColor: 'white',
                      }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}>
                        <span style={{ paddingTop: '20px', paddingLeft: '20px' }}>{item.code}</span>
                        <div style={{ paddingTop: '20px', paddingRight: '20px' }}>
                          <Chip
                            className={getStatusStyle(item.status)}
                            label={getStatus(item.status)}
                            size="small"
                          />
                        </div>
                      </Stack>

                      <Divider
                        sx={{ height: '1px', backgroundColor: 'black', marginTop: '20px' }}
                      />

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}>
                        <div style={{ paddingTop: '20px', paddingLeft: '20px' }}>
                          <Typography style={{ marginBottom: '20px' }}>
                            Ngày đặt hàng: {dayjs(item.createdAt).format('DD/MM/YYYY')}
                          </Typography>
                          {item.completeDate ? (
                            <Typography>
                              Ngày Nhận hàng: {dayjs(item.completeDate).format('DD/MM/YYYY')}
                            </Typography>
                          ) : (
                            <Typography>
                              Ngày dự kiến nhận:{' '}
                              {dayjs(item.desiredReceiptDate).format('DD/MM/YYYY')}
                            </Typography>
                          )}
                          <Button
                            sx={{ marginTop: '30px' }}
                            component={Link}
                            to={`/profile/get-by-idBill/${item.id}`}
                            variant="outlined"
                            color="cam">
                            Thông tin chi tiết
                          </Button>
                        </div>
                        <div style={{ paddingTop: '20px', paddingRight: '20px' }}>
                          <Typography style={{ marginBottom: '20px' }}>
                            Tiền ship: {formatCurrency(item.moneyShip)}
                          </Typography>
                          <Typography>Tổng tiền: {formatCurrency(item.moneyAfter)}</Typography>
                        </div>
                      </Stack>
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  )
}
