import { app } from "../app.js";
import { config } from "dotenv";
import logger from "../modules/winstonLogger.js";

config();

const port = process.env.PORT;

const server = app.listen(port, function () {
  logger.info(`App is listening on port :${port}!`);
  console.log(`App is listening on port :${port}!`);
});

export default server;
