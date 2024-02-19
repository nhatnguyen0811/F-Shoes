import React, { useState } from 'react'
import DialogAddUpdate from '../../../components/DialogAddUpdate'
import { Button, TextField } from '@mui/material'
import './index.css'
import sanPhamApi from '../../../api/admin/sanpham/sanPhamApi'
import { toast } from 'react-toastify'

export default function ModalAddProduct({
  open,
  setOpen,
  title,
  dataProduct,
  nameProduct,
  setNameProduct,
  setProduct,
}) {
  const [err, setErr] = useState(null)
  
  const handleUpdateNameProduct = async (id, nameProduct) => {
    const specialCharactersRegex = /[!@#$%^&*(),.?":{}|<>]/

    if (nameProduct.trim().length > 0) {
      if (nameProduct.trim().length < 100) {
        if (!specialCharactersRegex.test(nameProduct)) {
          try {
            const listNameResponse = await sanPhamApi.getAllName()
            const listName = listNameResponse.data.map((name) => name.toLowerCase())
            const updatedNameLower = nameProduct.trim().toLowerCase()
            if (!listName.includes(updatedNameLower)) {
              const response = await sanPhamApi.updateNameProduct(id, nameProduct.trim())
              if (response.data.success) {
                toast.success('Cập nhật thành công', {
                  position: toast.POSITION.TOP_RIGHT,
                })
                setProduct({ ...dataProduct, name: nameProduct })
              } else {
                toast.error('Cập nhật thất bại', {
                  position: toast.POSITION.TOP_RIGHT,
                })
              }
              setOpen(false)
            } else {
              setErr('Tên sản phẩm đã tồn tại')
            }
          } catch (error) {
            toast.error('Cập nhật thất bại', {
              position: toast.POSITION.TOP_RIGHT,
            })
            console.error(error)
          }
        } else {
          setErr('Tên sản phẩm không được chứa ký tự đặc biệt')
        }
      } else {
        setErr('Tên sản phẩm nhỏ hơn 100 ký tự')
      }
    } else {
      setErr('Tên sản phẩm không được để trống')
    }
  }

  return (
    <DialogAddUpdate
      open={open}
      setOpen={setOpen}
      title={title}
      buttonSubmit={
        <Button
          onClick={() => handleUpdateNameProduct(dataProduct.id, nameProduct)}
          style={{ boxShadow: 'none', textTransform: 'none', borderRadius: '8px' }}
          color="cam"
          variant="contained">
          Lưu
        </Button>
      }>
      <div className="san-pham">
        <b>
          <span style={{ color: 'red' }}>*</span>Tên sản phẩm
        </b>
        <TextField
          defaultValue={dataProduct.name}
          color="cam"
          className="search-field"
          size="small"
          fullWidth
          placeholder="Tên sản phẩm"
          onChange={(e) => setNameProduct(e.target.value)}
        />
        {err && <span style={{ color: 'red', textAlign: 'center' }}>{err}</span>}
      </div>
    </DialogAddUpdate>
  )
}
