// express
import { Response, NextFunction } from "express";

// project imports
import { createReservation } from "./reservationArchiveController";
import { deleteOne, updateOne, getOne, getAll } from "../utils/handlerFactory";
import {
  sendNotificationToAdmin,
  sendNotificationToUser,
} from "../utils/notification";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

// models
import RequestModel from "../models/requestModel";
import UserModel from "../models/userModel";
import VehicleModel from "../models/vehicleModel";

// interfaces
import {
  ICostumeRequest,
  IRequest,
  IReservationArchive,
} from "../constans/Interfaces";

/** Start Handler Functions **/
const deleteFromReference = async (request: IRequest) => {
  await UserModel.findByIdAndUpdate(request.user, { $unset: { request: "" } });
  await VehicleModel.findByIdAndUpdate(request.vehicle, {
    $pull: { requests: request.id },
  });
};
/** End Handler Functions **/

/** Start Routes Functions **/
export const getAllRequests = getAll(RequestModel);
export const getVehicleRequests = getAll(
  RequestModel,
  (req) => ({
    vehicle: req.params?.vehicleId,
  }),
  undefined,
  [{ path: "user", select: "name" }]
);
export const getRequest = getOne(RequestModel);
export const updateRequest = updateOne(RequestModel);

export const deleteRequest = deleteOne(RequestModel, (data) =>
  deleteFromReference(data)
);

export const requestVehicle = catchAsync(
  async (req: ICostumeRequest, res: Response, next: NextFunction) => {
    const request = await RequestModel.findOne({ user: req.user.id });
    const vehicleId = req.params.vehicleId;
    const userId = req.user.id;
    if (request) {
      const errorMessage =
        `${request?.vehicle}` === vehicleId
          ? "You made a request for this vehicle already"
          : "You made a request for another vehicle";
      return next(new AppError(errorMessage, 400));
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

    const newRequest = await RequestModel.create(data);
    await UserModel.findByIdAndUpdate(userId, { request: newRequest?._id });
    const vehicle = await VehicleModel.findByIdAndUpdate(vehicleId, {
      $push: { requests: newRequest?._id },
    });

    const notificationData = {
      title: "Vehicle Request",
      body: `The user has asked to request vehicle: ${vehicle.make} ${vehicle.model} ${vehicle.year}`,
    };

    await sendNotificationToAdmin(notificationData);

    res.status(200).json({
      status: "success",
      message: "Send request successfully, Please wait accept from admin",
      data: newRequest,
    });
  }
);

export const acceptRequest = catchAsync(
  async (req: ICostumeRequest, res: Response, next: NextFunction) => {
    const requestId = req.params.id;

    const request = await RequestModel.findById(requestId);

    if (!request) {
      return next(new AppError("ICostumeRequest not found", 404));
    }

    const vehicle = await VehicleModel.findById(request?.vehicle);
    const user = await UserModel.findById(request?.user);

    const odo = vehicle.mileage;
    const garageId = vehicle.garage;

    // @ts-ignore
    const archiveData: IReservationArchive = {
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

    await createReservation(archiveData);

    const requests = await RequestModel.find({ vehicle: request.vehicle });
    requests.forEach((i) => deleteFromReference(i));
    await RequestModel.deleteMany({ vehicle: request.vehicle });
    await VehicleModel.findByIdAndUpdate(vehicle._id, {
      usingStatus: "in-use",
    });

    const notificationData = {
      title: "Request Accepted Successfully",
      body: "The Admin has Accepted Your Vehicle Request",
    };
    await sendNotificationToUser(user.notificationToken, notificationData);

    res.status(200).json({
      status: "success",
      message: "Accept request successfully",
    });
  }
);
/** End Routes Functions **/
