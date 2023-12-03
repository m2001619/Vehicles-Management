// express
import express from "express";

// mongoose
import mongoose from "mongoose";

// npm packages
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

// project imports
import AppError from "./../utils/AppError";
import globalErrorHandler from "./../controllers/errorController";
import { socketHandler, vehicleWatcher } from "./socketIo";

// interfaces
import { Express, Response, Request } from "express";

class ExpressServer {
  /** Start Variables **/
  app: Express;

  /** End Variables **/

  /** Start constructor **/
  constructor(routes: (app: Express) => void) {
    this.app = express();

    const corsOptions = {
      origin: "*",
      credentials: true, //access-control-allow-credentials:true
      optionSuccessStatus: 200,
    };
    this.app.use(cors(corsOptions));

    // Set security HTTP headers
    this.app.use(helmet());

    // Limit requests from same API
    const limiter = rateLimit({
      max: 1000,
      windowMs: 5 * 60 * 1000,
      message: "Too many requests from this IP, please try again in an hour!",
    });
    this.app.use("/api", limiter);

    // Data sanitization against NoSQL query injection
    this.app.use(
      mongoSanitize({
        allowDots: true,
      })
    );

    // Data sanitization against XSS
    this.app.use(xss());

    // Body parser, reading data from the body into req.body
    this.app.use(express.json({ limit: "10kb" }));

    // Call the Routes
    routes(this.app);

    // Handle the error if there is no target route
    this.app.all("*", (req, _res, next) => {
      next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
    });

    // Error Middleware
    this.app.use((err: any, _req: Request, res: Response, _next: any) =>
      globalErrorHandler(err, res)
    );
  }

  /** Start constructor **/

  /** Start Methods **/
  configureDb(dbUrl: string) {
    mongoose
      .connect(dbUrl)
      .then(() => console.log("Connected to the database successfully 👋"));

    return this;
  }

  listen(port: number) {
    const server = http.createServer(this.app);
    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    server.listen(port, async () => {
      socketHandler(io);
      await vehicleWatcher(io);

      console.log(
        `Secure app is listening @port ${port}`,
        new Date().toLocaleString()
      );
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

  /** End Methods **/
}

export default ExpressServer;
