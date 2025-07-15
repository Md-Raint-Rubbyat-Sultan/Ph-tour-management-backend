import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/appError";
import { SendResponse } from "../utils/sendResponse";
import { TErrorSources } from "../interfaces/globalErrorHandler";
import { handleDuplicateError } from "../errorHelpers/handleDuplicateError";
import { handleCastError } from "../errorHelpers/handleCastError";
import { handleValidationError } from "../errorHelpers/handleValidationError";
import { handkeZodError } from "../errorHelpers/handkeZodError";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status = 500;
  let message = `Somethig went wrong`;

  if (envVars.NODE_ENV === "development") {
    console.log(error);
  }

  // Duplicate error check
  if (error?.code === 11000) {
    const simplefiedError = handleDuplicateError(error);
    status = simplefiedError.statusCode;
    message = simplefiedError.message;
  }
  // Object id validation error check
  else if (error.name === "CastError") {
    const simplefiedError = handleCastError(error);
    status = simplefiedError.statusCode;
    message = simplefiedError.message;
  }
  // Zod error
  else if (error.name === "ZodError") {
    const simplefiedError = handkeZodError(error);
    status = simplefiedError.statusCode;
    message = simplefiedError.message;
    error = simplefiedError.errorSources as TErrorSources[];
  }
  // validation error check
  else if (error.name === "ValidationError") {
    const simplefiedError = handleValidationError(error);
    status = simplefiedError.statusCode;
    message = simplefiedError.message;
    error = simplefiedError.errorSources as TErrorSources[];
  } else if (error instanceof AppError) {
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
