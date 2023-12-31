import mongoose from "mongoose";
const billPaymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USERS",
        required: true,
    },
    walletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WALLETS",
        required: true,
    },
    country: {
        type: String,
        required: false,
        default: "NG",
    },
    customer: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["AIRTIME", "DATA", "ELECTRICITY", "CABLE TV"],
    },
    recurrence: {
        type: String,
        required: false,
        default: "ONCE",
    },
    reference: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["PENDING", "SUCCESS", "FAILED"],
    },
}, {
    timestamps: true,
});
export const BILL_PAYMENTS = mongoose.model("BILL_PAYMENTS", billPaymentSchema);
