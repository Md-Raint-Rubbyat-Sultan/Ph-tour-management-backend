"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse_1 = require("../utils/sendResponse");
const notFound = (req, res) => {
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 404,
        success: false,
        message: "Requested call is not valied. Route not found.",
        data: null,
    });
};
exports.default = notFound;
