"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const vehicleRoutes_1 = __importDefault(require("./routes/vehicleRoutes"));
const garageRoutes_1 = __importDefault(require("./routes/garageRoutes"));
const reservationArchiveRoutes_1 = __importDefault(require("./routes/reservationArchiveRoutes"));
const fuelBillRoutes_1 = __importDefault(require("./routes/fuelBillRoutes"));
const requestRoutes_1 = __importDefault(require("./routes/requestRoutes"));
function routes(app) {
    app.use("/api/v1/user", userRoutes_1.default);
    app.use("/api/v1/vehicle", vehicleRoutes_1.default);
    app.use("/api/v1/garage", garageRoutes_1.default);
    app.use("/api/v1/reservationArchive", reservationArchiveRoutes_1.default);
    app.use("/api/v1/fuelBill", fuelBillRoutes_1.default);
    app.use("/api/v1/request", requestRoutes_1.default);
    return app;
}
exports.default = routes;
;
