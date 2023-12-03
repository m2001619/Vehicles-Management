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
exports.getNearlyVehicle = exports.getUserLikeVehicles = exports.dislikeVehicle = exports.likeVehicle = exports.reUseVehicle = exports.askToReturnVehicle = exports.acceptReturnVehicle = exports.getAskReturnVehicles = exports.updateVehicle = exports.createVehicle = exports.deleteVehicle = exports.getVehicle = exports.getAllVehicles = exports.getGarageVehicles = exports.getAvailableVehicles = void 0;
const handlerFactory_1 = require("./handlerFactory");
const vehicleModel_1 = __importDefault(require("../models/vehicleModel"));
const garageModel_1 = __importDefault(require("../models/garageModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const reservationArchiveModel_1 = __importDefault(require("../models/reservationArchiveModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const notification_1 = require("../utils/notification");
// Access For User And Admin
exports.getAvailableVehicles = (0, handlerFactory_1.getAll)(vehicleModel_1.default, () => ({
    user: null,
}));
exports.getGarageVehicles = (0, handlerFactory_1.getAll)(vehicleModel_1.default, (req) => ({
    garage: req.params.garageId,
}));
// Only access for admin
exports.getAllVehicles = (0, handlerFactory_1.getAll)(vehicleModel_1.default);
exports.getVehicle = (0, handlerFactory_1.getOne)(vehicleModel_1.default);
exports.deleteVehicle = (0, handlerFactory_1.deleteOne)(vehicleModel_1.default);
exports.createVehicle = (0, handlerFactory_1.createOne)(vehicleModel_1.default, (formData, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield garageModel_1.default.findByIdAndUpdate(formData.garage, {
        $push: { vehicles: data === null || data === void 0 ? void 0 : data._id },
    });
}));
exports.updateVehicle = (0, handlerFactory_1.updateOne)(vehicleModel_1.default, (req, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.garage) {
        yield garageModel_1.default.findByIdAndUpdate(data === null || data === void 0 ? void 0 : data.garage, {
            $pull: { vehicles: data === null || data === void 0 ? void 0 : data._id },
        });
        yield garageModel_1.default.findByIdAndUpdate(req.body.garage, {
            $push: { vehicles: data === null || data === void 0 ? void 0 : data._id },
        });
    }
}));
exports.getAskReturnVehicles = (0, handlerFactory_1.getAll)(reservationArchiveModel_1.default, () => {
    return {
        status: "ask-to-return",
    };
});
exports.acceptReturnVehicle = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vehicleId = req.params.id;
    const vehicle = yield vehicleModel_1.default.findById(vehicleId);
    const userId = vehicle.user;
    if (!userId) {
        return next(new AppError_1.default("This vehicle is not in using mode.", 404));
    }
    yield vehicleModel_1.default.findByIdAndUpdate(vehicleId, { $unset: { user: "" } });
    const user = yield userModel_1.default.findByIdAndUpdate(userId, {
        $unset: { vehicle: "" },
    });
    yield reservationArchiveModel_1.default.findOneAndUpdate({
        vehicle: vehicleId,
        user: vehicle.user,
        status: "ask-to-return",
    }, { status: "returned" });
    const notificationData = {
        title: "Vehicle Returned Successfully",
        body: "The Admin has Accepted Your Vehicle Return's Request",
    };
    yield (0, notification_1.sendNotificationToUser)(user.notificationToken, notificationData);
    res.status(200).json({
        status: "success",
        message: "Vehicles returned successfully",
    });
}));
exports.askToReturnVehicle = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vehicleId = req.params.id;
    const userId = req.user.id;
    const { odo } = req.body;
    const vehicle = yield vehicleModel_1.default.findById(vehicleId);
    if (`${vehicle.user}` !== userId) {
        return next(new AppError_1.default("This vehicle has been in use by another user", 402));
    }
    yield reservationArchiveModel_1.default.findOneAndUpdate({
        vehicle: vehicleId,
        user: userId,
        status: "in-use",
    }, {
        status: "ask-to-return",
        "arrival.time": new Date(),
        "arrival.odo": odo,
    });
    res.status(200).json({
        status: "success",
        message: "Send request successfully, Please wait accept from admin",
    });
}));
exports.reUseVehicle = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vehicleId = req.params.id;
    const userId = req.user.id;
    const reservation = yield reservationArchiveModel_1.default.findOneAndUpdate({
        vehicle: vehicleId,
        user: userId,
        status: "ask-to-return",
    }, {
        status: "in-use",
    });
    if (!reservation) {
        return next(new AppError_1.default("Return's request has accepted by admin", 400));
    }
    res.status(200).json({
        status: "success",
        message: "Return's request canceled successfully .",
    });
}));
exports.likeVehicle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const vehicleId = req.params.id;
    const user = yield userModel_1.default.findByIdAndUpdate(userId, {
        $push: { likeVehicles: vehicleId },
    });
    yield vehicleModel_1.default.findByIdAndUpdate(vehicleId, {
        $push: { likedUser: userId },
    });
    res.status(200).json({
        message: "Liked Successfully",
        likeVehicles: [...user.likeVehicles, vehicleId],
    });
}));
exports.dislikeVehicle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const vehicleId = req.params.id;
    const user = yield userModel_1.default.findByIdAndUpdate(userId, {
        $pull: { likeVehicles: vehicleId },
    });
    yield vehicleModel_1.default.findByIdAndUpdate(vehicleId, {
        $pull: { likedUser: userId },
    });
    res.status(200).json({
        message: "disLiked Successfully",
        likeVehicles: user.likeVehicles.filter((i) => `${i}` !== vehicleId),
    });
}));
exports.getUserLikeVehicles = (0, handlerFactory_1.getAll)(vehicleModel_1.default, (req) => ({
    likedUser: { $in: req.params.userId },
}));
exports.getNearlyVehicle = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { distance, coordinates, unit } = req.params;
    const [lat, lng] = coordinates.split(",");
    const radius = unit === "mi" ? +distance / 3963.2 : +distance / 6378.1;
    if (!lat || !lng) {
        next(new AppError_1.default("Please provide latitutr and longitude in the format lat,lng", 400));
    }
    const data = yield vehicleModel_1.default.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    }).exec();
    res.status(200).json({
        message: "connected Successfully",
        result: data.length,
        data
    });
}));
