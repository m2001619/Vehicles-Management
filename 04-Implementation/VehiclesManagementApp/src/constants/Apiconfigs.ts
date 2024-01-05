// react native
//import { Platform } from "react-native";

// npm packages
import { io } from "socket.io-client";

// hande base url
//let baseUrl = Platform.OS === "android" ? "http://10.0.2.2:1865" : "http://localhost:1865";
const baseUrl = "https://vehicles-managent-server.onrender.com";
const url = `${baseUrl}/api/v1`;

// create a socket using socket.io client package
export const socket = io(baseUrl);

/** Start Api Routes **/
const ApiConfigs = {
  Auth: {
    login: `${url}/user/login`,
    signup: `${url}/user/signup`,
    validateEmail: `${url}/user/validateEmail`,
    forgotPassword: `${url}/user/forgotPassword`,
    resetPassword: `${url}/user/resetPassword`,
  },
  User: {
    updateMe: `${url}/user/updateMe`,
    getMe: `${url}/user/getMe`,
    updatePassword: `${url}/user/updatePassword`,
    setNotificationToken: `${url}/user/setNotificationToken`,
  },
  Garage: {
    getAllGarages: `${url}/garage/getAllGarages`,
    getGarage: `${url}/garage/`,
  },
  Vehicle: {
    getAllVehicles: `${url}/vehicle/getAllVehicles`,
    getVehicle: `${url}/vehicle/`,
    getAvailableVehicles: `${url}/vehicle/getAvailableVehicles`,
    getGarageVehicles: `${url}/vehicle/getGarageVehicles/`,
    askToReturnVehicle: `${url}/vehicle/askToReturnVehicle/`,
    reUseVehicle: `${url}/vehicle/reUseVehicle/`,
    likeVehicle: `${url}/vehicle/likeVehicle/`,
    dislikeVehicle: `${url}/vehicle/dislikeVehicle/`,
    getUserLikeVehicles: `${url}/vehicle/getUserLikeVehicles/`,
    getNearlyVehicle: `${url}/vehicle/nearlyVehicle`,
  },
  Request: {
    get: `${url}/request/`,
    update: `${url}/request/`,
    delete: `${url}/request/`,
    requestVehicle: `${url}/request/requestVehicle/`,
  },
  ReservationArchive: {
    getMyActiveReservation: `${url}/reservationArchive/getMyActiveReservation`,
    getMyArchiveReservations: `${url}/reservationArchive/getMyArchiveReservations`,
  },
  FuelBill: {
    delete: `${url}/fuelBill/`,
    create: `${url}/fuelBill`,
    edit: `${url}/fuelBill/`,
    getReservationFuelBills: `${url}/fuelBill/getReservationFuelBills/`,
    getUserFuelBills: `${url}/fuelBill/getUserFuelBills/`,
  },
};
/** End Api Routes **/

export default ApiConfigs;
