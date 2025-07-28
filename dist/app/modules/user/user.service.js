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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const user_constants_1 = require("./user.constants");
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = payload, rest = __rest(payload, ["email"]);
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    const user = yield user_model_1.User.create(Object.assign(Object.assign({}, rest), { email, auth: [authProvider] }));
    return { data: user };
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.GUIDE) {
        if (userId !== decodedToken.userId) {
            throw new appError_1.default(403, "You are forbidden to update this user.");
        }
    }
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new appError_1.default(404, "User do not exist.");
    }
    if (decodedToken.role === user_interface_1.Role.ADMIN &&
        isUserExist.role === user_interface_1.Role.SUPER_ADMIN) {
        throw new appError_1.default(403, "You are forbidden to update this role.");
    }
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.GUIDE) {
            throw new appError_1.default(403, "You are forbidden to update user role.");
        }
    }
    if (payload.isActive || payload.isDeleted || payload.isVarified) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.GUIDE) {
            throw new appError_1.default(403, "You are forbidden to update this fields.");
        }
    }
    if (!payload.picture) {
        const { picture } = payload, rest = __rest(payload, ["picture"]);
        payload = rest;
    }
    try {
        const newUpdatedUser = yield user_model_1.User.findOneAndUpdate({ _id: userId }, payload, {
            new: true,
            runValidators: true,
            session,
        });
        if (payload.picture && isUserExist.picture) {
            yield (0, cloudinary_config_1.deleteImageFromCloudinary)(isUserExist.picture);
        }
        yield session.commitTransaction();
        session.endSession();
        return { data: newUpdatedUser };
    }
    catch (error) {
        // some error occur do not implement anything to the real data base
        yield session.abortTransaction(); // rollback
        session.endSession();
        throw new appError_1.default(400, `Faild to update user. ${error.message}`);
    }
});
const getAllUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryElement = new QueryBuilder_1.QueryBuilder(user_model_1.User.find(), query);
    const tours = queryElement
        .search(user_constants_1.userSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        tours.build(),
        queryElement.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getMe = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(_id);
    return {
        data: user,
    };
});
const getSingleUser = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(_id);
    return {
        data: user,
    };
});
exports.UserServices = {
    createUser,
    updateUser,
    getAllUser,
    getMe,
    getSingleUser,
};
