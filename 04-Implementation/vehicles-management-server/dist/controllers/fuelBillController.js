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
exports.getReservationFuelBills = exports.getVehicleFuelBills = exports.getUserFuelBills = exports.deleteFuelBill = exports.updateFuelBill = exports.createFuelBill = exports.getFuelBill = exports.getAllFuelBill = void 0;
const handlerFactory_1 = require("./handlerFactory");
const fuelBillModel_1 = __importDefault(require("./../models/fuelBillModel"));
const userModel_1 = __importDefault(require("./../models/userModel"));
const reservationArchiveModel_1 = __importDefault(require("./../models/reservationArchiveModel"));
const vehicleModel_1 = __importDefault(require("./../models/vehicleModel"));
exports.getAllFuelBill = (0, handlerFactory_1.getAll)(fuelBillModel_1.default);
exports.getFuelBill = (0, handlerFactory_1.getOne)(fuelBillModel_1.default);
exports.createFuelBill = (0, handlerFactory_1.createOne)(fuelBillModel_1.default, (formData, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield userModel_1.default.findByIdAndUpdate(formData.user, {
        $push: { fuelBill: data === null || data === void 0 ? void 0 : data._id },
    });
    yield vehicleModel_1.default.findByIdAndUpdate(formData.vehicle, {
        $push: { fuelBill: data === null || data === void 0 ? void 0 : data._id },
    });
    yield reservationArchiveModel_1.default.findByIdAndUpdate(formData.reservationArchive, {
        $push: { fuelBill: data === null || data === void 0 ? void 0 : data._id },
    });
}));
exports.updateFuelBill = (0, handlerFactory_1.updateOne)(fuelBillModel_1.default);
exports.deleteFuelBill = (0, handlerFactory_1.deleteOne)(fuelBillModel_1.default, (data) => __awaiter(void 0, void 0, void 0, function* () {
    yield userModel_1.default.findByIdAndUpdate(data.user, {
        $pull: { fuelBill: data === null || data === void 0 ? void 0 : data._id },
    });
    yield vehicleModel_1.default.findByIdAndUpdate(data.vehicle, {
        $pull: { fuelBill: data === null || data === void 0 ? void 0 : data._id },
    });
    yield reservationArchiveModel_1.default.findByIdAndUpdate(data.reservationArchive, {
        $pull: { fuelBill: data === null || data === void 0 ? void 0 : data._id },
    });
}));
exports.getUserFuelBills = (0, handlerFactory_1.getAll)(fuelBillModel_1.default, (req) => {
    return { user: req.params.userId };
});
exports.getVehicleFuelBills = (0, handlerFactory_1.getAll)(fuelBillModel_1.default, (req) => {
    return { vehicle: req.params.vehicleId };
});
exports.getReservationFuelBills = (0, handlerFactory_1.getAll)(fuelBillModel_1.default, (req) => {
    return { reservationArchive: req.params.reservationId };
});
