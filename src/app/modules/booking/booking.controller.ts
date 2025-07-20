import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { SendResponse } from "../../utils/sendResponse";
import { BookingServices } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;

    const result = await BookingServices.createBooking(req.body, user.userId);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Booking created",
      data: result.data,
    });
  }
);

export const BookingControllers = {
  createBooking,
};
