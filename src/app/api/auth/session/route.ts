import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "../../../utils/firebase/firebaseAdmin";
import { cookies } from "next/headers";

// Тривалість сесії - 5 днів (у мілісекундах)
const SESSION_DURATION = 5 * 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    // Отримуємо токен з запиту
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: "ID token is required" }, { status: 400 });
    }

    // Створюємо сесійний куки через Firebase Admin SDK
    const admin = getFirebaseAdmin();
    const sessionCookie = await admin.auth().createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION,
    });

    // Встановлюємо куки
    const cookieStore = await cookies();
    cookieStore.set("authToken", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_DURATION / 1000, // Конвертуємо у секунди
      path: "/",
      sameSite: "strict",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
