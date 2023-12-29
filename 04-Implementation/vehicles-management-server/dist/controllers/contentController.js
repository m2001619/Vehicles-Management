"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContent = exports.getContent = void 0;
// models
const contentModel_1 = __importDefault(require("../models/contentModel"));
// project imports
const handlerFactory_1 = require("../utils/handlerFactory");
/** Start Routes Functions **/
exports.getContent = (0, handlerFactory_1.getAll)(contentModel_1.default);
exports.updateContent = (0, handlerFactory_1.updateOne)(contentModel_1.default);
/** End Routes Functions **/
