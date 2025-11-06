# Backend - Spell Daily

Express + TypeScript backend with comprehensive logging, request tracking, and New Relic integration.

## Features

### 🎯 Request Tracking

- **Request ID Middleware**: Automatically assigns unique UUID to each request
- **Async Context**: Request ID available throughout the entire request lifecycle using `async_hooks`
- **Request Logger**: Comprehensive logging of all incoming and completed requests

### 📊 Logging System

- **Winston Logger**: Structured logging with multiple transports
- **New Relic Integration**: Automatic log forwarding to New Relic
- **Auto Request ID**: All logs automatically include request ID from async context

### 🗄️ Database

- **Prisma ORM**: Type-safe database queries
- **PostgreSQL**: Connected to Neon database

## Setup

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="postgresql://..."

# New Relic
NEW_RELIC_LICENSE_KEY="NRAK-..."
NEW_RELIC_APP_NAME="spell-daily-backend"
NEW_RELIC_LOG_LEVEL="info"

# Application
PORT=3000
LOG_LEVEL="info"
```

### Scripts

```bash
# Development
pnpm dev              # Start dev server with hot reload

# Build
pnpm build            # Compile TypeScript

# Production
pnpm start            # Run compiled code

# Linting & Formatting
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix lint issues
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting

# Prisma
pnpm prisma:generate  # Generate Prisma client
pnpm prisma:migrate   # Run migrations
pnpm prisma:studio    # Open Prisma Studio
pnpm prisma:push      # Push schema to database
```

## Architecture

### Middleware Stack

1. **Request ID Middleware** - Assigns unique ID and stores in async context
2. **Request Logger Middleware** - Logs incoming and completed requests
3. **Express JSON Parser** - Parses JSON request bodies
4. **Routes** - Application routes
5. **Global Error Handler** - Catches and logs unhandled errors

### Logger Usage

The logger automatically includes the request ID from async context:

```typescript
import { logger } from './lib/logger.js';

// Different log levels
logger.debug('Debug message', { extra: 'data' });
logger.log('Info message', { userId: 123 });
logger.info('Info message (alias)');
logger.warning('Warning message');
logger.warn('Warning (alias)');
logger.error('Error message', error, { context: 'payment' });
```

### Request Logger Features

The request logger automatically logs:

**On Request Start:**

- HTTP method
- URL
- User agent
- IP address
- Content type

**On Request Completion:**

- Status code
- Duration (in ms)
- Content length
- Log level based on status code:
  - 200-399: `info`
  - 400-499: `warning`
  - 500+: `error`

**On Unhandled Exception:**

- Error details
- Request duration
- Error name and message

**On Connection Close:**

- Reason for early termination
- Request duration

### Log Destinations

All logs are sent to:

1. **Console** - Colorized, human-readable format (development)
2. **Files**:
   - `logs/combined.log` - All logs
   - `logs/error.log` - Error level logs only
3. **New Relic** - Structured logs with request ID and metadata

## API Endpoints

### Health Check

```http
GET /health
```

Checks database connectivity and returns server status.

### Root

```http
GET /
```

Simple endpoint that returns a welcome message.

### Test Endpoints

**Test Error Response:**

```http
GET /test-error
```

Returns a 400 error response to test error logging.

**Test Unhandled Exception:**

```http
GET /test-exception
```

Throws an unhandled exception to test exception logging.

## Example Log Output

### Console (Development)

```
2025-11-04 12:34:56 info [a7b3c2d1-1234-5678-abcd-123456789abc]: Incoming request {"method":"GET","url":"/health"}
2025-11-04 12:34:56 info [a7b3c2d1-1234-5678-abcd-123456789abc]: Health check passed - database connected
2025-11-04 12:34:56 info [a7b3c2d1-1234-5678-abcd-123456789abc]: Request completed {"statusCode":200,"duration":"45ms"}
```

### JSON Log File

```json
{
  "timestamp": "2025-11-04 12:34:56",
  "level": "info",
  "message": "Request completed",
  "requestId": "a7b3c2d1-1234-5678-abcd-123456789abc",
  "metadata": {
    "method": "GET",
    "url": "/health",
    "statusCode": 200,
    "duration": "45ms"
  }
}
```

## Project Structure

```
backend/
├── src/
│   ├── lib/
│   │   ├── asyncContext.ts    # Async context manager using async_hooks
│   │   └── logger.ts           # Winston logger with New Relic
│   ├── middleware/
│   │   ├── requestId.ts        # Request ID assignment
│   │   └── requestLogger.ts    # Request/response logging
│   ├── types/
│   │   └── express.d.ts        # Express type extensions
│   ├── generated/
│   │   └── prisma/             # Generated Prisma client
│   └── index.ts                # Application entry point
├── prisma/
│   └── schema.prisma           # Prisma schema
├── logs/                       # Log files (gitignored)
├── newrelic.cjs                # New Relic configuration
└── package.json
```

## New Relic Integration

The application automatically sends:

- **Transaction traces** for all HTTP requests
- **Error tracking** for exceptions
- **Custom logs** with request ID and metadata
- **Database query performance** via Prisma instrumentation

All logs include the request ID for easy correlation in New Relic's log viewer.

## Development Tips

1. **Accessing Request ID**: Available anywhere via `asyncContext.getRequestId()`
2. **Custom Logging**: Use `logger.*()` methods instead of `console.log`
3. **Error Handling**: Errors are automatically logged and sent to New Relic
4. **Testing Logs**: Use test endpoints `/test-error` and `/test-exception`

## License

Private - Spell Daily Project
