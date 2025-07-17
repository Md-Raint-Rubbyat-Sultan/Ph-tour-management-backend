import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourServices } from "./tour.service";
import { SendResponse } from "../../utils/sendResponse";

const createTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const result = await TourServices.createTourType(name);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Tour type created successfully.",
      data: result.data,
    });
  }
);

export const TourControllers = { createTourType };
