# Freegi Backend API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Authentication](#authentication)
4. [Base Configuration](#base-configuration)
5. [Data Models](#data-models)
6. [SuperAdmin APIs](#superadmin-apis)
7. [Admin APIs](#admin-apis)
8. [Customer APIs](#customer-apis)
9. [Driver APIs](#driver-apis)
10. [File Management](#file-management)
11. [Real-time Communication](#real-time-communication)
12. [Error Handling](#error-handling)
13. [API Testing](#api-testing)

---

## Overview

Freegi is a comprehensive e-commerce backend system built with Node.js, TypeScript, Express, and MongoDB. It supports multi-user architecture with role-based access control, real-time messaging, payment integration, and delivery tracking.

### Key Features

- **Multi-user System**: SuperAdmin, Admin, Customer, DeliveryAgent roles
- **E-commerce Platform**: Product catalog, shopping cart, order management
- **Payment Integration**: Razorpay, Wallet, Cash on Delivery
- **Real-time Communication**: Socket.io for messaging and live tracking
- **Location Services**: GPS tracking for delivery agents
- **Multi-store Support**: Store-based inventory and order management
- **File Management**: Image upload and storage
- **Review System**: Product ratings and reviews

### Technology Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with encryption
- **Payments**: Razorpay integration
- **Real-time**: Socket.io
- **File Storage**: Local file system + AWS S3 ready
- **Email**: SendGrid integration
- **Push Notifications**: Firebase Cloud Messaging

---

## Architecture

The application follows a modular architecture:

```
src/
├── index.ts              # Main application entry point
├── middleware/           # Authentication and error handling
├── models/              # MongoDB schemas
├── services/            # API routes organized by user type
│   ├── superAdmin/      # SuperAdmin specific APIs
│   ├── admin/           # Admin specific APIs
│   ├── customer/        # Customer specific APIs
│   └── driver/          # Driver specific APIs
├── helper/              # Utility functions
├── startup/             # Application initialization
└── config/              # Configuration files
```

---

## Authentication

### JWT Token-Based Authentication

The system uses JWT tokens with encryption for secure authentication:

1. **Login**: User provides credentials → Server validates → Returns encrypted JWT token
2. **Authenticated Requests**: Include `x-auth-token` header with encrypted token
3. **Token Validation**: Server decrypts and validates token for each request

### Token Format

```typescript
// Token payload structure
{
  "cid": "user_id",
  "storeId": "store_id", // For admin/store-specific operations
  "iat": "issued_at_timestamp"
}
```

### Authentication Headers

```http
x-auth-token: encrypted_jwt_token_here
Content-Type: application/json
```

### User Roles

- **SuperAdmin**: Platform-wide management, store creation
- **Admin**: Store management, inventory, orders
- **Customer**: Shopping, orders, profile management
- **DeliveryAgent**: Order delivery, location tracking

---

## Base Configuration

### Environment Variables

```bash
PORT=3100
NODE_ENV=production
DB_URL=mongodb://localhost:27017/freegi
JWT_PRIVATE_KEY=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
SENDGRID_API_KEY=your_sendgrid_key
```

### Base URL

```
Development: http://localhost:3100
Production: https://your-domain.com
```

### Common Response Format

```json
{
  "message": "Success message",
  "data": {}, // Response data
  "error": {} // Error details (if any)
}
```

---

## Data Models

### User Schema

```typescript
{
  "_id": "ObjectId",
  "firstName": "string",
  "lastName": "string", 
  "email": "string",
  "mobileNumber": "string",
  "password": "string (hashed)",
  "role": "Admin | Customer | DeliveryAgent",
  "isVerify": "boolean",
  "amount": "number (wallet balance)",
  "profilePic": "string (URL)",
  "storeId": "ObjectId",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Product Schema

```typescript
{
  "_id": "ObjectId",
  "name": "string",
  "description": "string",
  "image": "string (main image URL)",
  "imageList": ["string (additional images)"],
  "category": "ObjectId (ref: Category)",
  "subCategory": "ObjectId (ref: SubCategory)",
  "status": "enable | disable",
  "storeId": "ObjectId",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Order Schema

```typescript
{
  "_id": "ObjectId",
  "orderId": "string (unique)",
  "userId": "ObjectId (ref: User)",
  "products": [{
    "productId": "ObjectId",
    "optionId": "ObjectId",
    "quantity": "number",
    "price": "number"
  }],
  "totalAmount": "number",
  "status": "pending | confirmed | shipped | delivered | cancelled",
  "paymentMethod": "razorpay | wallet | cash",
  "paymentStatus": "pending | completed",
  "address": "ObjectId (ref: Address)",
  "deliveryAgent": "ObjectId (ref: User)",
  "deliveryDate": "Date",
  "createdAt": "Date"
}
```

### Cart Schema

```typescript
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "products": [{
    "productId": "ObjectId",
    "optionId": "ObjectId", 
    "quantity": "number",
    "price": "number"
  }],
  "dealofthedayId": [{
    "dealId": "ObjectId",
    "quantity": "number"
  }],
  "amount": "number (total)",
  "storeId": "ObjectId"
}
```

---

## SuperAdmin APIs

SuperAdmin has the highest level of access for platform management.

### Authentication

#### SuperAdmin Login

**Endpoint**: `POST /superAdmin/login`

**Description**: Authenticate SuperAdmin user

**Request Body**:
```json
{
  "email": "superadmin@freegi.com",
  "password": "SuperAdmin@123"
}
```

**Response**:
```json
{
  "message": "SuperAdmin login successfully.",
  "id": "superadmin_user_id",
  "token": "encrypted_jwt_token"
}
```

### Store Management

#### Create Store/Admin

**Endpoint**: `POST /superAdmin/storeUser/register`

**Headers**: `x-auth-token: {token}`

**Description**: Create new store with admin user

**Request Body**:
```json
{
  "storeName": "Freegi Store Mumbai",
  "storeAddress": "123 Main Street, Mumbai, Maharashtra, 400001",
  "ownerName": "John Doe", 
  "email": "admin@freegistore.com",
  "mobileNumber": "+919876543210",
  "password": "Admin@123"
}
```

**Response**:
```json
{
  "message": "Store created successfully.",
  "user": {
    "_id": "admin_user_id",
    "storeName": "Freegi Store Mumbai",
    "storeId": "store_id",
    "role": "Admin",
    "isVerify": true
  }
}
```

---

## Admin APIs

Admin users manage individual stores, products, orders, and content.

### Authentication

#### Admin Login

**Endpoint**: `POST /admin/login`

**Request Body**:
```json
{
  "email": "admin@freegistore.com", 
  "password": "Admin@123"
}
```

**Response**:
```json
{
  "message": "Admin login successfully.",
  "id": "admin_user_id",
  "token": "encrypted_jwt_token"
}
```

### Profile Management

#### Get Admin Profile

**Endpoint**: `GET /admin/profile/view`

**Headers**: `x-auth-token: {token}`

**Response**:
```json
{
  "data": {
    "_id": "admin_id",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@freegistore.com",
    "storeName": "Freegi Store Mumbai",
    "storeId": "store_id"
  }
}
```

### Category Management

#### Get Categories List

**Endpoint**: `POST /admin/category/list`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "pageNo": 1,
  "status": "enable",
  "storeId": "store_id"
}
```

**Response**:
```json
{
  "data": {
    "totalRecords": 25,
    "lastPage": false,
    "category": [
      {
        "_id": "category_id",
        "name": "Electronics",
        "image": "https://example.com/electronics.jpg",
        "icon": "electronics-icon.png",
        "color": "#2196F3",
        "status": "enable",
        "productCount": 15
      }
    ]
  }
}
```

#### Add Category

**Endpoint**: `POST /admin/category/add`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "name": "Electronics",
  "image": "https://example.com/electronics.jpg",
  "icon": "electronics-icon.png", 
  "color": "#2196F3",
  "storeId": "store_id"
}
```

#### Update Category

**Endpoint**: `POST /admin/category/update`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "id": "category_id",
  "name": "Updated Electronics",
  "image": "https://example.com/updated-electronics.jpg",
  "storeId": "store_id"
}
```

#### Delete Category

**Endpoint**: `POST /admin/category/remove`

**Request Body**:
```json
{
  "id": "category_id",
  "storeId": "store_id"
}
```

### Product Management

#### Get Products List

**Endpoint**: `POST /admin/product/list`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "pageNo": 1,
  "categoryId": "category_id",
  "subCategoryId": "subcategory_id",
  "storeId": "store_id"
}
```

#### Add Product

**Endpoint**: `POST /admin/product/add`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "name": "iPhone 15 Pro",
  "category": "category_id",
  "subCategory": "subcategory_id", 
  "description": "Latest iPhone with advanced features",
  "image": "https://example.com/iphone15pro.jpg",
  "imageList": [
    "https://example.com/iphone15pro-1.jpg",
    "https://example.com/iphone15pro-2.jpg"
  ],
  "status": "enable",
  "storeId": "store_id",
  "options": [
    {
      "title": "128GB - Space Black",
      "mass": "128GB",
      "stock": 50,
      "price": 99999
    },
    {
      "title": "256GB - Natural Titanium", 
      "mass": "256GB",
      "stock": 30,
      "price": 109999
    }
  ]
}
```

**Response**:
```json
{
  "message": "Product added successfully.",
  "data": {
    "_id": "product_id",
    "name": "iPhone 15 Pro",
    "status": "enable"
  },
  "options": [
    {
      "_id": "option_id_1",
      "productId": "product_id",
      "title": "128GB - Space Black",
      "price": 99999,
      "stock": 50
    }
  ]
}
```

### Order Management

#### Get Orders List

**Endpoint**: `POST /admin/order/list`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "pageNo": 1,
  "status": "pending",
  "storeId": "store_id"
}
```

**Response**:
```json
{
  "data": {
    "orders": [
      {
        "_id": "order_id",
        "orderId": "ORD_1234567890",
        "userId": {
          "_id": "customer_id",
          "firstName": "John",
          "lastName": "Doe"
        },
        "products": [
          {
            "productId": {
              "_id": "product_id",
              "name": "iPhone 15 Pro"
            },
            "quantity": 1,
            "price": 99999
          }
        ],
        "totalAmount": 100099,
        "status": "pending",
        "paymentStatus": "completed",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

#### Update Order Status

**Endpoint**: `POST /admin/order/update-status`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "orderId": "order_id",
  "status": "confirmed",
  "storeId": "store_id"
}
```

### Dashboard

#### Get Dashboard Statistics

**Endpoint**: `POST /admin/dashboard/count`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "storeId": "store_id"
}
```

**Response**:
```json
{
  "data": {
    "totalProducts": 150,
    "totalOrders": 1250,
    "totalCustomers": 5000,
    "totalRevenue": 2500000,
    "pendingOrders": 45,
    "completedOrders": 1205
  }
}
```

---

## Customer APIs

Customer APIs handle shopping experience, orders, and account management.

### Authentication

#### Customer Signup

**Endpoint**: `POST /customer/signup`

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@example.com",
  "mobileNumber": "+919876543210"
}
```

**Response**:
```json
{
  "message": "OTP sent successfully."
}
```

#### Verify OTP

**Endpoint**: `POST /customer/verify`

**Request Body**:
```json
{
  "mobileNumber": "+919876543210",
  "otp": "123456",
  "password": "Customer@123"
}
```

#### Customer Login

**Endpoint**: `POST /customer/login`

**Request Body**:
```json
{
  "mobileNumber": "+919876543210", 
  "password": "Customer@123"
}
```

**Response**:
```json
{
  "message": "Customer login successfully.",
  "id": "customer_id",
  "token": "encrypted_jwt_token"
}
```

### Profile Management

#### Get Customer Profile

**Endpoint**: `GET /customer/profile/view`

**Headers**: `x-auth-token: {token}`

**Response**:
```json
{
  "data": {
    "_id": "customer_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "mobileNumber": "+919876543210",
    "amount": 5000
  },
  "address": {
    "_id": "address_id",
    "tag": "Home",
    "address": "123 Main Street, Mumbai",
    "pincode": "400001",
    "default": true
  }
}
```

#### Update Profile

**Endpoint**: `POST /customer/profile/update`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "gender": "male",
  "dob": "1990-01-15"
}
```

### Address Management

#### Get Address List

**Endpoint**: `POST /customer/address/list`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "userId": "customer_id"
}
```

#### Add Address

**Endpoint**: `POST /customer/address/add`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "tag": "Home",
  "addressType": "residential",
  "floor": "2nd Floor",
  "address": "123 Main Street, Apartment 201, Mumbai, Maharashtra",
  "landMark": "Near City Mall",
  "pincode": "400001", 
  "lat": "19.0760",
  "long": "72.8777",
  "default": true
}
```

### Product Catalog

#### Get Categories

**Endpoint**: `POST /customer/category/list`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "pageNo": 1,
  "storeId": "store_id" 
}
```

#### Get Products

**Endpoint**: `POST /customer/product/list`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "pageNo": 1,
  "categoryId": "category_id",
  "subCategoryId": "subcategory_id",
  "sortBy": "price",
  "sortOrder": "asc",
  "priceRange": {
    "min": 1000,
    "max": 50000
  },
  "storeId": "store_id"
}
```

**Response**:
```json
{
  "data": {
    "products": [
      {
        "_id": "product_id",
        "name": "iPhone 15 Pro",
        "image": "https://example.com/iphone.jpg",
        "description": "Latest iPhone",
        "rating": 4.5,
        "isWish": false,
        "options": [
          {
            "_id": "option_id",
            "title": "128GB - Space Black",
            "price": 99999,
            "stock": 50
          }
        ]
      }
    ]
  }
}
```

#### Search Products

**Endpoint**: `POST /customer/product/search`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "searchTerm": "iPhone",
  "pageNo": 1,
  "storeId": "store_id"
}
```

### Shopping Cart

#### Add to Cart

**Endpoint**: `POST /customer/cart/add`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "products": [
    {
      "productId": "product_id",
      "optionId": "option_id", 
      "quantity": 2,
      "price": 99999
    }
  ],
  "dealOfTheDay": [
    {
      "dealId": "deal_id",
      "quantity": 1
    }
  ]
}
```

**Response**:
```json
{
  "message": "Product added to cart",
  "previousAmount": 0,
  "newAmount": 199998,
  "cart": {
    "_id": "cart_id",
    "userId": "customer_id",
    "products": [...],
    "amount": 199998
  }
}
```

#### View Cart

**Endpoint**: `POST /customer/cart/view`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "userId": "customer_id"
}
```

#### Apply Coupon

**Endpoint**: `POST /customer/cart/coupon-apply`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "couponCode": "SUMMER50",
  "cartAmount": 5000
}
```

### Order Management

#### Place Order

**Endpoint**: `POST /customer/order/add`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "orderId": "ORD_1234567890",
  "products": [
    {
      "productId": "product_id",
      "optionId": "option_id",
      "quantity": 2,
      "price": 99999
    }
  ],
  "totalAmount": 205000,
  "discount": 5000,
  "deliveryCharge": 100,
  "handlingCharge": 50,
  "paymentMethod": "razorpay",
  "tax": "tax_id",
  "address": "address_id",
  "cartId": "cart_id"
}
```

#### Get Order History

**Endpoint**: `POST /customer/order/list`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "pageNo": 1,
  "status": "delivered"
}
```

### Wishlist

#### Add to Wishlist

**Endpoint**: `POST /customer/wish/add`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "userId": "customer_id",
  "productId": "product_id",
  "storeId": "store_id"
}
```

#### Get Wishlist

**Endpoint**: `POST /customer/wish/list`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "userId": "customer_id",
  "storeId": "store_id"
}
```

### Wallet Management

#### Get Wallet Balance

**Endpoint**: `POST /customer/wallet/amount-detail`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "userId": "customer_id"
}
```

