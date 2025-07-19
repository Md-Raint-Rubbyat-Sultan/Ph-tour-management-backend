import AppError from "../../errorHelpers/appError";
import { handleTourDeleteWhenRefDelete } from "../../utils/isTourEnd";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { divisionSearchalbeFields } from "./division.constants";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: IDivision) => {
  const isDivisionExist = await Division.findOne({ name: payload.name });

  if (isDivisionExist) {
    throw new AppError(400, "Division already exist.");
  }

  const newDivision = await Division.create(payload);

  return {
    data: newDivision,
  };
};

const getAllDivision = async (query: Record<string, string>) => {
  const queryElement = new QueryBuilder(Division.find(), query);
  const tours = queryElement
    .search(divisionSearchalbeFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    tours.build(),
    queryElement.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleDivision = async (slug: string) => {
  const division = await Division.findOne({ slug });

  return {
    data: division,
  };
};

const updateDivision = async (_id: string, payload: Partial<IDivision>) => {
  const isDivisionExist = await Division.findById(_id);

  if (!isDivisionExist) {
    throw new AppError(400, "Division does not exist.");
  }

  const dulicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: _id },
  });

  if (dulicateDivision) {
    throw new AppError(400, "A division with this name already exist.");
  }

  const updatedDivision = await Division.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  });

  return {
    data: updatedDivision,
  };
};

const deleteDivision = async (_id: string) => {
  const isDivisionExist = await Division.findById(_id);

  if (!isDivisionExist) {
    throw new AppError(400, "Division is already deleted.");
  }

  await handleTourDeleteWhenRefDelete(_id, isDivisionExist.name, "division");

  const deletedDivision = await Division.findByIdAndDelete(_id);

  return {
    data: deletedDivision,
  };
};

export const DivisionServices = {
  createDivision,
  getAllDivision,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
