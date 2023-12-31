import mongoose from "mongoose";
const WALLETSSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USERS",
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    accountNo: {
        type: String,
        required: true,
        trim: true,
    },
    bank: {
        type: String,
        required: true,
        trim: true,
    },
    accountName: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});
export const WALLETS = mongoose.model("WALLETS", WALLETSSchema);
