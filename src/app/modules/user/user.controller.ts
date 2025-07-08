import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { SendResponse } from "../../utils/sendResponse";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.createUser(req.body);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully",
      data: result.data,
    });
  }
);

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUser();

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users retrive successfully",
      data: result.data,
    });
  }
);

export const UserControllers = {
  createUser,
  getAllUser,
};
