import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import { authRoute } from "./modules/auth/auth.route";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { auth } from "./middlewares/auth";
import { Role } from "../generated/prisma/enums";
import { adminRoute } from "./modules/admin/admin.route";
import { amenityRoute } from "./modules/amenity/amenity.route";
import { categoryRoute } from "./modules/category/category.route";
import { rentalRequestRoutes } from "./modules/rentalRequest/rentalRequest.route";
import { propertyRoutes } from "./modules/property/property.route";
import { propertyAmenityRoutes } from "./modules/propertyAmenity/propertyAmenity.route";
import { propertyImageRoutes } from "./modules/propertyImage/propertyImage.route";
import { reviewRoutes } from "./modules/review/review.route";
import { subscriptionRoutes } from "./modules/subscription/subscription.route";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app: Application = express();

app.use("/api/subscription/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RentNest API Backend Project",
      version: "1.0.0",
    },
    servers: [
      {
        // url: "http://localhost:5000",
        url: "https://rentnest-2-2ivc.onrender.com",
      },
    ],
  },
  // apis: ["./src/app.ts"],
  apis: ["./src/modules/**/*.ts", "./src/app.ts"],
};

const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Default Route
/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Default Route
 *     summary: Get logged in user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *       401:
 *         description: Unauthorized.
 */

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Register a new Tenant or Landlord account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: John@123
 *               phone:
 *                 type: string
 *                 example: "01712345678"
 *               role:
 *                 type: string
 *                 enum:
 *                   - TENANT
 *                   - LANDLORD
 *                 example: TENANT
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Validation failed.
 *       409:
 *         description: Email already exists.
 */

// Login API Documentation
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     description: Login using email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: John@123
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Invalid email or password.
 */

// Logout API
/**
 * @swagger
//  * /api/auth/logout:
//  *   post:
//  *     tags:
//  *       - Authentication
//  *     summary: Logout user
//  *     description: Logout the currently logged in user.
//  *     responses:
//  *       200:
//  *         description: Logout successful.
//  */

// Get Profile
// /**
//  * @swagger
//  * /api/auth/me:
//  *   get:
//  *     tags:
//  *       - Authentication
//  *     summary: Get logged in user profile
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: User profile retrieved successfully.
//  *       401:
//  *         description: Unauthorized.
//  */

// Refresh Token
/**
 * @swagger
 * /api/auth/refreshToken:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Generate new access token
 *     description: Create a new access token using refresh token.
 *     responses:
 *       200:
 *         description: New access token generated.
 *       401:
 *         description: Invalid refresh token.
 */

app.use("/api/auth", authRoute);

// Register a new admin
/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Register a new admin
 *     description: Create a new administrator account. Only existing admins should have access to this endpoint.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: Super Admin
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@rentnest.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Admin@123
 *               phone:
 *                 type: string
 *                 example: "01712345678"
 *     responses:
 *       201:
 *         description: Admin registered successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       409:
 *         description: Email already exists.
 */

// Get All Users
/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all users
 *     description: Retrieve all registered users.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum:
 *             - ADMIN
 *             - LANDLORD
 *             - TENANT
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - ACTIVE
 *             - BLOCKED
 *     responses:
 *       200:
 *         description: Users retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */

// Update User Status
/**
 * @swagger
 * /api/admin/users/{id}:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Update user status
 *     description: Block or activate a user account.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - ACTIVE
 *                   - BLOCKED
 *                 example: BLOCKED
 *     responses:
 *       200:
 *         description: User status updated successfully.
 *       400:
 *         description: Invalid request.
 *       404:
 *         description: User not found.
 */

// Get All Properties
/**
 * @swagger
 * /api/admin/properties:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all properties
 *     description: Retrieve all property listings.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *           example: Apartment
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *           example: Dhaka
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           example: 5000
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           example: 30000
 *     responses:
 *       200:
 *         description: Properties retrieved successfully.
 *       401:
 *         description: Unauthorized.
 */

// Get All Rental Requests
/**
 * @swagger
 * /api/admin/rentalRequest:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all rental requests
 *     description: Retrieve all rental requests in the system.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - PENDING
 *             - APPROVED
 *             - REJECTED
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Rental requests retrieved successfully.
 *       401:
 *         description: Unauthorized.
 */

app.use("/api/admin", adminRoute);

