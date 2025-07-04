import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();


// /login router
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = {
        userId: user.id.toString(),
        role: user.role,
    }
    const secreat = process.env.JWT_SECRET as string;
    const token = jwt.sign(payload, secreat, { expiresIn: "2h" });
    console.log("logoin!");
    res.json({ token, user: { id: user.id.toString(), email: user.email, role: user.role } });
});

export default router;