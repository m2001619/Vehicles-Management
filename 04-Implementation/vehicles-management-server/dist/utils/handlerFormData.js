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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFormFiles = exports.handleFormFields = void 0;
const storageCloud_1 = require("./storageCloud");
const handleFormFields = (fields) => __awaiter(void 0, void 0, void 0, function* () {
    const fieldsObj = {};
    Object.keys(fields).forEach((el) => {
        try {
            fieldsObj[el] = JSON.parse(fields[el][0]);
        }
        catch (e) {
            fieldsObj[el] = fields[el][0];
        }
    });
    return fieldsObj;
});
exports.handleFormFields = handleFormFields;
const handleFormFiles = (files, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filesObj = {};
    for (const key of Object.keys(files)) {
        if (files[key].length > 1) {
            filesObj[key] = [];
            for (const file of files[key]) {
                filesObj[key].push(yield (0, storageCloud_1.getImageUrl)(file.filepath, next));
            }
        }
        else {
            filesObj[key] = yield (0, storageCloud_1.getImageUrl)(files[key][0].filepath, next);
        }
    }
    return filesObj;
});
exports.handleFormFiles = handleFormFiles;
