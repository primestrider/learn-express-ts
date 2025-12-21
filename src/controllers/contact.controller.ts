import type { NextFunction, Request, Response } from "express";
import type { UserRequest } from "../models/user.model";
import type { CreateContactRequest } from "../models/contact.model";
import { ContactService } from "../services/contact.service";

export class ContactController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateContactRequest = req.body as CreateContactRequest;

      const response = ContactService.create(req.user!, request);

      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
