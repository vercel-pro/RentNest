import { prisma } from "../../lib/prisma";
import {
  ICreateAmenityPayload,
  IUpdateAmenityPayload,
} from "./amenity.interface";

const createAmenityIntoDB = async (payload: ICreateAmenityPayload) => {
  const result = await prisma.amenity.create({
    data: payload,
  });

  return result;
};

const getAllAmenitiesFromDB = async () => {
  const result = await prisma.amenity.findMany({
    orderBy: [{ name: "asc" }, { createdAt: "desc" }],
  });

  return result;
};

const getSingleAmenity = async (id: string) => {
  return prisma.amenity.findUniqueOrThrow({
    where: {
      id,
    },
  });
};

const updateAmenitiesIntoDB = async (
  id: string,
  payload: IUpdateAmenityPayload,
) => {
  return prisma.amenity.update({
    where: {
      id,
    },
    data: payload,
  });
};

const deleteAmenitiesFromDB = async (id: string) => {
  const result = await prisma.amenity.delete({
    where: {
      id,
    },
  });
  return result;
};

export const amenityService = {
  createAmenityIntoDB,
  getAllAmenitiesFromDB,
  getSingleAmenity,
  updateAmenitiesIntoDB,
  deleteAmenitiesFromDB,
};
