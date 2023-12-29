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
// mongoose
const mongoose_1 = __importDefault(require("mongoose"));
// npm packages
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
// project imports
const config_1 = require("../config/config");
// interfaces
const mongoose_2 = require("mongoose");
/** Start Schema **/
const userSchema = new mongoose_2.Schema({
    name: {
        type: String,
        required: [true, "User should has name"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        validate: [validator_1.default.isEmail, "Please provide a valid email"],
    },
    phoneNumber: {
        type: String,
        required: [true, "Please provide your phone number"],
        unique: true,
        validate: [
            validator_1.default.isMobilePhone,
            "Please provide a valid phone number",
        ],
    },
    photo: String,
    role: {
        type: String,
        enum: ["user", "admin", "pending-user"],
        default: "pending-user",
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm a password"],
        validate: {
            // This only works on CREATE and SAVE!!
            validator: function (el) {
                return el === this.password;
            },
            message: "Passwords are not the same!",
        },
    },
    passwordChangedAt: {
        type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Number,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    block: {
        type: Boolean,
        default: false,
    },
    vehicle: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Vehicle",
    },
    likeVehicles: {
        type: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Vehicle",
            },
        ],
        default: [],
    },
    request: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Request",
    },
    reservationArchive: {
        type: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "ReservationArchive",
            },
        ],
        default: [],
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
    notificationToken: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
/** End Schema **/
/** Start Schema Middleware Functions **/
// Convert the Password to Hash Mode in the Signup
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Only run this function if password was actually modified
        if (!this.isModified("password"))
            return next();
        // Hash the password with cost of 12
        this.password = yield bcryptjs_1.default.hash(this.password, 12);
        // Delete passwordConfirm field
        this.passwordConfirm = undefined;
        next();
    });
});
// Handle the Date of the last Password changed
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Only run this function if password was actually modified
        if (!this.isModified("password") || this.isNew)
            return next();
        // Update changePasswordAt property for the user
        this.passwordChangedAt = new Date(Date.now() - 1000);
        next();
    });
});
// Check if the password is correct
userSchema.methods.correctPassword = function (candidatePassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(candidatePassword, userPassword);
    });
};
// Check if the password changed when the token is active
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTime = Math.floor(this.passwordChangedAt.getTime() / 1000);
        return changedTime > JWTTimestamp;
    }
    // False mean not change
    return false;
};
// Create token for reset password
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
/** End Schema Middleware Functions **/
/** Start Mongoose Functions **/
const User = mongoose_1.default.model("User", userSchema);
/** End Mongoose Functions **/
exports.default = User;
/** Start Handler Functions **/
// Create Default Admin
mongoose_1.default
    .model("User", userSchema)
    .findOne({ role: "admin" })
    .then((data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data) {
        console.log("Default admin already created.");
    }
    else {
        try {
            yield mongoose_1.default.model("user", userSchema).create(config_1.config.adminData);
            console.log("Default admin created successfully");
        }
        catch (e) {
            console.log("Error create default admin");
            console.log(e);
        }
    }
}))
    .catch(() => console.log("Error create default admin"));
/** End Handler Functions **/
