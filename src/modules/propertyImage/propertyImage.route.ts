import express from "express";
import { propertyImageController } from "./propertyImage.controller";
import { auth } from "./../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

// Public Route
router.get("/", propertyImageController.getAllPropertyImages);
router.get("/:id", propertyImageController.getSinglePropertyImage);
router.get(
  "/propertyAllImages/:id",
  propertyImageController.getAllImageForSingleProperty,
);

// Private route
router.post(
  "/",
  auth(Role.ADMIN, Role.LANDLORD),
  propertyImageController.createPropertyImage,
);
router.patch(
  "/:id",
  auth(Role.ADMIN, Role.LANDLORD),
  propertyImageController.updatePropertyImage,
);
router.delete(
  "/:id",
  auth(Role.ADMIN, Role.LANDLORD),
  propertyImageController.deletePropertyImage,
);

export const propertyImageRoutes = router;
