
import { Router } from "express";
import { getProducts,   createProduct,  getOrders, changePaymentStatus, changeDeliveryStatus} from "../controllers/seller.controllers.js";
import token, { roleValidator } from "../middleware/authMiddlewares.js";


const SellerRouter = Router();

SellerRouter.get("/get-products", getProducts);

SellerRouter.post("/create-product", createProduct);

SellerRouter.get( "/get-orders", token, roleValidator("seller"), getOrders);

SellerRouter.put( "/change-payment-status", token,roleValidator("seller"),changePaymentStatus);

SellerRouter.put( "/change-delivery-status", token,roleValidator("seller"),changeDeliveryStatus);

export default SellerRouter;
