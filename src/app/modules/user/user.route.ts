import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import z from "zod";

const router = Router();

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    const createUserZodSchema = z.object({
      name: z
        .string({ invalid_type_error: "Name must be string." })
        .min(1, { message: "Name is too short." }),
      email: z
        .string({ invalid_type_error: "Email must be string." })
        .email({ message: "Invalied email address." }),
      password: z
        .string({ invalid_type_error: "Password must be string." })
        .min(6, { message: "Password should contain minimum 6 characters" })
        .max(32, { message: "Password should not larger than 32 character" }),
      phone: z
        .string({ invalid_type_error: "Phone number must be string." })
        .regex(/^(?:\+8801\d[9])|01\d[9]$/, {
          message:
            "Invalied phone number. Formet: +8801xxxxxxxxx or 01xxxxxxxxx",
        })
        .optional(),
      address: z
        .string({ invalid_type_error: "Address must be string." })
        .optional(),
    });

    req.body = await createUserZodSchema._parseAsync(req.body);
  },
  UserControllers.createUser
);

router.get("/", UserControllers.getAllUser);

export const UserRoutes = router;
