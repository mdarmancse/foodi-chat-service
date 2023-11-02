import { z } from "zod";

export const UserSchema = z.object({
  _id: z
    .string({
      invalid_type_error: "Invalid ID",
      required_error: "User ID is required",
    })
    .trim()
    .uuid("Invalid user id"),
  name: z
    .string({
      invalid_type_error: "Invalid name",
      required_error: "User name is required",
    })
    .trim(),
  userType: z
    .string({
      invalid_type_error: "Invalid user type",
      required_error: "User type is required",
    })
    .trim(),
});
