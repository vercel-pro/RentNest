import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { reviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.user?.id!;

  const result = await reviewService.createReviewIntoDB(req.body, tenantId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review created successfully",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const reviewer = req.user?.id!;
  const reviewerRole = req.user?.role!;
  const result = await reviewService.getAllReviewsFromDB(
    reviewer,
    reviewerRole,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review retrieved successfully",
    data: result,
  });
});

const getReviewByPropertyId = catchAsync(
  async (req: Request, res: Response) => {
    const propertyId = req.params.id!;
    const result = await reviewService.getReviewByPropertyIdFromDB(
      propertyId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Review retrieved successfully",
      data: result,
    });
  },
);

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const reviewId = req.params?.id;
  const tenantId = req.user?.id;
  const payload = req.body;

  const result = await reviewService.updateReviewIntoDB(
    reviewId as string,
    payload,
    tenantId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const reviewId = req.params?.id;
  const tenantId = req.user?.id;

  await reviewService.deleteReviewFromDB(
    reviewId as string,
    tenantId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review deleted successfully",
    data: {},
  });
});

export const reviewController = {
  createReview,
  getAllReviews,
  getReviewByPropertyId,
  updateReview,
  deleteReview,
};
