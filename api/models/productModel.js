import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // Add category field
  basePrice: { type: Number, required: true },
  historicalSales: [{
    date: Date,
    unitsSold: Number,
    marketingSpend: Number,
    season: String
  }]
  
});
  export const Product = mongoose.model('Product', productSchema);