import { z, type ZodType } from "zod";
import type {
  CreateUserRequest,
  LoginUserRequest,
  UpdateUserRequest,
} from "../models/user.model";

export class UserValidation {
  static readonly REGISTER: ZodType<CreateUserRequest> = z.object({
    username: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
    name: z.string().min(1).max(100),
  });

  static readonly LOGIN: ZodType<LoginUserRequest> = z.object({
    username: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
  });

  static readonly UPDATE: ZodType<UpdateUserRequest, any, any> = z.object({
    password: z.string().min(1).max(100).optional(),
    name: z.string().min(1).max(100).optional(),
  });
}
