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
exports.blockActiveGarage = exports.updateGarage = exports.createGarage = exports.deleteGarage = exports.getGarage = exports.getAllGarages = void 0;
// project imports
const handlerFactory_1 = require("../utils/handlerFactory");
// models
const garageModel_1 = __importDefault(require("../models/garageModel"));
const vehicleModel_1 = __importDefault(require("../models/vehicleModel"));
/** Start Handler Functions **/
const blockActiveFromReference = (garageData) => __awaiter(void 0, void 0, void 0, function* () {
    const { vehicles } = garageData;
    for (let vehicleId of vehicles) {
        yield vehicleModel_1.default.findByIdAndUpdate(vehicleId, {
            status: garageData.status === "ACTIVE" ? "BLOCK" : "ACTIVE",
        });
    }
});
/** End Handler Functions **/
/** Start Routes Functions **/
exports.getAllGarages = (0, handlerFactory_1.getAll)(garageModel_1.default);
exports.getGarage = (0, handlerFactory_1.getOne)(garageModel_1.default);
exports.deleteGarage = (0, handlerFactory_1.deleteOne)(garageModel_1.default);
exports.createGarage = (0, handlerFactory_1.createOne)(garageModel_1.default);
exports.updateGarage = (0, handlerFactory_1.updateOne)(garageModel_1.default);
exports.blockActiveGarage = (0, handlerFactory_1.blockActiveOne)(garageModel_1.default, blockActiveFromReference);
/** End Routes Functions **/
