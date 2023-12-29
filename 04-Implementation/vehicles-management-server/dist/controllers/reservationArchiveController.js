"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReservation = exports.updateReservation = exports.getMyActiveReservation = exports.getMyArchiveReservations = exports.getReservation = exports.getAllReservations = exports.createReservation = exports.ReservationArchiveDeleteFromReference = void 0;
// project imports
const fuelBillController_1 = require("./fuelBillController");
const handlerFactory_1 = require("../utils/handlerFactory");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
// models
const userModel_1 = __importDefault(require("../models/userModel"));
const garageModel_1 = __importDefault(require("../models/garageModel"));
const vehicleModel_1 = __importDefault(require("../models/vehicleModel"));
const reservationArchiveModel_1 = __importDefault(require("../models/reservationArchiveModel"));
const fuelBillModel_1 = __importDefault(require("../models/fuelBillModel"));
/** Start Handler Functions **/
const ReservationArchiveDeleteFromReference = (archiveData) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, vehicle, garage, fuelBill } = archiveData;
    yield userModel_1.default.findByIdAndUpdate(user, {
        $pull: { reservationArchive: archiveData.id },
    });
    yield vehicleModel_1.default.findByIdAndUpdate(vehicle, {
        $pull: { reservationArchive: archiveData.id },
    });
    yield garageModel_1.default.findByIdAndUpdate(garage, {
        $pull: { reservationArchive: archiveData.id },
    });
    for (let bill of fuelBill) {
        const fuelBill = yield fuelBillModel_1.default.findById(bill);
        yield (0, fuelBillController_1.fuelBillDeleteFromReference)(fuelBill);
    }
});
exports.ReservationArchiveDeleteFromReference = ReservationArchiveDeleteFromReference;
/** End Handler Functions **/
/** Start Routes Functions **/
const createReservation = (archiveData) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, vehicle, garage } = archiveData;
    const reservationArchive = yield reservationArchiveModel_1.default.create(archiveData);
    yield userModel_1.default.findByIdAndUpdate(user, {
        vehicle,
        $push: { reservationArchive: reservationArchive === null || reservationArchive === void 0 ? void 0 : reservationArchive._id },
    });
    yield garageModel_1.default.findByIdAndUpdate(garage, {
        $push: { reservationArchive: reservationArchive === null || reservationArchive === void 0 ? void 0 : reservationArchive._id },
    });
    yield vehicleModel_1.default.findByIdAndUpdate(vehicle, {
        requestedUsers: [],
        user,
        $push: { reservationArchive: reservationArchive === null || reservationArchive === void 0 ? void 0 : reservationArchive._id },
    });
});
exports.createReservation = createReservation;
exports.getAllReservations = (0, handlerFactory_1.getAll)(reservationArchiveModel_1.default, undefined, undefined, [
    {
        path: "garage user",
        select: "name photo",
    },
    { path: "vehicle", select: "make model year images" },
]);
exports.getReservation = (0, handlerFactory_1.getOne)(reservationArchiveModel_1.default);
exports.getMyArchiveReservations = (0, handlerFactory_1.getAll)(reservationArchiveModel_1.default, (req) => ({
    user: req.user.id,
    status: "returned",
}));
exports.getMyActiveReservation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const myActiveReservation = yield reservationArchiveModel_1.default.findOne({
        user: req.user.id,
        $or: [{ status: "ask-to-return" }, { status: "in-use" }],
    });
    res.status(200).json({
        status: "success",
        data: myActiveReservation,
    });
}));
exports.updateReservation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield reservationArchiveModel_1.default.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
        status: "success",
        data,
    });
}));
exports.deleteReservation = (0, handlerFactory_1.deleteOne)(reservationArchiveModel_1.default, (data) => (0, exports.ReservationArchiveDeleteFromReference)(data));
/** End Routes Functions **/
