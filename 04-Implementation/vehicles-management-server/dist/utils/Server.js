"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("./../utils/AppError"));
const errorController_1 = __importDefault(require("./../controllers/errorController"));
class Server {
    constructor(routes) {
        this.app = (0, express_1.default)();
        // Set security HTTP headers
        this.app.use((0, helmet_1.default)());
        // Limit requests from same API
        const limiter = (0, express_rate_limit_1.default)({
            max: 1000,
            windowMs: 5 * 60 * 1000,
            message: "Too many requests from this IP, please try again in an hour!",
        });
        this.app.use("/api", limiter);
        // Data sanitization against NoSQL query injection
        this.app.use((0, express_mongo_sanitize_1.default)());
        // Data sanitization against XSS
        this.app.use((0, xss_clean_1.default)());
        // Body parser, reading data from the body into req.body
        this.app.use(express_1.default.json({ limit: "10kb" }));
        // Call the Routes
        routes(this.app);
        // Handle the error if there is no target route
        this.app.all("*", (req, _res, next) => {
            next(new AppError_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
        });
        // Error Middleware
        this.app.use((err, _req, res, _next) => (0, errorController_1.default)(err, res));
    }
    configureDb(dbUrl) {
        mongoose_1.default
            .connect(dbUrl, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        })
            .then(() => console.log("Connected to the database successfully 👋"));
        return this;
    }
    listen(port) {
        const server = this.app.listen(port, () => {
            console.log(`Secure app is listening @port ${port}`, new Date().toLocaleString());
        });
        // To Check Unhandled Rejection Errors
        process.on("unhandledRejection", (err) => {
            // @ts-ignore
            console.log("Unhandled Rejection Error:", err.name);
            server.close(() => {
                process.exit(1);
            });
        });
        return this.app;
    }
}
exports.default = Server;
