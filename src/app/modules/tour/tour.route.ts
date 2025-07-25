import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createTourZodSchema,
  tourTypeZodSchema,
  updateTourZodSchema,
} from "./tour.validation";
import { TourControllers } from "./tour.controller";
import { multerUpload } from "../../config/multer.config";

const router = Router();

// Tour-Types
router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(tourTypeZodSchema),
  TourControllers.createTourType
);

router.get("/tour-types", TourControllers.getAllTourTypes);

router.get("/tour-types/:id", TourControllers.getSingleTourTypes);

router.patch(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(tourTypeZodSchema),
  TourControllers.updateTourTypes
);

router.delete(
  "tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourControllers.deleteTourTypes
);

// Tour
router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("flies"),
  validateRequest(createTourZodSchema),
  TourControllers.createTour
);

router.get("/", TourControllers.getAllTours);

router.get("/:slug", TourControllers.getAllTours);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("flies"),
  validateRequest(updateTourZodSchema),
  TourControllers.updateTour
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourControllers.deleteTour
);

export const TourRouter = router;
