import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// Note: We import only what we need to verify tokens
import { getAuth } from "firebase-admin/auth";
import { cert, getApps, initializeApp } from "firebase-admin/app";

// Initialize Firebase Admin once
function getFirebaseAdmin() {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

// Route permissions
const routePermissions = {
  // Common routes (Admin, Editor, Viewer)
  commonRoutes: ["/licenses", "/configurations"],

  // Admin-only routes
  adminRoutes: ["/apps", "/features", "/groups", "/languages", "/users"],
};

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("authToken")?.value;
  const path = request.nextUrl.pathname;

  // Check if path is protected
  const isCommonProtected = routePermissions.commonRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  const isAdminProtected = routePermissions.adminRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  // If not protected, allow access
  if (!isCommonProtected && !isAdminProtected) {
    return NextResponse.next();
  }

  // Redirect to homepage if no auth token
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Initialize Firebase if needed and verify token
    const app = getFirebaseAdmin();
    const auth = getAuth(app);

    // Verify the session cookie
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    if (!decodedClaims || !decodedClaims.email) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // For role-based access, you have two options:

    // OPTION 1: Use custom claims in the token (more efficient)
    const userRole = decodedClaims.role || "Viewer"; // Default role

    // OPTION 2: Fetch user data from Firestore (less efficient)
    // This requires the Firestore SDK, which adds overhead
    // This is commented out as it's not as performant for middleware
    /*
    const db = admin.firestore();
    const userDoc = await db.collection("users").doc(decodedClaims.uid).get();
    const userData = userDoc.data();
    const userRole = userData?.role || 'Viewer';
    */

    // Check permissions
    if (isAdminProtected && userRole !== "Admin") {
      return NextResponse.redirect(new URL("/licenses", request.url));
    }

    if (isCommonProtected && !["Admin", "Editor", "Viewer"].includes(userRole)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Pass user info to server components via headers
    const response = NextResponse.next();
    response.headers.set("x-user-email", decodedClaims.email);
    response.headers.set("x-user-role", userRole);

    return response;
  } catch (error) {
    console.error("Authentication error in middleware:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/licenses/:path*",
    "/configurations/:path*",
    "/apps/:path*",
    "/features/:path*",
    "/groups/:path*",
    "/languages/:path*",
    "/users/:path*",
  ],
};
