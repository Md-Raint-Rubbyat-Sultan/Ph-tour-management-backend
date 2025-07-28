"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDivisionZodSchema = exports.createDivisioZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createDivisioZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be a string." })
        .min(1, { message: "Name is too short." }),
    description: zod_1.default
        .string({ invalid_type_error: "Description must be a string." })
        .optional(),
});
exports.updateDivisionZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be a string." })
        .min(1, { message: "Name is too short." })
        .optional(),
    description: zod_1.default
        .string({ invalid_type_error: "Description must be a string." })
        .optional(),
});
