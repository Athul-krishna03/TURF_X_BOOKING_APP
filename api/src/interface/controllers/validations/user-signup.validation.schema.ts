import { z } from "zod";

import { strongEmailRegex } from "../../../shared/validation/email.validation";
import { passwordSchema } from "../../../shared/validation/password.validation";
import { nameSchema } from "../../../shared/validation/name.validation";
import { phoneNumberSchema } from "../../../shared/validation/phone.validation";

const userSignupSchema = z.object({
  name: nameSchema,
  email: strongEmailRegex,
  phone: phoneNumberSchema,
  password: passwordSchema,
  role:z.enum([ "user", "turf"]),
});
const coordinatesSchema = z.object({
  type: z.string(),
  coordinates: z.tuple([z.number(), z.number()])
})



export const turfvalidationSchema = z
  .object({
    status: z.enum(["pending", "approved", "rejected"]).optional().default("pending"),
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: strongEmailRegex,
    phone: phoneNumberSchema,
    password: passwordSchema,
    role: z.literal("turf"),
    courtSize: z.string().min(1, "Court size is required"),
    description: z.string().optional(),
    pricePerHour: z
      .number()
      .min(100, { message: "Price must be a positive number" }),
    isBlocked: z.boolean().optional(),
    aminities: z.array(z.string()).min(1, "At least one amenity is required"),
    games: z.array(z.string()).min(1, "At least one game is required"),
    turfPhotos: z.array(z.any()).optional(), 
    turfPhotoUrls: z.array(z.string().url()).optional(),
    location: z.object({
      address: z.string().min(3, "Address is required"),
      city: z.string().min(2, "City is required"),
      state: z.string().min(2, "State is required"),
      coordinates: coordinatesSchema,
    }),
  })
export const userSignupSchemas = {
  user: userSignupSchema,
  turf: turfvalidationSchema
};

//login schema for both "user","admin" and "Turf owner"
export const loginSchema = z.object({
  email: strongEmailRegex,
  password: z.string().min(1, "password Required"),
  role: z.enum(["admin", "user", "turf"]),
});
