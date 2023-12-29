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
exports.setNotificationToken = exports.deleteMe = exports.updateMe = exports.getMe = exports.acceptPendingUser = exports.getPendingUsers = exports.blockUser = exports.activeUser = exports.deleteUser = exports.getUser = exports.getAllUsers = void 0;
// npm packages
const formidable_1 = require("formidable");
// project imports
const handlerFactory_1 = require("../utils/handlerFactory");
const handlerFormData_1 = require("../utils/handlerFormData");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const email_1 = __importDefault(require("../utils/email"));
const AppError_1 = __importDefault(require("../utils/AppError"));
// models
const userModel_1 = __importDefault(require("./../models/userModel"));
/** Start Routes Functions **/
exports.getAllUsers = (0, handlerFactory_1.getAll)(userModel_1.default, () => ({ role: { $ne: "admin" } }));
exports.getUser = (0, handlerFactory_1.getOne)(userModel_1.default);
exports.deleteUser = (0, handlerFactory_1.deleteOne)(userModel_1.default);
exports.activeUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(req.params.userId);
    if (!(user === null || user === void 0 ? void 0 : user.block))
        return next(new AppError_1.default("This user is not blocked", 401));
    yield userModel_1.default.findByIdAndUpdate(req.params.userId, {
        block: false,
        active: true,
    });
    return res.status(200).json({
        status: `success`,
        message: "the user is active now.",
    });
}));
exports.blockUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(req.params.userId);
    if (user === null || user === void 0 ? void 0 : user.block)
        return next(new AppError_1.default("This user is already blocked", 401));
    yield userModel_1.default.findByIdAndUpdate(req.params.userId, {
        block: true,
        active: false,
    });
    return res.status(200).json({
        status: `success`,
        message: "the user blocked now.",
    });
}));
exports.getPendingUsers = (0, handlerFactory_1.getAll)(userModel_1.default, () => ({
    role: "pending-user",
}));
exports.acceptPendingUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const userData = yield userModel_1.default.findById(userId);
    if ((userData === null || userData === void 0 ? void 0 : userData.role) !== "pending-user")
        next(new AppError_1.default("This user is already Accepted By Admin", 400));
    const user = yield userModel_1.default.findByIdAndUpdate(userId, { role: "user" });
    yield (0, email_1.default)({
        email: user.email,
        subject: "Your Account is Active Now",
        message: "Admin Accept Your Sign Up, You can use the app now",
    });
    return res.status(200).json({
        message: "User Accepted Successfully",
    });
}));
exports.getMe = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield userModel_1.default.findById(req.user.id);
    if (!data) {
        return next(new AppError_1.default("No document found with this Id", 404));
    }
    res.status(200).json({
        status: "success",
        data,
    });
}));
exports.updateMe = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Create Error if user post password data
    const { password, passwordConfirm } = req.body;
    if (password || passwordConfirm)
        next(new AppError_1.default("This route is not for password updates, Please use /updateMyPassword", 401));
    // 2) Handle form Data and send the response
    const form = (0, formidable_1.formidable)({});
    form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            next(err);
            return;
        }
        const formFields = yield (0, handlerFormData_1.handleFormFields)(fields);
        // 3) Update user document
        yield userModel_1.default.findByIdAndUpdate(req.user._id, formFields, {
            new: true,
            runValidators: true,
        });
        const formFiles = yield (0, handlerFormData_1.handleFormFiles)(files, next);
        const updatedUser = yield userModel_1.default.findByIdAndUpdate(req.user._id, formFiles);
        res.status(200).json({
            status: "success",
            data: updatedUser,
        });
    }));
}));
exports.deleteMe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Update user document
    yield userModel_1.default.findByIdAndUpdate(req.user._id, { active: false });
    res.status(204).json({
        status: "success",
        data: null,
    });
}));
exports.setNotificationToken = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.token)
        next(new AppError_1.default("No Notification Token Found In Request's Body", 401));
    yield userModel_1.default.findByIdAndUpdate(req.user._id, {
        notificationToken: req.body.token,
    });
    res.status(200).json({
        status: "success",
        message: "Token Stored Successfully",
    });
}));
/** End Routes Functions **/
