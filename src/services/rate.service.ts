import fetch, { Response } from 'node-fetch';

import config from '../config/config';
import logger from '../config/logger';
import { Rate, RateRequest } from '../models/rate.types';

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

  const responseData: Rate = (await response.json()) as Rate;

  return {
    ...responseData
  };
};

const getCurrentRate = async ({ from, to }: RateRequest) => {
  logger.info(`Getting rate from ${from} to ${to}`);

  const response: Rate = await fetchRate({ from, to });

  logger.info(`Got rate from ${from} to ${to}`);

  return response.rates;
};

export default {
  getCurrentRate
};
