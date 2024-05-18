import config from '../config/config';
import logger from '../config/logger';
import { Rate, RateData, RateRequest } from '../models/rate.types';
import APIError from '../utils/APIError';

export const fetchRate = async ({ from, to }: RateRequest) => {
  try {
    const response = await fetch(
      `https://api.currencybeacon.com/v1/latest?api_key=${config.exchangeRateApiUrl}&base=${from}&symbols=${to}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const responseData = (await response.json()) as RateData;

    if (responseData.meta.code !== 200) {
      throw new APIError(responseData.meta.code, 'Error getting rate from API');
    }

    return responseData.response.rates;
  } catch (error) {
    throw new APIError(500, 'Error getting rate from API');
  }
};

const getCurrentRate = async (from = 'USD', to = 'UAH') => {
  logger.info(`Getting rate from ${from} to ${to}`);

  const response: Rate = await fetchRate({ from, to });

  logger.info(`Got rate from ${from} to ${to}`);

  return response;
};

export default {
  getCurrentRate,
  fetchRate
};
