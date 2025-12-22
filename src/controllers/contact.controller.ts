import type { NextFunction, Response } from "express";
import type { UserRequest } from "../models/user.model";
import type {
  CreateContactRequest,
  UpdateContactRequest,
} from "../models/contact.model";
import { ContactService } from "../services/contact.service";
import { logger } from "../application/logging";

export class ContactController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateContactRequest = req.body as CreateContactRequest;

      const response = await ContactService.create(req.user!, request);

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
      const contactId = Number(req.params.contactId);
      const response = await ContactService.get(req.user!, contactId);
      logger.debug("response: " + JSON.stringify(response));

      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateContactRequest = req.body as UpdateContactRequest;
      request.id = Number(req.params.contactId);

      const response = await ContactService.update(req.user!, request);
      logger.debug("response: " + JSON.stringify(response));

      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    const contactId = Number(req.params.contactId);

    const response = await ContactService.remove(req.user!, contactId);
    logger.debug("response: " + JSON.stringify(response));

    res.status(200).json({
      data: "OK",
    });
  }
}
