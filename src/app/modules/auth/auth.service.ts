import AppError from "../../errorHelpers/appError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExisted = await User.findOne({ email });
  if (!isUserExisted) {
    throw new AppError(400, "User already exist.");
  }

  const isCorrectPassword = await bcrypt.compare(
    password as string,
    isUserExisted.password as string
  );

  if (!isCorrectPassword) {
    throw new AppError(400, "Incorrect password.");
  }

  return {
    data: email,
  };
};

export const AuthServices = {
  credentialLogin,
};
