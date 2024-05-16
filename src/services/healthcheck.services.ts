import logger from '../config/logger';

export const getHealthcheckMsg = () => {
  logger.info('Server is up and running!');

  return 'Server is up and running!';
};
