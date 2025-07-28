"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendResponse = void 0;
const SendResponse = (res, data) => {
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        data: data.data,
        meta: (data === null || data === void 0 ? void 0 : data.meta) || null,
    });
};
exports.SendResponse = SendResponse;
