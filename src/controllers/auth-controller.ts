import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET || "rahasia";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body

    if (!email || !name || !password) {
      return res.status(400).json({ message: 'Semua field wajib diisi!' })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ message: 'Email sudah terdaftar!' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    res.status(201).json({ message: 'Registrasi berhasil', user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Terjadi kesalahan saat registrasi' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi!' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Password salah' })
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1d' })

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Terjadi kesalahan saat login' })
  }
}
