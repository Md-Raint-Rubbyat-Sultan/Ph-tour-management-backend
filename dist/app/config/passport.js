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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const env_1 = require("./env");
const user_model_1 = require("../modules/user/user.model");
const user_interface_1 = require("../modules/user/user.interface");
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUserExisted = yield user_model_1.User.findOne({ email });
        if (!isUserExisted) {
            return done(null, false, { message: "User does not exist." });
        }
        if (!isUserExisted.isVarified) {
            return done(null, false, { message: "User is not verified yet." });
        }
        if (isUserExisted.isActive === user_interface_1.IsActive.BLOCKED ||
            isUserExisted.isActive === user_interface_1.IsActive.INACTIVE) {
            return done(null, false, {
                message: `User is ${isUserExisted.isActive}.`,
            });
        }
        if (isUserExisted.isDeleted) {
            return done(null, false, { message: "User is deleted." });
        }
        const userAuthenticated = isUserExisted.auth.some((userProvider) => userProvider.provider === "google");
        if (userAuthenticated && !isUserExisted.password) {
            return done(null, false, {
                message: "This email is already authenticaed with google sign in. If you want to use it with password authentication, then login with google and the set a password to login with email password.",
            });
        }
        const isCorrectPassword = yield bcryptjs_1.default.compare(password, isUserExisted.password);
        if (!isCorrectPassword) {
            return done(null, false, { message: "Incorrect password" });
        }
        return done(null, isUserExisted);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
})));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVars.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        if (!email) {
            return done(null, false, { message: "Email not found." });
        }
        let user = yield user_model_1.User.findOne({ email });
        if (user &&
            (user.isActive === user_interface_1.IsActive.BLOCKED ||
                user.isActive === user_interface_1.IsActive.INACTIVE)) {
            return done(null, false, {
                message: `User is ${user.isActive}.`,
            });
        }
        if (user && user.isDeleted) {
            return done(null, false, { message: "User is deleted." });
        }
        if (!user) {
            user = yield user_model_1.User.create({
                email,
                name: profile.displayName,
                picture: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value,
                isVarified: true,
                auth: [{ provider: "google", providerId: profile.id }],
                role: user_interface_1.Role.USER,
            });
        }
        return done(null, user);
    }
    catch (error) {
        console.log(error);
        return done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
}));
