# 🚚 Tool Tracking System Backend

This is the backend server for the **Tool Tracking System**, built with **NestJS** and **MySQL**, designed to help Pepinieres track their tools using **RFID** technology, IoT devices, and a web dashboard.

The backend handles:

- Missions management
- Tools assignment to vehicles
- Employee and customer management
- Real-time alerts for missing tools
- SMS notifications via Twilio
- Secure authentication and authorization
- Email services for password resets

> 🌐 API Documentation: [Swagger UI](https://tool-tracking-production.up.railway.app/api)

---

## 🛠 Tech Stack

- **Framework**: NestJS (Node.js, TypeScript)
- **Database**: MySQL
- **ORM**: TypeORM
- **Authentication**: JWT Tokens
- **Communication**: Twilio (SMS) & Nodemailer (Emails)
- **Hosting**: Railway.app
- **Swagger**: OpenAPI documentation

---

## 📁 Project Structure

```
src/
├── common/           # Shared services and modules (e.g., email service)
├── config/           # Configuration files (e.g., database config)
├── modules/          # Feature modules
│   ├── alerts/       # Handle tool missing alerts
│   ├── authentication/ # Login, registration, password reset
│   ├── customer/     # Customer data management
│   ├── email/        # Email sending functionalities
│   ├── employee/     # Employee CRUD operations
│   ├── geocoding/    # Address to coordinates service
│   ├── missions/     # Missions CRUD and tool assignment
│   ├── sms/          # SMS notification service
│   ├── tools/        # Tool creation and RFID tag linking
│   └── vehicles/     # Vehicle management
├── app.controller.ts # Application root controller
├── app.module.ts     # Application root module
├── app.service.ts    # Application root service
├── main.ts           # Application bootstrap
├── polyfills.ts      # (Optional) Polyfills if needed
```

---

## ⚙️ Environment Variables

Create a `.env` file at the project root with the following variables:

---

# 🔧 Server Environment Configuration

1.  PORT=3001

### 📲 Twilio SMS Config

To enable SMS notifications, you must create a [Twilio](https://www.twilio.com/) account and generate the following credentials:

2. TWILIO_ACCOUNT_SID=
3. TWILIO_AUTH_TOKEN=
4. TWILIO_PHONE_NUMBER=
5. ALERT_PHONE_NUMBER=

- **TWILIO_ACCOUNT_SID**: Your Twilio Account SID
- **TWILIO_AUTH_TOKEN**: Your Twilio Auth Token
- **TWILIO_PHONE_NUMBER**: Your registered Twilio phone number (sender)
- **ALERT_PHONE_NUMBER**: The recipient phone number for critical alerts

> 💡 **Note:**
> Make sure the Twilio phone number is **SMS-enabled**!

### 🔐 JWT Config

JWT credentials used for authentication and authorization:

6. JWT_SECRET=
7. JWT_EXPIRES_IN=

### Email Config

8. EMAIL_USER=
9. EMAIL_PASS=

- **EMAIL_USER**: Your email address used to send messages
- **EMAIL_PASS**: Your email password or app-specific password

10. FRONTEND_RESET_PASSWORD_URL=https://yourfrontend.com/reset-password

### 🛢️Database Config

11. DB_HOST=
12. DB_PORT=
13. DB_NAME=
14. DB_USERNAME=
15. DB_PASSWORD=

- **DB_HOST**: Hostname of your MySQL server
- **DB_PORT**: Port number for the MySQL server (default: 3306)
- **DB_NAME**: Name of your database
- **DB_USERNAME**: MySQL user
- **DB_PASSWORD**: MySQL password

---

## 🚀 Getting Started (Development)

1. Clone the repository

   ```bash
   git clone https://github.com/Godfred-Owusu/tool-tracking.git
   cd tool-tracking
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Setup your `.env` file

4. Run the application locally

   ```bash
   npm run start:dev
   ```

5. Access Swagger API Docs
   ```
   http://localhost:{PORT}/api
   ```

---

## 🔥 Main Features

- **Missions API**:

  - Create missions and assign them to employees, vehicles, and locations.
  - Update missions with RFID tool tag IDs after vehicle loading.

- **Tools API**:

  - Create tools and link them with unique RFID tags.

- **Alerts API**:

  - Receive alerts when scanned RFID tools after a mission differ from initial load.
  - Automatically send SMS notifications.

- **Authentication API**:

  - Admin registration
  - Login for employees and admins
  - Password reset via email

- **Employee & Vehicle Management**:

  - Admin can create, update, delete employees and vehicles.

- **Customer Management**:
  - Handle customer details associated with missions.

---

## 📡 Important API Endpoints Overview

| Method | Endpoint                       | Description                            |
| ------ | ------------------------------ | -------------------------------------- |
| POST   | `/auth/register-admin`         | Register a new admin                   |
| POST   | `/auth/login`                  | Login as admin or employee             |
| POST   | `/auth/create`                 | Admin creates employee (email is sent) |
| POST   | `/tools`                       | Add a tool and assign RFID tag         |
| POST   | `/missions`                    | Create a mission                       |
| PATCH  | `/missions/:id`                | Update mission with assigned tool tags |
| GET    | `/missions/vehicle/:vehicleId` | Get mission by vehicle ID              |
| POST   | `/alert`                       | Send alert when tools mismatch         |
| POST   | `/vehicles`                    | Register a vehicle                     |

📚 Full API documentation with schemas available at Swagger UI

---

## 🛡️ Security Features

- JWT-based secure login
- Password hashing (bcrypt)
- Role-based authorization
- Encrypted environment variables
- Input validation using DTOs

---

## 🖼️ Frontend Integration

- **Login Page**: Calls `/auth/login`
- **Dashboard**: Displays missions, tools, and alerts.
- **Tool Management Page**: Interacts with `/tools`
- **Mission Management Page**: CRUD operations with `/missions`
- **Real-Time Alerts**: Alerts display for missing tools
- **Email-based Password Reset**: Integrated with `/auth/reset-password` (frontend URL provided in `.env`)

---

## 👨‍💻 Developers

| Name   | Role                              |
| ------ | --------------------------------- |
| You    | Backend Developer (NestJS, MySQL) |
| Others | (Frontend, IoT Development)       |

---

## ✨ Future Improvements

- WebSocket integration for real-time alerts
- RFID scan history tracking
- Full audit logs
- Role management for employees
- Push notifications (PWA)

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

🛠️ Made with NestJS and ❤️

---

## 📞 Need Help?

If you have any issues setting up the environment, feel free to **contact me** at:
📧 **godfred-mireku.owusu@student.junia.com**
