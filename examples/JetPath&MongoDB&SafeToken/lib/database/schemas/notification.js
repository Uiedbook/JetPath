import mongoose from "mongoose";
const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USERS",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    viewed: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
export const Notification = mongoose.model("Notification", NotificationSchema);
