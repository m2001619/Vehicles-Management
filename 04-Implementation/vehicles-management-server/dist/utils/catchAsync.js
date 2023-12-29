"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Start Functions **/
const asyncHandler = (fn) => {
    return (req, res, next) => fn(req, res, next).catch(next);
};
/** End Functions **/
exports.default = asyncHandler;
