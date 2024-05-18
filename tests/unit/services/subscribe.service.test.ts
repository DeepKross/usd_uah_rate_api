import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import prisma from '../../../src/prismaClient';
import subscribeSevice from '../../../src/services/subscribe.service';
import APIError from '../../../src/utils/APIError';

jest.mock('../../../src/prismaClient', () => ({
  __esModule: true,
  default: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn()
    }
  }
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Subscribe user by email', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should subscribe a new user', async () => {
    const email = 'test@example.com';
    const name = 'TestUser';

    (prisma.user.findUnique as jest.Mock).mockReturnValueOnce(null);
    (prisma.user.create as jest.Mock).mockReturnValueOnce({
      email,
      name,
      isSubscribed: true
    });

    const result = await subscribeSevice.subscribeUserByEmail({ email, name });

    expect(result).toEqual({
      email,
      name,
      isSubscribed: true
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email,
        name,
        isSubscribed: true
      }
    });
  });

  it('should throw an error if the email is already subscribed', async () => {
    const email = 'test@example.com';

    (prisma.user.findUnique as jest.Mock).mockReturnValue({
      email,
      name: 'ExistingUser',
      isSubscribed: true
    });

    await expect(subscribeSevice.subscribeUserByEmail({ email })).rejects.toThrow(APIError);
    await expect(subscribeSevice.subscribeUserByEmail({ email })).rejects.toThrow(
      'Email is already subscribed'
    );
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('should throw error when some unknown error occurs', async () => {
    const email = 'test@example.com';

    jest.spyOn(prisma.user, 'findUnique').mockRejectedValue(new Error('Some unknown error'));

    await expect(subscribeSevice.subscribeUserByEmail({ email })).rejects.toThrow(APIError);
    await expect(subscribeSevice.subscribeUserByEmail({ email })).rejects.toThrow(
      'Internal Server Error'
    );
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
    expect(prisma.user.create).not.toHaveBeenCalled();
  });
});
