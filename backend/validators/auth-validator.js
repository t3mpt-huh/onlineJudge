const { z } = require("zod");

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at least of 3 characters" })
    .max(30, { message: "Email must not be more than 30 characters" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(4, { message: "Password must be at least of 4 characters" })
    .max(32, "Password must not be greater than 32 characters"),
});

// Creating an object schema
const signupSchema = loginSchema.extend({
  username: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(3, { message: "Name must be at least of 3 chars. " })
    .max(30, { message: "Name must not be more than 30 characters" }),

  phone: z
    .string({ required_error: "Phone is required" })
    .trim()
    .min(8, { message: "Phone must be at least of 8 characters" })
    .max(20, { message: "Phone must not be more than 20 characters" }),
});

module.exports = { signupSchema, loginSchema };