import { Express } from "express";

import userRoutes from "./routes/userRoutes";
import vehicleRoutes from "./routes/vehicleRoutes";
import garageRoutes from "./routes/garageRoutes";
import reservationArchiveRoutes from "./routes/reservationArchiveRoutes";
import fuelBillRoutes from "./routes/fuelBillRoutes";
import requestRoutes from "./routes/requestRoutes";
import contentRoutes from "./routes/contentRoutes";

export default function routes(app: Express) {
  app.use("/api/v1/user", userRoutes);
  app.use("/api/v1/vehicle", vehicleRoutes);
  app.use("/api/v1/garage", garageRoutes);
  app.use("/api/v1/reservationArchive", reservationArchiveRoutes);
  app.use("/api/v1/fuelBill", fuelBillRoutes);
  app.use("/api/v1/request", requestRoutes);
  app.use("/api/v1/content", contentRoutes);

  return app;
}
