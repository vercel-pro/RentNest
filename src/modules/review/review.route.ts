import express, { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { reviewController } from "./review.controller";

const router = Router();

router.post("/", auth(Role.TENANT), reviewController.createReview);
router.get("/", auth(Role.ADMIN, Role.TENANT), reviewController.getAllReviews);
router.get("/:id", reviewController.getReviewByPropertyId);
router.patch("/:id", auth(Role.TENANT), reviewController.updateReview);
router.delete("/:id", auth(Role.TENANT), reviewController.deleteReview);
export const reviewRoutes = router;
