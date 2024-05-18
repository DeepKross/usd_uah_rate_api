import { User } from '@prisma/client';

export const userFixture: User = {
  isSubscribed: true,
  id: '1',
  email: 'example@gmail.com',
  name: 'John Doe',
  createdAt: new Date(),
  updatedAt: new Date()
};
