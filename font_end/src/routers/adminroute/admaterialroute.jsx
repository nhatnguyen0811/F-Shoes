import AutGuardAdmin from '../../layout/AutGuardAdmin'
import AdMaterialPage from '../../pages/admin/chatlieu/AdMaterialPage'

const adMaterialRoute = [
  {
    path: '/admin/material',
    element: (
      <AutGuardAdmin>
        <AdMaterialPage />
      </AutGuardAdmin>
    ),
    loader: () => {
      document.title = 'Admin - Chất liệu'
      return null
    },
  },
]

export default adMaterialRoute
