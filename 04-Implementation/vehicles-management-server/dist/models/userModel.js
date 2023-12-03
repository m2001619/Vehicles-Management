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
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const userSchema = new mongoose_1.Schema({
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
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
// Hide the blocked and not Accepted Users and populate references
userSchema.pre(/^find/, function (next) {
    //@ts-ignore
    this.find({ active: { $ne: false } });
    next();
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
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
