
import mongoose, { model, Schema } from "mongoose";

const sellerOrderSchema = Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    },

    price: {
        type: Number
    },

    quantity: {
        type: Number,
        default: 1
    },

    address: {
        name: { type: String },
        mobile: { type: String },
        pincode: { type: String },
        locality: { type: String },
        building: { type: String },
        landmark: { type: String },
        city: { type: String },
        state: { type: String },
        addressType: { type: String },
        addressId: { type: String }
    },

    delivery_status: {
        type: String,
        default: "booked",
        enum: ["dispatched", "delivered", "booked"]
    },

    payment_status: {
        type: String,
        default: "unpaid",
        enum: ["paid", "unpaid"]
    }

}, {
    timestamps: true

});

const SellerOrderSchema = model("sellerOrders", sellerOrderSchema);

export default SellerOrderSchema;
