import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material'
import React from 'react'
import { spButton } from '../pages/admin/sanpham/sanPhamStyle'

export default function DialogAddUpdate({
  children,
  open,
  setOpen,
  title,
  buttonSubmit,
  width,
  closeButton,
}) {
  return (
    <Dialog
      fullWidth
      maxWidth={width ? width : 'xs'}
      open={open}
      onClose={() => {
        setOpen(false)
      }}>
      <DialogContent>
        <Typography mb={2} textAlign={'center'} fontWeight={'600'} variant="h5" color={'GrayText'}>
          {title}
        </Typography>
        {children}
        {!closeButton && (
          <Stack mt={2} direction="row" justifyContent="center" alignItems="flex-start" spacing={2}>
            <Button
              onClick={() => {
                setOpen(false)
              }}
              color="error"
              disableElevation
              variant="contained"
              sx={{ ...spButton }}>
              Đóng
            </Button>
            {buttonSubmit}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  )
}
