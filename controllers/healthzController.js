import { connection } from "../services/database.js";
import logger from "../modules/winstonLogger.js";

export const healthzHeadOptions = async (request, response) => {
  logger.info("healthz head options method not allowed. 405 response");
  response.status(405).send();
};

export const healthzGet = async (request, response) => {
  const dbConnection = await connection();
  const contentTypeLength = request.get("content-type")
    ? request.get("content-type").length
    : 0;

  if (
    contentTypeLength != 0 ||
    Object.keys(request.body).length != 0 ||
    Object.keys(request.query).length != 0
  ) {
    //Bad request since api is sending a body or has query params & check for head and options
    logger.warn('Bad request: invalid content-type or request body/query params present');
    response.status(400).send();
    return;
  }

  if (dbConnection) {
    //Successfull db connection with no payload and no query params
    logger.info('Successful healthz GET method');
    response.status(200).send();
  } else {
    //Database connection failed
    logger.error('Database connection failed');
    response.status(503).send();
  }
};

//deny methods other than GET
export const heathzAllMethods = (request, response) => {
  if (request.method != "GET") {
    logger.info("In healthz, method except GET is not allowed. 405 response");
    response.status(405).send();
  }
};

//wrong routes
export const heathzOtherRoutes = (request, response) => {
  logger.info("Wrong route sent for healthz methods");
  response.status(404).send();
};
