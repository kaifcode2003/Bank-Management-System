# BankMate – Core Banking System

[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[GitHub Repository](https://github.com/kaifcode2003/Bank-Management-System)

---

## Overview

**BankMate** is a full-stack core banking application designed to simulate real-world financial operations. It provides a secure backend API for account management and financial transactions, along with a responsive, multi-page frontend dashboard for users to monitor and manage their finances.

The system demonstrates key banking features such as account creation, deposits, withdrawals, transfers, and visual dashboards with analytics.

---

## Features

* **Secure User Authentication**: JWT-based authentication and password hashing with bcrypt.js.
* **Account Management**: Create and manage user accounts, view balances and transaction history.
* **Financial Transactions**: Perform deposits, withdrawals, and inter-account transfers with atomic transaction handling.
* **Frontend Dashboard**: Responsive, multi-page UI built with HTML, Tailwind CSS, and JavaScript.
* **Data Visualizations**: Interactive charts using Chart.js for monthly income, expenses, and transaction analytics.
* **Modular Backend Architecture**: Clean separation of controllers, routes, middleware, and database configuration for maintainability and scalability.

---

## Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: SQLite
* **Authentication**: JWT, bcrypt.js
* **Frontend**: HTML5, Tailwind CSS, JavaScript
* **Data Visualization**: Chart.js

---

## Getting Started

### Prerequisites

* Node.js v18+
* npm (Node Package Manager)
* SQLite3

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/kaifcode2003/Bank-Management-System.git
cd Bank-Management-System
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the server**

```bash
npm start
```

4. **Access the application**
   Open your browser and navigate to:

```
http://localhost:3000
```

---

## Project Structure

```
BankMate/
├── backend/             # Node.js API server
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication & error handling
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── index.js         # Server entry point
├── frontend/            # HTML, Tailwind CSS, JavaScript
├── database/            # SQLite database files
└── README.md
```

---

## API Endpoints

| Endpoint                | Method | Description                              |
| ----------------------- | ------ | ---------------------------------------- |
| `/api/auth/register`    | POST   | Register a new user                      |
| `/api/auth/login`       | POST   | Authenticate user and generate JWT       |
| `/api/accounts`         | GET    | Get all accounts (admin)                 |
| `/api/accounts/:id`     | GET    | Get account details by ID                |
| `/api/transactions`     | POST   | Perform deposit, withdrawal, or transfer |
| `/api/transactions/:id` | GET    | Get transaction history by account       |

---

## Security Features

* **JWT Authentication**: Secure access to APIs.
* **Password Hashing**: User passwords stored securely using bcrypt.js.
* **Role-Based Access Control**: Admin and user roles with restricted access.
* **Atomic Transactions**: Ensures transfers complete fully or fail safely to maintain data integrity.

---

## Future Improvements

* Add support for multi-currency accounts.
* Implement loan and interest management.
* Integrate with email/SMS notifications for transactions.
* Add two-factor authentication (2FA) for enhanced security.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Author

**Mohd Kaif** – [GitHub](https://github.com/kaifcode2003) | [Portfolio](https://mohd-kaif-portfolio.vercel.app)
