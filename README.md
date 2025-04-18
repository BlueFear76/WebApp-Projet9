# 🛡️ Authentication Flow

This backend uses **Role-Based Authentication** with **JWT Tokens** to protect all routes.

Admins can create employees.  
Employees can only log in and perform restricted actions.

---

## 1. 🚀 Admin Signup (Create the First Admin)

**POST** `/auth/admin-signup`

Example Request:

```json
{
  "firstname": "Godfred",
  "lastname": "Mensah",
  "email": "admin@example.com",
  "password": "AdminPassword123"
}
```

✅ This registers a new Admin.  
✅ Admins can create employees after login.

---

## 2. 🚀 Admin or Employee Login

**POST** `/auth/login`

Example Request:

```json
{
  "email": "admin@example.com",
  "password": "AdminPassword123"
}
```

Example Successful Response:

```json
{
  "id": 1,
  "firstname": "Godfred",
  "lastname": "Mensah",
  "email": "admin@example.com",
  "role": "ADMIN"
}
```

✅ Frontend should store this information.  
✅ (You can also switch back to JWT token login later if needed.)

---

## 3. 🚀 Create Employee (Admin Only)

**POST** `/employees`

Example Request:

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com"
}
```

✅ A random password is generated automatically.  
✅ The employee receives an **email** containing:

- Login email
- Generated password
- Link to reset password

---

## 4. 🚀 Employee Login

**POST** `/auth/login`

Example:

```json
{
  "email": "john.doe@example.com",
  "password": "randomgeneratedpassword"
}
```

✅ After login, employees can access allowed resources based on their role.

---

## 5. 🚀 Reset Password (Public)

**POST** `/auth/reset-password`

Example Request:

```json
{
  "email": "john.doe@example.com",
  "newPassword": "NewSecurePassword123"
}
```

✅ This endpoint allows users to update their password securely.

---

# 🛡️ Authorization Flow

| Step | What Happens                                        |
| ---- | --------------------------------------------------- |
| 1    | Admin signs up and logs in                          |
| 2    | Admin creates employee accounts                     |
| 3    | Employees log in using email and generated password |
| 4    | Employees can reset their password                  |
| 5    | Access control based on roles (Admin / Employee)    |

✅ **Admin** can create employees and missions.  
✅ **Employee** can only perform restricted actions.

---

# 📋 Authentication Example Summary

| Action                 | Route                       | Example JSON                                                       |
| ---------------------- | --------------------------- | ------------------------------------------------------------------ |
| Admin Signup           | `POST /auth/admin-signup`   | `{ "firstname": "", "lastname": "", "email": "", "password": "" }` |
| Login (Admin/Employee) | `POST /auth/login`          | `{ "email": "", "password": "" }`                                  |
| Create Employee        | `POST /employees`           | `{ "firstname": "", "lastname": "", "email": "" }`                 |
| Reset Password         | `POST /auth/reset-password` | `{ "email": "", "newPassword": "" }`                               |

✅ Use these JSON templates to test directly in Swagger UI.

---

# ✍️ Notes to Edit:

- ✏️ Change example emails and passwords as needed for your project.
- ✏️ Add custom fields if you add more roles (e.g., Supervisor, Manager).
- ✏️ Switch back to JWT token login if needed by updating the login response.

# 🛠️ Tool Tracking Flow

This system tracks tools inside vehicles, detects missing tools after missions, and sends real-time SMS alerts.

---

## 1. 🚀 Create Tools (Assign Each Tool an RFID Tag)

**POST** `/tools`

Example Request:

```json
{
  "name": "Chainsaw",
  "description": "Heavy duty cutting chainsaw",
  "rfidTagId": "E2000017221101441890B31B"
}
```

✅ Each tool must have a **unique RFID tag**.

---

## 2. 🚀 Create a Mission

**POST** `/missions`

Example Request:

```json
{
  "name": "Delivery to Construction Site A",
  "description": "Deliver essential tools to Site A.",
  "address": "10 Rue de Paris, 75000 Paris, France",
  "startDate": "2025-04-07T08:00:00.000Z",
  "endDate": "2025-04-07T18:00:00.000Z"
}
```

✅ The system automatically geocodes the address into **latitude** and **longitude**.

---

## 3. 🚀 Create a Vehicle (Truck/Device)

**POST** `/vehicles`

Example Request:

```json
{
  "vehicleId": "Truck-001"
}
```

✅ Each truck must have a **unique `vehicleId`**.

---

## 4. 🚀 Assign a Mission to a Truck

**POST** `/vehicles/assign-mission`

Example Request:

```json
{
  "vehicleId": "Truck-001",
  "missionId": 1
}
```

✅ Truck is now linked to Mission 1.

---

## 5. 🚀 IoT Device Fetches Its Active Mission

**GET** `/vehicles/{vehicleId}/active-mission`

Example Request:

```
GET /vehicles/Truck-001/active-mission
```

✅ The truck (IoT device) fetches its current active mission details.

---

## 6. 🚀 Truck Sends First Scan When Leaving the Office

**POST** `/readings`

Example Request:

```json
{
  "vehicleId": "Truck-001",
  "toolTagIds": ["E2000017221101441890B31B", "E2000017221101441890B31C"],
  "latitude": 48.8566,
  "longitude": 2.3522,
  "missionId": 1
}
```

✅ First scan **assigns tool names** to the mission automatically.

---

## 7. 🚀 Truck Sends Second Scan After Leaving Mission Area

**POST** `/readings`

Example Request:

```json
{
  "vehicleId": "Truck-001",
  "toolTagIds": ["E2000017221101441890B31B"],
  "latitude": 48.857,
  "longitude": 2.353,
  "missionId": 1
}
```

✅ Backend **detects missing tools** automatically by comparing the two scans.

---

## 8. 🚀 Missing Tool Alert is Created Automatically

**Database Alert Example:**

```json
{
  "toolTagId": "E2000017221101441890B31C",
  "toolName": "Leaf Blower",
  "vehicleId": "Truck-001",
  "message": "Tool 'Leaf Blower' is missing after mission.",
  "detectedAt": "2025-04-07T18:10:00.000Z",
  "missionId": 1
}
```

✅ An alert record is created for every missing tool.

---

## 9. 🚀 SMS Notification is Sent

**Example SMS:**

```
🚨 Tool "Leaf Blower" is missing after mission. Last seen at Paris, France.
```

✅ Real-time SMS is sent to the configured alert phone number.

---

# 📋 Full Tool Tracking Example Summary

| Step                    | Action                          | Example JSON                                                                               |
| ----------------------- | ------------------------------- | ------------------------------------------------------------------------------------------ |
| Create Tool             | `POST /tools`                   | `{ "name": "", "description": "", "rfidTagId": "" }`                                       |
| Create Mission          | `POST /missions`                | `{ "name": "", "description": "", "address": "", "startDate": "", "endDate": "" }`         |
| Create Vehicle          | `POST /vehicles`                | `{ "vehicleId": "" }`                                                                      |
| Assign Mission to Truck | `POST /vehicles/assign-mission` | `{ "vehicleId": "", "missionId": 1 }`                                                      |
| First Scan              | `POST /readings`                | `{ "vehicleId": "", "toolTagIds": [], "latitude": 0.0, "longitude": 0.0, "missionId": 1 }` |
| Second Scan             | `POST /readings`                | Same format as First Scan                                                                  |

---

# 🛠️ For Frontend Developers

- Use **Bearer Token Authentication** after login.
- Explore all API endpoints easily using **Swagger** (`http://localhost:3000/api`).
- Display Missions, Tools, Alerts, Employees.
- Show real-time updates after mission scans.

