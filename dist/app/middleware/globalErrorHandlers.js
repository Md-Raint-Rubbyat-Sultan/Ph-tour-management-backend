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
exports.globalErrorHandler = void 0;
const env_1 = require("../config/env");
const appError_1 = __importDefault(require("../errorHelpers/appError"));
const sendResponse_1 = require("../utils/sendResponse");
const handleDuplicateError_1 = require("../errorHelpers/handleDuplicateError");
const handleCastError_1 = require("../errorHelpers/handleCastError");
const handleValidationError_1 = require("../errorHelpers/handleValidationError");
const handkeZodError_1 = require("../errorHelpers/handkeZodError");
const cloudinary_config_1 = require("../config/cloudinary.config");
const globalErrorHandler = (error, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let status = 500;
    let message = `Somethig went wrong`;
    if (env_1.envVars.NODE_ENV === "development") {
        console.log(error);
    }
    // image deletion from cloudinary if any error occur while creating doc to DB after uploading image
    if (req.file) {
        yield (0, cloudinary_config_1.deleteImageFromCloudinary)(req.file.path);
    }
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const images = req.files.map((file) => file.path);
        yield Promise.all(images.map((image) => (0, cloudinary_config_1.deleteImageFromCloudinary)(image)));
    }
    // Duplicate error check
    if ((error === null || error === void 0 ? void 0 : error.code) === 11000) {
        const simplefiedError = (0, handleDuplicateError_1.handleDuplicateError)(error);
        status = simplefiedError.statusCode;
        message = simplefiedError.message;
    }
    // Object id validation error check
    else if (error.name === "CastError") {
        const simplefiedError = (0, handleCastError_1.handleCastError)(error);
        status = simplefiedError.statusCode;
        message = simplefiedError.message;
    }
    // Zod error
    else if (error.name === "ZodError") {
        const simplefiedError = (0, handkeZodError_1.handkeZodError)(error);
        status = simplefiedError.statusCode;
        message = simplefiedError.message;
        error = simplefiedError.errorSources;
    }
    // validation error check
    else if (error.name === "ValidationError") {
        const simplefiedError = (0, handleValidationError_1.handleValidationError)(error);
        status = simplefiedError.statusCode;
        message = simplefiedError.message;
        error = simplefiedError.errorSources;
    }
    else if (error instanceof appError_1.default) {
        status = error.statusCode;
        message = error.message;
    }
    else if (error instanceof Error) {
        message = error.message;
    }
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: status,
        success: false,
        message,
        data: error,
        meta: env_1.envVars.NODE_ENV === "development" ? error.stack : null,
    });
});
exports.globalErrorHandler = globalErrorHandler;
