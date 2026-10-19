import genToken from "../config/token.js";
import User from "../models/user.model.js";

export const googleAuth = async (req, res) => {
    console.log("Incoming Google Auth request:", req.body);

    try {
        const { name, email } = req.body;

        if (!email) {
            console.log("Auth error: Email is missing in request body");

            return res.status(400).json({
                message: "Email is required"
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            console.log("Creating new user:", email);

            user = await User.create({
                name,
                email,
                credits: 100
            });
        } else {
            console.log("Existing user found:", email);
        }

        const token = await genToken(user._id);

        console.log("Token generated for user:", user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        console.log("Auth success for:", email);

        return res.status(200).json(user);

    } catch (error) {
        console.error("Internal Google auth error:", error);

        return res.status(500).json({
            message: `Google auth error ${error.message || error}`
        });
    }
};

export const logOut = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        return res.status(200).json({
            message: "LogOut Successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: `Logout error ${error}`
        });
    }
};