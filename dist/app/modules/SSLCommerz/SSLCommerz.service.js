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
exports.SSLServices = exports.SSLValidation = void 0;
const env_1 = require("../../config/env");
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const payment_model_1 = require("../payment/payment.model");
const SSLCommerzInit = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {
            store_id: env_1.envVars.SSL.STORE_ID,
            store_passwd: env_1.envVars.SSL.STORE_PASS,
            total_amount: payload.amount,
            currency: "BDT",
            tran_id: payload.transactionId,
            success_url: `${env_1.envVars.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
            fail_url: `${env_1.envVars.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
            cancel_url: `${env_1.envVars.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
            ipn_url: env_1.envVars.SSL.SSL_IPN_URL,
            shipping_method: "N/A",
            product_name: "Tour",
            product_category: "Service",
            product_profile: "general",
            cus_name: payload.name,
            cus_email: payload.email,
            cus_add1: payload.address,
            cus_add2: "N/A",
            cus_city: "Dhaka",
            cus_state: "Dhaka",
            cus_postcode: "1000",
            cus_country: "Bangladesh",
            cus_phone: payload.phoneNumber,
            cus_fax: "01711111111",
            ship_name: "N/A",
            ship_add1: "N/A",
            ship_add2: "N/A",
            ship_city: "N/A",
            ship_state: "N/A",
            ship_postcode: "1000",
            ship_country: "N/A",
        };
        // To convert each value of data into string
        const stringifiedData = Object.entries(data).reduce((acc, [key, value]) => {
            acc[key] = String(value);
            return acc;
        }, {});
        const fetchRes = yield fetch(env_1.envVars.SSL.SSL_PAYMENT_API, {
            method: "POST",
            body: new URLSearchParams(stringifiedData),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        return {
            data: yield fetchRes.json(),
        };
    }
    catch (error) {
        throw new appError_1.default(400, error.message);
    }
});
const SSLValidation = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield fetch(`${env_1.envVars.SSL.SSL_VALIDATION_API}?val_id=${payload.val_id}&store_id=${env_1.envVars.SSL.STORE_ID}&store_passwd=${env_1.envVars.SSL.STORE_PASS}`);
        const data = yield result.json();
        console.log("SSLValidation function", data);
        yield payment_model_1.Payment.findOneAndUpdate({ transactionId: payload.tran_id }, { paymentGatewayData: data }, { runValidators: true });
    }
    catch (error) {
        throw new appError_1.default(401, `Payment validation error: ${error.message}`);
    }
});
exports.SSLValidation = SSLValidation;
exports.SSLServices = {
    SSLCommerzInit,
};
