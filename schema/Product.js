const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [3, 'Product name must be at least 3 characters'],
    maxlength: [100, 'Product name cannot exceed 100 characters'],
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: true,
    min: [0.01, 'Price must be at least 0.01'],
    set: v => Math.round(v * 100) / 100 
  },
  category: {
    type: String,
    required: true,
    enum: ['Pizza', 'Sides', 'Drinks', 'Desserts'],
    index: true
  },
  customizationOptions: {
    sizes: {
      type: [String],
      enum: ['Small', 'Medium', 'Large'],
      default: ['Medium']
    },
    crustTypes: {
      type: [String],
      enum: ['Classic', 'Thin Crust', 'Cheese Burst'],
      default: ['Thin Crust']
    },
    toppings: [{
      name: String,
      price: Number
    }],
    extras: {
      extraCheese: { type: Boolean, default: false },
      sugarOptions: [String]
    }
  },
  reviews:[{
    type: mongoose.Schema.Types.ObjectId,
       ref: 'Review',
}],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  imageUrls: [{
    type: String,
   
  }],
  stock: {
    type: Number,
    min: 0,
    default: 0
  },
  available: {
    type: Boolean,
    default: true,
    index: true
  },
  tags: [{
    type: String,
    maxlength: 20
  }],
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
 
},
 {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.index({ category: 1, price: 1 });
productSchema.index({ name: 'text', description: 'text' });

// productSchema.virtual('formattedPrice').get(function() {
//   return `$${this.price.toFixed(2)}`;
// });
// productSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;