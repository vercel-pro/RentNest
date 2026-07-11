import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { amenityService } from "./amenity.service";

const createAmenity = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await amenityService.createAmenityIntoDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Amenity created successfully",
      data: result,
    });
  },
);

const getAllAmenities = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await amenityService.getAllAmenitiesFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Amenities retrieved successfully",
      data: result,
    });
  },
);

const getSingleAmenities = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const amenityId = req.params.id;
    const result = await amenityService.getSingleAmenity(amenityId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Amenities retrieved successfully",
      data: result,
    });
  },
);

const updateAmenities = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const amenityId = req.params.id;
    const payload = req.body;
    const result = await amenityService.updateAmenitiesIntoDB(
      amenityId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Amenity updated successfully",
      data: result,
    });
  },
);

const deleteAmenities = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const amenityId = req.params.id;
    console.log(amenityId);
    const result = await amenityService.deleteAmenitiesFromDB(
      amenityId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Amenity deleted successfully",
      data: result,
    });
  },
);

export const amenityController = {
  createAmenity,
  getAllAmenities,
  getSingleAmenities,
  updateAmenities,
  deleteAmenities,
};
