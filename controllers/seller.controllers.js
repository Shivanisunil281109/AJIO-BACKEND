
import ProductSchema from "../models/product.schema.js";
import SellerOrderSchema from "../models/sellerOrders.schema.js";

export const getProducts = async (req, res) => {
    try {
        const products = await ProductSchema.find({
            sellerId: req.user._id
        });

        return res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        return res.status(500).json({
            error,
            success: false
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const {
            category,
            description,
            image,
            name,
            price,
            stock
        } = req.body;

        if (
            !category ||
            !description ||
            !image ||
            !name ||
            price == null ||
            stock == null
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        if (req.user.role !== "seller") {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        if (!req.user.isApprovedByAdmin) {
            return res.status(403).json({
                success: false,
                message: "Seller is not approved by admin."
            });
        }

        const sellerId = req.user._id;

        const product = await ProductSchema.create({
            category,
            description,
            image,
            name,
            price,
            stock,
            sellerId
        });

        return res.status(201).json({
            success: true,
            product,
            message: "Product created successfully."
        });
    } catch (error) {
        return res.status(500).json({
            error,
            success: false
        });
    }
};





export const getOrders = async (req, res) => {
    try {
        const sellerId = req.user._id;

        const orders = await SellerOrderSchema.find({
            seller: sellerId
        }).populate("user product seller");

        return res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        return res.status(500).json({
            error,
            success: false
        });
    }
};









export const changePaymentStatus = async (req, res) => {
    try {
        const { orderId, newStatus } = req.body;

        if (!orderId || !["paid", "unpaid"].includes(newStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID or payment status."
            });
        }

        const sellerId = req.user._id;

        const updatedOrder = await SellerOrderSchema.findOneAndUpdate(
            {
                _id: orderId,
                seller: sellerId
            },
            {
                payment_status: newStatus
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        const orders = await SellerOrderSchema.find({
            seller: sellerId
        }).populate("user product");

        return res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error
        });
    }
};












export const changeDeliveryStatus = async (req, res) => {
    try {
        const { orderId, newStatus } = req.body;

        if (!orderId || !["booked", "dispatched", "delivered"].includes(newStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID or delivery status."
            });
        }

        const sellerId = req.user._id;

        const updatedOrder = await SellerOrderSchema.findOneAndUpdate(
            {
                _id: orderId,
                seller: sellerId
            },
            {
                delivery_status: newStatus
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        const orders = await SellerOrderSchema.find({
            seller: sellerId
        }).populate("user product");

        return res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error
        });
    }
};