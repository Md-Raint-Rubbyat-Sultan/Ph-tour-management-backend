import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";
import { createSlug } from "../../utils/createSlug";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, trim: true },
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

divisionSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    let baseSlug = `${createSlug(this.name)}-division`;
    let counter = 0;
    while (await Division.exists({ slug: baseSlug })) {
      baseSlug = `${baseSlug}-${counter++}`;
    }

    this.slug = baseSlug;
  }
  next();
});

divisionSchema.pre("findOneAndUpdate", async function (next) {
  const division = this.getUpdate() as IDivision;

  if (division.name) {
    let baseSlug = `${createSlug(division.name)}-division`;
    let counter = 0;
    while (await Division.exists({ slug: baseSlug })) {
      baseSlug = `${baseSlug}-${counter++}`;
    }

    division.slug = baseSlug;
  }

  next();
});

export const Division = model<IDivision>("Division", divisionSchema);
