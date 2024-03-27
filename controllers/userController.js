import User from "../modules/user.js";
import { connection } from "../services/database.js";
import * as encryptFunction from "./auth/encrypt.js";
import { userSchema } from "./schema/userSchema.js";
import { userUpdateSchema } from "./schema/userUpdateSchema.js";
import { validate } from "jsonschema";
import logger from "../modules/winstonLogger.js";
import { publishMessage } from "../pub-sub/pubSubConfig.js";
import UserVerification from "../modules/userVerification.js";
const topicName = "verify_email";

export const createUser = async (request, response) => {
  logger.debug("Checking database connection");
  const dbConnection = await connection();

  //Service unavailable if database is not connected
  if (!dbConnection) {
    logger.error("Error: Database not connected");
    response.status(503).send();
    return;
  } else {
    if (Object.keys(request.query).length != 0) {
      //Bad request since api has query params
      logger.info("Head options method not allowed hence 405 response");
      response.status(400).send();
      return;
    }

    //Bad request if body has invalid json schema
    const validateJsonSchema = validate(request.body, userSchema);
    if (!validateJsonSchema.valid) {
      logger.error("Bad Request: Invalid json schema");
      response.status(400).send();
      return;
    }

    const existingUser = await User.findOne({
      where: { username: request.body.username },
    });

    //Bad request if username is already existing
    if (existingUser) {
      logger.error("Bad Request: User already exists");
      response.status(400).send();
      return;
    }

    try {
      const currentHashedPassword = await encryptFunction.hashPassword(
        request.body.password
      );

      const newUser = await User.create({
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        username: request.body.username,
        password: currentHashedPassword,
      });

      const responseObject = {
        id: newUser.id,
        first_name: newUser.firstName,
        last_name: newUser.lastName,
        username: newUser.username,
        account_created: newUser.createdAt.toISOString(),
        account_updated: newUser.updatedAt.toISOString(),
      };

      logger.info("New user created");
      if( process.env.NODE_ENV == "PROD"){
      let messageId = await publishMessage(topicName, responseObject);
      }
      response.status(201).json(responseObject).send();
    } catch (error) {
      logger.error(error);
      response.status(400).send();
    }
  }
};

export const authorizeAndGetUser = async (request, response) => {
  logger.debug("Checking database connection");
  const dbConnection = await connection();
  //Service unavailable if database is not connected
  if (!dbConnection) {
    logger.error("Error: Database not connected");
    response.status(503).send();
    return;
  } else {
    try {
      const authorizationHeader = request.headers.authorization;
      //Unauthorized user
      if (!authorizationHeader) {
        logger.error("Error: Unauthorized user");
        response.status(401).send();
        return;
      }

      const contentTypeLength = request.get("content-type")
        ? request.get("content-type").length
        : 0;

      if (
        contentTypeLength != 0 ||
        Object.keys(request.body).length != 0 ||
        Object.keys(request.query).length != 0
      ) {
        //Bad request since api is sending a body or has query params
        logger.warn(
          "Bad request: invalid content-type or request body/query params present"
        );
        response.status(400).send();
        return;
      }

      const decodedCredentials = Buffer.from(
        authorizationHeader.split(" ")[1],
        "base64"
      )
        .toString()
        .split(":");
      const username = decodedCredentials[0];
      const password = decodedCredentials[1];
      const existingUser = await User.findOne({
        where: { username: username },
      });
      if (!existingUser) {
        logger.error("Error: User does not exist");
        response.status(401).send();
        return;
      }
      if (process.env.NODE_ENV == "PROD" && !existingUser.verified) {
        logger.error("User is not verified");
        response.status(403).send();
        return;
      }
      const comparePasswords = await encryptFunction.comparePasswords(
        password,
        existingUser.password
      );
      if (!comparePasswords) {
        logger.error("Error: Wrong password");
        response.status(401).send();
        return;
      }
      logger.info("Authorized user");
      const responseObject = {
        id: existingUser.id,
        first_name: existingUser.firstName,
        last_name: existingUser.lastName,
        username: existingUser.username,
        account_created: existingUser.createdAt.toISOString(),
        account_updated: existingUser.updatedAt.toISOString(),
      };
      logger.info("Retreived user information");
      response.status(200).json(responseObject).send();
    } catch (error) {
      logger.error(error);
      response.status(400).send();
    }
  }
};

