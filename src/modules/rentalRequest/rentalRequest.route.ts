import express from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { rentalRequestController } from "./rentalRequest.controller";

const router = express.Router();

router.post(
  "/",
  auth(Role.TENANT),
  rentalRequestController.createRentalRequest,
);

router.get(
  "/",
  auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
  rentalRequestController.getAllRentalRequests,
);

router.get(
  "/:id",
  auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
  rentalRequestController.getSingleRentalRequest,
);

router.patch(
  "/:id",
  auth(Role.TENANT),
  rentalRequestController.updateRentalRequest,
);

router.patch(
  "/status/:id",
  auth(Role.LANDLORD),
  rentalRequestController.updateRentalRequestStatus,
);

router.delete(
  "/:id",
  auth(Role.ADMIN, Role.LANDLORD),
  rentalRequestController.deleteRentalRequest,
);

export const rentalRequestRoutes = router;
