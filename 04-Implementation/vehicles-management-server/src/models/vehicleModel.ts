// mongoose
import mongoose, { Schema, Model } from "mongoose";

// interfaces
import {
  IVehicle,
} from "../constans/Interfaces";

// constants
import {
    bodyTypes,
    fuelTypes,
    statuses,
    transmissionTypes,
} from "../constans/Interfaces";

/** Start Schema **/
const vehicleSchema: Schema<IVehicle> = new Schema(
  {
    usingStatus: {
      type: String,
      default: "available",
    },
    make: {
      type: String,
      required: [true, "Vehicle should have the brand or manufacturer name."],
    },
    model: {
      type: String,
      required: [true, "Vehicle should have a model."],
    },
    engineOutput: {
      type: Number,
      required: [true, "Vehicle should have an Engine Output."],
    },
    maxSpeed: {
      type: Number,
      required: [true, "Vehicle should have a Max Speed."],
    },
    year: {
      type: Number,
      required: [true, "Vehicle should have a year of manufacture."],
    },
    fuelType: {
      type: String,
      required: [true, "Vehicle should have a type of fuel it uses."],
      enum: fuelTypes,
    },
    bodyType: {
      type: String,
      required: [true, "Vehicle should have a type of body."],
      enum: bodyTypes,
    },
    mileage: {
      type: Number,
      required: [
        true,
        "Vehicle should have the number of miles it has been driven.",
      ],
    },
    VIN: {
      type: String,
      required: [true, "Vehicle should have an identification number."],
      unique: [true, "Identification number should be unique for every car."],
    },
    images: {
      type: [String],
      required: [true, "Vehicle should have at least one image."],
    },
    features: [String],
    registrationNumber: String,
    TransmissionType: {
      type: String,
      required: [true, "Vehicle should have a type of transmission."],
      enum: transmissionTypes,
    },
    garage: {
      type: Schema.Types.ObjectId,
      ref: "Garage",
      required: [true, "Vehicle should belong to a garage."],
    },
    numSeats: {
      type: Number,
      required: [true, "Vehicle should have the number of seats."],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likedUser: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
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
    fuelBill: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "FuelBill",
        },
      ],
      default: [],
    },
    requests: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Request",
        },
      ],
      default: [],
    },
    location: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
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
vehicleSchema.index({ vehicle: 1 }, { weights: { unique: 1 } });
vehicleSchema.index({ location: "2dsphere" });
/** End Schema **/

/** Start Schema Middleware Functions **/
vehicleSchema.pre<IVehicle>(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  this.populate({
    path: "garage",
    select: "name",
  });
  this.populate({
    path: "reservationArchive",
    select: "status",
  });
  next();
});
/** End Schema Middleware Functions **/

/** Start Mongoose Functions **/
const Vehicle: Model<IVehicle> = mongoose.model<IVehicle>(
  "Vehicle",
  vehicleSchema
);
/** End Mongoose Functions **/
export default Vehicle;
