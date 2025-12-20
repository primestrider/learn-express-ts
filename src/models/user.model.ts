import type { Request } from "express";
import type { User } from "../../generated/prisma/client";

export type UserResponse = {
  username: string;
  name: string;
  token?: string;
};

export type CreateUserRequest = {
  username: string;
  password: string;
  name: string;
};

export type LoginUserRequest = {
  username: string;
  password: string;
};

export function toUserResponse(user: User): UserResponse {
  return {
    name: user.name,
    username: user.username,
  };
}

export interface UserRequest extends Request {
  user?: User;
}
