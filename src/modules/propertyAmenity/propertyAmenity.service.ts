import { prisma } from "../../lib/prisma";
import {
  ICreatePropertyAmenityPayload,
  IDeletePropertyAmenityPayload,
} from "./propertyAmenity.interface";

const createPropertyAmenityIntoDB = async (
  payload: ICreatePropertyAmenityPayload,
) => {
  const result = await prisma.propertyAmenity.create({
    data: payload,
    include: {
      property: true,
      amenity: true,
    },
  });

  return result;
};

const getPropertyAmenitiesFromDB = async (propertyId: string) => {
  return prisma.propertyAmenity.findMany({
    where: {
      propertyId,
    },
    include: {
      amenity: true,
    },
  });
};

const deletePropertyAmenityFromDB = async (
  propertyId: string,
  amenityId: string,
) => {
  return prisma.propertyAmenity.delete({
    where: {
      propertyId_amenityId: {
        propertyId: propertyId,
        amenityId: amenityId,
      },
    },
  });
};

export const propertyAmenityService = {
  createPropertyAmenityIntoDB,
  getPropertyAmenitiesFromDB,
  deletePropertyAmenityFromDB,
};
