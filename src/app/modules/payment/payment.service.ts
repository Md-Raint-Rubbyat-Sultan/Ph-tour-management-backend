import { uploadImageToCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/appError";
import { formatedDate } from "../../utils/formatedDate";
import { generatePDF, IInvoiceData } from "../../utils/invoice";
import { sendEmailOptions } from "../../utils/sendEmail";
import { Booking_Status } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../SSLCommerz/SSLCommerz.interface";
import { SSLServices } from "../SSLCommerz/SSLCommerz.service";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
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
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: Payment_Status.PAID },
      { new: true, runValidators: true, session }
    );

    if (!updatedPayment) {
      throw new AppError(404, "Payment not found.");
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: Booking_Status.COMPLETE },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email")
      .populate("tour", "title");

    if (!updatedBooking) {
      throw new AppError(404, "Booking not found.");
    }

    const invoiceData: IInvoiceData = {
      userName: (updatedBooking.user as unknown as IUser).name,
      tourTitle: (updatedBooking.tour as unknown as ITour).title,
      bookingDate: formatedDate(updatedBooking.createdAt as Date),
      guestCount: updatedBooking.guestCount,
      transactionId: updatedPayment.transactionId,
      totalAmount: updatedPayment.amount,
    };

    const invoicePDF = await generatePDF(invoiceData);

    const cloudinaryResulst = await uploadImageToCloudinary(
      invoicePDF,
      "invoice"
    );

    if (!cloudinaryResulst) {
      throw new AppError(401, "Faild to upload pdf to clouldinary.");
    }

    await Payment.findByIdAndUpdate(
      updatedPayment._id,
      {
        invoiceUrl: cloudinaryResulst.secure_url,
      },
      { runValidators: true, session }
    );

    sendEmailOptions({
      to: (updatedBooking.user as unknown as IUser).email,
      subject: "Tour Booking Invoice",
      templateName: "invoice",
      templateData: {
        userName: invoiceData.userName,
        tourTitle: invoiceData.tourTitle,
        bookingDate: invoiceData.bookingDate as string,
        guestCount: invoiceData.guestCount.toString(),
        transactionId: invoiceData.transactionId,
        totalAmount: invoiceData.totalAmount.toString(),
      },
      attachments: [
        {
          filename: "invoice.pdf",
          content: invoicePDF,
          contentType: "application/pdf",
        },
      ],
    });

    await session.commitTransaction();
    session.endSession();
    return { success: true, message: "Payment successfull." };
  } catch (error: any) {
    // some error occur do not implement anything to the real data base
    await session.abortTransaction(); // rollback
    session.endSession();
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
    // some error occur do not implement anything to the real data base
    await session.abortTransaction(); // rollback
    session.endSession();
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
    // some error occur do not implement anything to the real data base
    await session.abortTransaction(); // rollback
    session.endSession();
    throw new AppError(400, error.message);
  }
};

const getPDFDownloadLink = async (_id: string, userId: string) => {
  const payment = await Payment.findById(_id)
    .select("invoiceUrl booking")
    .populate("booking", "user");

  if (!payment) {
    throw new AppError(401, "Payment not found.");
  }

  if ((payment.booking as any).user !== userId) {
    throw new AppError(403, "You are forbidden to get this link.");
  }

  if (!payment.invoiceUrl) {
    throw new AppError(401, "Invoice PDF url not found.");
  }

  return {
    data: payment.invoiceUrl,
  };
};

export const PaymentServices = {
  initPayment,
  successPayment,
  failedPayment,
  cancelPayment,
  getPDFDownloadLink,
};
