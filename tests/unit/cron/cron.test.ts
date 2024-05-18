import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import cron from 'node-cron';

import config from '../../../src/config/config';
import logger from '../../../src/config/logger';
import rateService from '../../../src/services/rate.service';
import usersService from '../../../src/services/users.service';
import mailer from '../../../src/subscriptionNotifier/mailer/mailer';
import APIError from '../../../src/utils/APIError';
import { userFixture } from '../../fixtures/user.fixture';

jest.mock('node-cron');
jest.mock('../../../src/services/users.service', () => ({
  getAllSubscribers: jest.fn()
}));
jest.mock('../../../src/subscriptionNotifier/mailer/mailer', () => ({
  transporter: {
    sendMail: jest.fn()
  },
  verity: jest.fn()
}));
jest.mock('../../../src/config/logger', () => ({
  info: jest.fn(),
  error: jest.fn()
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Cron Job', () => {
  let cronTask: () => Promise<void>;

  beforeAll(() => {
    const scheduleMock = jest.spyOn(cron, 'schedule');

    // Import the cron job setup to initialize the cron job
    require('../../../src/subscriptionNotifier/subscriptionNotifier');
    // Extract the scheduled task
    // @ts-ignore
    cronTask = scheduleMock.mock.calls[0][1];
  });

  it('should fetch all subscribers and send emails successfully', async () => {
    const scheduleMock = jest.spyOn(cron, 'schedule');
    const subscribers = [userFixture, { ...userFixture, email: 'bestproger3000@gmail.com' }];
    const emails = subscribers.map((user) => {
      return user.email;
    });
    const rate = { UAH: '39.5' };

    jest.spyOn(usersService, 'getAllSubscribers').mockResolvedValue(subscribers);
    jest.spyOn(rateService, 'getCurrentRate').mockResolvedValue(rate);
    jest.spyOn(mailer.transporter, 'sendMail').mockResolvedValue({
      messageId: '',
      pending: [],
      accepted: [subscribers[0].email, subscribers[1].email],
      rejected: [],
      envelope: {
        from: 'mykhailo.tanchuk@ukr.net',
        to: [subscribers[0].email, subscribers[1].email]
      },
      response: ''
    });

    await cronTask();

    expect(usersService.getAllSubscribers).toHaveBeenCalled();
    expect(mailer.transporter.sendMail).toHaveBeenCalledWith({
      from: `${config.SMTP_USER_NAME} <${config.SMTP_USER}>`,
      to: emails,
      subject: 'Exchange Rate Notification',
      text: `Current USD to UAH exchange rate is: ${JSON.stringify(Object.values(rate)[0])}`
    });
    expect(mailer.verity).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('Send users exchange rate successfully!');
  });

  it('should log and throw an APIError if getAllSubscribers fails with APIError', async () => {
    const error = new APIError(400, 'Failed to fetch subscribers');

    jest.spyOn(usersService, 'getAllSubscribers').mockRejectedValue(error);

    await expect(cronTask()).rejects.toThrow(APIError);
    expect(logger.error).toHaveBeenCalledWith(`Failed to send exchange rate: ${error}`);
    expect(logger.error).toHaveBeenCalledWith(`Failed to send exchange rate: ${error}`);
  });

  it('should log an error if sending email fails', async () => {
    const subscribers = [userFixture];
    const error = new APIError(500, 'Emails failed to send!');
    const rate = { UAH: '39.5' };

    jest.spyOn(usersService, 'getAllSubscribers').mockResolvedValue(subscribers);
    jest.spyOn(rateService, 'getCurrentRate').mockResolvedValue(rate);
    jest.spyOn(mailer.transporter, 'sendMail').mockRejectedValue(error);

    // Trigger the cron job manually
    await expect(cronTask()).rejects.toThrow(APIError);
    await expect(cronTask()).rejects.toThrow('Emails failed to send!');

    expect(usersService.getAllSubscribers).toHaveBeenCalled();
    expect(mailer.transporter.sendMail).toHaveBeenCalledWith({
      from: `${config.SMTP_USER_NAME} <${config.SMTP_USER}>`,
      to: [subscribers[0].email],
      subject: 'Exchange Rate Notification',
      text: `Current USD to UAH exchange rate is: ${JSON.stringify(Object.values(rate)[0])}`
    });
    expect(logger.error).toHaveBeenCalledWith(`Failed to send exchange rate: ${error}`);
  });
});
