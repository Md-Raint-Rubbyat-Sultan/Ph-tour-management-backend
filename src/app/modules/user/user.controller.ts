import { Request, Response } from "express";
import { User } from "./user.model";
import { UserServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const user = await UserServices.createUser(req.body);

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: `Somethig went wrong: ${error}`,
      error,
    });
  }
};

export const UserControllers = {
  createUser,
};
