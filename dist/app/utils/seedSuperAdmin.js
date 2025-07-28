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
exports.seedSuperAdmin = void 0;
const env_1 = require("../config/env");
const appError_1 = __importDefault(require("../errorHelpers/appError"));
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSuperAdmin = yield user_model_1.User.findOne({
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
        });
        if (isSuperAdmin) {
            console.log("Super admin already exist.");
            return;
        }
        const authProvider = {
            provider: "credentials",
            providerId: env_1.envVars.SUPER_ADMIN_EMAIL,
        };
        const superAdminPayload = {
            name: "Super_Admin",
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
            password: env_1.envVars.SUPER_ADMIN_PASSWORD,
            role: user_interface_1.Role.SUPER_ADMIN,
            isVarified: true,
            auth: [authProvider],
        };
        const superAdmin = yield user_model_1.User.create(superAdminPayload);
        console.log(superAdmin);
    }
    catch (error) {
        console.log(error);
        throw new appError_1.default(400, "Faild to create super admin.");
    }
});
exports.seedSuperAdmin = seedSuperAdmin;