export const updateUser = async (request, response) => {
  //Service unavailable if database is not connected
  logger.debug("Checking database connection");
  const dbConnection = await connection();
  if (!dbConnection) {
    logger.error("Error: Database not connected");
    response.status(503).send();
    return;
  } else {
    try {
      if (Object.keys(request.query).length != 0) {
        //Bad request since api has query params
        logger.info("Bad Request: Head options method/Params not allowed");
        response.status(400).send();
        return;
      }

      //Unauthorized if no basic auth credentials provided
      const authorizationHeader = request.headers.authorization;
      if (!authorizationHeader) {
        logger.error("Error: Unauthorized user");
        response.status(401).send();
        return;
      }
      const decodedCredentials = Buffer.from(
        authorizationHeader.split(" ")[1],
        "base64"
      )
        .toString()
        .split(":");
      const username = decodedCredentials[0];
      const password = decodedCredentials[1];
      const existingUser = await User.findOne({
        where: { username: username },
      });

      //Unauthorzied if user is not existing
      if (!existingUser) {
        logger.error("Error: User does not exist");
        response.status(401).send();
        return;
      }
      if (process.env.NODE_ENV == "PROD" && !existingUser.verified) {
        logger.error("User is not verified");
        response.status(403).send();
        return;
      }
      const comparePasswords = await encryptFunction.comparePasswords(
        password,
        existingUser.password
      );

      //Unauthorzied if wrong password provided
      if (!comparePasswords) {
        logger.error("Error: Wrong password");
        response.status(401).send();
        return;
      }

      //Bad request if body is not in JSON format
      const contentType = request.get("Content-Type");
      if (!contentType || contentType !== "application/json") {
        logger.error("Error: Body is not in JSON format ");
        response.status(400).send();
        return;
      }

      //Bad request if body invalid JSON schema
      const validateJsonSchema = validate(request.body, userUpdateSchema);
      if (!validateJsonSchema.valid) {
        logger.error("Error:invalid json schema");
        response.status(400).send();
        return;
      }

      const updateUser = {};

      if (request.body.firstName) {
        updateUser.firstName = request.body.firstName;
      }
      if (request.body.lastName) {
        updateUser.lastName = request.body.lastName;
      }
      if (request.body.password) {
        const newHashedPassword = await encryptFunction.hashPassword(
          request.body.password
        );
        updateUser.password = newHashedPassword;
      }
      updateUser.account_updated = new Date().toISOString();

      if (Object.keys(updateUser).length > 0) {
        const updatedUser = await existingUser.update(updateUser);
        logger.info("Success: User updated");
        response.status(204).json(updatedUser).send();
        return;
      } else {
        logger.warn("No information sent for user update");
        response.status(400).send();
        return;
      }
    } catch (error) {
      logger.error(error);
      response.status(400).send();
    }
  }
};

export const verifyUser = async (request, response) => {
  try {
    logger.info("Verfying user");
    const token = request.query.token;
    const userVerificationDetail = await UserVerification.findOne({
      where: { id: token },
    });
    const existingUser = await User.findOne({
      where: { username: userVerificationDetail?.username },
    });

    //Unauthorzied if user is not existing
    if (!existingUser) {
      logger.error("Error: User does not exist");
      response.status(401).send();
      return;
    } else if (existingUser.verified == true) {
      logger.error("Bad Request: User is already verified");
      response.status(400).send();
      return;
    }
    // Verify the link
    if (userVerificationDetail?.verifyLinkTimestamp) {
      const currentTime = new Date();
      const linkSentTime = userVerificationDetail.verifyLinkTimestamp;
      const differenceInMilliseconds = currentTime - linkSentTime;
      // Convert milliseconds to seconds
      const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
      if (differenceInSeconds <= process.env.LINK_EXPIRATION_TIME) {
        const updateUser = {};
        updateUser.verified = true;
        const updatedUser = await existingUser.update(updateUser);
        logger.info("User verfied");
        response.send("User verfied");
        return;
      } else {
        logger.error("Link has expired");
        response.send("Link has expired");
        return;
      }
    }
  } catch (error) {
    logger.error("Error processing verification:", error);
    response.send("Internal server error");
  }
};

//Head method not allowed
export const userHeadOptions = async (request, response) => {
  logger.info("Head options method not allowed. 405 response");
  response.status(405).send();
};

//wrong routes
export const userOtherRoutes = (request, response) => {
  logger.error("Wrong route given in URL");
  response.status(404).send();
};

//deny other methods
export const userAllMethods = (request, response) => {
  logger.info("This method is not allowed. 405 response");
  response.status(405).send();
};
