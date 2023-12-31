import mongoose, { Model, Document } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  temporaryPassword: string;
  validation: string;
  role: string;
  otp: string;
  transaction_pin: number;
  isEmailVerified: boolean;
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(
    email: string,
    excludeUserId?: mongoose.Types.ObjectId
  ): Promise<boolean>;
}

export type UpdateUserBody = Partial<IUser>;

export type NewRegisteredUser = Omit<
  IUser,
  "role" | "isEmailVerified" | "cryptoWallets" | "fiatWallets"
>;

export type NewCreatedUser = Omit<
  IUser,
  "isEmailVerified" | "cryptoWallets" | "fiatWallets"
>;
