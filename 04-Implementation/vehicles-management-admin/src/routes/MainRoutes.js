import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';

const MainLayout = Loadable(
  lazy(() => import('layout/MainLayout')),
  true
);

// dashboard routing
const DashboardDefault = Loadable(
  lazy(() => import('views/dashboard/Default')),
  true
);

// user routing
const ListAllUsers = Loadable(
  lazy(() => import('views/application/user/ListAllUsers')),
  true
);

// vehicle routing
const ListAllVehicles = Loadable(
  lazy(() => import('views/application/vehicle/ListAllVehicle')),
  true
);
const HandleVehicle = Loadable(
  lazy(() => import('views/application/vehicle/HandleVehicle')),
  true
);

// garage routing
const ListAllGarages = Loadable(
  lazy(() => import('views/application/garage/ListAllGarages')),
  true
);
const HandleGarage = Loadable(
  lazy(() => import('views/application/garage/HandleGarage')),
  true
);

// archive routing
const ListAllArchive = Loadable(
  lazy(() => import('views/application/archive/ListAllArchive')),
  true
);
const HandleArchive = Loadable(
  lazy(() => import('views/application/archive/HandleArchive')),
  true
);

// bill routing
const ListAllBills = Loadable(
  lazy(() => import('views/application/bill/ListAllBills')),
  true
);
const HandleBill = Loadable(
  lazy(() => import('views/application/bill/HandleBill')),
  true
);

// Map routing
const Map = Loadable(
  lazy(() => import('views/Map/Map')),
  true
);

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  guard: true,
  children: [
    {
      path: '/map/:id',
      guard: true,
      element: <Map />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          guard: true,
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'application',
      children: [
        {
          path: 'user',
          children: [
            {
              path: 'list-all-users',
              guard: true,
              element: <ListAllUsers />
            }
          ]
        },
        {
          path: 'vehicle',
          children: [
            {
              path: 'list-all-vehicles',
              guard: true,
              element: <ListAllVehicles />
            },
            {
              path: 'add-new-vehicle',
              guard: true,
              element: <HandleVehicle />
            },
            {
              path: 'edit-vehicle/:id',
              guard: true,
              element: <HandleVehicle />
            },
            {
              path: 'view-vehicle/:id',
              guard: true,
              element: <HandleVehicle />
            }
          ]
        },
        {
          path: 'garage',
          children: [
            {
              path: 'list-all-garages',
              guard: true,
              element: <ListAllGarages />
            },
            {
              path: 'add-new-garage',
              guard: true,
              element: <HandleGarage />
            },
            {
              path: 'edit-garage/:id',
              guard: true,
              element: <HandleGarage />
            },
            {
              path: 'view-garage/:id',
              guard: true,
              element: <HandleGarage />
            }
          ]
        },
        {
          path: 'archive',
          children: [
            {
              path: 'list-all-archives',
              guard: true,
              element: <ListAllArchive />
            },
            {
              path: 'edit-archive/:id',
              guard: true,
              element: <HandleArchive />
            }
          ]
        },
        {
          path: 'bill',
          children: [
            {
              path: 'list-all-bills',
              guard: true,
              element: <ListAllBills />
            },
            {
              path: 'edit-bill/:id',
              guard: true,
              element: <HandleBill />
            }
          ]
        }
      ]
    }
  ]
};

export default MainRoutes;
