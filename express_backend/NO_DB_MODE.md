Gourmet Delivery API - No DB Mode

This backend is configured to run without an external database. It uses an in-memory data layer that is seeded on server startup.

Key points:
- No MongoDB connection is required; MongoDB dependencies were removed.
- Data is stored in-memory and resets on each server restart.
- Seeded data:
  - 2 demo users:
    - demo1@example.com / password123
    - demo2@example.com / password123
  - 5 restaurants with 20+ menu items.
  - 1 sample order for demo.
- API endpoints and response shapes are unchanged:
  - POST /auth/register
  - POST /auth/login
  - GET /restaurants
  - GET /restaurants/:id
  - GET /restaurants/:id/menu
  - GET /menu?restaurantId=...
  - POST /orders (requires Bearer token)
  - GET /orders/:id
  - GET /orders/:id/status

Environment:
- Required variables are PORT and JWT_SECRET (see .env.example).
