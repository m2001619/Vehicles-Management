"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGarage = exports.createGarage = exports.deleteGarage = exports.getGarage = exports.getAllGarages = void 0;
const garageModel_1 = __importDefault(require("../models/garageModel"));
const handlerFactory_1 = require("./handlerFactory");
// Only access for admin
exports.getAllGarages = (0, handlerFactory_1.getAll)(garageModel_1.default);
exports.getGarage = (0, handlerFactory_1.getOne)(garageModel_1.default);
exports.deleteGarage = (0, handlerFactory_1.deleteOne)(garageModel_1.default);
exports.createGarage = (0, handlerFactory_1.createOne)(garageModel_1.default);
exports.updateGarage = (0, handlerFactory_1.updateOne)(garageModel_1.default);
