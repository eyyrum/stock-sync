# StockSync - Inventory Management System

StockSync is a full-stack inventory management system that allows sellers to list their inventory and buyers to make reservations. The system includes features like reservation timeouts, user role management, and real-time inventory updates.

## Features

- **User Management**
  - Role-based access (Sellers and Buyers)
  - User authentication and authorization
  - Secure password handling

- **Inventory Management**
  - Sellers can create and manage inventory listings
  - Track available and total quantities
  - Set expiry times for listings
  - View only their own listings

- **Reservation System**
  - Buyers can reserve available inventory
  - 5-minute reservation timeout
  - Automatic expiration of unconfirmed reservations
  - View only their own reservations

- **Real-time Updates**
  - Automatic processing of expired reservations
  - Real-time inventory availability updates
  - Transaction management for data consistency

## Tech Stack

### Backend
- Node.js with Express
- PostgreSQL database
- Sequelize ORM
- JWT for authentication
- Transaction management for data consistency

### Frontend
- React.js
- React Bootstrap for UI components
- Axios for API calls
- Context API for state management

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/eyyrum/stock-sync.git
cd stock-sync
```

2. Install backend dependencies:
```bash
cd src
npm install
```

3. Install frontend dependencies:
```bash
cd ../ui/frontend
npm install
```

4. Set up the database:
- Create a PostgreSQL database
- Update the database configuration in `src/config/database.js`

5. Set up environment variables:
Create a `.env` file in the `src` directory with the following variables:
```
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
RESERVATION_EXPIRY_MINUTES=5
```

## Running the Application

1. Start the backend server:
```bash
cd src
npm start
```

2. Start the frontend development server:
```bash
cd ui/frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4007

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Inventory
- GET /api/inventory - Get inventory listings
- POST /api/inventory - Create new listing
- GET /api/inventory/:id - Get specific listing

### Reservations
- GET /api/reservations - Get reservations
- POST /api/reservations - Create new reservation
- POST /api/reservations/:id/confirm - Confirm reservation

## Database Schema

### Users
- id (Primary Key)
- name
- email
- password
- role (seller/buyer)
- active

### Products
- id (Primary Key)
- sku
- name
- description

### Inventory Listings
- id (Primary Key)
- seller_id (Foreign Key)
- product_id (Foreign Key)
- quantity
- available_quantity
- price
- expiry_time

### Reservations
- id (Primary Key)
- listing_id (Foreign Key)
- buyer_id
- quantity
- status (PENDING/CONFIRMED/EXPIRED/CANCELLED)
- expires_at

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

eyyrum - [GitHub Profile](https://github.com/eyyrum)

Project Link: https://github.com/eyyrum/stock-sync 