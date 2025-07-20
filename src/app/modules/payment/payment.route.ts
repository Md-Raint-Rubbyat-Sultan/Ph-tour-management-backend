import { Router } from "express";
import { PaymentControllers } from "./payment.controller";

const router = Router();

router.post("/init-payment/:bookingId", PaymentControllers.initPayment);
router.post("/success", PaymentControllers.successPayment);
router.post("/fail", PaymentControllers.failedPayment);
router.post("/cancel", PaymentControllers.cancelPayment);

export const PaymentRouter = router;
