// mongoose
import mongoose, { Model } from "mongoose";

// npm packages
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// project imports
import { config } from "../config/config";

// interfaces
import { Schema } from "mongoose";
import { IUser } from "../constans/Interfaces";

/** Start Schema **/
const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "User should has name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please provide your phone number"],
      unique: true,
      validate: [
        validator.isMobilePhone,
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
        validator: function (el: string) {
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    likeVehicles: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Vehicle",
        },
      ],
      default: [],
    },
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
    },
    reservationArchive: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ReservationArchive",
        },
      ],
      default: [],
    },
    fuelBill: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
/** End Schema **/

/** Start Schema Middleware Functions **/
// Convert the Password to Hash Mode in the Signup
userSchema.pre<IUser>("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

// Handle the Date of the last Password changed
userSchema.pre<IUser>("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password") || this.isNew) return next();

  // Update changePasswordAt property for the user
  this.passwordChangedAt = new Date(Date.now() - 1000);

  next();
});

// Check if the password is correct
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if the password changed when the token is active
userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTime = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return changedTime > JWTTimestamp;
  }

  // False mean not change
  return false;
};

// Create token for reset password
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
/** End Schema Middleware Functions **/

/** Start Mongoose Functions **/
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
/** End Mongoose Functions **/

export default User;

/** Start Handler Functions **/
// Create Default Admin
mongoose
  .model("User", userSchema)
  .findOne({ role: "admin" })
  .then(async (data) => {
    if (data) {
      console.log("Default admin already created.");
    } else {
      try {
        await mongoose.model("user", userSchema).create(config.adminData);
        console.log("Default admin created successfully");
      } catch (e) {
        console.log("Error create default admin");
        console.log(e);
      }
    }
  })
  .catch(() => console.log("Error create default admin"));
/** End Handler Functions **/
