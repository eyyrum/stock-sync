const express = require('express');
const cors = require('cors');
const inventoryRoutes = require('./routes/inventoryRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const userRoutes = require('./routes/userRoutes');
const { sequelize } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', userRoutes);

// Sync database
sequelize.sync()
  .then(() => {
    console.log('Database synchronized successfully');
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });

const PORT = process.env.PORT || 4007;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;