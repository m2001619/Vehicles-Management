"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// express
const express_1 = __importDefault(require("express"));
// project imports
const contentController_1 = require("../controllers/contentController");
const authController_1 = require("../controllers/authController");
/** Start Router **/
const router = express_1.default.Router();
router
    .get("", contentController_1.getContent)
    .use(authController_1.protect)
    .patch("/:id", (0, authController_1.restrictTo)("admin"), contentController_1.updateContent);
/** End Router **/
exports.default = router;
