import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "./prisma"

export async function hashPassword(password) {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback-secret", {
    expiresIn: "7d",
  })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "fallback-secret")
  } catch (error) {
    return null
  }
}

export async function getUserFromToken(token) {
  try {
    const decoded = verifyToken(token)
    if (!decoded) return null

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isAdmin: true,
      },
    })

    return user
  } catch (error) {
    return null
  }
}
