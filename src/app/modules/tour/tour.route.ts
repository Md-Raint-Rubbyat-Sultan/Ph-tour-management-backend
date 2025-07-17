import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { tourTypeZodSchema } from "./tour.validation";
import { TourControllers } from "./tour.controller";

const router = Router();

router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(tourTypeZodSchema),
  TourControllers.createTourType
);

export const TourRouter = router;
