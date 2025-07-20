import { Types } from "mongoose";

export enum Booking_Status {
  PENDING = "PENDING",
  CANCLE = "CANCLE",
  COMPLETE = "COMPLETE",
  FAILED = "FAILED",
}

export interface IBooking {
  user: Types.ObjectId;
  tour: Types.ObjectId;
  payment?: Types.ObjectId;
  guestCount: number;
  status: Booking_Status;
}
