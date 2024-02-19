import ReturnPolicy from '../../pages/client/ReturnPolicy'

const adReturnPolicy = [
  {
    path: '/admin/return-policy',
    element: <ReturnPolicy />,
    loader: () => {
      document.title = 'Admin - Chính sách trả hàng'
      return null
    },
  },
]

export default adReturnPolicy
