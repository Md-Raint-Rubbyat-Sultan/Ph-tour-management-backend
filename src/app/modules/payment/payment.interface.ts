import { Types } from "mongoose";

export enum Payment_Status {
  PAID = "PAID",
  UNPAID = "UNPAID",
  CANCLLED = "CANCLLED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface IPaymet {
  booking: Types.ObjectId;
  transactionId: string;
  amount: number;
  paymentGatewayData?: any;
  invoiceUrl?: string;
  status: Payment_Status;
}
