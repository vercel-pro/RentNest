import { prisma } from "../../lib/prisma";
import {
  ICreatePropertyImagePayload,
  IUpdatePropertyImagePayload,
} from "./propertyImage.interface";

const createPropertyImageIntoDB = async (
  payload: ICreatePropertyImagePayload,
) => {
  const existImage = await prisma.propertyImage.findFirst({
    where: {
      imageUrl: payload.imageUrl,
      propertyId: payload.propertyId,
    },
  });
  if (
    payload?.imageUrl === existImage?.imageUrl &&
    payload.propertyId === existImage.propertyId
  ) {
    throw new Error("This image URL already exists in this property.");
  }
  const result = await prisma.propertyImage.create({
    data: payload,
  });

  return result;
};

const getAllPropertyImagesFromDB = async () => {
  const result = await prisma.propertyImage.findMany({
    include: {
      property: true,
    },
  });

  return result;
};

const getSinglePropertyImageFromDB = async (propertyImageId: string) => {
  const result = await prisma.propertyImage.findUniqueOrThrow({
    where: {
      id: propertyImageId,
    },
    include: {
      property: true,
    },
  });

  return result;
};

const getAllImageForSinglePropertyFromDB = async (propertyId: string) => {
  const result = await prisma.propertyImage.findMany({
    where: {
      propertyId,
    },
    include: {
      property: true,
    },
  });

  return result;
};

const updatePropertyImageIntoDB = async (
  id: string,
  payload: IUpdatePropertyImagePayload,
) => {
  await prisma.propertyImage.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.propertyImage.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deletePropertyImageFromDB = async (id: string) => {
  await prisma.propertyImage.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.propertyImage.delete({
    where: {
      id,
    },
  });

  return result;
};

export const propertyImageService = {
  createPropertyImageIntoDB,
  getAllPropertyImagesFromDB,
  getSinglePropertyImageFromDB,
  getAllImageForSinglePropertyFromDB,
  updatePropertyImageIntoDB,
  deletePropertyImageFromDB,
};