---

# 🛠️ For IoT Developers

| Step                 | Endpoint                               | Method |
| -------------------- | -------------------------------------- | ------ |
| Fetch Active Mission | `/vehicles/{vehicleId}/active-mission` | GET    |
| Send Scan Data       | `/readings`                            | POST   |

✅ Always include:

- `vehicleId`
- `toolTagIds`
- `latitude`
- `longitude`
- `missionId`

---

# 🧠 System Workflow Diagram

```
Create Tools → Create Missions → Create Vehicles → Assign Missions
       ↓
Truck Fetches Mission → Sends First Scan → Sends Second Scan
       ↓
Backend Detects Missing Tools → Creates Alerts → Sends SMS
```

---

# 📜 Environment Variables Required

Create a `.env` file with:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_RESET_PASSWORD_URL=https://your-frontend-app.com/reset-password
JWT_SECRET=your-secret
JWT_EXPIRES_IN=3600s
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
ALERT_PHONE_NUMBER=your-personal-phone-number
```

✅ These are needed for Email, JWT Authentication, and SMS alerts.

# 📜 Swagger API Documentation

This backend project provides a full **Swagger UI** for easy API testing and exploration.

---

## 🚀 Access Swagger UI

After running the server:

```
http://localhost:3000/api
```

✅ You will see the full documentation of all available endpoints.

---

## 🔒 Authenticate in Swagger

Since most endpoints are **protected**, you need to authenticate first.

1. **Login** using `POST /auth/login`
2. **Copy** the returned token (if using JWT) or simply note your login details (if only email/password flow)
3. **Click** the **Authorize** button at the top right of Swagger
4. **Paste your Bearer Token** (if token is used) like this:

```
Bearer your_token_here
```

✅ Now you can access protected routes like creating missions, tools, employees, etc.

---

## 🧩 Public Routes (No Token Needed)

| Method | URL                    | Description                |
| ------ | ---------------------- | -------------------------- |
| POST   | `/auth/admin-signup`   | Create an Admin account    |
| POST   | `/auth/login`          | Login as Admin or Employee |
| POST   | `/auth/reset-password` | Reset user password        |

---

## 🛡️ Protected Routes (Require Authorization)

| Method | URL                                    | Description                        |
| ------ | -------------------------------------- | ---------------------------------- |
| POST   | `/employees`                           | Create a new Employee (Admin Only) |
| POST   | `/missions`                            | Create a new Mission               |
| POST   | `/tools`                               | Create a new Tool                  |
| GET    | `/vehicles/{vehicleId}/active-mission` | Fetch active mission for vehicle   |
| POST   | `/readings`                            | Send tool scan readings            |
| GET    | `/alerts`                              | View all alerts (Admin Only)       |

---

# 📋 Testing APIs in Swagger

| Step | Action                                             |
| ---- | -------------------------------------------------- |
| 1    | Open Swagger UI at `http://localhost:3000/api`     |
| 2    | Authenticate if necessary using **Authorize**      |
| 3    | Try different endpoints (POST, GET, PATCH, DELETE) |
| 4    | View request and response examples provided        |
| 5    | Debug and test your integration easily             |

