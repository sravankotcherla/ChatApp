# 🚪 Gateway Service

The **Gateway Service** acts as the single entry point to the Chat App microservices.  
It handles **request routing, authentication, and load balancing** across services.

---

## 📁 Repository

🔗 **[View Source Code](https://github.com/your-username/chatApp-microservices/tree/main/api-gateway)**

---

## ✨ Features

- Routes external client requests to internal services
- Integrates with **Auth Service** to recreate access and refresh tokens
- Provides centralized **logging & monitoring**
- Supports **rate limiting** and **cross-cutting concerns** (security, headers, etc.)
- **Service Discovery** with Netflix Eureka
- **WebSocket Support** for real-time chat functionality

---

## 📐 Architecture Role

- Clients (mobile/web) connect **only through the Gateway**.
- After validating authentication, it forwards traffic to:
  - **Auth Service** → authentication & authorization (`/api/auth/**`)
  - **Chat Service** → message persistence (`/api/chat/**`)
  - **Socket Service** → real-time WebSocket events (`/ws/**`)
  - **Profile Service** → user profile management (`/api/profile/**`)

---

## ⚙️ Example Routing Config (Spring Cloud Gateway)

```properties
spring.cloud.gateway.routes[0].id=auth-service
spring.cloud.gateway.routes[0].uri=lb://AUTH-service
spring.cloud.gateway.routes[0].predicates[0]=Path=/api/auth/**
spring.cloud.gateway.routes[0].filters[0]=StripPrefix=1

spring.cloud.gateway.routes[1].id=profile-service
spring.cloud.gateway.routes[1].uri=lb://profile-service
spring.cloud.gateway.routes[1].predicates[0]=Path=/api/profile/**
spring.cloud.gateway.routes[1].filters[0]=StripPrefix=1

spring.cloud.gateway.routes[2].id=socket-service
spring.cloud.gateway.routes[2].uri=lb://socket-service
spring.cloud.gateway.routes[2].predicates[0]=Path=/ws/**

spring.cloud.gateway.routes[3].id=chat-service
spring.cloud.gateway.routes[3].uri=lb://chat-service
spring.cloud.gateway.routes[3].predicates[0]=Path=/api/chat/**
spring.cloud.gateway.routes[3].filters[0]=StripPrefix=1
```

---

## 🔐 Authentication Flow

- **Access JWT Token Validation** on protected routes
- **Automatic Token Refresh** using refresh tokens when access tokens expire
- **Cookie-based** token storage for security (`accessToken` & `refreshToken` cookies)
- **Public Routes**: `/api/auth/**` and `/ws/**` (no token required)
- **Protected Routes**: `/api/profile/**` and `/api/chat/**` (require valid access token)

---

## 🛠️ Tech Stack

- **Java 21** with **Spring Boot 3.4.4**
- **Spring Cloud Gateway** for routing
- **Netflix Eureka Client** for service discovery
- **JJWT** for JWT token handling
- **Docker** for containerization
