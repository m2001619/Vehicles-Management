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
// npm packages
const nodemailer_1 = __importDefault(require("nodemailer"));
// project imports
const config_1 = require("../config/config");
/** Start Functions **/
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { host, port, user, password } = config_1.config.mailtrap;
    // 1) Create a transporter
    const transporter = nodemailer_1.default.createTransport({
        host,
        port,
        auth: {
            user,
            pass: password,
        },
    });
    // 2) Define the email options
    const mailOptions = {
        from: "ROM Soft <romsoft2023@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    // 3) Actually send the email
    yield transporter.sendMail(mailOptions);
});
/** End Functions **/
exports.default = sendEmail;
