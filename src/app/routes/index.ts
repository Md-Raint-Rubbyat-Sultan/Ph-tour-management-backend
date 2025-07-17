import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { DivisionRouter } from "../modules/division/division.route";
import { TourRouter } from "../modules/tour/tour.route";

export const router = Router();

const modulesRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/division",
    route: DivisionRouter,
  },
  {
    path: "/tour",
    route: TourRouter,
  },
];

modulesRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});
