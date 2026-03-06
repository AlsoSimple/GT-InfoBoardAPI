import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

const createUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const userExists = await prisma.user.findUnique({
            where: { username },
        });

        if (userExists) {
            return res.status(400).json({ message: "Username already taken" });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                username,
                passwordHash,
                mustChangePassword: true,
            },
        });

        res.status(201).json({
            status: "success",
            data: {
                id: user.id,
                username: user.username,
                mustChangePassword: user.mustChangePassword,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("Create user error:", error);
        res.status(500).json({ message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                createdAt: true,
            },
            orderBy: { username: "asc" },
        });

        res.status(200).json({
            status: "success",
            data: users,
        });
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ message: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = req.user;

        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.passwordHash
        );

        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ message: "Current password is incorrect" });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                mustChangePassword: false,
            },
        });

        res.status(200).json({
            status: "success",
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: error.message });
    }
};

export { createUser, getUsers, changePassword };
