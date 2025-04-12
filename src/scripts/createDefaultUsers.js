const { User } = require('../models');

async function createDefaultUsers() {
  try {
    // Create a seller
    const seller = await User.create({
      name: 'John Seller',
      email: 'seller@example.com',
      role: 'seller'
    });

    // Create a buyer
    const buyer = await User.create({
      name: 'Alice Buyer',
      email: 'buyer@example.com',
      role: 'buyer'
    });

    console.log('Default users created successfully:');
    console.log('Seller:', seller.toJSON());
    console.log('Buyer:', buyer.toJSON());
  } catch (error) {
    console.error('Error creating default users:', error);
  }
}

// Run the function if this script is run directly
if (require.main === module) {
  createDefaultUsers()
    .then(() => process.exit())
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = createDefaultUsers; 