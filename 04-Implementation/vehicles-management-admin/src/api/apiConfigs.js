import { io } from 'socket.io-client';

const baseUrl = 'http://localhost:1865'; // https://server-rom.onrender.com

export const socket = io(baseUrl);

const url = `${baseUrl}/api/v1`;

const ApiConfigs = {
  User: {
    getAllUser: `${url}/user/getAllUsers`,
    blockUser: `${url}/user/blockUser/`,
    activeUser: `${url}/user/activeUser/`,
    acceptPendingUser: `${url}/user/acceptPendingUser/`,
    setNotificationToken: `${url}/user/setNotificationToken`,
    updatePassword: `${url}/user/updatePassword`
  },
  Auth: {
    login: `${url}/user/login`,
    forgotPassword: `${url}/user/forgotPassword`,
    resetPassword: `${url}/user/resetPassword`
  },
  Garage: {
    getAllGarages: `${url}/garage/getAllGarages`,
    getGarage: `${url}/garage/`,
    editGarage: `${url}/garage/`,
    createGarage: `${url}/garage/`,
    deleteGarage: `${url}/garage/`,
    blockActiveGarage: `${url}/garage/blockActiveGarage/`,
    getGarageVehicles: `${url}/garage/getGarageVehicles/`
  },
  Vehicle: {
    getAllVehicles: `${url}/vehicle/getAllVehicles`,
    createVehicle: `${url}/vehicle/`,
    editVehicle: `${url}/vehicle/`,
    getRequestedVehicles: `${url}/vehicle/getRequestedVehicles`,
    getVehicle: `${url}/vehicle/`,
    getGarageVehicles: `${url}/vehicle/getGarageVehicles/`,
    acceptReturnVehicle: `${url}/vehicle/acceptReturnVehicle/`,
    deleteVehicle: `${url}/vehicle/`,
    blockActiveVehicle: `${url}/vehicle/blockActiveVehicle/`
  },
  Request: {
    get: `${url}/request/`,
    update: `${url}/request/`,
    delete: `${url}/request/`,
    getVehicleRequests: `${url}/request/getVehicleRequests/`,
    acceptRequest: `${url}/request/acceptRequest/`
  },
  ReservationArchive: {
    editArchive: `${url}/reservationArchive/`,
    deleteArchive: `${url}/reservationArchive/`,
    getAllReservations: `${url}/reservationArchive/getAllReservations`
  },
  FuelBill: {
    delete: `${url}/fuelBill/`,
    create: `${url}/fuelBill`,
    edit: `${url}/fuelBill/`,
    getReservationFuelBills: `${url}/fuelBill/getReservationFuelBills/`,
    getUserFuelBills: `${url}/fuelBill/getUserFuelBills/`,
    getAllFuelBill: `${url}/fuelBill/getAllFuelBill/`
  },
  Content: {
    getContent: `${url}/content/`,
    edit: `${url}/content/`
  }
};

export default ApiConfigs;
