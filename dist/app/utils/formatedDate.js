"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatedDate = void 0;
const formatedDate = (date) => {
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    };
    return new Date(date).toLocaleString("en-US", options);
};
exports.formatedDate = formatedDate;
