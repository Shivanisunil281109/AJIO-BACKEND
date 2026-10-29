
import { Router } from "express";
import { getUserProfile, updateUserProfile,updatePassword ,getAllProducts , getProductDetails, addToCart, getCartProducts,  removeFromCart ,updateCartProduct
       , createAddress, getAddresses ,  placeOrder,   getUserOrders,

 } from "../controllers/user.controllers.js";
 import token from "../middleware/authMiddlewares.js";

const UserRouter = Router();

UserRouter.get("/profile", getUserProfile);

UserRouter.put("/profile", updateUserProfile);

UserRouter.put("/update-password", token, updatePassword);

UserRouter.get("/products", getAllProducts);

UserRouter.get("/product-details/:productId", getProductDetails);

// UserRouter.get("/add-to-cart/:productId", token, addToCart);

UserRouter.post("/add-to-cart/:productId", token, addToCart);

UserRouter.get("/get-cart-products", token, getCartProducts);

UserRouter.delete("/remove-from-cart/:productId", token, removeFromCart);

UserRouter.put("/update-cart-product/:productId", token, updateCartProduct);

UserRouter.post("/create-address", token, createAddress);

UserRouter.get("/get-addresses", token, getAddresses);

UserRouter.post("/place-order", token, placeOrder);

UserRouter.get("/get-orders", token, getUserOrders);

export default UserRouter;
