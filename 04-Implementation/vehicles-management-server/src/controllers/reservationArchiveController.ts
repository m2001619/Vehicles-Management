// project imports
import { fuelBillDeleteFromReference } from "./fuelBillController";
import { getAll, getOne, deleteOne } from "../utils/handlerFactory";
import catchAsync from "../utils/catchAsync";

// models
import User from "../models/userModel";
import Garage from "../models/garageModel";
import Vehicle from "../models/vehicleModel";
import ReservationArchive from "../models/reservationArchiveModel";
import FuelBillModel from "../models/fuelBillModel";

// interfaces
import { IReservationArchive } from "../constans/Interfaces";

/** Start Handler Functions **/
export const ReservationArchiveDeleteFromReference = async (
  archiveData: IReservationArchive
) => {
  const { user, vehicle, garage, fuelBill } = archiveData;
  await User.findByIdAndUpdate(user, {
    $pull: { reservationArchive: archiveData.id },
  });
  await Vehicle.findByIdAndUpdate(vehicle, {
    $pull: { reservationArchive: archiveData.id },
  });
  await Garage.findByIdAndUpdate(garage, {
    $pull: { reservationArchive: archiveData.id },
  });
  for (let bill of fuelBill) {
    const fuelBill = await FuelBillModel.findById(bill);
    await fuelBillDeleteFromReference(fuelBill);
  }
};
/** End Handler Functions **/

/** Start Routes Functions **/
export const createReservation = async (archiveData: IReservationArchive) => {
  const { user, vehicle, garage } = archiveData;
  const reservationArchive = await ReservationArchive.create(archiveData);

  await User.findByIdAndUpdate(user, {
    vehicle,
    $push: { reservationArchive: reservationArchive?._id },
  });

  await Garage.findByIdAndUpdate(garage, {
    $push: { reservationArchive: reservationArchive?._id },
  });

  await Vehicle.findByIdAndUpdate(vehicle, {
    requestedUsers: [],
    user,
    $push: { reservationArchive: reservationArchive?._id },
  });
};

export const getAllReservations = getAll(
  ReservationArchive,
  undefined,
  undefined,
  [
    {
      path: "garage user",
      select: "name photo",
    },
    { path: "vehicle", select: "make model year images" },
  ]
);
export const getReservation = getOne(ReservationArchive);
export const getMyArchiveReservations = getAll(ReservationArchive, (req) => ({
  user: req.user.id,
  status: "returned",
}));
export const getMyActiveReservation = catchAsync(async (req, res) => {
  const myActiveReservation = await ReservationArchive.findOne({
    user: req.user.id,
    $or: [{ status: "ask-to-return" }, { status: "in-use" }],
  });

  res.status(200).json({
    status: "success",
    data: myActiveReservation,
  });
});

export const updateReservation = catchAsync(async (req, res) => {
  const data = await ReservationArchive.findByIdAndUpdate(
    req.params.id,
    req.body
  );

  res.status(200).json({
    status: "success",
    data,
  });
});

export const deleteReservation = deleteOne(ReservationArchive, (data) =>
  ReservationArchiveDeleteFromReference(data)
);
/** End Routes Functions **/
