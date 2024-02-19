import OrderAdmin from '../../pages/admin/banhang/OrderAdmin'

const adSellRoute = [
  {
    path: '/admin/sell',
    element: <OrderAdmin />,
    loader: () => {
      document.title = 'Admin - Bán hàng'
      return null
    },
  },
]

export default adSellRoute
