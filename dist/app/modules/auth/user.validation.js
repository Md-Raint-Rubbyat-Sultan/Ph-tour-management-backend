"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordZodSchema = exports.forgotPasswordZodSchema = exports.changeUserPasswordZodSchema = exports.setUserPasswordZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.setUserPasswordZodSchema = zod_1.default.object({
    password: zod_1.default
        .string({ invalid_type_error: "Password must be string." })
        .min(6, { message: "Password should contain minimum 6 characters" })
        .max(32, { message: "Password should not larger than 32 character" }),
});
exports.changeUserPasswordZodSchema = zod_1.default.object({
    oldPassword: zod_1.default.string(),
    newPassword: zod_1.default
        .string({ invalid_type_error: "Password must be string." })
        .min(6, { message: "Password should contain minimum 6 characters" })
        .max(32, { message: "Password should not larger than 32 character" }),
});
exports.forgotPasswordZodSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
});
exports.resetPasswordZodSchema = zod_1.default.object({
    id: zod_1.default.string(),
    newPassword: zod_1.default.string(),
});
