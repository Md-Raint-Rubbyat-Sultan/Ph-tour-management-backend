import z from "zod";

export const tourTypeZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be an string." })
    .min(0, { message: "Name too short." }),
});
