const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
   mobile: {
    type: String,
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Food item reference is required'],
    unique:true,
    index: true
  },
  productId:{
    type:Schema.Types.ObjectId,
    ref:'Product'
  },
  rating: {
    type: Number,
    required: true,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be a whole number'
    }
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  photos: [{
    type: String,
    validate: {
      validator: v => /\.(jpg|jpeg|png|webp)$/i.test(v),
      message: 'Invalid image format'
    }
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


// reviewSchema.virtual('date').get(function() {
//   return this.createdAt.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   });
// });

// reviewSchema.post('save', async function(doc) {
//   const FoodItem = mongoose.model('FoodItem');
//   await FoodItem.calculateRatingStats(doc.foodItem);
// });

// reviewSchema.post('remove', async function(doc) {
//   const FoodItem = mongoose.model('FoodItem');
//   await FoodItem.calculateRatingStats(doc.foodItem);
// });
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;