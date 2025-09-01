# Chat Service

The **Chat Service** is the core messaging microservice for the Chat App.  
It handles chat creation, message management, chat history, and provides RESTful APIs for chat functionality including individual and group chats, message persistence, and read status tracking.

---

## Repository

**View Source Code:** [https://github.com/sravankotcherla/chatApp-chat-service](https://github.com/sravankotcherla/chatApp-chat-service)

---

## Architecture Role

- **Message Persistence Layer** that consumes message requests from Kafka
- **Manages chat creation** and user group management
- **Handles message storage** and retrieval using MongoDB
- **Provides RESTful APIs** for chat history and management operations
- **Integrates with Kafka** for event-driven message processing
- **Supports both individual and group chats** with flexible configuration
- **Event Publisher** that confirms message creation back to Kafka

---

## REST API Endpoints and Functionality

### Chat Management Endpoints

#### `GET /chat` - Retrieve User Chats

- **Headers:** `authenticated-user-id` (required)
- **Response:** List of all chats for the authenticated user
- **Functionality:** Returns chats with last message information and metadata

#### `POST /chat/create` - Create New Chat

- **Body:** List of user IDs to include in the chat
- **Response:** Created chat object with generated ID
- **Functionality:** Creates new individual or group chat sessions

#### `GET /chat/{chatId}` - Get Specific Chat

- **Path:** `chatId` - Unique identifier for the chat
- **Response:** Chat object with full details
- **Functionality:** Retrieves specific chat information and metadata

### Message Management Endpoints

#### `POST /chat/message/create` - Send Message

- **Body:** `MessageDTO` containing message content and metadata
- **Response:** Generated message ID
- **Functionality:** Creates new message and updates chat's last message

#### `PUT /chat/message/read` - Mark Messages as Read

- **Body:** List of message IDs to mark as read
- **Response:** Success confirmation
- **Functionality:** Updates message read status for delivery tracking

#### `GET /chat/message/` - Retrieve Chat Messages

- **Query Parameters:**
  - `chatId` - Chat identifier
  - `skipNumber` - Pagination offset for message history
- **Response:** List of messages for the specified chat
- **Functionality:** Retrieves paginated message history with configurable offset

---

## Message Flow

### Real-time Message Processing Flow

1. **Sender** sends message via WebSocket to Socket Service
2. **Socket Service** publishes message request to Kafka topic (`message-requests`)
3. **Chat Service** consumes message request from Kafka and creates message in MongoDB
4. **Chat Service** publishes message creation confirmation to Kafka topic (`message-created`)
5. **Socket Service** consumes confirmation and delivers message to receiver via WebSocket

### Chat Retrieval Flow

1. Client requests chats via `GET /chat` with user ID
2. Service queries MongoDB for user's chat memberships
3. Chats are populated with last message information
4. Paginated results are returned to client

### Message History Flow

1. Client requests chat messages via `GET /chat/message/`
2. Service retrieves messages with pagination support
3. Messages are ordered by creation timestamp
4. Paginated results are returned to client

---

## Database Schema

### MongoDB Collections

#### `chats` Collection

- Stores chat metadata and member information
- Supports both individual and group chat types
- Indexed on `members` field for efficient user chat queries

**Fields:**

- `_id`
- `members`
- `isGroup`
- `groupName`
- `groupDescription`
- `groupProfilePic`
- `lastMessage`
- `createdAt`
- `createdBy`

#### `messages` Collection

- Stores all message content and metadata
- Indexed on `chatId` and `createdAt` for efficient retrieval
- Supports message status tracking (SENT, DELIVERED, READ)

**Fields:**

- `_id`
- `chatId`
- `clientMessageId`
- `messageType`
- `content`
- `senderId`
- `createdAt`
- `status`

**Status Flow:** SENT → DELIVERED → READ

---

## Tech Stack

- **Java 21** with **Spring Boot 3.4.4**
- **Spring Web** for RESTful API endpoints
- **Spring Data MongoDB** for data persistence
- **Spring Kafka** for event-driven messaging
- **MongoDB** as the primary database
- **Apache Kafka** for event streaming and message processing
- **Lombok** for code generation and boilerplate reduction
- **Spring Cloud** for microservice architecture support
- **Maven** for dependency management and build automation
- **Docker** for containerization

---

## Kafka Integration

### Event Topics

#### `message-requests` (Input Topic)

- **Producer**: Socket Service
- **Consumer**: Chat Service
- **Purpose**: Receives message creation requests from real-time clients
- **Data**: Message content, sender, recipient, chat ID, and metadata

#### `message-created` (Output Topic)

- **Producer**: Chat Service
- **Consumer**: Socket Service
- **Purpose**: Confirms successful message creation and persistence
- **Data**: Generated message ID, chat updates, and delivery confirmation

### Event Flow Architecture

```
WebSocket Clients ↔ Socket Service ↔ Kafka ↔ Chat Service ↔ MongoDB
```

- **Real-time Communication**: Socket Service handles immediate WebSocket connections
- **Message Persistence**: Chat Service ensures reliable storage and retrieval
- **Event Sourcing**: Complete audit trail of message lifecycle
- **Scalability**: Services can scale independently based on load

---
