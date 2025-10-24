'use strict';

const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

/**
 * MenuItem schema
 * - restaurantId: ObjectId ref Restaurant (indexed)
 * - name, description, price, imageUrl
 * - categories: [String]
 * - options: [{ name, priceDelta }]
 * - timestamps
 */

const MenuItemOptionSchema = new Schema(
  {
    name: { type: String, required: true },
    priceDelta: { type: Number, default: 0 },
  },
  { _id: false }
);

const MenuItemSchema = new Schema(
  {
    restaurantId: { type: Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    imageUrl: { type: String, default: '' },
    categories: { type: [String], default: [] },
    options: { type: [MenuItemOptionSchema], default: [] },
  },
  { timestamps: true }
);

/**
 * PUBLIC_INTERFACE
 * MenuItem model accessor.
 */
const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);
module.exports = MenuItem;
