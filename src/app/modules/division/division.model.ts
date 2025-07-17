import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    thumbnail: { type: String, trim: true, default: "" },
    description: {
      type: String,
      trim: true,
      default: "No description provided.",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Division = model<IDivision>("Division", divisionSchema);
