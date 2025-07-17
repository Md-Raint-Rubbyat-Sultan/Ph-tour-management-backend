import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DivisionServices } from "./division.service";
import { SendResponse } from "../../utils/sendResponse";
import { createSlug } from "../../utils/createSlug";

const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const divisionInfo = req.body;
    const slug = createSlug(divisionInfo.name);

    const result = await DivisionServices.createDivision({
      ...divisionInfo,
      slug,
    });

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Division created",
      data: result.data,
    });
  }
);

const getAllDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await DivisionServices.getAllDivision();

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Division retrived successfully",
      data: result.data,
    });
  }
);

const updateDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const divisionInfo = req.body;
    const newSlug = divisionInfo?.name
      ? createSlug(divisionInfo?.name)
      : divisionInfo?.slug;

    const result = await DivisionServices.updateDivision(_id, {
      slug: newSlug,
      ...divisionInfo,
    });

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Division updated successfully.",
      data: result.data,
    });
  }
);

const deleteDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;

    const result = await DivisionServices.deleteDivision(_id);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Division delete successful.",
      data: result.data,
    });
  }
);

export const DivisionControllers = {
  createDivision,
  getAllDivision,
  updateDivision,
  deleteDivision,
};
