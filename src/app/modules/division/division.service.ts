import AppError from "../../errorHelpers/appError";
import {
  handleTourDeleteWhenRefDelete,
  hasTourEnds,
} from "../../utils/isTourEnd";
import { Tour } from "../tour/tour.model";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: Partial<IDivision>) => {
  const isDivisionExist = await Division.findOne({ slug: payload.slug });

  if (isDivisionExist) {
    throw new AppError(400, "Division already exist.");
  }

  const newDivision = await Division.create(payload);

  return {
    data: newDivision,
  };
};

const getAllDivision = async () => {
  const allDivision = await Division.find({});

  return {
    data: allDivision,
  };
};

const updateDivision = async (oldSlug: string, payload: Partial<IDivision>) => {
  const isDivisionExist = await Division.findOne({ slug: oldSlug });

  if (!isDivisionExist) {
    throw new AppError(400, "Division does not exist.");
  }

  const updatedDivision = await Division.findOneAndUpdate(
    { slug: oldSlug },
    payload,
    { new: true, runValidators: true }
  );

  return {
    data: updatedDivision,
  };
};

const deleteDivision = async (slug: string) => {
  const isDivisionExist = await Division.findOne({ slug });

  if (!isDivisionExist) {
    throw new AppError(400, "Division is already deleted.");
  }

  // const toursWithoutEndDate: string[] = [];
  // const toursDidNotEndYet: string[] = [];

  // const isToursExist = await Tour.find({
  //   division: isDivisionExist._id,
  // });

  // if (isToursExist.length > 0) {
  //   isToursExist.forEach((isTourExist) => {
  //     if (!isTourExist.endDate) {
  //       toursWithoutEndDate.push(isTourExist.title);
  //     }

  //     const isTourEnd: boolean = isTourExist.endDate
  //       ? hasTourEnds(isTourExist.endDate)
  //       : false;

  //     if (!isTourEnd) {
  //       toursDidNotEndYet.push(isTourExist.title);
  //     }
  //   });

  //   if (toursWithoutEndDate.length > 0) {
  //     throw new AppError(
  //       400,
  //       `${toursWithoutEndDate.join(", ")} tours are linked to this division: ${
  //         isDivisionExist.name
  //       }. But tours end date are not spacified yet. Wait until it ends or remove the tours ${toursWithoutEndDate.join(
  //         ", "
  //       )} first.`
  //     );
  //   }

  //   if (toursDidNotEndYet.length > 0) {
  //     throw new AppError(
  //       400,
  //       `${toursDidNotEndYet.join(", ")} tour is linked to this division: ${
  //         isDivisionExist.name
  //       }. Wait until the tour ends or remove the tour.`
  //     );
  //   }

  //   await Tour.deleteMany({ division: isDivisionExist._id });
  // }

  await handleTourDeleteWhenRefDelete(
    isDivisionExist._id,
    isDivisionExist.name,
    "division"
  );

  const deletedDivision = await Division.findOneAndDelete({ slug });

  return {
    data: deletedDivision,
  };
};

export const DivisionServices = {
  createDivision,
  getAllDivision,
  updateDivision,
  deleteDivision,
};
