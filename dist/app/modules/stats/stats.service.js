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
exports.StatsServices = void 0;
const booking_model_1 = require("../booking/booking.model");
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const tour_model_1 = require("../tour/tour.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const userStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUserPromise = user_model_1.User.countDocuments();
    const totalActiveUserPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.IsActive.ACTIVE,
    });
    const totalInactivePromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.IsActive.INACTIVE,
    });
    const totalBlockPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.IsActive.BLOCKED,
    });
    const newUserLast7DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const newUserLast30DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const userByRolePromise = user_model_1.User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 },
            },
        },
    ]);
    const [totalUser, totalActiveUser, totalInactive, totalBlock, newUserLast7Days, newUserLast30Days, userByRole,] = yield Promise.all([
        totalUserPromise,
        totalActiveUserPromise,
        totalInactivePromise,
        totalBlockPromise,
        newUserLast7DaysPromise,
        newUserLast30DaysPromise,
        userByRolePromise,
    ]);
    return {
        data: {
            totalUser,
            totalActiveUser,
            totalInactive,
            totalBlock,
            newUserLast7Days,
            newUserLast30Days,
            userByRole,
        },
    };
});
const tourStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalTourPromise = tour_model_1.Tour.countDocuments();
    const totalTourByTourTypePromise = tour_model_1.Tour.aggregate([
        {
            $lookup: {
                from: "tourtypes",
                foreignField: "_id",
                localField: "tourType",
                as: "type",
            },
        },
        {
            $unwind: "$type",
        },
        {
            $group: {
                _id: "$type.name",
                count: { $sum: 1 },
            },
        },
    ]);
    const avgTourCostPromise = tour_model_1.Tour.aggregate([
        {
            $group: {
                _id: null,
                avgCoastFrom: { $avg: "$costFrom" },
            },
        },
    ]);
    const totalTourByDivisionPromise = tour_model_1.Tour.aggregate([
        {
            $lookup: {
                from: "divisions",
                foreignField: "_id",
                localField: "division",
                as: "division",
            },
        },
        {
            $unwind: "$division",
        },
        {
            $group: {
                _id: "$division.name",
                count: { $sum: 1 },
            },
        },
    ]);
    const totalHighestBookedTourPromise = booking_model_1.Booking.aggregate([
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 },
            },
        },
        {
            $sort: { bookingCount: -1 },
        },
        {
            $limit: 5,
        },
        {
            $lookup: {
                from: "tours",
                let: { tourId: "_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["_id", "$$tourId"] },
                        },
                    },
                ],
                as: "tour",
            },
        },
        {
            $unwind: "$tour",
        },
        {
            $project: {
                bookingCount: 1,
                "tour.title": 1,
                "tour.slug": 1,
            },
        },
    ]);
    const [totalTour, totalTourByTourType, avgTourCost, totalTourByDivision, totalHighestBookedTour,] = yield Promise.all([
        totalTourPromise,
        totalTourByTourTypePromise,
        avgTourCostPromise,
        totalTourByDivisionPromise,
        totalHighestBookedTourPromise,
    ]);
    return {
        data: {
            totalTour,
            totalTourByTourType,
            avgTourCost,
            totalTourByDivision,
            totalHighestBookedTour,
        },
    };
});
const bookingStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalBookingPromise = booking_model_1.Booking.countDocuments();
    const totalBookingByStatusPromise = booking_model_1.Booking.aggregate([
        {
            $group: {
                _id: "$status",
                bookingCount: { $sum: 1 },
            },
        },
    ]);
    const totalBookingPerTourPromise = booking_model_1.Booking.aggregate([
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 },
            },
        },
        {
            $sort: { bookingCount: -1 },
        },
        {
            $limit: 10,
        },
        {
            $lookup: {
                from: "tours",
                foreignField: "_id",
                localField: "_id",
                as: "tour",
            },
        },
        {
            $unwind: "$tour",
        },
        {
            $project: {
                _id: 1,
                bookingCount: 1,
                "tour.title": 1,
                "tour.slug": 1,
            },
        },
    ]);
    const avgGuestCountPerBookingPromise = booking_model_1.Booking.aggregate([
        {
            $group: {
                _id: null,
                avgCount: { $avg: "$guestCount" },
            },
        },
    ]);
    const newBookingLast7DaysPromise = booking_model_1.Booking.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const newBookingLast30DaysPromise = booking_model_1.Booking.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const totalBookingByUniqueUsersPromise = booking_model_1.Booking.distinct("user").then((user) => user.length);
    const [totalBooking, totalBookingByStatus, totalBookingPerTour, avgGuestCountPerBooking, newBookingLast7Days, newBookingLast30Days, totalBookingByUniqueUsers,] = yield Promise.all([
        totalBookingPromise,
        totalBookingByStatusPromise,
        totalBookingPerTourPromise,
        avgGuestCountPerBookingPromise,
        newBookingLast7DaysPromise,
        newBookingLast30DaysPromise,
        totalBookingByUniqueUsersPromise,
    ]);
    return {
        data: {
            totalBooking,
            totalBookingByStatus,
            totalBookingPerTour,
            avgGuestCountPerBooking,
            newBookingLast7Days,
            newBookingLast30Days,
            totalBookingByUniqueUsers,
        },
    };
});
const paymentStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalPaymentPromise = payment_model_1.Payment.countDocuments();
    const totalPaymentByStatusPromise = payment_model_1.Payment.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    const totalRevenuePromise = payment_model_1.Payment.aggregate([
        {
            $match: { status: payment_interface_1.Payment_Status.PAID },
        },
        {
            $group: {
                _id: null,
                count: { $sum: "$amount" },
            },
        },
    ]);
    const avgPaymentAmountPromise = payment_model_1.Payment.aggregate([
        {
            $group: {
                _id: null,
                avgPaymentAMount: { $avg: "$amount" },
            },
        },
    ]);
    const paymentGatewayDataPromise = payment_model_1.Payment.aggregate([
        {
            $group: {
                _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
                count: { $sum: 1 },
            },
        },
    ]);
    const [totalPayment, totalPaymentByStatus, totalRevenue, avgPaymentAmount, paymentGatewayData,] = yield Promise.all([
        totalPaymentPromise,
        totalPaymentByStatusPromise,
        totalRevenuePromise,
        avgPaymentAmountPromise,
        paymentGatewayDataPromise,
    ]);
    return {
        data: {
            totalPayment,
            totalPaymentByStatus,
            totalRevenue,
            avgPaymentAmount,
            paymentGatewayData,
        },
    };
});
exports.StatsServices = {
    userStats,
    tourStats,
    bookingStats,
    paymentStats,
};
