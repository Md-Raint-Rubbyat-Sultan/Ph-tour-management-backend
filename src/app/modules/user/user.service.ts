import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constants";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";

const createUser = async (payload: Partial<IUser>) => {
  const { email, ...rest } = payload;

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    ...rest,
    email,
    auth: [authProvider],
  });
  return { data: user };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(userId);

  const session = await User.startSession();
  session.startTransaction();

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

  if (!payload.picture) {
    const { picture, ...rest } = payload;
    payload = rest;
  }

  try {
    const newUpdatedUser = await User.findOneAndUpdate(
      { _id: userId },
      payload,
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    if (payload.picture && isUserExist.picture) {
      await deleteImageFromCloudinary(isUserExist.picture);
    }

    await session.commitTransaction();
    session.endSession();

    return { data: newUpdatedUser };
  } catch (error: any) {
    throw new AppError(400, `Faild to update user. ${error.message}`);
  }
};

const getAllUser = async (query: Record<string, string>) => {
  const queryElement = new QueryBuilder(User.find(), query);

  const tours = queryElement
    .search(userSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    tours.build(),
    queryElement.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleUser = async (_id: string) => {
  const user = await User.findById(_id);
  return {
    data: user,
  };
};

export const UserServices = {
  createUser,
  updateUser,
  getAllUser,
  getSingleUser,
};
