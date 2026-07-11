import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IUpdateUserPayload } from "../auth/auth.interface";
import { IRegisterUserPayload } from "./admin.interface";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";

const registerAdminUserIntoDB = async (payload: IRegisterUserPayload) => {
  const { name, email, password, phone, profilePhoto, role, status } = payload;

  const isExistUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      profilePhoto,
      role: Role.ADMIN,
      status,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email,
    },
    omit: {
      password: true,
    },
  });
  return user;
};

const getAllUserFromDB = async () => {
  const result = await prisma.user.findMany({
    orderBy: [{ createdAt: "desc" }, { name: "asc" }],
  });
  return result;
};

const updateUserStatusIntoDB = async (
  userId: string,
  payload: IUpdateUserPayload,
) => {
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: payload?.status,
    },
  });
  return result;
};

const getAllPropertiesFromDB = async () => {
  const result = await prisma.property.findMany({
    include: {
      category: {
        select: {
          name: true,
        },
      },
      landlord: {
        select: {
          name: true,
          email: true,
          phone: true,
          profilePhoto: true,
          role: true,
          status: true,
        },
      },
    },
    orderBy: [
      { category: { name: "asc" } },
      { createdAt: "desc" },
      { title: "asc" },
    ],
  });
  return result;
};

const getAllRentalRequestFromDB = async () => {
  const result = await prisma.rentalRequest.findMany({
    include: {
      property: true,
      tenant: true,
      landlord: {
        select: {
          name: true,
          email: true,
          phone: true,
          profilePhoto: true,
          role: true,
          status: true,
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });
  return result;
};

export const adminService = {
  registerAdminUserIntoDB,
  getAllUserFromDB,
  updateUserStatusIntoDB,
  getAllPropertiesFromDB,
  getAllRentalRequestFromDB,
};
