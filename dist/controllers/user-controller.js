"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: 'get current user data SUCCESS',
            user: user,
        });
    }
    catch (error) {
        console.error('Error getting current user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getCurrentUser = getCurrentUser;
