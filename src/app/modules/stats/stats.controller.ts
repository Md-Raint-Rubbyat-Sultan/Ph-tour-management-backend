import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { SendResponse } from "../../utils/sendResponse";
import { StatsServices } from "./stats.service";

const userStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StatsServices.userStats();

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User stats retrive successfully.",
      data: result.data,
    });
  }
);

const tuorStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StatsServices.tourStats();

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "tuor stats retrive successfully.",
      data: result.data,
    });
  }
);

const bookingStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StatsServices.bookingStats();

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "booking stats retrive successfully.",
      data: result.data,
    });
  }
);

const paymentStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StatsServices.paymentStats();

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "payment stats retrive successfully.",
      data: result.data,
    });
  }
);

export const StatsControllers = {
  userStats,
  bookingStats,
  tuorStats,
  paymentStats,
};
