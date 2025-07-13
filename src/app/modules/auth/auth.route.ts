import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post("/login", AuthControllers.credentialLogin);
router.post("/refresh-token", AuthControllers.getAccessToken);

export const AuthRouter = router;