// Create Amenity
/**
 * @swagger
 * /api/amenities:
 *   post:
 *     tags:
 *       - Amenities
 *     summary: Create a new amenity
 *     description: Create a new amenity. Only ADMIN and LANDLORD can access this endpoint.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Swimming Pool
 *     responses:
 *       201:
 *         description: Amenity created successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       409:
 *         description: Amenity already exists.
 */

// Get All Amenities
/**
 * @swagger
 * /api/amenities:
 *   get:
 *     tags:
 *       - Amenities
 *     summary: Get all amenities
 *     description: Retrieve all available amenities.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *           example: Pool
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Amenities retrieved successfully.
 */

// Get Single Amenity
/**
 * @swagger
 * /api/amenities/{id}:
 *   get:
 *     tags:
 *       - Amenities
 *     summary: Get amenity by ID
 *     description: Retrieve a single amenity by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Amenity ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Amenity retrieved successfully.
 *       404:
 *         description: Amenity not found.
 */

// Update Amenity
/**
 * @swagger
 * /api/amenities/{id}:
 *   patch:
 *     tags:
 *       - Amenities
 *     summary: Update an amenity
 *     description: Update an existing amenity. Only ADMIN and LANDLORD can update amenities.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Amenity ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Gymnasium
 *     responses:
 *       200:
 *         description: Amenity updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Amenity not found.
 */

// Delete Amenity
/**
 * @swagger
 * /api/amenities/{id}:
 *   delete:
 *     tags:
 *       - Amenities
 *     summary: Delete an amenity
 *     description: Delete an amenity by ID. Only ADMIN and LANDLORD can perform this action.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Amenity ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Amenity deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Amenity not found.
 */

app.use("/api/amenities", amenityRoute);

// Create Category
/**
 * @swagger
 * /api/categories:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Create a new category
 *     description: Create a new property category. Only ADMIN can access this endpoint.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Apartment
 *     responses:
 *       201:
 *         description: Category created successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       409:
 *         description: Category already exists.
 */

// Get All Categories
/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get all categories
 *     description: Retrieve a list of all property categories.
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Page number
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         description: Number of records per page
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: searchTerm
 *         description: Search category by name
 *         schema:
 *           type: string
 *           example: Apartment
 *       - in: query
 *         name: sortBy
 *         description: Sort field
 *         schema:
 *           type: string
 *           enum:
 *             - name
 *             - createdAt
 *       - in: query
 *         name: sortOrder
 *         description: Sort order
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *     responses:
 *       200:
 *         description: Categories retrieved successfully.
 */

// Get Single Category
/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get category by ID
 *     description: Retrieve a specific category using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Category retrieved successfully.
 *       404:
 *         description: Category not found.
 */

// Update Category
/**
 * @swagger
 * /api/categories/{id}:
 *   patch:
 *     tags:
 *       - Categories
 *     summary: Update category
 *     description: Update an existing category. Only ADMIN can access this endpoint.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Luxury Apartment
 *     responses:
 *       200:
 *         description: Category updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Category not found.
 */

// Delete Category
/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Delete category
 *     description: Delete a category by ID. Only ADMIN can perform this action.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Category deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Category not found.
 */

app.use("/api/categories", categoryRoute);

// Create Property
/**
 * @swagger
 * /api/properties:
 *   post:
 *     tags:
 *       - Properties
 *     summary: Create a new property
 *     description: Create a new rental property. Only ADMIN and LANDLORD can create properties.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - rentPrice
 *               - bedrooms
 *               - bathrooms
 *               - address
 *               - city
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Luxury Apartment
 *               description:
 *                 type: string
 *                 example: Fully furnished apartment with modern facilities.
 *               rentPrice:
 *                 type: number
 *                 example: 25000
 *               bedrooms:
 *                 type: integer
 *                 example: 3
 *               bathrooms:
 *                 type: integer
 *                 example: 2
 *               address:
 *                 type: string
 *                 example: House 12, Road 5
 *               city:
 *                 type: string
 *                 example: Dhaka
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               amenityIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example:
 *                   - "5d9bbf0e-20b2-4d61-9f18-648ad7b38df5"
 *                   - "1eb8a705-3df8-45d5-a913-71f9a0e80ec8"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 example:
 *                   - https://example.com/image1.jpg
 *                   - https://example.com/image2.jpg
 *     responses:
 *       201:
 *         description: Property created successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */

