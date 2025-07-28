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
exports.handleTourDeleteWhenRefDelete = exports.hasTourEnds = void 0;
const appError_1 = __importDefault(require("../errorHelpers/appError"));
const tour_model_1 = require("../modules/tour/tour.model");
const hasTourEnds = (endDate) => {
    return Date.now() > new Date(endDate).getTime();
};
exports.hasTourEnds = hasTourEnds;
const handleTourDeleteWhenRefDelete = (_id, name, linkedTo) => __awaiter(void 0, void 0, void 0, function* () {
    const toursWithoutEndDate = [];
    const toursDidNotEndYet = [];
    const isToursExist = yield tour_model_1.Tour.find({
        division: _id,
    });
    if (isToursExist.length > 0) {
        isToursExist.forEach((isTourExist) => {
            if (!isTourExist.endDate) {
                toursWithoutEndDate.push(isTourExist.title);
            }
            const isTourEnd = isTourExist.endDate
                ? (0, exports.hasTourEnds)(isTourExist.endDate)
                : false;
            if (!isTourEnd) {
                toursDidNotEndYet.push(isTourExist.title);
            }
        });
        if (toursWithoutEndDate.length > 0) {
            throw new appError_1.default(400, `${toursWithoutEndDate.join(", ")} tours are linked to this ${linkedTo}: ${name}. But tours end date are not spacified yet. Wait until it ends or remove the tours ${toursWithoutEndDate.join(", ")} first.`);
        }
        if (toursDidNotEndYet.length > 0) {
            throw new appError_1.default(400, `${toursDidNotEndYet.join(", ")} tour is linked to this ${linkedTo}: ${name}. Wait until the tour ends or remove the tour.`);
        }
        const result = yield tour_model_1.Tour.deleteMany({ division: _id });
        console.log(result);
    }
});
exports.handleTourDeleteWhenRefDelete = handleTourDeleteWhenRefDelete;
