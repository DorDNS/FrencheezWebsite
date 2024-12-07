# Frencheez

*Say Cheese!* Welcome to Frencheez, an interactive platform to explore the rich, delicious, and diverse world of French cheeses. This project includes a client-side application built with Vue.js and a server-side application using Node.js and Express.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)

## Features

- **Concise Cheese Infos**: Learn about flavor profiles, textures, and pairings.
- **Interactive Quizzes**: Test your knowledge and have fun with cheese trivia.
- **User Profile**: Track your progress and save your favorite cheeses.
- **Admin Panel**: Manage users, quizzes, and cheese information.

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MySQL

### Steps

1. Clone the repository:
```sh
git clone https://github.com/yourusername/frencheez.git
cd frencheez
```

2. Install dependencies for both client and server:
```sh
npm install
cd client
npm install
cd ../server
npm install
```

3. Set up the MySQL database:
    - Create a database named `frencheez`.
    - Import the provided SQL schema and data.

4. Configure environment variables:
    - Create a `.env` file in the root directory and add the following:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=frencheez
JWT_SECRET=your_jwt_secret
```

## Usage

### Development

To run the project in development mode, use the following command:
```sh
npm run dev
```
This will start both the client and server concurrently.

### Production

To build the client for production, run:
```sh
cd client
npm run build
```

Then, start the server:

```sh
cd ../server
node app.js
```

## Project Structure

```
frencheez/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── router/
│   │   ├── views/
│   │   ├── App.vue
│   │   ├── main.js
│   ├── .gitignore
│   ├── babel.config.js
│   ├── jsconfig.json
│   ├── package.json
│   ├── vue.config.js
├── server/
│   ├── data/
│   ├── uploads/
│   ├── adminRoutes.js
│   ├── app.js
│   ├── authMiddleware.js
│   ├── authRoutes.js
│   ├── db.js
│   ├── favorites.js
│   ├── quizRoutes.js
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login a user.

### User(s)

- `GET /api/user`: Get user details.
- `PUT /api/user/profile`: Update user profile.
- `GET /api/user/progress`: Get user progress.
- `GET /admin/users`: Get all users (Admin only).
- `POST /admin/users`: Add a new user (Admin only).
- `DELETE /admin/users/:id`: Delete a user (Admin only).
- `PATCH /admin/users/:id`: Update a user's admin status (Admin only).

### Cheeses

- `GET /api/cheeses`: Get all cheeses.
- `GET /api/cheeses/:id`: Get a single cheese by ID.
- `POST /api/cheeses`: Add a new cheese (Admin only).
- `PUT /api/cheeses/:id`: Update a cheese (Admin only).
- `DELETE /api/cheeses/:id`: Delete a cheese (Admin only).

### Quizzes

- `GET /api/quizzes/:quizId`: Get quiz questions.
- `GET /api/quizzes/:quizId/best-score`: Get user's best score for a quiz.
- `POST /api/quizzes/update-score`: Update user's best score for a quiz.
- `GET /admin/quizzes`: Get all quizzes (Admin only).
- `POST /admin/quizzes`: Create or update a quiz (Admin only).
- `DELETE /admin/quizzes/:quizId`: Delete a quiz (Admin only).

### Favorites

- `GET /api/favorites`: Get user's favorite cheeses.
- `POST /api/favorites`: Add a cheese to favorites.
- `DELETE /api/favorites/:cheeseId`: Remove a cheese from favorites.