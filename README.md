# Shopee E-Commerce Platform

A full-stack e-commerce platform built with MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User authentication and authorization
- Product management (CRUD operations)
- Shopping cart functionality
- Order processing
- Admin dashboard
- Responsive design

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Express Validator

### Frontend
- React.js
- React Router DOM
- Axios
- Material-UI
- CSS3

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>

2. Install backend dependencies
```bash
cd ecommerce-project
npm install
 ```

3. Install frontend dependencies
```bash
cd frontend
npm install
 ```

4. Create .env file in root directory and add:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
 ```

5. Create .env file in frontend directory and add:
```env
REACT_APP_API_URL=http://localhost:5000
 ```
```

### Running the Application
1. Start the backend server
```bash
npm start
 ```

2. Start the frontend application
```bash
cd frontend
npm start
 ```

## Project Structure
```plaintext
ecommerce-project/
├── backend/
│   ├── models/
│   ├── routes/
│   └── middleware/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       └── styles/
└── middleware/
 ```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.