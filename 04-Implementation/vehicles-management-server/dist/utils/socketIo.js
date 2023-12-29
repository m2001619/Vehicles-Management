"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleWatcher = exports.socketHandler = void 0;
// models
const vehicleModel_1 = __importDefault(require("../models/vehicleModel"));
/** Start Functions **/
const socketHandler = (io) => {
    io.on("connection", (socket) => {
        socket.on("UPDATE_VEHICLE_LOCATION", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { id, location } = data;
            const newLocation = {
                type: "Point",
                coordinates: location,
            };
            yield vehicleModel_1.default.findByIdAndUpdate(id, {
                location: newLocation,
            });
        }));
    });
};
exports.socketHandler = socketHandler;
const vehicleWatcher = (io) => __awaiter(void 0, void 0, void 0, function* () {
    const changeStream = vehicleModel_1.default.watch([], { fullDocument: "updateLookup" });
    changeStream.on("change", (event) => {
        if (event.operationType === "update") {
            const fullDocument = event.fullDocument;
            io.emit(`VEHICLE_LOCATION_CHANGED_${fullDocument._id}`, fullDocument);
        }
    });
});
exports.vehicleWatcher = vehicleWatcher;
/** End Functions **/
