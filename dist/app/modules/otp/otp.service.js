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
exports.OTPServices = void 0;
const crypto_1 = __importDefault(require("crypto"));
const user_model_1 = require("../user/user.model");
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const redis_confg_1 = require("../../config/redis.confg");
const sendEmail_1 = require("../../utils/sendEmail");
const OTP_EXPIRES = 2 * 60;
const generateOTP = (length = 6) => {
    return crypto_1.default.randomInt(10 ** (length - 1), 10 ** length).toString();
};
const sendOTP = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new appError_1.default(404, "User not found.");
    }
    if (user.isVarified) {
        throw new appError_1.default(401, "You are already verified.");
    }
    const otp = generateOTP();
    const redisKey = `otp:${email}`;
    yield redis_confg_1.redisClint.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRES,
        },
    });
    (0, sendEmail_1.sendEmailOptions)({
        to: email,
        subject: "Verification OTP",
        templateName: "otp",
        templateData: {
            name,
            otp,
        },
    });
});
const verifyOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new appError_1.default(404, "User not found.");
    }
    if (user.isVarified) {
        throw new appError_1.default(401, "You are already verified.");
    }
    const redisKey = `otp:${email}`;
    const saveOTP = yield redis_confg_1.redisClint.get(redisKey);
    if (!saveOTP || saveOTP !== otp) {
        throw new appError_1.default(401, "Invalid OTP");
    }
    yield Promise.all([
        user_model_1.User.findOneAndUpdate({ email }, { isVarified: true }, { runValidators: true }),
        redis_confg_1.redisClint.del(redisKey),
    ]);
});
exports.OTPServices = {
    sendOTP,
    verifyOTP,
};
