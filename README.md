# LensLab Studio – Camera Rental Management System

## 1. Project Overview

LensLab Studio is a Camera Rental Management System developed using Node.js, Express.js and SQLite.

The system helps photographers manage camera rentals efficiently. It allows users to manage photographers, cameras and rental records through REST API endpoints.

The main objective is to prevent two photographers from booking the same camera for overlapping dates.

## 2. Group Details

| Detail | Information |
|---|---|
| Group Number | Group 5 |
| Group Code | YG-CSE2E-G05 |
| Project Name | LensLab Studio |
| Project Theme | Camera Rental Management System |

### Details

| Detail | Information |
| Section | CSE – 2E |
| Course | Backend Development Fundamentals |
| Year | II – Term II |
| Institution | Aurora – NIAT |

## 3. Understanding the Three Main Entities

The system contains three main entities:

### 3.1 Photographers

Stores the details of photographers who rent cameras.

Fields:
- id
- name
- email
- phone

### 3.2 Cameras

Stores information about cameras available for rental.

Fields:
- id
- name
- kind

### 3.3 Rentals

Connects photographers with cameras through rental records.

Fields:
- id
- photographer_id
- camera_id
- rental_date
- return_date

### Entity Relationship

- One photographer can have multiple rental records.
- One camera can have multiple rental records over different periods.
- Each rental belongs to one photographer and one camera.

## 4. Database Design

The project uses SQLite as its database.

Three related tables are created:

1. photographers
2. cameras
3. rentals

Foreign keys connect the rentals table with the photographers and cameras tables.

The database is created automatically when the application starts.

## 5. Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| SQLite | Database management |
| JavaScript | Application logic |
| Postman | API testing |
| Visual Studio Code | Development environment |
| Git and GitHub | Version control and project hosting |

## 6. Project Structure

```text
LensLab-Studio/
│
├── config/
│   └── database.js
│
├── routes/
│   ├── photographers.js
│   ├── cameras.js
│   └── rentals.js
│
├── screenshots/
│   ├── home.png
│   ├── health.png
│   ├── get-all-photographers.png
│   ├── get-photographer-by-id.png
│   ├── add-photographer.png
│   ├── update-photographer.png
│   ├── delete-photographer.png
│   ├── photographer-not-found.png
│   ├── get-all-cameras.png
│   ├── get-camera-by-id.png
│   ├── search-cameras.png
│   ├── camera-summary.png
│   ├── add-camera.png
│   ├── update-camera.png
│   ├── camera-not-found.png
│   ├── add-rental.png
│   ├── get-all-rentals.png
│   ├── get-rental-by-id.png
│   ├── rental-details-join.png
│   ├── double-booking-prevention.png
│   ├── rental-validation-error.png
│   └── rental-not-found.png
│
├── database.db
├── server.js
├── package.json
├── package-lock.json
├── README.md
└── LensLab-Studio.postman_collection.json
```

## 7. REST API Endpoints

### 7.1 Home and Health APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Display welcome message |
| GET | `/health` | Check server status |

### 7.2 Photographer APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/photographers` | Get all photographers |
| GET | `/photographers/:id` | Get photographer by ID |
| POST | `/photographers` | Add a new photographer |
| PUT | `/photographers/:id` | Update photographer details |
| DELETE | `/photographers/:id` | Delete photographer |

### 7.3 Camera APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/cameras` | Get all cameras |
| GET | `/cameras/:id` | Get camera by ID |
| GET | `/cameras?kind=Mirrorless` | Search cameras by kind |
| GET | `/cameras/summary` | Get camera count by kind |
| POST | `/cameras` | Add a new camera |
| PUT | `/cameras/:id` | Update camera details |
| DELETE | `/cameras/:id` | Delete camera |

### 7.4 Rental APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/rentals` | Get all rentals |
| GET | `/rentals/:id` | Get rental by ID |
| GET | `/rentals/details` | Get rental details with photographer and camera names |
| POST | `/rentals` | Create a new rental |
| DELETE | `/rentals/:id` | Delete a rental |

## 8. Special Features

### 8.1 Double Booking Prevention

The main special feature of LensLab Studio is preventing double booking of cameras.

When a photographer requests a camera for a particular date range, the system checks whether that camera is already booked during overlapping dates.

If an overlapping booking exists, the system rejects the new rental request.

The API returns:

HTTP Status: 409 Conflict

```json
{
  "message": "Camera is already booked for these dates"
}
```

