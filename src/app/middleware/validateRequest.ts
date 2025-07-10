import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { catchAsync } from "../utils/catchAsync";

export const validateRequest = (zodSchema: AnyZodObject) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    req.body = await zodSchema.parseAsync(req.body);
    next();
  });
