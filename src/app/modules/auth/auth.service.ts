import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { generateToken } from "../../utils/jwt";
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

  const jwtPayload = {
    userId: isUserExisted._id,
    email: isUserExisted.email,
    role: isUserExisted.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_AUTH_SECRET,
    envVars.JWT_AUTH_TIME
  );

  return {
    data: accessToken,
  };
};

export const AuthServices = {
  credentialLogin,
};
