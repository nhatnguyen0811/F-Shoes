import ChangePassword from '../../pages/admin/ChangePassword'

const adChangeRoute = [
  {
    path: '/admin/change-password',
    element: <ChangePassword />,
    loader: () => {
      document.title = 'Admin - Đổi mật khẩu'
      return null
    },
  },
]
export default adChangeRoute
