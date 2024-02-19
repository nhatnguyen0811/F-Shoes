import AutGuardAdmin from '../../layout/AutGuardAdmin'
import AdBrandPage from '../../pages/admin/thuonghieu/AdBrandPage'

const adBrandRoute = [
  {
    path: '/admin/brand',
    element: (
      <AutGuardAdmin>
        <AdBrandPage />
      </AutGuardAdmin>
    ),
    loader: () => {
      document.title = 'Admin - Thương hiệu'
      return null
    },
  },
]

export default adBrandRoute
