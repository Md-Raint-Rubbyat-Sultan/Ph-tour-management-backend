"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be string." })
        .min(1, { message: "Name is too short." }),
    email: zod_1.default
        .string({ invalid_type_error: "Email must be string." })
        .email({ message: "Invalied email address." }),
    password: zod_1.default
        .string({ invalid_type_error: "Password must be string." })
        .min(6, { message: "Password should contain minimum 6 characters" })
        .max(32, { message: "Password should not larger than 32 character" }),
    phone: zod_1.default
        .string({ invalid_type_error: "Phone number must be string." })
        .regex(/^(?:\+8801\d{9})|01\d{9}$/, {
        message: "Invalied phone number. Formet: +8801xxxxxxxxx or 01xxxxxxxxx",
    })
        .optional(),
    address: zod_1.default
        .string({ invalid_type_error: "Address must be string." })
        .optional(),
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be string." })
        .min(1, { message: "Name is too short." })
        .optional(),
    phone: zod_1.default
        .string({ invalid_type_error: "Phone number must be string." })
        .regex(/^(?:\+8801\d[9])|01\d[9]$/, {
        message: "Invalied phone number. Formet: +8801xxxxxxxxx or 01xxxxxxxxx",
    })
        .optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
    isActive: zod_1.default.enum(Object.values(user_interface_1.IsActive)).optional(),
    isDeleted: zod_1.default
        .boolean({ invalid_type_error: "isDeketed should be true of false" })
        .optional(),
    isVarified: zod_1.default
        .boolean({ invalid_type_error: "isDeketed should be true of false" })
        .optional(),
    address: zod_1.default
        .string({ invalid_type_error: "Address must be string." })
        .optional(),
});
