"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// mongoose
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
/** Start Schema **/
const requestSchema = new mongoose_2.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Enter the Id of User"],
    },
    vehicle: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
/** End Schema **/
/** Start Mongoose Functions **/
const Request = mongoose_1.default.model("Request", requestSchema);
/** End Mongoose Functions **/
exports.default = Request;
