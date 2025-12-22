import { z, type ZodType } from "zod";
import type {
  CreateContactRequest,
  ListContactRequest,
  UpdateContactRequest,
} from "../models/contact.model";

export class ContactValidation {
  static readonly CREATE: ZodType<CreateContactRequest, any, any> = z.object({
    first_name: z.string().min(1).max(100),
    last_name: z.string().min(1).max(100).optional(),
    email: z.email().min(1).max(100).optional(),
    phone: z.string().min(1).max(20).optional(),
  });

  static readonly UPDATE: ZodType<UpdateContactRequest, any, any> = z.object({
    id: z.number().positive(),
    first_name: z.string().min(1).max(100),
    last_name: z.string().min(1).max(100).optional(),
    email: z.email().min(1).max(100).optional(),
    phone: z.string().min(1).max(20).optional(),
  });

  static readonly LIST: ZodType<ListContactRequest, any, any> = z.object({
    name: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
    email: z.string().min(1).optional(),
    page: z.number().min(1).positive(),
    limit: z.number().min(1).max(100).positive(),
  });
}
