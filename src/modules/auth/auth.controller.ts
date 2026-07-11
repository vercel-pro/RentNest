import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { authService } from "./auth.service";
import { IRegisterUserPayload } from "./auth.interface";
import { Role } from "../../../generated/prisma/enums";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    if (payload.role === Role.ADMIN) {
      throw new Error(
        `Sorry!. You don't have permission to create ADMIN user! You can register only as ${Role.LANDLORD} or ${Role.TENANT}. `,
      );
    }

    const user = await authService.registerUserIntoDB(
      payload as IRegisterUserPayload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered Successfully.",
      data: {
        user,
      },
    });
  },
);

// Login User
const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const { accessToken, refreshToken } =
      await authService.loginUserIntoDB(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User logged in Successfully.",
      data: { accessToken, refreshToken },
    });
  },
);

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const result = await authService.updateProfileIntoDB(
    userId as string,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully.",
    data: result,
  });
});

const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    const { accessToken } = await authService.refreshToken(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Token Refresh Successfully.",
      data: { accessToken },
    });
  },
);

export const authController = {
  registerUser,
  loginUser,
  updateProfile,
  refreshToken,
};
