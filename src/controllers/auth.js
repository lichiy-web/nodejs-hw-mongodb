import { registerUser } from '../services/auth';

export const registerUserController = async (req, res, next) => {
  const newUser = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: newUser,
  });
};
