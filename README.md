# Skill Lane API

API สำหรับระบบจัดการยืม-คืนหนังสือ พัฒนาด้วย NestJS, Prisma และ MySQL

## 📋 คุณสมบัติ

- 🔐 **Authentication & Authorization**
  - User registration with password hashing (bcrypt)
  - JWT-based authentication
  - Protected routes with JWT Guard

- 📚 **Book Management**
  - Create, Read, Update books
  - Upload book cover images
  - Search books by title, author, or ISBN
  - ISBN uniqueness validation
  - Inventory tracking (total quantity & available quantity)

- 📖 **Borrow & Return System**
  - Borrow books with quantity tracking
  - Return books
  - Check borrow status for each user
  - Prevent quantity updates below borrowed amount

## 🛠️ Tech Stack

- **Framework**: NestJS 11
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **File Upload**: Multer
- **Validation**: class-validator, class-transformer

## 📦 Installation

```bash
# Clone repository
git clone <repository-url>
cd skill-lane-api

# Install dependencies
npm install
```

## ⚙️ Environment Variables

สร้างไฟล์ `.env` จากไฟล์ `.env.example`:

```bash
cp .env.example .env
```

## � Docker Setup

เริ่มต้น MySQL database ด้วย Docker Compose:

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## �🗄️ Database Setup

```bash
# Run Prisma migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

## 🚀 Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

API จะรันที่ `http://localhost:3000`

## 📡 API Endpoints

### Authentication

#### Register

```http
POST /register
Content-Type: application/json

{
  "username": "user123",
  "password": "password123"
}
```

#### Login

```http
POST /auth
Content-Type: application/json

{
  "username": "user123",
  "password": "password123"
}

Response:
{
  "accessToken": "jwt-token",
  "user": {
    "id": 1,
    "username": "user123"
  }
}
```

### Books (Protected - requires JWT token)

#### Create Book

```http
POST /book
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Book Title",
  "author": "Author Name",
  "isbn": "1234567890",
  "published": "2024",
  "coverImage": "filename.jpg",
  "totalQuantity": 10
}
```

#### Upload Cover Image

```http
POST /book/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <image-file>

Response:
{
  "url": "/uploads/filename.jpg",
  "filename": "filename.jpg"
}
```

#### Get All Books (with search)

```http
GET /book?search=keyword
Authorization: Bearer <token>

Response: Array of books with borrow status
```

#### Get Book by ID

```http
GET /book/:id
Authorization: Bearer <token>
```

#### Update Book

```http
PATCH /book/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "totalQuantity": 15
}
```

#### Borrow Book

```http
POST /book/borrow
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookId": 1,
  "quantity": 2
}
```

#### Return Book

```http
POST /book/:borrowRecordId/return
Authorization: Bearer <token>
```

## 📁 Project Structure

```
src/
├── auth/           # Authentication module
│   ├── guards/     # JWT guards & strategy
│   ├── decorators/ # Custom decorators
│   └── dto/        # Login DTOs
├── register/       # User registration module
├── book/           # Book management module
│   └── dto/        # Book DTOs
├── prisma/         # Prisma service
└── main.ts         # Application entry point

prisma/
├── schema.prisma   # Database schema
└── migrations/     # Database migrations

uploads/            # Uploaded images
```

## 🔒 Security Features

- Password hashing with bcrypt (salt rounds: 10)
- JWT token-based authentication
- Protected routes with guards
- Input validation with class-validator
- CORS enabled
- File upload restrictions (images only)

## 📝 Database Schema

**User**

- id, username, password, createdAt

**Book**

- id, title, author, isbn (unique), published, coverImage, totalQuantity, availableQuantity, createdAt, updatedAt

**BorrowRecord**

- id, userId, bookId, quantity, borrowedAt, returnedAt

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Built with ❤️ using NestJS
