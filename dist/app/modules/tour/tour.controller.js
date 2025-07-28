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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const tour_service_1 = require("./tour.service");
const sendResponse_1 = require("../../utils/sendResponse");
// Tour-Types
const createTourType = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const result = yield tour_service_1.TourServices.createTourType(name);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Tour type created successfully.",
        data: result.data,
    });
}));
const getAllTourTypes = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield tour_service_1.TourServices.getAllTourTypes(query);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "All tour type retrived.",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleTourTypes = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    const result = yield tour_service_1.TourServices.getSingleTourTypes(_id);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "All tour type retrived.",
        data: result.data,
    });
}));
const updateTourTypes = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    const { name } = req.body;
    const result = yield tour_service_1.TourServices.updateTourTypes(name, _id);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Tour type updated successfully.",
        data: result.data,
    });
}));
const deleteTourTypes = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    const result = yield tour_service_1.TourServices.deleteTourTypes(_id);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Tour type deleted successfully.",
        data: result.data,
    });
}));
// Tour
const createTour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = Object.assign(Object.assign({}, req.body), { images: req.files.map((file) => file.path) });
    const result = yield tour_service_1.TourServices.createTour(payload);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Tour created successfully.",
        data: result.data,
    });
}));
const getAllTours = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield tour_service_1.TourServices.getAllTours(query);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "All tours retrived.",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleTour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const result = yield tour_service_1.TourServices.getSingleTour(slug);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Single tour retrived.",
        data: result.data,
    });
}));
const updateTour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    const payload = Object.assign(Object.assign({}, req.body), { images: req.files.map((file) => file.path) });
    const result = yield tour_service_1.TourServices.updateTour(_id, payload);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Tour updated successfully.",
        data: result.data,
    });
}));
const deleteTour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    const result = yield tour_service_1.TourServices.deleteTour(_id);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Tour deleted successfully.",
        data: result.data,
    });
}));
exports.TourControllers = {
    createTourType,
    getAllTourTypes,
    getSingleTourTypes,
    updateTourTypes,
    deleteTourTypes,
    createTour,
    getAllTours,
    getSingleTour,
    updateTour,
    deleteTour,
};
