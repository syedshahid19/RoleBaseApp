# Lead Management System (LMS)

## Project Overview

This **Lead Management System** is a role-based web application that helps capture and manage leads from third-party websites. It features three dashboards for Admin, Vendor, and User roles, each with specific functionalities for handling leads. The project includes authentication, authorization, lead assignment, commission tracking, bulk lead uploads, and status updates.

### Key Features:

- **Admin Dashboard:**
  1. View all leads and vendors.
  2. Assign vendors to leads and update lead status.
  3. Set and view commission settings based on lead conversion count and service type.
  4. Bulk upload of leads via CSV file format.
  5. When clicking on form data in the third-party web, it should display in the admin dashboard, and all submissions should be shown. Duplication of leads is also handled.

- **Vendor Dashboard:**
  1. Set location and service type after logging in.
  2. View leads assigned by the admin and update lead status.
  3. Track commission based on the number of lead conversions.

- **User Dashboard:**
  1. Create new leads that are visible in the admin dashboard.

### Technologies Used:

- **Backend**: Node.js with Express
- **Frontend**: React with Tailwind CSS for styling
- **Database**: MongoDB
- **Authentication and Authorization**: JSON Web Tokens (JWT)
- **Form Validation**: Custom validation for inputs
- **Pagination**: Implemented for better data navigation
- **Error Handling**: Proper error handling throughout the application
- **Security**: Security measures has been implemented

---

## Installation and Setup Guide

Follow these steps to run the Lead Management System on your local machine:

### Prerequisites:

- Node.js (latest version)
- MongoDB (either installed locally or use a cloud service like MongoDB Atlas)

### Steps to Run the Project Locally:

#### 1. Clone the Repository:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

#### 2. Set Up Backend (Node.js + Express):

1. Navigate to the backend folder:
   ```bash
   cd server
   ```

2. Install required packages:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the backend directory and add the following configuration:

   ```bash
   PORT=5000
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

#### 3. Set Up Frontend (React + Tailwind CSS):

1. Navigate to the frontend folder:
   ```bash
   cd clinet
   ```

2. Install required packages:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the frontend directory and add the following configuration:

   ```bash
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the frontend application:
   ```bash
   npm start
   ```

#### 4. Open in Browser:

Once both servers (backend and frontend) are running, open the application in your browser at:

```
http://localhost:3000
```

## Conclusion

This project is a robust and scalable **Lead Management System** designed to handle lead capturing and management from third-party websites. It includes role-based access, commission tracking, bulk uploads, and more. The system is highly customizable, with error handling, pagination, form validation, and security measures to ensure smooth operation.
