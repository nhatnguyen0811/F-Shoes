import {
  Box,
  Button,
  Grid,
  IconButton,
  ListItem,
  Modal,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import React, { useEffect, useState } from 'react'
import ClientVoucherApi from '../../api/client/ClientVoucherApi'
import { toast } from 'react-toastify'
import Empty from '../../components/Empty'
import './ModalVoucher.css'
import clientCartApi from '../../api/client/clientCartApi'

const styleModalVoucher = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '45vw', md: '35vw' },
  height: '650px',
  bgcolor: 'white',
  borderRadius: 1.5,
  boxShadow: 24,
}

export default function ModalVoucher({
  open,
  setOpen,
  setVoucher,
  arrData,
  setGiamGia,
  voucherFilter,
}) {
  const [listVoucher, setListVoucher] = useState([])
  const [dataVoucher, setDataVoucher] = useState(null)
  const [codeVoucher, setCodeVoucher] = useState('')
  const [promotionByProductDetail, setGromotionByProductDetail] = useState([])

  const fetchVoucher = (request) => {
    ClientVoucherApi.fetchVoucher(request)
      .then((response) => {
        setListVoucher(response.data.data)
      })
      .catch(() => {
        toast.error('Vui lòng tải lại trang: ', {
          position: toast.POSITION.TOP_CENTER,
        })
      })
  }

  const voucherByCode = (code) => {
    ClientVoucherApi.voucherByCode(code)
      .then((response) => {
        setDataVoucher(response.data.data)
      })
      .catch(() => {})
  }

  const productIds = arrData.map((cart) => cart.id)

  const getPromotionProductDetails = (id) => {
    clientCartApi.getPromotionByProductDetail(id).then((response) => {
      setGromotionByProductDetail(response.data.data)
    })
  }

  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    const discountAmount = (discountPercentage / 100) * originalPrice
    const discountedPrice = originalPrice - discountAmount
    return discountedPrice
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

  const handleGiamGia = () => {
    if (codeVoucher === '') {
      toast.error('Vui lòng chọn phiếu giảm giá: ', {
        position: toast.POSITION.TOP_CENTER,
      })
    } else {
      const totalMoney = arrData.reduce((total, cart) => {
        const productTotal = calculateProductTotalPayment(cart, promotionByProductDetail) || 0
        return total + productTotal
      }, 0)
      const totalVoucher = dataVoucher
        ? dataVoucher.typeValue === 0
          ? (totalMoney * dataVoucher.value) / 100
          : dataVoucher.value
        : 0
      dataVoucher != null ? setVoucher(dataVoucher) : setVoucher(null)
      const totalMoneyVoucher = totalVoucher > totalMoney ? totalMoney : totalVoucher
      setGiamGia(totalMoneyVoucher)
      setCodeVoucher('')
      setOpen(false)
    }
  }

  useEffect(() => {
    fetchVoucher(voucherFilter)
    if (codeVoucher.trim() !== '') {
      voucherByCode(codeVoucher)
    }
  }, [voucherFilter, codeVoucher])

  useEffect(() => {
    if (productIds.length === 0) {
      return
    }
    getPromotionProductDetails(productIds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="client-modal-voucher">
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className="box-modal-voucher" sx={styleModalVoucher}>
          <Toolbar>
            <Box
              sx={{
                color: 'black',
                flexGrow: 1,
              }}>
              <Typography variant="h6" component="div">
                Chọn mã khuyến mãi
              </Typography>
            </Box>
            <IconButton
              className="icon-button-close"
              onClick={() => {
                setOpen(false)
              }}
              aria-label="close"
              color="error">
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <Grid className="grid-apply-modal-voucher">
            <TextField
              className="text-field-apply-modal-voucher"
              placeholder="phiếu giảm giá"
              size="small"
              value={codeVoucher}
              onChange={(e) => setCodeVoucher(e.target.value)}
            />
            <Button
              className="button-apply-modal-voucher"
              variant="outlined"
              onClick={() => handleGiamGia()}>
              <b>Áp dụng</b>
            </Button>
          </Grid>
          <div className="data-radio-group-modal-voucher">
            <RadioGroup className="radio-group-modal-voucher" name="voucher">
              {listVoucher &&
                listVoucher.map((v) => (
                  <ListItem key={v.id} variant="outlined" sx={{ boxShadow: 'sm' }}>
                    <Grid className="grid-radio-group-modal-voucher">
                      <Grid item xs={4} className="grid-name-voucher"></Grid>
                      <Grid item xs={8} className="grid-information-voucher">
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <div>
                            Giá trị: {v.typeValue === 0 ? v.value + ' %' : v.value + ' VNĐ'}
                            <br />
                            Giá trị tối đa: {v.maximumValue} VNĐ
                            <br />
                            Kiểu: {v.type === 0 ? 'Công khai' : 'Cá nhân'}
                          </div>
                          <Radio
                            name="radioVoucher"
                            value={v.id}
                            onClick={() => setCodeVoucher(v.code)}
                            checked={codeVoucher ? codeVoucher === v.code : false}
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </ListItem>
                ))}
            </RadioGroup>
            {!listVoucher && <Empty />}
          </div>
        </Box>
      </Modal>
    </div>
  )
}