**Response**:
```json
{
  "message": "successfully.",
  "data": 5000
}
```

#### Add Money to Wallet

**Endpoint**: `POST /customer/wallet/add`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "amount": 1000,
  "paymentMethod": "razorpay",
  "description": "Add money to wallet"
}
```

#### Get Wallet Transactions

**Endpoint**: `POST /customer/wallet/list`

**Headers**: `x-auth-token: {token}`

**Response**:
```json
{
  "data": [
    {
      "_id": "transaction_id",
      "userId": "customer_id",
      "amount": 1000,
      "status": "completed",
      "isWallet": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## Driver APIs

Driver APIs handle delivery operations and location tracking.

### Authentication

#### Driver Login

**Endpoint**: `POST /driver/login`

**Request Body**:
```json
{
  "email": "driver@freegi.com",
  "password": "Driver@123"
}
```

**Response**:
```json
{
  "message": "Delivery agent login successfully.",
  "id": "driver_id",
  "token": "encrypted_jwt_token"
}
```

### Profile Management

#### Get Driver Profile

**Endpoint**: `GET /driver/profile/view`

**Headers**: `x-auth-token: {token}`

### Order Management

#### Get Available Orders

**Endpoint**: `POST /driver/order/list`

**Headers**: `x-auth-token: {token}`

**Response**:
```json
{
  "data": [
    {
      "_id": "order_id",
      "orderId": "ORD_1234567890",
      "userId": {
        "firstName": "John",
        "lastName": "Doe",
        "mobileNumber": "+919876543210"
      },
      "products": [...],
      "totalAmount": 100000,
      "status": "confirmed",
      "address": {
        "address": "123 Main Street, Mumbai",
        "pincode": "400001",
        "lat": "19.0760",
        "long": "72.8777"
      }
    }
  ]
}
```

#### Get Dashboard Statistics

**Endpoint**: `POST /driver/order/dashboard`

**Headers**: `x-auth-token: {token}`

**Response**:
```json
{
  "data": {
    "totalDeliveries": 150,
    "pendingDeliveries": 5,
    "completedToday": 8,
    "earnings": 15000
  }
}
```

### Location Tracking

#### Update Location

**Endpoint**: `POST /driver/geoLocation/update`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "orderId": "order_id",
  "lat": "19.0760",
  "long": "72.8777",
  "date": "2024-01-15T10:30:00.000Z"
}
```

**Response**:
```json
{
  "message": "Geo Location saved successfully."
}
```

#### End Delivery

**Endpoint**: `POST /driver/geoLocation/delivery-end`

**Headers**: `x-auth-token: {token}`

**Request Body**:
```json
{
  "orderId": "order_id"
}
```

---

## File Management

### File Upload

**Endpoint**: `POST /upload`

**Headers**: `x-auth-token: {token}`

**Content-Type**: `multipart/form-data`

**Form Data**:
- `file`: File to upload
- `folder`: Target folder (optional)

**Response**:
```json
{
  "message": "File uploaded successfully",
  "filename": "uploaded_file.jpg",
  "path": "/files/uploaded_file.jpg"
}
```

### Access Static Files

**Endpoint**: `GET /files/{filename}`

**Description**: Access uploaded files directly via URL

---

## Real-time Communication

### WebSocket Connection

**URL**: `ws://localhost:3100/socket.io/?transport=websocket`

### Socket Events

#### Join Chat Room

```javascript
socket.emit('joinRoom', {
  chatId: 'chat_id_here'
});
```

#### Send Message

```javascript
socket.emit('sendMessage', {
  chatId: 'chat_id',
  senderId: 'sender_id',
  receiverId: 'receiver_id', 
  message: 'Hello!',
  flag: 'text'
});
```

#### Receive Message

```javascript
socket.on('receiveMessage', (message) => {
  console.log('New message:', message);
});
```

### Message Schema

```typescript
{
  "_id": "ObjectId",
  "chatId": "string",
  "senderId": "ObjectId",
  "receiverId": "ObjectId", 
  "message": "string",
  "flag": "text | image | document",
  "timestamp": "Date"
}
```

---

## Error Handling

### Standard Error Response

```json
{
  "message": "Error description",
  "error": {
    "field": "Specific field error message"
  }
}
```

### HTTP Status Codes

- `200`: Success
- `400`: Bad Request / Validation Error
- `401`: Unauthorized / Authentication Failed
- `404`: Not Found
- `500`: Internal Server Error

### Common Error Scenarios

#### Authentication Errors

```json
{
  "message": "Authentication failed!"
}
```

#### Validation Errors

```json
{
  "error": {
    "data": "Name is required"
  }
}
```

#### Resource Not Found

```json
{
  "message": "No record found."
}
```

---

## API Testing

### Using Postman Collection

1. Import the `postman.json` file into Postman
2. Set environment variables:
   - `base_url`: http://localhost:3100
   - `auth_token`: Will be set automatically after login
3. Start with authentication endpoints for each user type
4. The collection includes automatic token management

### Testing Flow

1. **SuperAdmin**: Login → Create Store/Admin
2. **Admin**: Login → Add Categories → Add Products → Manage Orders
3. **Customer**: Signup → Verify → Login → Browse Products → Add to Cart → Place Order
4. **Driver**: Login → View Orders → Update Location → Complete Delivery

### Environment Setup

```bash
# Clone repository
git clone <repository-url>

# Install dependencies  
npm install

# Set environment variables
cp .env.example .env

# Start development server
npm run start
```

### Database Seeding

Create initial data:

```javascript
// Create SuperAdmin user
{
  "email": "superadmin@freegi.com",
  "password": "SuperAdmin@123",
  "role": "SuperAdmin"
}
```

---

## API Rate Limits

- **General APIs**: 100 requests per minute per IP
- **Authentication APIs**: 10 requests per minute per IP  
- **File Upload**: 20 requests per minute per user

## Security Features

- JWT token encryption
- Password hashing with bcrypt
- Input validation with Joi
- CORS protection
- Helmet security headers
- File upload restrictions

## Performance Considerations

- MongoDB indexes on frequently queried fields
- Pagination for large datasets
- Image optimization for file uploads
- Connection pooling for database
- Caching for static content

---

## Support & Contact

For API support and questions:

- **Documentation**: This comprehensive guide
- **Postman Collection**: Import for immediate testing
- **Error Logs**: Check application logs for debugging
- **Database**: MongoDB with proper indexing

---

*This documentation covers all available endpoints in the Freegi backend system. Each endpoint includes authentication requirements, request/response examples, and detailed parameter descriptions for complete API integration.* 