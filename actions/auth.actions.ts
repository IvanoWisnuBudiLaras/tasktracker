"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_negara_123";

export async function loginAction(email: string, password: string) {
  try {
    // Cari user berdasarkan email
    const userResult = await db.select().from(users).where(eq(users.email, email));
    
    if (userResult.length === 0) {
      return { success: false, message: "Email tidak ditemukan atau password salah." };
    }

    const user = userResult[0];

    // Cek kecocokan password dengan bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, message: "Email tidak ditemukan atau password salah." };
    }

    // Buat JWT token kalau berhasil
    const token = jwt.sign(
      { id: user.id, email: user.email, nama: user.nama },
      JWT_SECRET,
      { expiresIn: "1d" } // Token berlaku 1 hari
    );

    // Simpan token di HTTP-only cookie agar aman
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 hari dalam detik
      path: "/",
    });

    return { success: true, message: "Berhasil login!" };
  } catch (error) {
    console.error("Error saat login:", error);
    return { success: false, message: "Terjadi kesalahan pada server. Coba lagi nanti." };
  }
}
