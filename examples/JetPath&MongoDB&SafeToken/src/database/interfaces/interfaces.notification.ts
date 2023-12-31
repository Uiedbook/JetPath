import mongoose from "mongoose";
export interface INotification {
  userId: mongoose.Types.ObjectId;
  title: string;
  body: string;
  viewed: boolean;
}
export type UpdateNotificationBody = Partial<INotification>;
