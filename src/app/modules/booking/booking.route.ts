import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createBookingZodSchema,
  updateBookingZodSchema,
} from "./booking.validation";
import { BookingControllers } from "./booking.controller";

const router = Router();

router.post(
  "/",
  checkAuth(...Object.values(Role)),
  validateRequest(createBookingZodSchema),
  BookingControllers.createBooking
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN)
  // BookingController.getAllBookings
);

router.get(
  "/my-bookings",
  checkAuth(...Object.values(Role))
  // BookingController.getUserBookings
);

router.get(
  "/:bookingId",
  checkAuth(...Object.values(Role))
  // BookingController.getSingleBooking
);

router.patch(
  "/:bookingId/status",
  checkAuth(...Object.values(Role)),
  validateRequest(updateBookingZodSchema)
  // BookingController.updateBookingStatus
);

export const BookingRouter = router;
