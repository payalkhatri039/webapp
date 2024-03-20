import winston from "winston";

// Create a Winston logger instance
const logger = winston.createLogger({
  transports:
    process.env.NODE_ENV == "PROD"
      ? [
          new winston.transports.File({
            filename: "/var/log/webapp_logs/webappLog.log",
            level: "debug", // Setting logging level to include debug logs
          }),
        ]
      : [
          new winston.transports.Console({
            level: "debug",
          }),
        ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
});

export default logger;
