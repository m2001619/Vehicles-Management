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
exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.restrictTo = exports.protect = exports.login = exports.signup = exports.validateEmail = void 0;
const util_1 = require("util");
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const userModel_1 = __importDefault(require("./../models/userModel"));
const catchAsync_1 = __importDefault(require("./../utils/catchAsync"));
const AppError_1 = __importDefault(require("./../utils/AppError"));
const email_1 = __importDefault(require("./../utils/email"));
const signToken = (id) => {
    const { jwtSecret, jwtExpiresIn } = config_1.config.jwt;
    return jsonwebtoken_1.default.sign({ id }, jwtSecret, {
        expiresIn: jwtExpiresIn,
    });
};
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const jwtCookieExpiresIn = config_1.config.jwt.jwtCookieExpiresIn;
    const cookieOptions = {
        expires: new Date(Date.now() + jwtCookieExpiresIn * 60 * 60 * 1000),
        httpOnly: true,
        secure: false,
    };
    if (process.env.NODE_ENV === "production")
        cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
    // To remove password from the response body
    user.password = undefined;
    return res.status(statusCode).json({
        status: "success",
        token,
        data: user,
    });
};
const createEmailValidationToken = function () {
    const hashToken = crypto_1.default.randomBytes(32).toString("hex");
    return crypto_1.default.createHash("sha256").update(hashToken).digest("hex");
};
exports.validateEmail = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Get user based on posted email
    const user = yield userModel_1.default.findOne({
        email: req.body.email,
    });
    if (user)
        return next(new AppError_1.default(`There is a user with this email address.`, 404));
    // 2) Generate the random Token
    const emailValidationToken = createEmailValidationToken();
    // 3) Send it to user's email
    const message = `Please use this code to validate your email:\n${emailValidationToken}`;
    try {
        yield (0, email_1.default)({
            email: req.body.email,
            subject: "Your email validate code (valid for 10 minutes)",
            message,
        });
        res.status(200).json({
            status: "success",
            message: "Code sent to email!",
            emailValidationToken,
        });
    }
    catch (error) {
        return next(new AppError_1.default("There was an error sending the email. Try again later!", 500));
    }
}));
exports.signup = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) If token is not correct
    if (req.body.token !== req.body.emailValidationToken)
        return next(new AppError_1.default("Code is invalid or has expired", 400));
    // 2) If validate email then create account
    yield userModel_1.default.create(req.body);
    return res.status(200).json({
        status: "success",
        message: "You have signed up successfully. Please wait accept from admin.",
    });
}));
exports.login = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // 1) Check if email and password exist
    if (!email || !password)
        return next(new AppError_1.default("Please provide email and password.", 400));
    // 2) Check if user exists and password is correct
    const user = yield userModel_1.default.findOne({ email }).select("+password");
    if (!user || !(yield user.correctPassword(password, user === null || user === void 0 ? void 0 : user.password))) {
        return next(new AppError_1.default("Incorrect email or password.", 401));
    }
    // 3) Check if the user is blocked by the admin
    if (user === null || user === void 0 ? void 0 : user.block)
        return next(new AppError_1.default("This user has been blocked by the admin.", 401));
    // 4) Check if the admin has accepted the user
    if ((user === null || user === void 0 ? void 0 : user.role) === "pending-user")
        return next(new AppError_1.default("Please wait for accept from admin.", 401));
    // 5) If everything is ok, send token to the client
    createSendToken(user, 200, res);
}));
exports.protect = (0, catchAsync_1.default)((req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Getting token and check if it's there
    const { authorization } = req.headers;
    if (!authorization)
        return next(new AppError_1.default("Please provide a Token.", 401));
    const token = authorization.split(" ")[1];
    if (!token)
        return next(new AppError_1.default("You are not logged in! Please login to get access.", 401));
    // 2) Verify token
    const jwtSecret = config_1.config.jwt.jwtSecret;
    const decoded = yield (0, util_1.promisify)(jsonwebtoken_1.default.verify)(token, 
    // @ts-ignore
    jwtSecret);
    // 3) Check if user still exists
    // @ts-ignore
    const currentUser = yield userModel_1.default.findById(decoded.id);
    if (!currentUser)
        next(new AppError_1.default("The user belonging to this code does not exist.", 401));
    // 4) Check if user changed password after the token was issued
    // @ts-ignore
    if (currentUser === null || currentUser === void 0 ? void 0 : currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError_1.default("User recently changed password! Please log in again.", 401));
    }
    // 5) Grant access to protected route
    req.user = currentUser;
    next();
}));
const restrictTo = (...roles) => {
    return (req, _res, next) => {
        if (!roles.includes(req.user.role))
            return next(new AppError_1.default("You do not have permission to perform this action.", 403));
        next();
    };
};
exports.restrictTo = restrictTo;
exports.forgotPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Get user based on posted email
    const user = yield userModel_1.default.findOne({
        email: req.body.email,
        role: req.body.role,
    });
    if (!user)
        return next(new AppError_1.default(`There is no ${req.body.role === "admin" ? "admin" : "user"} with this email address.`, 404));
    // 2) Generate the randomtoken
    const resetToken = user.createPasswordResetToken();
    yield user.save({ validateBeforeSave: false });
    // 3) Send it to user's email
    const message = `Forgot your password? please use this code to reset your password: ${resetToken}.\nIf you didn't forget your password, please ignore this email!`;
    try {
        yield (0, email_1.default)({
            email: user.email,
            subject: "Your password reset code (valid for 10 minutes)",
            message,
        });
        res.status(200).json({
            status: "success",
            message: "Code sent to email!",
        });
    }
    catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        yield user.save({ validateBeforeSave: false });
        return next(new AppError_1.default("There was an error sending the email. Try again later!", 500));
    }
}));
exports.resetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Get user based on the token
    const hashedToken = crypto_1.default
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    const user = yield userModel_1.default.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    // 2) If token has not expired, and there is user, set the new password
    if (!user)
        return next(new AppError_1.default("Code is invalid or has expired", 400));
    // 3) Update changedPasswordAt property for the user
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    yield user.save();
    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
}));
exports.updatePassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    // 1) Get user from collection
    const user = yield userModel_1.default.findById(req.user.id).select("+password");
    // 2) Check if posted current password is correct
    if (!user ||
        !(yield user.correctPassword(body.currentPassword, user.password)))
        return next(new AppError_1.default("Your current password is wrong.", 401));
    // 3) If so, update password
    user.password = body.newPassword;
    user.passwordConfirm = body.newPasswordConfirm;
    yield user.save();
    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
}));
