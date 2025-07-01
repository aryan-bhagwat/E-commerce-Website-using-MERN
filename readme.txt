# E-Commerce Project

## Table of Contents
- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Backend Development](#backend-development)
- [Frontend Development](#frontend-development)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Cart Functionality](#cart-functionality)
- [Deployment](#deployment)
- [Conclusion](#conclusion)

## Introduction
This project is a full-stack e-commerce application that allows users to sign up, sign in, browse products, add items to their cart, and manage their cart. The application is built using Node.js for the backend and React for the frontend.

## Technologies Used
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT for authentication
- **Frontend**: React, Axios, React Router
- **Styling**: CSS
- **Environment Variables**: dotenv

## Project Structure
ecommerce-project/
├── backend/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── .env
│ ├── server.js
│ └── db.js
└── frontend/
├── src/
│ ├── components/
│ ├── styles/
│ ├── App.js
│ └── index.js
├── public/
└── package.json