import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Request, Response } from 'express';
import httpMocks from 'node-mocks-http';

import rateController from '../../../src/controllers/rate.controller';
import rateService from '../../../src/services/rate.service';
import APIError from '../../../src/utils/APIError';

jest.mock('node-cron');

jest.mock('../../../src/services/rate.service', () => ({
  getCurrentRate: jest.fn()
}));

jest.mock('../../../src/config/logger', () => ({
  info: jest.fn()
}));

describe('Exchange Rates controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('get exchange rates', () => {
    it('should send correct currency data when no other currencies provided', async () => {
      jest.spyOn(rateService, 'getCurrentRate').mockResolvedValueOnce({ UAH: '39.5' });

      const req = httpMocks.createRequest<Request>();
      const res = httpMocks.createResponse<Response>();
      const next = jest.fn();

      await rateController.getRateController(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(res._getData()).toEqual({ UAH: '39.5' });
    });

    it('should send correct currency data for other currencies', async () => {
      jest.spyOn(rateService, 'getCurrentRate').mockResolvedValueOnce({ EUR: '1.2' });

      const req = httpMocks.createRequest<Request>({
        query: {
          from: 'USD',
          to: 'EUR'
        }
      });
      const res = httpMocks.createResponse<Response>();
      const next = jest.fn();

      await rateController.getRateController(req, res, next);

      expect(rateService.getCurrentRate).toHaveBeenCalledWith('USD', 'EUR');

      expect(res.statusCode).toBe(200);
      expect(res._getData()).toEqual({ EUR: '1.2' });
    });

    it('should throw error when no currency received', async () => {
      jest.spyOn(rateService, 'getCurrentRate').mockResolvedValueOnce({});

      const req = httpMocks.createRequest<Request>({
        query: {
          from: 'USD',
          to: 'AAA'
        }
      });
      const res = httpMocks.createResponse<Response>();
      const next = jest.fn();

      await rateController.getRateController(req, res, next);

      expect(rateService.getCurrentRate).toHaveBeenCalledWith('USD', 'AAA');

      expect(next).toHaveBeenCalledWith(expect.any(APIError));

      // Optionally, check the specific properties of the error passed to next
      const errorPassedToNext = next.mock.calls[0][0] as APIError;

      expect(errorPassedToNext).toBeInstanceOf(APIError);
      expect(errorPassedToNext.message).toBe('No rates found');
    });
  });
});