✅ Swagger makes it easy for developers and testers to understand the API.

---

# ✍️ Notes

- ✏️ If your login flow **doesn't return a token** (email/password only), **you don't need to use Authorize** in Swagger.
- ✏️ If you add new endpoints, **they will automatically appear** in Swagger because of decorators like `@ApiTags`, `@ApiBearerAuth`, etc.
- ✏️ If you update roles and permissions, **update Swagger notes** to reflect access levels.

---

# 🎯 Quick Tips

- Use Swagger to quickly test employee creation, tool assignment, mission setup, and tool tracking.
- Use the built-in Try It Out feature to send requests directly from Swagger.
- Always check response samples to ensure correct request formats.

---

# 🏁 Ready to Explore the API!

✅ Swagger helps frontend developers, testers, and IoT developers understand and interact with the backend easily.

✅ It is automatically kept updated with the backend code.

# 🏷️ Project Badges

Show some love to your project with these badges!

---

![NestJS](https://img.shields.io/badge/Powered%20by-NestJS-E0234E?logo=nestjs)
![TypeORM](https://img.shields.io/badge/Database-TypeORM-blue)
![SQLite](https://img.shields.io/badge/DB-SQLite-003B57?logo=sqlite)
![Swagger](https://img.shields.io/badge/Docs-Swagger-85EA2D?logo=swagger)
![Authentication](https://img.shields.io/badge/Auth-JWT-green)
![Made With Love](https://img.shields.io/badge/Made%20with-%E2%9D%A4-red)

---

# 🎯 What These Badges Mean

| Badge              | Meaning                              |
| ------------------ | ------------------------------------ |
| **NestJS**         | Project built using NestJS Framework |
| **TypeORM**        | TypeORM used for database operations |
| **SQLite**         | SQLite database                      |
| **Swagger**        | API Documentation using Swagger UI   |
| **Auth JWT**       | JWT-based Authentication system      |
| **Made with Love** | You built this project with ❤️       |

---

# ✍️ How to Customize

- ✏️ You can add more badges depending on other technologies you are using.
- ✏️ You can create your own badges at [shields.io](https://shields.io/).

Example:

```
https://img.shields.io/badge/Name-Label-Color
```

---

# 🎉 Final Look Example

At the very top of your README, it will look like:

![NestJS](https://img.shields.io/badge/Powered%20by-NestJS-E0234E?logo=nestjs)
![TypeORM](https://img.shields.io/badge/Database-TypeORM-blue)
![SQLite](https://img.shields.io/badge/DB-SQLite-003B57?logo=sqlite)
![Swagger](https://img.shields.io/badge/Docs-Swagger-85EA2D?logo=swagger)
![Authentication](https://img.shields.io/badge/Auth-JWT-green)
![Made With Love](https://img.shields.io/badge/Made%20with-%E2%9D%A4-red)

---

# 🛠️ Pro Tip

Adding badges to your README:

✅ Makes it look more professional  
✅ Helps people quickly understand your tech stack  
✅ Gives your project a more polished look
