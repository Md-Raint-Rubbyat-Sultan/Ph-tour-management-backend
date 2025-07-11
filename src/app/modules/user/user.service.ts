import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";

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

const getAllUser = async () => {
  const user = await User.find({});
  return { data: user };
};

export const UserServices = {
  createUser,
  getAllUser,
};
