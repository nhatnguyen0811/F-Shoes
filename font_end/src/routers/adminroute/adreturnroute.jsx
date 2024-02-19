import ReturnOrder from '../../pages/admin/return-order/ReturnOrder'
import ReturnOrderBill from '../../pages/admin/return-order/ReturnOrderBill'

const adReturnRoute = [
  {
    path: '/admin/return-order',
    element: <ReturnOrder />,
    loader: () => {
      document.title = 'Admin - Trả hàng'
      return null
    },
  },
  {
    path: '/admin/return-order/bill/:id',
    element: <ReturnOrderBill />,
    loader: () => {
      document.title = 'Admin - Trả hàng'
      return null
    },
  },
]

export default adReturnRoute
