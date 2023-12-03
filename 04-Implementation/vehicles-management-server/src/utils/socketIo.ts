// npm packages
import { Server } from "socket.io";

// models
import VehicleModel from "../models/vehicleModel";

/** Start Functions **/
export const socketHandler = (io: Server) => {
  io.on("connection", (socket: any) => {
    socket.on(
      "UPDATE_VEHICLE_LOCATION",
      async (data: { id: string; location: number[] }) => {
        const { id, location } = data;
        const newLocation = {
          type: "Point",
          coordinates: location,
        };
        await VehicleModel.findByIdAndUpdate(id, {
          location: newLocation,
        });
      }
    );
  });
};

export const vehicleWatcher = async (io: Server) => {
  const changeStream = VehicleModel.watch([], { fullDocument: "updateLookup" });
  changeStream.on("change", (event) => {
    if (event.operationType === "update") {
      const fullDocument = event.fullDocument;
      io.emit(`VEHICLE_LOCATION_CHANGED_${fullDocument._id}`, fullDocument);
    }
  });
};
/** End Functions **/
