import { Request, Response } from "express";
import { User } from "./user.model";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    const user = await User.create({
      name,
      email,
    });

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
