import { Request, Response } from "express";
import { SendResponse } from "../utils/sendResponse";

const notFound = (req: Request, res: Response) => {
  SendResponse(res, {
    statusCode: 404,
    success: false,
    message: "Requested call is not valied",
    data: null,
  });
};

export default notFound;
