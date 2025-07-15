import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/appError";
import { createUserAccessTokenWithRefreshToken } from "../../utils/createUserToken";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";

// const credentialLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;

//   const isUserExisted = await User.findOne({ email });
//   if (!isUserExisted) {
//     throw new AppError(400, "User does not exist.");
//   }

//   const isCorrectPassword = await bcrypt.compare(
//     password as string,
//     isUserExisted.password as string
//   );

//   if (!isCorrectPassword) {
//     throw new AppError(400, "Incorrect password.");
//   }

//   const userToken = createUserToken(isUserExisted);

//   const { password: _, ...rest } = isUserExisted.toObject();

//   return {
//     data: { ...userToken, user: rest },
//   };
// };

const getAccessToken = async (refreshToken: string) => {
  const accessToken = await createUserAccessTokenWithRefreshToken(refreshToken);

  return { data: { accessToken } };
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  const matchOldPassword = await bcrypt.compare(
    oldPassword,
    user!.password as string
  );

  if (!matchOldPassword) {
    throw new AppError(403, "Old password does not match.");
  }

  user!.password = newPassword;

  user!.save();
};

export const AuthServices = {
  // credentialLogin,
  getAccessToken,
  resetPassword,
};
