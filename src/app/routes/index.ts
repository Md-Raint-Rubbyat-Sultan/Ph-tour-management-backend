import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";

export const router = Router();

const modulesRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
];

modulesRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});
