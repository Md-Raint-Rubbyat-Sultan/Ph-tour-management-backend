import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";
import { createSlug } from "../../utils/createSlug";

const tourTypeSchema = new Schema<ITourType>(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const TourType = model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    description: { type: String, trim: true },
    images: { type: [String], default: [] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    departureLocation: { type: String },
    arrivalLocation: { type: String },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxGuest: { type: Number },
    minAge: { type: Number },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

tourSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    let baseSlug = createSlug(this.title);
    let counter = 0;
    while (await Tour.exists({ slug: baseSlug })) {
      baseSlug = `${baseSlug}-${counter++}`;
    }

    this.slug = baseSlug;
  }
  next();
});

tourSchema.pre("findOneAndUpdate", async function (next) {
  const tour = this.getUpdate() as ITour;

  if (tour.title) {
    let baseSlug = createSlug(tour.title);
    let counter = 0;
    while (await Tour.exists({ slug: baseSlug })) {
      baseSlug = `${baseSlug}-${counter++}`;
    }

    tour.slug = baseSlug;
  }

  next();
});

export const Tour = model<ITour>("Tour", tourSchema);
