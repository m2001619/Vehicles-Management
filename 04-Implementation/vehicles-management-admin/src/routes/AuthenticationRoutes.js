import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';

// Authentication routers
const Login = Loadable(lazy(() => import('views/authentication/authentication/Login')));
const ForgotPassword = Loadable(lazy(() => import('views/authentication/authentication/ForgotPassword')));
const ResetPassword = Loadable(lazy(() => import('views/authentication/authentication/ResetPassword')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  }
];

export default AuthenticationRoutes;
