// express
import { Request } from "express";

// mongoose
import { Document, Schema } from "mongoose";

/** Start Interfaces **/
export interface IGarage extends Document {
  name: {
    type: string;
    unique: number;
  };
  address: {
    type: string;
    unique: number;
  };
  phoneNumber: {
    type: string;
    unique: number;
  };
  photo?: string;
  vehicles: Schema.Types.ObjectId[];
  reservationArchive: Schema.Types.ObjectId[];
  createdAt: Date;
  status: string;
}

export interface IFuelBill extends Document {
  reservationArchive: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  vehicle: Schema.Types.ObjectId;
  date: Date;
  fuelVolume: number;
  fuelType: "Gasoline" | "Diesel" | "Electric" | "Hybrid" | "Natural Gas";
  station: string;
  price: number;
  note?: string;
  picture?: string;
  createdAt: Date;
}

export interface IRequest extends Document {
  user: Schema.Types.ObjectId;
  vehicle: Schema.Types.ObjectId;
  from: string;
  to: string;
  note?: string;
  date?: Date;
  createdAt: Date;
}

export interface IReservationArchive extends Document {
  user: Schema.Types.ObjectId;
  vehicle: Schema.Types.ObjectId;
  garage: Schema.Types.ObjectId;
  fuelBill?: Schema.Types.ObjectId[];
  status?: "in-use" | "ask-to-return" | "returned";
  date?: Date;
  departure: {
    from: string;
    time: Date;
    odo: number;
  };
  arrival: {
    to: string;
    time?: Date;
    odo?: number;
  };
  note?: string;
  createdAt: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  photo?: string;
  role: "user" | "admin" | "pending-user";
  password: string;
  passwordConfirm: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: number;
  active: boolean;
  block: boolean;
  vehicle?: Schema.Types.ObjectId;
  likeVehicles: Schema.Types.ObjectId[];
  request?: Schema.Types.ObjectId;
  reservationArchive?: Schema.Types.ObjectId[];
  fuelBill?: Schema.Types.ObjectId[];
  notificationToken: string;
  correctPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
  changedPasswordAfter: (JWTTimestamp: number) => boolean;
  createPasswordResetToken: () => string;
  createdAt: Date;
}

// @ts-ignore
export interface IVehicle extends Document {
  usingStatus: "available" | "in-use" | "ask-to-return";
  make: string;
  model: string;
  engineOutput: number;
  maxSpeed: number;
  year: number;
  fuelType: "gasoline" | "diesel" | "electric" | "hybrid" | "gas";
  mileage: number;
  VIN: {
    type: string;
    unique: number;
  };
  images: string[];
  features: string[];
  registrationNumber?: string;
  bodyType:
    | "Sedan"
    | "Hatchback"
    | "SUV"
    | "Coupe"
    | "Convertible"
    | "Minivan"
    | "Pickup"
    | "Station Wagon"
    | "Crossover";
  TransmissionType?: string;
  garage: Schema.Types.ObjectId;
  location?: {
    type: string;
    coordinates: number[];
  };
  numSeats: number;
  user?: Schema.Types.ObjectId;
  likedUser: Schema.Types.ObjectId[];
  reservationArchive?: Schema.Types.ObjectId[];
  fuelBill?: Schema.Types.ObjectId[];
  requests?: Schema.Types.ObjectId[];
  createdAt: Date;
  status: string;
}

export interface IContent extends Document {
  adminLogo: string;
  appLogo: string;
  adminTitle: string;
  appTitle: string;
}

export interface ICostumeRequest extends Request {
  user: IUser;
}

/** End Interfaces **/

/** Start Constants **/
export const statuses = {
  active: "ACTIVE",
  block: "BLOCK",
};
export const fuelTypes = ["gasoline", "diesel", "electric", "hybrid", "gas"];
export const bodyTypes = [
  "Sedan",
  "Hatchback",
  "SUV",
  "Coupe",
  "Convertible",
  "Minivan",
  "Pickup",
  "Station Wagon",
  "Crossover",
];
export const transmissionTypes = [
  "Automatic",
  "Manual",
  "CVT",
  "Semi-Automatic",
  "Dual-Clutch",
  "Tiptronic",
  "Sportmatic",
  "AMT",
  "DCT",
  "eCVT",
];

/** End Constants **/
