import { Suspense } from 'react';
import { Navigate } from 'react-router';

// project imports
import Loader from './Loader';

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

const Loadable =
  (Component, guard = false) =>
  (props) => {
    const token = sessionStorage.getItem('token');
    if (guard && !token) {
      return <Navigate to="/login" />;
    }
    return (
      <Suspense fallback={<Loader />}>
        <Component {...props} />
      </Suspense>
    );
  };

export default Loadable;
