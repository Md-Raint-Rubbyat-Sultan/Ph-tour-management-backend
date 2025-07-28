"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionId = void 0;
const createTransactionId = () => `trans_${Date.now()}_${Math.floor(Math.random() * 1000)}}`;
exports.createTransactionId = createTransactionId;
