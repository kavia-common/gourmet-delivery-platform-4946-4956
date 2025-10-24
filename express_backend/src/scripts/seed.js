'use strict';

/**
 * Seed script:
 * - Connects to Mongo via src/db/mongo.js
 * - Loads demo data from in-memory seed (src/db/memory.js) to reuse seed content
 * - Persists: one demo user, several restaurants, menu items, and one sample order
 *
 * Usage:
 *   node src/scripts/seed.js
 *
 * Requires environment:
 *   - MONGODB_URI
 */

require('dotenv').config();
const crypto = require('crypto');
const { connect, disconnect } = require('../db/mongo');

const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

// We will leverage memory.js seed to obtain sample content
const memory = require('../db/memory');

function hashPassword(password, salt) {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

async function run() {
  await connect();

  console.log('Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Restaurant.deleteMany({}),
    MenuItem.deleteMany({}),
    Order.deleteMany({}),
  ]);

  // Create one demo user
  const email = 'demo1@example.com';
  const name = 'Demo One';
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword('password123', salt);
  const user = await User.create({ email, name, passwordHash, salt });
  console.log(`Created user: ${user.email}`);

  // Use restaurantsRepo and menuItemsRepo outputs from in-memory for base data
  console.log('Seeding restaurants and menu items from in-memory demo data...');
  const restaurants = memory.restaurantsRepo.list({});
  const restaurantIdMap = new Map(); // old id -> new ObjectId
  for (const r of restaurants) {
    const created = await Restaurant.create({
      name: r.name,
      description: r.description,
      imageUrl: r.imageUrl,
      rating: r.rating,
      etaMinutes: r.estimatedTimeMinutes ?? null,
      categories: r.categories || [],
    });
    restaurantIdMap.set(r.id, created._id);
  }

  // Seed menu items
  const allMenu = memory.menuItemsRepo.list({});
  const menuIdMap = new Map();
  for (const mi of allMenu) {
    const created = await MenuItem.create({
      restaurantId: restaurantIdMap.get(mi.restaurantId),
      name: mi.name,
      description: mi.description,
      price: mi.price,
      imageUrl: mi.imageUrl,
      categories: mi.categories || [],
      options: (mi.options || []).map((o) => ({ name: o.name, priceDelta: o.priceDelta || 0 })),
    });
    menuIdMap.set(mi.id, created._id);
  }
  console.log(`Seeded ${restaurantIdMap.size} restaurants and ${menuIdMap.size} menu items.`);

  // Create a sample order (based on memory order example)
  console.log('Creating a sample order...');
  const sampleRestaurantOldId = restaurants[0]?.id;
  const sampleRestaurantId = restaurantIdMap.get(sampleRestaurantOldId);

  const firstTwoForRestaurant = allMenu.filter((m) => m.restaurantId === sampleRestaurantOldId).slice(0, 2);
  const items = [];
  for (const m of firstTwoForRestaurant) {
    items.push({
      menuItemId: menuIdMap.get(m.id),
      quantity: 1,
      instructions: '',
      priceAtOrder: m.price,
    });
  }

  const order = await Order.create({
    userId: user._id,
    restaurantId: sampleRestaurantId,
    items,
    notes: 'Please ring the bell',
    status: 'preparing',
    etaMinutes: 30,
  });

  console.log(`Created order ${order._id.toString()} with ${order.items.length} items.`);

  console.log('Seeding done.');
}

run()
  .then(() => disconnect())
  .then(() => {
    console.log('Disconnected and finished.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seed failed:', err);
    disconnect().finally(() => process.exit(1));
  });
