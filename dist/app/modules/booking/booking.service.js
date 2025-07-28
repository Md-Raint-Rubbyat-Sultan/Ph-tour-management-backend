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
exports.BookingServices = void 0;
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const createTransaction_1 = require("../../utils/createTransaction");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const SSLCommerz_service_1 = require("../SSLCommerz/SSLCommerz.service");
const tour_model_1 = require("../tour/tour.model");
const user_model_1 = require("../user/user.model");
const booking_interface_1 = require("./booking.interface");
const booking_model_1 = require("./booking.model");
const createBooking = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const transactionId = (0, createTransaction_1.createTransactionId)();
    //   transaction rollback
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    const user = yield user_model_1.User.findById(userId);
    if (!(user === null || user === void 0 ? void 0 : user.phone) || !(user === null || user === void 0 ? void 0 : user.address)) {
        throw new appError_1.default(400, "Pleasr update your phone number and address from your profile to book a tour.");
    }
    const tourCoast = yield tour_model_1.Tour.findById(payload.tour).select("costFrom");
    if (!(tourCoast === null || tourCoast === void 0 ? void 0 : tourCoast.costFrom)) {
        throw new appError_1.default(400, "Tour coast not found!");
    }
    const amount = Number(tourCoast === null || tourCoast === void 0 ? void 0 : tourCoast.costFrom) * Number(payload.guestCount);
    try {
        const booking = yield booking_model_1.Booking.create([
            Object.assign(Object.assign({}, payload), { user: userId, status: booking_interface_1.Booking_Status.PENDING }),
        ], { session });
        const payment = yield payment_model_1.Payment.create([
            {
                booking: booking[0]._id,
                transactionId,
                status: payment_interface_1.Payment_Status.UNPAID,
                amount,
            },
        ], { session });
        const updateBooking = yield booking_model_1.Booking.findByIdAndUpdate(booking[0]._id, { payment: payment[0]._id }, { new: true, runValidators: true, session })
            .populate("user", "name email phone address")
            .populate("tour", "title costFrom description")
            .populate("payment");
        const userInfo = updateBooking === null || updateBooking === void 0 ? void 0 : updateBooking.user;
        const SSLPayload = {
            address: userInfo.address,
            amount,
            email: userInfo.email,
            name: userInfo.name,
            phoneNumber: userInfo.phone,
            transactionId,
        };
        const SSLPayment = yield SSLCommerz_service_1.SSLServices.SSLCommerzInit(SSLPayload);
        // everything works fine so that implement all in real db
        yield session.commitTransaction(); // transaction
        session.endSession();
        return {
            data: {
                booking: updateBooking,
                payment: ((_a = SSLPayment.data) === null || _a === void 0 ? void 0 : _a.GatewayPageURL) || "Faild to payment",
            },
        };
    }
    catch (error) {
        // some error occur do not implement anything to the real data base
        yield session.abortTransaction(); // rollback
        session.endSession();
        throw error;
    }
});
const getAllBookings = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryElement = new QueryBuilder_1.QueryBuilder(booking_model_1.Booking.find(), query);
    const bookings = queryElement.filter().sort().fields().paginate();
    const [data, meta] = yield Promise.all([
        bookings.build(),
        queryElement.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getUserBookings = (query, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryElement = new QueryBuilder_1.QueryBuilder(booking_model_1.Booking.find({ user: userId }), query);
    const bookings = queryElement.filter().sort().fields().paginate();
    const [data, meta] = yield Promise.all([
        bookings.build(),
        queryElement.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getSingleBooking = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const singleBooking = yield booking_model_1.Booking.findById(_id);
    return {
        data: singleBooking,
    };
});
const updateBookingStatus = (_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isBookingExist = yield booking_model_1.Booking.findById(_id);
    if (!isBookingExist) {
        throw new appError_1.default(400, "No Booking exist to update.");
    }
    const updatedBooking = yield booking_model_1.Booking.findByIdAndUpdate(_id, payload, {
        new: true,
        runValidators: true,
    });
    return {
        data: updatedBooking,
    };
});
exports.BookingServices = {
    createBooking,
    getAllBookings,
    getUserBookings,
    getSingleBooking,
    updateBookingStatus,
};
