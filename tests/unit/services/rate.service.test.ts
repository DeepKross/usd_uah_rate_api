import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import fetchMock from 'jest-fetch-mock';

import config from '../../../src/config/config';
import { RateData } from '../../../src/models/rate.types';
import rateService from '../../../src/services/rate.service';
import APIError from '../../../src/utils/APIError';

fetchMock.enableMocks();

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

      expect(rateService.fetchRate({ from: 'AAA', to: 'LLL' })).resolves.toEqual({});
    });

    it('should handle network errors', async () => {
      fetchMock.mockReject(new Error('Network error'));

      await expect(rateService.fetchRate(mockRateRequest)).rejects.toThrow('Network error');
    });
  });
});
