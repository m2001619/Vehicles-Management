// project imports
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from "../utils/handlerFactory";

// models
import FuelBill from "./../models/fuelBillModel";
import User from "./../models/userModel";
import ReservationArchive from "./../models/reservationArchiveModel";
import Vehicle from "./../models/vehicleModel";

// interfaces
import { ICostumeRequest, IFuelBill } from "../constans/Interfaces";

/** Start Routes Functions **/
export const fuelBillDeleteFromReference = async (data: IFuelBill) => {
  await User.findByIdAndUpdate(data.user, {
    $pull: { fuelBill: data?._id },
  });
  await Vehicle.findByIdAndUpdate(data.vehicle, {
    $pull: { fuelBill: data?._id },
  });
  await ReservationArchive.findByIdAndUpdate(data.reservationArchive, {
    $pull: { fuelBill: data?._id },
  });
};

export const getAllFuelBill = getAll(FuelBill, undefined, undefined, [
  {
    path: "user",
    select: "name photo",
  },
  { path: "vehicle", select: "make model year images" },
]);
export const getFuelBill = getOne(FuelBill);
export const createFuelBill = createOne(
  FuelBill,
  async (formData: any, data: any) => {
    await User.findByIdAndUpdate(formData.user, {
      $push: { fuelBill: data?._id },
    });
    await Vehicle.findByIdAndUpdate(formData.vehicle, {
      $push: { fuelBill: data?._id },
    });
    await ReservationArchive.findByIdAndUpdate(formData.reservationArchive, {
      $push: { fuelBill: data?._id },
    });
  }
);
export const updateFuelBill = updateOne(FuelBill);
export const deleteFuelBill = deleteOne(FuelBill, fuelBillDeleteFromReference);
export const getUserFuelBills = getAll(FuelBill, (req: ICostumeRequest) => {
  return { user: req.params.userId };
});
export const getVehicleFuelBills = getAll(FuelBill, (req: ICostumeRequest) => {
  return { vehicle: req.params.vehicleId };
});
export const getReservationFuelBills = getAll(
  FuelBill,
  (req: ICostumeRequest) => {
    return { reservationArchive: req.params.reservationId };
  }
);
/** End Routes Functions **/
