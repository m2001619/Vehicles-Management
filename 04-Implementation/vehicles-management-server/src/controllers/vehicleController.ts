// express
import { Response, NextFunction } from "express";

// project imports
import { ReservationArchiveDeleteFromReference } from "./reservationArchiveController";
import {
  getAll,
  getOne,
  deleteOne,
  createOne,
  updateOne,
  blockActiveOne,
} from "../utils/handlerFactory";
import {
  sendNotificationToAdmin,
  sendNotificationToUser,
} from "../utils/notification";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

// models
import VehicleModel from "../models/vehicleModel";
import GarageModel from "../models/garageModel";
import UserModel from "../models/userModel";
import ReservationArchiveModel from "../models/reservationArchiveModel";
import Garage from "../models/garageModel";

// interfaces
import { ICostumeRequest, IVehicle } from "../constans/Interfaces";

// constants
import { statuses } from "../constans/Interfaces";

/** Start Handler Functions **/
const vehicleDeleteFromReference = async (vehicleData: IVehicle) => {
  const { reservationArchive, garage, likedUser } = vehicleData;
  await Garage.findByIdAndUpdate(garage, {
    $pull: { reservationArchive: vehicleData.id },
  });
  for (let archiveId of reservationArchive) {
    const archive = await ReservationArchiveModel.findById(archiveId);
    await ReservationArchiveDeleteFromReference(archive);
  }
  for (let userId of likedUser) {
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { likeVehicles: vehicleData.id },
    });
  }
};
/** End Handler Functions **/

/** Start Routes Functions **/
export const getAvailableVehicles = getAll(VehicleModel, (req) => ({
  user: null,
  status:
    req.user.role === "user" ? "ACTIVE" : { $in: Object.values(statuses) },
}));

export const getRequestedVehicles = getAll(VehicleModel, () => ({
  requests: { $ne: [] },
}));

export const getGarageVehicles = getAll(VehicleModel, (req) => ({
  garage: req.params.garageId,
  status:
    req.user.role === "user" ? "ACTIVE" : { $in: Object.values(statuses) },
}));

export const getAllVehicles = getAll(VehicleModel, (req) => ({
  status:
    req.user.role === "user" ? "ACTIVE" : { $in: Object.values(statuses) },
}));
export const getVehicle = getOne(VehicleModel);

export const blockActiveVehicle = blockActiveOne(VehicleModel);

export const deleteVehicle = deleteOne(
  VehicleModel,
  vehicleDeleteFromReference
);

export const createVehicle = createOne(VehicleModel, async (formData, data) => {
  await GarageModel.findByIdAndUpdate(formData.garage, {
    $push: { vehicles: data?._id },
  });
});

export const updateVehicle = updateOne(VehicleModel, async (req, data) => {
  if (req.body.garage) {
    await GarageModel.findByIdAndUpdate(data?.garage, {
      $pull: { vehicles: data?._id },
    });
    await GarageModel.findByIdAndUpdate(req.body.garage, {
      $push: { vehicles: data?._id },
    });
  }
});

export const getAskReturnVehicles = getAll(VehicleModel, () => {
  return {
    reservationArchive: { $elemMatch: { status: "ask-to-return" } }, //{$match: {_id: id, 'data.date': {$gte: from, $lte: to}}}
  };
});

export const acceptReturnVehicle = catchAsync(async (req, res, next) => {
  const vehicleId = req.params.id;

  const vehicle = await VehicleModel.findById(vehicleId);
  const userId = vehicle.user;

  if (!userId) {
    return next(new AppError("This vehicle is not in using mode.", 404));
  }

  await VehicleModel.findByIdAndUpdate(vehicleId, {
    $unset: { user: "" },
    usingStatus: "available",
  });

  const user = await UserModel.findByIdAndUpdate(userId, {
    $unset: { vehicle: "" },
  });

  await ReservationArchiveModel.findOneAndUpdate(
    {
      vehicle: vehicleId,
      user: vehicle.user,
      status: "ask-to-return",
    },
    { status: "returned" }
  );

  const notificationData = {
    title: "Vehicle Returned Successfully",
    body: "The Admin has Accepted Your Vehicle Return's Request",
  };

  await sendNotificationToUser(user.notificationToken, notificationData);

  res.status(200).json({
    status: "success",
    message: "Vehicles returned successfully",
  });
});