// Get All Properties
/**
 * @swagger
 * /api/properties:
 *   get:
 *     tags:
 *       - Properties
 *     summary: Get all properties
 *     description: Retrieve all available properties with filtering, sorting and pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search by property title or description
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: bedrooms
 *         schema:
 *           type: integer
 *       - in: query
 *         name: bathrooms
 *         schema:
 *           type: integer
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum:
 *             - rentPrice
 *             - createdAt
 *             - title
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *     responses:
 *       200:
 *         description: Properties retrieved successfully.
 */

// Get Single Property
/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     tags:
 *       - Properties
 *     summary: Get Single Property
 *     description: Retrieve a single property by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Property retrieved successfully.
 *       404:
 *         description: Property not found.
 */

// Update Property
/**
 * @swagger
 * /api/properties/{id}:
 *   patch:
 *     tags:
 *       - Properties
 *     summary: Update property
 *     description: Update property information. Only ADMIN and LANDLORD can update properties.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               rentPrice:
 *                 type: number
 *               bedrooms:
 *                 type: integer
 *               bathrooms:
 *                 type: integer
 *               city:
 *                 type: string
 *               address:
 *                 type: string
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               available:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Property updated successfully.
 *       404:
 *         description: Property not found.
 */

// Delete Property
/**
 * @swagger
 * /api/properties/{id}:
 *   delete:
 *     tags:
 *       - Properties
 *     summary: Delete property
 *     description: Delete a property. Only ADMIN and LANDLORD can delete properties.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Property deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Property not found.
 */

app.use("/api/properties", propertyRoutes);

// Assign Amenities to Property
/**
 * @swagger
 * /api/propertyAmenities:
 *   post:
 *     tags:
 *       - Property Amenities
 *     summary: Assign amenities to a property
 *     description: Assign one or more amenities to a property. Only ADMIN and LANDLORD can perform this action.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - propertyId
 *               - amenityIds
 *             properties:
 *               propertyId:
 *                 type: string
 *                 format: uuid
 *                 example: "d8e6a5c7-4c90-4e3f-a77b-cf6f5f87d2b8"
 *               amenityIds:
 *                 type: array
 *                 description: List of amenity IDs
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example:
 *                   - "25f6450f-f7ef-4d63-a0ea-85b35d0ec5a8"
 *                   - "7b4ef0df-bd8f-4b17-84c4-87c1dca11d59"
 *     responses:
 *       201:
 *         description: Amenities assigned successfully.
 *       400:
 *         description: Invalid request body.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Property or amenity not found.
 *       409:
 *         description: One or more amenities are already assigned.
 */

// Remove Amenities from Property
/**
 * @swagger
 * /api/propertyAmenities:
 *   delete:
 *     tags:
 *       - Property Amenities
 *     summary: Remove amenities from a property
 *     description: Remove one or more amenities from a property. Only ADMIN and LANDLORD can perform this action.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - propertyId
 *               - amenityIds
 *             properties:
 *               propertyId:
 *                 type: string
 *                 format: uuid
 *               amenityIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example:
 *                   - "25f6450f-f7ef-4d63-a0ea-85b35d0ec5a8"
 *                   - "7b4ef0df-bd8f-4b17-84c4-87c1dca11d59"
 *     responses:
 *       200:
 *         description: Amenities removed successfully.
 *       400:
 *         description: Invalid request body.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Property or amenity not found.
 */

// Get Amenities of a Property
/**
 * @swagger
 * /api/propertyAmenities/{propertyId}:
 *   get:
 *     tags:
 *       - Property Amenities
 *     summary: Get amenities of a property
 *     description: Retrieve all amenities assigned to a specific property.
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         description: Property ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Property amenities retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Amenity'
 *       404:
 *         description: Property not found.
 */

app.use("/api/propertyAmenities", propertyAmenityRoutes);

// Add Property Image
/**
 * @swagger
 * /api/propertyImages:
 *   post:
 *     tags:
 *       - Property Images
 *     summary: Add property image URL
 *     description: Upload a new image for a property. Only ADMIN and LANDLORD can upload property images.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - propertyId
 *               - imageUrl
 *             properties:
 *               propertyId:
 *                 type: string
 *                 format: uuid
 *                 example: "fd91f8f0-8fb2-4d5b-ae4e-dac878cbdf1a"
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://res.cloudinary.com/demo/image/upload/property1.jpg
 *     responses:
 *       201:
 *         description: Property image uploaded successfully.
 *       400:
 *         description: Invalid request body.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Property not found.
 */

