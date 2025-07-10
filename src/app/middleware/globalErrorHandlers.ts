import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/appError";
import { SendResponse } from "../utils/sendResponse";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status = 500;
  let message = `Somethig went wrong`;

  if (error instanceof AppError) {
    status = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  SendResponse(res, {
    statusCode: status,
    success: false,
    message,
    data: error,
    meta: envVars.NODE_ENV === "development" ? error.stack : null,
  });
};
