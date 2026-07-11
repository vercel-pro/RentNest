import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { propertyAmenityService } from "./propertyAmenity.service";
import { sendResponse } from "../../utils/sendResponse";

const createPropertyAmenity = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const result =
      await propertyAmenityService.createPropertyAmenityIntoDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Amenity added to property successfully",
      data: result,
    });
  },
);

// Get Property Amenities By Property ID
const getPropertyAmenities = catchAsync(async (req: Request, res: Response) => {
  const propertyId = req.params.propertyId;
  const result = await propertyAmenityService.getPropertyAmenitiesFromDB(
    propertyId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property amenities retrieved successfully",
    data: result,
  });
});

const deletePropertyAmenities = catchAsync(
  async (req: Request, res: Response) => {
    const { propertyId, amenityId } = req.query;
    const result = await propertyAmenityService.deletePropertyAmenityFromDB(
      propertyId as string,
      amenityId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Amenity Deleted successfully",
      data: result,
    });
  },
);

export const propertyAmenityController = {
  createPropertyAmenity,
  getPropertyAmenities,
  deletePropertyAmenities,
};
