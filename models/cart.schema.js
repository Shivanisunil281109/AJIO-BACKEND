
// import mongoose, { model, Schema } from "mongoose";

// const cartSchema = Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "users"
//     },
//     products: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "products"
//         }
//     ]
// });

// const CartSchema = model("carts", cartSchema);

// export default CartSchema;














import mongoose, { model, Schema } from "mongoose";

const cartSchema = Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            quantity: {
                type: Number,
                default: 1,
                min: 1
            },
            selectedSize: {
                type: String,
                default: "M"
            }
        }
    ]
});

const CartSchema = model("carts", cartSchema);

export default CartSchema;
