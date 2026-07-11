import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload, IUpdateReviewPayload } from "./review.interface";

const createReviewIntoDB = async (
  payload: ICreateReviewPayload,
  tenantId: string,
) => {
  // Check property exists
  await prisma.property.findUniqueOrThrow({
    where: {
      id: payload.propertyId,
    },
  });

  // One review per tenant per property
  const existingReview = await prisma.review.findUnique({
    where: {
      tenantId_propertyId: {
        tenantId,
        propertyId: payload.propertyId,
      },
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this property.");
  }

  const result = await prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      propertyId: payload.propertyId,
      tenantId,
    },
    include: {
      tenant: {
        select: {
          name: true,
          email: true,
          phone: true,
          profilePhoto: true,
          status: true,
        },
      },
      property: true,
    },
  });

  return result;
};

const getAllReviewsFromDB = async (reviewer: string, reviewerRole: Role) => {
  console.log(reviewer);
  console.log(reviewerRole);
  const whereFilter =
    reviewerRole === "ADMIN"
      ? {} // Admins get no filters (see everything)
      : {
          OR: [{ tenantId: reviewer }, { propertyId: reviewer }],
        };

  const result = await prisma.review.findMany({
    where: whereFilter,
    include: {
      tenant: {
        select: {
          name: true,
          email: true,
          phone: true,
          profilePhoto: true,
          status: true,
        },
      },
      property: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const getReviewByPropertyIdFromDB = async (propertyId: string) => {
  return await prisma.review.findMany({
    where: {
      propertyId,
    },
    include: {
      tenant: true,
      property: true,
    },
  });
};

const updateReviewIntoDB = async (
  id: string,
  payload: IUpdateReviewPayload,
  tenantId: string,
) => {
  await prisma.review.findFirstOrThrow({
    where: {
      id,
      tenantId,
    },
  });

  return await prisma.review.update({
    where: {
      id,
    },
    data: payload,
    include: {
      tenant: true,
      property: true,
    },
  });
};

const deleteReviewFromDB = async (id: string, tenantId: string) => {
  await prisma.review.findFirstOrThrow({
    where: {
      id,
      tenantId,
    },
  });

  return await prisma.review.delete({
    where: {
      id,
    },
  });
};

export const reviewService = {
  createReviewIntoDB,
  getAllReviewsFromDB,
  getReviewByPropertyIdFromDB,
  updateReviewIntoDB,
  deleteReviewFromDB,
};
