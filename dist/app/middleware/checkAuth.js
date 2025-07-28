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
exports.checkAuth = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const appError_1 = __importDefault(require("../errorHelpers/appError"));
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const user_model_1 = require("../modules/user/user.model");
const user_interface_1 = require("../modules/user/user.interface");
const checkAuth = (...authRoles) => (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
        throw new appError_1.default(403, "No Token Recived.");
    }
    const verifiedToken = (0, jwt_1.verifyToken)(accessToken, env_1.envVars.JWT_AUTH_SECRET);
    const isUserExisted = yield user_model_1.User.findById(verifiedToken.userId);
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
    if (!authRoles.includes(verifiedToken.role)) {
        throw new appError_1.default(403, "You are not permited to view this route.");
    }
    req.user = verifiedToken;
    next();
}));
exports.checkAuth = checkAuth;
