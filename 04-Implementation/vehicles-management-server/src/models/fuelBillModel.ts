// mongoose
import mongoose, { Model } from "mongoose";

// interfaces
import { Schema } from "mongoose";
import { IFuelBill } from "../constans/Interfaces";

/** Start Schema **/
const fuelBillSchema: Schema<IFuelBill> = new Schema<IFuelBill>(
  {
    reservationArchive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReservationArchive",
      required: [
        true,
        "Enter the reservation Archive that this bill belongs to.",
      ],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Enter user's id"],
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: [true, "Enter vehicle's id"],
    },
    date: {
      type: Date,
      required: [true, "Enter Date of bill"],
    },
    fuelVolume: {
      type: Number,
      required: [true, "Enter the volume of fuel"],
    },
    fuelType: {
      type: String,
      required: [true, "Enter the type of fuel"],
      enum: ["gasoline", "diesel", "electric", "hybrid", "gas"],
    },
    station: {
      type: String,
      required: [true, "Enter the name of station"],
    },
    price: {
      type: Number,
      required: [true, "Enter the price of bill"],
    },
    note: {
      type: String,
      default: "",
    },
    picture: String,
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
/** End Schema **/

/** Start Mongoose Functions **/
const FuelBill: Model<IFuelBill> = mongoose.model<IFuelBill>(
  "FuelBill",
  fuelBillSchema
);
/** End Mongoose Functions **/
export default FuelBill;
