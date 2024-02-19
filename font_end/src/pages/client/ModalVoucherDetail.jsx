import { Box, Grid, IconButton, Modal, Stack, Toolbar, Typography } from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import './ModalVoucher'
import dayjs from 'dayjs'
import { formatCurrency } from '../../services/common/formatCurrency '

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

export default function ModalVoucherDetail({ openModal, setOpenModal, voucher }) {
  return (
    <div>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={styleModalVoucher}>
          <Toolbar>
            <Box
              sx={{
                color: 'black',
                flexGrow: 1,
              }}>
              <Typography variant="h6" component="div">
                Thông tin phiếu giảm giá
              </Typography>
            </Box>
            <IconButton
              className="icon-button-close"
              onClick={() => {
                setOpenModal(false)
              }}
              aria-label="close"
              color="error">
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <Toolbar>
            <Grid className="grid-radio-group-modal-voucher">
              <Grid item xs={4} className="grid-name-voucher"></Grid>
              <Grid item xs={8} className="grid-information-voucher">
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <div>
                    Giá trị:{' '}
                    {voucher.typeValue === 0 ? voucher.value + ' %' : formatCurrency(voucher.value)}
                    <br />
                    Tối đa: {formatCurrency(voucher.maximumValue)}
                    <br />
                    Tối thiểu: {formatCurrency(voucher.minimumAmount)}
                  </div>
                </Stack>
              </Grid>
            </Grid>
          </Toolbar>
          <div style={{ marginTop: '16px' }} className="data-radio-group-modal-voucher-detail">
            <Toolbar>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <span>
                    <b>Hạn sử dụng</b>
                  </span>
                  <br />
                  <span>
                    {dayjs(voucher.startDate).format('DD-MM-YYYY HH:mm') +
                      ' --- ' +
                      dayjs(voucher.endDate).format('DD-MM-YYYY HH:mm')}
                  </span>
                </Grid>
                <Grid item xs={12}>
                  <span>
                    <b>Ưu đãi</b>
                  </span>
                  <br />
                  <span>
                    Lượt sử dụng có hạn. Nhanh tay kẻo lỡ bạn nhé
                    <br />
                    Giảm{' '}
                    {voucher.typeValue === 0
                      ? voucher.value + ' %'
                      : formatCurrency(voucher.value) + ' '}
                    cho Đơn Tối Thiểu {formatCurrency(voucher.minimumAmount)}
                    <br /> Giảm tối đa
                    {' ' + formatCurrency(voucher.maximumValue)}
                  </span>
                </Grid>
                <Grid item xs={12}>
                  <span>
                    <b>Áp dụng cho đơn hàng</b>
                  </span>
                  <br />
                  <span>Áp dụng cho mọi đơn hàng</span>
                </Grid>
                <Grid item xs={12}>
                  <span>
                    <b>Hình thức thanh toán</b>
                  </span>
                  <br />
                  <span>Tất cả hình thức thanh toán</span>
                </Grid>
                <Grid item xs={12}>
                  <span>
                    <b>Đơn vị vận chuyển</b>
                  </span>
                  <br />
                  <span>Tất cả đơn vị vận chuyển</span>
                </Grid>
                <Grid item xs={12}>
                  <span>
                    <b>Chi tiết</b>
                  </span>
                  <br />
                  <span>Mã: {voucher.code}</span>
                  <br />
                  <span>Tên: {voucher.name}</span>
                  <br />
                  <span>Kiểu: {voucher.type === 0 ? 'Công khai' : 'Cá nhân'}</span>
                  <br />
                  <span>Loại: {voucher.typeValue === 0 ? 'Phần trăm' : 'Giá tiền'}</span>
                  <br />
                  <span>Số lượng: {voucher.quantity}</span>
                </Grid>
                <Grid item xs={12}>
                  <span>
                    <b>Lưu ý</b>
                  </span>
                  <br />
                  <span>
                    Đối với những phiếu giảm giá thuộc kiểu <b>công khai</b> phiếu giảm giá sẽ được
                    sử dụng bởi tất cả khách hàng!
                  </span>
                </Grid>
              </Grid>
            </Toolbar>
          </div>
        </Box>
      </Modal>
    </div>
  )
}
