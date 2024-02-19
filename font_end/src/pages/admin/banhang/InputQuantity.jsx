import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import useDebounce from '../../../services/hook/useDebounce'
import { toast } from 'react-toastify'
import checkStartApi from '../../../api/checkStartApi'

const InputQuantity = ({
  cart,
  decreaseQuantityBillDetail,
  inputQuantityBillDetail,
  increaseQuantityBillDetail,
  totalSum,
}) => {
  const [quantity, setQuantity] = useState(cart.quantity)

  const debouncedValue = useDebounce(quantity, 500)

  useEffect(() => {
    if (parseInt(cart.quantity) !== parseInt(quantity)) {
      setQuantity(cart.quantity)
    }
  }, [cart.quantity])

  useEffect(() => {
    if (parseInt(cart.quantity) !== parseInt(quantity)) {
      setQuantity(cart.quantity)
    }
  }, [cart.quantity])

  useEffect(() => {
    if (quantity !== cart.quantity) {
      check(quantity)
    }
  }, [debouncedValue])

  async function check(quantity) {
    const numericValue = Number(quantity)
    const numericValue2 = Number(cart.quantity)
    if (!isNaN(numericValue) && numericValue >= 1) {
      const res = await checkStartApi.checkQuantiy(cart.id, numericValue - numericValue2)
      if (res.data) {
        inputQuantityBillDetail(cart.idBillDetail, cart.id, numericValue, cart)
      } else {
        setQuantity(cart.quantity)
        toast.error('Số lượng quá số lượng sản phẩm')
      }
    } else {
      setQuantity(cart.quantity)
      toast.error('Số lượng phải lớn hơn 0')
    }
  }

  return (
    <Box
      width={'65px'}
      display="flex"
      alignItems="center"
      sx={{
        border: '1px solid gray',
        borderRadius: '20px',
      }}
      p={'3px'}>
      <IconButton
        size="small"
        sx={{ p: 0 }}
        onClick={() => {
          setQuantity(parseInt(quantity) - 1)
        }}
        disabled={quantity <= 1}>
        <RemoveIcon fontSize="1px" />
      </IconButton>
      <TextField
        value={quantity}
        inputProps={{ min: 1 }}
        size="small"
        sx={{
          width: '30px ',
          '& input': { p: 0, textAlign: 'center' },
          '& fieldset': {
            border: 'none',
          },
        }}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <IconButton
        disabled={Number(totalSum) >= 500000000}
        size="small"
        sx={{ p: 0 }}
        onClick={() => {
          setQuantity(parseInt(quantity) + 1)
        }}>
        <AddIcon fontSize="1px" />
      </IconButton>
    </Box>
  )
}

export default InputQuantity
