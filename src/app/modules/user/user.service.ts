import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";

const createUser = async (payload: Partial<IUser>) => {
  const { email, ...rest } = payload;
  const isUserExisted = await User.findOne({ email });

  if (isUserExisted) {
    throw new AppError(400, "User already exist.");
  }

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    auth: [authProvider],
    ...rest,
  });
  return { data: user };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(404, "User do not exist.");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(403, "You are forbidden to update user role.");
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(403, "You are forbidden to update this role.");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVarified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(403, "You are forbidden to update this fields.");
    }
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT)
    );
  }

  const newUpdatedUser = await User.findOneAndUpdate({ _id: userId }, payload, {
    new: true,
    runValidators: true,
  });

  return { data: newUpdatedUser };
};

const getAllUser = async () => {
  const user = await User.find({});
  return { data: user };
};

export const UserServices = {
  createUser,
  updateUser,
  getAllUser,
};
