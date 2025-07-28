"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const division_route_1 = require("../modules/division/division.route");
const tour_route_1 = require("../modules/tour/tour.route");
const booking_route_1 = require("../modules/booking/booking.route");
const payment_route_1 = require("../modules/payment/payment.route");
const otp_route_1 = require("../modules/otp/otp.route");
const stats_route_1 = require("../modules/stats/stats.route");
exports.router = (0, express_1.Router)();
const modulesRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRouter,
    },
    {
        path: "/division",
        route: division_route_1.DivisionRouter,
    },
    {
        path: "/tour",
        route: tour_route_1.TourRouter,
    },
    {
        path: "/booking",
        route: booking_route_1.BookingRouter,
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentRouter,
    },
    {
        path: "/otp",
        route: otp_route_1.OTPRouter,
    },
    {
        path: "/stats",
        route: stats_route_1.StatsRoute,
    },
];
modulesRoutes.forEach(({ path, route }) => {
    exports.router.use(path, route);
});
