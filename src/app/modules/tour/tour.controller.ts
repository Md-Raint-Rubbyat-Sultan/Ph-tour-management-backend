import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourServices } from "./tour.service";
import { SendResponse } from "../../utils/sendResponse";
import { createSlug } from "../../utils/createSlug";
import { ITour } from "./tour.interface";

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
    const query = req.query;
    const result = await TourServices.getAllTourTypes(
      query as Record<string, string>
    );

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All tour type retrived.",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getSingleTourTypes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const result = await TourServices.getSingleTourTypes(_id);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All tour type retrived.",
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
      message: "Tour type updated successfully.",
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
      message: "Tour type deleted successfully.",
      data: result.data,
    });
  }
);

// Tour
const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: ITour = {
      ...req.body,
      images: (req.files as Express.Multer.File[]).map((file) => file.path),
    };

    const result = await TourServices.createTour(payload);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Tour created successfully.",
      data: result.data,
    });
  }
);

const getAllTours = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await TourServices.getAllTours(
      query as Record<string, string>
    );

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All tours retrived.",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getSingleTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;

    const result = await TourServices.getSingleTour(slug);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Single tour retrived.",
      data: result.data,
    });
  }
);

const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const payload: ITour = {
      ...req.body,
      images: (req.files as Express.Multer.File[]).map((file) => file.path),
    };

    const result = await TourServices.updateTour(_id, payload);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Tour updated successfully.",
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
      message: "Tour deleted successfully.",
      data: result.data,
    });
  }
);

export const TourControllers = {
  createTourType,
  getAllTourTypes,
  getSingleTourTypes,
  updateTourTypes,
  deleteTourTypes,
  createTour,
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour,
};
