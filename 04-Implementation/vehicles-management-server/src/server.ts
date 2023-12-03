import ExpressServer from "./utils/ExpressServer";
import routes from "./routes";
import { config } from "./config/config";
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/config.env" });

const dbUrl = config.dbUrl.replace("<PASSWORD>", config.dbPassword);

const port: number = config.port;

const server = new ExpressServer(routes);

server.configureDb(dbUrl).listen(port);
