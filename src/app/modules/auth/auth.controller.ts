import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { SendResponse } from "../../utils/sendResponse";
import { setAuthCookies } from "../../utils/setCookies";
import AppError from "../../errorHelpers/appError";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthServices.credentialLogin(req.body);

    setAuthCookies(res, result.data);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User Loged in successfully",
      data: result.data,
    });
  }
);

const getAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(404, "Refresh Token not found.");
    }

    const result = await AuthServices.getAccessToken(refreshToken);

    setAuthCookies(res, result.data);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User Loged in successfully",
      data: result.data,
    });
  }
);

export const AuthControllers = {
  credentialLogin,
  getAccessToken,
};
