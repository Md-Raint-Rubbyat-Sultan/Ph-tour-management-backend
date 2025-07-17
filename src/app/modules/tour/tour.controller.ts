import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourServices } from "./tour.service";
import { SendResponse } from "../../utils/sendResponse";
import { createSlug } from "../../utils/createSlug";

// Tour-Types
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

const getAllTourTypes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await TourServices.getAllTourTypes();

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Tour type created successfully.",
      data: result.data,
    });
  }
);

const updateTourTypes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const { name } = req.body;
    const result = await TourServices.updateTourTypes(name, _id);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Tour type created successfully.",
      data: result.data,
    });
  }
);

const deleteTourTypes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const result = await TourServices.deleteTourTypes(_id);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Tour type created successfully.",
      data: result.data,
    });
  }
);

// Tour
const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.body;
    const slug = createSlug(title);

    const result = await TourServices.createTour({ title, slug, ...req.body });

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Tour type created successfully.",
      data: result.data,
    });
  }
);

const getAllTours = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await TourServices.getAllTours();

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Tour type created successfully.",
      data: result.data,
    });
  }
);

const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;

    const result = await TourServices.updateTour(_id, req.body);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Tour type created successfully.",
      data: result.data,
    });
  }
);

const deleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;

    const result = await TourServices.deleteTour(_id);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Tour type created successfully.",
      data: result.data,
    });
  }
);

export const TourControllers = {
  createTourType,
  getAllTourTypes,
  updateTourTypes,
  deleteTourTypes,
  createTour,
  getAllTours,
  updateTour,
  deleteTour,
};
