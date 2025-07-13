import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { SendResponse } from "../../utils/sendResponse";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthServices.credentialLogin(req.body);

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
};
