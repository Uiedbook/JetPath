import mongoose from "mongoose";
import { IUserDoc, IUserModel } from "../interfaces/interfaces.user.js";

const userSchema = new mongoose.Schema<IUserDoc, IUserModel>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    transaction_pin: {
      type: Number,
      required: false,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        // if (!validator.isEmail(value)) {
        //   throw new Error("Invalid email");
        // }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        // if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        //   throw new Error(
        //     "Password must contain at least one letter and one number"
        //   );
        // }
      },
      private: true, // used by the toJSON plugin
    },

    temporaryPassword: {
      type: String,
      default: null,
    },
    otp: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin", "staff"],
      default: "user",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const USERS = mongoose.model<IUserDoc, IUserModel>("USERS", userSchema);
