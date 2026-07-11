import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.patch(
  "/profile",
  auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
  authController.updateProfile,
);
router.post("/refreshToken", authController.refreshToken);

export const authRoute = router;
