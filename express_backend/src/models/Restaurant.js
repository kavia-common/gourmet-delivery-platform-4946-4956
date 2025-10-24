'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Restaurant schema
 * - name, description, imageUrl
 * - rating (Number), etaMinutes (Number)
 * - categories (array of strings)
 * - timestamps
 */

const RestaurantSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    rating: { type: Number, default: null },
    etaMinutes: { type: Number, default: null },
    categories: { type: [String], default: [] },
  },
  { timestamps: true }
);

/**
 * PUBLIC_INTERFACE
 * Restaurant model accessor.
 */
const Restaurant =
  mongoose.models.Restaurant || mongoose.model('Restaurant', RestaurantSchema);
module.exports = Restaurant;
