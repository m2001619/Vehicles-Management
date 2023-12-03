// mongoose
import mongoose, { Model } from "mongoose";

// npm packages
import validator from "validator";

// interfaces
import { Schema } from "mongoose";
import { IGarage } from "../constans/Interfaces";

// constants
import { statuses } from "../constans/Interfaces";

/** Start Schema **/
const garageSchema: Schema<IGarage> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Garage should have a name"],
      unique: [true, "There is a garage with this name"],
    },
    address: {
      type: String,
      required: [true, "Garage should have an address"],
      unique: [true, "There is a garage with this address"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please provide the garage's phone number"],
      unique: [true, "There is a garage with this phone number"],
      validate: [
        validator.isMobilePhone,
        "Please provide a valid phone number",
      ],
    },
    photo: String,
    vehicles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Vehicle",
        },
      ],
      default: [],
    },
    reservationArchive: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "ReservationArchive",
        },
      ],
      default: [],
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    status: {
      type: String,
      default: statuses.active,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
/** End Schema **/

/** Start Mongoose Functions **/
const Garage: Model<IGarage> = mongoose.model<IGarage>("Garage", garageSchema);
/** End Mongoose Functions **/

export default Garage;
