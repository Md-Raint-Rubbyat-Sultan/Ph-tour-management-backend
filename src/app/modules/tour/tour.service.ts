import AppError from "../../errorHelpers/appError";
import { TourType } from "./tour.model";

const createTourType = async (name: string) => {
  const isTourTypeExist = await TourType.findOne({
    name: new RegExp(`^${name}$`, "i"),
  });

  if (isTourTypeExist) {
    throw new AppError(400, "Tour Type already exist.");
  }

  const newTourType = await TourType.create({ name });

  return {
    data: newTourType,
  };
};

export const TourServices = {
  createTourType,
};
