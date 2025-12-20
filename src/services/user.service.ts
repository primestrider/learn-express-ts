import { prisma } from "../application/database";
import { ResponseError } from "../error/response.error";
import {
  toUserResponse,
  type CreateUserRequest,
  type UserResponse,
} from "../models/user.model";
import { Validation } from "../validations";
import { UserValidation } from "../validations/user.validation";
import bcrypt from "bcrypt";

/**
 * UserService
 *
 * Service layer responsible for handling user-related business logic.
 * Uses static methods because:
 * - No internal state is required
 * - Easy to call from Express controllers
 */
export class UserService {
  /**
   * Register a new user
   *
   * Flow:
   * 1. Validate request data using Zod
   * 2. Check if the username already exists
   * 3. Hash the password using bcrypt
   * 4. Persist the user into the database
   * 5. Return a safe user response (without password)
   *
   * @param request - Data required to create a new user
   * @throws ResponseError if the username already exists
   * @returns UserResponse
   */
  static async register(request: CreateUserRequest): Promise<UserResponse> {
    /**
     * Validate incoming request
     *
     * - Incoming data is untrusted (from client)
     * - Zod validation ensures correct structure and types
     * - Returns a fully typed and safe object
     */
    const registerRequest = Validation.validate(
      UserValidation.REGISTER,
      request
    );

    /**
     * Check if the username is already used
     *
     * Using `count` instead of `findFirst` because:
     * - We only need to know whether a record exists
     * - Slightly more efficient
     */
    const isUserExist = await prisma.user.findUnique({
      where: {
        username: registerRequest.username,
      },
    });

    /**
     * If username already exists, throw a controlled error
     *
     * - ResponseError carries HTTP status and message
     * - Will be handled by global Express error middleware
     */
    if (isUserExist) {
      throw new ResponseError(400, "username_exist");
    }

    /**
     * Hash the user's password before storing it
     *
     * - Plain text passwords must NEVER be stored
     * - bcrypt with saltRounds = 10 is safe for production
     */
    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    /**
     * Persist the new user into the database
     *
     * Stored fields:
     * - username
     * - hashed password
     * - name
     */
    const user = await prisma.user.create({
      data: registerRequest,
    });

    /**
     * Convert database entity to API response
     *
     * - Removes sensitive fields (password)
     * - Shapes data for client consumption
     */
    return toUserResponse(user);
  }
}
