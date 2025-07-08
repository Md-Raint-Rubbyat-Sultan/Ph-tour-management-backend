import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const user = await User.create(payload);
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
