import { Types } from "mongoose";
import AppError from "../errorHelpers/appError";
import { Tour } from "../modules/tour/tour.model";

export const hasTourEnds = (endDate: Date): boolean => {
  return Date.now() > new Date(endDate).getTime();
};

export const handleTourDeleteWhenRefDelete = async (
  _id: Types.ObjectId | string,
  name: string,
  linkedTo: string
) => {
  const toursWithoutEndDate: string[] = [];
  const toursDidNotEndYet: string[] = [];

  const isToursExist = await Tour.find({
    division: _id,
  });

  if (isToursExist.length > 0) {
    isToursExist.forEach((isTourExist) => {
      if (!isTourExist.endDate) {
        toursWithoutEndDate.push(isTourExist.title);
      }

      const isTourEnd: boolean = isTourExist.endDate
        ? hasTourEnds(isTourExist.endDate)
        : false;

      if (!isTourEnd) {
        toursDidNotEndYet.push(isTourExist.title);
      }
    });

    if (toursWithoutEndDate.length > 0) {
      throw new AppError(
        400,
        `${toursWithoutEndDate.join(
          ", "
        )} tours are linked to this ${linkedTo}: ${name}. But tours end date are not spacified yet. Wait until it ends or remove the tours ${toursWithoutEndDate.join(
          ", "
        )} first.`
      );
    }

    if (toursDidNotEndYet.length > 0) {
      throw new AppError(
        400,
        `${toursDidNotEndYet.join(
          ", "
        )} tour is linked to this ${linkedTo}: ${name}. Wait until the tour ends or remove the tour.`
      );
    }

    // Before deleting tours delete the bookings related to this tour first.

    const result = await Tour.deleteMany({ division: _id });
    console.log(result);
  }
};
