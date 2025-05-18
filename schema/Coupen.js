const mongoose = require("mongoose");
const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  discountType: {
    type: String,
    enum: ["percentage", "flat", "free_shipping"],
    required: true
  },
  discountValue: {
    type: Number,
    default: 0
  },
  maxDiscountAmount: {
    type: Number,
    default: 0
  },
  minPurchaseAmount: {
    type: Number,
    default: 0
  },
  validFrom: {
    type: Date,
    required: true
  },
  validTill: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    default: 1
  },
  usedCount: {
    type: Number,
    default: 0
  },
  usedBy: [
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    usedAt: {
      type: Date,
      default: Date.now
    }
  }
],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Coupon", couponSchema);
