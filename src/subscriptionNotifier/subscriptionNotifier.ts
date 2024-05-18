import cron from 'node-cron';

import config from '../config/config';
import logger from '../config/logger';
import prisma from '../prismaClient';
import RateService from '../services/rate.service';
import usersService from '../services/users.service';
import APIError from '../utils/APIError';

import Mailer from './mailer/mailer';

void prisma.$connect().then(() => {
  logger.info('Connected to SQL Database');
});

//0 0 * * * - once per day
cron.schedule('0 0 * * *', async () => {
  try {
    const usersSubscribed = await usersService.getAllSubscribers();

    const emails = usersSubscribed.map((user) => {
      return user.email;
    });

    Mailer.verity();

    const rate = await RateService.getCurrentRate();

    try {
      void (await Mailer.transporter.sendMail({
        from: `${config.SMTP_USER_NAME} <${config.SMTP_USER}>`,
        to: emails,
        subject: 'Exchange Rate Notification',
        text: `Current USD to UAH exchange rate is: ${JSON.stringify(Object.values(rate)[0])}`
      }));
    } catch (error) {
      logger.error(`Failed to send email: ${error}`);
      throw new APIError(500, 'Emails failed to send!');
    }

    logger.info('Send users exchange rate successfully!');
  } catch (error) {
    logger.error(`Failed to send exchange rate: ${error}`);

    if (error instanceof APIError) {
      throw error; // Rethrow custom API errors
    }

    throw new APIError(500, 'Internal Server Error');
  }
});
