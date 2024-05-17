import fetch, { Response } from 'node-fetch';

import config from '../config/config';
import logger from '../config/logger';
import { Rate, RateData, RateRequest } from '../models/rate.types';
import APIError from '../utils/APIError';

const fetchRate = async ({ from, to }: RateRequest) => {
  const response: Response = await fetch(
    `https://api.currencybeacon.com/v1/latest?api_key=${config.exchangeRateApiUrl}&base=${from}&symbols=${to}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  const responseData: RateData = (await response.json()) as RateData;

  if (responseData.meta.code !== 200) {
    throw new APIError(responseData.meta.code, 'Error getting rate from API');
  }

  return responseData.response.rates;
};

const getCurrentRate = async (from = 'USD', to = 'UAH') => {
  logger.info(`Getting rate from ${from} to ${to}`);

  const response: Rate = await fetchRate({ from, to });

  logger.info(`Got rate from ${from} to ${to}`);

  return response;
};

export default {
  getCurrentRate
};
