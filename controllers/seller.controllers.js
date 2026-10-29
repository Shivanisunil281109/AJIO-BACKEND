
import ProductSchema from "../models/product.schema.js";

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
