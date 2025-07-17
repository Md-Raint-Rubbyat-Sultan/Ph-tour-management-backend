import AppError from "../../errorHelpers/appError";
import { Tour, TourType } from "./tour.model";
import { handleTourDeleteWhenRefDelete } from "../../utils/isTourEnd";
import { ITour } from "./tour.interface";

// Tour-Types
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

const getAllTourTypes = async () => {
  const allTourTypes = await TourType.find({});

  return {
    data: allTourTypes,
  };
};

const updateTourTypes = async (name: string, _id: string) => {
  const isTourTypeExist = await TourType.findById(_id);

  if (!isTourTypeExist) {
    throw new AppError(400, "Tour Type dose not exist.");
  }

  const updatedTourType = await TourType.findByIdAndUpdate(_id, { name });

  return {
    data: updatedTourType,
  };
};

const deleteTourTypes = async (_id: string) => {
  const isTourTypeExist = await TourType.findById(_id);

  if (!isTourTypeExist) {
    throw new AppError(400, "Tour Type is already deleted.");
  }

  await handleTourDeleteWhenRefDelete(_id, isTourTypeExist.name, "Tour-Types");

  const deletedTourType = await TourType.findByIdAndDelete(_id);

  return {
    data: deletedTourType,
  };
};

// Tour
const createTour = async (payload: ITour) => {
  const isTourExist = await Tour.findOne({ title: payload.title });

  if (isTourExist) {
    throw new AppError(400, "Tour already exist.");
  }

  const newTour = await Tour.create(payload);

  return {
    data: newTour,
  };
};

const getAllTours = async () => {
  const allTours = await Tour.find({});

  return {
    data: allTours,
  };
};

const updateTour = async (_id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(_id);

  if (!existingTour) {
    throw new Error("Tour not found.");
  }

  const updatedTour = await Tour.findByIdAndUpdate(_id, payload, { new: true });

  return {
    data: updatedTour,
  };
};

const deleteTour = async (_id: string) => {
  return {
    data: await Tour.findByIdAndDelete(_id),
  };
};

export const TourServices = {
  createTourType,
  getAllTourTypes,
  updateTourTypes,
  deleteTourTypes,
  createTour,
  getAllTours,
  updateTour,
  deleteTour,
};
