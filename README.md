# PH_Assignment_4_RentNest

Rental Project.

# 🏠 RentNest

> Find & List Rental Properties with Ease

<p align="center">
  Used Technology
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20.x-green" />
  <img src="https://img.shields.io/badge/Express.js-5.x-black" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-blue" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748" />
  <img src="https://img.shields.io/badge/Stripe-Payment-635BFF" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

# 🌐 Live Links

- <a href="https://github.com/ramen72/PH_Assignment_4_RentNest.git" target="_blank">Backend Repo</a>
- <a href="https://example.com" target="_blank">Live API</a>
<!-- - <a href="https://drive.google.com/file/d/1JKjlh2j_K58OopbtXOHdVSa2qTefYxXE/view?usp=sharing" target="_blank">API Documentation</a> -->
- <a href="http://localhost:5000/api-docs/" target="_blank">API Documentation</a>
- <a href="https://drive.google.com/file/d/1NDe7ecuSa7If1bdMnRp00vvgW88Pe8mw/view?usp=sharing" target="_blank">Demo Video</a>

### Admin Email : ADMIN@gmail.com

### Admin Password : 12345678

---

# 📖 Table of Contents

- Project Overview
- Live Links
- Features
- Technology Stack
- System Architecture
- Database Schema
- Project Structure
- Installation
- Environment Variables
- Authentication
- Roles & Permissions
- API Documentation
- Filtering & Pagination
- Payment Flow
- Error Handling
- Response Format
- Deployment
- Future Improvements
- Contributing
- Author
- License

---

# Project Overview

Project introduction...

---

# Features

## Public Features

- Browse properties
- Search properties
- View details

## Tenant Features

- Registration
- Login
- Rental request
- Stripe Payment
- Payment History
- Reviews
- Profile Management

## Landlord Features

- Property CRUD
- Manage Requests
- Property Availability

## Admin Features

- Manage Users
- Manage Categories
- Manage Properties
- View Reports

---

# Technology Stack

## Backend

- Node.js
- Express.js
- TypeScript

## Database

- PostgreSQL
- Prisma ORM

## Authentication

- JWT
- bcrypt

## Payment

- Stripe

## Others

- Cookie Parser
- CORS
- dotenv

---

# System Architecture

Backend API

↓

PostgreSQL Database

↓

Stripe

---

# Database Schema

## User

| Field | Type   |
| ----- | ------ |
| id    | UUID   |
| name  | String |
| email | String |
| ...   |

---

# 📂 Project Structure

```text
PH_Assignment_4_RentNest
│
├── prisma
├── src
│   ├── config
│   ├── lib
│   ├── middlewares
│   ├── modules
│   │   ├── admin
│   │   ├── amenity
│   │   ├── auth
│   │   ├── category
│   │   ├── property
│   │   ├── propertyAmenity
│   │   ├── propertyImages payment
│   │   ├── rentalRequest
│   │   ├── review
│   │   └── subscription
│   │── utils
│   ├── app.ts
│   └── server.ts
│
├── .env
├── Package-lock.json
├── Packagejson
├── README.md
└── prisma.config.ts
```
