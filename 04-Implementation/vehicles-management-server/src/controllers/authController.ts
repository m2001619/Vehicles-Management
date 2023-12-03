// express
import { Response, NextFunction } from "express";

// npm packages
import { promisify } from "util";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// project imports
import { config } from "../config/config";
import catchAsync from "./../utils/catchAsync";
import sendEmail from "./../utils/email";
import AppError from "./../utils/AppError";

// models
import User from "./../models/userModel";

// interfaces
import { ICostumeRequest } from "../constans/Interfaces";

/** Start Handler Functions **/
const signToken = (id: string): string => {
  const { jwtSecret, jwtExpiresIn } = config.jwt;
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
};

const createSendToken = (
  user: any,
  statusCode: number,
  res: Response
): Response => {
  const token = signToken(user._id);
  const jwtCookieExpiresIn = config.jwt.jwtCookieExpiresIn;

  const cookieOptions = {
    expires: new Date(Date.now() + jwtCookieExpiresIn * 60 * 60 * 1000),
    httpOnly: true,
    secure: false,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

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
  const hashToken = crypto.randomBytes(32).toString("hex");
  return crypto.createHash("sha256").update(hashToken).digest("hex");
};
/** End Handler Functions **/

/** Start Routes Functions **/
export const validateEmail = catchAsync(async (req, res, next) => {
  // 1) Get user based on posted email
  const user = await User.findOne({
    email: req.body.email,
  });
  if (user)
    return next(new AppError(`There is a user with this email address.`, 404));

  // 2) Generate the random Token
  const emailValidationToken = createEmailValidationToken();

  // 3) Send it to user's email
  const message = `Please use this code to validate your email:\n${emailValidationToken}`;

  try {
    await sendEmail({
      email: req.body.email,
      subject: "Your email validate code (valid for 10 minutes)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Code sent to email!",
      emailValidationToken,
    });
  } catch (error) {
    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

export const signup = catchAsync(async (req, res, next) => {
  // 1) If token is not correct
  if (req.body.token !== req.body.emailValidationToken)
    return next(new AppError("Code is invalid or has expired", 400));

  // 2) If validate email then create account
  await User.create(req.body);

  return res.status(200).json({
    status: "success",
    message: "You have signed up successfully. Please wait accept from admin.",
  });
});

export const login = catchAsync(
  async (req: ICostumeRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password)
      return next(new AppError("Please provide email and password.", 400));

    // 2) Check if user exists and password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user?.password))) {
      return next(new AppError("Incorrect email or password.", 401));
    }

    // 3) Check if the user is blocked by the admin
    if (user?.block)
      return next(
        new AppError("This user has been blocked by the admin.", 401)
      );

    // 4) Check if the admin has accepted the user
    if (user?.role === "pending-user")
      return next(new AppError("Please wait for accept from admin.", 401));

    // 5) If everything is ok, send token to the client
    createSendToken(user, 200, res);
  }
);

export const protect = catchAsync(
  async (req: ICostumeRequest, _res: Response, next: NextFunction) => {
    // 1) Getting token and check if it's there
    const { authorization } = req.headers;
    if (!authorization)
      return next(new AppError("Please provide a Token.", 401));

    const token = authorization.split(" ")[1];
    if (!token)
      return next(
        new AppError("You are not logged in! Please login to get access.", 401)
      );

    // 2) Verify token
    const jwtSecret = config.jwt.jwtSecret;
    const decoded = await promisify(jwt.verify)(
      token,
      // @ts-ignore
      jwtSecret
    );

    // 3) Check if user still exists
    // @ts-ignore
    const currentUser = await User.findById(decoded.id);
    if (!currentUser)
      next(
        new AppError("The user belonging to this code does not exist.", 401)
      );

    // 4) Check if user changed password after the token was issued
    // @ts-ignore
    if (currentUser?.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }

    // 5) Grant access to protected route
    req.user = currentUser;
    next();
  }
);

export const restrictTo = (...roles: string[]) => {
  return (req: ICostumeRequest, _res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You do not have permission to perform this action.", 403)
      );

    next();
  };
};

export const forgotPassword = catchAsync(
  async (req: ICostumeRequest, res: Response, next: NextFunction) => {
    // 1) Get user based on posted email
    const user = await User.findOne({
      email: req.body.email,
      role: req.body.role,
    });
    if (!user)
      return next(
        new AppError(
          `There is no ${
            req.body.role === "admin" ? "admin" : "user"
          } with this email address.`,
          404
        )
      );

    // 2) Generate the randomtoken
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const message = `Forgot your password? please use this code to reset your password: ${resetToken}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset code (valid for 10 minutes)",
        message,
      });

      res.status(200).json({
        status: "success",
        message: "Code sent to email!",
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          "There was an error sending the email. Try again later!",
          500
        )
      );
    }
  }
);

export const resetPassword = catchAsync(
  async (req: ICostumeRequest, res: Response, next: NextFunction) => {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.body.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) return next(new AppError("Code is invalid or has expired", 400));

    // 3) Update changedPasswordAt property for the user
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
  }
);

export const updatePassword = catchAsync(
  async (req: ICostumeRequest, res: Response, next: NextFunction) => {
    const body: {
      currentPassword: string;
      newPassword: string;
      newPasswordConfirm: string;
    } = req.body;

    // 1) Get user from collection
    const user = await User.findById(req.user.id).select("+password");

    // 2) Check if posted current password is correct
    if (
      !user ||
      !(await user.correctPassword(body.currentPassword, user.password))
    )
      return next(new AppError("Your current password is wrong.", 401));

    // 3) If so, update password
    user.password = body.newPassword;
    user.passwordConfirm = body.newPasswordConfirm;
    await user.save();

    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
  }
);
/** End Routes Functions **/
