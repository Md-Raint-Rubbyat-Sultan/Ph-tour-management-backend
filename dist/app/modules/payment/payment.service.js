"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentServices = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const formatedDate_1 = require("../../utils/formatedDate");
const invoice_1 = require("../../utils/invoice");
const sendEmail_1 = require("../../utils/sendEmail");
const booking_interface_1 = require("../booking/booking.interface");
const booking_model_1 = require("../booking/booking.model");
const SSLCommerz_service_1 = require("../SSLCommerz/SSLCommerz.service");
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
const initPayment = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payment = yield payment_model_1.Payment.findOne({ booking: bookingId });
    if (!payment) {
        throw new appError_1.default(404, "Payment not found. You never book for this tour.");
    }
    const booking = yield booking_model_1.Booking.findById(payment.booking)
        .populate("user", "name email phone address")
        .populate("tour", "title costFrom");
    const userInfo = booking === null || booking === void 0 ? void 0 : booking.user;
    const SSLPayload = {
        address: userInfo.address,
        amount: payment.amount,
        email: userInfo.email,
        name: userInfo.name,
        phoneNumber: userInfo.phone,
        transactionId: payment.transactionId,
    };
    const SSLPayment = yield SSLCommerz_service_1.SSLServices.SSLCommerzInit(SSLPayload);
    return {
        data: { payment: ((_a = SSLPayment.data) === null || _a === void 0 ? void 0 : _a.GatewayPageURL) || "Faild to payment" },
    };
});
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.Payment_Status.PAID }, { new: true, runValidators: true, session });
        if (!updatedPayment) {
            throw new appError_1.default(404, "Payment not found.");
        }
        const updatedBooking = yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, { status: booking_interface_1.Booking_Status.COMPLETE }, { new: true, runValidators: true, session })
            .populate("user", "name email")
            .populate("tour", "title");
        if (!updatedBooking) {
            throw new appError_1.default(404, "Booking not found.");
        }
        const invoiceData = {
            userName: updatedBooking.user.name,
            tourTitle: updatedBooking.tour.title,
            bookingDate: (0, formatedDate_1.formatedDate)(updatedBooking.createdAt),
            guestCount: updatedBooking.guestCount,
            transactionId: updatedPayment.transactionId,
            totalAmount: updatedPayment.amount,
        };
        const invoicePDF = yield (0, invoice_1.generatePDF)(invoiceData);
        const cloudinaryResulst = yield (0, cloudinary_config_1.uploadImageToCloudinary)(invoicePDF, "invoice");
        if (!cloudinaryResulst) {
            throw new appError_1.default(401, "Faild to upload pdf to clouldinary.");
        }
        yield payment_model_1.Payment.findByIdAndUpdate(updatedPayment._id, {
            invoiceUrl: cloudinaryResulst.secure_url,
        }, { runValidators: true, session });
        (0, sendEmail_1.sendEmailOptions)({
            to: updatedBooking.user.email,
            subject: "Tour Booking Invoice",
            templateName: "invoice",
            templateData: {
                userName: invoiceData.userName,
                tourTitle: invoiceData.tourTitle,
                bookingDate: invoiceData.bookingDate,
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
        yield session.commitTransaction();
        session.endSession();
        return { success: true, message: "Payment successfull." };
    }
    catch (error) {
        // some error occur do not implement anything to the real data base
        yield session.abortTransaction(); // rollback
        session.endSession();
        throw new appError_1.default(400, error.message);
    }
});
const failedPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPAyment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.Payment_Status.FAILED }, { runValidators: true, session });
        yield booking_model_1.Booking.findByIdAndUpdate(updatedPAyment === null || updatedPAyment === void 0 ? void 0 : updatedPAyment.booking, { status: booking_interface_1.Booking_Status.FAILED }, { runValidators: true, session });
        yield session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment failed." };
    }
    catch (error) {
        // some error occur do not implement anything to the real data base
        yield session.abortTransaction(); // rollback
        session.endSession();
        throw new appError_1.default(400, error.message);
    }
});
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPAyment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.Payment_Status.CANCLLED }, { runValidators: true, session });
        yield booking_model_1.Booking.findByIdAndUpdate(updatedPAyment === null || updatedPAyment === void 0 ? void 0 : updatedPAyment.booking, { status: booking_interface_1.Booking_Status.CANCLE }, { runValidators: true, session });
        yield session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment canceled." };
    }
    catch (error) {
        // some error occur do not implement anything to the real data base
        yield session.abortTransaction(); // rollback
        session.endSession();
        throw new appError_1.default(400, error.message);
    }
});
const getPDFDownloadLink = (_id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findById(_id)
        .select("invoiceUrl booking")
        .populate("booking", "user");
    if (!payment) {
        throw new appError_1.default(401, "Payment not found.");
    }
    if (payment.booking.user !== userId) {
        throw new appError_1.default(403, "You are forbidden to get this link.");
    }
    if (!payment.invoiceUrl) {
        throw new appError_1.default(401, "Invoice PDF url not found.");
    }
    return {
        data: payment.invoiceUrl,
    };
});
exports.PaymentServices = {
    initPayment,
    successPayment,
    failedPayment,
    cancelPayment,
    getPDFDownloadLink,
};
