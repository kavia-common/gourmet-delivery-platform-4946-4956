const crypto = require('crypto');

/**
 * In-memory data store for users, restaurants, menu items, and orders.
 * - Uses string UUIDs for IDs to match prior API id mapping.
 * - Exposes repositories with simple CRUD-like helpers.
 * - Seeds demo data at module load (server start).
 *
 * Data resets on every server restart (no persistence).
 */

// Utility to create a uuid (Node 18+ supports crypto.randomUUID)
function uuid() {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : crypto.randomBytes(16).toString('hex');
}

// Collections
const users = [];
const restaurants = [];
const menuItems = [];
const orders = [];

// Indexes for fast lookup
const usersById = new Map();
const usersByEmail = new Map();
const restaurantsById = new Map();
const menuItemsById = new Map();
const menuItemsByRestaurant = new Map();
const ordersById = new Map();

/**
 * Seed data
 * - 2 demo users
 * - 5 restaurants
 * - 20-30 menu items
 * - 1 sample order with basic status
 */
function seed() {
  // Clear existing
  users.length = 0;
  restaurants.length = 0;
  menuItems.length = 0;
  orders.length = 0;

  usersById.clear();
  usersByEmail.clear();
  restaurantsById.clear();
  menuItemsById.clear();
  menuItemsByRestaurant.clear();
  ordersById.clear();

  // Create demo users (password hashing logic will be same as auth service uses)
  const demoUsers = [
    { email: 'demo1@example.com', name: 'Demo One', password: 'password123' },
    { email: 'demo2@example.com', name: 'Demo Two', password: 'password123' },
  ];

  // Simple salted hash using sha256 for demo purposes (keep consistent with services/auth.js)
  const hashPassword = (password, salt) =>
    crypto.createHmac('sha256', salt).update(password).digest('hex');

  demoUsers.forEach((u) => {
    const id = uuid();
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(u.password, salt);
    const user = {
      id,
      email: u.email,
      name: u.name,
      passwordHash,
      salt,
      createdAt: new Date(),
    };
    users.push(user);
    usersById.set(id, user);
    usersByEmail.set(u.email, user);
  });

  // Seed restaurants
  const restaurantSeeds = [
    {
      name: 'Ocean Breeze Sushi',
      description: 'Fresh sushi and sashimi with a modern twist.',
      categories: ['Japanese', 'Sushi', 'Seafood'],
      imageUrl: 'https://picsum.photos/seed/sushi/600/400',
      rating: 4.7,
      deliveryFee: 2.99,
      estimatedTimeMinutes: 30,
      address: '123 Ocean Ave',
    },
    {
      name: 'Pasta Palazzo',
      description: 'Authentic Italian pasta and wood-fired pizzas.',
      categories: ['Italian', 'Pasta', 'Pizza'],
      imageUrl: 'https://picsum.photos/seed/pasta/600/400',
      rating: 4.5,
      deliveryFee: 3.49,
      estimatedTimeMinutes: 35,
      address: '45 Roma Street',
    },
    {
      name: 'Spice Route Curry House',
      description: 'Aromatic curries and flavorful biryanis.',
      categories: ['Indian', 'Curry', 'Vegetarian'],
      imageUrl: 'https://picsum.photos/seed/curry/600/400',
      rating: 4.6,
      deliveryFee: 2.49,
      estimatedTimeMinutes: 40,
      address: '77 Spice Blvd',
    },
    {
      name: 'Green Garden Salads',
      description: 'Healthy salads, bowls, and wraps.',
      categories: ['Healthy', 'Salads', 'Vegan'],
      imageUrl: 'https://picsum.photos/seed/salad/600/400',
      rating: 4.3,
      deliveryFee: 1.99,
      estimatedTimeMinutes: 20,
      address: '9 Leafy Lane',
    },
    {
      name: 'Burger Barn',
      description: 'Gourmet burgers and crispy fries.',
      categories: ['American', 'Burgers'],
      imageUrl: 'https://picsum.photos/seed/burger/600/400',
      rating: 4.4,
      deliveryFee: 2.49,
      estimatedTimeMinutes: 25,
      address: '501 Grill Road',
    },
  ];

  const restaurantIds = restaurantSeeds.map((r) => {
    const id = uuid();
    const item = { id, ...r };
    restaurants.push(item);
    restaurantsById.set(id, item);
    return id;
  });

  // Helper to add menu item
  function addMenuItem(restaurantId, name, description, price, imageSeed, categories = [], options = []) {
    const id = uuid();
    const mi = {
      id,
      restaurantId,
      name,
      description,
      price,
      imageUrl: `https://picsum.photos/seed/${imageSeed}/600/400`,
      categories,
      options,
    };
    menuItems.push(mi);
    menuItemsById.set(id, mi);
    if (!menuItemsByRestaurant.has(restaurantId)) {
      menuItemsByRestaurant.set(restaurantId, []);
    }
    menuItemsByRestaurant.get(restaurantId).push(mi);
  }

  // Create 20-30 menu items across restaurants
  const [sushiId, pastaId, curryId, saladId, burgerId] = restaurantIds;

  // Sushi items
  addMenuItem(sushiId, 'Salmon Nigiri', 'Fresh salmon over rice', 6.5, 'salmon', ['Sushi']);
  addMenuItem(sushiId, 'Tuna Sashimi', 'Thick cuts of ahi tuna', 8.5, 'tuna', ['Sashimi']);
  addMenuItem(sushiId, 'California Roll', 'Crab, avocado, cucumber', 7.0, 'calir', ['Rolls']);
  addMenuItem(sushiId, 'Dragon Roll', 'Eel, avocado, cucumber, tobiko', 12.0, 'dragon', ['Rolls']);

  // Pasta items
  addMenuItem(pastaId, 'Spaghetti Carbonara', 'Pancetta, egg, pecorino', 13.0, 'carbonara', ['Pasta']);
  addMenuItem(pastaId, 'Margherita Pizza', 'Tomato, mozzarella, basil', 11.0, 'margherita', ['Pizza']);
  addMenuItem(pastaId, 'Penne Arrabiata', 'Spicy tomato sauce', 12.0, 'arrabiata', ['Pasta']);
  addMenuItem(pastaId, 'Lasagna', 'Layered pasta with meat sauce', 14.0, 'lasagna', ['Pasta']);

  // Curry items
  addMenuItem(curryId, 'Chicken Tikka Masala', 'Creamy tomato sauce', 12.5, 'tikka', ['Curry']);
  addMenuItem(curryId, 'Paneer Butter Masala', 'Paneer in rich gravy', 11.5, 'paneer', ['Curry', 'Vegetarian']);
  addMenuItem(curryId, 'Lamb Rogan Josh', 'Aromatic spices and lamb', 13.5, 'roganjosh', ['Curry']);
  addMenuItem(curryId, 'Vegetable Biryani', 'Fragrant rice with veggies', 10.5, 'biryani', ['Rice', 'Vegetarian']);

  // Salad items
  addMenuItem(saladId, 'Caesar Salad', 'Romaine, croutons, parmesan', 9.0, 'caesar', ['Salad']);
  addMenuItem(saladId, 'Quinoa Bowl', 'Quinoa, veggies, tahini', 10.0, 'quinoa', ['Bowl', 'Vegan']);
  addMenuItem(saladId, 'Greek Salad', 'Feta, olives, cucumber', 9.5, 'greek', ['Salad', 'Vegetarian']);
  addMenuItem(saladId, 'Avocado Wrap', 'Fresh avocado and greens', 8.5, 'avocado', ['Wrap', 'Vegan']);

  // Burger items
  addMenuItem(burgerId, 'Classic Cheeseburger', 'Beef, cheddar, pickles', 10.0, 'cheese', ['Burger']);
  addMenuItem(burgerId, 'BBQ Bacon Burger', 'Smoky BBQ sauce, bacon', 12.0, 'bbq', ['Burger']);
  addMenuItem(burgerId, 'Veggie Burger', 'Plant-based patty', 11.0, 'veggie', ['Burger', 'Vegetarian']);
  addMenuItem(burgerId, 'Fries', 'Crispy golden fries', 4.5, 'fries', ['Sides']);

  // Sample order for demo
  const demoUser = users[0];
  const sampleOrderId = uuid();
  const sampleOrder = {
    id: sampleOrderId,
    userId: demoUser.id,
    restaurantId: sushiId,
    items: [
      { menuItemId: menuItemsByRestaurant.get(sushiId)[0].id, quantity: 2, instructions: '' },
      { menuItemId: menuItemsByRestaurant.get(sushiId)[2].id, quantity: 1, instructions: 'No wasabi' },
    ],
    notes: 'Please ring the bell',
    status: 'preparing',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  orders.push(sampleOrder);
  ordersById.set(sampleOrderId, sampleOrder);
}

// Repositories expose simple accessors for services
const usersRepo = {
  findByEmail(email) {
    return usersByEmail.get(email) || null;
  },
  findById(id) {
    return usersById.get(id) || null;
  },
  insert({ email, name, passwordHash, salt }) {
    const id = uuid();
    const doc = { id, email, name: name || '', passwordHash, salt, createdAt: new Date() };
    users.push(doc);
    usersById.set(id, doc);
    usersByEmail.set(email, doc);
    return { ...doc };
  },
};

const restaurantsRepo = {
  list({ category, search } = {}) {
    let list = restaurants;
    if (category) {
      list = list.filter((r) => (r.categories || []).includes(category));
    }
    if (search) {
      const s = String(search).toLowerCase();
      list = list.filter(
        (r) =>
          (r.name && r.name.toLowerCase().includes(s)) ||
          (r.description && r.description.toLowerCase().includes(s))
      );
    }
    return list.map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description,
      categories: d.categories || [],
      imageUrl: d.imageUrl || '',
      rating: typeof d.rating === 'number' ? d.rating : null,
      deliveryFee: typeof d.deliveryFee === 'number' ? d.deliveryFee : null,
      estimatedTimeMinutes:
        typeof d.estimatedTimeMinutes === 'number' ? d.estimatedTimeMinutes : null,
      address: d.address || '',
    }));
  },
  getById(id) {
    const d = restaurantsById.get(id);
    if (!d) return null;
    return {
      id: d.id,
      name: d.name,
      description: d.description,
      categories: d.categories || [],
      imageUrl: d.imageUrl || '',
      rating: typeof d.rating === 'number' ? d.rating : null,
      deliveryFee: typeof d.deliveryFee === 'number' ? d.deliveryFee : null,
      estimatedTimeMinutes:
        typeof d.estimatedTimeMinutes === 'number' ? d.estimatedTimeMinutes : null,
      address: d.address || '',
    };
  },
};

