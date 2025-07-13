import { CallbackWithoutResultAndOptionalError, model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";
import AppError from "../../errorHelpers/appError";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  { versionKey: false, _id: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVarified: { type: Boolean, default: false },
    auth: [authProviderSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre(
  "save",
  async function (next: CallbackWithoutResultAndOptionalError) {
    try {
      if (this.password) {
        if (this.isModified("password") || this.isNew) {
          this.password = await bcrypt.hash(
            this.password as string,
            Number(envVars.BCRYPT_SALT)
          );
        }
      }
      next();
    } catch (error) {
      throw new AppError(500, "Failed to hash password.");
    }
  }
);

export const User = model<IUser>("User", userSchema);
