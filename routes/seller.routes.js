
import { Router } from "express";
import { getProducts,   createProduct,  getOrders} from "../controllers/seller.controllers.js";
import token, { roleValidator } from "../middleware/authMiddlewares.js";


const SellerRouter = Router();

SellerRouter.get("/get-products", getProducts);

SellerRouter.post("/create-product", createProduct);

SellerRouter.get( "/get-orders", token, roleValidator("seller"), getOrders);

export default SellerRouter;
