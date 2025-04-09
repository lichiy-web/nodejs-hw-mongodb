import createHttpError from 'http-errors';
import { UserColection } from '../db/models/User.js';
import bcrypt from 'bcrypt';
import { SessionCollection } from '../db/models/Session.js';
import { PWD_HASH_SALT } from '../constants/index.js';
import { createSession } from '../utils/createSession.js';

// export const itExpiresIn = period => new Date(Date.now() + period);

// const createSession = userId => {
//   console.log(`createSession => userId: `, userId);
//   const accessToken = randomBytes(TOKEN_LENGTH).toString('base64');
//   const refreshToken = randomBytes(TOKEN_LENGTH).toString('base64');

//   return {
//     userId,
//     accessToken,
//     refreshToken,
//     accessTokenValidUntil: itExpiresIn(ACCES_TOKEN_SHELF_LIFE),
//     refreshTokenValidUntil: itExpiresIn(REFRESH_TOKEN_SHELF_LIFE),
//   };
// };

export const registerUser = async newUser => {
  const user = await UserColection.findOne({ email: newUser.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(newUser.password, PWD_HASH_SALT);
  return await UserColection.create({
    ...newUser,
    password: encryptedPassword,
  });
};

export const loginUser = async credentials => {
  const user = await UserColection.findOne({ email: credentials.email });
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
