import AdStaffDetail from '../../pages/admin/nhanvien/AdStaffDetailP'
import AdStaffPage from '../../pages/admin/nhanvien/AdStaffPage'
import AdStaffAdd from '../../pages/admin/nhanvien/AdStaffAdd'
import AutGuardAdmin from '../../layout/AutGuardAdmin'
import AdminInformation from '../../pages/admin/AdminInformation'

const adStaffRoute = [
  {
    path: '/admin/staff',
    element: (
      <AutGuardAdmin>
        <AdStaffPage />
      </AutGuardAdmin>
    ),
    loader: () => {
      document.title = 'Admin - Nhân viên'
      return null
    },
  },
  {
    path: '/admin/staff/detail/:id',
    element: (
      <AutGuardAdmin>
        <AdStaffDetail />
      </AutGuardAdmin>
    ),
    loader: () => {
      document.title = 'Admin - Nhân viên chi tiết'
      return null
    },
  },
  {
    path: '/admin/staff/add',
    element: (
      <AutGuardAdmin>
        <AdStaffAdd />
      </AutGuardAdmin>
    ),
    loader: () => {
      document.title = 'Admin - Thêm nhân viên'
      return null
    },
  },
  {
    path: '/admin/infomation/:id',
    element: <AdminInformation />,
    loader: () => {
      document.title = 'Admin - Thông tin cá nhân'
      return null
    },
  },
]

export default adStaffRoute
