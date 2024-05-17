import logger from '../config/logger';
import prismaClient from '../prismaClient';
import APIError from '../utils/APIError';

const getAllSubscribers = async () => {
  try {
    logger.info('Fetching all subscribers');

    const subscribers = await prismaClient.user.findMany({
      where: {
        isSubscribed: true
      }
    });

    logger.info('Fetched all subscribers');

    return subscribers;
  } catch (error) {
    throw new APIError(500, 'Error while fetching subscribers');
  }
};

export default {
  getAllSubscribers
};
