import express from "express";
import { Role } from "../../../generated/prisma/enums";
import { propertyController } from "./property.controller";
import { auth } from "../../middlewares/auth";
const router = express.Router();

// Public
router.get("/", propertyController.getAllProperties);
router.get("/:id", propertyController.getSingleProperty);

// Landlord
router.post(
  "/",
  auth(Role.ADMIN, Role.LANDLORD),
  propertyController.createProperty,
);

router.patch(
  "/:id",
  auth(Role.ADMIN, Role.LANDLORD),
  propertyController.updateProperty,
);

router.delete(
  "/:id",
  auth(Role.ADMIN, Role.LANDLORD),
  propertyController.deleteProperty,
);

export const propertyRoutes = router;