// Get All Property Images
/**
 * @swagger
 * /api/propertyImages:
 *   get:
 *     tags:
 *       - Property Images
 *     summary: Get all property images
 *     description: Retrieve all property images with pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Property images retrieved successfully.
 */

// Get Single Property Image
/**
 * @swagger
 * /api/propertyImages/{id}:
 *   get:
 *     tags:
 *       - Property Images
 *     summary: Get property image by ID
 *     description: Retrieve a single property image by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Property image retrieved successfully.
 *       404:
 *         description: Property image not found.
 */

// Get All Images of a Property
/**
 * @swagger
 * /api/propertyImages/propertyAllImages/{id}:
 *   get:
 *     tags:
 *       - Property Images
 *     summary: Get all images for a property
 *     description: Retrieve all images associated with a specific property.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Property ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Property images retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PropertyImage'
 *       404:
 *         description: Property not found.
 */

// Update Property Image
/**
 * @swagger
 * /api/propertyImages/{id}:
 *   patch:
 *     tags:
 *       - Property Images
 *     summary: Update property image
 *     description: Update an existing property image. Only ADMIN and LANDLORD can perform this action.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://res.cloudinary.com/demo/image/upload/property-new.jpg
 *     responses:
 *       200:
 *         description: Property image updated successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Property image not found.
 */

// Delete Property Image
/**
 * @swagger
 * /api/propertyImages/{id}:
 *   delete:
 *     tags:
 *       - Property Images
 *     summary: Delete property image
 *     description: Delete a property image. Only ADMIN and LANDLORD can perform this action.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Property image deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Property image not found.
 */

app.use("/api/propertyImages", propertyImageRoutes);

// Create Rental Request
/**
 * @swagger
 * /api/rentalsRequest:
 *   post:
 *     tags:
 *       - Rental Requests
 *     summary: Create a rental request
 *     description: A tenant can submit a rental request for a property.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - propertyId
 *               - moveInDate
 *               - rentalDuration
 *               - monthlyRent
 *             properties:
 *               propertyId:
 *                 type: string
 *                 format: uuid
 *                 example: "a3b6a6e4-7b9f-4d91-a3d4-7e77c1f2d5e1"
 *               moveInDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-08-01"
 *               rentalDuration:
 *                 type: integer
 *                 description: Duration in months
 *                 example: 12
 *               monthlyRent:
 *                 type: number
 *                 example: 25000
 *               message:
 *                 type: string
 *                 example: I would like to rent this property from next month.
 *     responses:
 *       201:
 *         description: Rental request created successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Property not found.
 *       409:
 *         description: Rental request already exists.
 */

// Get All Rental Requests
/**
 * @swagger
 * /api/rentalsRequest:
 *   get:
 *     tags:
 *       - Rental Requests
 *     summary: Get all rental requests
 *     description: Retrieve rental requests based on the authenticated user's role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - PENDING
 *             - APPROVED
 *             - REJECTED
 *       - in: query
 *         name: propertyId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Rental requests retrieved successfully.
 *       401:
 *         description: Unauthorized.
 */

// Get Single Rental Request
/**
 * @swagger
 * /api/rentalsRequest/{id}:
 *   get:
 *     tags:
 *       - Rental Requests
 *     summary: Get rental request by ID
 *     description: Retrieve a single rental request.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Rental Request ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Rental request retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Rental request not found.
 */

// Update Rental Request
/**
 * @swagger
 * /api/rentalsRequest/{id}:
 *   patch:
 *     tags:
 *       - Rental Requests
 *     summary: Update rental request
 *     description: Update an existing rental request. Only the tenant who created it can update the request.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Rental Request ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               moveInDate:
 *                 type: string
 *                 format: date
 *               rentalDuration:
 *                 type: integer
 *               monthlyRent:
 *                 type: number
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rental request updated successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Rental request not found.
 */

// Update Rental Request Status
/**
 * @swagger
 * /api/rentalsRequest/status/{id}:
 *   patch:
 *     tags:
 *       - Rental Requests
 *     summary: Update rental request status
 *     description: Approve or reject a rental request. Only the LANDLORD who owns the property can perform this action.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Rental Request ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - APPROVED
 *                   - REJECTED
 *                 example: APPROVED
 *     responses:
 *       200:
 *         description: Rental request status updated successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Rental request not found.
 */

