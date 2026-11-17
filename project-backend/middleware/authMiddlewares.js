
import jwt from "jsonwebtoken";
import UserSchema from "../models/users.schema.js";

const token = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await UserSchema.findOne({
            email: decoded.email
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized."
            });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};




export const roleValidator = (role) => {
    return (req, res, next) => {
        const roleFromToken = req.user.role;

        if (roleFromToken !== role) {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        next();
    };
};










export default token;
