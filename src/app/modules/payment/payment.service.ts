import AppError from "../../errorHelpers/appError";
import { Booking_Status } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../SSLCommerz/SSLCommerz.interface";
import { SSLServices } from "../SSLCommerz/SSLCommerz.service";
import { Payment_Status } from "./payment.interface";
import { Payment } from "./payment.model";

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });

  if (!payment) {
    throw new AppError(404, "Payment not found. You never book for this tour.");
  }

  const booking = await Booking.findById(payment.booking)
    .populate("user", "name email phone address")
    .populate("tour", "title costFrom");

  const userInfo = booking?.user as any;

  const SSLPayload: ISSLCommerz = {
    address: userInfo.address,
    amount: payment.amount,
    email: userInfo.email,
    name: userInfo.name,
    phoneNumber: userInfo.phone,
    transactionId: payment.transactionId,
  };

  const SSLPayment = await SSLServices.SSLCommerzInit(SSLPayload);

  return {
    data: { payment: SSLPayment.data?.GatewayPageURL || "Faild to payment" },
  };
};

const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPAyment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: Payment_Status.PAID },
      { new: true, runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatedPAyment?.booking,
      { status: Booking_Status.COMPLETE },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    return { success: true, message: "Payment successfull." };
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
};

const failedPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPAyment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: Payment_Status.FAILED },
      { runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatedPAyment?.booking,
      { status: Booking_Status.FAILED },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "Payment failed." };
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPAyment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: Payment_Status.CANCLLED },
      { runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatedPAyment?.booking,
      { status: Booking_Status.CANCLE },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "Payment canceled." };
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
};

export const PaymentServices = {
  initPayment,
  successPayment,
  failedPayment,
  cancelPayment,
};
