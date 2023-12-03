// mongoose
import mongoose, { Model } from "mongoose";

// interfaces
import { Schema } from "mongoose";
import { IReservationArchive } from "../constans/Interfaces";

/** Start Schema **/
const reservationArchiveSchema: Schema<IReservationArchive> =
  new Schema<IReservationArchive>(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Enter the id of the reserved user"],
      },
      vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        required: [true, "Enter Id of the reserved vehicle"],
      },
      garage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Garage",
        required: [true, "Enter Id of the reserved garage"],
      },
      fuelBill: {
        type: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FuelBill",
          },
        ],
        default: [],
      },
      status: {
        type: String,
        enum: ["in-use", "ask-to-return", "returned"],
        default: "in-use",
      },
      date: {
        type: Date,
        required: [true, "Enter Date of reservation"],
      },
      departure: {
        from: {
          type: String,
          required: [true, "Enter the location of departure"],
        },
        time: {
          type: Date,
          required: [true, "Enter the time of departure"],
        },
        odo: {
          type: Number,
          required: [true, "Enter the ODO of departure"],
        },
      },
      arrival: {
        to: {
          type: String,
          required: [true, "Enter the location of arrival"],
        },
        time: Date,
        odo: Number,
      },
      note: String,
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
const ReservationArchive: Model<IReservationArchive> =
  mongoose.model<IReservationArchive>(
    "ReservationArchive",
    reservationArchiveSchema
  );
/** End Mongoose Functions **/

export default ReservationArchive;
