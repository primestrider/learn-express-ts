import type { User } from "../../generated/prisma/client";
import { prisma } from "../application/database";
import {
  toAddressResponse,
  type AddressResponse,
  type CreateAddressRequest,
} from "../models/address.model";
import { Validation } from "../validations";
import { AddressValidation } from "../validations/address.validation";
import { ContactService } from "./contact.service";

export class AddressService {
  static async create(
    user: User,
    request: CreateAddressRequest
  ): Promise<AddressResponse> {
    const createRequest = Validation.validate(
      AddressValidation.CREATE,
      request
    );

    await ContactService.checkContactMustExists(
      user.username,
      request.contact_id
    );

    const address = await prisma.address.create({
      data: createRequest,
    });

    return toAddressResponse(address);
  }
}