const menuItemsRepo = {
  list({ restaurantId } = {}) {
    let list = menuItems;
    if (restaurantId) {
      list = menuItemsByRestaurant.get(restaurantId) || [];
    }
    return list.map((d) => ({
      id: d.id,
      restaurantId: d.restaurantId,
      name: d.name,
      description: d.description || '',
      price: typeof d.price === 'number' ? d.price : null,
      imageUrl: d.imageUrl || '',
      categories: d.categories || [],
      options: d.options || [],
    }));
  },
};

const ordersRepo = {
  insert({ userId, restaurantId, items, notes, status }) {
    const id = uuid();
    const doc = {
      id,
      userId,
      restaurantId,
      items: items || [],
      notes: notes || '',
      status: status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    orders.push(doc);
    ordersById.set(id, doc);
    return { id: doc.id, status: doc.status };
  },
  findById(id) {
    const doc = ordersById.get(id);
    if (!doc) return null;
    return {
      id: doc.id,
      userId: doc.userId,
      restaurantId: doc.restaurantId,
      items: (doc.items || []).map((i) => ({
        menuItemId: i.menuItemId,
        quantity: Number(i.quantity || 1),
        instructions: i.instructions || '',
      })),
      notes: doc.notes || '',
      status: doc.status || 'pending',
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  },
  getStatus(id) {
    const o = ordersById.get(id);
    if (!o) return null;
    return { id: o.id, status: o.status };
  },
};

// Seed immediately at module load (server start)
seed();

module.exports = {
  // PUBLIC_INTERFACE
  usersRepo,
  // PUBLIC_INTERFACE
  restaurantsRepo,
  // PUBLIC_INTERFACE
  menuItemsRepo,
  // PUBLIC_INTERFACE
  ordersRepo,
  // PUBLIC_INTERFACE
  seed,
};
