import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { SessionCollection } from '../db/models/Session.js';
import { PWD_HASH_SALT } from '../constants/index.js';
import { createSession } from '../utils/createSession.js';
import { UserCollection } from '../db/models/User.js';
import { RES_MSG } from '../constants/contacts.js';

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
  if (!user) throw createHttpError(401, RES_MSG[401].default);

  const isPwdMatched = await bcrypt.compare(
    credentials.password,
    user.password,
  );
  if (!isPwdMatched) throw createHttpError(401, RES_MSG[401].default);

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
    throw createHttpError(401, RES_MSG[401].default, {
      details: RES_MSG[401].noSession,
    });

  const isRefreshTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isRefreshTokenExpired)
    throw createHttpError(401, RES_MSG[401].default, {
      details: RES_MSG[401].refreshTokenExpired,
    });

  const newSession = createSession(session.userId);
  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });
  return await SessionCollection.create(newSession);
};
