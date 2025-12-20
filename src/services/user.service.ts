import { prisma } from "../application/database";
import { ResponseError } from "../error/response.error";
import {
  toUserResponse,
  type CreateUserRequest,
  type LoginUserRequest,
  type UserResponse,
} from "../models/user.model";
import { Validation } from "../validations";
import { UserValidation } from "../validations/user.validation";
import bcrypt from "bcrypt";
import { v7 as uuidv7 } from "uuid";
/**
 * UserService handles user-related business logic.
 */
export class UserService {
  /**
   * Register a new user.
   */
  static async register(request: CreateUserRequest): Promise<UserResponse> {
    // Validate and sanitize incoming request data
    const registerRequest = Validation.validate(
      UserValidation.REGISTER,
      request
    );

    // Check whether the username already exists
    const isUserExist = await prisma.user.findUnique({
      where: {
        username: registerRequest.username,
      },
    });

    // Throw error if username is already taken
    if (isUserExist) {
      throw new ResponseError(400, "username_exist");
    }

    // Hash password before saving to database
    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    // Create new user record in database
    const user = await prisma.user.create({
      data: registerRequest,
    });

    // Map database entity to API response
    return toUserResponse(user);
  }

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    // validate and sanitize incoming request data
    const loginRequest = Validation.validate(UserValidation.LOGIN, request);

    let user = await prisma.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new ResponseError(401, "username_password_is_wrong");
    }

    const isPasswordValid = await bcrypt.compare(
      request.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ResponseError(401, "username_password_is_wrong");
    }

    user = await prisma.user.update({
      where: {
        username: loginRequest.username,
      },

      data: {
        token: uuidv7(),
      },
    });

    const response = toUserResponse(user);

    response.token = user.token!;
    return response;
  }
}
