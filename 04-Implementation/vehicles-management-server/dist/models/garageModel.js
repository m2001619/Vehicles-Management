"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// mongoose
const mongoose_1 = __importDefault(require("mongoose"));
// npm packages
const validator_1 = __importDefault(require("validator"));
// interfaces
const mongoose_2 = require("mongoose");
// constants
const Interfaces_1 = require("../constans/Interfaces");
/** Start Schema **/
const garageSchema = new mongoose_2.Schema({
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
            validator_1.default.isMobilePhone,
            "Please provide a valid phone number",
        ],
    },
    photo: String,
    vehicles: {
        type: [
            {
                type: mongoose_2.Schema.Types.ObjectId,
                ref: "Vehicle",
            },
        ],
        default: [],
    },
    reservationArchive: {
        type: [
            {
                type: mongoose_2.Schema.Types.ObjectId,
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
        default: Interfaces_1.statuses.active,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
/** End Schema **/
/** Start Mongoose Functions **/
const Garage = mongoose_1.default.model("Garage", garageSchema);
/** End Mongoose Functions **/
exports.default = Garage;
