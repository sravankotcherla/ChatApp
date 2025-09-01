# Socket Service

The **Socket Service** is the real-time WebSocket communication microservice for the Chat App.  
It handles WebSocket connections, real-time message delivery, typing indicators, read receipts, and session management for instant messaging functionality.

---

## Repository

**View Source Code:** [https://github.com/sravankotcherla/chatApp-socket-service](https://github.com/sravankotcherla/chatApp-socket-service)

---

## Architecture Role

- **Real-time Communication Hub** for all microservices
- **Manages WebSocket connections** and session persistence using Redis
- **Handles real-time message delivery** and event broadcasting via Kafka
- **Integrates with other services** for user authentication and message persistence
- **Provides WebSocket endpoints** for client connections

---

## WebSocket Endpoints and Event Management Flow

### `WS /ws` - WebSocket Connection Endpoint

- Establishes WebSocket connection with authentication
- Handles connection lifecycle (open, close, error)
- Manages user session mapping and persistence

### Event Types and Handling

#### `CONNECTION_OPEN` - Connection Establishment

- Authenticates incoming WebSocket connections
- Maps user ID to WebSocket session
- Stores session in memory for real-time communication

#### `SEND_MESSAGE` - Message Transmission

- Processes outgoing chat messages
- Publishes messages to Kafka for reliable delivery
- Broadcasts messages to intended recipients
- Handles message delivery confirmation

#### `MESSAGE_READ` - Read Receipts

- Tracks message read status
- Updates message delivery state
- Notifies message sender of read confirmation

#### `TYPING` - Typing Indicators

- Broadcasts real-time typing status
- Shows when users are composing messages
- Enhances user experience with live feedback

#### `NEW_MESSAGE` - Message Reception

- Consumes messages from Kafka topics
- Handles incoming message processing
- Routes messages to appropriate recipients
- Manages message queuing for offline users

#### `MESSAGE_DELIVERED` - Delivery Confirmation

- Confirms message delivery to recipients
- Updates message delivery timestamps
- Provides delivery status feedback

#### `CONNECTION_CLOSE` - Connection Termination

- Cleans up user sessions on disconnect
- Removes session mappings from memory
- Handles graceful connection closure

---

## Tech Stack

- **Java 21** with **Spring Boot 3.4.4**
- **Spring WebSocket** for real-time communication
- **Spring WebFlux** for reactive programming support
- **WebSocket Handlers** for connection management
- **Event-driven Architecture** with **Kafka** for message processing
- **Redis** for distributed session management
- **Lombok** for code generation and boilerplate reduction
- **Jackson** for JSON message serialization
- **Docker** for containerization

---

## WebSocket Architecture

The service implements a robust WebSocket architecture with the following components:

| Component                  | Description                                           |
| -------------------------- | ----------------------------------------------------- |
| `ChatWebSocketHandler`     | Main WebSocket message handler and connection manager |
| `EventRegistry`            | Event routing and handler management system           |
| `SessionDao`               | Redis-based session storage and user mapping          |
| `WebSocketConfig`          | WebSocket endpoint configuration and setup            |
| `WebSocketAuthInterceptor` | Authentication and connection validation              |
| `Event Handlers`           | Specialized handlers for each event type              |

### Connection Flow

1. **Client connects** to `/ws` endpoint
2. **Authentication interceptor** validates user credentials
3. **Session mapping** stores user ID to WebSocket session
4. **Event registry** routes incoming messages to appropriate handlers
5. **Real-time communication** enables instant message delivery
6. **Session cleanup** on connection close

---

## Message Flow

### Outgoing Messages

1. Client sends message via WebSocket
2. Service processes message and publishes to Kafka
3. Message routed to recipient via Kafka consumer
4. Real-time delivery to online users
5. Delivery confirmation sent back to sender

### Incoming Messages

1. Service consumes messages from Kafka topics
2. Routes messages to appropriate online user sessions
3. Broadcasts typing indicators and read receipts
4. Manages offline message queuing via Kafka persistence

---

## Session Management

The service maintains active WebSocket sessions using Redis for distributed storage:

- **Redis** for distributed session storage across multiple instances
- **User ID to Session mapping** for direct message routing
- **Automatic cleanup** on connection termination with TTL
- **Session validation** for secure communication
- **Horizontal scaling** support for multiple service instances
