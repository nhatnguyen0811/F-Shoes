import React, { useState } from 'react'
import { Box, Button, InputAdornment, Modal, Paper, Stack, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { MdOutlineDocumentScanner } from 'react-icons/md'
import returnApi from '../../../api/admin/return/returnApi'
import { useNavigate } from 'react-router-dom'
import BreadcrumbsCustom from '../../../components/BreadcrumbsCustom'
import { IoIosCreate } from 'react-icons/io'
import { toast } from 'react-toastify'
import Scanner from '../../../layout/Scanner'

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const listBreadcrumbs = [{ name: 'Trả hàng', link: '/admin/return-order' }]
export default function ReturnOrder() {
  const [code, setCode] = useState(null)
  const navigate = useNavigate()
  const [qrScannerVisible, setQrScannerVisible] = useState(false)

  function createReturn(code) {
    if (code && code.trim().length > 0) {
      returnApi
        .getBill({ codeBill: code.trim() })
        .then((result) => {
          if (result.data.success) {
            navigate('/admin/return-order/bill/' + result.data.data)
            setQrScannerVisible(false)
          } else {
            toast.warning('Hóa đơn không tồn tại, hoặc không đủ điều kiện!')
          }
        })
        .catch(() => {
          toast.warning('Mã hóa đơn không hợp lệ!')
        })
    } else {
      toast.warning('Mã hóa đơn không được để trống!')
    }
  }

  return (
    <div className="tra-hang">
      <BreadcrumbsCustom listLink={listBreadcrumbs} />
      <Paper sx={{ p: 2, height: '550px' }}>
        <h4 style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={require('../../../assets/image/TinTuc/iconReturns.jpg')}
            alt=""
            height={40}
            width={40}
          />
          Trả hàng
        </h4>
        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mt: 4 }}>
          <h4 style={{ marginRight: '20px' }}>
            <IoIosCreate fontSize={20} style={{ marginBottom: '-4px' }} /> Mã hóa đơn:
          </h4>

          <TextField
            onChange={(e) => {
              setCode(e.target.value)
            }}
            style={{ width: '400px' }}
            className="search-field"
            size="small"
            color="cam"
            placeholder="Nhập mã hóa đơn cần trả hàng..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="cam" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            onClick={() => {
              createReturn(code)
            }}
            color="cam"
            variant="contained"
            className="them-moi"
            sx={{ ml: 2, mr: 2 }}>
            <SearchIcon style={{ marginRight: '5px', fontSize: '20px' }} />
            Tìm kiếm
          </Button>

          <Button
            onClick={() => {
              setQrScannerVisible(true)
            }}
            color="cam"
            variant="outlined">
            <MdOutlineDocumentScanner style={{ marginRight: '5px', fontSize: '17px' }} />
            Quét mã
          </Button>
        </Stack>
        <div style={{ textAlign: 'center' }}>
          <img
            src={require('../../../assets/image/TinTuc/giaohang6.jpg')}
            alt=""
            height={300}
            width={750}
          />
        </div>
        <Modal
          open={qrScannerVisible}
          onClose={() => {
            setQrScannerVisible(false)
          }}>
          <Box sx={styleModal}>
            <Scanner handleScan={createReturn} setOpen={setQrScannerVisible} />
          </Box>
        </Modal>
      </Paper>
    </div>
  )
}
