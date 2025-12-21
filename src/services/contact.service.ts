import type { User } from "../../generated/prisma/client";
import { prisma } from "../application/database";
import {
  toContactResponse,
  type ContactResponse,
  type CreateContactRequest,
} from "../models/contact.model";
import { Validation } from "../validations";
import { ContactValidation } from "../validations/contact.validation";

export class ContactService {
  static async create(
    user: User,
    request: CreateContactRequest
  ): Promise<ContactResponse> {
    const createRequest = Validation.validate(
      ContactValidation.CREATE,
      request
    );

    const record = {
      ...createRequest,
      username: user.username,
    };

    const contact = await prisma.contact.create({
      data: record,
    });

    return toContactResponse(contact);
  }
}
