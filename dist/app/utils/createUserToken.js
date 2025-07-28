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
exports.createUserAccessTokenWithRefreshToken = exports.createUserToken = void 0;
const user_interface_1 = require("../modules/user/user.interface");
const jwt_1 = require("./jwt");
const env_1 = require("../config/env");
const appError_1 = __importDefault(require("../errorHelpers/appError"));
const user_model_1 = require("../modules/user/user.model");
const createUserToken = (user) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_AUTH_SECRET, env_1.envVars.JWT_AUTH_TIME);
    const refreshToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_AUTH_REFRESH_SECRET, env_1.envVars.JWT_AUTH_REFRESH_TIME);
    return {
        accessToken,
        refreshToken,
    };
};
exports.createUserToken = createUserToken;
const createUserAccessTokenWithRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedRefreshToken = (0, jwt_1.verifyToken)(refreshToken, env_1.envVars.JWT_AUTH_REFRESH_SECRET);
    const isUserExisted = yield user_model_1.User.findById(verifiedRefreshToken.userId);
    if (!isUserExisted) {
        throw new appError_1.default(404, "User do not exist.");
    }
    if (isUserExisted.isActive === user_interface_1.IsActive.BLOCKED ||
        isUserExisted.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new appError_1.default(400, `User is ${isUserExisted.isActive}.`);
    }
    if (isUserExisted.isDeleted) {
        throw new appError_1.default(400, "User do not exist.");
    }
    const jwtPayload = {
        userId: isUserExisted._id,
        email: isUserExisted.email,
        role: isUserExisted.role,
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_AUTH_SECRET, env_1.envVars.JWT_AUTH_TIME);
    return accessToken;
});
exports.createUserAccessTokenWithRefreshToken = createUserAccessTokenWithRefreshToken;
