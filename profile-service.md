# Profile Service

The **Profile Service** is the user profile management microservice for the Chat App.  
It handles user profile CRUD operations, user search functionality, and profile data persistence with secure data handling.

---

## Repository

**View Source Code:** [https://github.com/sravankotcherla/chatApp-user-service](https://github.com/sravankotcherla/chatApp-user-service)

---

## Architecture Role

- **Central Profile Management Hub** for all microservices
- **Provides user profile endpoints** for other services
- **Manages user profile data** and search functionality
- **Integrates with Gateway Service** for profile operations
- **Stores user profile information securely** in PostgreSQL

---

## API Endpoints and Profile Management Flow

### `GET /profile/` - Health Check

- Simple endpoint to verify service is running
- Returns confirmation message

### `POST /profile/user/` - User Profile Creation

- Creates new user profile with provided data
- Validates unique username/email constraints
- Stores profile information in PostgreSQL
- Returns created user profile data

### `GET /profile/user/{userId}` - Get User Profile

- Retrieves user profile by unique user ID
- Returns complete user profile information
- Used by other services for user lookup

### `POST /profile/user/list` - Batch User Retrieval

- Accepts list of user IDs
- Returns multiple user profiles in single request
- Optimized for bulk profile operations

### `GET /profile/user/search/` - User Search

- Searches users by text query
- Supports username and email search
- Returns matching user profiles

### `GET /profile/user/session` - Session User Profile

- Retrieves profile of currently authenticated user
- Uses `X-Authenticated-User` header for identification
- Returns current user's profile information

### `PUT /profile/user/` - Update User Profile

- Updates existing user profile information
- Requires authentication via `X-Authenticated-User` header
- Supports partial profile updates
- Automatically updates timestamp fields

---

## Tech Stack

- **Java 21** with **Spring Boot 3.4.3**
- **Spring Data JPA** for database operations
- **PostgreSQL** for user profile persistence
- **Lombok** for code generation and boilerplate reduction
- **Netflix Eureka Client** for service discovery
- **Spring Web** for REST API endpoints
- **Hibernate** as JPA implementation
- **Docker** for containerization

---

## Database Schema

The service uses a `users` table with the following structure:

| Field          | Type        | Description                              |
| -------------- | ----------- | ---------------------------------------- |
| `userId`       | `VARCHAR`   | **Primary Key** - Unique user identifier |
| `username`     | `VARCHAR`   | **Unique** username for the user         |
| `email`        | `VARCHAR`   | **Unique** email address                 |
| `passwordHash` | `VARCHAR`   | Securely hashed password                 |
| `profilePic`   | `VARCHAR`   | Profile picture URL or path              |
| `createdAt`    | `TIMESTAMP` | Account creation timestamp               |
| `updatedAt`    | `TIMESTAMP` | Last profile update timestamp            |
| `status`       | `VARCHAR`   | User account status                      |

---

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
