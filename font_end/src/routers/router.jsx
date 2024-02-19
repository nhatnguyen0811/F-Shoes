import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom'
import adBillRoute from './adminroute/adbillroute'
import ScrollToTop from '../components/ScrollToTop'
import adCustomerRoute from './adminroute/adcustomerroute'
import adProductRoute from './adminroute/adproductroute'
import adPromotionRoute from './adminroute/adpromotionroute'
import adStaffRoute from './adminroute/adstaffroute'
import adVoucherRoute from './adminroute/advoucherroute'
import clientRoute from './clientroute'
import AppBarAdmin from '../layout/AppBarAdmin'
import adSoleRoute from './adminroute/adsoleroute'
import adCategoryRoute from './adminroute/adcategoryroute'
import adMaterialRoute from './adminroute/admaterialroute'
import adBrandRoute from './adminroute/adbrandroute'
import adSellRoute from './adminroute/adsell'
import HeadingClient from '../layout/client/HeadingClient'
import FooterClient from '../layout/client/FooterClient'
import Dashboard from '../pages/admin/thongke/Dashboard'
import Payment from '../pages/client/Payment'
import AutGuard from '../layout/AutGuard'
import AutGuardClient from '../layout/AutGuardClient'
import AdminLogin from '../pages/admin/AdminLogin'
import Forbidden403 from '../pages/httpstatus/Forbidden403'
import NotFound404 from '../pages/httpstatus/NotFound404'
import adReturnRoute from './adminroute/adreturnroute'
import adChangeRoute from './adminroute/adchangepassword'
import adReturnPolicy from './adminroute/adreturnpolicy'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AutGuardClient>
        <HeadingClient />
        <ScrollToTop />
        <Outlet />
        <FooterClient />
      </AutGuardClient>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={'/home'} />,
        loader: () => {
          document.title = 'F-Shoes - Trang chủ'
          return null
        },
      },
      ...clientRoute,
    ],
  },
  {
    path: '/admin',
    element: (
      <AutGuard>
        <AppBarAdmin>
          <Outlet />
        </AppBarAdmin>
      </AutGuard>
    ),
    children: [
      { index: true, element: <Navigate to={'/admin/dashboard'} /> },
      ...adBillRoute,
      ...adCustomerRoute,
      ...adProductRoute,
      ...adPromotionRoute,
      ...adStaffRoute,
      ...adVoucherRoute,
      ...adSoleRoute,
      ...adCategoryRoute,
      ...adMaterialRoute,
      ...adBrandRoute,
      ...adSellRoute,
      ...adReturnRoute,
      ...adChangeRoute,
      ...adReturnPolicy,
      {
        path: '/admin/dashboard',
        element: <Dashboard />,
        loader: () => {
          document.title = 'Admin - Thống kê'
          return null
        },
      },
    ],
  },
  {
    path: '/vnpay-payment',
    element: <Payment />,
    loader: () => {
      document.title = 'F-Shoes - Payment'
      return null
    },
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
    loader: () => {
      document.title = 'F-Shoes - Đăng nhập'
      return null
    },
  },
  {
    path: '/not-authorization',
    element: <Forbidden403 />,
    loader: () => {
      document.title = 'Error 403'
      return null
    },
  },
  {
    path: '*',
    element: <NotFound404 />,
    loader: () => {
      document.title = 'Error 404'
      return null
    },
  },
])

export default router
