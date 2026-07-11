import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { propertyImageService } from "./propertyImage.service";

const createPropertyImage = catchAsync(async (req: Request, res: Response) => {
  const payload = req?.body;
  const result = await propertyImageService.createPropertyImageIntoDB(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Property image created successfully",
    data: result,
  });
});

const getAllPropertyImages = catchAsync(
  async (_req: Request, res: Response) => {
    const result = await propertyImageService.getAllPropertyImagesFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property images retrieved successfully",
      data: result,
    });
  },
);

// Get Property Image by PropertyImageId
const getSinglePropertyImage = catchAsync(
  async (req: Request, res: Response) => {
    const propertyImageId = req?.params?.id;
    const result = await propertyImageService.getSinglePropertyImageFromDB(
      propertyImageId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property image retrieved successfully",
      data: result,
    });
  },
);
// Get Property Image by PropertyId
const getAllImageForSingleProperty = catchAsync(
  async (req: Request, res: Response) => {
    const propertyId = req?.params?.id;
    const result =
      await propertyImageService.getAllImageForSinglePropertyFromDB(
        propertyId as string,
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property image retrieved successfully",
      data: result,
    });
  },
);

const updatePropertyImage = catchAsync(async (req: Request, res: Response) => {
  const propertyImageId = req?.params?.id;
  const payload = req.body;
  const result = await propertyImageService.updatePropertyImageIntoDB(
    propertyImageId as string,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property image updated successfully",
    data: result,
  });
});

const deletePropertyImage = catchAsync(async (req: Request, res: Response) => {
  const propertyImageId = req?.params?.id;
  const result = await propertyImageService.deletePropertyImageFromDB(
    propertyImageId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property image deleted successfully",
    data: result,
  });
});

export const propertyImageController = {
  createPropertyImage,
  getAllPropertyImages,
  getSinglePropertyImage,
  getAllImageForSingleProperty,
  updatePropertyImage,
  deletePropertyImage,
};
