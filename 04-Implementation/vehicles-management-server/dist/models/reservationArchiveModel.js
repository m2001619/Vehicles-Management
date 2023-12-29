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
const reservationArchiveSchema = new mongoose_2.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Enter the id of the reserved user"],
    },
    vehicle: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Vehicle",
        required: [true, "Enter Id of the reserved vehicle"],
    },
    garage: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Garage",
        required: [true, "Enter Id of the reserved garage"],
    },
    fuelBill: {
        type: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
/** End Schema **/
/** Start Mongoose Functions **/
const ReservationArchive = mongoose_1.default.model("ReservationArchive", reservationArchiveSchema);
/** End Mongoose Functions **/
exports.default = ReservationArchive;