// Delete Rental Request
/**
 * @swagger
 * /api/rentalsRequest/{id}:
 *   delete:
 *     tags:
 *       - Rental Requests
 *     summary: Delete rental request
 *     description: Delete a rental request. Accessible by ADMIN or the associated LANDLORD according to your authorization rules.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Rental Request ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Rental request deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Rental request not found.
 */

app.use("/api/rentalsRequest", rentalRequestRoutes);

// Create Review
/**
 * @swagger
 * /api/reviews:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Create a property review
 *     description: A TENANT can submit a review and rating for a rented property.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - propertyId
 *               - rating
 *               - comment
 *             properties:
 *               propertyId:
 *                 type: string
 *                 format: uuid
 *                 example: "b0bfe57d-42fc-4905-a4d2-5ef1b18e9c52"
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Excellent location, clean rooms, and very helpful landlord."
 *     responses:
 *       201:
 *         description: Review created successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Only tenants can create reviews.
 *       404:
 *         description: Property not found.
 *       409:
 *         description: Review already exists for this property.
 */

// Get All Reviews/
/**
 * @swagger
 * /api/reviews:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get all reviews
 *     description: Retrieve all property reviews. Accessible by ADMIN and TENANT.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Page number
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         description: Number of records per page
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: propertyId
 *         description: Filter reviews by property ID
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: rating
 *         description: Filter by rating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully.
 *       401:
 *         description: Unauthorized.
 */

// Get Reviews by Property ID
/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get reviews for a property
 *     description: Retrieve all reviews associated with a specific property.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Property ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully.
 *       404:
 *         description: Property not found.
 */

// Update Review
/**
 * @swagger
 * /api/reviews/{id}:
 *   patch:
 *     tags:
 *       - Reviews
 *     summary: Update a review
 *     description: Update an existing review. Only the tenant who created the review can update it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Updated review after staying for a few more months."
 *     responses:
 *       200:
 *         description: Review updated successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Review not found.
 */

// Delete Review
/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     tags:
 *       - Reviews
 *     summary: Delete a review
 *     description: Delete a review. Only the tenant who created the review can delete it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Review deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Review not found.
 */

app.use("/api/reviews", reviewRoutes);

// Create Checkout Session
/**
 * @swagger
 * /api/subscription/checkout:
 *   post:
 *     tags:
 *       - Subscription
 *     summary: Create Stripe Checkout Session
 *     description: Creates a Stripe Checkout Session for a tenant subscription.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - priceId
 *             properties:
 *               priceId:
 *                 type: string
 *                 example: price_1Rxxxxxxxxxxxxxxxx
 *               successUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://rentnest.com/payment/success
 *               cancelUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://rentnest.com/payment/cancel
 *     responses:
 *       200:
 *         description: Stripe Checkout Session created successfully.
 *       400:
 *         description: Invalid request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Stripe error.
 */

// Stripe Webhook
/**
 * @swagger
 * /api/subscription/webhook:
 *   post:
 *     tags:
 *       - Subscription
 *     summary: Stripe Webhook
 *     description: Receives Stripe webhook events after successful or failed payment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully.
 *       400:
 *         description: Invalid webhook signature.
 */

// Get Subscription Status
/**
 * @swagger
 * /api/subscription/status:
 *   get:
 *     tags:
 *       - Subscription
 *     summary: Get current subscription status
 *     description: Returns the authenticated user's current subscription status.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription status retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Subscription not found.
 */

// Get All Subscription Details
/**
 * @swagger
 * /api/subscription/getAllSubscriptionDetails:
 *   get:
 *     tags:
 *       - Subscription
 *     summary: Get all subscriptions
 *     description: Retrieve all subscription details. Only ADMIN can access this endpoint.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - ACTIVE
 *             - EXPIRED
 *             - CANCELLED
 *     responses:
 *       200:
 *         description: Subscription list retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */

// Get Payment History
/**
 * @swagger
 * /api/subscription/paymentHistory:
 *   get:
 *     tags:
 *       - Subscription
 *     summary: Get payment history
 *     description: Retrieve all subscription payment history. Accessible only by ADMIN.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum:
 *             - PENDING
 *             - PAID
 *             - FAILED
 *             - REFUNDED
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */

app.use("/api/subscription", subscriptionRoutes);

// Not Found Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
