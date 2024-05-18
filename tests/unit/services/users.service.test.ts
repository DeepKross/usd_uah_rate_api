import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import logger from '../../../src/config/logger';
import prisma from '../../../src/prismaClient';
import userService from '../../../src/services/users.service';
import APIError from '../../../src/utils/APIError';

jest.mock('../../../src/prismaClient', () => ({
  __esModule: true,
  default: {
    user: {
      findMany: jest.fn()
    }
  }
}));

jest.mock('../../../src/config/logger', () => ({
  info: jest.fn()
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Get all subscribers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all subscribers successfully', async () => {
    const subscribers = [
      { email: 'user1@example.com', name: 'User1', isSubscribed: true },
      { email: 'user2@example.com', name: 'User2', isSubscribed: true }
    ];

    (prisma.user.findMany as jest.Mock).mockReturnValue(subscribers);

    const result = await userService.getAllSubscribers();

    expect(result).toEqual(subscribers);
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: { isSubscribed: true }
    });
    expect(logger.info).toHaveBeenCalledWith('Fetching all subscribers');
    expect(logger.info).toHaveBeenCalledWith('Fetched all subscribers');
  });

  it('should throw an error if there is a problem fetching subscribers', async () => {
    const error = new APIError(500, 'Database error');

    jest.spyOn(prisma.user, 'findMany').mockRejectedValue(error);

    await expect(userService.getAllSubscribers()).rejects.toThrow(APIError);
    await expect(userService.getAllSubscribers()).rejects.toThrow(
      'Error while fetching subscribers'
    );
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: { isSubscribed: true }
    });
  });
});
