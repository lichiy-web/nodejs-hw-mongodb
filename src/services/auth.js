import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { SessionCollection } from '../db/models/Session.js';
import { PWD_HASH_SALT } from '../constants/index.js';
import { createSession } from '../utils/createSession.js';
import { UserCollection } from '../db/models/User.js';

export const registerUser = async newUser => {
  const user = await UserCollection.findOne({ email: newUser.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(newUser.password, PWD_HASH_SALT);
  return await UserCollection.create({
    ...newUser,
    password: encryptedPassword,
  });
};

export const loginUser = async credentials => {
  const user = await UserCollection.findOne({ email: credentials.email });
  if (!user) throw createHttpError(404, 'User not found');

  const isPwdMatched = await bcrypt.compare(
    credentials.password,
    user.password,
  );
  if (!isPwdMatched) throw createHttpError(401, 'Unauthorized');

  await SessionCollection.deleteOne({ userId: user._id });
  const newSession = createSession(user._id);
  return await SessionCollection.create(newSession);
};

export const logoutUser = sessionId =>
  SessionCollection.deleteOne({ _id: sessionId });

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session)
    throw createHttpError(401, 'Unauthorized', {
      details: `Session not found`,
    });

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired)
    throw createHttpError(401, 'Unauthorized', {
      details: `Session token expired`,
    });

  const newSession = createSession(session.userId);
  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });
  return await SessionCollection.create(newSession);
};
