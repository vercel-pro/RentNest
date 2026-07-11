import { Request, Response, Router } from "express";
import { subscriptionController } from "./subscription.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/client";

const router = Router();

router.post(
  "/checkout",
  auth(Role.TENANT),
  subscriptionController.createCheckoutSession,
);

router.post("/webhook", subscriptionController.handleWebhook);

router.get(
  "/status",
  auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
  subscriptionController.getSubscriptionStatus,
);

router.get(
  "/getAllSubscriptionDetails",
  auth(Role.ADMIN),
  subscriptionController.getAllSubscriptionDetails,
);

// =========================================
router.get(
  "/paymentHistory",
  auth(Role.ADMIN),
  subscriptionController.getPaymentHistory,
);
// =========================================

export const subscriptionRoutes = router;
