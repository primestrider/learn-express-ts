import type { Address, User } from "../../generated/prisma/client";
import { prisma } from "../application/database";
import { ResponseError } from "../error/response.error";
import {
  toAddressResponse,
  type AddressResponse,
  type CreateAddressRequest,
  type GetAddressRequest,
  type RemoveAddressRequest,
  type UpdateAddressRequest,
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

  static async checkAddressMustExists(
    contactId: number,
    addressId: number
  ): Promise<Address> {
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        contact_id: contactId,
      },
    });

    if (!address) {
      throw new ResponseError(404, "Address not found");
    }

    return address;
  }

  static async get(
    user: User,
    request: GetAddressRequest
  ): Promise<AddressResponse> {
    const getAddressRequest = Validation.validate(
      AddressValidation.GET,
      request
    );

    await ContactService.checkContactMustExists(
      user.username,
      request.contact_id
    );

    const address = await this.checkAddressMustExists(
      request.contact_id,
      getAddressRequest.contact_id
    );

    return toAddressResponse(address);
  }
  static async update(
    user: User,
    request: UpdateAddressRequest
  ): Promise<AddressResponse> {
    const updateRequest = Validation.validate(
      AddressValidation.UPDATE,
      request
    );
    await ContactService.checkContactMustExists(
      user.username,
      request.contact_id
    );
    await this.checkAddressMustExists(
      updateRequest.contact_id,
      updateRequest.id
    );

    const address = await prisma.address.update({
      where: {
        id: updateRequest.id,
        contact_id: updateRequest.contact_id,
      },
      data: updateRequest,
    });

    return toAddressResponse(address);
  }

  static async remove(
    user: User,
    request: RemoveAddressRequest
  ): Promise<AddressResponse> {
    const removeRequest = Validation.validate(AddressValidation.GET, request);
    await ContactService.checkContactMustExists(
      user.username,
      request.contact_id
    );
    await this.checkAddressMustExists(
      removeRequest.contact_id,
      removeRequest.id
    );

    const address = await prisma.address.delete({
      where: {
        id: removeRequest.id,
      },
    });

    return toAddressResponse(address);
  }

  static async list(
    user: User,
    contactId: number
  ): Promise<Array<AddressResponse>> {
    await ContactService.checkContactMustExists(user.username, contactId);

    const addresses = await prisma.address.findMany({
      where: {
        contact_id: contactId,
      },
    });

    return addresses.map((address) => toAddressResponse(address));
  }
}
