import { JwtPayload } from "jsonwebtoken";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/appError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constants";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";

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
  if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
    if (userId !== decodedToken.userId) {
      throw new AppError(403, "You are forbidden to update this user.");
    }
  }

  const session = await User.startSession();
  session.startTransaction();

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
    // some error occur do not implement anything to the real data base
    await session.abortTransaction(); // rollback
    session.endSession();
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
