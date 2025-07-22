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

const getAllBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;

    const result = await BookingServices.getAllBookings(query);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Booking created",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getUserBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;
    const user = req.user as JwtPayload;

    const result = await BookingServices.getUserBookings(query, user.userId);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Booking created",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getSingleBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;

    const result = await BookingServices.getSingleBooking(_id);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Booking created",
      data: result.data,
    });
  }
);

const updateBookingStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;

    const result = await BookingServices.updateBookingStatus(_id, req.body);

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
  getAllBookings,
  getUserBookings,
  getSingleBooking,
  updateBookingStatus,
};
