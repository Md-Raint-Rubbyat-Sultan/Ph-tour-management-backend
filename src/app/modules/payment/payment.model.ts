import { model, Schema } from "mongoose";
import { IPaymet, Payment_Status } from "./payment.interface";

const paymentSchema = new Schema<IPaymet>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentGatewayData: {
      type: Schema.Types.Mixed,
    },
    invoiceUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(Payment_Status),
      default: Payment_Status.UNPAID,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Payment = model<IPaymet>("Payment", paymentSchema);
