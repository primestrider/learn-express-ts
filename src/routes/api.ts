import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { UserController } from "../controllers/user.controller";
import { ContactController } from "../controllers/contact.controller";
import { AddressController } from "../controllers/address.controller";
export const apiRouter = express.Router();

apiRouter.use(authMiddleware);

// User API
apiRouter.get("/api/users/current", UserController.get);
apiRouter.post("/api/users/current/update", UserController.update);
apiRouter.post("/api/users/current/logout", UserController.logout);

// Contact API
apiRouter.post("/api/contacts/create", ContactController.create);
apiRouter.get(
  String.raw`/api/contacts/:contactId((\d+)`,
  ContactController.get
);
apiRouter.post(
  String.raw`/api/contacts/update/:contactId((\d+)`,
  ContactController.update
);
apiRouter.post(
  String.raw`/api/contacts/delete/:contactId((\d+)`,
  ContactController.delete
);
apiRouter.get("/api/contacts/list", ContactController.list);

// Address APi
apiRouter.post(
  String.raw`/api/contacts/:contactId(\d+)/addresses`,
  AddressController.create
);
apiRouter.get(
  String.raw`/api/contacts/:contactId(\d+)/addresses/:addressId(\d+)`,
  AddressController.get
);
apiRouter.post(
  String.raw`/api/contacts/:contactId(\d+)/addresses/:addressId(\d+)/update`,
  AddressController.update
);
apiRouter.post(
  String.raw`/api/contacts/:contactId(\d+)/addresses/:addressId(\d+)/delete`,
  AddressController.remove
);
apiRouter.get(
  String.raw`/api/contacts/:contactId(\d+)/addresses/list`,
  AddressController.list
);
