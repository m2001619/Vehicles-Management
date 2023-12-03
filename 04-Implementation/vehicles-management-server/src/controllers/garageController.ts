// project imports
import {
  getAll,
  getOne,
  deleteOne,
  createOne,
  updateOne,
  blockActiveOne,
} from "../utils/handlerFactory";

// models
import Garage from "../models/garageModel";
import VehicleModel from "../models/vehicleModel";

// interfaces
import { IGarage } from "../constans/Interfaces";

/** Start Handler Functions **/
const blockActiveFromReference = async (garageData: IGarage) => {
  const { vehicles } = garageData;
  for (let vehicleId of vehicles) {
    await VehicleModel.findByIdAndUpdate(vehicleId, {
      status: garageData.status === "ACTIVE" ? "BLOCK" : "ACTIVE",
    });
  }
};
/** End Handler Functions **/

/** Start Routes Functions **/
export const getAllGarages = getAll(Garage);
export const getGarage = getOne(Garage);
export const deleteGarage = deleteOne(Garage);
export const createGarage = createOne(Garage);
export const updateGarage = updateOne(Garage);
export const blockActiveGarage = blockActiveOne(
  Garage,
  blockActiveFromReference
);
/** End Routes Functions **/
