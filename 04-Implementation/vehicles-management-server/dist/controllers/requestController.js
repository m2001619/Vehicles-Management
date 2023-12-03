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
exports.acceptRequest = exports.requestVehicle = exports.deleteRequest = exports.updateRequest = exports.getRequest = exports.getVehicleRequests = exports.getAllRequests = void 0;
const handlerFactory_1 = require("./handlerFactory");
const requestModel_1 = __importDefault(require("../models/requestModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const vehicleModel_1 = __importDefault(require("../models/vehicleModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const reservationArchiveController_1 = require("./reservationArchiveController");
const notification_1 = require("../utils/notification");
const deleteFromReference = (request) => __awaiter(void 0, void 0, void 0, function* () {
    yield userModel_1.default.findByIdAndUpdate(request.user, { $unset: { request: "" } });
    yield vehicleModel_1.default.findByIdAndUpdate(request.vehicle, {
        $pull: { requests: request.id },
    });
});
exports.getAllRequests = (0, handlerFactory_1.getAll)(requestModel_1.default);
exports.getVehicleRequests = (0, handlerFactory_1.getAll)(requestModel_1.default, (req) => {
    var _a;
    return ({
        vehicle: (_a = req.params) === null || _a === void 0 ? void 0 : _a.vehicleId,
    });
});
exports.getRequest = (0, handlerFactory_1.getOne)(requestModel_1.default);
exports.updateRequest = (0, handlerFactory_1.updateOne)(requestModel_1.default);
exports.deleteRequest = (0, handlerFactory_1.deleteOne)(requestModel_1.default, (data) => deleteFromReference(data));
exports.requestVehicle = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield requestModel_1.default.findOne({ user: req.user.id });
    const vehicleId = req.params.vehicleId;
    const userId = req.user.id;
    if (request) {
        const errorMessage = `${request === null || request === void 0 ? void 0 : request.vehicle}` === vehicleId
            ? "You made a request for this vehicle already"
            : "You made a request for another vehicle";
        return next(new AppError_1.default(errorMessage, 400));
    }
    const { from, to, note } = req.body;
    const data = {
        vehicle: vehicleId,
        user: userId,
        from,
        to,
        note,
        date: new Date(),
    };
    const newRequest = yield requestModel_1.default.create(data);
    yield userModel_1.default.findByIdAndUpdate(userId, { request: newRequest === null || newRequest === void 0 ? void 0 : newRequest._id });
    yield vehicleModel_1.default.findByIdAndUpdate(vehicleId, {
        $push: { requests: newRequest === null || newRequest === void 0 ? void 0 : newRequest._id },
    });
    res.status(200).json({
        status: "success",
        message: "Send request successfully, Please wait accept from admin",
        data: newRequest,
    });
}));
exports.acceptRequest = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const requestId = req.params.id;
    const request = yield requestModel_1.default.findById(requestId);
    if (!request) {
        return next(new AppError_1.default("ICostumeRequest not found", 404));
    }
    const vehicle = yield vehicleModel_1.default.findById(request === null || request === void 0 ? void 0 : request.vehicle);
    const user = yield userModel_1.default.findById(request === null || request === void 0 ? void 0 : request.user);
    const odo = vehicle.mileage;
    const garageId = vehicle.garage;
    // @ts-ignore
    const archiveData = {
        user: request.user,
        vehicle: request.vehicle,
        garage: garageId,
        date: new Date(),
        departure: {
            from: request.from,
            time: request.date,
            odo,
        },
        arrival: {
            to: request.to,
        },
        note: request.note,
    };
    yield (0, reservationArchiveController_1.createReservation)(archiveData);
    const requests = yield requestModel_1.default.find({ vehicle: request.vehicle });
    requests.forEach((i) => deleteFromReference(i));
    yield requestModel_1.default.deleteMany({ vehicle: request.vehicle });
    const notificationData = {
        title: "Request Accepted Successfully",
        body: "The Admin has Accepted Your Vehicle Request",
    };
    yield (0, notification_1.sendNotificationToUser)(user.notificationToken, notificationData);
    res.status(200).json({
        status: "success",
        message: "Accept request successfully",
    });
}));
