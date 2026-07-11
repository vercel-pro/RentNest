import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { rentalRequestService } from "./rentalRequest.service";
import { sendResponse } from "../../utils/sendResponse";
import { ICreateRentalRequestPayload } from "./rentalRequest.interface";

const createRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const tenantId = req.user?.id!;

  const result = await rentalRequestService.createRentalRequestIntoDB(
    payload as ICreateRentalRequestPayload,
    tenantId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rental request created successfully.",
    data: result,
  });
});

const getAllRentalRequests = catchAsync(async (req: Request, res: Response) => {
  const requesterId = req.user?.id!;
  const requesterRole = req.user?.role!;
  const result = await rentalRequestService.getAllRentalRequestsFromDB(
    requesterId,
    requesterRole,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental requests retrieved successfully.",
    data: result,
  });
});

const getSingleRentalRequest = catchAsync(
  async (req: Request, res: Response) => {
    const rentalRequestId = req.params.id;
    const requesterId = req.user?.id!;
    const requesterRole = req.user?.role!;
    const result = await rentalRequestService.getSingleRentalRequestFromDB(
      rentalRequestId as string,
      requesterId,
      requesterRole,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request retrieved successfully.",
      data: result,
    });
  },
);

const updateRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const rentalRequestId = req.params.id;
  const payload = req.body;
  const result = await rentalRequestService.updateRentalRequestIntoDB(
    rentalRequestId as string,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental request updated successfully.",
    data: result,
  });
});

const updateRentalRequestStatus = catchAsync(
  async (req: Request, res: Response) => {
    const rentalRequestId = req?.params?.id;
    const rentalStatus = req?.body?.status;
    const result = await rentalRequestService.updateRentalRequestStatusIntoDB(
      rentalRequestId as string,
      rentalStatus,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request status updated successfully.",
      data: result,
    });
  },
);

const deleteRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const rentalRequestId = req?.params?.id;
  const result = await rentalRequestService.deleteRentalRequestFromDB(
    rentalRequestId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental request deleted successfully.",
    data: result,
  });
});

export const rentalRequestController = {
  createRentalRequest,
  getAllRentalRequests,
  getSingleRentalRequest,
  updateRentalRequest,
  updateRentalRequestStatus,
  deleteRentalRequest,
};
