"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    port: 1865,
    dbUrl: `mongodb+srv://mo6192001:${process.env.DB_PASSWORD}@cluster0.dny8wim.mongodb.net/vehicles-management?retryWrites=true&w=majority`,
    dbPassword: process.env.DB_PASSWORD,
    jwt: {
        jwtSecret: "m-o-h-a-m-m-e-d-r*a*d*w*a*n*2/0/",
        jwtExpiresIn: "24h",
        jwtCookieExpiresIn: 24,
    },
    mailtrap: {
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        user: "cfe71d1abf2093",
        password: "9dc0c162f5073f",
    },
    cloudinary: {
        cloud_name: "dxatiufog",
        api_key: "197428951932886",
        api_secret: "HAQQZKm4z-cmraA1tt-5lSW-mkw",
    },
};
exports.default = config;
