// import { NextFunction, Request, Response } from "express";
// import { catchAsync } from "../../utils/catchAsync";
// import { sendResponse } from "../../utils/sendResponse";
// import httpStatus from "http-status";

// const createCategory = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     // const payload = req.body;
//     // const user = await authService.registerUserIntoDB(
//     //   payload as IRegisterUserPayload,
//     // );
//     // sendResponse(res, {
//     //   success: true,
//     //   statusCode: httpStatus.CREATED,
//     //   message: "User registered Successfully.",
//     //   data: {
//     //     user,
//     //   },
//     // });
//   },
// );

// const getAllCategories = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     // const payload = req.body;
//     // const user = await authService.registerUserIntoDB(
//     //   payload as IRegisterUserPayload,
//     // );
//     // sendResponse(res, {
//     //   success: true,
//     //   statusCode: httpStatus.CREATED,
//     //   message: "User registered Successfully.",
//     //   data: {
//     //     user,
//     //   },
//     // });
//   },
// );

// const updateCategories = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     // const payload = req.body;
//     // const user = await authService.registerUserIntoDB(
//     //   payload as IRegisterUserPayload,
//     // );
//     // sendResponse(res, {
//     //   success: true,
//     //   statusCode: httpStatus.CREATED,
//     //   message: "User registered Successfully.",
//     //   data: {
//     //     user,
//     //   },
//     // });
//   },
// );

// const deleteCategories = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     // const payload = req.body;
//     // const user = await authService.registerUserIntoDB(
//     //   payload as IRegisterUserPayload,
//     // );
//     // sendResponse(res, {
//     //   success: true,
//     //   statusCode: httpStatus.CREATED,
//     //   message: "User registered Successfully.",
//     //   data: {
//     //     user,
//     //   },
//     // });
//   },
// );

// export const categoryController = {
//   createCategory,
//   getAllCategories,
//   updateCategories,
//   deleteCategories,
// };

import { Request, Response } from "express";
import httpStatus from "http-status";

import { categoryService } from "./category.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.createCategoryIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Category created successfully",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getAllCategoriesFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories retrieved successfully",
    data: result,
  });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryId = req.params.id;
  const result = await categoryService.getSingleCategoryFromDB(
    categoryId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category retrieved successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryId = req.params.id;
  const payload = req.body;

  const result = await categoryService.updateCategoriesIntoDB(
    categoryId as string,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category updated successfully",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryId = req.params.id;
  const result = await categoryService.deleteCategoriesFromDB(
    categoryId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category deleted successfully",
    data: result,
  });
});

export const categoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
