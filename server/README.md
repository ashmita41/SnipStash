# SnipStash Backend API Documentation

SnipStash is a code snippet organizer that allows users to store, manage, and retrieve their code snippets with automatic tagging functionality.

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- bcrypt for password hashing
- express-validator for input validation

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=24h
```

## 🛠️ Installation

1. Clone the repository
```bash
git clone <repository-url>
cd snip-stash
```

2. Install dependencies
```bash
npm install
```

3. Start the server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📚 API Documentation

### Authentication Endpoints

#### 1. User Signup
```http
POST /api/auth/signup
```

Request body:
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

Response:
```json
{
    "token": "jwt_token_here"
}
```

#### 2. User Login
```http
POST /api/auth/login
```

Request body:
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

Response:
```json
{
    "token": "jwt_token_here"
}
```

### Snippet Endpoints

All snippet endpoints require authentication. Add the JWT token to the request header:
```
Authorization: Bearer your_jwt_token
```

#### 1. Create Snippet
```http
POST /api/snippets
```

Request body:
```json
{
    "title": "My Snippet",
    "code": "console.log('Hello World');",
    "language": "JavaScript"
}
```

Response:
```json
{
    "_id": "snippet_id",
    "title": "My Snippet",
    "code": "console.log('Hello World');",
    "language": "JavaScript",
    "tags": ["debugging"],
    "userId": "user_id",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
}
```

#### 2. Get All Snippets
```http
GET /api/snippets
```

Query Parameters:
- `tag`: Filter by tag
- `language`: Filter by programming language
- `search`: Search in title and code

Example:
```http
GET /api/snippets?tag=debugging&language=JavaScript&search=console
```

Response:
```json
[
    {
        "_id": "snippet_id",
        "title": "My Snippet",
        "code": "console.log('Hello World');",
        "language": "JavaScript",
        "tags": ["debugging"],
        "userId": "user_id",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    }
]
```

#### 3. Update Snippet
```http
PUT /api/snippets/:id
```

Request body:
```json
{
    "title": "Updated Snippet",
    "code": "console.log('Updated!');",
    "language": "JavaScript"
}
```

Response:
```json
{
    "_id": "snippet_id",
    "title": "Updated Snippet",
    "code": "console.log('Updated!');",
    "language": "JavaScript",
    "tags": ["debugging"],
    "userId": "user_id",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
}
```

#### 4. Delete Snippet
```http
DELETE /api/snippets/:id
```

Response:
```json
{
    "message": "Snippet deleted"
}
```

## 🏷️ Automatic Tag Generation

The system automatically generates tags based on code content:

| Code Pattern | Generated Tag |
|-------------|---------------|
| `for`, `while` | `loop` |
| `fetch`, `axios` | `API` |
| `try`, `catch` | `error handling` |
| `.map`, `.filter` | `array ops` |
| `console.log` | `debugging` |

## 📝 Models

### User Model
```javascript
{
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
}
```

### Snippet Model
```javascript
{
    title: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
        enum: ['JavaScript', 'Python', 'Bash', 'Java', 'C++', 'HTML', 'CSS', 'TypeScript', 'Other']
    },
    tags: [{
        type: String,
        trim: true
    }],
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    }
}
```

## 🔒 Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Input validation and sanitization
- MongoDB injection protection
- CORS enabled
- Environment variable protection

## ⚠️ Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `201`: Resource created
- `400`: Bad request
- `401`: Unauthorized
- `404`: Resource not found
- `500`: Server error

Error response format:
```json
{
    "message": "Error message here"
}
```

## 🧪 Testing with Postman

1. Import the Postman collection (if available)
2. Set up environment variables in Postman:
   - `BASE_URL`: `http://localhost:5000`
   - `TOKEN`: JWT token after login

3. Test the endpoints in this order:
   - Signup/Login to get token
   - Create a snippet
   - Get all snippets
   - Update a snippet
   - Delete a snippet

## 📦 Dependencies

- `express`: Web framework
- `mongoose`: MongoDB ODM
- `jsonwebtoken`: JWT authentication
- `bcryptjs`: Password hashing
- `cors`: CORS middleware
- `dotenv`: Environment variables
- `express-validator`: Input validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request 