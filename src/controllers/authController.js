import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return res
                .status(400)
                .json({ message: "Invalid username or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ message: "Invalid username or password" });
        }

        //Generate JWT token
        const token = generateToken(user.id, res);

        res.status(200).json({
            status: "success",
            data: {
                id: user.id,
                username: user.username,
                mustChangePassword: user.mustChangePassword,
            },
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message });
    }
};

const logout = (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({
        status: "success",
        message: "Logged out successfully",
    });
};

export { login, logout };