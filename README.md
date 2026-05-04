# Solstice

Solstice is a modern, full-stack social platform designed to facilitate collaborative writing and content sharing. The platform is built with a focus on premium User Experience (UX), highly scalable database architecture, and strict type-safe communication between the frontend and backend.

## Project Goal

The primary goal of Solstice is to provide a frictionless environment for users to publish and co-author articles. 

To solve the common UX problem of "username exhaustion" (where users are forced to pick complex alphanumeric names because common names are taken), Solstice implements an industry-standard Two-Tier Identity System:
1. Display Name: Non-unique, fully customizable, and visually appealing (e.g., "John Doe").
2. Handle: A system-generated, globally unique anchor used for exact-match profile routing and @mentions (e.g., "@john_doe_a7f92").

## Tech Stack

**Frontend**
* React 18 with TypeScript
* HeroUI (Accessible, animated UI components)
* React Hook Form (Performant, unopinionated form validation)
* React Query / TanStack Query (Server state management and caching)
* Axios (API client with interceptors for JWT management)
* React Router (Client-side routing)

**Backend**
* Java & Spring Boot 3
* Spring Security (JWT-based Authentication)
* Spring Data JPA / Hibernate (ORM and Database management)
* Jakarta Bean Validation (Strict API boundary validation)

---

## Architecture & Best Practices

Solstice was built adhering to Enterprise-grade design patterns to ensure scalability and maintainability.

### 1. The "Skinny Component" Frontend Architecture
We strictly enforce the Separation of Concerns on the frontend. UI components are responsible only for rendering layouts and capturing user input. All complex network logic, server state, and error parsing are abstracted into Custom Hooks (e.g., useRegister, useLoginForm).

### 2. RFC 7807 Standardized API Errors
The Spring Boot backend utilizes a @RestControllerAdvice global exception handler to intercept validation failures and database constraints. It reformats these errors into the standardized ProblemDetail JSON structure. 

### 3. Full-Stack Validation Binding
Solstice features a seamless validation bridge. If a user inputs invalid data that makes it past frontend checks, the backend intercepts it, returns a cleanly mapped error object, and a custom frontend utility (applyServerErrors) instantly binds those backend errors directly to the exact HeroUI input fields in real-time.

### 4. Zero-Friction Registration
The registration flow is designed to never block a user with a "Username Taken" error. The backend utilizes a hybrid optimistic generation strategy: it attempts to assign a clean handle based on the user's Display Name. If a collision occurs, it instantly appends a clean, cryptographically random suffix, ensuring a 100% success rate on the first submission.

---

## Project Structure

### Frontend (/client)
    src/
    ├── api/                  # Axios instances and interceptors
    ├── components/           # Generic, reusable UI components
    ├── features/             # Feature-based modular code
    │   └── auth/             
    │       ├── hooks/        # useAuth, useRegister, useLoginForm
    │       └── components/   # Auth-specific UI pieces
    ├── pages/                # Page-level components (RegisterPage, LoginPage)
    ├── types/                # Global TypeScript interfaces
    └── utils/                # Helper functions (form-utils, token-service)

### Backend (/server)
    src/main/java/com/solstice/backend/
    ├── config/               # Security and CORS configurations
    ├── controller/           # REST endpoints (@RestController)
    ├── dto/                  # Data Transfer Objects with @Valid constraints
    ├── entity/               # JPA Entities mapped to database tables
    ├── exception/            # GlobalExceptionHandler and custom exceptions
    ├── repository/           # Spring Data JPA interfaces
    └── service/              # Core business logic and database interactions

---

## Getting Started

### Prerequisites
* Node.js 18+
* Java 17+
* PostgreSQL (or your configured database)

### Running the Frontend
1. Navigate to the /client directory.
2. Install dependencies: npm install
3. Start the development server: npm run dev

### Running the Backend
1. Navigate to the /server directory.
2. Configure your database credentials in application.properties or application.yml.
3. Run the application: ./mvnw spring-boot:run (Maven) or ./gradlew bootRun (Gradle).