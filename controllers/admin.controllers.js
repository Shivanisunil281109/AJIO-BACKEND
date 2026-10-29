
import UserSchema from "../models/users.schema.js";
import ProductSchema from "../models/product.schema.js";

export const getAllSellers = async (req, res) => {
    try {
        const sellers = await UserSchema.find({
            role: "seller"
        }).select("name email mobile isApprovedByAdmin");

        return res.status(200).json({
            success: true,
            sellers
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserSchema.find({
            role: "user"
        }).select("name email");

        return res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error
        });
    }
};

export const approveSeller = async (req, res) => {
    try {
        const { sellerId } = req.body;

        if (!sellerId) {
            return res.status(400).json({
                success: false,
                message: "Seller is required."
            });
        }

        const seller = await UserSchema.findOneAndUpdate(
            { _id: sellerId, role: "seller" },
            { isApprovedByAdmin: true },
            // { new: true }
{ returnDocument: "after" }
        );

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Seller approved."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error
        });
    }
};





export const getAllProducts = async (req, res) => {
    try {
        const products = await ProductSchema.find({});

        return res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error
        });
    }
};


export const approveProduct = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required."
            });
        }

        const product = await ProductSchema.findByIdAndUpdate(
            productId,
            {
                approvedByAdmin: true,
                status: "Approved"
            },
            { returnDocument: "after" }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product approved."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to approve product."
        });
    }
};


export const rejectProduct = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required."
            });
        }

        const product = await ProductSchema.findByIdAndUpdate(
            productId,
            {
                approvedByAdmin: false,
                status: "Rejected"
            },
            { returnDocument: "after" }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product rejected."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to reject product."
        });
    }
};