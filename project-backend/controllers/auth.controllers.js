import UserSchema from "../models/users.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";




export const registerController = async (req, res) => {
    try {
        const { name, email, password, mobile, gender, inviteCode, role } = req.body;

        if (!name || !email || !password || !mobile || !gender) {
            return res.status(400).json({
                success: false,
                message: "All required fields are required."
            });
        }

        const isEmailExists = await UserSchema.findOne({ email });

        if (isEmailExists) {
            return res.status(400).json({
                success: false,
                message: "Email already exists. Please login."
            });
        }

        const isMobileExists = await UserSchema.findOne({ mobile });

        if (isMobileExists) {
            return res.status(400).json({
                success: false,
                message: "Mobile number already exists. Please login."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await UserSchema.create({
            name,
            email,
            password: hashedPassword,
            mobile,
            gender,
            inviteCode,
            role
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful.",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                mobile: newUser.mobile,
                gender: newUser.gender,
                role: newUser.role
            }
        });

    } catch (error) {
        console.log(error, "error");

        return res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
};




export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const user = await UserSchema.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please register."
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }



        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token);



        return res.status(200).json({
            success: true,
            message: "Login successful.",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                gender: user.gender,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error, "error");

        return res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
}; 



export const getCurrentUser = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        console.log(error, "error");
        return res.status(500).json({
            error,
            success: false
        });
    }
};



export const logoutController = async (req, res) => {
    try {
        res.clearCookie("token");

        return res.status(200).json({
            success: true,
            message: "Logout successful."
        });
    } catch (error) {
        console.log(error, "error");

        return res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
};