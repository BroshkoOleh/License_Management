import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // Отримуємо доступ до куків
    const cookieStore = await cookies();

    // Видаляємо сесійний токен (встановлюємо дату закінчення в минуле)
    cookieStore.set("authToken", "", {
      expires: new Date(0), // Встановлюємо дату в минулому
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    });

    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
