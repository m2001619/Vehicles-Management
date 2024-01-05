import { create } from "zustand";

// Store interface
interface StoreInterface {
  token: string;
  setToken: (token: string) => void;
  userInfo: UserType;
  setUserInfo: (userInfo: any) => void;
  updateUserInfo: (userInfo: any) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  formLoading: boolean;
  setFormLoading: (val: boolean) => void;
}

/* Start Global Store */
const GlobalData = create<StoreInterface>((set, get) => ({
  token: "",
  setToken: (token) => set({ token: token }),
  userInfo: {
    role: "user",
    block: false,
    likeVehicles: [],
    reservationArchive: [],
    fuelBill: [],
    name: "",
    email: "",
    phoneNumber: "",
    photo: "",
    id: "",
  },
  setUserInfo: (data) => set({ userInfo: { ...get().userInfo, ...data } }),
  updateUserInfo: (data) => set({ userInfo: data }),
  isLoading: false,
  setIsLoading: (val) => set({ isLoading: val }),
  formLoading: false,
  setFormLoading: (val) => set({ formLoading: val }),
}));
export default GlobalData;
/* End Global Store */

/* Start Interfaces and Types */
export type UserType = {
  role: "user" | "admin" | "pending-user";
  block: boolean;
  name: string;
  email: string;
  phoneNumber: string;
  id: string;
  reservationArchive: string[];
  photo?: string;
  vehicle?: string;
  likeVehicles: string[];
  request?: string;
  fuelBill: string[];
};

export type GarageType = {
  vehicles: string[];
  reservationArchive: string[];
  _id: string;
  name: string;
  address: string;
  phoneNumber: string;
  photo: string;
};

export type VehicleType = {
  user?: string;
  likedUser: string[];
  garage: {
    id: string;
    name: string;
  };
  requests: string[];
  reservationArchive: string[];
  images: string[];
  features: string[];
  _id: string;
  make: string;
  model: string;
  year: number;
  fuelType: string;
  mileage: number;
  VIN: string;
  registrationNumber: string;
  bodyType: string;
  TransmissionType: string;
  numSeats: number;
  maxSpeed: number;
  engineOutput: number;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
};

export type RequestType = {
  _id: string;
  user: string;
  vehicle: string;
  from: string;
  to: string;
  note: string;
  date: Date;
};

export type ArchiveType = {
  _id: string;
  user: string;
  vehicle: string;
  garage: string;
  fuelBill: string[];
  status: "in-use" | "ask-to-return" | "returned";
  date: Date;
  departure: {
    from: string;
    time: string;
    odo: string;
  };
  arrival: {
    to: string;
    time: string;
    odo: string;
  };
  note: string;
};

export type FuelBillType = {
  _id: string;
  reservationArchive: string;
  user: string;
  vehicle: string;
  date: Date;
  fuelVolume: number;
  fuelType: "gasoline" | "diesel" | "electric" | "hybrid" | "gas";
  station: string;
  price: number;
  note: string;
  picture: string;
};
/* End Interfaces and Types */
