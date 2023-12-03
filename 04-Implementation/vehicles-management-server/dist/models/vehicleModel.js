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
const vehicleSchema = new mongoose_1.Schema({
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
        enum: ["gasoline", "diesel", "electric", "hybrid", "gas"],
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
    bodyType: String,
    TransmissionType: String,
    garage: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Garage",
        required: [true, "Vehicle should belong to a garage."],
    },
    numSeats: {
        type: Number,
        required: [true, "Vehicle should have the number of seats."],
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    likedUser: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        default: [],
    },
    reservationArchive: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "ReservationArchive",
            },
        ],
        default: [],
    },
    fuelBill: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "FuelBill",
            },
        ],
        default: [],
    },
    requests: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
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
        coordinates: [Number],
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
vehicleSchema.index({ vehicle: 1 }, { weights: { unique: 1 } });
vehicleSchema.index({ location: '2dsphere' });
// @ts-ignore
vehicleSchema.pre("find", function (next) {
    this.populate({
        path: "user",
        select: "name photo",
    });
    this.populate({
        path: "garage",
        select: "name",
    });
    next();
});
const Vehicle = mongoose_1.default.model("Vehicle", vehicleSchema);
exports.default = Vehicle;
