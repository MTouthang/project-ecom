import { InferSchemaType, Schema, model } from "mongoose";
import { IUser } from "../types";
import { roleList } from "../configs/roleList.config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      minlength: [5, "First Name must be at-least 5 characters long"],
      maxlength: [20, "first Name cannot be more than 20 characters long"],
      trim: true,
    },
    lastName: {
      type: String,
      minlength: [6, "Last Name must be at-least 6 characters long"],
      maxlength: [20, "Last Name cannot be more than 20 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please fill in a valid email address",
      ],
    },
    phoneNumber: {
      type: String,
      unique: true,
      minlength: [10, "Phone number cannot be less than 10 digits"],
      maxlength: [15, "Phone number cannot be more than 15 digits"],
      required: [true, "Phone number should be provided!"],
    },

    password: {
      type: String,
      required: [true, "Password is Required"],
      minlength: [8, "Password length should be at-least 8 characters"],
      select: false,
    },
    addresses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Address",
      },
    ],

    role: {
      type: String,
      enum: [roleList.admin, roleList.user],
      default: "USER",
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
  },
  {
    timestamps: true,
  },
);

// encrypt password and save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password as string, 10);
});

userSchema.methods = {
  // compare password
  comparePassword: async function (plainPassword: string) {
    return bcrypt.compare(plainPassword, this.password);
  },

  // generating user secret access code -
  generateAccessToken: async function () {
    return jwt.sign(
      { user_id: this._id, role: this.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRY,
      },
    );
  },
  generatePasswordResetToken: async function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    return resetToken;
  },
};

type userSchema = InferSchemaType<typeof userSchema>;

const User = model<userSchema>("User", userSchema);

export default User;
