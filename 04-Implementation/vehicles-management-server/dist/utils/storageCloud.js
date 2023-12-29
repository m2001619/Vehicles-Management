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
exports.getImageUrl = void 0;
// npm packages
const cloudinary_1 = __importDefault(require("cloudinary"));
// project imports
const config_1 = require("../config/config");
/** Start Variables **/
const { cloud_name, api_key, api_secret } = config_1.config.cloudinary;
cloudinary_1.default.v2.config({
    cloud_name,
    api_key,
    api_secret,
});
/** End Variables **/
/** Start Functions **/
const getImageUrl = (filePath, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary_1.default.v2.uploader.upload(filePath, {
            resource_type: "auto",
        });
        return result.secure_url;
    }
    catch (error) {
        next(error);
    }
});
exports.getImageUrl = getImageUrl;
/** End Functions **/
