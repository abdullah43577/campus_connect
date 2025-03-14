import z from "zod";

const registerSchema = z.object({
  first_name: z.string({ message: "First Name is required" }),
  last_name: z.string({ message: "Last Name is required" }),
  email: z.string().email({ message: "Email is required" }),
  password: z.string({ message: "Password is required" }),
  phone_no: z.string({ message: "Phone Number is required" }),
  user_type: z.enum(["attendee", "event_organizer", "admin"]),
});

const OTPSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  code: z.string().min(6, { message: "Invalid OTP" }).max(6, { message: "Invalid OTP" }),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string({ message: "Password is required" }),
});

export { registerSchema, OTPSchema, loginSchema };