This prevents the same camera from being assigned to two photographers for overlapping rental periods.

### 8.2 Camera Summary Using GROUP BY

The project includes a special endpoint:

`GET /cameras/summary`

It uses SQL GROUP BY to count the number of cameras available in each camera category.

Example SQL query:

```sql
SELECT kind, COUNT(*) AS count
FROM cameras
GROUP BY kind;
```

### 8.3 Rental Details Using JOIN

The endpoint:

`GET /rentals/details`

Uses SQL JOIN to retrieve rental information together with photographer names and camera names.

## 9. Validation and Error Handling

The application includes validation to ensure correct data is entered.

The following checks are implemented:

- Required photographer fields.
- Duplicate photographer email validation.
- Required camera fields.
- Required rental fields.
- Rental date format validation.
- Return date cannot be before rental date.
- Photographer existence validation.
- Camera existence validation.
- Overlapping rental date validation.
- Handling of records that do not exist.

Appropriate HTTP status codes are returned, including:

| Status Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

## 10. Testing with Postman

All implemented API endpoints were tested using Postman.

Important test scenarios include:

1. Checking the home route.
2. Checking server health.
3. Adding and retrieving photographers.
4. Updating and deleting photographers.
5. Adding and retrieving cameras.
6. Searching cameras by kind.
7. Retrieving camera summary.
8. Creating and retrieving rentals.
9. Retrieving rental details using JOIN.
10. Preventing overlapping camera bookings.
11. Testing missing required fields.
12. Testing records that do not exist.

## 11. Project Screenshots

All screenshots are stored in the `screenshots` folder.

### 11.1 Home and Health

![Home API](screenshots/home.png)

![Health API](screenshots/health.png)

### 11.2 Photographer APIs

**Get All Photographers**

![Get All Photographers](screenshots/get-all-photographers.png)

**Get Photographer by ID**

![Get Photographer by ID](screenshots/get-photographer-by-id.png)

**Add Photographer**

![Add Photographer](screenshots/add-photographer.png)

**Update Photographer**

![Update Photographer](screenshots/update-photographer.png)

**Delete Photographer**

![Delete Photographer](screenshots/delete-photographer.png)

**Photographer Not Found**

![Photographer Not Found](screenshots/photographer-not-found.png)

### 11.3 Camera APIs

**Get All Cameras**

![Get All Cameras](screenshots/get-all-cameras.png)

**Get Camera by ID**

![Get Camera by ID](screenshots/get-camera-by-id.png)

**Search Cameras by Kind**

![Search Cameras](screenshots/search-cameras.png)

**Camera Summary Using GROUP BY**

![Camera Summary](screenshots/camera-summary.png)

**Add Camera**

![Add Camera](screenshots/add-camera.png)

**Update Camera**

![Update Camera](screenshots/update-camera.png)

**Camera Not Found**

![Camera Not Found](screenshots/camera-not-found.png)

### 11.4 Rental APIs

**Add Rental**

![Add Rental](screenshots/add-rental.png)

**Get All Rentals**

![Get All Rentals](screenshots/get-all-rentals.png)

**Get Rental by ID**

![Get Rental by ID](screenshots/get-rental-by-id.png)

**Rental Details Using JOIN**

![Rental Details JOIN](screenshots/rental-details-join.png)

**Double Booking Prevention**

![Double Booking Prevention](screenshots/double-booking-prevention.png)

**Rental Validation Error**

![Rental Validation Error](screenshots/rental-validation-error.png)

**Rental Not Found**

![Rental Not Found](screenshots/rental-not-found.png)

## 12. How to Run the Project

### Step 1: Install Node.js

Install Node.js on your computer.

### Step 2: Open the Project

Open the LensLab-Studio folder in Visual Studio Code.

### Step 3: Install Dependencies

Open the terminal and execute:

```bash
npm install
```

### Step 4: Start the Server

Run:

```bash
npm run dev
```

### Step 5: Test Using Postman

Use the following base URL for local API testing:

```text
http://localhost:3000
```

Select the required HTTP method and endpoint in Postman and send requests to test the APIs.

## 13. Conclusion

LensLab Studio is a backend Camera Rental Management System developed using Node.js, Express.js and SQLite.

It provides photographer management, camera management and rental management through REST APIs.

The project demonstrates database relationships, CRUD operations, validation, search functionality, SQL JOIN, GROUP BY and double-booking prevention.

The system helps manage camera rentals more efficiently and avoids overlapping bookings for the same camera.