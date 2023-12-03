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
const reservationArchiveSchema = new mongoose_1.Schema({
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
const ReservationArchive = mongoose_1.default.model("ReservationArchive", reservationArchiveSchema);
exports.default = ReservationArchive;
