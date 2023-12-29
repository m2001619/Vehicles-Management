// npm packages
import { formidable } from "formidable";

// project imports
import { getAll, getOne, deleteOne } from "../utils/handlerFactory";
import { handleFormFields, handleFormFiles } from "../utils/handlerFormData";
import catchAsync from "../utils/catchAsync";
import sendEmail from "../utils/email";
import AppError from "../utils/AppError";

// models
import User from "./../models/userModel";

/** Start Routes Functions **/
export const getAllUsers = getAll(User, () => ({ role: { $ne: "admin" } }));
export const getUser = getOne(User);
export const deleteUser = deleteOne(User);
export const activeUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user?.block) return next(new AppError("This user is not blocked", 401));

  await User.findByIdAndUpdate(req.params.userId, {
    block: false,
    active: true,
  });

  return res.status(200).json({
    status: `success`,
    message: "the user is active now.",
  });
});

export const blockUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (user?.block)
    return next(new AppError("This user is already blocked", 401));

  await User.findByIdAndUpdate(req.params.userId, {
    block: true,
    active: false,
  });

  return res.status(200).json({
    status: `success`,
    message: "the user blocked now.",
  });
});
export const getPendingUsers = getAll(User, () => ({
  role: "pending-user",
}));

export const acceptPendingUser = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  const userData = await User.findById(userId);

  if (userData?.role !== "pending-user")
    next(new AppError("This user is already Accepted By Admin", 400));

  const user = await User.findByIdAndUpdate(userId, { role: "user" });

  await sendEmail({
    email: user.email,
    subject: "Your Account is Active Now",
    message: "Admin Accept Your Sign Up, You can use the app now",
  });

  return res.status(200).json({
    message: "User Accepted Successfully",
  });
});

export const getMe = catchAsync(async (req, res, next) => {
  const data = await User.findById(req.user.id);

  if (!data) {
    return next(new AppError("No document found with this Id", 404));
  }

  res.status(200).json({
    status: "success",
    data,
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create Error if user post password data
  const { password, passwordConfirm } = req.body;

  if (password || passwordConfirm)
    next(
      new AppError(
        "This route is not for password updates, Please use /updateMyPassword",
        401
      )
    );

  // 2) Handle form Data and send the response
  const form = formidable({});
  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    const formFields = await handleFormFields(fields);

    // 3) Update user document
    await User.findByIdAndUpdate(req.user._id, formFields, {
      new: true,
      runValidators: true,
    });

    const formFiles = await handleFormFiles(files, next);

    const updatedUser = await User.findByIdAndUpdate(req.user._id, formFiles);

    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  });
});

export const deleteMe = catchAsync(async (req, res) => {
  // 1) Update user document
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const setNotificationToken = catchAsync(async (req, res, next) => {
  if (!req.body.token)
    next(new AppError("No Notification Token Found In Request's Body", 401));
  await User.findByIdAndUpdate(req.user._id, {
    notificationToken: req.body.token,
  });
  res.status(200).json({
    status: "success",
    message: "Token Stored Successfully",
  });
});
/** End Routes Functions **/
