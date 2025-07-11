import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import z, { AnyZodObject } from "zod";
import { createUserZodSchema } from "./user.validation";
import { catchAsync } from "../../utils/catchAsync";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);

router.get("/", UserControllers.getAllUser);

export const UserRoutes = router;
