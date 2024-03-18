import winston from "winston";

// Create a Winston logger instance
const logger = winston.createLogger({
  transports:
    process.env.NODE_ENV == "PROD"
      ? [
          new winston.transports.File({
            filename: "/var/log/webapp_logs/webappLog.log",
          }),
        ]
      : [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
});

export default logger;
