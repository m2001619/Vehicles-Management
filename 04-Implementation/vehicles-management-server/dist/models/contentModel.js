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
// mongoose
const mongoose_1 = __importDefault(require("mongoose"));
// project imports
const config_1 = require("../config/config");
const mongoose_2 = require("mongoose");
/** Start Schema **/
const contentSchema = new mongoose_2.Schema({
    adminLogo: String,
    appLogo: String,
    adminTitle: String,
    appTitle: String,
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
/** End Schema **/
/** Start Mongoose Functions **/
const Content = mongoose_1.default.model("Content", contentSchema);
/** End Mongoose Functions **/
exports.default = Content;
/** Start Handler Functions **/
// Create Default Content
mongoose_1.default
    .model("Content", contentSchema)
    .findOne()
    .then((data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data) {
        console.log("Default content already created.");
    }
    else {
        try {
            yield mongoose_1.default
                .model("Content", contentSchema)
                .create(config_1.config.contentData);
            console.log("Default content created successfully");
        }
        catch (e) {
            console.log("Error create default content");
            console.log(e);
        }
    }
}))
    .catch(() => console.log("Error create default content"));
/** End Mongoose Functions **/
