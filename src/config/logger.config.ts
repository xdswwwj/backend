import fs from 'fs';
import path from 'path';
import * as winston from 'winston';

const logDirectory = path.join(process.cwd(), 'logs');
const retentionDays = 10; // 10일

// 나중에 크론탭으로 처리
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const deleteOldLogs = () => {
  const files = fs.readdirSync(logDirectory);

  const now = new Date();
  files.forEach((file) => {
    const match = file.match(/app-(\d{4}-\d{2}-\d{2})\.log$/);
    if (match) {
      const logDate = new Date(match[1]);
      const ageInDays =
        (now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24);

      if (ageInDays > retentionDays) {
        const filePath = path.join(logDirectory, file);
        fs.unlinkSync(filePath);
        console.log(`Deleted old log file: ${file}`);
      }
    }
  });
};

// Call the function
deleteOldLogs();

// Ensure log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const getDateString = () => {
  const date = new Date();
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] ${level}: ${message}`;
        }),
      ),
    }),
    new winston.transports.File({
      filename: `logs/app-${getDateString()}.log`,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      filename: `logs/error-${getDateString()}.log`,
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});

// Morgan stream option
export const morganStream = {
  write: (message: string) => {
    winstonLogger.info(message.trim());
  },
};
