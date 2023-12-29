"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// mongoose
const mongoose_1 = __importDefault(require("mongoose"));
// interfaces
const mongoose_2 = require("mongoose");
/** Start Schema **/
const fuelBillSchema = new mongoose_2.Schema({
    reservationArchive: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "ReservationArchive",
        required: [
            true,
            "Enter the reservation Archive that this bill belongs to.",
        ],
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Enter user's id"],
    },
    vehicle: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
/** End Schema **/
/** Start Mongoose Functions **/
const FuelBill = mongoose_1.default.model("FuelBill", fuelBillSchema);
/** End Mongoose Functions **/
exports.default = FuelBill;
