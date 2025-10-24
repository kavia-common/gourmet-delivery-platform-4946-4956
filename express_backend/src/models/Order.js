'use strict';

const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

/**
 * Order schema
 * - userId: ref User (indexed)
 * - restaurantId: ref Restaurant (indexed)
 * - items: [{ menuItemId ref MenuItem, quantity, instructions, priceAtOrder }]
 * - notes
 * - status: enum
 * - etaMinutes
 * - timestamps
 */

const OrderItemSchema = new Schema(
  {
    menuItemId: { type: Types.ObjectId, ref: 'MenuItem', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    instructions: { type: String, default: '' },
    priceAtOrder: { type: Number, required: true }, // store price snapshot
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    restaurantId: { type: Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    items: { type: [OrderItemSchema], default: [], validate: v => Array.isArray(v) && v.length > 0 },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['created', 'preparing', 'picked_up', 'en_route', 'delivered', 'canceled'],
      default: 'created',
      index: true,
    },
    etaMinutes: { type: Number, default: null },
  },
  { timestamps: true }
);

/**
 * PUBLIC_INTERFACE
 * Order model accessor.
 */
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
module.exports = Order;
