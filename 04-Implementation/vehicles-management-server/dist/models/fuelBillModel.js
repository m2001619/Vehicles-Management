"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const fuelBillSchema = new mongoose_1.Schema({
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
const FuelBill = mongoose_1.default.model("FuelBill", fuelBillSchema);
exports.default = FuelBill;
