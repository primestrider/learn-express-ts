import type { Response, NextFunction } from "express";
import type { UserRequest } from "../models/user.model";
import type {
  CreateAddressRequest,
  GetAddressRequest,
} from "../models/address.model";
import { AddressService } from "../services/address.service";
import { logger } from "../application/logging";

export class AddressController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateAddressRequest = req.body as CreateAddressRequest;

      request.contact_id = Number(req.params.contactId);

      const response = await AddressService.create(req.user!, request);
      logger.debug("response: " + JSON.stringify(response));

      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: GetAddressRequest = {
        id: Number(req.params.addressId),
        contact_id: Number(req.params.contactId),
      };

      const response = await AddressService.get(req.user!, request);
      logger.debug("response: " + JSON.stringify(response));

      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
