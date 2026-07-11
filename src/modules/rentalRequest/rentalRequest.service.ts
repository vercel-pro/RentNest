import { RentalRequestStatus, Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  ICreateRentalRequestPayload,
  IUpdateRentalRequestPayload,
} from "./rentalRequest.interface";

const createRentalRequestIntoDB = async (
  payload: ICreateRentalRequestPayload,
  tenantId: string,
) => {
  const propertyId = payload.propertyId;

  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
    },
    select: {
      landlordId: true,
      rentPrice: true,
    },
  });
  if (!property) {
    throw new Error("Sorry!. Property is not available.");
  }
  const isRequestExist = await prisma.rentalRequest.findFirst({
    where: {
      propertyId,
      tenantId,
    },
  });
  if (isRequestExist) {
    throw new Error(
      `Already make rental request at ${isRequestExist.createdAt}`,
    );
  }
  const result = await prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId: payload.propertyId,
      moveInDate: payload.moveInDate,
      rentalDuration: payload.rentalDuration,
      landlordId: property.landlordId,
      monthlyRent: property.rentPrice,
      message: payload.message,
    },
    include: {
      tenant: true,
      landlord: true,
      property: true,
    },
  });

  return result;
};

const getAllRentalRequestsFromDB = async (
  requesterId: string,
  requesterRole: Role,
) => {
  const whereFilter =
    requesterRole === "ADMIN"
      ? {} // Admins get no filters (see everything)
      : {
          OR: [{ tenantId: requesterId }, { landlordId: requesterId }],
        };

  const result = await prisma.rentalRequest.findMany({
    where: whereFilter,
    include: {
      tenant: {
        // omit: {
        //   password: true,
        // },
        select: {
          // id: true,
          name: true,
          email: true,
          phone: true,
          profilePhoto: true,
          status: true,
        },
      },
      landlord: {
        // omit: {
        //   password: true,
        // },
        select: {
          // id: true,
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

const getSingleRentalRequestFromDB = async (
  id: string,
  requesterId: string,
  requesterRole: Role,
) => {
  const whereFilter =
    requesterRole === "ADMIN"
      ? { id }
      : {
          id,
          OR: [{ tenantId: requesterId }, { landlordId: requesterId }],
        };

  return prisma.rentalRequest.findUniqueOrThrow({
    where: whereFilter,
    include: {
      tenant: {
        // omit: {
        //   password: true,
        // },
        select: {
          // id: true,
          name: true,
          email: true,
          phone: true,
          profilePhoto: true,
          status: true,
        },
      },
      landlord: {
        // omit: {
        //   password: true,
        // },
        select: {
          // id: true,
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
};

const updateRentalRequestIntoDB = async (
  id: string,
  payload: IUpdateRentalRequestPayload,
) => {
  return prisma.rentalRequest.update({
    where: {
      id,
    },
    data: payload,
  });
};

const updateRentalRequestStatusIntoDB = async (
  id: string,
  status: RentalRequestStatus,
) => {
  const result = await prisma.rentalRequest.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
  return result;
};

const deleteRentalRequestFromDB = async (id: string) => {
  return prisma.rentalRequest.delete({
    where: {
      id,
    },
  });
};

export const rentalRequestService = {
  createRentalRequestIntoDB,
  getAllRentalRequestsFromDB,
  getSingleRentalRequestFromDB,
  updateRentalRequestIntoDB,
  updateRentalRequestStatusIntoDB,
  deleteRentalRequestFromDB,
};
