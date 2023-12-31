import mongoose from "mongoose";
const TransactionSchema = new mongoose.Schema({
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
    type: {
        type: String,
        required: true,
        uppercase: true,
        enum: [],
    },
    referenceId: {
        type: String,
        required: true,
        unique: true,
    },
    providerTransactionId: {
        type: String,
        required: false,
    },
    amount: {
        type: Number,
        required: true,
    },
    currencyCode: {
        type: String,
        required: false,
        uppercase: true,
        enum: ["NGN"],
    },
    paymentProvider: {
        type: String,
        required: false,
        uppercase: true,
        enum: ["FLW"],
        default: "FLW",
    },
    status: {
        type: String,
        uppercase: true,
        enum: ["PENDING", "SUCCESS", "FAILED"],
        default: "PENDING",
    },
}, {
    timestamps: true,
});
export const TRANSACTIONS = mongoose.model("TRANSACTIONS", TransactionSchema);
