import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { SendResponse } from "../../utils/sendResponse";
import { setAuthCookies } from "../../utils/setCookies";
import AppError from "../../errorHelpers/appError";
import { envVars } from "../../config/env";

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

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "lax",
    });

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User Loged out successfully",
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body;
    const decodedToken = req.user;

    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password changed successfully",
      data: null,
    });
  }
);

export const AuthControllers = {
  credentialLogin,
  getAccessToken,
  logout,
  resetPassword,
};
