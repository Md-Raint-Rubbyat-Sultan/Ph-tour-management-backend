import { Booking } from "../booking/booking.model";
import { Payment_Status } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const userStats = async () => {
  const totalUserPromise = User.countDocuments();
  const totalActiveUserPromise = User.countDocuments({
    isActive: IsActive.ACTIVE,
  });
  const totalInactivePromise = User.countDocuments({
    isActive: IsActive.INACTIVE,
  });
  const totalBlockPromise = User.countDocuments({
    isActive: IsActive.BLOCKED,
  });

  const newUserLast7DaysPromise = User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });

  const newUserLast30DaysPromise = User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const userByRolePromise = User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalUser,
    totalActiveUser,
    totalInactive,
    totalBlock,
    newUserLast7Days,
    newUserLast30Days,
    userByRole,
  ] = await Promise.all([
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
};

const tourStats = async () => {
  const totalTourPromise = Tour.countDocuments();

  const totalTourByTourTypePromise = Tour.aggregate([
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

  const avgTourCostPromise = Tour.aggregate([
    {
      $group: {
        _id: null,
        avgCoastFrom: { $avg: "$costFrom" },
      },
    },
  ]);

  const totalTourByDivisionPromise = Tour.aggregate([
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

  const totalHighestBookedTourPromise = Booking.aggregate([
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

  const [
    totalTour,
    totalTourByTourType,
    avgTourCost,
    totalTourByDivision,
    totalHighestBookedTour,
  ] = await Promise.all([
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
};

const bookingStats = async () => {
  const totalBookingPromise = Booking.countDocuments();

  const totalBookingByStatusPromise = Booking.aggregate([
    {
      $group: {
        _id: "$status",
        bookingCount: { $sum: 1 },
      },
    },
  ]);

  const totalBookingPerTourPromise = Booking.aggregate([
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

  const avgGuestCountPerBookingPromise = Booking.aggregate([
    {
      $group: {
        _id: null,
        avgCount: { $avg: "$guestCount" },
      },
    },
  ]);

  const newBookingLast7DaysPromise = Booking.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });

  const newBookingLast30DaysPromise = Booking.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const totalBookingByUniqueUsersPromise = Booking.distinct("user").then(
    (user: any) => user.length
  );

  const [
    totalBooking,
    totalBookingByStatus,
    totalBookingPerTour,
    avgGuestCountPerBooking,
    newBookingLast7Days,
    newBookingLast30Days,
    totalBookingByUniqueUsers,
  ] = await Promise.all([
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
};

const paymentStats = async () => {
  const totalPaymentPromise = Payment.countDocuments();

  const totalPaymentByStatusPromise = Payment.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalRevenuePromise = Payment.aggregate([
    {
      $match: { status: Payment_Status.PAID },
    },
    {
      $group: {
        _id: null,
        count: { $sum: "$amount" },
      },
    },
  ]);

  const avgPaymentAmountPromise = Payment.aggregate([
    {
      $group: {
        _id: null,
        avgPaymentAMount: { $avg: "$amount" },
      },
    },
  ]);

  const paymentGatewayDataPromise = Payment.aggregate([
    {
      $group: {
        _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalPayment,
    totalPaymentByStatus,
    totalRevenue,
    avgPaymentAmount,
    paymentGatewayData,
  ] = await Promise.all([
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
};

export const StatsServices = {
  userStats,
  tourStats,
  bookingStats,
  paymentStats,
};
