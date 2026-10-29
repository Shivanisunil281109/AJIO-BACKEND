
import mongoose, { model, Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },


products: [
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      default: null,
    },
    normalProductId: {
      type: Number,
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    selectedSize: {
      type: String,
      default: "M",
    },
  },
],



    address: {
      name: { type: String, required: true },
      mobile: { type: String, required: true },
      pincode: { type: String, required: true },
      locality: { type: String, required: true },
      building: { type: String, required: true },
      landmark: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      addressType: {
        type: String,
        enum: ["Home", "Work", "Others"],
        default: "Home",
      },
      addressId: {
        type: String,
        required: true,
      },
    },

    delivery_status: {
      type: String,
      default: "booked",
      enum: ["dispatched", "delivered", "booked"],
    },

    payment_status: {
      type: String,
      default: "unpaid",
      enum: ["paid", "unpaid"],
    },


    paymentMode: {
  type: String,
  default: "Not specified",
},

    total_price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const OrderSchema = model("orders", orderSchema);

export default OrderSchema;
