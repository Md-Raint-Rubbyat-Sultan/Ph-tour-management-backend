import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { DivisionRouter } from "../modules/division/division.route";
import { TourRouter } from "../modules/tour/tour.route";
import { BookingRouter } from "../modules/booking/booking.route";
import { PaymentRouter } from "../modules/payment/payment.route";
import { OTPRouter } from "../modules/otp/otp.route";

export const router = Router();

const modulesRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/division",
    route: DivisionRouter,
  },
  {
    path: "/tour",
    route: TourRouter,
  },
  {
    path: "/booking",
    route: BookingRouter,
  },
  {
    path: "/payment",
    route: PaymentRouter,
  },
  {
    path: "/otp",
    route: OTPRouter,
  },
];

modulesRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});
