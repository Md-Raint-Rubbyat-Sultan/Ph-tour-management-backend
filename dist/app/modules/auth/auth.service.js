"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const createUserToken_1 = require("../../utils/createUserToken");
const user_model_1 = require("../user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_interface_1 = require("../user/user.interface");
const sendEmail_1 = require("../../utils/sendEmail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
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
const getAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield (0, createUserToken_1.createUserAccessTokenWithRefreshToken)(refreshToken);
    return { data: { accessToken } };
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExisted = yield user_model_1.User.findOne({ email });
    if (!isUserExisted) {
        throw new appError_1.default(404, "User do not exist.");
    }
    if (!isUserExisted.isVarified) {
        throw new appError_1.default(400, "User is not verified.");
    }
    if (isUserExisted.isActive === user_interface_1.IsActive.BLOCKED ||
        isUserExisted.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new appError_1.default(400, `User is ${isUserExisted.isActive}.`);
    }
    if (isUserExisted.isDeleted) {
        throw new appError_1.default(400, "User is deleted.");
    }
    const JwtPayload = {
        userId: isUserExisted._id,
        email: isUserExisted.email,
        role: isUserExisted.role,
    };
    const resetToken = jsonwebtoken_1.default.sign(JwtPayload, env_1.envVars.JWT_AUTH_SECRET, {
        expiresIn: "10m",
    });
    const resetUILink = `${env_1.envVars.FRONTEND_URL}/reset-password?id=${isUserExisted._id}&token=${resetToken}`;
    (0, sendEmail_1.sendEmailOptions)({
        to: email,
        subject: "Reset Password",
        templateName: "forgetPasswordTemplate",
        templateData: {
            name: isUserExisted.name,
            resetUILink,
        },
    });
});
const changePassword = (oldPassword, newPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId);
    const matchOldPassword = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!matchOldPassword) {
        throw new appError_1.default(403, "Old password does not match.");
    }
    user.password = newPassword;
    user.save();
});
const resetPassword = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.id !== decodedToken.userId) {
        throw new appError_1.default(401, "Your are unable to reset password.");
    }
    const isUsreExist = yield user_model_1.User.findById(decodedToken.userId);
    if (!isUsreExist) {
        throw new appError_1.default(401, "User does not exist");
    }
    isUsreExist.password = payload.newPassword;
    yield isUsreExist.save();
});
const setPassword = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUsreExist = yield user_model_1.User.findById(userId);
    if (!isUsreExist) {
        throw new appError_1.default(404, "User not found,");
    }
    if (isUsreExist.password &&
        isUsreExist.auth.some((providerObject) => providerObject.provider === "google")) {
        throw new appError_1.default(400, "User already has a pssword. Please login and then change the Password from user profile.");
    }
    const auths = [
        ...isUsreExist.auth,
        { provider: "credentials", providerId: isUsreExist.email },
    ];
    isUsreExist.password = payload.password;
    isUsreExist.auth = auths;
    yield isUsreExist.save();
});
exports.AuthServices = {
    // credentialLogin,
    getAccessToken,
    forgotPassword,
    changePassword,
    resetPassword,
    setPassword,
};
