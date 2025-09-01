# Auth Service

The Auth Service is the authentication and authorization microservice for the Chat App.  
It handles user registration, login, JWT token management, and session management with Redis caching.

## Repository

**View Source Code:** [https://github.com/sravankotcherla/auth-service](https://github.com/sravankotcherla/auth-service)

## Features

- **User Registration & Authentication** with secure password hashing
- **JWT Token Management** (access & refresh tokens)
- **Session Management** with Redis caching for scalability
- **Cookie-based Authentication** for enhanced security
- **Service Discovery** with Netflix Eureka
- **PostgreSQL Database** for user data persistence
- **Token Validation endpoint** for other services

## Architecture Role

- **Central Authentication Hub** for all microservices
- Provides token validation endpoints for other services
- Manages user sessions and refresh token rotation
- Integrates with Gateway Service for request authentication
- Stores user credentials securely with BCrypt hashing

## API Endpoints and Authentication Flow

### `POST /auth/register` - User Registration

- User submits registration data
- Service validates unique username/email
- Password is hashed with BCrypt
- User account is created in PostgreSQL

### `POST /auth/v2/login` - User Login

- User submits credentials
- Service authenticates against database
- Access Token (15 minutes) and Refresh Token (7 days) are generated
- Tokens are set as HttpOnly cookies for security
- User session is cached in Redis and also stored in PostgreSQL

### `POST /auth/refresh` - Token Refresh

- When access token expires, client calls this endpoint
- Service validates refresh token from cookie
- New access and refresh tokens are generated
- Old refresh token is invalidated (token rotation)

### `GET /validateToken?token=<token>` - Token Validation

- Other services call this endpoint to validate JWT tokens
- Service validates JWT and returns user information
- Returns 401 if token is invalid/expired

### `GET /` - Health Check

- Simple endpoint to verify service is running

## Tech Stack

- **Java 21** with Spring Boot 3.4.3
- **Spring Security Crypto** for password hashing
- **JJWT** for JWT token generation and validation
- **PostgreSQL** for user data persistence
- **Redis** with Jedis for session caching
- **Netflix Eureka Client** for service discovery
- **Spring Data JPA** for database operations
- **Docker** for containerization
