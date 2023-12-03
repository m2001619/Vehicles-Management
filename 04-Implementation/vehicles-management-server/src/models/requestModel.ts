// mongoose
import mongoose, { Model } from "mongoose";

// interfaces
import { IRequest } from "../constans/Interfaces";
import { Schema } from "mongoose";

/** Start Schema **/
const requestSchema: Schema<IRequest> = new Schema<IRequest>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Enter the Id of User"],
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: [true, "Enter the Id of vehicle"],
    },
    from: {
      type: String,
      required: [true, "Enter the location of departure"],
    },
    to: {
      type: String,
      required: [true, "Enter the location of arrival"],
    },
    note: String,
    date: Date,
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
const Request: Model<IRequest> = mongoose.model<IRequest>(
  "Request",
  requestSchema
);
/** End Mongoose Functions **/

export default Request;