export const askToReturnVehicle = catchAsync(
  async (req: ICostumeRequest, res: Response, next: NextFunction) => {
    const vehicleId = req.params.id;
    const userId = req.user.id;
    const { odo } = req.body;

    const vehicle = await VehicleModel.findById(vehicleId);
    if (`${vehicle.user}` !== userId) {
      return next(
        new AppError("This vehicle has been in use by another user", 402)
      );
    }

    await ReservationArchiveModel.findOneAndUpdate(
      {
        vehicle: vehicleId,
        user: userId,
        status: "in-use",
      },
      {
        status: "ask-to-return",
        "arrival.time": new Date(),
        "arrival.odo": odo,
      }
    );

    await VehicleModel.findByIdAndUpdate(vehicleId, {
      usingStatus: "ask-to-return",
    });

    const notificationData = {
      title: "Vehicle Ask To Return",
      body: `The user has asked to return vehicle: ${vehicle.make} ${vehicle.model} ${vehicle.year}`,
    };

    await sendNotificationToAdmin(notificationData);

    res.status(200).json({
      status: "success",
      message: "Send request successfully, Please wait accept from admin",
    });
  }
);

export const reUseVehicle = catchAsync(async (req, res, next) => {
  const vehicleId = req.params.id;
  const userId = req.user.id;

  const reservation = await ReservationArchiveModel.findOneAndUpdate(
    {
      vehicle: vehicleId,
      user: userId,
      status: "ask-to-return",
    },
    {
      status: "in-use",
    }
  );

  if (!reservation) {
    return next(new AppError("Return's request has accepted by admin", 400));
  }

  res.status(200).json({
    status: "success",
    message: "Return's request canceled successfully.",
  });
});

export const likeVehicle = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const vehicleId = req.params.id;

  const user = await UserModel.findByIdAndUpdate(userId, {
    $push: { likeVehicles: vehicleId },
  });

  await VehicleModel.findByIdAndUpdate(vehicleId, {
    $push: { likedUser: userId },
  });

  res.status(200).json({
    message: "Liked Successfully",
    likeVehicles: [...user.likeVehicles, vehicleId],
  });
});

export const dislikeVehicle = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const vehicleId = req.params.id;

  const user = await UserModel.findByIdAndUpdate(userId, {
    $pull: { likeVehicles: vehicleId },
  });

  await VehicleModel.findByIdAndUpdate(vehicleId, {
    $pull: { likedUser: userId },
  });

  res.status(200).json({
    message: "disLiked Successfully",
    likeVehicles: user.likeVehicles.filter((i) => `${i}` !== vehicleId),
  });
});

export const getUserLikeVehicles = getAll(VehicleModel, (req) => ({
  likedUser: { $in: req.params.userId },
  status:
    req.user.role === "user" ? "ACTIVE" : { $in: Object.values(statuses) },
}));

export const getNearlyVehicle = catchAsync(async (req, res, next) => {
  const { distance, coordinates, unit } = req.params;
  const [lat, lng] = coordinates.split(",");

  const radius = unit === "mi" ? +distance / 3963.2 : +distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitutr and longitude in the format lat,lng",
        400
      )
    );
  }

  const data = await VehicleModel.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    status:
      req.user.role === "user" ? "ACTIVE" : { $in: Object.values(statuses) },
  }).exec();

  res.status(200).json({
    message: "connected Successfully",
    result: data.length,
    data,
  });
});
/** End Routes Functions **/
