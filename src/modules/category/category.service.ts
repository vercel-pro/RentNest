import { prisma } from "../../lib/prisma";
import {
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "./category.interface";

const createCategoryIntoDB = async (payload: ICreateCategoryPayload) => {
  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

const getAllCategoriesFromDB = async () => {
  return prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSingleCategoryFromDB = async (id: string) => {
  return prisma.category.findUniqueOrThrow({
    where: {
      id,
    },
  });
};

const updateCategoriesIntoDB = async (
  id: string,
  payload: IUpdateCategoryPayload,
) => {
  const existCategory = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
  });
  if (payload.name === existCategory?.name) {
    throw new Error(`Already exist category with "${payload?.name}"`);
  }
  const result = await prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteCategoriesFromDB = async (id: string) => {
  const result = await prisma.category.delete({
    where: {
      id,
    },
  });

  return result;
};

export const categoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoriesIntoDB,
  deleteCategoriesFromDB,
};
