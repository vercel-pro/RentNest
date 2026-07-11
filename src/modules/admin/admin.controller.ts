import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { adminService } from "./admin.service";
import { IRegisterUserPayload } from "./admin.interface";

const registerAdminUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await adminService.registerAdminUserIntoDB(
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
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await adminService.getAllUserFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User retrieved Successfully.",
      data: {
        users,
      },
    });
  },
);

const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;

    const users = await adminService.updateUserStatusIntoDB(
      userId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User retrieved Successfully.",
      data: {
        users,
      },
    });
  },
);

const getAllProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllPropertiesFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User retrieved Successfully.",
      data: result,
    });
  },
);
const getAllRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllRentalRequestFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User retrieved Successfully.",
      data: result,
    });
  },
);

export const adminController = {
  registerAdminUser,
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentalRequest,
};
