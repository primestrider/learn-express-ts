import { z, type ZodType } from "zod";
import type { CreateContactRequest } from "../models/contact.model";

export class ContactValidation {
  static readonly CREATE: ZodType<CreateContactRequest, any, any> = z.object({
    first_name: z.string().min(1).max(100),
    last_name: z.string().min(1).max(100).optional(),
    email: z.email().min(1).max(100).optional(),
    phone: z.string().min(1).max(20).optional(),
  });
}
