import AppError from "../../errorHelpers/appError";
import { createTransactionId } from "../../utils/createTransaction";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Payment_Status } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { ISSLCommerz } from "../SSLCommerz/SSLCommerz.interface";
import { SSLServices } from "../SSLCommerz/SSLCommerz.service";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { Booking_Status, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";

const createBooking = async (payload: IBooking, userId: string) => {
  const transactionId = createTransactionId();

  //   transaction rollback
  const session = await Booking.startSession();
  session.startTransaction();

  const user = await User.findById(userId);
  if (!user?.phone || !user?.address) {
    throw new AppError(
      400,
      "Pleasr update your phone number and address from your profile to book a tour."
    );
  }

  const tourCoast = await Tour.findById(payload.tour).select("costFrom");
  if (!tourCoast?.costFrom) {
    throw new AppError(400, "Tour coast not found!");
  }

  const amount = Number(tourCoast?.costFrom) * Number(payload.guestCount);

  try {
    const booking = await Booking.create(
      [
        {
          ...payload,
          user: userId,
          status: Booking_Status.PENDING,
        },
      ],
      { session }
    );

    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          transactionId,
          status: Payment_Status.UNPAID,
          amount,
        },
      ],
      { session }
    );

    const updateBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      { payment: payment[0]._id },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom description")
      .populate("payment");

    const userInfo = updateBooking?.user as any;

    const SSLPayload: ISSLCommerz = {
      address: userInfo.address,
      amount,
      email: userInfo.email,
      name: userInfo.name,
      phoneNumber: userInfo.phone,
      transactionId,
    };

    const SSLPayment = await SSLServices.SSLCommerzInit(SSLPayload);

    // everything works fine so that implement all in real db
    await session.commitTransaction(); // transaction
    session.endSession();

    return {
      data: {
        booking: updateBooking,
        payment: SSLPayment.data?.GatewayPageURL || "Faild to payment",
      },
    };
  } catch (error) {
    // some error occur do not implement anything to the real data base
    await session.abortTransaction(); // rollback
    session.endSession();
    throw error;
  }
};

const getAllBookings = async (query: Record<string, string>) => {
  const queryElement = new QueryBuilder(Booking.find(), query);

  const bookings = queryElement.filter().sort().fields().paginate();

  const [data, meta] = await Promise.all([
    bookings.build(),
    queryElement.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getUserBookings = async (
  query: Record<string, string>,
  userId: string
) => {
  const queryElement = new QueryBuilder(Booking.find({ user: userId }), query);

  const bookings = queryElement.filter().sort().fields().paginate();

  const [data, meta] = await Promise.all([
    bookings.build(),
    queryElement.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleBooking = async (_id: string) => {
  const singleBooking = await Booking.findById(_id);

  return {
    data: singleBooking,
  };
};

const updateBookingStatus = async (_id: string, payload: Partial<IBooking>) => {
  const isBookingExist = await Booking.findById(_id);

  if (!isBookingExist) {
    throw new AppError(400, "No Booking exist to update.");
  }

  const updatedBooking = await Booking.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  });

  return {
    data: updatedBooking,
  };
};

export const BookingServices = {
  createBooking,
  getAllBookings,
  getUserBookings,
  getSingleBooking,
  updateBookingStatus,
};
