# 🎟️ Event Booking System

A full-stack web application for users to browse, book, and manage event tickets, with a powerful admin dashboard for managing events and tracking insights.

---

## 📌 Project Overview

This project is a modern, scalable Event Booking System built using:

- **Backend**: .NET 8 with Clean Architecture (Domain-Driven Design)
- **Frontend**: Angular 18
- **Authentication**: JWT, Google Sign-In, Email Confirmation, Password Reset
- **Admin Panel**: Analytics, Event Management (CRUD), User Stats
- **User Panel**: Event search, filtering, booking
- **Extra Features**: CQRS, MediatR, AutoMapper, Serilog, FluentValidation, xUnit Testing

---

## 📁 Folder Structure

### 🔧 Backend (.NET API)

```text
back-end/EventEventBooking/
├── API/             # ASP.NET Core Web API Layer (controllers, middlewares)
├── Application/     # Application Layer (CQRS handlers, DTOs, interfaces)
├── Domain/          # Domain Layer (Entities, Enums, Interfaces, Exceptions)
├── Infrastructure/  # Infrastructure Layer (DB context, Repositories, Identity)
├── Tests/           # Unit tests with xUnit & FluentAssertions
```

### 🎨 Frontend (Angular)
```text
front-end/
├── src/
│ ├── app/
│ │ ├── Services/ # Auth services, interceptors, guards
│ │ ├── shared/ # Shared UI components
│ │ ├── user/ # Event listing, booking, filters
│ │ ├── admin/ # Dashboard, charts, event CRUD
│ │ └── pages/ # Auth pages, home, events, booking success
```

---

## 🚀 Features

### 🔐 Authentication & Authorization

- JWT Authentication with Role-based Authorization (Admin/User)
- Google Sign-In
- Email confirmation during registration
- Password reset via email

### 🧑‍💻 Admin Panel

- Add, update, delete events
- View total number of users, events, and revenue
- Data visualization with Chart.js
- Responsive dashboard with role-based access

### 👥 User Functionality

- Event listing with filtering (price, ticket availability)
- Search events by name or description
- Book tickets (only once per event)
- "Booked" status replaces "Book Now" on booked events
- Redirect to a success page after booking

---

## 🛠️ Tech Stack

### Backend

- ASP.NET Core 8
- Clean Architecture + DDD
- Entity Framework Core
- FluentValidation
- CQRS with MediatR
- AutoMapper
- Serilog (Logging)
- xUnit + FluentAssertions (Unit Testing)
- Identity + JWT + Google OAuth

### Frontend

- Angular 18
- Angular Material UI
- Chart.js
- RxJS
- ngx-toastr
- Angular Forms & Reactive Forms

---

## 🧪 Testing

- ✅ Unit Testing with **xUnit**
- ✅ Assertions using **FluentAssertions**
- ✅ Separated test project under `/Tests`

---

## 🔧 Setup Instructions

### 🔙 Backend

1. **Clone the repository**:
   ```bash
   git clone git@github.com:mostafasharaby/Event-Booking-System.git
   cd back-end
   cd EventBooking
2.  ## 🔐 Configuration
      Before running the project, create a file named `appsettings.json` in the root of the backend project.  
      You can use `appsettings.example.json` as a template.
      ```bash
      cp appsettings.example.json appsettings.json
      ```
3.  Apply migrations
4.  ```bash
     dotnet ef database update
    ```
5. Run the API
   ```bash
    dotnet run
    ```
6.  ✅ The API will run at: https://localhost:7146

### 🔜 Frontend (Angular)

1. **Navigate to the frontend directory**
    ```bash
    cd front-end
    ```
2. **Install dependencies**
   ```bash
    npm install
    ```
3. **Run Angular Development Server**
  ```bash
  ng serve
  ```
4. ✅ The app will be available at: http://localhost:4200

**🔐 Admin Credentials (for demo)**
   Default admin credentials (after seeding or manual DB insert):
   
   Email: admin@example.com
   Password: P@ssw0rd! 

**🔐 User Credentials (for demo)**
   Default user credentials (after seeding or manual DB insert):

   Email: noor@example.com
   Password: P@ssw0rd! 


![Image](https://github.com/user-attachments/assets/091b66c4-d13e-4c40-98f8-dc8b9808cdeb)
![Image](https://github.com/user-attachments/assets/2a9fa493-377a-45b9-af23-e172219acd7c)
![Image](https://github.com/user-attachments/assets/0e376594-2fa7-43b5-9591-64f27106c642)
![Image](https://github.com/user-attachments/assets/96ba47dc-53d2-4326-a3e5-be2c14210823)
![Image](https://github.com/user-attachments/assets/9ead6136-3710-4a19-b5ca-9b729a58778c)
![Image](https://github.com/user-attachments/assets/d5f6e666-ea40-4c76-9e72-81ca114fedb1)
![Image](https://github.com/user-attachments/assets/3a542c72-6cf6-4690-a58e-5901ad624137)
![Image](https://github.com/user-attachments/assets/f0f8c534-14f7-4752-b93b-8becf6ef2e35)
![Image](https://github.com/user-attachments/assets/39eb6a40-1c64-4617-928f-a8f380615dea)
![Image](https://github.com/user-attachments/assets/23df30be-b8fb-4007-b603-617d574552e3)
![Image](https://github.com/user-attachments/assets/cdc9982a-2fe5-4aba-aafa-febfc55bb375)

