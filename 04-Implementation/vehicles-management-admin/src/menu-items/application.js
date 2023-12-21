// assets
import { IconUserCheck, IconCar, IconHome, IconFiles, IconReportMoney } from '@tabler/icons-react';

// constant
const icons = {
  IconUserCheck,
  IconCar,
  IconHome,
  IconFiles,
  IconReportMoney
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'applications',
  title: 'Applications',
  type: 'group',
  children: [
    {
      id: 'users',
      title: 'Users',
      type: 'collapse',
      icon: icons.IconUserCheck,
      children: [
        {
          id: 'listAllUsers',
          title: 'List All Users',
          type: 'item',
          url: '/application/user/list-all-users'
        }
      ]
    },
    {
      id: 'vehicles',
      title: 'Vehicles',
      type: 'collapse',
      icon: icons.IconCar,
      children: [
        {
          id: 'listAllVehicles',
          title: 'List All Vehicles',
          type: 'item',
          url: '/application/vehicle/list-all-vehicles'
        },
        {
          id: 'addNewVehicle',
          title: 'Add New Vehicle',
          type: 'item',
          url: '/application/vehicle/add-new-vehicle'
        }
      ]
    },
    {
      id: 'garages',
      title: 'Garages',
      type: 'collapse',
      icon: icons.IconHome,
      children: [
        {
          id: 'listAllGarages',
          title: 'List All Garages',
          type: 'item',
          url: '/application/garage/list-all-garages'
        },
        {
          id: 'addNewGarage',
          title: 'Add New Garage',
          type: 'item',
          url: '/application/garage/add-new-garage'
        }
      ]
    },
    {
      id: 'archives',
      title: 'Archives',
      type: 'collapse',
      icon: icons.IconFiles,
      children: [
        {
          id: 'listAllArchives',
          title: 'List All Archives',
          type: 'item',
          url: '/application/archive/list-all-archives'
        }
      ]
    },
    {
      id: 'bills',
      title: 'Bills',
      type: 'collapse',
      icon: icons.IconReportMoney,
      children: [
        {
          id: 'listAllBills',
          title: 'List All Bills',
          type: 'item',
          url: '/application/bill/list-all-bills'
        }
      ]
    }
  ]
};

export default pages;
