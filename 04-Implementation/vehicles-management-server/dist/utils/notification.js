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
exports.sendNotificationToAdmin = exports.sendNotificationToUser = void 0;
// npm packages
const firebase_admin_1 = __importDefault(require("firebase-admin"));
// models
const userModel_1 = __importDefault(require("../models/userModel"));
// Initialize the Firebase Admin SDK
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(require("../firebase-adminsdk.json")),
});
/** Start Functions **/
// Send a push notification to a React Native app
const sendNotificationToUser = (deviceToken, data) => __awaiter(void 0, void 0, void 0, function* () {
    const message = {
        notification: {
            title: data.title,
            body: data.body,
        },
        android: {
            notification: {
                icon: "stock_ticker_update",
                color: "#7e55c3",
            },
        },
        token: deviceToken,
    };
    try {
        yield firebase_admin_1.default.messaging().send(message);
    }
    catch (e) {
        console.log(e);
        console.log("Error in Send Notification");
    }
});
exports.sendNotificationToUser = sendNotificationToUser;
// Send a push notification to a React.js web app
const sendNotificationToAdmin = (notification) => __awaiter(void 0, void 0, void 0, function* () {
    const adminData = yield userModel_1.default.findOne({ role: "admin" });
    const message = {
        notification,
        webpush: {
            notification: {
                icon: "path/to/notification-icon.png",
            },
        },
        token: adminData.notificationToken,
    };
    try {
        yield firebase_admin_1.default.messaging().send(message);
    }
    catch (e) {
        console.log(e);
    }
});
exports.sendNotificationToAdmin = sendNotificationToAdmin;
/** End Functions **/
