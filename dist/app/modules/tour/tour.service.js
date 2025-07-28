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
exports.TourServices = void 0;
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const tour_model_1 = require("./tour.model");
const isTourEnd_1 = require("../../utils/isTourEnd");
const tour_constants_1 = require("./tour.constants");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const booking_model_1 = require("../booking/booking.model");
const booking_interface_1 = require("../booking/booking.interface");
const cloudinary_config_1 = require("../../config/cloudinary.config");
// Tour-Types
const createTourType = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourTypeExist = yield tour_model_1.TourType.findOne({
        name: new RegExp(`^${name}$`, "i"),
    });
    if (isTourTypeExist) {
        throw new appError_1.default(400, "Tour Type already exist.");
    }
    const newTourType = yield tour_model_1.TourType.create({ name });
    return {
        data: newTourType,
    };
});
const getAllTourTypes = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryElement = new QueryBuilder_1.QueryBuilder(tour_model_1.TourType.find(), query);
    const tours = queryElement.search(["name"]).filter().sort().paginate();
    const [data, meta] = yield Promise.all([
        tours.build(),
        queryElement.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getSingleTourTypes = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const tourType = yield tour_model_1.TourType.findById(_id);
    return {
        data: tourType,
    };
});
const updateTourTypes = (name, _id) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourTypeExist = yield tour_model_1.TourType.findById(_id);
    if (!isTourTypeExist) {
        throw new appError_1.default(400, "Tour Type dose not exist.");
    }
    const updatedTourType = yield tour_model_1.TourType.findByIdAndUpdate(_id, { name });
    return {
        data: updatedTourType,
    };
});
const deleteTourTypes = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourTypeExist = yield tour_model_1.TourType.findById(_id);
    if (!isTourTypeExist) {
        throw new appError_1.default(400, "Tour Type is already deleted.");
    }
    yield (0, isTourEnd_1.handleTourDeleteWhenRefDelete)(_id, isTourTypeExist.name, "Tour-Types");
    const deletedTourType = yield tour_model_1.TourType.findByIdAndDelete(_id);
    return {
        data: deletedTourType,
    };
});
// Tour
const createTour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourExist = yield tour_model_1.Tour.findOne({ title: payload.title });
    if (isTourExist) {
        throw new appError_1.default(400, "Tour already exist.");
    }
    const newTour = yield tour_model_1.Tour.create(payload);
    return {
        data: newTour,
    };
});
const getAllTours = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryElement = new QueryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), query);
    const tours = queryElement
        .search(tour_constants_1.tourSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        tours.build(),
        queryElement.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getSingleTour = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const tour = yield tour_model_1.Tour.findOne({ slug });
    return {
        data: tour,
    };
});
const updateTour = (_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTour = yield tour_model_1.Tour.findById(_id);
    const session = yield tour_model_1.Tour.startSession();
    session.startTransaction();
    if (!existingTour) {
        throw new Error("Tour not found.");
    }
    if (payload.images &&
        payload.images.length > 0 &&
        existingTour.images &&
        existingTour.images.length > 0) {
        payload.images = [...payload.images, ...existingTour.images];
    }
    if (payload.deleteImages &&
        payload.deleteImages.length > 0 &&
        existingTour.images &&
        existingTour.images.length > 0) {
        const restDbImages = existingTour.images.filter((image) => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(image)); });
        const updatedTourImage = (payload.images || [])
            .filter((image) => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(image)); })
            .filter((image) => !restDbImages.includes(image));
        payload.images = [...updatedTourImage, ...restDbImages];
    }
    try {
        const updatedTour = yield tour_model_1.Tour.findByIdAndUpdate(_id, payload, {
            new: true,
            session,
        });
        if (payload.deleteImages &&
            payload.deleteImages.length > 0 &&
            existingTour.images &&
            existingTour.images.length > 0) {
            yield Promise.all(payload.deleteImages.map((image) => (0, cloudinary_config_1.deleteImageFromCloudinary)(image)));
        }
        yield session.commitTransaction();
        session.endSession();
        return {
            data: updatedTour,
        };
    }
    catch (error) {
        // some error occur do not implement anything to the real data base
        yield session.abortTransaction(); // rollback
        session.endSession();
        throw new appError_1.default(400, "Faild to update tour.");
    }
});
const deleteTour = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourExist = yield tour_model_1.Tour.findById(_id);
    if (!isTourExist) {
        throw new appError_1.default(400, "Tour already deleted.");
    }
    const isTourEnd = isTourExist.endDate
        ? (0, isTourEnd_1.hasTourEnds)(isTourExist.endDate)
        : false;
    if (!isTourEnd) {
        const booking = yield booking_model_1.Booking.findOne({
            tour: isTourExist._id,
            status: booking_interface_1.Booking_Status.COMPLETE,
        });
        if (booking) {
            throw new appError_1.default(400, "This tour has bookings. Refund them or wait until the tour ends to delete it.");
        }
    }
    return {
        data: yield tour_model_1.Tour.findByIdAndDelete(_id),
    };
});
exports.TourServices = {
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
