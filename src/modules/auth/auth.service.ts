import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import {
  ILoginPayload,
  IRegisterUserPayload,
  IUpdateUserPayload,
} from "./auth.interface";
import config from "../../config";
import httpStatus from "http-status";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "../../utils/jwt";

const registerUserIntoDB = async (payload: IRegisterUserPayload) => {
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
      role,
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

// Login
const loginUserIntoDB = async (payload: ILoginPayload) => {
  const { email, password } = payload;
  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  if (user.status === "BANNED") {
    throw new Error(
      "Your account has been banned. Please contact with Administrator.",
    );
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Password is incorrect!");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  // Generate Access Token
  const accessToken = await jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  // Refresh Access Token
  const refreshToken = await jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
    user,
  };
};

const updateProfileIntoDB = async (
  userId: string,
  payload: IUpdateUserPayload,
) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: payload.name,
      phone: payload.phone,
      profilePhoto: payload.profilePhoto,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      profilePhoto: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const refreshToken = async (refreshToken: string) => {
  // Refresh Access Token
  const verifiedRefreshToken = await jwtUtils.verifiedToken(
    refreshToken,
    config.jwt_refresh_secret,
  );

  if (!verifiedRefreshToken.success) {
    throw new Error(verifiedRefreshToken.error);
  }
  const { id } = verifiedRefreshToken.data as JwtPayload;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: id,
    },
  });
  if (user.status === "BANNED") {
    throw new Error("User is Banned. Please contact with administrator.");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  // Refresh Access Token
  const accessToken = await jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  return {
    accessToken,
  };
};
export const authService = {
  registerUserIntoDB,
  loginUserIntoDB,
  updateProfileIntoDB,
  refreshToken,
};
