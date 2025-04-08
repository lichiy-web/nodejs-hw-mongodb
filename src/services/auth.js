import createHttpError from 'http-errors';
import { UserColection } from '../db/models/User.js';
import bcrypt from 'bcrypt';
import { SessionCollection } from '../db/models/Session.js';
import { randomBytes } from 'node:crypto';
import {
  ACCES_TOKEN_SHELF_LIFE,
  REFRESH_TOKEN_SHELF_LIFE,
} from '../constants/index.js';

const PWD_HASH_SALT = 10;

export const registerUser = async newUser => {
  const user = await UserColection.findOne({ email: newUser.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(newUser.password, PWD_HASH_SALT);
  return await UserColection.create({
    ...newUser,
    password: encryptedPassword,
  });
};

export const itExpiresIn = period => new Date(Date.now() + period);

export const loginUser = async credentials => {
  const user = await UserColection.findOne({ email: credentials.email });
  if (!user) throw createHttpError(404, 'User not found');

  const isPwdMatched = await bcrypt.compare(
    credentials.password,
    user.password,
  );
  if (!isPwdMatched) throw createHttpError(401, 'Unauthorized');
  await SessionCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: itExpiresIn(ACCES_TOKEN_SHELF_LIFE),
    refreshTokenValidUntil: itExpiresIn(REFRESH_TOKEN_SHELF_LIFE),
  });
};
