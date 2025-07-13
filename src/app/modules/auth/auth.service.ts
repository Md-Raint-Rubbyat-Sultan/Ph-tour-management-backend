import AppError from "../../errorHelpers/appError";
import {
  createUserAccessTokenWithRefreshToken,
  createUserToken,
} from "../../utils/createUserToken";
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

  const userToken = createUserToken(isUserExisted);

  const { password: _, ...rest } = isUserExisted.toObject();

  return {
    data: { ...userToken, user: rest },
  };
};

const getAccessToken = async (refreshToken: string) => {
  const accessToken = await createUserAccessTokenWithRefreshToken(refreshToken);

  return { data: { accessToken } };
};

export const AuthServices = {
  credentialLogin,
  getAccessToken,
};
