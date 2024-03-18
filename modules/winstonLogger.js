import winston from 'winston';

// Create a Winston logger instance
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({filename: '/var/log/webapp_logs/webappLog.log'})
  ],
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  )
});

export default logger;
