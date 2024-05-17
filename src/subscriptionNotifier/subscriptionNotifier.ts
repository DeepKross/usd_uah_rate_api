import cron from 'node-cron';

import logger from '../config/logger';
import prisma from '../prismaClient';
import RateService from '../services/rate.service';
import usersService from '../services/users.service';

import Mailer from './mailer/mailer';

void prisma.$connect().then(() => {
  logger.info('Connected to SQL Database');
});

//0 0 * * * - once per day
cron.schedule('0 0 * * *', async () => {
  const usersSubscribed = await usersService.getAllSubscribers();

  const emails = usersSubscribed.map((user) => {
    return user.email;
  });

  Mailer.verity();

  const rate = await RateService.getCurrentRate();

  void (await Mailer.transporter.sendMail({
    from: 'Mykhailo Tanchuk <mykhailo.tanchuk@ukr.net>',
    to: emails,
    subject: 'Exchange Rate by Mykhailo Tanchuk',
    text: `Current USD to UAH exchange rate is: ${JSON.stringify(Object.values(rate)[0])}`
  }));

  logger.info('Send users exchange rate successfully!');
});
