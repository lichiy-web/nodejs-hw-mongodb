import createHttpError from 'http-errors';
import { UserColection } from '../db/models/User';
import bcrypt from 'bcrypt';

const PWD_HASH_SALT = 10;

export const registerUser = async newUser => {
  const user = await UserColection.findOne({ email: newUser.email });
  if (!user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(newUser.password, PWD_HASH_SALT);
  return await UserColection.create({
    ...newUser,
    password: encryptedPassword,
  });
};
