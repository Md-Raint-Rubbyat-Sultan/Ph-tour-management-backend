import { Router } from "express";
import { PaymentControllers } from "./payment.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/init-payment/:bookingId", PaymentControllers.initPayment);
router.post("/success", PaymentControllers.successPayment);
router.post("/fail", PaymentControllers.failedPayment);
router.post("/cancel", PaymentControllers.cancelPayment);
router.post(
  "/invoice/:id",
  checkAuth(...Object.values(Role)),
  PaymentControllers.getPDFDownloadLink
);

export const PaymentRouter = router;
