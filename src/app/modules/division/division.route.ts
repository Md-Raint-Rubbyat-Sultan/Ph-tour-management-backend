import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createDivisioZodSchema,
  updateDivisionZodSchema,
} from "./division.validation";
import { DivisionControllers } from "./division.controller";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(createDivisioZodSchema),
  DivisionControllers.createDivision
);

router.get("/", DivisionControllers.getAllDivision);

router.get("/:slug", DivisionControllers.getSingleDivision);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(updateDivisionZodSchema),
  DivisionControllers.updateDivision
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionControllers.deleteDivision
);

export const DivisionRouter = router;
