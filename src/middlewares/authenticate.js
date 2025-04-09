import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/Session.js';
import { UserColection } from '../db/models/User.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    next(
      createHttpError(401, 'Unauthorized', {
        details: 'Please provide Authorization header',
      }),
    );
    return;
  }

  const [authType, accessToken] = authHeader.split(' ');
  if (authType !== 'Bearer' || !accessToken) {
    next(
      createHttpError(401, 'Unauthorized', {
        details: 'Auth header should be of type Bearer',
      }),
    );
    return;
  }

  const session = await SessionCollection.findOne({ accessToken });
  if (!session) {
    next(
      createHttpError(401, 'Unauthorized', {
        details: 'Session not found',
      }),
    );
    return;
  }

  const isSessionExpired = new Date() > new Date(session.accessTokenValidUntil);
  if (isSessionExpired) {
    next(
      createHttpError(401, 'Unauthorized', {
        details: 'Access token expired',
      }),
    );
    return;
  }

  const user = await UserColection.findById(session.userId);
  if (!user) {
    next(
      createHttpError(401, 'Unauthorized', {
        details: 'User not found',
      }),
    );
    return;
  }

  req.user = user;
  next();
};
