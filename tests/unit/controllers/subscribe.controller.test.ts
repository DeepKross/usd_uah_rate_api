import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Request, Response } from 'express';
import httpMocks from 'node-mocks-http';

import logger from '../../../src/config/logger';
import { subscribeUserByEmail } from '../../../src/controllers/subscribe.controller'; // Adjust the import path
import subscribeService from '../../../src/services/subscribe.service'; // Adjust the import path
import APIError from '../../../src/utils/APIError';

jest.mock('../../../src/services/subscribe.service', () => ({
  subscribeUserByEmail: jest.fn()
}));

jest.mock('../../../src/config/logger', () => ({
  info: jest.fn()
}));

describe('Subscribe User by Email controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should subscribe a new user and send a success response', async () => {
    const email = 'test@example.com';
    const name = 'TestUser';

    jest.spyOn(subscribeService, 'subscribeUserByEmail').mockResolvedValueOnce({
      id: '1',
      email,
      name,
      isSubscribed: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const req = httpMocks.createRequest<Request>({
      body: { email, name }
    });
    const res = httpMocks.createResponse<Response>();
    const next = jest.fn();

    await subscribeUserByEmail(req, res, next);

    expect(subscribeService.subscribeUserByEmail).toHaveBeenCalledWith({ email, name });
    expect(logger.info).toHaveBeenCalledWith(`User with email ${email} was subscribed at `);
    expect(res.statusCode).toBe(200);
    expect(res._getData()).toBe('E-mail added!');
  });

  it('should handle already subscribed user and send an error response', async () => {
    const email = 'test@example.com';
    const name = 'TestUser';

    const error = new APIError(409, 'Email is already subscribed');

    jest.spyOn(subscribeService, 'subscribeUserByEmail').mockRejectedValueOnce(error);

    const req = httpMocks.createRequest<Request>({
      body: { email, name }
    });
    const res = httpMocks.createResponse<Response>();
    const next = jest.fn();

    await subscribeUserByEmail(req, res, next);

    expect(subscribeService.subscribeUserByEmail).toHaveBeenCalledWith({ email, name });

    expect(next).toHaveBeenCalledWith(expect.any(APIError));

    // Optionally, check the specific properties of the error passed to next
    const errorPassedToNext = next.mock.calls[0][0] as APIError;

    expect(errorPassedToNext).toBeInstanceOf(APIError);
    expect(errorPassedToNext.message).toBe('Email is already subscribed');
  });

  it('should handle internal server error and send an error response', async () => {
    const email = 'test@example.com';
    const name = 'TestUser';

    const error = new APIError(500, 'Internal Server Error');

    jest.spyOn(subscribeService, 'subscribeUserByEmail').mockRejectedValueOnce(error);

    const req = httpMocks.createRequest<Request>({
      body: { email, name }
    });
    const res = httpMocks.createResponse<Response>();
    const next = jest.fn();

    await subscribeUserByEmail(req, res, next);

    expect(subscribeService.subscribeUserByEmail).toHaveBeenCalledWith({ email, name });

    expect(next).toHaveBeenCalledWith(expect.any(APIError));

    // Optionally, check the specific properties of the error passed to next
    const errorPassedToNext = next.mock.calls[0][0] as APIError;

    expect(errorPassedToNext).toBeInstanceOf(APIError);
    expect(errorPassedToNext.message).toBe('Internal Server Error');
  });
});
