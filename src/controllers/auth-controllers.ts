import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET || "rahasia";

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser)
    return res.status(400).json({ message: "Email sudah digunakan" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });

  res.json({
    message: "Registrasi berhasil",
    user: { id: user.id, email: user.email },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

  const isPasswordValid = await bcrypt.compare(password, user.password ?? "");
  if (!isPasswordValid)
    return res.status(401).json({ message: "Password salah" });

  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1d" });

  return res.json({ token, user: { id: user.id, email: user.email } });
};
