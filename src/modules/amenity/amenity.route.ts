import { Router } from "express";
import { amenityController } from "./amenity.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN, Role.LANDLORD),
  amenityController.createAmenity,
);
router.get("/", amenityController.getAllAmenities);
router.get("/:id", amenityController.getSingleAmenities);
router.patch(
  "/:id",
  auth(Role.ADMIN, Role.LANDLORD),
  amenityController.updateAmenities,
);
router.delete(
  "/:id",
  auth(Role.ADMIN, Role.LANDLORD),
  amenityController.deleteAmenities,
);

export const amenityRoute = router;
