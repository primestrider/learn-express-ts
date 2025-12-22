import type { Contact, User } from "../../generated/prisma/client";
import { prisma } from "../application/database";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response.error";
import {
  toContactResponse,
  type ContactResponse,
  type CreateContactRequest,
  type UpdateContactRequest,
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

    logger.debug("record: " + JSON.stringify(contact));
    return toContactResponse(contact);
  }

  static async checkContactMustExists(
    username: string,
    contactId: number
  ): Promise<Contact> {
    const contact = await prisma.contact.findUnique({
      where: {
        id: contactId,
        username: username,
      },
    });

    if (!contact) {
      throw new ResponseError(404, "contact_not_found");
    }

    return contact;
  }

  static async get(user: User, id: number): Promise<ContactResponse> {
    const contact = await this.checkContactMustExists(user.username, id);
    return toContactResponse(contact);
  }

  static async update(
    user: User,
    request: UpdateContactRequest
  ): Promise<ContactResponse> {
    const updateRequest = Validation.validate(
      ContactValidation.UPDATE,
      request
    );

    await this.checkContactMustExists(user.username, updateRequest.id);

    const contact = await prisma.contact.update({
      where: {
        id: updateRequest.id,
        username: user.username,
      },

      data: updateRequest,
    });

    return toContactResponse(contact);
  }

  static async remove(user: User, id: number): Promise<ContactResponse> {
    await this.checkContactMustExists(user.username, id);

    const contact = await prisma.contact.delete({
      where: {
        id: id,
        username: user.username,
      },
    });

    return toContactResponse(contact);
  }
}
