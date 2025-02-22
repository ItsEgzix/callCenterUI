import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  console.log("Middleware triggered for:", request.nextUrl.pathname);
  console.log("Token found:", token);

  const publicPaths = ["/login", "/"];
  if (publicPaths.includes(request.nextUrl.pathname)) {
    console.log("Public path allowed:", request.nextUrl.pathname);
    return NextResponse.next();
  }

  if (!token) {
    console.log("No token found, redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const response = await fetch("https://ai-call-center-o77f.onrender.com/loginRouter/verify", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // If token verification fails, redirect to login
    if (!response.ok) {
      console.log("Token verification failed");
      throw new Error("Token verification failed");
    }

    // Parse the response to get user details
    const data = await response.json();
    const user = data.user;

    console.log("Token verified, allowing access");

    // Clone the request and add user details to headers
    const headers = new Headers(request.headers);
    headers.set("x-user-id", user.id.toString());
    headers.set("x-user-email", user.email);
  

    // Pass the modified request to the next middleware or route
    return NextResponse.next({
      request: {
        headers,
      },
      
    });
    
  } catch (error) {
    console.log("Error during token verification, redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // Exclude static files and API routes
};