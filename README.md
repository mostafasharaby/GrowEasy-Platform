# 🌱 GrowEasy Platform

A full-stack web application designed to streamline company registration, verification, and authentication for managing programming companies, featuring a clean and intuitive user experience.

---

## 📌 Project Overview

GrowEasy Platform is a modern, scalable platform for anonymous users to register as companies, verify their accounts via OTP, set secure passwords, and access a personalized company dashboard. The project is built with clean code principles and a four-layer architecture, ensuring maintainability and scalability.

- **Backend**: .NET Core 8 with Clean Architecture
- **Frontend**: Angular 18
- **Database**: SQL
- **Authentication**: ASP.NET Identity, JWT, OTP-based email verification
- **Features**: Company registration, OTP validation, password management, and a minimalistic company dashboard

---

## 📁 Folder Structure

### 🔧 Backend (.NET API)

```text
back-end/GrowEasy/
├── Domain/          # Entity models, DbContext, migrations
├── Infrastructure/  # Repositories, file handling, email services
├── Application/     # Services, CQRS commands/queries, DTOs, AutoMapper
├── API/             # Controllers, middleware, API endpoints
```

### 🎨 Frontend (Angular)

```text
front-end/
├── src/
│ ├── app/
│ │ ├── components/    # UI components (signup, OTP validator, set password, login, home)
│ │ ├── services/      # Auth and file upload services
│ │ ├── models/        # TypeScript interfaces for data models
│ │ ├── shared/        # Shared modules, directives, pipes
│ │ └── app-routing.module.ts  # Application routing
```

---

## 🚀 Features

### 🔐 Company Registration & Authentication

- Register as a company with required fields: Arabic Name, English Name, Email
- Optional fields: Phone Number, Website URL, Company Logo
- Logo preview before submission
- OTP sent to company email for verification
- Password setting with validation (minimum 7 characters, one capital letter, one number, one special character)
- JWT-based login with company email and password
- Home page displaying company logo and greeting ("Hello {Company Name}")
- Logout functionality

### 🧑‍💻 User Flow

- **Sign Up**: Users provide company details, upload a logo, and receive an OTP via email.
- **OTP Verification**: Validate OTP on a dedicated page (OTP displayed in tooltip for testing).
- **Set Password**: Set a secure password matching validation criteria.
- **Login**: Log in with email and password to access the company dashboard.
- **Home Page**: View company logo, name, and logout option.

---

## 🛠️ Tech Stack

### Backend

- ASP.NET Core 8
- Clean Architecture (Data, Repository, Services, API)
- Entity Framework Core (PostgreSQL)
- ASP.NET Identity for authentication
- JWT for secure token-based authentication
- AutoMapper for object mapping
- FluentValidation for input validation
- MediatR for CQRS pattern
- File upload handling for company logos
- Email service integration for OTP delivery

### Frontend

- Angular 18
- Angular Material for UI components
- Reactive Forms for form validation
- RxJS for asynchronous operations
- FileReader for logo preview
- HTTPClient for API communication

---

## 🧪 Testing

- Backend: Unit tests can be implemented using xUnit (not included in this sample but recommended).
- Frontend: Angular component tests using Jasmine/Karma (extendable for form validation and API calls).

---

## 🔧 Setup Instructions

### 🔙 Backend

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd back-end/GrowEasy
   ```

2. **Configure appsettings.json**:
   Create `appsettings.json` based on `appsettings.example.json`:
   ```bash
   cp appsettings.example.json appsettings.json
   ```
   Update with your PostgreSQL connection string:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=GrowEasyDb;Username=postgres;Password=your_password"
     }
   }
   ```

3. **Apply database migrations**:
   ```bash
   dotnet ef database update
   ```

4. **Run the API**:
   ```bash
   dotnet run
   ```
   The API will be available at `https://localhost:5253`.

### 🔜 Frontend (Angular)

1. **Navigate to the frontend directory**:
   ```bash
   cd front-end
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the Angular development server**:
   ```bash
   ng serve
   ```
   The app will be available at `http://localhost:4200`.

---

## 🔐 Configuration Notes

- **Email Service**: Configure the email service (e.g., SendGrid or SMTP) in `appsettings.json` for OTP delivery. For testing, OTPs can be logged or displayed in a tooltip.
- **File Uploads**: Logos are stored in `wwwroot/Uploads/company-logos`. Ensure the directory is writable.
- **Roles**: The "company" role is automatically seeded during startup.
- **Demo Credentials** (after registration):
   - Email: Use the company email provided during registration.
   - Password: Set during the "Set Password" step.

---

## 📽️ Demo Video

A video demonstration is recommended to showcase:
- Company registration with logo upload and preview
- OTP validation (with OTP displayed in a tooltip for testing)
- Password setting with validation
- Login with company email and password
- Home page displaying company logo and greeting
- Logout functionality

---

