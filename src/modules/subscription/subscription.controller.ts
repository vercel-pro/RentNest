import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { subscriptionServices } from "./subscription.services";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createCheckoutSession = catchAsync(
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await subscriptionServices.createCheckoutSession(
      userId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Checkout completed Successfully!",
      data: result,
    });
  }),
);

// const handleWebhook = catchAsync(
//   catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const event = req.body as Buffer;
//     const signature = req.headers["stripe-signature"]!;

//     await subscriptionServices.handleWebhook(event, signature as string);
//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "Webhook triggered Successfully!",
//       data: null,
//     });
//   }),
// );
const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as Buffer;

  const signature = req.headers["stripe-signature"];

  if (!signature) {
    throw new Error("Missing stripe-signature header");
  }

  await subscriptionServices.handleWebhook(payload, signature as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Webhook handled successfully",
    data: null,
  });
});

const getSubscriptionStatus = catchAsync(
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await subscriptionServices.getSubscriptionStatus(
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Subscription status retrieved Successfully!",
      data: result,
    });
  }),
);

const getAllSubscriptionDetails = catchAsync(
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log("getAllSubscriptionDetails");
    const result = await subscriptionServices.getSubscriptionDetailsFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Subscription retrieved Successfully!",
      data: result,
    });
  }),
);
// ========================================
// const getPaymentHistory = catchAsync(async (req: Request, res: Response) => {
//   const result = await subscriptionServices.getPaymentHistoryFromStripe({
//     customerId: req.query.customerId as string,
//     subscriptionId: req.query.subscriptionId as string,
//     limit: Number(req.query.limit) || 10,
//     startingAfter: req.query.startingAfter as string,
//   });

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Payment history retrieved successfully",
//     data: result,
//   });
// });

const getPaymentHistory = catchAsync(async (req, res) => {
  const result = await subscriptionServices.getPaymentHistoryFromStripe({
    customerId: req.query.customerId as string,
    limit: Number(req.query.limit) || 10,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment history retrieved successfully",
    data: result,
  });
});

export const SubscriptionController = {
  getPaymentHistory,
};

// ========================================

export const subscriptionController = {
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus,
  getAllSubscriptionDetails,
  getPaymentHistory,
};
