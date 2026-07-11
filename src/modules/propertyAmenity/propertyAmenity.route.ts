import express from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { propertyAmenityController } from "./propertyAmenity.controller";

const router = express.Router();

// Private API
router.post(
  "/",
  auth(Role.ADMIN, Role.LANDLORD),
  propertyAmenityController.createPropertyAmenity,
);

router.delete(
  "/",
  auth(Role.ADMIN, Role.LANDLORD),
  propertyAmenityController.deletePropertyAmenities,
);

// Public API
router.get("/:propertyId", propertyAmenityController.getPropertyAmenities);

export const propertyAmenityRoutes = router;
