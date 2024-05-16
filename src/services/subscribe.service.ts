import { SubscribeUserByEmail } from '../models/subscribe.types';
import prismaClient from '../prismaClient';
import APIError from '../utils/APIError';

const subscribeUserByEmail = async ({ email, name = 'NewUser' }: SubscribeUserByEmail) => {
  try {
    const user = await prismaClient.user.findUnique({
      where: {
        email
      }
    });

    if (user) {
      throw new APIError(409, 'Email is already subscribed');
    }

    const subscribedUser = await prismaClient.user.create({
      data: {
        email,
        name,
        isSubscribed: true
      }
    });

    return subscribedUser;
  } catch (error) {
    if (error instanceof APIError) {
      throw error; // Rethrow custom API errors
    }

    throw new APIError(500, 'Internal Server Error');
  }
};

export default {
  subscribeUserByEmail
};
