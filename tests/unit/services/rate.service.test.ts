import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import fetchMock from 'jest-fetch-mock';
import { FetchError } from 'node-fetch';

import config from '../../../src/config/config';
import logger from '../../../src/config/logger';
import { RateData } from '../../../src/models/rate.types';
import rateService from '../../../src/services/rate.service';
import APIError from '../../../src/utils/APIError';

fetchMock.enableMocks();

jest.mock('../../../src/config/logger', () => ({
  info: jest.fn()
}));

beforeEach(() => {
  jest.resetAllMocks();
  fetchMock.resetMocks();
});

describe('Exchange Rates service', () => {
  describe('fetch exchange rates from API', () => {
    const mockRateRequest = {
      from: 'USD',
      to: 'UAH'
    };

    it('should return rates when API responds successfully', async () => {
      const mockResponseData: RateData = {
        meta: {
          code: 200,
          disclaimer: '...'
        },
        rates: { UAH: '37.5' },
        response: {
          rates: { UAH: '37.5' },
          date: '...',
          base: 'USD'
        },
        base: 'USD',
        date: '...'
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));

      const rates = await rateService.fetchRate(mockRateRequest);

      expect(rates).toEqual({ UAH: '37.5' });
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.currencybeacon.com/v1/latest?api_key=${config.exchangeRateApiUrl}&base=USD&symbols=UAH`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      );
    });

    it('should throw an error when API responds with non-200 code', async () => {
      const mockResponseData: RateData = {
        meta: {
          code: 404,
          disclaimer: '...'
        },
        rates: {},
        response: {
          rates: {},
          date: '...',
          base: 'USD'
        },
        base: 'USD',
        date: '...'
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));

      await expect(rateService.fetchRate(mockRateRequest)).rejects.toThrow(APIError);
    });

    it('should throw give empty object when provided unprocessed base and symbols to get rate', () => {
      const mockResponseData: RateData = {
        meta: {
          code: 200,
          disclaimer: '...'
        },
        rates: {},
        response: {
          rates: {},
          date: '...',
          base: 'AAA'
        },
        base: 'AAA',
        date: '...'
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));

      void expect(rateService.fetchRate({ from: 'AAA', to: 'LLL' })).resolves.toEqual({});
    });

    it('should handle fetch errors', async () => {
      fetchMock.mockReject(new FetchError('Error getting rate from API', 'failed to fetch rate'));

      await expect(rateService.fetchRate(mockRateRequest)).rejects.toThrow(
        'Error getting rate from API'
      );
    });

    it('should handle network errors', async () => {
      fetchMock.mockReject(new Error('Network error'));

      await expect(rateService.fetchRate(mockRateRequest)).rejects.toThrow(
        'Error getting rate from API'
      );
    });
  });

  describe('convert currency', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should fetch the current rate with default parameters', async () => {
      const rate = { UAH: '39.5' };
      const mockResponseData: RateData = {
        meta: {
          code: 200,
          disclaimer: '...'
        },
        rates: { UAH: '39.5' },
        response: {
          rates: { UAH: '39.5' },
          date: '...',
          base: 'USD'
        },
        base: 'USD',
        date: '...'
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));

      const result = await rateService.getCurrentRate();

      expect(result).toEqual(rate);
      expect(logger.info).toHaveBeenCalledWith('Getting rate from USD to UAH');
      expect(logger.info).toHaveBeenCalledWith('Got rate from USD to UAH');
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.currencybeacon.com/v1/latest?api_key=${config.exchangeRateApiUrl}&base=USD&symbols=UAH`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      );
    });

    it('should fetch the current rate with custom parameters', async () => {
      const rate = { EUR: '1.3' };
      const mockResponseData: RateData = {
        meta: {
          code: 200,
          disclaimer: '...'
        },
        rates: { EUR: '1.3' },
        response: {
          rates: { EUR: '1.3' },
          date: '...',
          base: 'USD'
        },
        base: 'USD',
        date: '...'
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));

      const result = await rateService.getCurrentRate('USD', 'EUR');

      expect(result).toEqual(rate);
      expect(logger.info).toHaveBeenCalledWith('Getting rate from USD to EUR');
      expect(logger.info).toHaveBeenCalledWith('Got rate from USD to EUR');
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.currencybeacon.com/v1/latest?api_key=${config.exchangeRateApiUrl}&base=USD&symbols=EUR`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      );
    });

    it('should throw an error if there is a problem fetching the rate', async () => {
      const error = new APIError(500, 'Failed to fetch rate');

      fetchMock.mockReject(error);

      await expect(rateService.getCurrentRate()).rejects.toThrow(APIError);
      await expect(rateService.getCurrentRate()).rejects.toThrow('Error getting rate from API');
    });
  });
});
