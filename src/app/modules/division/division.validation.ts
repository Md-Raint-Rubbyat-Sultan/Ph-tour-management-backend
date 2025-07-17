import z from "zod";

export const createDivisioZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string." })
    .min(1, { message: "Name is too short." }),
  description: z
    .string({ invalid_type_error: "Description must be a string." })
    .optional(),
});

export const updateDivisionZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string." })
    .min(1, { message: "Name is too short." })
    .optional(),
  description: z
    .string({ invalid_type_error: "Description must be a string." })
    .optional(),
});
