
import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    image: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true,
        enum: [
            "clothing",
            "footwear",
            "electronics",
            "kitchen",
            "Beauty",
            "Bags & Backpacks"
        ]
    },

    price: {
        type: Number,
        required: true
    },

    stock: {
        type: Number,
        default: 0
    },

    sellerId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    approvedByAdmin: {
        type: Boolean,
        default: false
    },

    status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
}
});

const ProductSchema = model("products", productSchema);

export default ProductSchema;
