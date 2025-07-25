import { Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { Role } from "./user.interface";
import { checkAuth } from "../../middleware/checkAuth";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post(
  "/register",
  multerUpload.single("file"),
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);

router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  multerUpload.single("file"),
  validateRequest(updateUserZodSchema),
  UserControllers.updateUser
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUser
);

router.get(
  "/:id",
  checkAuth(...Object.values(Role)),
  UserControllers.getSingleUser
);

export const UserRoutes = router;
