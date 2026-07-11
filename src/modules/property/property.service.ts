import { prisma } from "../../lib/prisma";
import {
  ICreatePropertyPayload,
  IUpdatePropertyPayload,
} from "./property.interface";

const createPropertyIntoDB = async (
  payload: ICreatePropertyPayload,
  landlordId: string,
) => {
  const result = await prisma.property.create({
    data: {
      title: payload.title,
      description: payload.description,
      address: payload.address,
      city: payload.city,
      area: payload.area,
      rentPrice: payload.rentPrice,
      bedrooms: payload.bedrooms,
      bathrooms: payload.bathrooms,
      isAvailable: payload.isAvailable ?? true,

      landlordId,
      categoryId: payload.categoryId,
    },
  });

  return result;
};

// const getAllPropertiesFromDB = async () => {
//   const result = await prisma.property.findMany({
//     include: {
//       landlord: {
//         omit: {
//           password: true,
//         },
//       },
//       category: true,
//       amenities: true,
//       images: true,
//     },
//     orderBy: [{ createdAt: "desc" }, { title: "asc" }],
//   });
//   return result;
// };

const getAllPropertiesFromDB = async (query: any) => {
  const { searchTerm, city, area, minPrice, maxPrice, categoryId, amenities } =
    query;
  const where: any = {
    isAvailable: true,
  };

  // Search by city, area, address, title
  if (searchTerm) {
    where.OR = [
      {
        title: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        address: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        city: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        area: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        address: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    ];
  }

  // Filter by city
  if (city) {
    where.city = {
      contains: city,
      mode: "insensitive",
    };
  }

  // Filter by area
  if (area) {
    where.area = {
      contains: area,
      mode: "insensitive",
    };
  }

  // Filter by price
  if (minPrice || maxPrice) {
    where.rentPrice = {};

    if (minPrice) {
      where.rentPrice.gte = Number(minPrice);
    }

    if (maxPrice) {
      where.rentPrice.lte = Number(maxPrice);
    }
  }

  // Filter by property type (Category)
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // Filter by amenities (ID or Name)
  if (amenities) {
    let amenityValues: string[];

    try {
      const parsed = JSON.parse(amenities);
      amenityValues = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      amenityValues = [amenities];
    }

    where.amenities = {
      some: {
        OR: [
          {
            amenityId: {
              in: amenityValues,
            },
          },
          {
            amenity: {
              name: {
                in: amenityValues,
                mode: "insensitive",
              },
            },
          },
        ],
      },
    };
  }

  const result = await prisma.property.findMany({
    where,
    include: {
      landlord: {
        omit: {
          password: true,
        },
      },
      category: true,
      amenities: {
        include: {
          amenity: true,
        },
      },
      images: true,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        title: "asc",
      },
    ],
  });

  return result;
};

const getSinglePropertyFromBD = async (id: string) => {
  return prisma.property.findUniqueOrThrow({
    where: { id },
    include: {
      landlord: true,
      category: true,
    },
  });
};

const updatePropertyIntoDB = async (
  id: string,
  payload: IUpdatePropertyPayload,
) => {
  const { categoryId, images, amenities, ...propertyData } = payload;

  // Property exists?
  await prisma.property.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.property.update({
    where: {
      id,
    },
    data: {
      ...propertyData,

      ...(categoryId && {
        category: {
          connect: {
            id: categoryId,
          },
        },
      }),
    },
    include: {
      category: true,
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

      images: true,

      amenities: {
        include: {
          amenity: true,
        },
      },
    },
  });

  return result;
};

const deletePropertyFromDB = async (id: string) => {
  return prisma.property.delete({
    where: {
      id,
    },
  });
};

export const propertyService = {
  createPropertyIntoDB,
  getAllPropertiesFromDB,
  getSinglePropertyFromBD,
  updatePropertyIntoDB,
  deletePropertyFromDB,
};
