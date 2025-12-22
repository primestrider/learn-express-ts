import type { NextFunction, Response } from "express";
import type { UserRequest } from "../models/user.model";
import type {
  CreateContactRequest,
  ListContactRequest,
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
    try {
      const contactId = Number(req.params.contactId);

      const response = await ContactService.remove(req.user!, contactId);
      logger.debug("response: " + JSON.stringify(response));

      res.status(200).json({
        data: "OK",
      });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: ListContactRequest = {
        name: req.query.name as string,
        email: req.query.email as string,
        phone: req.query.phone as string,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
      };

      const response = await ContactService.list(req.user!, request);
      logger.debug("response: " + JSON.stringify(response));

      res.status(200).json({
        data: response.data,
        paging: response.paging,
      });
    } catch (error) {
      next(error);
    }
  }
}
