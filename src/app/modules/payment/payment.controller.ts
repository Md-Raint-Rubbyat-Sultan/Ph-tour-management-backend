import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentServices } from "./payment.service";
import { envVars } from "../../config/env";
import { SendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { SSLValidation } from "../SSLCommerz/SSLCommerz.service";

const initPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.params.bookingId;
    const result = await PaymentServices.initPayment(bookingId);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Payment angain.",
      data: result.data,
    });
  }
);

const successPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await PaymentServices.successPayment(
      query as Record<string, string>
    );

    if (result.success) {
      res.redirect(
        `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}`
      );
    }
  }
);

const failedPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await PaymentServices.failedPayment(
      query as Record<string, string>
    );

    if (!result.success) {
      res.redirect(
        `${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}`
      );
    }
  }
);

const cancelPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await PaymentServices.cancelPayment(
      query as Record<string, string>
    );

    if (!result.success) {
      res.redirect(
        `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}`
      );
    }
  }
);

const getPDFDownloadLink = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const { userId } = req.user as JwtPayload;

    const result = await PaymentServices.getPDFDownloadLink(_id, userId);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "PDF Link retrive.",
      data: result.data,
    });
  }
);

const validatePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await SSLValidation(req.body);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "validation send.",
      data: null,
    });
  }
);

export const PaymentControllers = {
  initPayment,
  successPayment,
  failedPayment,
  cancelPayment,
  getPDFDownloadLink,
  validatePayment,
};
