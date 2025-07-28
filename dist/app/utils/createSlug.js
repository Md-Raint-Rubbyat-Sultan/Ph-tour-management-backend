"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSlug = void 0;
const createSlug = (name) => {
    return name.toLowerCase().split(" ").join("-");
};
exports.createSlug = createSlug;
