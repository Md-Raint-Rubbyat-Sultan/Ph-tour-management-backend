import { Router } from "express";
import { StatsControllers } from "./stats.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.get(
  "/user",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsControllers.userStats
);
router.get(
  "/tour",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsControllers.tuorStats
);
router.get(
  "/booking",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsControllers.bookingStats
);
router.get(
  "/payment",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsControllers.paymentStats
);

export const StatsRoute = router;
